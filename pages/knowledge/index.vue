<template>
    <div class="px-2 py-2">
        <div class="flex items-center py-2">
            <span>当前工作区：</span>
            <UInputMenu v-model="currentWorkspace" class="w-1/6" 
                option-attribute="name" 
                :options="workspaces" 
                @change="handleWorkspaceChange"
            />
        </div>
        <UForm class="space-y-4" :state="state" @submit="onSubmit">
            <UFormGroup class="space-x-2" label="上传文件" name="file">
                <UInput class="w-80" type="file" @change="handleFileChange" accept=".txt" />
                <p class="my-2">{{ state?.file?.name }}</p>
                <UTextarea class="w-3/6" disabled :rows="5" :model-value="state.fileContext" />
            </UFormGroup>
            <UFormGroup>
                <UButton type="submit">上传</UButton>
            </UFormGroup>
        </UForm>

        <div>文档列表</div>
        <UTable :columns="documentColumns" :rows="rows">
            <template #action-data="{ row }">
                <UButton class="mr-1" :loading="loading.embedding" @click="handleEmbedding(row)">加入知识库</UButton>
                <UButton color="red" @click="handleDocumentDelete(row)">删除</UButton>
            </template>
        </UTable>

        <div>向量列表</div>
        <UTable :columns="vectorColumns" :rows="vectorList">
            <template #action-data="{ row }">
                <!-- <UButton class="mr-1" @click="handleEmbedding(row)">加入知识库</UButton> -->
                <UButton color="red" @click="handleVectorDelete(row)">删除</UButton>
            </template>
        </UTable>
    </div>
</template>

<script setup lang="ts">
import { createID } from '~/common/utils';
import type { FormSubmitEvent } from '#ui/types'
definePageMeta({
    // layout: false
})

const { $trpc } = useNuxtApp()

export interface State {
    file?: File,
    fileContext: string | number
}

const workspaces = ref<any[]>([])
const currentWorkspace = ref<any>(undefined)

const loading = reactive({
    upload: false,
    embedding: false,
    docDel: false,
    vecDel: false,
})

const state = ref<State>({
    file: undefined,
    fileContext: ''
})

const documentColumns = [
    {
        key: 'docId',
        label: '文档ID',
    }, {
        key: 'filename',
        label: '文档名称'
    }, {
        key: 'workspaceId',
        label: '工作区Id'
    }, {
        key: 'createdAt',
        label: '创建时间'
    },
    {
        key: 'action',
        label: '操作'
    }
]

const vectorColumns = [
    {
        key: 'vectorId',
        label: '向量ID'
    }, {
        key: 'filename',
        label: '所属文档'
    },{
        key: 'document',
        label: '文档内容'
    },
    {
        key: 'action',
        label: '操作'
    }
]

const rows = ref<any[]>([])
const vectorList = ref<any[]>([])

onMounted(async () => {
    await listWorkspace()
    listDocument()
    listVectors()
    
    // console.log(await $trpc.totalVectors.query({}))
})

const onSubmit = (evt: FormSubmitEvent<State>) => {
    const { file } = evt.data
    if(!file) {
        useToast().add({ title: '请选择文件', color: 'yellow'})
        return
    }
    const { name, result } = file as any
    const documents = {
        docId: createID(),
        filename: name,
        docpath: result.url,
        metadata: JSON.stringify({
            name, url: result.url, content: state.value.fileContext
        }),
        workspaceId: 4
    }

    $trpc.createDocument.mutate(documents)
        .then((res) => {
            listDocument()
        })
    
}

const handleFileChange = async (fileList: FileList) => {
    if(!fileList.length) return 
    const file = fileList[0]
    state.value.file = file
    const formData = new FormData()
    formData.append('file', file)

    $fetch('/gw/api/oss/documents', {
        method: 'post',
        body: formData
    }).then((res: any) => {
        (file as any).result = res.result
    }).catch(() => {
        (file as any).result = {
            url: '/api/oss/documents/123.txt'
        }
    }).finally(async () => {
        state.value.fileContext = await file.text()
    })
}
const listWorkspace = async () => {
    const {data} = await $trpc.listWorkspace.query({})
    workspaces.value = data
    if(!currentWorkspace.value && data.length) {
        currentWorkspace.value = data[0]
    }
}
const listDocument = async () => {
    const res = await $trpc.listDocument.query({
        workspaceId: currentWorkspace.value.id || null
    })
    rows.value = res
}
const listVectors = async () => {
    try {
        const data = await $trpc.listVectors.query({
            namespace: currentWorkspace.value.slug
        })
        console.log(data)
        const list = []
        for(let i=0, len=data.ids.length; i < len; i++) {
            list.push({
                vectorId: data.ids[i],
                document: data.documents[i],
                ...data.metadatas[i]
            })
        }
        vectorList.value = list
    } catch(err) {
        vectorList.value = []
    }
    
}
const handleEmbedding = async (row: any) => {
    try {
        loading.embedding = true
        await $trpc.embeddingDocument.mutate({ id: row.id })
        listDocument()
        listVectors()
    } finally {
        loading.embedding = false
    }
    
}
const handleDocumentDelete = async (row: any) => {
    await $trpc.deleteDocument.mutate({ ids: [row.id]})
    listDocument()
}

const handleVectorDelete = async (row: any) => {
    await $trpc.deleteVectors.mutate({ namespace: currentWorkspace.value.slug, ids: [row.vectorId]})
    listVectors()
}



const handleWorkspaceChange = (workspace: any) => {
    listDocument();
    listVectors()
}

</script>