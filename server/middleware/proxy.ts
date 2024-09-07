import { createProxyEventHandler } from 'h3-proxy'

export default defineEventHandler(createProxyEventHandler([
    {
        target: 'http://127.0.0.1:8000',
        pathRewrite: {
            '^/gw': ''
        },
        pathFilter: ['/gw/**']
    }
]))