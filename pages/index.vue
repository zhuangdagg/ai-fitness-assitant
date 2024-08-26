<template>
    <div>
        home
        <span>{{ data }}</span>
    </div>
</template>

<script setup lang="ts">
const { $trpc } = useNuxtApp()
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

const { data } = await $trpc.test.useQuery({ text: 'client '})

console.log(data.value, '--data')
</script>