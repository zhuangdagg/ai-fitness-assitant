<template>
    <div>
        home
        <span>{{ data }}</span>
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
const { data } = await useAsyncQuery(query)

console.log(data.value, '--data')
</script>