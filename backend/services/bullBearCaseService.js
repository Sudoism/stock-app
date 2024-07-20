const { Stock } = require('../models');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getBullBearCase = async (ticker) => {
  try {
    const stock = await Stock.findOne({ where: { ticker } });
    if (!stock) {
      throw new Error(`Stock not found for ticker: ${ticker}`);
    }

    const companyName = stock.name;
    if (!companyName) {
      throw new Error(`Company name not found for ticker: ${ticker}`);
    }

    const prompt = `You are a seasoned financial analyst and investment professional with extensive knowledge of global markets, industry trends, and company valuations. Provide a comprehensive bull and bear case analysis for ${companyName}, focusing on the following aspects:

1. Financial Health: Analyze key financial metrics, including revenue growth, profit margins, debt levels, and cash flow. Provide specific numbers and trends over the past 3-5 years.

2. Market Position: Evaluate the company's market share, competitive advantages, and potential threats from rivals. Compare the company's position to key competitors in the industry.

3. Industry Trends: Discuss how current and emerging industry trends affect the company's prospects. Consider technological advancements, regulatory changes, and shifts in consumer behavior.

4. Valuation: Assess the company's current stock valuation using relevant metrics (e.g., P/E ratio, PEG ratio, EV/EBITDA). Compare these to industry averages and historical levels.

5. Growth Potential: Analyze the company's growth strategies, including expansion plans, new product developments, and potential market opportunities.

6. Risks: Identify and explain key risks facing the company, including operational, financial, and external factors.

For each point in the bull and bear cases:
- Provide a concise summary.
- Include specific indicators or metrics to monitor.
- Offer a detailed analysis with factual information, including precise figures, dates, and sources where applicable.

Present 5 of the most compelling points for each case, prioritizing the most significant factors that could impact the stock's performance. The number of points for bull and bear cases can differ based on the strength of available evidence.

Finally, provide an investment grade from 1-5 (1 being very bearish, 3 neutral, and 5 very bullish) with a detailed explanation of the rationale behind the grade.

Format the response as a JSON object with the following structure:

{
  "date": "YYYY-MM-DD",
  "company": "Company Name",
  "bull_case": {
    "1": {
      "summary": "Concise summary of the point",
      "indicator": "Specific metrics or indicators to watch",
      "analysis": "Detailed analysis with factual information, figures, and dates"
    },
    // Additional bull case points...
  },
  "bear_case": {
    "1": {
      "summary": "Concise summary of the point",
      "indicator": "Specific metrics or indicators to watch",
      "analysis": "Detailed analysis with factual information, figures, and dates"
    },
    // Additional bear case points...
  },
  "final_grade": {
    "grade": 1-5,
    "clarification": "Detailed explanation of the investment grade"
  }
}

Ensure all analyses are fact-based, drawing from the company's historical performance, current market conditions, and industry data. Provide a balanced view, acknowledging both strengths and weaknesses in your assessment. Only reply with the JSON object containing your analysis.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: prompt
            }
          ]
        }
      ],
      temperature: 0.7,
      max_tokens: 2500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error('No response received from OpenAI');
    }

    let content = response.choices[0].message.content;
    
    // Remove code block markers if present
    content = content.replace(/```json\n/g, '').replace(/```/g, '');
    
    // Trim any leading or trailing whitespace
    content = content.trim();

    try {
      return JSON.parse(content);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.error('Raw response:', content);
      throw new Error('Failed to parse the bull/bear case analysis');
    }
  } catch (error) {
    console.error('Error in getBullBearCase:', error);
    throw error;
  }
};

module.exports = {
  getBullBearCase,
};