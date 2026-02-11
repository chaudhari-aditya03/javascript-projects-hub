/**
 * Topics Page Logic
 * Displays topics for selected subject
 */

import { showToast, createTopicCard, getURLParams } from './ui.js';
import { getTopicProgress } from './storage.js';

let currentSubject = null;
let currentCategory = 'all';
let allTopics = [];

// Initialize topics page
document.addEventListener('DOMContentLoaded', async () => {
    const params = getURLParams();
    if (!params.subject) {
        showToast('No subject selected', 'error');
        setTimeout(() => window.location.href = 'dashboard.html', 2000);
        return;
    }
    
    await loadTopics(params.subject);
});

/**
 * Load topics for subject
 */
async function loadTopics(subjectId) {
    try {
        const response = await fetch('data/subjects.json');
        if (!response.ok) throw new Error('Failed to load topics');
        
        const data = await response.json();
        const subject = data.subjects.find(s => s.id === subjectId);
        
        if (!subject) {
            throw new Error('Subject not found');
        }
        
        currentSubject = subject;
        allTopics = subject.topics || [];
        
        displaySubjectHeader(subject);
        displayCategoryTabs(subject.categories || ['Basics', 'Core', 'Advanced', 'Interview Focus']);
        displayTopics(allTopics);
        hideLoadingState();
        
    } catch (error) {
        console.error('Error loading topics:', error);
        showToast('Failed to load topics', 'error');
        hideLoadingState();
    }
}

/**
 * Display subject header
 */
function displaySubjectHeader(subject) {
    const iconElement = document.getElementById('subjectIcon');
    const titleElement = document.getElementById('subjectTitle');
    const descElement = document.getElementById('subjectDescription');
    const breadcrumb = document.getElementById('subjectBreadcrumb');
    
    if (iconElement) {
        iconElement.innerHTML = `<i class="${subject.icon}"></i>`;
    }
    
    if (titleElement) {
        titleElement.textContent = subject.name;
    }
    
    if (descElement) {
        descElement.textContent = subject.description;
    }
    
    if (breadcrumb) {
        breadcrumb.textContent = subject.name;
    }
}

/**
 * Display category tabs
 */
function displayCategoryTabs(categories) {
    const container = document.getElementById('categoryTabs');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Add "All" tab
    const allTab = createCategoryTab('All', 'all', true);
    container.appendChild(allTab);
    
    // Add category tabs
    categories.forEach(category => {
        const tab = createCategoryTab(category, category.toLowerCase(), false);
        container.appendChild(tab);
    });
}

/**
 * Create category tab
 */
function createCategoryTab(label, value, active = false) {
    const tab = document.createElement('button');
    tab.className = `category-tab ${active ? 'active' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`;
    tab.textContent = label;
    tab.onclick = () => filterByCategory(value, tab);
    tab.dataset.category = value;
    
    return tab;
}

/**
 * Filter topics by category
 */
function filterByCategory(category, tabElement) {
    currentCategory = category;
    
    // Update active tab
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
        tab.classList.add('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
    });
    
    tabElement.classList.add('active');
    tabElement.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
    
    // Filter topics
    let filtered = allTopics;
    if (category !== 'all') {
        filtered = allTopics.filter(topic => 
            topic.category && topic.category.toLowerCase() === category
        );
    }
    
    displayTopics(filtered);
}

/**
 * Display topics
 */
function displayTopics(topics) {
    const container = document.getElementById('topicsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (topics.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-20">
                <i class="fas fa-inbox text-6xl text-gray-400 mb-4"></i>
                <h3 class="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">No topics found</h3>
                <p class="text-gray-600 dark:text-gray-400">Try selecting a different category</p>
            </div>
        `;
        return;
    }
    
    topics.forEach((topic, index) => {
        const progress = getTopicProgress(currentSubject.id, topic.id);
        const card = createTopicCard(topic, currentSubject.id, progress);
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('card-reveal');
        container.appendChild(card);
    });
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    const loading = document.getElementById('loadingState');
    if (loading) loading.classList.add('hidden');
}
