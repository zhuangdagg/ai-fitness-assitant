<template>
    <div class="custom flex flex-col p-4 rounded-xl max-h-full h-full space-y-2">
        <ul class="flex-1 rounded-xl overflow-y-auto">
            <ChatCommonItem v-for="(item, index) in history" :key="index" :value="item" />
        </ul>
        <ChatInput :submitHandler="submitHandler" />
    </div>
</template>

<script setup lang="ts">
import { StorageKey } from '~/composables/useStorage';



const question = ref<string>('')
const modelVisible = ref<boolean>(false)
const flag = reactive({
    isNewAnswer: false
})

const history = ref<any[]>([
    { role: 'system', content: '我是健身教练AK，请向我提问吧！'},
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

    const answer = {
        role: 'assistant',
        content: '',
        loading: true
    }
    history.value.push(userQuestion, answer)
    await createEventSource()
    await useLLMChat(history.value as any)
    return true
}

const createEventSource = () => {
    return new Promise<EventSource>((resolve, reject) => {
        const source = new EventSource('/api/sse/123', { withCredentials: false })

        source.onmessage = (evt) => {
            const answer = history.value[history.value.length - 1]
            if(answer.loading) {
                answer.loading = false
            }
            answer.content += evt.data
        }
        source.onerror = (evt) => {
            source.close()
            useStorage(StorageKey.chat_history).save(history.value)
            reject(source)
        }
        resolve(source)
    })
    
}

const getHistory = () => {
    const val = useStorage(StorageKey.chat_history).get()
    if(val) {
        history.value = val
    }
}

onMounted(() => {
    // acceptAnswer()
    getHistory()
})


</script>

<style>
.custom {
    height: calc(100vh - 58px);
}
</style>