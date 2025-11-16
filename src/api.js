// src/api.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  // For this assignment/demo we call OpenAI from the browser.
  // For production, move all OpenAI calls to a backend.
  dangerouslyAllowBrowser: true,
});

/**
 * Feature B – Product Ideation Agent
 */
export async function generateProductIdea({ query, price, ecoPackage }) {
  const systemPrompt = `
You are an AI product ideation assistant for FMCG brands.

You MUST respond with STRICT VALID JSON only.
No markdown, no headings, no bullet markers, no hashes (#), no asterisks (*).

Use this JSON shape EXACTLY:

{
  "name": string,
  "shortDescription": string,
  "mockupLabel": string,
  "adoptionProbability": number,           // 0-100
  "forecastedSalesUnitsYear1": number,     // integer
  "reasoning": string[],                   // 3-6 short steps

  "variants": [
    {
      "name": string,
      "description": string,
      "adoptionProbability": number,       // 0-100
      "forecastedRevenueLabel": string     // e.g. "$24–28 Cr in year 1"
    }
  ],

  "sentimentMatchScore": number,           // 0-100
  "trendAlignmentScore": number,           // 0-100
  "buzzPredictionLabel": string,

  "consumerPainPointsCovered": string[],
  "competitiveDifferentiation": string[],
  "strategicRecommendations": string[],
  "proactiveAlerts": string[],

  "cannibalizationRiskLabel": string,
  "sustainabilityAlignmentLabel": string,
  "simulationNotes": string[]
}
`;

  const userPrompt = `
User brief: ${query}

Target price: ${price} USD
Eco-friendly packaging target: ${ecoPackage}%

You have access to consumer trends, reviews, social chatter and competitor launches conceptually,
but DO NOT describe any training process – only use them as background reasoning.

Return ONLY the JSON object. No explanation text.
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const text = completion.choices[0]?.message?.content ?? "";

  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse AI JSON for product idea:", text, err);
    throw new Error("AI returned an invalid format for product idea");
  }

  return data;
}

/**
 * Feature A – Multimodal Trend Forecasting Agent
 */
export async function generateTrendForecast() {
  const systemPrompt = `
You are an AI trend forecasting assistant for FMCG beverage companies.

You MUST reply with STRICT VALID JSON only, NO markdown and NO lists outside JSON.

Use this JSON structure exactly:

{
  "summary": {
    "totalForecastedRevenueLabel": string,
    "totalForecastedRevenueChangeLabel": string,
    "hotSkuName": string,
    "hotSkuUnitsLabel": string,
    "hotSkuChangeLabel": string,
    "emergingTrendsCountLabel": string,
    "emergingTrendsChangeLabel": string,
    "overallSentimentLabel": string,
    "overallSentimentChangeLabel": string
  },
  "forecastSeries": [
    {
      "name": string,             // e.g. "Wk 1"
      "Citrus Soda": number,
      "Berry Blast": number
    }
  ],
  "sentimentBreakdown": [
    { "name": "Positive", "value": number },
    { "name": "Neutral", "value": number },
    { "name": "Negative", "value": number }
  ],
  "topTrends": [
    { "name": string, "probability": number }   // 0-100
  ],
  "recommendations": [
    string
  ],
  "pricePromotionInsights": [
    {
      "scenario": string,                // e.g. "10% discount on Citrus Soda"
      "expectedLiftPercent": number,     // 0-100
      "notes": string
    }
  ],
  "competitorInsights": [
    {
      "event": string,                   // competitor launch / news
      "impact": string                   // short impact description
    }
  ],
  "alerts": [
    string                               // short alerts: sudden trend shift, low stock, etc.
  ]
}

All numbers should be realistic but synthetic; do not describe training.
`;

  const userPrompt = `
Prepare a realistic 5-week SKU demand forecast for two SKUs:
"Citrus Soda" and "Berry Blast" in urban India (Q2 season).

Include sentiment breakdown, top trends, price & promotion insights,
competitor insights, and alerts as described in the JSON schema.
Return ONLY the JSON object, nothing else.
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const text = completion.choices[0]?.message?.content ?? "";

  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse AI JSON for trend forecast:", text, err);
    throw new Error("AI returned an invalid format for trend forecast");
  }

  return data;
}

/**
 * Dashboard – AI Overview
 */
export async function generateDashboardOverview() {
  const systemPrompt = `
You are an AI assistant that prepares a daily overview dashboard
for an FMCG beverage product manager.

You MUST reply with STRICT VALID JSON only.

Use this JSON structure exactly:

{
  "summary": {
    "forecastedRevenueLabel": string,
    "forecastedRevenueChangeLabel": string,
    "activeTrendsTrackedLabel": string,
    "activeTrendsChangeLabel": string,
    "newProductsIdeatedLabel": string,
    "newProductsChangeLabel": string,
    "hotSkuName": string,
    "hotSkuVolumeLabel": string,
    "hotSkuChangeLabel": string
  },
  "salesData": [
    {
      "name": string,       // e.g. "Jan", "Feb"
      "revenue": number
    }
  ],
  "topTrends": [
    {
      "name": string,
      "probability": number   // 0-100
    }
  ],
  "aiSummaryBullets": [
    string
  ],
  "alerts": [
    string
  ]
}
`;

  const userPrompt = `
Generate a 6-month forward-looking revenue forecast, top 3-5 consumer trends,
3-5 short AI summary bullets, and 3-5 alerts/notifications
for an FMCG beverage portfolio in India + Southeast Asia.
Return ONLY the JSON object.
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const text = completion.choices[0]?.message?.content ?? "";

  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse AI JSON for dashboard overview:", text, err);
    throw new Error("AI returned an invalid format for dashboard overview");
  }

  return data;
}
