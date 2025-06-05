import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AnalysisRequest {
  imageUrl: string;
  choreName: string;
  choreDescription?: string;
}

interface AnalysisResult {
  isCompleted: boolean;
  confidence: number;
  reasoning: string;
  analyzedAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json();
    const { imageUrl, choreName, choreDescription } = body;

    if (!imageUrl || !choreName) {
      return NextResponse.json(
        { error: 'Missing required fields: imageUrl and choreName' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }

    const prompt = `You are an AI assistant helping parents evaluate if their child has completed a chore. 

    Chore: "${choreName}"
    ${choreDescription ? `Description: "${choreDescription}"` : ''}

    Please analyze this image and determine if the chore has been completed satisfactorily. Consider:
    - Age-appropriate standards (this is a child's work)
    - Reasonable effort has been made
    - The main objective of the chore has been achieved
    - Focus on the objective of the chore, not perfection (e.g., a bed made by a child may not be perfectly smooth, but it should look tidy)
    - Look for key indicators of completion (e.g., toys put away, bed made, dishes cleaned, floor is mostly clear)
    - Be encouraging but honest in your assessment

    Respond with a JSON object containing:
    - isCompleted: boolean (true if reasonably completed)
    - confidence: number (0.0 to 1.0, your confidence in the assessment)
    - reasoning: string (brief, encouraging explanation of your decision)

    Examples of good reasoning:
    - "Great job! The room looks much tidier with toys put away and bed made."
    - "Good effort on cleaning, but there are still clothes on the floor that need to be picked up."
    - "Excellent work! The dishes are clean and properly put away."
    - "Nice start! The bed is made, but the toys still need to be organized."
    - "Well done! The trash has been taken out and the bin is clean."

    Be specific about what you see and focus on effort and improvement. Keep reasoning under 100 characters for better mobile display.`;

    console.log('🤖 Calling OpenAI with model: gpt-4o');
    console.log('🖼️ Image URL:', imageUrl);
    console.log('📝 Prompt length:', prompt.length);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 300,
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    console.log('✅ OpenAI response received');
    console.log('📊 Response structure:', {
      choices: response.choices?.length,
      firstChoice: response.choices?.[0] ? 'exists' : 'missing',
      message: response.choices?.[0]?.message ? 'exists' : 'missing',
      content: response.choices?.[0]?.message?.content ? 'exists' : 'missing'
    });

    const aiResponse = response.choices[0]?.message?.content;
    if (!aiResponse) {
      console.error('❌ No AI response content. Full response:', JSON.stringify(response, null, 2));
      throw new Error('No response from AI - check Vercel logs for details');
    }

    console.log('🎯 AI Response:', aiResponse);

    let analysis;
    try {
      analysis = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse, parseError);
      throw new Error('Invalid AI response format');
    }

    // Validate the response structure
    if (typeof analysis.isCompleted !== 'boolean' || 
        typeof analysis.confidence !== 'number' || 
        typeof analysis.reasoning !== 'string') {
      throw new Error('AI response missing required fields');
    }

    // Ensure confidence is between 0 and 1
    analysis.confidence = Math.max(0, Math.min(1, analysis.confidence));
    
    // Ensure reasoning is not too long for mobile display
    if (analysis.reasoning.length > 150) {
      analysis.reasoning = analysis.reasoning.substring(0, 147) + '...';
    }
    
    const result: AnalysisResult = {
      isCompleted: analysis.isCompleted,
      confidence: analysis.confidence,
      reasoning: analysis.reasoning,
      analyzedAt: new Date().toISOString()
    };

    console.log('📤 Sending result:', {
      isCompleted: result.isCompleted,
      confidence: `${Math.round(result.confidence * 100)}%`,
      reasoningLength: result.reasoning.length
    });

    return NextResponse.json(result, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Error analyzing chore:', error);
    
    let errorMessage = 'Failed to analyze chore completion';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}