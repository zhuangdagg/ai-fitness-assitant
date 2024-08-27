<template>
    <div>
        home
        <span>{{ data }}</span>
        <button @click="onChat">chat</button>
        <div>llm:</div>
        <div>{{ chatRes }}</div>
        <RouterLink to="/chat"> to chat</RouterLink>
    </div>
</template>

<script setup lang="ts">

definePageMeta({

})

// const { data } = await useFetch('/api/test')

const query = gql`
    query getName {
        getName
    }
`
const variables = { }
// const { data } = await useAsyncQuery(query)

// const { data } = await $trpc.test.useQuery({ text: 'client' })
const {data, error } = await useTest()

console.log(data.value, '--data')

const chatRes = ref<any>(null)

const onChat = async () => {
}
</script>