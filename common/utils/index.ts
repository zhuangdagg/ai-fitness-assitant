import { v1 } from 'uuid'

/**
 * 随机生成id
 */
export const createID = () => {
    return v1()
}