<template>
    <div class="custom flex flex-col p-4 rounded-xl max-h-full h-full space-y-2">
        <ul class="flex-1 rounded-xl overflow-y-auto">
            <ChatCommonItem v-for="(item, index) in history" :key="index" :value="item" />
        </ul>
        <ChatInput :submitHandler="submitHandler" />
    </div>
</template>

<script setup lang="ts">


const question = ref<string>('')
const modelVisible = ref<boolean>(false)

const history = ref<any[]>([
    { role: 'sys', content: '我是Qwen2，请向我提问吧！'},
])

defineShortcuts({
    ctrl_k: {
        usingInput: true,
        handler: () => {
            modelVisible.value = !modelVisible.value
        }
    }
})

const submitHandler = async (question: string) => {
    const userQuestion = {
        role: 'user',
        content: unref(question)
    }
    history.value.push(userQuestion)
    const { data } = await useLLMChat(userQuestion as any)

    console.log({ data })
    history.value.push(unref(data))
    return true
}


</script>

<style>
.custom {
    height: calc(100vh - 58px);
}
</style>