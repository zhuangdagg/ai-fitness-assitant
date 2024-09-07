<template>
    <div>
        <header class="w-screen flex justify-between items-center px-4 bg-slate-200 dark:bg-slate-600 py-2 border-b-2 dark:border-slate-500">
            <a href="/">
                <img class="w-10 rounded-md" src="/akjs.png" />
            </a>
            <HeadMenu class="flex-1 text-center" />
            
            <UButton 
                class="mr-4"
                :icon="!isDark ? 'i-heroicons-moon-20-solid': 'i-heroicons-sun-20-solid'"
                color="gray"
                variant="ghost"
                aria-label="Theme"
                @click="isDark = !isDark"
            />
            <HeadUserDrop />
        </header>
        <slot />
    </div>
</template>

<script setup lang="ts">

const colorMode = useColorMode()

const isDark = computed({
    get() {
        return colorMode.value === 'dark'
    },
    set(val: boolean) {
        colorMode.preference = colorMode.value = val ? 'dark': 'light'
    }
})


</script>