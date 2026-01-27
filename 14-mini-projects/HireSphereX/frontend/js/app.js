// ============================================================================
// APP.JS - Dashboard Application Logic for HireSphere X
// Handles: Dashboard initialization, search, filters, job display, modal
// ============================================================================

let allJobs = [];
let filteredJobs = [];
let currentPage = 0;
let totalPages = 0;
let pageSize = 12;
let lastSource = 'backend';

/**
 * Initialize dashboard
 */
async function initDashboard() {
  // Check authentication
  if (!requireAuth()) {
    return;
  }

  // Load and display current user info
  try {
    const profile = await fetchProfile();
    document.getElementById('profileName').textContent = profile.fullName || profile.email.split('@')[0];
    document.getElementById('profileEmail').textContent = profile.email;
  } catch (err) {
    const session = getCurrentSession();
    if (session) {
      document.getElementById('profileName').textContent = session.email.split('@')[0];
      document.getElementById('profileEmail').textContent = session.email;
    }
  }

  // Setup event listeners
  setupEventListeners();

  // Load initial jobs
  await loadInitialJobs();

  // Toggle profile dropdown
  document.getElementById('profileBtn').addEventListener('click', () => {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('hidden');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.profile-section')) {
      document.getElementById('profileDropdown').classList.add('hidden');
    }
  });
}

/**
 * Load initial jobs
 */
async function loadInitialJobs() {
  try {
    showLoadingSpinner();
    let response;
    try {
      response = await fetchAllJobs(0, pageSize);
      lastSource = response.source || 'backend';
    } catch (backendErr) {
      response = await fetchJobsFromRapidAPI('developer', 'USA');
      lastSource = 'rapidapi';
    }
    allJobs = response.jobs;
    filteredJobs = response.jobs;
    currentPage = response.currentPage || 0;
    totalPages = response.totalPages || 1;
    pageSize = response.pageSize || pageSize;
    hideLoadingSpinner();
    displayJobs(filteredJobs);
    updateResultsCount(allJobs.length, true);
    renderSavedJobs();
  } catch (error) {
    hideLoadingSpinner();
    console.error('Error loading jobs:', error);
    showError('Failed to load jobs. Please refresh the page.');
    document.getElementById('resultsCount').textContent = 'Error loading jobs';
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Search button
  document.getElementById('searchBtn').addEventListener('click', searchJobs);

  // Enter key in search input
  document.getElementById('jobSearch').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchJobs();
    }
  });

  // Filters
  document.getElementById('jobTypeFilter').addEventListener('change', applyFilters);
  document.getElementById('locationFilter').addEventListener('change', applyFilters);

  // Reset filters
  document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);
}

/**
 * Search jobs
 */
async function searchJobs() {
  try {
    const keyword = document.getElementById('jobSearch').value.trim();
    const location = document.getElementById('locationFilter').value;

    showLoadingSpinner();
    let response;
    try {
      response = await fetchBackendJobs({ keyword, location, page: 0, size: pageSize });
      lastSource = 'backend';
    } catch (backendErr) {
      response = await fetchJobsFromRapidAPI(keyword || 'developer', location || 'Global');
      lastSource = 'rapidapi';
    }
    allJobs = response.jobs;
    filteredJobs = response.jobs;
    currentPage = 0;
    totalPages = response.totalPages || 1;
    hideLoadingSpinner();
    displayJobs(filteredJobs);
    updateResultsCount(filteredJobs.length, false);
    renderSavedJobs();
  } catch (error) {
    hideLoadingSpinner();
    console.error('Search error:', error);
    showError('Failed to search jobs');
  }
}

/**
 * Apply filters to jobs
 */
function applyFilters() {
  const jobTypeFilter = document.getElementById('jobTypeFilter').value;
  const keyword = document.getElementById('jobSearch').value.trim();
  const location = document.getElementById('locationFilter').value;

  filteredJobs = allJobs.filter((job) => {
    const matchesType = !jobTypeFilter || job.jobType === jobTypeFilter;
    const jobLocation = typeof job.location === 'string' ? job.location : (job.location?.city || '') + ' ' + (job.location?.country || '');
    const matchesLocation = !location || jobLocation.toLowerCase().includes(location.toLowerCase());
    const matchesKeyword =
      !keyword ||
      job.title.toLowerCase().includes(keyword.toLowerCase()) ||
      job.company.toLowerCase().includes(keyword.toLowerCase());

    return matchesType && matchesLocation && matchesKeyword;
  });

  currentPage = 0;
  displayJobs(filteredJobs);
  updateResultsCount(filteredJobs.length, false);
  updateStats();
}

/**
 * Reset filters
 */
function resetFilters() {
  document.getElementById('jobSearch').value = '';
  document.getElementById('jobTypeFilter').value = '';
  document.getElementById('locationFilter').value = '';
  allJobs = [];
  filteredJobs = [];
  currentPage = 0;
  loadInitialJobs();
}

/**
 * Display jobs in grid
 */
function displayJobs(jobs) {
  const jobsGrid = document.getElementById('jobsGrid');
  jobsGrid.innerHTML = '';

  if (jobs.length === 0) {
    jobsGrid.innerHTML = `
      <div class="col-span-full text-center py-12">
        <i class="fas fa-inbox text-5xl text-gray-300 mb-4"></i>
        <p class="text-gray-600 text-lg">No jobs found</p>
      </div>
    `;
    return;
  }

  jobs.forEach((job) => {
    const jobCard = createJobCard(job);
    jobsGrid.appendChild(jobCard);
  });

  updateStats();

  // Show/hide load more button
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (currentPage < totalPages - 1) {
    loadMoreBtn.style.display = 'inline-flex';
  } else {
    loadMoreBtn.style.display = 'none';
  }
}

/**
 * Create a job card element
 */
function createJobCard(job) {
  const card = document.createElement('div');
  card.className = 'job-card bg-white rounded-xl p-5 border border-gray-200 shadow hover:shadow-lg transition cursor-pointer';
  card.onclick = () => openJobDetails(job);

  const isJobSaved = isJobSaved(job.id);
  const color = generateRandomColor();

  card.innerHTML = `
    <div class="flex items-start gap-4">
      <div class="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg" style="background-color: ${color};">
        ${getInitials(job.company)}
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-[#0A66C2] truncate">${job.title}</h3>
        <p class="text-gray-600 text-sm">${job.company}</p>
        <div class="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <i class="fas fa-map-marker-alt"></i> ${typeof job.location === 'string' ? job.location : job.location?.city || 'Remote'}
          <span>•</span>
          <i class="fas fa-clock"></i> ${job.postedDateFormatted || formatDateRelative(job.postedDate)}
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
          ${job.skills.slice(0, 3).map((skill) => `
            <span class="px-2 py-1 bg-blue-50 text-[#0A66C2] text-xs rounded font-medium">${skill.name}</span>
          `).join('')}
          ${job.skills.length > 3 ? `<span class="text-xs text-gray-500 px-2 py-1">+${job.skills.length - 3}</span>` : ''}
        </div>
        <div class="mt-3 flex justify-between items-center">
          <span class="font-semibold text-gray-900">${job.salary.formatted || formatSalaryRange(job.salary?.min, job.salary?.max, job.salary?.currency)}</span>
          <button class="save-btn p-2 rounded-lg transition" data-job-id="${job.id}" onclick="event.stopPropagation();">
            <i class="fas fa-bookmark ${isJobSaved ? 'text-[#0A66C2]' : 'text-gray-400'} text-lg"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  // Save job button
  const saveBtn = card.querySelector('.save-btn');
  saveBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isSaved = toggleSaveJob(job.id, job.title);
    const icon = saveBtn.querySelector('i');
    icon.classList.toggle('text-[#0A66C2]');
    icon.classList.toggle('text-gray-400');
    renderSavedJobs();
    updateStats();
  });

  return card;
}

/**
 * Open job details modal
 */
function openJobDetails(job) {
  const modal = document.getElementById('jobDetailsModal');
  const content = document.getElementById('jobDetailsContent');

  const isSaved = isJobSaved(job.id);
  const color = generateRandomColor();

  content.innerHTML = `
    <div class="flex items-start justify-between mb-6">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-2xl" style="background-color: ${color};">
          ${getInitials(job.company)}
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">${job.title}</h1>
          <p class="text-xl text-gray-600 mt-2">${job.company}</p>
        </div>
      </div>
      <button onclick="closeJobDetails()" class="text-gray-500 hover:text-gray-700">
        <i class="fas fa-times text-2xl"></i>
      </button>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <div>
        <p class="text-xs font-semibold text-gray-600 uppercase">Job Type</p>
        <p class="text-lg font-semibold text-gray-900 mt-1">${job.jobType}</p>
      </div>
      <div>
        <p class="text-xs font-semibold text-gray-600 uppercase">Location</p>
        <p class="text-lg font-semibold text-gray-900 mt-1">${job.location}</p>
      </div>
      <div>
        <p class="text-xs font-semibold text-gray-600 uppercase">Salary</p>
        <p class="text-lg font-semibold text-gray-900 mt-1">${job.salary.formatted}</p>
      </div>
      <div>
        <p class="text-xs font-semibold text-gray-600 uppercase">Posted</p>
        <p class="text-lg font-semibold text-gray-900 mt-1">${job.postedDateFormatted}</p>
      </div>
    </div>

    <div class="mb-6">
      <h3 class="text-xl font-bold text-gray-900 mb-3">About the job</h3>
      <p class="text-gray-700 leading-relaxed">${job.description}</p>
    </div>

    ${job.skills.length > 0 ? `
      <div class="mb-6">
        <h3 class="text-xl font-bold text-gray-900 mb-3">Skills required</h3>
        <div class="flex flex-wrap gap-2">
          ${job.skills.map((skill) => `
            <span class="px-3 py-2 bg-blue-50 text-[#0A66C2] rounded-lg font-medium">${skill.name}</span>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <div class="flex gap-3 mt-8 border-t pt-6">
      <button class="flex-1 bg-[#0A66C2] text-white font-semibold rounded-lg px-6 py-3 hover:bg-[#004182] transition" onclick="applyJob(${job.id})">
        <i class="fas fa-paper-plane mr-2"></i> Apply Now
      </button>
      <button id="jobSaveBtn" class="px-6 py-3 border border-[#0A66C2] text-[#0A66C2] font-semibold rounded-lg hover:bg-blue-50 transition" onclick="event.stopPropagation();">
        <i class="fas fa-bookmark ${isSaved ? 'text-[#0A66C2]' : ''} mr-2"></i> ${isSaved ? 'Saved' : 'Save Job'}
      </button>
    </div>
  `;

  const jobSaveBtn = content.querySelector('#jobSaveBtn');
  jobSaveBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isSaved = toggleSaveJob(job.id, job.title);
    jobSaveBtn.innerHTML = `
      <i class="fas fa-bookmark ${isSaved ? 'text-[#0A66C2]' : ''} mr-2"></i> ${isSaved ? 'Saved' : 'Save Job'}
    `;
    renderSavedJobs();
    updateStats();
  });

  modal.classList.remove('hidden');
}

/**
 * Close job details modal
 */
function closeJobDetails() {
  const modal = document.getElementById('jobDetailsModal');
  modal.classList.add('hidden');
}

/**
 * Apply for a job (placeholder)
 */
function applyJob(jobId) {
  showSuccess('Application submitted! We\'ll notify you soon.');
  closeJobDetails();
  // TODO: Implement actual application submission to backend
  // POST /api/v1/jobs/:jobId/apply
}

/**
 * Load more jobs
 */
async function loadMore() {
  try {
    const nextPage = currentPage + 1;
    if (nextPage >= totalPages) {
      showError('No more jobs to load');
      return;
    }

    showLoadingSpinner();
    const keyword = document.getElementById('jobSearch').value.trim();
    const location = document.getElementById('locationFilter').value;
    let response;
    try {
      response = await fetchBackendJobs({ keyword, location, page: nextPage, size: pageSize });
      lastSource = 'backend';
    } catch (backendErr) {
      response = await fetchJobsFromRapidAPI(keyword || 'developer', location || 'Global');
      lastSource = 'rapidapi';
    }
    hideLoadingSpinner();

    allJobs = [...allJobs, ...response.jobs];
    filteredJobs = allJobs;
    currentPage = nextPage;
    totalPages = response.totalPages;

    displayJobs(filteredJobs);
    updateResultsCount(filteredJobs.length, false);
  } catch (error) {
    hideLoadingSpinner();
    console.error('Load more error:', error);
    showError('Failed to load more jobs');
  }
}

/**
 * Update results count text
 */
function updateResultsCount(count, isInitial) {
  const countText = isInitial ? `${count} jobs available` : `${count} results found`;
  document.getElementById('resultsCount').textContent = countText;
  const meta = document.getElementById('resultsMeta');
  if (meta) meta.textContent = lastSource === 'backend' ? 'Powered by backend' : 'Powered by RapidAPI fallback';
}

function renderSavedJobs() {
  const savedList = document.getElementById('savedJobsList');
  if (!savedList) return;
  const savedJobs = getSavedJobs();
  if (savedJobs.length === 0) {
    savedList.innerHTML = '<p class="text-gray-500">No saved jobs yet</p>';
    updateStats();
    return;
  }
  savedList.innerHTML = '';
  savedJobs.slice(0, 6).forEach((job) => {
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between gap-2 p-2 bg-gray-50 rounded-lg';
    row.innerHTML = `
      <div class="flex-1">
        <p class="font-semibold text-sm text-gray-900">${job.title}</p>
        <p class="text-xs text-gray-500">Saved ${formatDateRelative(job.savedAt)}</p>
      </div>
      <button class="text-xs text-red-500" aria-label="Remove">Remove</button>
    `;
    const btn = row.querySelector('button');
    btn.addEventListener('click', () => {
      toggleSaveJob(job.id, job.title);
      renderSavedJobs();
      updateStats();
    });
    savedList.appendChild(row);
  });
  updateStats();
}

function updateStats() {
  const statTotal = document.getElementById('statTotal');
  const statSaved = document.getElementById('statSaved');
  const statSource = document.getElementById('statSource');
  if (statTotal) statTotal.textContent = filteredJobs.length || allJobs.length || '--';
  if (statSaved) statSaved.textContent = getSavedJobs().length;
  if (statSource) statSource.textContent = lastSource === 'backend' ? 'Backend' : 'RapidAPI';
}
