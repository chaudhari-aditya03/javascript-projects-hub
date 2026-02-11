/**
 * Learn Page Logic
 * Main learning flow with all sections
 */

import { 
    generateSyllabus, 
    generateMCQs, 
    generateCodingProblems, 
    evaluateSolution,
    generateInterviewQuestions,
    getInterviewQuestion,
    evaluateInterviewAnswer
} from '../api/ai.js';

import { 
    showToast, 
    getURLParams, 
    createMCQElement, 
    createCodingProblemElement,
    createInterviewQuestionElement,
    createChatMessage,
    showLoading,
    hideLoading
} from './ui.js';

import { saveTopicProgress, saveMCQScore, saveCodingScore } from './storage.js';

// State management
let currentSubject = null;
let currentTopic = null;
let currentSection = 0;
let mcqData = [];
let mcqAnswers = {};
let codingProblems = [];
let interviewQuestions = [];
let simulatorHistory = [];

const sections = ['syllabus', 'mcq', 'coding', 'interview', 'simulator'];

// Initialize learn page
document.addEventListener('DOMContentLoaded', async () => {
    const params = getURLParams();
    
    if (!params.subject || !params.topic) {
        showToast('Invalid parameters', 'error');
        setTimeout(() => window.location.href = 'dashboard.html', 2000);
        return;
    }
    
    currentSubject = params.subject;
    currentTopic = params.topic;
    
    await loadTopicInfo();
    setupEventListeners();
    showSection(0);
});

/**
 * Load topic information
 */
async function loadTopicInfo() {
    try {
        const response = await fetch('data/subjects.json');
        const data = await response.json();
        
        const subject = data.subjects.find(s => s.id === currentSubject);
        if (!subject) throw new Error('Subject not found');
        
        const topic = subject.topics?.find(t => t.id === currentTopic);
        if (!topic) throw new Error('Topic not found');
        
        updateBreadcrumbs(subject, topic);
        updatePageTitle(topic);
        
    } catch (error) {
        console.error('Error loading topic info:', error);
        showToast('Failed to load topic information', 'error');
    }
}

/**
 * Update breadcrumbs
 */
function updateBreadcrumbs(subject, topic) {
    const topicsBreadcrumb = document.getElementById('topicsBreadcrumb');
    const currentTopicBreadcrumb = document.getElementById('currentTopicBreadcrumb');
    
    if (topicsBreadcrumb) {
        topicsBreadcrumb.textContent = subject.name;
        topicsBreadcrumb.href = `topics.html?subject=${currentSubject}`;
    }
    
    if (currentTopicBreadcrumb) {
        currentTopicBreadcrumb.textContent = topic.name;
    }
}

/**
 * Update page title
 */
function updatePageTitle(topic) {
    document.title = `${topic.name} - ReviseX AI`;
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Section 1: Syllabus
    const generateSyllabusBtn = document.getElementById('generateSyllabusBtn');
    if (generateSyllabusBtn) {
        generateSyllabusBtn.onclick = handleGenerateSyllabus;
    }
    
    // Section 2: MCQ
    const generateMCQBtn = document.getElementById('generateMCQBtn');
    if (generateMCQBtn) {
        generateMCQBtn.onclick = handleGenerateMCQs;
    }
    
    // Section 3: Coding
    const generateCodingBtn = document.getElementById('generateCodingBtn');
    if (generateCodingBtn) {
        generateCodingBtn.onclick = handleGenerateCoding;
    }
    
    // Section 4: Interview
    const generateInterviewBtn = document.getElementById('generateInterviewBtn');
    if (generateInterviewBtn) {
        generateInterviewBtn.onclick = handleGenerateInterview;
    }
    
    // Section 5: Simulator
    const startSimulatorBtn = document.getElementById('startSimulatorBtn');
    if (startSimulatorBtn) {
        startSimulatorBtn.onclick = handleStartSimulator;
    }
    
    const sendAnswerBtn = document.getElementById('sendAnswerBtn');
    if (sendAnswerBtn) {
        sendAnswerBtn.onclick = handleSendAnswer;
    }
    
    const simulatorInput = document.getElementById('simulatorInput');
    if (simulatorInput) {
        simulatorInput.onkeypress = (e) => {
            if (e.key === 'Enter') handleSendAnswer();
        };
    }
    
    // Navigation
    const nextBtn = document.getElementById('nextSectionBtn');
    const prevBtn = document.getElementById('prevSectionBtn');
    
    if (nextBtn) nextBtn.onclick = () => navigateSection(1);
    if (prevBtn) prevBtn.onclick = () => navigateSection(-1);
}

/**
 * Show specific section
 */
function showSection(index) {
    // Hide all sections
    sections.forEach(section => {
        const element = document.getElementById(`${section}Section`);
        if (element) element.classList.add('hidden');
    });
    
    // Show current section
    const currentSectionElement = document.getElementById(`${sections[index]}Section`);
    if (currentSectionElement) {
        currentSectionElement.classList.remove('hidden');
    }
    
    // Update navigation buttons
    updateNavigationButtons(index);
    
    // Update progress sidebar
    updateProgressSidebar(index);
    
    currentSection = index;
}

/**
 * Navigate between sections
 */
function navigateSection(direction) {
    const newIndex = currentSection + direction;
    
    if (newIndex < 0 || newIndex >= sections.length) return;
    
    // Check if current section is completed
    if (direction > 0 && !isSectionCompleted(currentSection)) {
        showToast('Please complete this section first', 'warning');
        return;
    }
    
    showSection(newIndex);
}

/**
 * Check if section is completed
 */
function isSectionCompleted(index) {
    const section = sections[index];
    
    switch (section) {
        case 'syllabus':
            return document.getElementById('syllabusContent').classList.contains('hidden') === false;
        
        case 'mcq':
            return mcqData.length > 0 && Object.keys(mcqAnswers).length === mcqData.length;
        
        case 'coding':
            return true; // Optional completion
        
        case 'interview':
            return interviewQuestions.length > 0;
        
        case 'simulator':
            return true; // Optional
        
        default:
            return false;
    }
}

/**
 * Update navigation buttons
 */
function updateNavigationButtons(index) {
    const nextBtn = document.getElementById('nextSectionBtn');
    const prevBtn = document.getElementById('prevSectionBtn');
    
    if (prevBtn) {
        if (index === 0) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }
    }
    
    if (nextBtn) {
        if (index === sections.length - 1) {
            nextBtn.textContent = 'Complete';
            nextBtn.onclick = handleComplete;
        } else {
            nextBtn.innerHTML = 'Next<i class="fas fa-arrow-right ml-2"></i>';
            nextBtn.onclick = () => navigateSection(1);
        }
    }
}

/**
 * Update progress sidebar
 */
function updateProgressSidebar(index) {
    document.querySelectorAll('.progress-item').forEach((item, i) => {
        const icon = item.querySelector('i');
        item.classList.remove('active');
        
        if (i < index) {
            icon.className = 'fas fa-check-circle text-green-600';
        } else if (i === index) {
            item.classList.add('active');
            icon.className = 'fas fa-circle-notch text-blue-600';
        } else {
            icon.className = 'fas fa-circle-notch text-gray-400';
        }
    });
}

// ===================================
// SECTION 1: SYLLABUS
// ===================================

async function handleGenerateSyllabus() {
    const loadingElement = document.getElementById('syllabusLoading');
    const contentElement = document.getElementById('syllabusContent');
    const button = document.getElementById('generateSyllabusBtn');
    
    showLoading(loadingElement);
    button.disabled = true;
    
    try {
        const syllabus = await generateSyllabus(currentSubject, currentTopic);
        contentElement.innerHTML = syllabus;
        contentElement.classList.remove('hidden');
        hideLoading(loadingElement);
        
        // Save progress
        saveTopicProgress(currentSubject, currentTopic, 'syllabus', {
            completed: true,
            data: { viewed: true }
        });
        
        showToast('Syllabus generated successfully!', 'success');
        
    } catch (error) {
        console.error('Error generating syllabus:', error);
        showToast('Failed to generate syllabus', 'error');
        hideLoading(loadingElement);
    } finally {
        button.disabled = false;
    }
}

// ===================================
// SECTION 2: MCQ
// ===================================

async function handleGenerateMCQs() {
    const loadingElement = document.getElementById('mcqLoading');
    const containerElement = document.getElementById('mcqContainer');
    const scoreTracker = document.getElementById('mcqScoreTracker');
    const button = document.getElementById('generateMCQBtn');
    
    showLoading(loadingElement);
    button.disabled = true;
    
    try {
        mcqData = await generateMCQs(currentSubject, currentTopic, 20);
        
        containerElement.innerHTML = '';
        mcqData.forEach((mcq, index) => {
            const mcqElement = createMCQElement(mcq, index);
            containerElement.appendChild(mcqElement);
        });
        
        // Update score tracker
        document.getElementById('mcqTotal').textContent = mcqData.length;
        document.getElementById('mcqTotalScore').textContent = mcqData.length;
        scoreTracker.classList.remove('hidden');
        
        hideLoading(loadingElement);
        showToast('MCQs generated successfully!', 'success');
        
    } catch (error) {
        console.error('Error generating MCQs:', error);
        showToast('Failed to generate MCQs', 'error');
        hideLoading(loadingElement);
    } finally {
        button.disabled = false;
    }
}

// Make function globally available
window.selectMCQOption = function(index, option) {
    if (mcqAnswers[index]) return; // Already answered
    
    const mcq = mcqData[index];
    const isCorrect = option === mcq.correct;
    
    mcqAnswers[index] = { option, isCorrect };
    
    // Update UI
    const questionElement = document.querySelector(`[data-index="${index}"]`);
    const options = questionElement.querySelectorAll('.mcq-option');
    
    options.forEach(opt => {
        opt.classList.add('disabled');
        const optionLetter = opt.dataset.option;
        
        if (optionLetter === mcq.correct) {
            opt.classList.add('correct');
        } else if (optionLetter === option && !isCorrect) {
            opt.classList.add('incorrect');
        }
    });
    
    // Show explanation
    const feedback = questionElement.querySelector('.mcq-feedback');
    const feedbackDiv = feedback.querySelector('div');
    feedbackDiv.className = `p-4 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900'}`;
    feedbackDiv.querySelector('p:first-child').innerHTML = `
        <i class="fas fa-${isCorrect ? 'check' : 'times'}-circle mr-2"></i>
        ${isCorrect ? 'Correct!' : 'Incorrect'}
    `;
    feedbackDiv.querySelector('p:last-child').textContent = mcq.explanation;
    feedback.classList.remove('hidden');
    
    // Update score
    updateMCQScore();
    
    // Save progress if all answered
    if (Object.keys(mcqAnswers).length === mcqData.length) {
        const correct = Object.values(mcqAnswers).filter(a => a.isCorrect).length;
        saveMCQScore(currentSubject, currentTopic, correct, mcqData.length);
        saveTopicProgress(currentSubject, currentTopic, 'mcq', {
            completed: true,
            score: correct,
            data: { total: mcqData.length }
        });
        showToast('MCQ section completed!', 'success');
    }
};

function updateMCQScore() {
    const answered = Object.keys(mcqAnswers).length;
    const correct = Object.values(mcqAnswers).filter(a => a.isCorrect).length;
    
    document.getElementById('mcqAnswered').textContent = answered;
    document.getElementById('mcqCorrect').textContent = correct;
    
    // Update header score
    document.getElementById('currentScore').textContent = correct;
    document.getElementById('totalScore').textContent = mcqData.length;
}

// ===================================
// SECTION 3: CODING
// ===================================

async function handleGenerateCoding() {
    const loadingElement = document.getElementById('codingLoading');
    const containerElement = document.getElementById('codingContainer');
    const button = document.getElementById('generateCodingBtn');
    
    showLoading(loadingElement);
    button.disabled = true;
    
    try {
        codingProblems = await generateCodingProblems(currentSubject, currentTopic, 5);
        
        containerElement.innerHTML = '';
        codingProblems.forEach((problem, index) => {
            const problemElement = createCodingProblemElement(problem, index, currentSubject);
            containerElement.appendChild(problemElement);
        });
        
        hideLoading(loadingElement);
        showToast('Coding problems generated!', 'success');
        
    } catch (error) {
        console.error('Error generating coding problems:', error);
        showToast('Failed to generate coding problems', 'error');
        hideLoading(loadingElement);
    } finally {
        button.disabled = false;
    }
}

window.submitCodingSolution = async function(index) {
    const problem = codingProblems[index];
    const textarea = document.querySelector(`textarea[data-problem-index="${index}"]`);
    const solution = textarea.value.trim();
    
    if (!solution) {
        showToast('Please write your solution first', 'warning');
        return;
    }
    
    const feedbackDiv = textarea.closest('.coding-problem').querySelector('.coding-feedback');
    feedbackDiv.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-purple-600"></div></div>';
    feedbackDiv.classList.remove('hidden');
    
    try {
        const evaluation = await evaluateSolution(problem.description, solution, currentSubject);
        
        feedbackDiv.innerHTML = `
            <div class="p-6 rounded-lg ${evaluation.isCorrect ? 'bg-green-50 dark:bg-green-900' : 'bg-yellow-50 dark:bg-yellow-900'}">
                <div class="flex items-center justify-between mb-4">
                    <h5 class="text-lg font-bold text-gray-900 dark:text-white">
                        <i class="fas fa-${evaluation.isCorrect ? 'check' : 'info'}-circle mr-2"></i>
                        Evaluation Result
                    </h5>
                    <span class="px-3 py-1 rounded-full ${evaluation.isCorrect ? 'bg-green-600' : 'bg-yellow-600'} text-white font-semibold">
                        Score: ${evaluation.score}/10
                    </span>
                </div>
                <div class="space-y-3 text-gray-700 dark:text-gray-200">
                    <p><strong>Time Complexity:</strong> ${evaluation.timeComplexity}</p>
                    <p><strong>Space Complexity:</strong> ${evaluation.spaceComplexity}</p>
                    <p><strong>Feedback:</strong> ${evaluation.feedback}</p>
                    ${evaluation.optimizedSolution ? `
                        <div class="mt-4">
                            <strong>Optimized Solution:</strong>
                            <pre class="bg-gray-800 text-gray-100 p-4 rounded mt-2 overflow-x-auto"><code>${evaluation.optimizedSolution}</code></pre>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Save score
        saveCodingScore(currentSubject, currentTopic, problem.title, evaluation.score, evaluation);
        saveTopicProgress(currentSubject, currentTopic, 'coding', {
            completed: true,
            score: evaluation.score,
            data: { problemsSolved: index + 1 }
        });
        
    } catch (error) {
        console.error('Error evaluating solution:', error);
        showToast('Failed to evaluate solution', 'error');
        feedbackDiv.classList.add('hidden');
    }
};

window.showHint = function(index) {
    showToast('Hint: Think about edge cases and optimize your approach', 'info');
};

// ===================================
// SECTION 4: INTERVIEW
// ===================================

async function handleGenerateInterview() {
    const loadingElement = document.getElementById('interviewLoading');
    const containerElement = document.getElementById('interviewContainer');
    const button = document.getElementById('generateInterviewBtn');
    
    showLoading(loadingElement);
    button.disabled = true;
    
    try {
        interviewQuestions = await generateInterviewQuestions(currentSubject, currentTopic, 10);
        
        containerElement.innerHTML = '';
        interviewQuestions.forEach((question, index) => {
            const questionElement = createInterviewQuestionElement(question, index);
            containerElement.appendChild(questionElement);
        });
        
        hideLoading(loadingElement);
        showToast('Interview questions generated!', 'success');
        
        saveTopicProgress(currentSubject, currentTopic, 'interview', {
            completed: true,
            data: { questionsViewed: interviewQuestions.length }
        });
        
    } catch (error) {
        console.error('Error generating interview questions:', error);
        showToast('Failed to generate interview questions', 'error');
        hideLoading(loadingElement);
    } finally {
        button.disabled = false;
    }
}

window.toggleInterviewQuestion = function(index) {
    const questions = document.querySelectorAll('.interview-question');
    const question = questions[index];
    const icon = question.querySelector('.fa-chevron-down');
    
    question.classList.toggle('expanded');
    icon.classList.toggle('rotate-180');
};

// ===================================
// SECTION 5: SIMULATOR
// ===================================

async function handleStartSimulator() {
    const chatInterface = document.getElementById('simulatorChat');
    const messagesContainer = document.getElementById('chatMessages');
    const button = document.getElementById('startSimulatorBtn');
    
    chatInterface.classList.remove('hidden');
    button.disabled = true;
    
    messagesContainer.innerHTML = '';
    simulatorHistory = [];
    
    // Get first question
    try {
        const question = await getInterviewQuestion(currentSubject, currentTopic, simulatorHistory);
        addChatMessage(question, false);
        simulatorHistory.push({ role: 'ai', content: question });
        
    } catch (error) {
        console.error('Error starting simulator:', error);
        showToast('Failed to start simulator', 'error');
    }
}

async function handleSendAnswer() {
    const input = document.getElementById('simulatorInput');
    const answer = input.value.trim();
    
    if (!answer) return;
    
    // Add user message
    addChatMessage(answer, true);
    simulatorHistory.push({ role: 'user', content: answer });
    input.value = '';
    
    // Get AI evaluation and next question
    try {
        const lastQuestion = simulatorHistory[simulatorHistory.length - 2]?.content || '';
        const feedback = await evaluateInterviewAnswer(lastQuestion, answer);
        
        addChatMessage(feedback, false);
        simulatorHistory.push({ role: 'ai', content: feedback });
        
        // Save progress
        saveTopicProgress(currentSubject, currentTopic, 'simulator', {
            completed: true,
            data: { messagesExchanged: simulatorHistory.length }
        });
        
    } catch (error) {
        console.error('Error in simulator:', error);
        showToast('Failed to get response', 'error');
    }
}

function addChatMessage(message, isUser) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageElement = createChatMessage(message, isUser);
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ===================================
// COMPLETION
// ===================================

function handleComplete() {
    saveTopicProgress(currentSubject, currentTopic, 'completed', {
        completed: true,
        data: { completedAt: new Date().toISOString() }
    });
    
    showToast('Congratulations! Topic completed!', 'success');
    
    setTimeout(() => {
        window.location.href = `topics.html?subject=${currentSubject}`;
    }, 2000);
}
