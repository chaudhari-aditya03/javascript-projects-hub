// ============================================
// CareerHub - Job Search Application
// Real-world job data from JSonSearch API
// ============================================

// API Configuration for JSonSearch (RapidAPI)
const API_CONFIG = {
  baseUrl: 'https://jsearch.p.rapidapi.com/search',
  key: '80a2c2175cmsh46e9832d39d82cbp1e4f36jsn79cd3e19265d',
  host: 'jsearch.p.rapidapi.com'
};

// Job data storage
let allJobs = [];
let filteredJobs = [];
let currentJob = null;

// Country list for autocomplete
const countries = [
  "USA", "United Kingdom", "Canada", "Germany", "France", "Australia", "Singapore", 
  "India", "Japan", "China", "Brazil", "Mexico", "Spain", "Italy", "Netherlands",
  "Sweden", "Norway", "Denmark", "Finland", "Switzerland", "Austria", "Belgium",
  "Ireland", "Portugal", "Poland", "Czech Republic", "Hungary", "Greece", "Global"
];

const cities = [
  "New York", "San Francisco", "Los Angeles", "Chicago", "Seattle", "Boston", "Austin",
  "Washington DC", "Miami", "Denver", "Portland", "Atlanta", "Dallas", "Houston",
  "London", "Manchester", "Edinburgh", "Birmingham", "Toronto", "Vancouver", "Montreal",
  "Berlin", "Munich", "Hamburg", "Paris", "Lyon", "Sydney", "Melbourne", "Brisbane",
  "Singapore", "Tokyo", "Bangalore", "Mumbai", "Delhi", "Barcelona", "Madrid",
  "Amsterdam", "Dublin", "Stockholm", "Copenhagen", "Zurich", "Vienna", "Remote"
];

// Country Code Mapping
const countryCodeMap = {
  'USA': 'US',
  'United Kingdom': 'GB',
  'Canada': 'CA',
  'Germany': 'DE',
  'France': 'FR',
  'Australia': 'AU',
  'Singapore': 'SG',
  'India': 'IN',
  'Japan': 'JP',
  'China': 'CN',
  'Brazil': 'BR',
  'Mexico': 'MX',
  'Spain': 'ES',
  'Italy': 'IT',
  'Netherlands': 'NL',
  'Sweden': 'SE',
  'Norway': 'NO',
  'Denmark': 'DK',
  'Finland': 'FI',
  'Switzerland': 'CH',
  'Austria': 'AT',
  'Belgium': 'BE',
  'Ireland': 'IE',
  'Portugal': 'PT',
  'Poland': 'PL',
  'Czech Republic': 'CZ',
  'Hungary': 'HU',
  'Greece': 'GR',
  'Global': 'US'
};

// ============================================
// DEMO JOBS DATA
// ============================================

const demoJobs = [
  {
    id: 'demo_1',
    title: 'Senior JavaScript Developer',
    company: 'Tech Innovations Inc',
    location: { city: 'New York', country: 'USA', state: 'NY' },
    type: 'Full-time',
    experience: 'Senior',
    salary: '$120,000 - $150,000',
    salaryMin: 120000,
    description: 'We are looking for an experienced JavaScript developer with expertise in React, Node.js, and modern web technologies. You will lead a team of developers and mentor junior staff.',
    tags: ['JavaScript', 'React', 'Node.js'],
    postedDate: '2024-01-20'
  },
  {
    id: 'demo_2',
    title: 'Python Backend Developer',
    company: 'Data Systems Corp',
    location: { city: 'Bangalore', country: 'India', state: 'KA' },
    type: 'Full-time',
    experience: 'Mid',
    salary: '₹12,00,000 - ₹18,00,000',
    salaryMin: 1200000,
    description: 'Seeking a skilled Python developer to build scalable backend systems. Experience with Django, FastAPI, and PostgreSQL required. Work on exciting projects in cloud infrastructure.',
    tags: ['Python', 'Django', 'PostgreSQL'],
    postedDate: '2024-01-21'
  },
  {
    id: 'demo_3',
    title: 'React Frontend Engineer',
    company: 'Creative Studio',
    location: { city: 'Los Angeles', country: 'USA', state: 'CA' },
    type: 'Full-time',
    experience: 'Mid',
    salary: '$85,000 - $110,000',
    salaryMin: 85000,
    description: 'Build beautiful, responsive user interfaces using React and TypeScript. Collaborate with UX designers and backend developers to create amazing digital experiences.',
    tags: ['React', 'TypeScript', 'CSS'],
    postedDate: '2024-01-19'
  },
  {
    id: 'demo_4',
    title: 'DevOps Engineer',
    company: 'Cloud Solutions Ltd',
    location: { city: 'Seattle', country: 'USA', state: 'WA' },
    type: 'Full-time',
    experience: 'Senior',
    salary: '$130,000 - $160,000',
    salaryMin: 130000,
    description: 'Join our DevOps team managing infrastructure on AWS and Kubernetes. Implement CI/CD pipelines, monitor systems, and optimize performance. 5+ years experience required.',
    tags: ['AWS', 'Kubernetes', 'Docker'],
    postedDate: '2024-01-22'
  },
  {
    id: 'demo_5',
    title: 'Full Stack Developer',
    company: 'Startup Ventures',
    location: { city: 'Austin', country: 'USA', state: 'TX' },
    type: 'Full-time',
    experience: 'Entry',
    salary: '$65,000 - $85,000',
    salaryMin: 65000,
    description: 'Great opportunity for junior developers to learn. Build full-stack applications with React, Node.js, and MongoDB. Mentorship provided.',
    tags: ['JavaScript', 'React', 'MongoDB'],
    postedDate: '2024-01-18'
  },
  {
    id: 'demo_6',
    title: 'Java Software Engineer',
    company: 'Enterprise Systems',
    location: { city: 'Boston', country: 'USA', state: 'MA' },
    type: 'Full-time',
    experience: 'Mid',
    salary: '$100,000 - $130,000',
    salaryMin: 100000,
    description: 'Develop enterprise-grade Java applications. Work with Spring Boot, microservices, and distributed systems. Strong OOP principles required.',
    tags: ['Java', 'Spring Boot', 'Microservices'],
    postedDate: '2024-01-20'
  },
  {
    id: 'demo_7',
    title: 'UI/UX Designer',
    company: 'Design House Pro',
    location: { city: 'London', country: 'United Kingdom', state: 'LDN' },
    type: 'Full-time',
    experience: 'Mid',
    salary: '£60,000 - £80,000',
    salaryMin: 6000,
    description: 'Design beautiful and intuitive user interfaces. Use Figma, Adobe XD, and modern design principles. Collaborate with developers and product teams.',
    tags: ['UI Design', 'Figma', 'UX'],
    postedDate: '2024-01-21'
  },
  {
    id: 'demo_8',
    title: 'Machine Learning Engineer',
    company: 'AI Research Labs',
    location: { city: 'San Francisco', country: 'USA', state: 'CA' },
    type: 'Full-time',
    experience: 'Senior',
    salary: '$140,000 - $180,000',
    salaryMin: 140000,
    description: 'Build ML models and deploy AI solutions. Experience with TensorFlow, PyTorch, and cloud platforms required. Publish research papers.',
    tags: ['Machine Learning', 'Python', 'AI'],
    postedDate: '2024-01-19'
  },
  {
    id: 'demo_9',
    title: 'Mobile App Developer (iOS)',
    company: 'Mobile Innovations',
    location: { city: 'Toronto', country: 'Canada', state: 'ON' },
    type: 'Full-time',
    experience: 'Mid',
    salary: '$90,000 - $115,000',
    salaryMin: 90000,
    description: 'Develop iOS applications using Swift. Create performant, user-friendly apps. Experience with SwiftUI and CoreData required.',
    tags: ['Swift', 'iOS', 'Mobile'],
    postedDate: '2024-01-22'
  },
  {
    id: 'demo_10',
    title: 'QA Automation Engineer',
    company: 'Quality Assurance Plus',
    location: { city: 'Remote', country: 'Global', state: '' },
    type: 'Full-time',
    experience: 'Entry',
    salary: '$60,000 - $80,000',
    salaryMin: 60000,
    description: 'Develop and maintain automated test suites. Learn Selenium, Jest, and CI/CD. Help ensure software quality across all platforms.',
    tags: ['Testing', 'Selenium', 'Automation'],
    postedDate: '2024-01-20'
  }
];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 CareerHub Initialized');
  setupAutocomplete();
  setupFormHandler();
  loadInitialJobs();
});

// Load initial jobs on page load
async function loadInitialJobs() {
  console.log('📋 Loading initial jobs...');
  await searchJobs();
}

// ============================================
// API FUNCTIONS
// ============================================

async function fetchJobsFromAPI(jobTitle, countryName, page = 1) {
  try {
    const countryCode = countryCodeMap[countryName] || 'US';
    const searchQuery = encodeURIComponent(`${jobTitle}`);
    
    const url = `https://jsearch.p.rapidapi.com/search?query=${searchQuery}&page=${page}&num_pages=1&country=${countryCode}&date_posted=all`;
    
    console.log('🔍 API Request for:', jobTitle, 'in', countryName);

    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_CONFIG.key,
        'x-rapidapi-host': API_CONFIG.host
      }
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      console.warn('⚠️ API Error:', response.status, '- Using demo jobs');
      return getFilteredDemoJobs(jobTitle, countryName);
    }

    const data = await response.json();
    console.log('✅ API Response:', data);

    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      console.warn('⚠️ No jobs from API - Using demo jobs');
      return getFilteredDemoJobs(jobTitle, countryName);
    }

    // Transform API response
    const transformedJobs = data.data.map((job, index) => {
      return {
        id: job.job_id || `job_${index}_${Date.now()}`,
        title: job.job_title || 'Position',
        company: job.employer_name || 'Company',
        location: {
          city: job.job_city || 'Remote',
          country: job.job_country || countryName,
          state: job.job_state || ''
        },
        type: normalizeJobType(job.job_employment_type || 'Full-time'),
        experience: extractExperience(job.job_description || ''),
        salary: formatSalary(job),
        salaryMin: parseInt(job.job_min_salary) || 0,
        description: (job.job_description || 'No description').substring(0, 250),
        tags: extractTags(job),
        postedDate: job.job_posted_at_datetime_utc || new Date().toISOString().split('T')[0],
        url: job.job_apply_link || '#'
      };
    });

    console.log(`✅ Fetched ${transformedJobs.length} real jobs from API`);
    return transformedJobs;

  } catch (error) {
    console.error('❌ API Error:', error.message);
    console.log('💡 Using demo jobs instead');
    return getFilteredDemoJobs(jobTitle, countryName);
  }
}

// Get filtered demo jobs
function getFilteredDemoJobs(jobTitle, countryName) {
  let filtered = [...demoJobs];
  
  if (jobTitle && jobTitle.toLowerCase() !== 'developer') {
    filtered = filtered.filter(job => 
      job.title.toLowerCase().includes(jobTitle.toLowerCase()) ||
      job.tags.some(tag => tag.toLowerCase().includes(jobTitle.toLowerCase()))
    );
  }
  
  if (filtered.length === 0) {
    filtered = demoJobs.slice(0, 5);
  }
  
  console.log(`📦 Returning ${filtered.length} demo jobs`);
  return filtered;
}

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

function extractExperience(description) {
  if (!description) return 'Mid';
  const desc = description.toLowerCase();
  
  if (desc.includes('senior') || desc.includes('lead') || desc.includes('10+') || desc.includes('8+')) {
    return 'Senior';
  }
  if (desc.includes('junior') || desc.includes('entry') || desc.includes('1-2 years') || desc.includes('beginner')) {
    return 'Entry';
  }
  return 'Mid';
}

function formatSalary(job) {
  if (!job.job_min_salary) return 'Competitive';
  
  const currency = job.job_salary_currency || '$';
  const minSalary = parseInt(job.job_min_salary);
  const maxSalary = parseInt(job.job_max_salary);
  
  if (maxSalary && maxSalary !== minSalary) {
    return `${currency}${minSalary.toLocaleString()} - ${currency}${maxSalary.toLocaleString()}`;
  }
  return `${currency}${minSalary.toLocaleString()}`;
}

function extractTags(job) {
  const tags = [];
  const keywords = [
    'JavaScript', 'Python', 'Java', 'React', 'Vue', 'Angular', 'Node.js',
    'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'SQL', 'Git',
    'TypeScript', 'C++', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift',
    'Machine Learning', 'AI', 'Data Science', 'DevOps', 'CI/CD'
  ];
  
  const description = (job.job_description || '').toLowerCase();
  const title = (job.job_title || '').toLowerCase();
  
  keywords.forEach(keyword => {
    if ((description.includes(keyword.toLowerCase()) || title.includes(keyword.toLowerCase())) && tags.length < 5) {
      tags.push(keyword);
    }
  });
  
  return tags.length > 0 ? tags : ['Opportunity'];
}

// ============================================
// SEARCH & FILTER
// ============================================

async function searchJobs() {
  const jobSearch = document.getElementById('jobSearch').value.trim() || 'developer';
  const country = document.getElementById('country').value.trim() || 'USA';
  const city = document.getElementById('city').value.trim();
  
  console.log('🔎 Searching:', jobSearch, 'in', country);
  
  const resultsCount = document.getElementById('resultsCount');
  resultsCount.textContent = '⏳ Searching jobs...';
  
  const apiJobs = await fetchJobsFromAPI(jobSearch, country, 1);
  
  if (apiJobs && apiJobs.length > 0) {
    console.log(`✅ Got ${apiJobs.length} jobs`);
    allJobs = apiJobs;
    filteredJobs = [...allJobs];
    
    if (city) {
      filteredJobs = filteredJobs.filter(job => 
        job.location.city.toLowerCase().includes(city.toLowerCase())
      );
    }
    
    applyFilters();
  } else {
    resultsCount.textContent = 'No jobs found. Try different search terms.';
    allJobs = [];
    filteredJobs = [];
    displayJobs([]);
  }
}

function filterJobs() {
  applyFilters();
}

function applyFilters() {
  const jobType = document.getElementById('jobType').value;
  const experience = document.getElementById('experience').value;
  const salaryRange = document.getElementById('salaryRange').value;
  
  let filtered = [...filteredJobs];
  
  if (jobType !== 'all') {
    filtered = filtered.filter(job => job.type === jobType);
  }
  
  if (experience !== 'all') {
    filtered = filtered.filter(job => job.experience === experience);
  }
  
  if (salaryRange !== 'all') {
    filtered = filtered.filter(job => {
      const salary = job.salaryMin;
      if (salaryRange === '0-50k') return salary < 50000;
      if (salaryRange === '50k-100k') return salary >= 50000 && salary < 100000;
      if (salaryRange === '100k+') return salary >= 100000;
      return true;
    });
  }
  
  displayJobs(filtered);
}

function sortJobs() {
  const sortBy = document.getElementById('sortBy').value;
  let sorted = [...filteredJobs];
  
  switch(sortBy) {
    case 'recent':
      sorted.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
      break;
    case 'salary-high':
      sorted.sort((a, b) => b.salaryMin - a.salaryMin);
      break;
    case 'salary-low':
      sorted.sort((a, b) => a.salaryMin - b.salaryMin);
      break;
    case 'company':
      sorted.sort((a, b) => a.company.localeCompare(b.company));
      break;
  }
  
  filteredJobs = sorted;
  displayJobs(filteredJobs);
}

async function resetFilters() {
  document.getElementById('jobSearch').value = '';
  document.getElementById('country').value = '';
  document.getElementById('city').value = '';
  document.getElementById('jobType').value = 'all';
  document.getElementById('experience').value = 'all';
  document.getElementById('salaryRange').value = 'all';
  
  await searchJobs();
}

// ============================================
// DISPLAY
// ============================================

function displayJobs(jobs) {
  const jobsGrid = document.getElementById('jobsGrid');
  const noResults = document.getElementById('noResults');
  const resultsCount = document.getElementById('resultsCount');
  
  if (jobs.length === 0) {
    jobsGrid.style.display = 'none';
    noResults.style.display = 'block';
    resultsCount.textContent = 'No jobs found';
    return;
  }
  
  jobsGrid.style.display = 'grid';
  noResults.style.display = 'none';
  resultsCount.textContent = `${jobs.length} job${jobs.length !== 1 ? 's' : ''} found 🎯`;
  
  jobsGrid.innerHTML = jobs.map(job => `
    <div class="job-card" onclick="openApplicationModal('${job.id}')">
      <div class="job-header">
        <div class="company-logo">
          ${job.company.charAt(0).toUpperCase()}
        </div>
        <button class="save-btn" onclick="event.stopPropagation(); toggleSave('${job.id}')">
          <i class="far fa-bookmark"></i>
        </button>
      </div>
      
      <h3 class="job-title">${job.title}</h3>
      <div class="company-name">${job.company}</div>
      
      <div class="job-meta">
        <div class="meta-item">
          <i class="fas fa-map-marker-alt"></i>
          <span>${job.location.city}, ${job.location.country}</span>
        </div>
        <div class="meta-item">
          <i class="fas fa-briefcase"></i>
          <span>${job.type}</span>
        </div>
        <div class="meta-item">
          <i class="fas fa-layer-group"></i>
          <span>${job.experience}</span>
        </div>
      </div>
      
      <div class="job-tags">
        ${job.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
      
      <p class="job-description">${job.description.substring(0, 120)}...</p>
      
      <div class="job-footer">
        <div class="salary">${job.salary}</div>
        <button class="apply-btn" onclick="event.stopPropagation(); openApplicationModal('${job.id}')">
          <i class="fas fa-paper-plane"></i>
          Apply Now
        </button>
      </div>
    </div>
  `).join('');
}

// ============================================
// MODAL
// ============================================

function openApplicationModal(jobId) {
  currentJob = allJobs.find(job => job.id == jobId);
  
  if (!currentJob) {
    console.error('Job not found');
    return;
  }
  
  const modal = document.getElementById('applicationModal');
  const jobDetails = document.getElementById('jobDetails');
  
  jobDetails.innerHTML = `
    <h3>${currentJob.title}</h3>
    <p><strong>${currentJob.company}</strong></p>
    <p><i class="fas fa-map-marker-alt"></i> ${currentJob.location.city}, ${currentJob.location.country}</p>
    <p><i class="fas fa-dollar-sign"></i> ${currentJob.salary}</p>
  `;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('applicationModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
  document.getElementById('applicationForm').reset();
}

function toggleSave(jobId) {
  const saveBtn = event.target.closest('.save-btn');
  saveBtn.classList.toggle('saved');
  const icon = saveBtn.querySelector('i');
  
  if (saveBtn.classList.contains('saved')) {
    icon.classList.remove('far');
    icon.classList.add('fas');
  } else {
    icon.classList.remove('fas');
    icon.classList.add('far');
  }
}

// ============================================
// AUTOCOMPLETE
// ============================================

function setupAutocomplete() {
  const countryInput = document.getElementById('country');
  const cityInput = document.getElementById('city');
  const countrySuggestions = document.getElementById('country-suggestions');
  const citySuggestions = document.getElementById('city-suggestions');
  
  countryInput.addEventListener('input', function() {
    showSuggestions(this, countrySuggestions, countries);
  });
  
  cityInput.addEventListener('input', function() {
    showSuggestions(this, citySuggestions, cities);
  });
  
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.input-wrapper')) {
      document.querySelectorAll('.suggestions').forEach(s => s.classList.remove('show'));
    }
  });
}

function showSuggestions(input, suggestionsDiv, dataArray) {
  const value = input.value.toLowerCase().trim();
  
  if (value.length < 1) {
    suggestionsDiv.classList.remove('show');
    return;
  }
  
  const filtered = dataArray
    .filter(item => item.toLowerCase().includes(value))
    .slice(0, 8);
  
  if (filtered.length === 0) {
    suggestionsDiv.classList.remove('show');
    return;
  }
  
  suggestionsDiv.innerHTML = filtered.map(item => 
    `<div class="suggestion-item" onclick="selectSuggestion('${input.id}', '${item}')">
      <span>${item}</span>
    </div>`
  ).join('');
  
  suggestionsDiv.classList.add('show');
}

function selectSuggestion(inputId, value) {
  document.getElementById(inputId).value = value;
  document.querySelectorAll('.suggestions').forEach(s => s.classList.remove('show'));
}

// ============================================
// FORM
// ============================================

function setupFormHandler() {
  const form = document.getElementById('applicationForm');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
      job: currentJob,
      fullName: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      linkedin: document.getElementById('linkedin').value,
      portfolio: document.getElementById('portfolio').value,
      coverLetter: document.getElementById('coverLetter').value
    };
    
    console.log('📨 Application Submitted:', formData);
    
    closeModal();
    showSuccessMessage();
  });
}

function showSuccessMessage() {
  const message = document.getElementById('successMessage');
  message.classList.add('show');
  
  setTimeout(() => {
    message.classList.remove('show');
  }, 4000);
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keypress', function(e) {
  const inputs = ['jobSearch', 'country', 'city'];
  if (e.key === 'Enter' && inputs.includes(document.activeElement.id)) {
    searchJobs();
  }
});

console.log('✅ CareerHub Script Ready!');
