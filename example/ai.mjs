import OpenAI from 'openai'

export const OllamaAI = {
    client: new OpenAI({
        baseURL: 'http://localhost:11434/v1',
        apiKey: 'Empty'
    }),
    async generate(input) {
        console.log(input)
        const { data } = await this.client.embeddings.create({
            input, model: 'nomic-embed-text'
        })
        if(data && data.length) {
            return data.map(item => item.embedding)
        }
    }
}

const npc_funcs = [
    {
        "name": "police_action",
        "description": "执行警察的行动",
        "parameters": {
            "type":"object",
            "properties": {
                "action_name": {
                    "type":"string",
                    "enum": ["逮捕", "跟随", "呼叫支援", "撤退"],
                    "description": "你采取的具体行动"
                },
                "talk": {
                    "type": "string",
                    "description": "你角色要说的话；如果需要悄悄行动，这里留空。"
                }
            },
            "required": ["action_name"]
        }
    }
]

const messages = [
    { role: 'system', content: '在一个游戏里，你扮演正义的警察，针对场景只需调用police_action函数，不要返回其他内容，这是游戏规则。'},
    { role: 'user', content: '场景：在街上发现一个涉嫌准备偷窃的小偷，你会怎么做'}
]

const res = await OllamaAI.client.chat.completions.create({
    model: 'qwen2:7b',
    messages,
    functions: npc_funcs,
    function_call: 'police_action'
})

console.log(res.choices?.[0].message, '--resf')