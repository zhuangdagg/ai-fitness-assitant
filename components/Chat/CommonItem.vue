<template>
    <li class="flex items-start rounded-md my-2 py-2" :class="userLiClass" >
        <div>
            <UAvatar :src="isUser ? '/user.jpeg' : '/akjs.png'" />
        </div>
        <div class="mx-2 p-2 rounded-md" :class="userClass">
            <ChatMarkdownIt v-if="!value.loading" :content="value.content" />
            <!-- <span v-if="!value.loading">{{ `${value.content}` }}</span> -->
            <div v-else class="w-40">{{ '思考中' + waitTip.dot }}</div>
        </div>
        <div class="invisible">
            <UAvatar src="/akjs.png" />
        </div>
    </li>
</template>

<script setup lang="ts">
const props = defineProps<{
    value: {
        role: 'user'|'assistant'|'system',
        content: string,
        loading?: boolean,
    }
}>()

const waitTip = reactive<{
    timer: any,
    dot: string,
}>({
    timer: null,
    dot: ''
})

const isUser = computed(() => {
    return props.value.role === 'user'
})

watchEffect(() => {
    clearInterval(waitTip.timer)
    waitTip.timer = null
    waitTip.dot = ''
    if(props.value.loading) {
        waitTip.timer = setInterval(() => {
            waitTip.dot.length >= 3 ? waitTip.dot = '' : waitTip.dot += '.'
        }, 400)
    }
})

const userLiClass = computed(() => {
    if(isUser.value) {
        return [
            'flex-row-reverse',
            
            // 'space-x-4'
        ]
    }
    return ''
})

const userClass = computed(() => {
    if(props.value.role === 'user') {
        return ['bg-green-300',
            'dark:bg-green-600']
    }
    return [
    'bg-slate-300', 'dark:bg-slate-600'
    ]
})
</script>