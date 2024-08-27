<template>
    <div>
        <input type="text" v-model="question" />
        <input type="submit" @click="handleQuestion"/>
    </div>
    <ul>
        <li v-for="item in history">
            {{ `${item.role}: ${item.content}` }}
        </li>
    </ul>
</template>

<script setup lang="ts">


const question = ref<string>('')

const history = ref<any[]>([
    { role: 'sys', content: '我是Qwen2，请向我提问吧！'}
])

const handleQuestion = async () => {
    const userQuestion = {
        role: 'user',
        content: unref(question)
    }
    history.value.push(userQuestion)
    const { data } = await useLLMChat(userQuestion as any)

    console.log({ data })
    history.value.push(unref(data))
}

</script>