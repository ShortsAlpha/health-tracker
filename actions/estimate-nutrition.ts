'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function estimateNutrition(foodDescription: string) {
    if (!foodDescription) {
        return { error: 'Please provide a food description' }
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        const prompt = `
        You are a nutritionist. Estimate the macronutrients for the following food: "${foodDescription}".
        Return ONLY a JSON object with the following keys:
        - calories (number)
        - protein (number, in grams)
        - carbs (number, in grams)
        - fat (number, in grams)

        Do not include markdown formatting or backticks. Just the raw JSON string.
        If the food is invalid or you cannot estimate, return all zeros.
        `

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim()
        const data = JSON.parse(cleanedText)

        return { success: true, data }
    } catch (e) {
        console.error('Gemini Error:', e)
        return { error: 'Failed to estimate nutrition' }
    }
}
