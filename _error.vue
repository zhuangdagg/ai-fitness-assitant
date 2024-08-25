<template>
    <div>发生错误：</div>
    <div>{{ error }}</div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps({
    error: Object as () => NuxtError
})
</script>