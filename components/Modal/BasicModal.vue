<template>
    <UModal v-bind="$attrs" ref="modalRef">
        <section class="flex flex-col min-h-40">
            <header class="border-b-2 px-4 py-2 bg-slate-400 rounded-t-md">
                <h1>{{ description || $slots.default ? title : '提示'}}</h1>
            </header>
            <section class="px-4 py-2 divide-y-2 flex-1 flex items-center text-slate-500">
                <slot>
                    {{ description || title }}
                </slot>
            </section>
            <footer class="px-4 py-2 text-right" >
                <UButton class="mr-2" size="xs" @click="handleConfirm">{{confirmBtnLabel}}</UButton>
                <UButton color="gray" size="xs" @click="handleCancel">{{ cancelBtnLabel }}</UButton>
            </footer>
        </section>
    </UModal>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    title: string
    description?: string
    confirmBtnLabel?: string
    cancelBtnLabel?: string
}>(), {
    title: '提示',
    confirmBtnLabel: '确定',
    cancelBtnLabel: '取消'
})

const emit = defineEmits(['confirm', 'cancel'])
const modalRef = ref()

const handleConfirm = () => {
    emit('confirm')
}
const handleCancel = () => {
    emit('cancel')
    modalRef.value.close()
}

defineExpose({
    modalRef
})
</script>