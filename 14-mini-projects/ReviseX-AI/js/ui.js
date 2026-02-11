/**
 * UI Utilities
 * Reusable UI components and helpers
 */

/**
 * Show toast notification
 */
export function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    toast.innerHTML = `
        <i class="fas ${iconMap[type]}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="ml-auto text-white hover:opacity-80">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Show loading state
 */
export function showLoading(element) {
    if (!element) return;
    element.classList.remove('hidden');
}

/**
 * Hide loading state
 */
export function hideLoading(element) {
    if (!element) return;
    element.classList.add('hidden');
}

/**
 * Create subject card
 */
export function createSubjectCard(subject) {
    const card = document.createElement('div');
    card.className = 'subject-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors duration-300';
    card.onclick = () => navigateToTopics(subject.id);
    
    card.innerHTML = `
        <div class="text-center">
            <div class="subject-icon ${subject.color || 'text-blue-600'}">
                <i class="${subject.icon}"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">${subject.name}</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">${subject.description}</p>
            <div class="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <i class="fas fa-book"></i>
                <span>${subject.topicCount || 0} Topics</span>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Create topic card
 */
export function createTopicCard(topic, subject, progress = null) {
    const card = document.createElement('div');
    card.className = 'topic-card bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300';
    card.onclick = () => navigateToLearn(subject, topic.id);
    
    let progressBadge = '';
    if (progress) {
        const badgeClass = progress.completionPercentage === 100 ? 'completed' : 
                          progress.completionPercentage > 0 ? 'in-progress' : 'not-started';
        progressBadge = `<span class="progress-badge ${badgeClass}">${progress.completionPercentage}%</span>`;
    }
    
    card.innerHTML = `
        ${progressBadge}
        <div class="flex items-start space-x-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                <i class="${topic.icon || 'fas fa-code'}"></i>
            </div>
            <div class="flex-1">
                <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">${topic.name}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">${topic.description || ''}</p>
                <div class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span><i class="fas fa-clock mr-1"></i>${topic.duration || '30 min'}</span>
                    <span class="px-2 py-1 rounded-full ${getDifficultyColor(topic.difficulty)}">
                        ${topic.difficulty || 'Medium'}
                    </span>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Create MCQ question element
 */
export function createMCQElement(mcq, index) {
    const div = document.createElement('div');
    div.className = 'mcq-question bg-gray-50 dark:bg-gray-900 rounded-lg p-6';
    div.dataset.index = index;
    
    div.innerHTML = `
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ${index + 1}. ${mcq.question}
        </h4>
        <div class="space-y-3" data-mcq-options="${index}">
            ${Object.entries(mcq.options).map(([key, value]) => `
                <div class="mcq-option" data-option="${key}" onclick="selectMCQOption(${index}, '${key}')">
                    <span class="font-semibold mr-2">${key}.</span>
                    <span>${value}</span>
                </div>
            `).join('')}
        </div>
        <div class="mcq-feedback mt-4 hidden">
            <div class="p-4 rounded-lg">
                <p class="font-semibold mb-2"></p>
                <p class="text-sm"></p>
            </div>
        </div>
    `;
    
    return div;
}

/**
 * Create coding problem element
 */
export function createCodingProblemElement(problem, index, language) {
    const div = document.createElement('div');
    div.className = 'coding-problem bg-gray-50 dark:bg-gray-900 rounded-lg p-6';
    
    div.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <h4 class="text-xl font-bold text-gray-900 dark:text-white">${index + 1}. ${problem.title}</h4>
            <span class="px-3 py-1 rounded-full text-sm ${getDifficultyColor(problem.difficulty)}">
                ${problem.difficulty}
            </span>
        </div>
        
        <div class="prose dark:prose-invert max-w-none mb-4">
            <p class="text-gray-700 dark:text-gray-300">${problem.description}</p>
            
            ${problem.inputFormat ? `
                <p class="mt-2"><strong>Input:</strong> ${problem.inputFormat}</p>
            ` : ''}
            
            ${problem.outputFormat ? `
                <p><strong>Output:</strong> ${problem.outputFormat}</p>
            ` : ''}
            
            ${problem.examples && problem.examples.length > 0 ? `
                <div class="mt-3">
                    <strong>Example:</strong>
                    ${problem.examples.map((ex, i) => `
                        <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-2">
                            <p><strong>Input:</strong> <code>${ex.input}</code></p>
                            <p><strong>Output:</strong> <code>${ex.output}</code></p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
        
        <div class="mb-3">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Your Solution:
            </label>
            <textarea 
                class="code-editor w-full" 
                rows="12"
                placeholder="Write your ${language} code here..."
                data-problem-index="${index}"
            ></textarea>
        </div>
        
        <div class="flex space-x-3">
            <button 
                onclick="submitCodingSolution(${index})"
                class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
                <i class="fas fa-check mr-2"></i>Submit Solution
            </button>
            <button 
                onclick="showHint(${index})"
                class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
                <i class="fas fa-lightbulb mr-2"></i>Hint
            </button>
        </div>
        
        <div class="coding-feedback mt-4 hidden">
            <!-- Feedback will be shown here -->
        </div>
    `;
    
    return div;
}

/**
 * Create interview question element
 */
export function createInterviewQuestionElement(question, index) {
    const div = document.createElement('div');
    div.className = 'interview-question';
    
    div.innerHTML = `
        <div class="interview-question-header" onclick="toggleInterviewQuestion(${index})">
            <div class="flex items-center justify-between">
                <span class="text-gray-900 dark:text-white">${index + 1}. ${question.question}</span>
                <i class="fas fa-chevron-down text-gray-500 dark:text-gray-400 transform transition-transform"></i>
            </div>
        </div>
        <div class="interview-question-content">
            <div class="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg mb-3">
                <h5 class="font-semibold text-gray-900 dark:text-white mb-2">
                    <i class="fas fa-check-circle text-green-600 mr-2"></i>Best Answer:
                </h5>
                <p class="text-gray-700 dark:text-gray-300">${question.answer}</p>
            </div>
            
            ${question.keyPoints && question.keyPoints.length > 0 ? `
                <div class="mb-3">
                    <h5 class="font-semibold text-gray-900 dark:text-white mb-2">
                        <i class="fas fa-list text-blue-600 mr-2"></i>Key Points to Mention:
                    </h5>
                    <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                        ${question.keyPoints.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${question.followUp ? `
                <div class="bg-yellow-50 dark:bg-gray-700 p-3 rounded-lg">
                    <h5 class="font-semibold text-gray-900 dark:text-white mb-1">
                        <i class="fas fa-question-circle text-yellow-600 mr-2"></i>Follow-up:
                    </h5>
                    <p class="text-gray-700 dark:text-gray-300 text-sm">${question.followUp}</p>
                </div>
            ` : ''}
        </div>
    `;
    
    return div;
}

/**
 * Create chat message element
 */
export function createChatMessage(message, isUser = false) {
    const div = document.createElement('div');
    div.className = `chat-message ${isUser ? 'user' : 'ai'}`;
    
    if (!isUser) {
        div.innerHTML = `
            <div class="flex items-start space-x-2">
                <i class="fas fa-robot text-blue-600"></i>
                <div>${message}</div>
            </div>
        `;
    } else {
        div.innerHTML = `
            <div class="flex items-start space-x-2">
                <div>${message}</div>
                <i class="fas fa-user"></i>
            </div>
        `;
    }
    
    return div;
}

/**
 * Get difficulty color classes
 */
function getDifficultyColor(difficulty) {
    const colors = {
        'Easy': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
        'Medium': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
        'Hard': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    };
    return colors[difficulty] || colors['Medium'];
}

/**
 * Navigate to topics page
 */
function navigateToTopics(subjectId) {
    window.location.href = `topics.html?subject=${encodeURIComponent(subjectId)}`;
}

/**
 * Navigate to learn page
 */
function navigateToLearn(subject, topicId) {
    window.location.href = `learn.html?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topicId)}`;
}

/**
 * Get URL parameters
 */
export function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        subject: params.get('subject'),
        topic: params.get('topic'),
        category: params.get('category')
    };
}

/**
 * Format date
 */
export function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
}

/**
 * Scroll to element smoothly
 */
export function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Animate counter
 */
export function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 20);
}

// Make functions globally available for onclick handlers
window.navigateToTopics = navigateToTopics;
window.navigateToLearn = navigateToLearn;
