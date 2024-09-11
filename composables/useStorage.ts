
export enum StorageKey {
    'chat_history' = 'chat_history',
    'user_info' = 'user_info'
}

export default function useStorage(key: StorageKey) {
    return {
        save: (content: object|string|any[]) => {
            let val = content
            if(typeof val !== 'string') {
                val = JSON.stringify(val)
            }
            localStorage.setItem(key, val)
        },
        get: () => {
            let val = localStorage.getItem(key)
            try {
                return JSON.parse(val ?? '')
            } catch (err) {
                console.log('[useStorage.get]:', err)
                return val
            }
        }
    }
}