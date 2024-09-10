import { Readable } from 'node:stream'
import { sseEvent } from '~/server/utils/helper'

export default defineEventHandler((evt) => {
    console.log(evt.context.params)
    setResponseHeaders(evt, {
        "Content-Type": "text/event-stream;charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
    })

    const { user } = evt.context.params!

    return new Promise((resolve) => {
        sseEvent.once(`chat${user}`, (stream: Readable) => {
            sendStream(evt, stream)
            stream.on('end', () => {
                console.log('end')
                resolve('')
            })
        })
    })
})