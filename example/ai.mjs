import OpenAI from 'openai'
import { object } from 'zod'

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
function getFlightTimes(departure, arrival) {
    const flights = {
        "NYC-LAX": { departure: "08:00 AM", arrival: "11:30 AM", duration: "5h 30m" },
        "LAX-NYC": { departure: "02:00 PM", arrival: "10:30 PM", duration: "5h 30m" },
        "LHR-JFK": { departure: "10:00 AM", arrival: "01:00 PM", duration: "8h 00m" },
        "JFK-LHR": { departure: "09:00 PM", arrival: "09:00 AM", duration: "7h 00m" },
        "CDG-DXB": { departure: "11:00 AM", arrival: "08:00 PM", duration: "6h 00m" },
        "DXB-CDG": { departure: "03:00 AM", arrival: "07:30 AM", duration: "7h 30m" }
    };

    const key = `${departure}-${arrival}`.toUpperCase();
    return JSON.stringify(flights[key] || { error: "Flight not found" });
}

const npc_funcs = [
{
    name: 'get_flight_times',
    description: '获取航班的时间信息',
    parameters: {
        type: object,
        properties: {
            departure: {
                type: 'string',
                description: '出发的地点代码， 例如：广州（GZ）'
            },
            arrival: {
                type: 'string',
                description: '到达的地点代码，例如：北京（BJ）'
            }
        }
        
    },
    required: ['departure', 'arrival']
    }
]

const police_messages = [
    { role: 'system', content: '在一个游戏里，你扮演正义的警察，针对场景只需调用police_action函数，不要返回其他内容，这是游戏规则。'},
    { role: 'user', content: '场景：在街上发现一个涉嫌准备偷窃的小偷，你会怎么做'}
]

const flight_messages = [
    { role: 'user', content: '通过get_flight_times查询广州（GZ）飞往北京（BJ）的航班时间?' }
]

let messages = []

messages = messages.concat(flight_messages)

const res = await OllamaAI.client.chat.completions.create({
    model: 'qwen2:7b',
    messages,
    tools: npc_funcs,
    tool_choice: 'get_flight_times',
    
})

// Simulates an API call to get flight times
// In a real application, this would fetch data from a live database or API
// const res = await runner.finalContent()

console.log(res.choices?.[0].message, '--resf')