import OpenAI from 'openai';
import 'dotenv/config';

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE_URL,
});

async function cotExample() {
    const res = await client.chat.completions.create({
        model: process.env.MODEL_NAME,
        messages: [
            {
                role: 'user',
                content: `
                  请一步一步思考并解决问题：
                  一个商品100块，打8折再减10块，多少钱？
                `
            }
        ]
    })
    console.log(res.choices[0].message.content);
}

cotExample()