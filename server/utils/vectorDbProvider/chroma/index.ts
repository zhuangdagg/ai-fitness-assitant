import { ChromaClient } from "chromadb";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import { TextSplitter } from "../../TextSplitter";

const COLLECTION_REGEX = new RegExp(
  /^(?!\d+\.\d+\.\d+\.\d+$)(?!.*\.\.)(?=^[a-zA-Z0-9][a-zA-Z0-9_-]{1,61}[a-zA-Z0-9]$).{3,63}$/
);

export const Chroma = {
  name: "Chroma",

  // Chroma DB has specific requirements for collection names:
  // (1) Must contain 3-63 characters
  // (2) Must start and end with an alphanumeric character
  // (3) Can only contain alphanumeric characters, underscores, or hyphens
  // (4) Cannot contain two consecutive periods (..)
  // (5) Cannot be a valid IPv4 address
  // We need to enforce these rules by normalizing the collection names
  // before communicating with the Chroma DB.
  normalize: function (inputString: string) {
    if (COLLECTION_REGEX.test(inputString)) return inputString;
    let normalized = inputString.replace(/[^a-zA-Z0-9_-]/g, "-");

    // Replace consecutive periods with a single period (if any)
    normalized = normalized.replace(/\.\.+/g, ".");

    // Ensure the name doesn't start with a non-alphanumeric character
    if (normalized[0] && !/^[a-zA-Z0-9]$/.test(normalized[0])) {
      normalized = "anythingllm-" + normalized.slice(1);
    }

    // Ensure the name doesn't end with a non-alphanumeric character
    if (
      normalized[normalized.length - 1] &&
      !/^[a-zA-Z0-9]$/.test(normalized[normalized.length - 1])
    ) {
      normalized = normalized.slice(0, -1);
    }

    // Ensure the length is between 3 and 63 characters
    if (normalized.length < 3) {
      normalized = `anythingllm-${normalized}`;
    } else if (normalized.length > 63) {
      // Recheck the norm'd name if sliced since its ending can still be invalid.
      normalized = this.normalize(normalized.slice(0, 63));
    }

    // Ensure the name is not an IPv4 address
    if (/^\d+\.\d+\.\d+\.\d+$/.test(normalized)) {
      normalized = "-" + normalized.slice(1);
    }

    return normalized;
  },

  ollamaEmbeddingFunction: {
    client: new OpenAI({
      baseURL: "http://localhost:11434/v1",
      apiKey: "Empty",
    }),
    async generate(input: string[]) {
      const { data } = await this.client.embeddings.create({
        input,
        model: "nomic-embed-text",
      });
      if (data && data.length) {
        return data.map((item) => item.embedding);
      }
    },
  },

  connect: async function () {
    const client = new ChromaClient();

    const isAlive = await client.heartbeat();
    if (!isAlive)
      throw new Error(
        "ChromaDB::Invalid Heartbeat received - is the instance online?"
      );
    return { client };
  },

  heartbeat: async function () {
    const { client } = await this.connect();
    return { heartbeat: await client.heartbeat() };
  },

  totalVectors: async function () {
    const { client } = await this.connect();
    const collections = await client.listCollections();
    let totalVectors = 0;
    for (const collectionObj of collections) {
      const collection = await client
        .getCollection({ name: collectionObj.name })
        .catch(() => null);
      if (!collection) continue;
      totalVectors += await collection.count();
    }
    return totalVectors;
  },
  distanceToSimilarity: function (distance: any) {
    if (distance === null || typeof distance !== "number") return 0.0;
    if (distance >= 1.0) return 1;
    if (distance <= 0) return 0;
    return 1 - distance;
  },
  namespaceCount: async function (_namespace: string = "") {
    const { client } = await this.connect();
    const namespace = await this.namespace(client, this.normalize(_namespace));
    return namespace?.vectorCount || 0;
  },
  namespace: async function (client: ChromaClient, namespace?: string) {
    if (!namespace) throw new Error("No namespace value provided.");
    const collection = await client
      .getCollection({ name: this.normalize(namespace) })
      .catch(() => null);
    if (!collection) return null;

    return {
      ...collection,
      vectorCount: await collection.count(),
    };
  },
  hasNamespace: async function (namespace: string = "") {
    if (!namespace) return false;
    const { client } = await this.connect();
    return await this.namespaceExists(client, this.normalize(namespace));
  },
  namespaceExists: async function (
    client: ChromaClient,
    namespace: string = ""
  ) {
    if (!namespace) throw new Error("No namespace value provided.");
    const collection = await client
      .getCollection({ name: this.normalize(namespace) })
      .catch((e) => {
        console.error("ChromaDB::namespaceExists", e.message);
        return null;
      });
    return !!collection;
  },
  deleteVectorsInNamespace: async function (
    client: ChromaClient,
    namespace: string = ""
  ) {
    await client.deleteCollection({ name: this.normalize(namespace) });
    return true;
  },
  deleteDocumentFromNamespace: async function (
    namespace: string,
    docId: string
  ) {
    // const { DocumentVectors } = require("../../../models/vectors");
    // const { client } = await this.connect();
    // if (!(await this.namespaceExists(client, namespace))) return;
    // const collection = await client.getCollection({
    //   name: this.normalize(namespace),
    // });
    // const knownDocuments = await DocumentVectors.where({ docId });
    // if (knownDocuments.length === 0) return;
    // const vectorIds = knownDocuments.map((doc) => doc.vectorId);
    // await collection.delete({ ids: vectorIds });
    // const indexes = knownDocuments.map((doc) => doc.id);
    // await DocumentVectors.deleteIds(indexes);
    // return true;
  },
  "namespace-stats": async function (reqBody: Record<string, any> = {}) {
    const { namespace = null } = reqBody;
    if (!namespace) throw new Error("namespace required");
    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, this.normalize(namespace))))
      throw new Error("Namespace by that name does not exist.");
    const stats = await this.namespace(client, this.normalize(namespace));
    return stats
      ? stats
      : { message: "No stats were able to be fetched from DB for namespace" };
  },
  "delete-namespace": async function (reqBody: Record<string, any> = {}) {
    const { namespace = "" } = reqBody;
    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, this.normalize(namespace))))
      throw new Error("Namespace by that name does not exist.");

    const details = await this.namespace(client, this.normalize(namespace));
    await this.deleteVectorsInNamespace(client, this.normalize(namespace));
    return {
      message: `Namespace ${namespace} was deleted along with ${details?.vectorCount} vectors.`,
    };
  },
  reset: async function () {
    const { client } = await this.connect();
    await client.reset();
    return { reset: true };
  },
  curateSources: function (sources: any[] = []) {
    const documents = [];
    for (const source of sources) {
      const { metadata = {} } = source;
      if (Object.keys(metadata).length > 0) {
        documents.push({
          ...metadata,
          ...(source.hasOwnProperty("pageContent")
            ? { text: source.pageContent }
            : {}),
        });
      }
    }

    return documents;
  },

  similarityResponse: async function () {},

  search: async function ({
    namespace,
    input,
    similarityThreshold = 0.25,
    topN = 4,
    filterIdentifiers = [],
  }: {
    namespace: string;
    input: string;
    similarityThreshold: number;
    topN: number;
    filterIdentifiers: any[];
  }) {
    if (!namespace || !input)
      throw new Error("Invalid request to performSimilaritySearch.");

    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, this.normalize(namespace)))) {
      return {
        contextTexts: [],
        sources: [],
        message: "Invalid query - no documents found for workspace!",
      };
    }
    const collection = await client.getCollection({
      name: this.normalize(namespace),
    });

    const result: {
      contextTexts: any[];
      sourceDocuments: any[];
      scores: any[];
    } = {
      contextTexts: [],
      sourceDocuments: [],
      scores: [],
    };

    const response = await collection.query({
      queryTexts: input,
      nResults: topN,
    });

    response.ids[0].forEach((_, i) => {
      if (
        this.distanceToSimilarity(response.distances?.[0]?.[i]) <
        similarityThreshold
      )
        return;

      if (filterIdentifiers.includes(uuidv4())) {
        console.log(
          "Chroma: A source was filtered from context as it's parent document is pinned."
        );
        return;
      }
      result.contextTexts.push(response.documents[0][i]);
      result.sourceDocuments.push(response.metadatas[0][i]);
      result.scores.push(this.distanceToSimilarity(response.distances?.[0][i]));
    });

    return result;
  },
  addDocumentToNamespace: async function ({
    namespace,
    documentData = {},
    fullFilePath = null,
    skipCache = false,
  }: {
    namespace: string;
    documentData: Partial<{
      pageContent: any;
      docId: string;
      [k: string]: any;
    }>;
    fullFilePath: string | null;
    skipCache: boolean;
  }) {
    try {
      const { pageContent, docId, ...metadata } = documentData;

      const textSplitter = new TextSplitter({
        chunkSize: TextSplitter.determineMaxChunkSize(1000),
        chunkOverlap: 20,
        chunkHeaderMeta: {
          sourceDocument: metadata?.title,
          published: metadata?.published || "unknown",
        },
      });

      const textChunks = await textSplitter.splitText(pageContent);
      const submission: any = {
        ids: [],
        metadatas: [],
        documents: [],
      };
      if (!!textChunks && textChunks.length > 0) {
        for (const [i, chunk] of textChunks.entries()) {
          const chunkRecord = {
            id: uuidv4(),
            values: chunk,
            // [DO NOT REMOVE]
            // LangChain will be unable to find your text if you embed manually and dont include the `text` key.
            // https://github.com/hwchase17/langchainjs/blob/2def486af734c0ca87285a48f1a04c057ab74bdf/langchain/src/vectorstores/pinecone.ts#L64
            metadata: { ...metadata, text: textChunks[i] },
          };

          submission.ids.push(chunkRecord.id);
          //   submission.embeddings.push(vectorRecord.values);
          submission.metadatas.push(metadata);
          submission.documents.push(textChunks[i]);
        }
      } else {
        throw new Error(
          "Could not embed document chunks! This document will not be recorded."
        );
      }

      const { client } = await this.connect();
      const collection = await client.getOrCreateCollection({
        name: this.normalize(namespace),
        metadata: { "hnsw:space": "cosine" },
      });
      const additionResult = await collection.add(submission);
      if (!additionResult)
        throw new Error("Error embedding into ChromaDB", additionResult);
      return { vectorized: true, error: null };
    } catch (e: any) {
      console.error("addDocumentToNamespace", e.message);
      return { vectorized: false, error: e.message };
    }
  },
};
