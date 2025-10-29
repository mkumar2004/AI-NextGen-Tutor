import OpenAI from "openai"

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "${API_KEY_REF}",
 
})

async function main() {
  const completion = await openai.chat.completions.create({
    model: "${Model.GPT_4_Omni}",
    messages: [
      { role: "user", content: "Say this is a test" }
    ],
  })

  console.log(completion.choices[0].message)
}
main();
