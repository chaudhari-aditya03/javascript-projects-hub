/**
 * Main Application Module for HireSphere
 * Handles dashboard functionality and job display
 */

let allJobs = [];
let filteredJobs = [];
let currentPage = 1;
const jobsPerPage = 12;

/**
 * Initialize dashboard
 */
function initDashboard() {
  requireAuth();
  setupUI();
  setupEventListeners();
  loadInitialJobs();
}

/**
 * Setup UI for dashboard
 */
function setupUI() {
  const session = getCurrentSession();
  if (!session) return;

  // Update profile section
  const profileName = document.getElementById('profileName');
  if (profileName) {
    profileName.textContent = session.name;
  }

  // Set location filter default
  const locationFilter = document.getElementById('locationFilter');
  if (locationFilter && session.location) {
    locationFilter.value = session.location;
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Search input
  const jobSearchInput = document.getElementById('jobSearch');
  if (jobSearchInput) {
    jobSearchInput.addEventListener('input', debounce(searchJobs, 500));
    jobSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') searchJobs();
    });
  }

  // Search button
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', searchJobs);
  }

  // Filters
  const filters = ['jobTypeFilter', 'jobLevelFilter', 'locationFilter', 'salaryFilter'];
  filters.forEach(filterId => {
    const filter = document.getElementById(filterId);
    if (filter) {
      filter.addEventListener('change', applyFilters);
    }
  });

  // Reset button
  const resetBtn = document.getElementById('resetFiltersBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetFilters);
  }

  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logoutUser);
  }

  // Profile dropdown
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', () => {
      profileDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.profile-section')) {
        profileDropdown.classList.add('hidden');
      }
    });
  }
}

/**
 * Load initial jobs on page load
 */
async function loadInitialJobs() {
  showLoadingSpinner('jobsGrid');
  const session = getCurrentSession();
  const defaultSearch = session?.skills?.[0] || 'developer';
  const defaultLocation = session?.location || 'USA';
  
  const jobs = await fetchJobsFromAPI(defaultSearch, defaultLocation);
  allJobs = jobs;
  filteredJobs = [...allJobs];
  displayJobs(filteredJobs.slice(0, jobsPerPage));
  hideLoadingSpinner('jobsGrid');
}

/**
 * Search jobs
 */
async function searchJobs() {
  const jobTitle = document.getElementById('jobSearch')?.value.trim() || 'developer';
  const location = document.getElementById('locationFilter')?.value || 'USA';

  if (!jobTitle) {
    showError('Please enter a job title');
    return;
  }

  showLoadingSpinner('jobsGrid');
  console.log('🔎 Searching for:', jobTitle, 'in', location);

  const jobs = await fetchJobsFromAPI(jobTitle, location);
  allJobs = jobs;
  filteredJobs = [...allJobs];
  currentPage = 1;

  applyFilters();
  hideLoadingSpinner('jobsGrid');
}

/**
 * Apply filters to jobs
 */
function applyFilters() {
  const jobType = document.getElementById('jobTypeFilter')?.value || 'all';
  const jobLevel = document.getElementById('jobLevelFilter')?.value || 'all';
  const salary = document.getElementById('salaryFilter')?.value || 'all';

  let filtered = [...allJobs];

  // Filter by job type
  if (jobType !== 'all') {
    filtered = filtered.filter(job => job.jobType.toLowerCase() === jobType.toLowerCase());
  }

  // Filter by job level (from title/description)
  if (jobLevel !== 'all') {
    filtered = filtered.filter(job => {
      const text = (job.title + ' ' + job.description).toLowerCase();
      if (jobLevel === 'entry') return text.includes('junior') || text.includes('entry');
      if (jobLevel === 'mid') return !text.includes('senior') && !text.includes('junior');
      if (jobLevel === 'senior') return text.includes('senior') || text.includes('lead');
      return true;
    });
  }

  // Filter by salary
  if (salary !== 'all') {
    filtered = filtered.filter(job => {
      const salaryText = job.salary.toLowerCase();
      if (salary === 'low') return salaryText.includes('competitive') || salaryText.includes('$0') || salaryText.includes('$30') || salaryText.includes('$40') || salaryText.includes('$50');
      if (salary === 'mid') return salaryText.includes('$60') || salaryText.includes('$70') || salaryText.includes('$80') || salaryText.includes('$90');
      if (salary === 'high') return salaryText.includes('$100') || salaryText.includes('$120') || salaryText.includes('$150');
      return true;
    });
  }

  filteredJobs = filtered;
  currentPage = 1;
  displayJobs(filteredJobs.slice(0, jobsPerPage));
  updateResultsCount();
}

/**
 * Reset all filters
 */
function resetFilters() {
  document.getElementById('jobSearch').value = '';
  document.getElementById('jobTypeFilter').value = 'all';
  document.getElementById('jobLevelFilter').value = 'all';
  document.getElementById('locationFilter').value = getCurrentSession()?.location || 'USA';
  document.getElementById('salaryFilter').value = 'all';

  filteredJobs = [...allJobs];
  currentPage = 1;
  displayJobs(filteredJobs.slice(0, jobsPerPage));
  updateResultsCount();
  showSuccess('Filters reset');
}

/**
 * Display jobs in grid
 * @param {Array} jobs - Jobs to display
 */
function displayJobs(jobs) {
  const jobsGrid = document.getElementById('jobsGrid');
  if (!jobsGrid) return;

  if (jobs.length === 0) {
    jobsGrid.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <h3>No jobs found</h3>
        <p>Try adjusting your search criteria or filters</p>
      </div>
    `;
    jobsGrid.style.gridColumn = '1 / -1';
    return;
  }

  jobsGrid.style.gridColumn = 'auto';
  jobsGrid.innerHTML = jobs.map(job => createJobCard(job)).join('');

  // Add event listeners to job cards
  document.querySelectorAll('.job-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.save-btn')) {
        openJobDetails(card.dataset.jobId);
      }
    });

    const saveBtn = card.querySelector('.save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSaveJob(card.dataset.jobId, saveBtn);
      });
    }
  });
}

/**
 * Create job card HTML
 * @param {Object} job - Job object
 * @returns {string} HTML string
 */
function createJobCard(job) {
  const savedJobs = getSavedJobs();
  const isSaved = savedJobs.includes(job.id);
  const bgColor = generateRandomColor();
  const initials = getInitials(job.company);

  return `
    <div class="job-card bg-white rounded-xl shadow hover:shadow-lg transition transform hover:scale-[1.01] border border-gray-200" data-job-id="${job.id}">
      <div class="job-card-header flex justify-between items-center p-4">
        <div class="company-avatar w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style="background: ${bgColor};">
          ${initials}
        </div>
        <button class="save-btn ${isSaved ? 'saved' : ''} text-[#0A66C2] hover:text-[#004182]" title="Save job">
          <i class="fas fa-bookmark"></i>
        </button>
      </div>
      
      <div class="job-card-body px-4 pb-4">
        <h3 class="job-title text-lg font-semibold text-gray-900">${truncateText(job.title, 50)}</h3>
        <p class="company-name text-gray-700">${job.company}</p>
        
        <div class="job-meta flex flex-wrap gap-3 text-gray-600 mt-2">
          <span class="meta-item inline-flex items-center gap-2">
            <i class="fas fa-map-marker-alt"></i>
            ${job.location.city}, ${job.location.country}
          </span>
          <span class="meta-item inline-flex items-center gap-2">
            <i class="fas fa-briefcase"></i>
            ${job.jobType}
          </span>
        </div>
        
        <p class="job-description text-gray-700 mt-2">${truncateText(job.description, 80)}</p>
      </div>
      
      <div class="job-card-footer flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <div class="salary font-semibold text-[#0A66C2]">${job.salary}</div>
        <span class="posted-date text-gray-500">${job.postedDate}</span>
      </div>
    </div>
  `;
}

/**
 * Toggle save job for current user
 * @param {string} jobId - Job ID
 * @param {HTMLElement} button - Save button element
 */
function toggleSaveJob(jobId, button) {
  const session = getCurrentSession();
  if (!session) {
    showError('Please login to save jobs');
    return;
  }

  button.classList.toggle('saved');
  saveJobForLater(jobId);
}

/**
 * Open job details modal
 * @param {string} jobId - Job ID
 */
function openJobDetails(jobId) {
  const job = allJobs.find(j => j.id === jobId);
  if (!job) return;

  const modal = document.getElementById('jobDetailsModal');
  if (!modal) return;

  const content = document.getElementById('jobDetailsContent');
  const savedJobs = getSavedJobs();
  const isSaved = savedJobs.includes(job.id);

  content.innerHTML = `
    <div class="modal-job-header flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-gray-900">${job.title}</h2>
        <p class="company-name text-gray-700">${job.company}</p>
      </div>
      <button class="close-modal text-gray-600 hover:text-gray-900" onclick="closeJobDetails()">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div class="modal-job-meta grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      <div class="meta-box flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <i class="fas fa-map-marker-alt text-[#0A66C2]"></i>
        <div>
          <span class="label text-xs font-semibold text-gray-600">Location</span>
          <span class="value block text-gray-800">${job.location.city}, ${job.location.country}</span>
        </div>
      </div>
      
      <div class="meta-box flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <i class="fas fa-briefcase text-[#0A66C2]"></i>
        <div>
          <span class="label text-xs font-semibold text-gray-600">Job Type</span>
          <span class="value block text-gray-800">${job.jobType}</span>
        </div>
      </div>
      
      <div class="meta-box flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <i class="fas fa-dollar-sign text-[#0A66C2]"></i>
        <div>
          <span class="label text-xs font-semibold text-gray-600">Salary</span>
          <span class="value block text-gray-800">${job.salary}</span>
        </div>
      </div>
      
      <div class="meta-box flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <i class="fas fa-calendar text-[#0A66C2]"></i>
        <div>
          <span class="label text-xs font-semibold text-gray-600">Posted</span>
          <span class="value block text-gray-800">${job.postedDate}</span>
        </div>
      </div>
    </div>

    <div class="modal-job-description mt-6">
      <h3 class="text-lg font-semibold text-gray-900">About this job</h3>
      <p class="text-gray-700 mt-2">${job.description}</p>
    </div>

    <div class="modal-job-skills ${job.skills?.length ? '' : 'hidden'} mt-6">
      <h3 class="text-lg font-semibold text-gray-900">Required Skills</h3>
      <div class="skills-list flex flex-wrap gap-2 mt-2">
        ${job.skills?.slice(0, 5).map(skill => `<span class="skill-tag inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">${skill}</span>`).join('') || ''}
      </div>
    </div>

    <div class="modal-actions mt-6 flex gap-3">
      <button class="btn-save ${isSaved ? 'saved' : ''} inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100 ${isSaved ? 'bg-gray-100' : ''}" onclick="toggleSaveJob('${job.id}', this)">
        <i class="fas fa-bookmark"></i>
        ${isSaved ? 'Saved' : 'Save Job'}
      </button>
      <a href="${job.jobUrl || '#'}" class="btn-apply inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A66C2] text-white font-semibold hover:bg-[#004182]" target="_blank">
        <i class="fas fa-paper-plane"></i>
        Apply Now
      </a>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

/**
 * Close job details modal
 */
function closeJobDetails() {
  const modal = document.getElementById('jobDetailsModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

/**
 * Update results count
 */
function updateResultsCount() {
  const resultsCount = document.getElementById('resultsCount');
  if (resultsCount) {
    resultsCount.textContent = `Found ${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''}`;
  }
}

/**
 * Load more jobs (pagination)
 */
function loadMore() {
  const nextPage = currentPage + 1;
  const startIdx = nextPage * jobsPerPage;
  const endIdx = startIdx + jobsPerPage;

  if (startIdx >= filteredJobs.length) {
    showError('No more jobs to load');
    return;
  }

  const newJobs = filteredJobs.slice(startIdx, endIdx);
  const jobsGrid = document.getElementById('jobsGrid');
  
  if (jobsGrid) {
    jobsGrid.innerHTML += newJobs.map(job => createJobCard(job)).join('');
  }

  currentPage = nextPage;
  showSuccess('Loaded more jobs');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initDashboard);
