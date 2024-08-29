// import { openApiDocument } from "../trpc/routers";
import { appRouter } from "../trpc/routers"
import { renderTrpcPanel } from "trpc-panel"

export default defineEventHandler(async (evt) => {
    return renderTrpcPanel(appRouter, {
        url: 'http://localhost:3000/api/trpc',
        transformer: 'superjson'
    })
})