// ============================================================================
// API.JS - Backend + RapidAPI bridge
// Handles: backend jobs, RapidAPI fallback, saved jobs helpers
// ============================================================================

const BACKEND_BASE = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:8080/api/v1';

const API_CONFIG = {
  baseUrl: 'https://jsearch.p.rapidapi.com/search',
  key: '964ab9bfbemshf7c3a95fc2524cep1f15dbjsnbed1d3d53735',
  host: 'jsearch.p.rapidapi.com'
};

const COUNTRY_CODE_MAP = {
  'USA': 'US',
  'United Kingdom': 'GB',
  'Canada': 'CA',
  'Germany': 'DE',
  'France': 'FR',
  'Australia': 'AU',
  'Singapore': 'SG',
  'India': 'IN',
  'Japan': 'JP',
  'Brazil': 'BR',
  'Mexico': 'MX',
  'Spain': 'ES',
  'Netherlands': 'NL',
  'Global': 'US'
};

async function fetchBackendJobs(filters = {}) {
  const { keyword = '', location = '', page = 0, size = 12 } = filters;
  const queryParams = new URLSearchParams();
  if (keyword) queryParams.append('keyword', keyword);
  if (location) queryParams.append('location', location);
  queryParams.append('page', page);
  queryParams.append('size', size);

  const response = await apiFetch(`/jobs/search?${queryParams.toString()}`, { method: 'GET' });
  if (!response.ok) throw new Error('Backend job search failed');
  const data = await response.json();
  return normalizeBackendJobs(data);
}

async function fetchAllJobs(page = 0, size = 12) {
  const response = await apiFetch(`/jobs?page=${page}&size=${size}`, { method: 'GET' });
  if (!response.ok) throw new Error('Backend fetch failed');
  const data = await response.json();
  return normalizeBackendJobs(data);
}

async function fetchJobsFromRapidAPI(jobTitle = 'developer', location = 'USA', employmentType = '') {
  const countryCode = COUNTRY_CODE_MAP[location] || 'IN';
  const searchQuery = encodeURIComponent(`${jobTitle}`);
  const employmentParam = employmentType && employmentType !== 'all'
    ? `&employment_type=${encodeURIComponent(employmentType)}`
    : '';

  const url = `${API_CONFIG.baseUrl}?query=${searchQuery}&page=1&num_pages=1&country=${countryCode}&date_posted=all${employmentParam}`;

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': API_CONFIG.key,
      'x-rapidapi-host': API_CONFIG.host
    }
  };

  const response = await fetch(url, options);
  if (!response.ok) return { jobs: [], totalElements: 0, totalPages: 0, currentPage: 0, pageSize: 10 };

  const data = await response.json();
  if (!data.data || data.data.length === 0) return { jobs: [], totalElements: 0, totalPages: 0, currentPage: 0, pageSize: 10 };

  const jobs = data.data.map(job => ({
    id: job.job_id,
    title: job.job_title,
    company: job.employer_name || 'Unknown Company',
    location: `${job.job_city || 'Remote'}, ${job.job_country || location}`,
    jobType: normalizeJobType(job.job_employment_type),
    salary: {
      formatted: formatSalary(job)
    },
    description: job.job_description ? `${job.job_description.substring(0, 200)}...` : 'No description available',
    postedDate: job.job_posted_at_datetime_utc,
    postedDateFormatted: formatDate(job.job_posted_at_datetime_utc),
    jobUrl: job.job_apply_link || '#',
    skills: Array.isArray(job.job_required_skills) ? job.job_required_skills.map((name, idx) => ({ id: idx, name })) : []
  }));

  return {
    jobs,
    totalElements: jobs.length,
    totalPages: 1,
    currentPage: 0,
    pageSize: jobs.length,
    source: 'rapidapi'
  };
}

function normalizeBackendJobs(data) {
  if (!data || !data.content) {
    return { jobs: [], totalElements: 0, totalPages: 0, currentPage: 0, pageSize: 0 };
  }

  const jobs = data.content.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company?.name || 'Unknown Company',
    companyId: job.company?.id,
    location: job.location || 'Remote',
    jobType: job.employmentType || 'FULL_TIME',
    salary: {
      min: job.minSalary,
      max: job.maxSalary,
      currency: job.currency || 'USD',
      formatted: formatSalaryRange(job.minSalary, job.maxSalary, job.currency),
    },
    description: job.description,
    postedDate: job.postedDate,
    postedDateFormatted: formatDateRelative(job.postedDate),
    jobUrl: `/job-detail.html?id=${job.id}`,
    skills: Array.isArray(job.skills)
      ? job.skills.map((skill) => ({ id: skill.id, name: skill.name }))
      : [],
    status: job.status,
    source: 'backend'
  }));

  return {
    jobs,
    totalElements: data.totalElements || 0,
    totalPages: data.totalPages || 0,
    currentPage: data.number || 0,
    pageSize: data.size || 10,
    source: 'backend'
  };
}

function normalizeJobType(type) {
  if (!type) return 'Full-time';
  const typeMap = {
    'FULLTIME': 'Full-time',
    'FULL_TIME': 'Full-time',
    'PARTTIME': 'Part-time',
    'PART_TIME': 'Part-time',
    'REMOTE': 'Remote',
    'CONTRACT': 'Contract',
    'TEMPORARY': 'Contract',
    'INTERNSHIP': 'Internship'
  };
  return typeMap[type.toUpperCase()] || type;
}

function formatSalary(job) {
  if (!job.job_min_salary) return 'Competitive';
  const currency = job.job_salary_currency || '$';
  const minSalary = parseInt(job.job_min_salary);
  const maxSalary = parseInt(job.job_max_salary) || minSalary;
  if (maxSalary && maxSalary !== minSalary) {
    return `${currency}${minSalary.toLocaleString()} - ${currency}${maxSalary.toLocaleString()}`;
  }
  return `${currency}${minSalary.toLocaleString()}`;
}

function formatDate(dateString) {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

function toggleSaveJob(jobId, jobTitle) {
  const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
  const index = savedJobs.findIndex((j) => j.id === jobId);
  if (index > -1) {
    savedJobs.splice(index, 1);
    showSuccess('Job removed from saved');
  } else {
    savedJobs.push({ id: jobId, title: jobTitle, savedAt: new Date().toISOString() });
    showSuccess('Job saved!');
  }
  localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  return savedJobs.find((j) => j.id === jobId) !== undefined;
}

function getSavedJobs() {
  return JSON.parse(localStorage.getItem('savedJobs') || '[]');
}

function isJobSaved(jobId) {
  const savedJobs = getSavedJobs();
  return savedJobs.some((j) => j.id === jobId);
}
