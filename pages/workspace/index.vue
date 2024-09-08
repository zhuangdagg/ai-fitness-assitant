<template>
    <main class="p-2 space-y-6 divide-y-2">
        <UForm :state="filterForm" class="flex space-x-4" @submit="listWorkspace">
            <UFormGroup class="flex items-center" label="工作区ID：">
                <UInput type="number" v-model="filterForm.id" />
            </UFormGroup>
            <UFormGroup class="flex items-center" label="工作区名称：">
                <UInput v-model="filterForm.name" />
            </UFormGroup>
            <UFormGroup class="flex items-center" label="slug：">
                <UInput v-model="filterForm.slug" />
            </UFormGroup>
            <UButton type="submit" size="sm">查 找</UButton>
            <UFormGroup class="flex flex-1 justify-end">
                <UButton class="mr-2" size="sm" @click="handleAdd">新增</UButton>
                <UButton :disabled="!selectedRow.length" color="red" size="sm" @click="() => handleDelete()">批量删除</UButton>
            </UFormGroup>    
        </UForm>
        <UTable v-model="selectedRow" :loading="loading" :columns="columns" :rows="rows">
            <template #action-data="{ row }">
                <UButton class="mr-1" @click="handleEdit(row)">编辑</UButton>
                <UButton color="red" @click="handleDelete(row)">删除</UButton>
            </template>
        </UTable>
        <div v-show="page.total" class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
            <UPagination v-model="page.index" :page-count="page.size" :total="page.total" />
        </div>
    </main>
</template>

<script setup lang="ts">
import { WorkspaceForm } from '#components'
const { $trpc } = useNuxtApp()
const rows = ref<any[]>([])
const loading = ref<boolean>(false)
const selectedRow = ref<any[]>([])
const filterForm = ref({
    id: undefined,
    name: '',
    slug: ''
})

const page = reactive({
    index: 1,
    size: 10,
    total: 0
})

const modal = useModal()

const columns = [
    {
        key: 'id',
        label: 'ID'
    },
    {
        key: 'name',
        label: '工作区名称'
    },
    {
        key: 'slug',
        label: 'Slug'
    },
    {
        key: 'chatMode',
        label: '对话模式'
    },
    {
        key: 'openAiHistory',
        label: '上下文联系数'
    },
    {
        key: 'createdAt',
        label: '创建时间'
    }, {
        key: 'action',
        label: '操作'
    }
]
const listWorkspace = () => {
    selectedRow.value = []
    loading.value = true
    $trpc.listWorkspace.query(filterForm.value).then(({ data, total }) => {
        rows.value = data
        page.total = total
    })
    .finally(() => {
        loading.value = false
    })
}

const handleAdd = () => {
    modal.open(WorkspaceForm, {
        onSuccess:() => {
            modal.close()
            listWorkspace()
        }
    })
}

const handleEdit = (row?: any) => {
    modal.open(WorkspaceForm, {
        isEdit: true,
        origin: row,
        onSuccess:() => {
            modal.close()
            listWorkspace()
        }
    })
}

const handleDelete = (row?: any) => {
    let rows = row ? [row] : selectedRow.value
    if(!rows.length) {
        return
    }
    $trpc.deleteWorkspace.mutate({
        ids: rows.map(row => row.id)
    }).then(() => {
        useToast().add({ title: `${rows.map(r => r.name).join(',')}已删除`})
        listWorkspace()
    })
}

const onSuccess = () => {
    listWorkspace()
}

onMounted(() => {
    listWorkspace()
})
</script>