<template>
    <li class="flex items-start rounded-md my-2 py-2" :class="userLiClass" >
        <div>
            <UAvatar :src="isUser ? '/user.jpeg' : '/akjs.png'" />
        </div>
        <div class="mx-2 bg-slate-300 dark:bg-slate-600 p-2 rounded-md" :class="userClass">
            {{ `${value.content}` }}
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
        content: string
    }
}>()

const isUser = computed(() => {
    return props.value.role === 'user'
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
    if(isUser.value) {
        return ['bg-slate-100 dark:bg-slate-700']
    }
    return ''
})
</script>