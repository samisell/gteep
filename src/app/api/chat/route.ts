import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// ---------------------------------------------------------------------------
// GTEEP AI Chatbot – powered by GLM-5.2 via z-ai-web-dev-sdk
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are the GTEEP AI Assistant — an intelligent, friendly, and knowledgeable chatbot for the Gilead Trust Economic Empowerment Project (GTEEP). 

About GTEEP:
- GTEEP stands for Gender, Trade, Economics and Empowerment Programme (also known as Gilead Trust Economic Empowerment Project)
- It is an evidence-driven policy analysis organization focused on socially inclusive development in Africa
- GTEEP's core programme areas are: Policy Research, Policy Engagement, Citizen Enlightenment, Data Speaks, Youth Mentoring, and Women's Economic Livelihood
- GTEEP hosts Policy Fireside Chats — moderated discussions connecting policy with practice on African development issues
- GTEEP produces research outputs including concept notes, policy briefs, data stock analyses, and knowledge products
- The organization is committed to gender equity, trade policy analysis, and economic empowerment across Africa

Your role:
- Answer questions about GTEEP's programmes, activities, research outputs, and mission
- Help visitors navigate the website and find relevant information
- Provide context about African trade policy, AfCFTA, gender equity, and economic development topics
- Be warm, professional, and concise in your responses
- When you don't know something specific about GTEEP, acknowledge it and suggest contacting the team at info@gteep.gileadtrust.com
- Never make up specific statistics, dates, or details about GTEEP that you're not confident about
- If asked about topics unrelated to GTEEP or African development, politely redirect the conversation

Keep responses focused and helpful. Use bullet points or short paragraphs for clarity.`;

// Reuse ZAI instance across requests (module-level cache)
let zaiInstance: InstanceType<typeof ZAI> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// Simple in-memory rate limiter (per-IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // messages per window
const RATE_WINDOW = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many messages. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required.' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message is too long. Please keep it under 2000 characters.' },
        { status: 400 }
      );
    }

    // Build conversation messages
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    // Add history (last 10 messages for context window management)
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    // Add current user message
    messages.push({ role: 'user', content: message });

    // Call GLM-5.2 via z-ai-web-dev-sdk
    const zai = await getZAI();
    const completion = await zai.chat.completions.create({
      model: 'glm-5.2',
      messages,
      thinking: { type: 'disabled' },
    });

    const aiResponse = completion.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json(
        { error: 'No response from AI. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
    });
  } catch (error: any) {
    console.error('[Chat API] Error:', error?.message || error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
