/**
 * Dashboard Page Logic
 * Displays subject cards and statistics
 */

import { showToast, createSubjectCard } from './ui.js';
import { getStatistics, getOverallProgress } from './storage.js';

let subjectsData = [];

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadSubjects();
    displayStatistics();
    setupSearch();
});

/**
 * Load subjects from JSON
 */
async function loadSubjects() {
    try {
        const response = await fetch('data/subjects.json');
        if (!response.ok) throw new Error('Failed to load subjects');
        
        const data = await response.json();
        subjectsData = data.subjects;
        
        displaySubjects(subjectsData);
        hideLoadingState();
        
    } catch (error) {
        console.error('Error loading subjects:', error);
        showToast('Failed to load subjects', 'error');
        hideLoadingState();
    }
}

/**
 * Display subjects as cards
 */
function displaySubjects(subjects) {
    const container = document.getElementById('subjectsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (subjects.length === 0) {
        showEmptyState();
        return;
    }
    
    subjects.forEach((subject, index) => {
        const card = createSubjectCard(subject);
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('card-reveal');
        container.appendChild(card);
    });
}

/**
 * Display statistics
 */
function displayStatistics() {
    const stats = getStatistics();
    
    const elements = {
        completedTopics: document.getElementById('completedTopics'),
        mcqScore: document.getElementById('mcqScore'),
        codingSolved: document.getElementById('codingSolved'),
        studyTime: document.getElementById('studyTime'),
        overallProgress: document.getElementById('overallProgress')
    };
    
    if (elements.completedTopics) {
        elements.completedTopics.textContent = stats.completedTopics;
    }
    
    if (elements.mcqScore) {
        elements.mcqScore.textContent = stats.averageMCQScore + '%';
    }
    
    if (elements.codingSolved) {
        elements.codingSolved.textContent = stats.codingSolved;
    }
    
    if (elements.studyTime) {
        elements.studyTime.textContent = stats.studyTime + 'h';
    }
    
    if (elements.overallProgress) {
        elements.overallProgress.textContent = getOverallProgress();
    }
}

/**
 * Setup search functionality
 */
function setupSearch() {
    const searchInput = document.getElementById('searchSubjects');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query === '') {
            displaySubjects(subjectsData);
            return;
        }
        
        const filtered = subjectsData.filter(subject =>
            subject.name.toLowerCase().includes(query) ||
            subject.description.toLowerCase().includes(query)
        );
        
        displaySubjects(filtered);
        
        if (filtered.length === 0) {
            showEmptyState();
        }
    });
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    const loading = document.getElementById('loadingState');
    if (loading) loading.classList.add('hidden');
}

/**
 * Show empty state
 */
function showEmptyState() {
    const container = document.getElementById('subjectsContainer');
    const emptyState = document.getElementById('emptyState');
    
    if (container) container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
}
