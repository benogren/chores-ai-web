import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface SuggestChoresRequest {
  childAge: number;
  existingChores: ExistingChore[];
}

interface ExistingChore {
  name: string;
  description?: string;
  recurrence: string;
  monetaryValue: number;
}

interface SuggestedChore {
  name: string;
  description: string;
  monetaryValue: number;
  recurrence: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'one_time' | 'as_needed';
  estimatedTimeMinutes: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

interface SuggestChoresResponse {
  suggestedChores: SuggestedChore[];
  ageGroup: string;
  reasoning: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SuggestChoresRequest = await request.json();
    const { childAge, existingChores } = body;

    if (!childAge || childAge < 3 || childAge > 18) {
      return NextResponse.json(
        { error: 'Child age must be between 3 and 18 years old' },
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

    // Create age group description
    const ageGroup = getAgeGroup(childAge);
    
    // Format existing chores for the prompt
    const existingChoresText = existingChores.length > 0 
      ? `Current family chores:\n${existingChores.map(chore => 
          `- ${chore.name} (${chore.recurrence}, $${chore.monetaryValue}): ${chore.description || 'No description'}`
        ).join('\n')}\n\n`
      : 'No existing family chores.\n\n';

    const prompt = `You are a parenting expert helping families create age-appropriate chore lists. 

Child Age: ${childAge} years old (${ageGroup})

${existingChoresText}Please suggest 5 NEW age-appropriate chores that would be good for a ${childAge}-year-old child. Make sure the suggestions:

1. Are developmentally appropriate for this age
2. Don't duplicate existing family chores (suggest variations if similar chores exist)
3. Include a mix of daily, weekly, and as-needed tasks
4. Have reasonable monetary values based on effort and time required
5. Build important life skills and responsibility

For each chore, consider:
- Safety and physical capability at this age
- Attention span and cognitive development
- Building independence and confidence
- Fair compensation for effort required

Respond with a JSON object containing:
- suggestedChores: array of 5 chore objects with name, description, monetaryValue, recurrence, estimatedTimeMinutes, skillLevel, and category
- ageGroup: string describing the developmental stage
- reasoning: brief explanation of why these chores are appropriate for this age

Recurrence options: "daily", "weekly", "biweekly", "monthly", "one_time", "as_needed"
Skill levels: "beginner", "intermediate", "advanced"
Categories: "cleaning", "organization", "kitchen", "outdoor", "pet_care", "laundry", "maintenance", "self_care"

Make sure monetary values are realistic (typically $0.50 - $20.00 depending on age and task complexity).`;

    console.log('🤖 Calling OpenAI for chore suggestions');
    console.log(`👶 Child age: ${childAge}`);
    console.log(`📋 Existing chores: ${existingChores.length}`);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    console.log('✅ OpenAI response received');

    const aiResponse = response.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    console.log('🎯 AI Response:', aiResponse);

    let suggestions: SuggestChoresResponse;
    try {
      suggestions = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse, parseError);
      throw new Error('Invalid AI response format');
    }

    // Validate the response structure
    if (!suggestions.suggestedChores || !Array.isArray(suggestions.suggestedChores) || 
        suggestions.suggestedChores.length === 0) {
      throw new Error('AI response missing required fields');
    }

    // Validate each suggested chore
    suggestions.suggestedChores = suggestions.suggestedChores.map(chore => ({
      ...chore,
      monetaryValue: Math.max(0.25, Math.min(50, chore.monetaryValue || 1.0)), // Clamp between $0.25-$50
      estimatedTimeMinutes: Math.max(5, Math.min(180, chore.estimatedTimeMinutes || 15)), // 5-180 minutes
      skillLevel: ['beginner', 'intermediate', 'advanced'].includes(chore.skillLevel) ? chore.skillLevel : 'beginner',
      recurrence: ['daily', 'weekly', 'biweekly', 'monthly', 'one_time', 'as_needed'].includes(chore.recurrence) ? chore.recurrence : 'weekly'
    }));

    const result: SuggestChoresResponse = {
      suggestedChores: suggestions.suggestedChores.slice(0, 5), // Ensure only 5 chores
      ageGroup: suggestions.ageGroup || ageGroup,
      reasoning: suggestions.reasoning || `These chores are selected to be appropriate for ${childAge}-year-old children.`
    };

    console.log('📤 Sending suggestions:', {
      choreCount: result.suggestedChores.length,
      ageGroup: result.ageGroup
    });

    return NextResponse.json(result, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Error suggesting chores:', error);
    
    let errorMessage = 'Failed to generate chore suggestions';
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

function getAgeGroup(age: number): string {
  if (age >= 3 && age <= 5) {
    return "Preschooler (3-5 years)";
  } else if (age >= 6 && age <= 8) {
    return "Early Elementary (6-8 years)";
  } else if (age >= 9 && age <= 11) {
    return "Late Elementary (9-11 years)";
  } else if (age >= 12 && age <= 14) {
    return "Middle School (12-14 years)";
  } else if (age >= 15 && age <= 18) {
    return "High School (15-18 years)";
  } else {
    return "Child";
  }
}