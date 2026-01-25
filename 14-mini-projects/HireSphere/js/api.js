/**
 * API Module for HireSphere
 * Handles all API calls to JSearch (RapidAPI)
 */

const API_CONFIG = {
  baseUrl: 'https://jsearch.p.rapidapi.com/search',
  key: '964ab9bfbemshf7c3a95fc2524cep1f15dbjsnbed1d3d53735',
  host: 'jsearch.p.rapidapi.com'
};

// Country code mapping for API
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

/**
 * Fetch jobs from RapidAPI JSearch
 * @param {string} jobTitle - Job title to search
 * @param {string} location - Location to search
 * @param {string} employmentType - Employment type filter
 * @returns {Promise<Array>} Array of job objects
 */
async function fetchJobsFromAPI(jobTitle = 'developer', location = 'USA', employmentType = '') {
  try {
    const countryCode = COUNTRY_CODE_MAP[location] || 'IN';
    const searchQuery = encodeURIComponent(`${jobTitle}`);
    const employmentParam = employmentType && employmentType !== 'all'
      ? `&employment_type=${encodeURIComponent(employmentType)}`
      : '';

    // Use provided endpoint format (page=1, num_pages=1, date_posted=all)
    const url = `${API_CONFIG.baseUrl}?query=${searchQuery}&page=1&num_pages=1&country=${countryCode}&date_posted=all${employmentParam}`;

    console.log('🔍 Fetching jobs from API:', url);

    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_CONFIG.key,
        'x-rapidapi-host': API_CONFIG.host
      }
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      console.warn('⚠️ API Error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      console.warn('⚠️ No jobs found from API');
      return [];
    }

    // Transform API response
    const transformedJobs = data.data.map(job => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: {
        city: job.job_city || 'Remote',
        country: job.job_country || location
      },
      jobType: normalizeJobType(job.job_employment_type),
      salary: formatSalary(job),
      postedDate: formatDate(job.job_posted_at_datetime_utc),
      description: job.job_description ? `${job.job_description.substring(0, 150)}...` : 'No description available',
      jobUrl: job.job_apply_link || '#',
      skills: job.job_required_skills || []
    }));

    console.log(`✅ Fetched ${transformedJobs.length} jobs from API`);
    return transformedJobs;

  } catch (error) {
    console.error('❌ API Error:', error.message);
    return [];
  }
}

/**
 * Normalize job employment type
 * @param {string} type - Employment type from API
 * @returns {string} Normalized type
 */
function normalizeJobType(type) {
  if (!type) return 'Full-time';
  const typeMap = {
    'FULLTIME': 'Full-time',
    'FULL_TIME': 'Full-time',
    'PARTTIME': 'Part-time',
    'PART_TIME': 'Part-time',
    'CONTRACT': 'Contract',
    'TEMPORARY': 'Contract',
    'INTERNSHIP': 'Internship'
  };
  return typeMap[type.toUpperCase()] || type;
}

/**
 * Format salary from API response
 * @param {Object} job - Job object
 * @returns {string} Formatted salary string
 */
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

/**
 * Format date string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
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
