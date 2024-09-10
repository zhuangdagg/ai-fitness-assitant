
import { Readable } from 'node:stream'
import { OpenAI} from 'openai'
import type { Stream } from 'openai/streaming'
// Some models have lower restrictions on chars that can be encoded in a single pass
// and by default we assume it can handle 1,000 chars, but some models use work with smaller
// chars so here we can override that value when embedding information.
function maximumChunkLength() {
    const len = Number(process.env.EMBEDDING_MODEL_MAX_CHUNK_LENGTH)
    if (
      !!len &&
      !isNaN(len) &&
      len > 1
    )
      return len;
  
    return 1_000;
}

export function createReadable(chatCompletion: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>) {
  async function* sse() {
      for await(const chunk of chatCompletion) {
          yield `data:${chunk.choices[0]?.delta?.content || ''}\n\n`
      }
  }
  return Readable.from(sse())
}


export * from './event'