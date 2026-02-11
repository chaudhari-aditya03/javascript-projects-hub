# ReviseX AI - Smart Programming Revision & Interview Trainer

![ReviseX AI](https://img.shields.io/badge/ReviseX-AI--Powered-blue?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## 🚀 Overview

**ReviseX AI** is a comprehensive, AI-powered learning platform designed to help developers master programming languages and ace technical interviews. Built with modern web technologies, it provides an interactive learning experience with real-time AI assistance.

## ✨ Features

### 🎯 Core Features

- **5 Programming Languages**: Java, Python, JavaScript, C++, SQL
- **Multi-Category Learning**: Basics, Core, Advanced, Interview Focus
- **AI-Powered Content Generation**:
  - Automatic syllabus and topic explanations
  - 20+ MCQs per topic with instant validation
  - 5-10 coding problems with AI evaluation
  - 10-15 interview questions with best answers
  - Real-time AI interview simulator

### 💡 Learning Flow

1. **AI Syllabus Generation** - Get comprehensive topic overview
2. **MCQ Practice** - 20+ questions with instant feedback and scoring
3. **Coding Practice** - Solve problems and get AI-powered evaluation
4. **Interview Preparation** - Study common interview questions
5. **AI Interview Simulator** - Practice with real-time AI interviewer

### 🎨 UI/UX Features

- **Dark Mode** - Seamless light/dark theme switching
- **Progress Tracking** - Monitor completion and scores
- **Responsive Design** - Mobile-first, works on all devices
- **Toast Notifications** - Real-time feedback
- **Breadcrumb Navigation** - Easy navigation tracking
- **Animated UI** - Smooth transitions and animations

### 📊 Progress Management

- LocalStorage-based progress saving
- Score tracking for MCQs and coding problems
- Completion percentage per topic
- Overall statistics dashboard
- Study time tracking

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic markup |
| **Tailwind CSS** | Utility-first styling |
| **Bootstrap 5** | Component library |
| **Vanilla JavaScript (ES6+)** | Application logic |
| **Fetch API** | AI service communication |
| **LocalStorage** | Data persistence |
| **Prism.js** | Code syntax highlighting |

## 📁 Project Structure

```
ReviseX-AI/
├── index.html              # Landing page
├── dashboard.html          # Subjects dashboard
├── topics.html            # Topics listing page
├── learn.html             # Main learning interface
│
├── css/
│   └── styles.css         # Custom styles
│
├── js/
│   ├── dashboard.js       # Dashboard logic
│   ├── topics.js          # Topics page logic
│   ├── learn.js           # Learning flow logic
│   ├── ui.js              # UI utilities
│   ├── storage.js         # LocalStorage manager
│   ├── theme.js           # Dark mode handler
│   └── animations.js      # Animation utilities
│
├── api/
│   └── ai.js              # AI API integration
│
├── data/
│   └── subjects.json      # Subjects and topics data
│
└── README.md              # This file
```

## 🚀 Setup Instructions

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code recommended)
- (Optional) Local web server

### Installation

1. **Clone or Download the Project**
   ```bash
   cd ReviseX-AI
   ```

2. **Configure AI API (Optional but Recommended)**
   
   Open `api/ai.js` and configure your AI provider:

   ```javascript
   const API_CONFIG = {
       API_KEY: 'your-api-key-here',
       BASE_URL: 'https://api.openai.com/v1',  // or your provider
       MODEL: 'gpt-3.5-turbo',
   };
   ```

   **Supported AI Providers:**
   - OpenAI (GPT-3.5, GPT-4)
   - Google Gemini
   - Anthropic Claude
   - Any OpenAI-compatible API

   **Note**: The app works with mock data if no API key is configured, perfect for testing!

3. **Run the Application**

   **Option A: Direct File Access (Simple)**
   - Open `index.html` in your browser
   - Note: Some features may be limited due to CORS

   **Option B: Local Web Server (Recommended)**
   
   Using Python:
   ```bash
   python -m http.server 8000
   ```
   
   Using Node.js (http-server):
   ```bash
   npx http-server -p 8000
   ```
   
   Using VS Code Live Server:
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

   Then visit: `http://localhost:8000`

## 📖 Usage Guide

### Getting Started

1. **Browse Subjects**
   - Start from the landing page
   - Click "Start Learning" or navigate to Dashboard
   - Select a programming language

2. **Choose a Topic**
   - Browse topics by category (Basics, Core, Advanced, Interview Focus)
   - Click on any topic to start learning

3. **Follow the Learning Flow**

   **Step 1: AI Syllabus**
   - Click "Generate" to create comprehensive topic explanation
   - Review key concepts and learning objectives

   **Step 2: MCQ Practice**
   - Generate 20+ multiple choice questions
   - Select answers and get instant feedback
   - Track your score in real-time

   **Step 3: Coding Practice**
   - Solve coding problems
   - Submit your solution
   - Get AI evaluation with optimization suggestions

   **Step 4: Interview Preparation**
   - Study common interview questions
   - Review best answers and key points
   - Expand questions for detailed explanations

   **Step 5: AI Interview Simulator**
   - Start real-time interview session
   - Answer AI interviewer's questions
   - Get instant feedback on your responses

### Features in Detail

#### Dark Mode
- Click the moon/sun icon in the navbar
- Preference is saved automatically
- Respects system theme preference

#### Progress Tracking
- Automatic progress saving after each section
- View completion percentage on topic cards
- Check overall statistics on dashboard

#### Search & Filter
- Search subjects on dashboard
- Filter topics by category
- Real-time filtering

## 🔧 Customization

### Adding New Subjects

Edit `data/subjects.json`:

```json
{
  "id": "new-subject",
  "name": "New Language",
  "description": "Description here",
  "icon": "fab fa-icon-name",
  "color": "text-blue-600",
  "topics": [...]
}
```

### Styling

- Modify `css/styles.css` for custom styles
- Tailwind utilities can be used inline
- Bootstrap classes available for components

### AI Prompts

Customize AI prompts in `api/ai.js`:
- `generateSyllabus()` - Topic explanations
- `generateMCQs()` - Question generation
- `generateCodingProblems()` - Problem creation
- `generateInterviewQuestions()` - Interview Q&A

## 🎯 Key Code Concepts

### Modular Architecture

```javascript
// Clean separation of concerns
import { generateSyllabus } from '../api/ai.js';
import { saveProgress } from './storage.js';
import { showToast } from './ui.js';
```

### State Management

```javascript
// Simple state tracking
let currentSection = 0;
let mcqAnswers = {};
let progress = getProgress();
```

### Event-Driven Design

```javascript
// Centralized event handling
document.addEventListener('DOMContentLoaded', init);
button.onclick = handleClick;
```

## 🐛 Troubleshooting

### Common Issues

**Problem**: AI features not working
- **Solution**: Check API key configuration in `api/ai.js`
- **Note**: App works with mock data without API key

**Problem**: Progress not saving
- **Solution**: Check browser's LocalStorage settings
- **Tip**: Some private/incognito modes disable LocalStorage

**Problem**: Styling issues
- **Solution**: Clear browser cache and reload
- **Check**: CDN links for Tailwind/Bootstrap are loading

**Problem**: CORS errors
- **Solution**: Use a local web server instead of opening files directly

## 📝 API Integration Guide

### Setting Up OpenAI

1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Update `api/ai.js`:
   ```javascript
   API_KEY: 'sk-...',
   BASE_URL: 'https://api.openai.com/v1',
   MODEL: 'gpt-3.5-turbo'
   ```

### Using Google Gemini

1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Update configuration:
   ```javascript
   API_KEY: 'your-gemini-key',
   BASE_URL: 'https://generativelanguage.googleapis.com/v1',
   MODEL: 'gemini-pro'
   ```

## 🚀 Performance Optimization

- **Lazy Loading**: Content generated on-demand
- **LocalStorage Caching**: Reduces API calls
- **Rate Limiting**: Prevents API overuse
- **Responsive Images**: Optimized for all screens
- **Code Splitting**: Modular JavaScript files

## 🔒 Security Considerations

⚠️ **Important**: Never commit your API keys to version control!

- Store API keys in environment variables (for production)
- Use backend proxy for API calls (recommended)
- Implement rate limiting
- Validate all user inputs
- Sanitize AI-generated content

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Tailwind CSS** - Utility-first CSS framework
- **Bootstrap** - Component library
- **Font Awesome** - Icon library
- **Prism.js** - Code syntax highlighting
- **OpenAI/Gemini** - AI capabilities

## 📞 Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Check existing documentation
- Review code comments

## 🎓 Educational Use

This project is perfect for:
- Learning modern web development
- Understanding AI integration
- Building interactive educational platforms
- Portfolio projects
- Coding bootcamp projects

## 🔮 Future Enhancements

Potential features for future versions:
- [ ] User authentication
- [ ] Backend API integration
- [ ] Code execution environment
- [ ] Leaderboards and gamification
- [ ] More programming languages
- [ ] Video tutorials integration
- [ ] Social features (share progress)
- [ ] Mobile app version

## 📊 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

---

**Made with ❤️ for developers preparing for interviews**

**Happy Learning! 🚀**
