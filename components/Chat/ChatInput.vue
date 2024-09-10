<template>
    <div class="flex items-start border-2 p-2 rounded-xl">
        <UTextarea
            class="flex-1"
            v-model="question"
            :padded="false"
            :placeholder="placeholder"
            variant="none"
            @keydown.enter.native="handleSubmit"
        ></UTextarea>
        <UButton :disabled="submiting" size="xl" icon="i-tabler:send" variant="link" @click="handleSubmit" />
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    placeholder?: string,
    submitHandler: (question: string) => Promise<boolean>
}>(), {
    placeholder: '请输入你的提问',

})

const question = ref<string>('')
const submiting = ref<boolean>(false)

const handleSubmit = () => {
    submiting.value = true
    props.submitHandler(question.value)
        .then(() => {
            
        })
        .finally(() => {
            submiting.value = false
        })
    question.value = ''
}
</script>