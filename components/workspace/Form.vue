<template>
    <BasicModal :title="isEdit ? '编辑': '新增' + '工作区'" @confirm="handleConfirm" @cancel="handleCancel">
        <UForm ref="formRef" class="space-y-4" :schema="schema" :state="state" @submit="onSubmit">
            <UFormGroup v-if="isEdit" label="工作区ID">
                <UInput :disabled="true" :model-value="state.id" />
            </UFormGroup>
            <UFormGroup label="工作区名称" name="name">
                <UInput v-model="state.name" />
            </UFormGroup>
            <UFormGroup label="工作区标识" name="slug">
                <UInput :disabled="isEdit" v-model="state.slug" />
            </UFormGroup>
            <template v-if="isEdit">
                <UFormGroup label="对话模式">
                    <USelect v-model="state.chatMode" :options="chatOptions" option-attribute="name"/>
                </UFormGroup>
                <UFormGroup label="历史条数">
                    <UInput type="number" v-model="state.openAiHistory" />
                </UFormGroup>
            </template>
        </UForm>
    </BasicModal>
</template>

<script setup lang="ts">
import { workspaceValidate } from '~/common/validate/llm';
import type { FormSubmitEvent } from '#ui/types'
import BasicModal from '../Modal/BasicModal.vue';

const props = withDefaults(defineProps<{
    isEdit?: boolean,
    origin?: Record<string, any>
}>(), {
    isEdit: false,
    origin: undefined
})

// const isOpen = ref(true)

const formRef = ref()

const emit = defineEmits(['success', 'error'])
const { $trpc } = useNuxtApp()

const state = ref<any>({
    name: '',
    slug: ''
})
onMounted(() => {
    if(props.isEdit) {
        state.value = {
            ...state.value,
            ...(props.origin || {})
        }
    }
})
const schema = workspaceValidate

const chatOptions = [
    {
        name: '聊天',
        value: 'chat',
    },{
        name:'查询',
        value: 'query'
    },
]

const onSubmit = async (evt: FormSubmitEvent<typeof schema>) => {
    console.log(evt.data)
    $trpc?.[props.isEdit ? 'editWorkspace': 'createWorkspace'].mutate(evt.data as any)
        .then((res) => {
            useToast().add({ title: '操作成功' })
            formRef.value.clear()
            emit('success')
        })
        .catch((err) => {
            console.log(err)
            useToast().add({ color: 'red', title: '操作失败', description: err.data.code, icon: 'i-material-symbols:chat-error-outline-sharp' })
            emit('error')
        })
}

const handleConfirm = () => {
    formRef.value.submit()
}

const handleCancel = () => {
    formRef.value.clear()
}
</script>