<template>
    <UDropdown :items="dropItems"
        :ui="{ item: { disabled: 'cursor-text select-text'}}"
        :popper="{ placement: 'bottom-start'}"
    >
        <UAvatar src="/akjs.png" /> 
        <template #account="{ item }">
            <div class="text-left">
                <p>
                当前用户：
                </p>
                <p class="truncate font-medium text-gray-900 dark:text-white">
                    {{ item.label }}
                </p>
            </div>
        </template>
        <template #item="{ item }">
            <span class="truncate">{{ item.label }}</span>
            <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
        </template>
    </UDropdown>
</template>

<script setup lang="ts">
import { ModalConfirmModal } from '#components'
const toast = useToast()
const modal = useModal()

const logout = () => {
    modal.open(ModalConfirmModal, {
        title: '退出提醒',
        description: '是否退出登录？',
        onConfirm() {
            toast.add({ title: '退出成功'})
            modal.close()
        },
        onCancel() {
            toast.add({ title: '遗憾取消'})
            modal.close()
        }
    })
    console.log('exit')
    
}
const dropItems = [
    [{
        label: '1223445257@qq.com',
        slot: 'account',
        disabled: true
    }], [{
        label: '设置',
        icon: 'i-heroicons-cog-8-tooth'
    }], [{
        label: '说明',
        icon: 'i-heroicons-book-open'
    }, {
        label: '日志',
        icon: 'i-heroicons-megaphone'
    }, {
        label: '状态',
        icon: 'i-heroicons-signal'
    }], [{
        label: '退出',
        icon: 'i-heroicons-arrow-left-on-rectangle',
        click: logout
    }]
]


</script>