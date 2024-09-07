<template>
    <UForm class="space-y-4" :schema="schema" :state="state" @submit="onSubmit">
        <UFormGroup label="工作区名称" name="name">
            <UInput v-model="state.name" />
        </UFormGroup>
        <UFormGroup label="工作区标识" name="slug">
            <UInput v-model="state.slug" />
        </UFormGroup>
        <UButton type="submit">新 增</UButton>
    </UForm>
</template>

<script setup lang="ts">
import { workspaceValidate } from '~/common/validate/llm';
import type { FormSubmitEvent } from '#ui/types'

const emit = defineEmits(['success', 'error'])
const { $trpc } = useNuxtApp()

const state = reactive({
    name: '',
    slug: ''
})
const schema = workspaceValidate

const onSubmit = async (evt: FormSubmitEvent<typeof schema>) => {
    console.log(evt.data)
    $trpc.createWorkspace.mutate(evt.data as any)
        .then((res) => {
            useToast().add({ title: '新增成功' })
            state.name = ''
            state.slug = ''
            emit('success')
        })
        .catch((err) => {
            console.log(err)
            useToast().add({ color: 'red', title: '新增失败', description: err.data.code, icon: 'i-material-symbols:chat-error-outline-sharp' })
            emit('error')
        })
}
</script>