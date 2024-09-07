<template>
    <ul class="flex justify-center">
        <li class="m-2" v-for="item in menus">
            <ULink active-class="text-primary" :to="item.to">{{ item.name }}</ULink>
        </li>
    </ul>
</template>

<script setup lang="ts">

const menus = ref([
    {
        to: '/workspace',
        name: '工作区'
    },
    {
        to: '/knowledge',
        name: '知识库'
    }, {
        to: '/chat',
        name: '健身教练'
    }
])
</script>