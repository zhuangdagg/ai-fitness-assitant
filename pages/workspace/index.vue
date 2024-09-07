<template>
    <main>
        <h1>Workspace</h1>
        <h2>Create workspace</h2>
        <WorkspaceForm class="max-w-sm" @success="onSuccess" />
        <h2>Workspace List</h2>
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
            <UFormGroup class="px-4 flex flex-1 justify-end">
                <UButton color="red" size="sm" @click="() => handleDelete()">批量删除</UButton>
            </UFormGroup>    
        </UForm>
        <UTable v-model="selectedRow" :columns="columns" :rows="rows">
            <template #action-data="{ row }">
                <UButton color="red" @click="handleDelete(row)">删除</UButton>
            </template>
        </UTable>
    </main>
</template>

<script setup lang="ts">
const { $trpc } = useNuxtApp()
const rows = ref<any[]>([])
const selectedRow = ref<any[]>([])
const filterForm = ref({
    id: null,
    name: '',
    slug: ''
})
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
        key: 'createdAt',
        label: '创建时间'
    }, {
        key: 'action',
        label: '操作'
    }
]
const listWorkspace = () => {
    selectedRow.value = []
    $trpc.listWorkspace.query(filterForm.value).then((res) => {
        console.log({ res })
        rows.value = res
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