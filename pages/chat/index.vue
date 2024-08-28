<template>
    <div>
        <UInput type="text" v-model="question" />
        <UButton @click="handleQuestion">提交</UButton>
        <UButton @click="handlePrisma">test prisma</UButton>
    </div>
    <ul class="text-current">
        <li v-for="item in history">
            {{ `${item.role}: ${item.content}` }}
        </li>
    </ul>
    <UModal v-model="modelVisible">
        <div class="h-52 flex justify-center align-middle" />
    </UModal>
</template>

<script setup lang="ts">


const question = ref<string>('')
const modelVisible = ref<boolean>(true)

const history = ref<any[]>([
    { role: 'sys', content: '我是Qwen2，请向我提问吧！'}
])

defineShortcuts({
    ctrl_k: {
        usingInput: true,
        handler: () => {
            modelVisible.value = !modelVisible.value
        }
    }
})

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

const handlePrisma = () => {}

</script>