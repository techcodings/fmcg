// src/api.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  // Demo only – for production move all OpenAI calls to a backend.
  // (Browser key is not safe.)
  dangerouslyAllowBrowser: true,
});

/**
 * Feature B – Product Ideation Agent
 */
export async function generateProductIdea({ query, price, ecoPackage }) {
  const systemPrompt = `
You are an AI product ideation assistant for FMCG brands.

Your job is to:
- Propose new product variants and concepts (flavors, packs, packaging styles).
- Estimate adoption probability and expected sales impact.
- Align ideas with consumer sentiment and emerging trends.
- Highlight competitive differentiation and white-space gaps.
- Provide strategic recommendations and "what-if" simulation notes.

You MUST respond with STRICT VALID JSON only.
No markdown, no headings, no bullet markers, no hashes (#), no asterisks (*).

Use this JSON shape EXACTLY:

{
  "name": string,
  "shortDescription": string,
  "mockupLabel": string,
  "adoptionProbability": number,
  "forecastedSalesUnitsYear1": number,
  "reasoning": string[],

  "variants": [
    {
      "name": string,
      "description": string,
      "adoptionProbability": number,
      "forecastedRevenueLabel": string
    }
  ],

  "sentimentMatchScore": number,
  "trendAlignmentScore": number,
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

Assume you conceptually have access to:
- Product images (own + competitor packaging),
- Consumer reviews and social media trends,
- Historical sales and category performance,
- Industry reports, competitor launches and macro trends.

Do NOT describe any training process.
Use these only as background reasoning to support your outputs.

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

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse AI JSON for product idea:", text, err);
    throw new Error("AI returned an invalid format for product idea");
  }
}

/**
 * OPTIONAL – Feature B image mockup
 * Generate a packaging-style image for the concept.
 */
export async function generateProductMockup({ name, shortDescription }) {
  // You need a model that supports images in your OpenAI account
  const prompt = `
High-end 3D render of FMCG packaging for:
"${name}". ${shortDescription}

Style: realistic product photo on dark gradient background,
neon green accent, premium sparkling water / beverage packaging,
front view, centered, no text other than brand elements.
`;

  const result = await client.images.generate({
    model: "dall-e-3",       // or "dall-e-3" if that's what you have
    prompt,
    size: "1024x1024",
  });

  const url = result.data?.[0]?.url;
  if (!url) throw new Error("No image URL returned for product mockup");
  return url;
}

/**
 * Feature A – Multimodal Trend Forecasting Agent
 */
export async function generateTrendForecast(options = {}) {
  const {
    category = "FMCG beverages (carbonated drinks)",
    region = "urban India",
    timeHorizon = "next 5 weeks",
  } = options;

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
      "name": string,
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
    { "name": string, "probability": number }
  ],
  "recommendations": [ string ],
  "pricePromotionInsights": [
    {
      "scenario": string,
      "expectedLiftPercent": number,
      "notes": string
    }
  ],
  "competitorInsights": [
    {
      "event": string,
      "impact": string
    }
  ],
  "alerts": [ string ]
}
`;

  const userPrompt = `
Prepare a realistic ${timeHorizon} SKU demand forecast for two SKUs:
"Citrus Soda" and "Berry Blast" in ${region}, within the ${category} category.

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

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse AI JSON for trend forecast:", text, err);
    throw new Error("AI returned an invalid format for trend forecast");
  }
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
    { "name": string, "revenue": number }
  ],
  "topTrends": [
    { "name": string, "probability": number }
  ],
  "aiSummaryBullets": [ string ],
  "alerts": [ string ]
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

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse AI JSON for dashboard overview:", text, err);
    throw new Error("AI returned an invalid format for dashboard overview");
  }
}
