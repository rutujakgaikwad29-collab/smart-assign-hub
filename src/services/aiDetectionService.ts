/**
 * GPTZero AI Detection Service
 * Integrates with GPTZero API to detect AI-generated content.
 */

const API_KEY = import.meta.env.VITE_GPTZERO_API_KEY;
const API_URL = "https://api.gptzero.me/v2/predict/text";

export interface GPTZeroResult {
  score: number; // 0 to 100
  risk: "Low" | "Medium" | "High";
  predictedClass: "ai" | "human" | "mixed";
  confidenceCategory: string;
}

/**
 * Detects AI content in a string of text.
 * @param text The text to analyze
 * @returns Prediction result with score and risk level
 */
export async function detectAIContent(text: string): Promise<GPTZeroResult> {
  if (!API_KEY || API_KEY === "your_gptzero_api_key_here") {
    console.warn("GPTZero API Key is missing. Returning simulated result.");
    return simulateDetection(text);
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        document: text,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    
    // GPTZero v2 returns class_probabilities with 'ai', 'human', etc.
    const aiProbability = data.class_probabilities?.ai || 0;
    const score = Math.round(aiProbability * 100);
    
    let risk: "Low" | "Medium" | "High" = "Low";
    if (score > 60) risk = "High";
    else if (score > 25) risk = "Medium";

    return {
      score,
      risk,
      predictedClass: data.predicted_class || (score > 50 ? "ai" : "human"),
      confidenceCategory: data.confidence_category || "low",
    };
  } catch (error) {
    console.error("GPTZero API failure:", error);
    throw error;
  }
}

/**
 * Fallback simulation for when API key is not provided
 */
async function simulateDetection(text: string): Promise<GPTZeroResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Basic heuristic: check for common AI phrases (very simplified)
  const aiMarkers = ["as an ai language model", "furthermore", "in conclusion", "it is important to note"];
  let score = 5 + Math.floor(Math.random() * 20);
  
  const lowerText = text.toLowerCase();
  aiMarkers.forEach(marker => {
    if (lowerText.includes(marker)) score += 25;
  });

  if (score > 100) score = 100;
  
  let risk: "Low" | "Medium" | "High" = "Low";
  if (score > 60) risk = "High";
  else if (score > 25) risk = "Medium";

  return {
    score,
    risk,
    predictedClass: score > 50 ? "ai" : "human",
    confidenceCategory: "low",
  };
}
