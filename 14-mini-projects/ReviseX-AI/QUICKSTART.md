# 🚀 QUICK START GUIDE

Welcome to **ReviseX AI**! This guide will help you get started in under 5 minutes.

## ⚡ Super Quick Start (No Setup Required!)

1. **Open the Application**
   - Simply open `index.html` in your web browser
   - Or use VS Code Live Server extension

2. **Start Learning**
   - Click "Start Learning" button
   - Choose a programming language (Java, Python, JavaScript, C++, SQL)
   - Select a topic
   - Begin your AI-powered learning journey!

**Note**: Without API key configuration, the app uses mock data which is perfect for testing!

---

## 🔑 Adding Real AI (Optional - Takes 5 minutes)

Want real AI-powered content? Follow these steps:

### Step 1: Get an API Key (Choose One)

**Option A: OpenAI (Recommended)**
1. Visit: https://platform.openai.com/api-keys
2. Sign up / Log in
3. Click "Create new secret key"
4. Copy your key (starts with `sk-`)

**Option B: Google Gemini (Free Tier Available)**
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy your key

### Step 2: Configure the App

1. Open `api/ai.js` in a text editor
2. Find this line (around line 10):
   ```javascript
   API_KEY: 'YOUR_API_KEY_HERE',
   ```
3. Replace `YOUR_API_KEY_HERE` with your actual API key:
   ```javascript
   API_KEY: 'sk-proj-abc123...',  // Your key here
   ```
4. Save the file

### Step 3: Update the API URL (if using Gemini)

If you chose Google Gemini, also update:
```javascript
BASE_URL: 'https://generativelanguage.googleapis.com/v1',
MODEL: 'gemini-pro',
```

### Step 4: Test It!

1. Reload the application
2. Go to any topic
3. Click "Generate" for syllabus
4. You should see real AI-generated content! 🎉

---

## 📱 Recommended Way to Run

### Using VS Code (Easiest)

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. App opens at `http://localhost:5500`

### Using Python

```bash
# In the project folder
python -m http.server 8000

# Open browser to http://localhost:8000
```

### Using Node.js

```bash
# Install http-server globally (one time)
npm install -g http-server

# Run server
http-server -p 8000

# Open browser to http://localhost:8000
```

---

## 🎯 What to Try First

### 1. Explore the Homepage
- See the features and how it works
- Toggle dark mode (moon icon)

### 2. Browse Subjects
- Click "Start Learning"
- Choose Java, Python, JavaScript, C++, or SQL
- Use search to find specific subjects

### 3. Pick a Topic
- Start with "Basics" category
- Try "Java Fundamentals" or "Python Basics"
- Click any topic card

### 4. Complete the Learning Flow

**Section 1: AI Syllabus**
- Click "Generate" to see topic overview
- Review key concepts

**Section 2: MCQ Practice**
- Generate 20+ questions
- Click answers to check if correct
- See your score in real-time

**Section 3: Coding Practice**
- Try solving a coding problem
- Submit your solution
- Get AI feedback and optimizations

**Section 4: Interview Prep**
- Expand questions to see answers
- Study common interview patterns

**Section 5: AI Interview Simulator**
- Start a mock interview session
- Answer AI interviewer's questions
- Get instant feedback

---

## 💡 Pro Tips

### For Best Experience:
- ✅ Use a local web server (not just opening files)
- ✅ Use modern browser (Chrome, Firefox, Safari, Edge)
- ✅ Enable JavaScript
- ✅ Allow LocalStorage (for progress saving)

### To Save Progress:
- Progress saves automatically
- Use the same browser to see your progress
- Don't use incognito/private mode

### Dark Mode:
- Click moon/sun icon in navbar
- Preference is saved automatically
- Works across all pages

### Navigation:
- Use breadcrumbs to go back
- Click logo to return to homepage
- Progress sidebar shows current section

---

## 🐛 Troubleshooting

### AI Not Working?
**Issue**: "Mock data" messages appear
**Fix**: Configure your API key in `api/ai.js`

### Progress Not Saving?
**Issue**: Progress resets on reload
**Fix**: 
- Don't use incognito mode
- Check browser's LocalStorage settings
- Make sure JavaScript is enabled

### Page Not Loading Properly?
**Issue**: Styles look broken
**Fix**:
- Use a local web server (see "Recommended Way to Run")
- Check internet connection (CDN resources)
- Clear browser cache

### CORS Errors?
**Issue**: Console shows CORS errors
**Fix**: Use a local web server instead of opening files directly

---

## 📚 Project Structure Overview

```
ReviseX-AI/
├── index.html          ← Start here (landing page)
├── dashboard.html      ← Subjects page
├── topics.html         ← Topics listing
├── learn.html          ← Main learning interface
├── css/
│   └── styles.css      ← Custom styles
├── js/
│   ├── dashboard.js    ← Dashboard logic
│   ├── topics.js       ← Topics logic
│   ├── learn.js        ← Learning flow
│   ├── ui.js           ← UI components
│   ├── storage.js      ← LocalStorage
│   ├── theme.js        ← Dark mode
│   └── animations.js   ← Animations
├── api/
│   ├── ai.js           ← AI integration ⚠️ Configure API key here
│   └── config.js       ← API configuration
├── data/
│   └── subjects.json   ← Topics data
└── README.md           ← Full documentation
```

---

## 🎓 Learning Path Suggestion

### Day 1: Basics
- Complete "Fundamentals" topics for any language
- Try all 5 sections of learning flow
- Get comfortable with MCQs

### Day 2: Core Concepts
- Move to "Core" category
- Focus on coding problems
- Practice interview questions

### Day 3: Advanced Topics
- Challenge yourself with "Advanced" category
- Use AI Interview Simulator
- Review difficult topics

### Day 4: Interview Focus
- Complete all "Interview Focus" topics
- Practice with AI simulator multiple times
- Review your scores and progress

---

## 🎯 Goals to Achieve

- [ ] Complete 5 topics across different subjects
- [ ] Score 80%+ on MCQ sections
- [ ] Solve 10 coding problems
- [ ] Complete 3 AI interview sessions
- [ ] Try all 5 programming languages

---

## 🔗 Useful Links

- **Full Documentation**: See README.md
- **API Setup Guide**: See api/config.js
- **OpenAI Platform**: https://platform.openai.com/
- **Google AI Studio**: https://makersuite.google.com/
- **Font Awesome Icons**: https://fontawesome.com/icons
- **Tailwind CSS Docs**: https://tailwindcss.com/docs

---

## 💬 Need Help?

1. **Check README.md** - Comprehensive documentation
2. **Review Code Comments** - Detailed explanations in files
3. **Browser Console** - Check for error messages (F12)
4. **Test with Mock Data** - Verify app works without API key

---

## 🎉 You're Ready!

That's it! You now have everything you need to start using ReviseX AI.

**Click "Start Learning" and begin your journey to mastering programming!**

---

Made with ❤️ for developers | Happy Learning! 🚀
