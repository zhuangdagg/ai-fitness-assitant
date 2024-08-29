<template>
    <div>
        <ApiReference :configuration="configuration" />
    </div>
</template>

<script setup lang="ts">
import { ApiReference } from '@scalar/api-reference'
import '@scalar/api-reference/style.css'

definePageMeta({
    layout: false
})

const configuration = {
    spec: {
        url: 'http://localhost:3000/trpc-doc'
    }
}
</script>