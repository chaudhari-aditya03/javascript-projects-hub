/**
 * API Layer for AI Requests
 * Handles all communication with AI services
 */

// Configuration
const API_CONFIG = {
    // IMPORTANT: Replace with your actual API key and endpoint
    API_KEY: 'YOUR_API_KEY_HERE', // Get from OpenAI, Gemini, or other AI provider
    BASE_URL: 'https://api.openai.com/v1', // Change based on your AI provider
    MODEL: 'gpt-3.5-turbo', // or 'gpt-4', 'gemini-pro', etc.
    MAX_RETRIES: 3,
    TIMEOUT: 30000, // 30 seconds
};

// Rate limiting
let requestCount = 0;
let lastRequestTime = Date.now();
const MAX_REQUESTS_PER_MINUTE = 10;

/**
 * Check rate limit before making request
 */
function checkRateLimit() {
    const now = Date.now();
    const timeDiff = now - lastRequestTime;
    
    if (timeDiff > 60000) {
        // Reset after 1 minute
        requestCount = 0;
        lastRequestTime = now;
    }
    
    if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
        throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    
    requestCount++;
}

/**
 * Make AI API request with retry logic
 */
async function makeAIRequest(prompt, retries = 0) {
    try {
        checkRateLimit();
        
        // Check if API key is configured
        if (API_CONFIG.API_KEY === 'YOUR_API_KEY_HERE') {
            console.warn('API key not configured. Using mock data.');
            return await getMockResponse(prompt);
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.API_KEY}`
            },
            body: JSON.stringify({
                model: API_CONFIG.MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert programming instructor helping students learn and prepare for technical interviews.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
        
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timeout. Please try again.');
        }
        
        if (retries < API_CONFIG.MAX_RETRIES) {
            console.log(`Retrying request... (${retries + 1}/${API_CONFIG.MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1)));
            return makeAIRequest(prompt, retries + 1);
        }
        
        console.error('API request failed:', error);
        console.warn('Falling back to mock data');
        return await getMockResponse(prompt);
    }
}

/**
 * Generate topic syllabus and explanation
 */
export async function generateSyllabus(subject, topic) {
    const prompt = `Generate a comprehensive syllabus and explanation for the topic "${topic}" in ${subject}.

Include:
1. Brief overview (2-3 sentences)
2. Key concepts to learn (bullet points)
3. Prerequisites (if any)
4. Practical applications
5. Learning objectives

Format the response in clear, readable HTML with proper headings and bullet points.`;

    return await makeAIRequest(prompt);
}

/**
 * Generate MCQ questions
 */
export async function generateMCQs(subject, topic, count = 20) {
    const prompt = `Generate ${count} multiple choice questions about "${topic}" in ${subject}.

For each question, provide:
- Question text
- 4 options (A, B, C, D)
- Correct answer (letter)
- Brief explanation

Return as a JSON array with this structure:
[
  {
    "question": "Question text here",
    "options": {
      "A": "Option A",
      "B": "Option B",
      "C": "Option C",
      "D": "Option D"
    },
    "correct": "A",
    "explanation": "Why this is correct"
  }
]

Return ONLY the JSON array, no additional text.`;

    const response = await makeAIRequest(prompt);
    
    try {
        // Extract JSON from response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (e) {
        console.error('Failed to parse MCQ JSON:', e);
    }
    
    return getMockMCQs(subject, topic);
}

/**
 * Generate coding problems
 */
export async function generateCodingProblems(subject, topic, count = 5) {
    const prompt = `Generate ${count} coding problems about "${topic}" in ${subject}.

For each problem:
- Title
- Problem description
- Input format
- Output format
- Example test cases
- Difficulty level (Easy/Medium/Hard)

Return as a JSON array:
[
  {
    "title": "Problem title",
    "description": "Problem description",
    "inputFormat": "Input format",
    "outputFormat": "Output format",
    "examples": [
      {"input": "example input", "output": "example output"}
    ],
    "difficulty": "Easy"
  }
]

Return ONLY the JSON array, no additional text.`;

    const response = await makeAIRequest(prompt);
    
    try {
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (e) {
        console.error('Failed to parse coding problems JSON:', e);
    }
    
    return getMockCodingProblems(subject, topic);
}

/**
 * Evaluate coding solution
 */
export async function evaluateSolution(problem, solution, language) {
    const prompt = `Evaluate this ${language} solution for the following problem:

Problem: ${problem}

Solution:
\`\`\`${language}
${solution}
\`\`\`

Provide:
1. Is the solution correct? (Yes/No)
2. Code quality (1-10)
3. Time complexity
4. Space complexity
5. Suggestions for improvement
6. Optimized solution (if applicable)

Format as JSON:
{
  "isCorrect": true/false,
  "score": 8,
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(1)",
  "feedback": "Detailed feedback",
  "optimizedSolution": "code here if needed"
}`;

    const response = await makeAIRequest(prompt);
    
    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (e) {
        console.error('Failed to parse evaluation JSON:', e);
    }
    
    return {
        isCorrect: true,
        score: 7,
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        feedback: "Good attempt! Consider edge cases.",
        optimizedSolution: null
    };
}

/**
 * Generate interview questions
 */
export async function generateInterviewQuestions(subject, topic, count = 10) {
    const prompt = `Generate ${count} technical interview questions about "${topic}" in ${subject}.

For each question:
- Question text
- Best answer
- Key points to mention
- Follow-up questions (if applicable)

Return as JSON array:
[
  {
    "question": "Question text",
    "answer": "Comprehensive answer",
    "keyPoints": ["point 1", "point 2"],
    "followUp": "Follow-up question"
  }
]

Return ONLY the JSON array, no additional text.`;

    const response = await makeAIRequest(prompt);
    
    try {
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (e) {
        console.error('Failed to parse interview questions JSON:', e);
    }
    
    return getMockInterviewQuestions(subject, topic);
}

/**
 * AI Interview Simulator - Ask question
 */
export async function getInterviewQuestion(subject, topic, conversationHistory = []) {
    const prompt = `You are conducting a technical interview about "${topic}" in ${subject}.

${conversationHistory.length > 0 ? 'Conversation so far:\n' + conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n') : 'This is the start of the interview.'}

Ask the next relevant interview question. Be conversational and professional.`;

    return await makeAIRequest(prompt);
}

/**
 * AI Interview Simulator - Evaluate answer
 */
export async function evaluateInterviewAnswer(question, answer) {
    const prompt = `Evaluate this interview answer:

Question: ${question}
Answer: ${answer}

Provide:
1. Quality of answer (1-10)
2. What was good
3. What could be improved
4. Follow-up question or next topic

Be constructive and encouraging.`;

    return await makeAIRequest(prompt);
}

// ===================================
// MOCK DATA (for testing without API key)
// ===================================

async function getMockResponse(prompt) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (prompt.includes('syllabus')) {
        return `<h3>Overview</h3>
<p>This topic covers fundamental concepts essential for understanding and practical implementation.</p>

<h3>Key Concepts</h3>
<ul>
    <li>Core principles and foundations</li>
    <li>Practical implementation patterns</li>
    <li>Best practices and conventions</li>
    <li>Common use cases and examples</li>
</ul>

<h3>Prerequisites</h3>
<ul>
    <li>Basic programming knowledge</li>
    <li>Understanding of syntax</li>
</ul>

<h3>Learning Objectives</h3>
<ul>
    <li>Master fundamental concepts</li>
    <li>Apply knowledge to real-world scenarios</li>
    <li>Prepare for technical interviews</li>
</ul>`;
    }
    
    return 'Mock AI response. Configure your API key for real AI-powered content.';
}

function getMockMCQs(subject, topic) {
    return [
        {
            question: `What is the primary purpose of ${topic} in ${subject}?`,
            options: {
                A: "To improve code performance",
                B: "To enhance code readability",
                C: "To provide abstraction",
                D: "All of the above"
            },
            correct: "D",
            explanation: "This concept serves multiple purposes including performance, readability, and abstraction."
        },
        {
            question: `Which of the following is a key feature of ${topic}?`,
            options: {
                A: "Encapsulation",
                B: "Inheritance",
                C: "Polymorphism",
                D: "All of the above"
            },
            correct: "D",
            explanation: "These are all important features of this concept."
        }
    ];
}

function getMockCodingProblems(subject, topic) {
    return [
        {
            title: `Basic ${topic} Implementation`,
            description: `Write a program to demonstrate ${topic} in ${subject}.`,
            inputFormat: "Standard input",
            outputFormat: "Standard output",
            examples: [
                { input: "Example input", output: "Example output" }
            ],
            difficulty: "Easy"
        }
    ];
}

function getMockInterviewQuestions(subject, topic) {
    return [
        {
            question: `Explain ${topic} in ${subject} and its practical applications.`,
            answer: `${topic} is a fundamental concept that helps in structuring code effectively. It provides benefits such as maintainability, scalability, and reusability.`,
            keyPoints: [
                "Definition and core concepts",
                "Real-world use cases",
                "Benefits and trade-offs"
            ],
            followUp: "Can you provide an example where this would be useful?"
        }
    ];
}
