/**
 * LocalStorage Manager
 * Handles all data persistence
 */

const STORAGE_KEYS = {
    PROGRESS: 'revisex_progress',
    SCORES: 'revisex_scores',
    COMPLETED_TOPICS: 'revisex_completed',
    THEME: 'revisex_theme',
    USER_DATA: 'revisex_user'
};

/**
 * Save progress for a specific topic
 */
export function saveTopicProgress(subject, topic, section, data) {
    try {
        const progress = getProgress();
        
        if (!progress[subject]) {
            progress[subject] = {};
        }
        
        if (!progress[subject][topic]) {
            progress[subject][topic] = {
                sections: {},
                lastAccessed: new Date().toISOString(),
                completionPercentage: 0
            };
        }
        
        progress[subject][topic].sections[section] = {
            completed: data.completed || false,
            score: data.score || 0,
            data: data.data || {},
            timestamp: new Date().toISOString()
        };
        
        // Update completion percentage
        const sections = Object.keys(progress[subject][topic].sections);
        const completedSections = sections.filter(s => progress[subject][topic].sections[s].completed);
        progress[subject][topic].completionPercentage = Math.round((completedSections.length / 5) * 100);
        progress[subject][topic].lastAccessed = new Date().toISOString();
        
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
        return true;
    } catch (error) {
        console.error('Failed to save progress:', error);
        return false;
    }
}

/**
 * Get all progress data
 */
export function getProgress() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error('Failed to get progress:', error);
        return {};
    }
}

/**
 * Get progress for specific topic
 */
export function getTopicProgress(subject, topic) {
    const progress = getProgress();
    return progress[subject]?.[topic] || null;
}

/**
 * Save MCQ score
 */
export function saveMCQScore(subject, topic, correct, total) {
    try {
        const scores = getScores();
        
        if (!scores.mcq) {
            scores.mcq = {};
        }
        
        const key = `${subject}_${topic}`;
        if (!scores.mcq[key]) {
            scores.mcq[key] = [];
        }
        
        scores.mcq[key].push({
            correct,
            total,
            percentage: Math.round((correct / total) * 100),
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
        return true;
    } catch (error) {
        console.error('Failed to save MCQ score:', error);
        return false;
    }
}

/**
 * Save coding score
 */
export function saveCodingScore(subject, topic, problemTitle, score, evaluation) {
    try {
        const scores = getScores();
        
        if (!scores.coding) {
            scores.coding = {};
        }
        
        const key = `${subject}_${topic}`;
        if (!scores.coding[key]) {
            scores.coding[key] = [];
        }
        
        scores.coding[key].push({
            problemTitle,
            score,
            evaluation,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
        return true;
    } catch (error) {
        console.error('Failed to save coding score:', error);
        return false;
    }
}

/**
 * Get all scores
 */
export function getScores() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.SCORES);
        return data ? JSON.parse(data) : { mcq: {}, coding: {} };
    } catch (error) {
        console.error('Failed to get scores:', error);
        return { mcq: {}, coding: {} };
    }
}

/**
 * Get statistics for dashboard
 */
export function getStatistics() {
    const progress = getProgress();
    const scores = getScores();
    
    let completedTopics = 0;
    let totalMCQScore = 0;
    let mcqCount = 0;
    let codingSolved = 0;
    
    // Count completed topics
    Object.values(progress).forEach(subject => {
        Object.values(subject).forEach(topic => {
            if (topic.completionPercentage === 100) {
                completedTopics++;
            }
        });
    });
    
    // Calculate average MCQ score
    if (scores.mcq) {
        Object.values(scores.mcq).forEach(topicScores => {
            topicScores.forEach(score => {
                totalMCQScore += score.percentage;
                mcqCount++;
            });
        });
    }
    
    // Count coding problems solved
    if (scores.coding) {
        Object.values(scores.coding).forEach(topicScores => {
            codingSolved += topicScores.length;
        });
    }
    
    return {
        completedTopics,
        averageMCQScore: mcqCount > 0 ? Math.round(totalMCQScore / mcqCount) : 0,
        codingSolved,
        studyTime: calculateStudyTime()
    };
}

/**
 * Calculate total study time
 */
function calculateStudyTime() {
    const progress = getProgress();
    let totalMinutes = 0;
    
    Object.values(progress).forEach(subject => {
        Object.values(subject).forEach(topic => {
            if (topic.sections) {
                totalMinutes += Object.keys(topic.sections).length * 15; // Estimate 15 min per section
            }
        });
    });
    
    return Math.round(totalMinutes / 60); // Return hours
}

/**
 * Get overall progress percentage
 */
export function getOverallProgress() {
    const progress = getProgress();
    let totalTopics = 0;
    let totalProgress = 0;
    
    Object.values(progress).forEach(subject => {
        Object.values(subject).forEach(topic => {
            totalTopics++;
            totalProgress += topic.completionPercentage || 0;
        });
    });
    
    return totalTopics > 0 ? Math.round(totalProgress / totalTopics) : 0;
}

/**
 * Mark topic as completed
 */
export function markTopicCompleted(subject, topic) {
    try {
        const completed = getCompletedTopics();
        const key = `${subject}_${topic}`;
        
        if (!completed.includes(key)) {
            completed.push(key);
            localStorage.setItem(STORAGE_KEYS.COMPLETED_TOPICS, JSON.stringify(completed));
        }
        
        return true;
    } catch (error) {
        console.error('Failed to mark topic as completed:', error);
        return false;
    }
}

/**
 * Get completed topics
 */
export function getCompletedTopics() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_TOPICS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Failed to get completed topics:', error);
        return [];
    }
}

/**
 * Check if topic is completed
 */
export function isTopicCompleted(subject, topic) {
    const completed = getCompletedTopics();
    return completed.includes(`${subject}_${topic}`);
}

/**
 * Save theme preference
 */
export function saveTheme(theme) {
    try {
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
        return true;
    } catch (error) {
        console.error('Failed to save theme:', error);
        return false;
    }
}

/**
 * Get theme preference
 */
export function getTheme() {
    try {
        return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    } catch (error) {
        console.error('Failed to get theme:', error);
        return 'light';
    }
}

/**
 * Clear all data (for reset/logout)
 */
export function clearAllData() {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            if (key !== STORAGE_KEYS.THEME) { // Keep theme preference
                localStorage.removeItem(key);
            }
        });
        return true;
    } catch (error) {
        console.error('Failed to clear data:', error);
        return false;
    }
}

/**
 * Export data for backup
 */
export function exportData() {
    try {
        const data = {
            progress: getProgress(),
            scores: getScores(),
            completed: getCompletedTopics(),
            exportDate: new Date().toISOString()
        };
        
        return JSON.stringify(data, null, 2);
    } catch (error) {
        console.error('Failed to export data:', error);
        return null;
    }
}

/**
 * Import data from backup
 */
export function importData(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        
        if (data.progress) {
            localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(data.progress));
        }
        
        if (data.scores) {
            localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(data.scores));
        }
        
        if (data.completed) {
            localStorage.setItem(STORAGE_KEYS.COMPLETED_TOPICS, JSON.stringify(data.completed));
        }
        
        return true;
    } catch (error) {
        console.error('Failed to import data:', error);
        return false;
    }
}
