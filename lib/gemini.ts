
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function analyzeBloodTest(text: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `
    You are an expert medical data analyst. Your task is to extract blood test results from the provided text.
    
    Extract the following information for EACH test marker found:
    - Marker Name (e.g., "Hemoglobin", "Glucose", "TSH")
    - Value (numerical value)
    - Unit (e.g., "g/dL", "mg/dL", "uIU/mL")
    - Reference Range (e.g., "13.0 - 17.0")

    Also try to extract the generic metadata:
    - Hospital Name
    - Date of test (YYYY-MM-DD format)

    Return the output STRICTLY in this JSON format, with no markdown code blocks:
    {
      "hospital_name": "...",
      "date": "YYYY-MM-DD",
      "markers": [
        {
          "marker_name": "...",
          "value": 0.0,
          "unit": "...",
          "reference_range": "..."
        }
      ]
    }

    If you cannot find a date, use today's date.
    If you cannot find a hospital name, use "Unknown Hospital".
    
    TEXT TO ANALYZE:
    ${text}
  `

  const result = await model.generateContent(prompt)
  const response = await result.response
  const textResponse = response.text()

  // Clean up markdown code blocks if present
  const cleanedText = textResponse.replace(/```json/g, '').replace(/```/g, '').trim()

  try {
    return JSON.parse(cleanedText)
  } catch {
    console.error('Failed to parse Gemini response:', textResponse)
    throw new Error('AI analysis failed to produce valid JSON')
  }
}
