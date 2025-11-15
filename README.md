# 🌍 World Domination: The Ultimate Strategy Game

<div align="center">
<img width="800" height="400" alt="World Domination Game" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

> **Command nations, conquer territories, and shape the destiny of civilizations in this epic AI-powered strategy game.**

## 🎯 What is World Domination?

World Domination is an immersive, AI-driven strategy game where you become the supreme ruler of a civilization throughout history. Make critical decisions that affect your nation's population, military strength, economy, and technological advancement. Every choice has consequences - some predictable, others surprisingly dramatic.

Unlike traditional strategy games, World Domination uses advanced AI to generate unique, narrative-driven outcomes for each decision, ensuring no two playthroughs are ever the same.

## ✨ Key Features

### 🤖 AI-Powered Gameplay
- **Dynamic AI Strategist**: Every decision triggers unique, AI-generated outcomes with twists and consequences
- **Historical Accuracy**: Game events are grounded in real historical possibilities and strategic logic
- **Unpredictable Twists**: Expect the unexpected - alliances form, plagues strike, rebellions erupt

### 🎮 Immersive Experience
- **Rich Narratives**: Each turn unfolds with compelling story-driven updates
- **Visual Progress Tracking**: Real-time world map showing your territorial conquests
- **Strategic Depth**: Balance military, economic, technological, and diplomatic approaches

### 🏛️ Extended Economy System
- **Resource Management**: Control 4 key resources - Food (population stability), Iron (military power), Gold (economic transactions), Knowledge (technology boost)
- **Trade Routes**: Establish diplomatic trade networks for passive income and relationship bonuses, but beware of disruptions
- **Policy System**: Activate strategic policies like Expansionism, Pacifism, Industrial Revolution, Conscription, Propaganda, and Free Trade for gameplay customization
- **Economic Strategy**: Resources and policies create complex trade-offs and strategic opportunities

### 🎛️ Controlled Randomness
- **Stability Ranges**: Choices show predictable outcome ranges (min-max) for strategic planning
- **Mitigation Tools**: Use resources to re-roll decisions, boost stability, or predict outcomes
- **Competitive Fairness**: Reduces luck-based gameplay while maintaining excitement

### � Competitive Elements
- **Global Leaderboards**: Compete with players worldwide for the highest domination scores
- **Achievement System**: Unlock titles like "Regional Power," "Global Hegemon," or "Fallen Empire"
- **Score Analysis**: Detailed performance breakdowns after each game

### 🎯 Multiple Difficulty Levels
- **Easy**: Forgiving world for aspiring rulers
- **Medium**: Balanced challenges with risk-reward dynamics
- **Hard**: Ruthless world where mistakes are costly
- **Realistic**: Complex, historically plausible scenarios

## 🔐 Account System

### Secure Authentication
- **Password Protection**: All accounts are secured with bcrypt-hashed passwords
- **JWT Tokens**: Session management with secure JSON Web Tokens (7-day expiration)
- **Username Uniqueness**: Each ruler name must be unique across the empire

### Getting Started
1. **Create Account**: Choose a unique ruler name and strong password
2. **Secure Login**: Access your account anytime with username/password
3. **Persistent Sessions**: Stay logged in across browser sessions
4. **Account Recovery**: Contact support if you forget your credentials

## 🚀 How to Play

### 1. **Choose Your Era**
Select from historically significant starting civilizations across different time periods, from ancient empires to modern nations.

### 2. **Make Strategic Decisions**
Each turn presents 3-4 critical choices:
- **Military**: Expand territory, build armies, wage war
- **Economic**: Trade, develop infrastructure, manage resources
- **Technological**: Research innovations, advance civilization
- **Diplomatic**: Form alliances, negotiate treaties, influence rivals

### 3. **Experience Consequences**
Every choice triggers immediate impacts:
- **Quick Summary**: Bold bullet points showing key changes
- **Detailed Narrative**: Rich story explaining the outcomes
- **Stat Updates**: Population, military, economy, and technology adjustments

### 4. **Conquer the World**
Your goal: Control as much territory as possible while maintaining stability. The game ends when time runs out or your empire collapses.

## 📊 Understanding Your Empire

### Core Statistics
- **Population**: Total citizens in millions (affects military recruitment and economic output)
- **Military**: Combat strength from 1-1000 (determines battle success)
- **Economy**: Wealth generation from 1-1000 (funds development and trade)
- **Technology**: Innovation level from 1-1000 (unlocks advanced capabilities)

### World Map
- Visual representation of controlled territories
- Percentage of global domination displayed
- Strategic positioning affects diplomatic relations

## 🏅 Scoring & Achievements

### Final Score Calculation
Your score (out of 10,000) considers:
- **Territorial Control**: Percentage of world conquered
- **Statistical Power**: Combined military, economic, and technological strength
- **Stability**: How well you maintained control
- **Historical Impact**: Longevity and legacy of your reign

### Achievement Titles
- **Regional Power** (0-2,000): Local influence
- **Global Hegemon** (2,001-5,000): Continental dominance
- **Supreme Overlord** (5,001-8,000): Near-total control
- **Universal Emperor** (8,001-10,000): Complete domination

## 🥇 Leaderboards

### Global Rankings
- **High Scores**: Top domination scores worldwide
- **Recent Games**: Latest achievements and conquests
- **Personal Best**: Track your improvement over time

### Community Features
- **Username System**: Create your ruler identity
- **Score History**: Review past performances
- **Comparative Analysis**: See how you stack up against other players

## 🎮 Getting Started

### Quick Start
1. **Create Account**: Sign up with a unique username
2. **Choose Difficulty**: Start with Easy to learn the mechanics
3. **Select Era**: Pick a civilization that interests you
4. **Make Decisions**: Begin your path to world domination!

### Tips for Success
- **Balance is Key**: Don't neglect any aspect of your empire
- **Read Carefully**: Each decision has hidden consequences
- **Learn from Mistakes**: Failed games teach valuable lessons
- **Experiment**: Try different strategies and civilizations

## 💡 Game Philosophy

World Domination challenges you to think like a real historical leader. Every choice reflects the complex realities of governance:

- **Trade-offs**: Military expansion might boost your power but drain your economy
- **Unintended Consequences**: A diplomatic victory could inspire rival nations
- **Historical Accuracy**: Events are based on real strategic principles
- **Replayability**: AI ensures infinite variety in outcomes

## 🔧 Technical Requirements

- **Browser**: Modern web browser (Chrome, Firefox, Safari, Edge)
- **Internet**: Stable connection for AI-powered gameplay
- **Account**: Free registration required for score tracking

## 🎯 Why Play World Domination?

- **Educational**: Learn about historical strategy and decision-making
- **Engaging**: AI narratives keep every game session fresh
- **Competitive**: Challenge yourself and others on global leaderboards
- **Accessible**: No complex rules - just strategic thinking and bold choices
- **Rewarding**: Experience the thrill of building and maintaining an empire
- **Secure**: Your progress and personal data are protected

## 🛠️ Technical Architecture

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Context API with useReducer for complex game state
- **UI Components**: Custom component library with responsive design
- **Icons**: Custom SVG icon set for game elements

### Backend
- **Runtime**: Next.js API Routes (Serverless functions)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **AI Integration**: Google Gemini 2.5-flash model via @google/genai SDK

### Game Engine
- **AI-Powered Logic**: Turn-based decisions processed by Gemini AI with structured JSON responses
- **Game Modes**: Normal gameplay with AI-driven outcomes
- **Difficulty Scaling**: Easy, Medium, Hard, Realistic with adjusted AI parameters
- **State Persistence**: Client-side state management with server-side score tracking

### Key Technologies
- **Next.js 14**: Full-stack React framework
- **React 18**: Component-based UI with hooks and concurrent features
- **TypeScript**: Static typing for maintainable codebase
- **MongoDB**: NoSQL database for user accounts and leaderboards
- **Google Gemini AI**: Advanced language model for dynamic game narratives
- **Tailwind CSS**: Utility-first CSS framework
- **JWT**: Secure token-based authentication
- **bcryptjs**: Password hashing for security

### API Endpoints
- **Authentication**: `/api/auth/*` - User registration, login, password updates
- **Game Logic**: `/api/gemini/*` - AI-powered game state processing
- **Data**: `/api/scores/*` - Score tracking and leaderboard management

### Game State Management
- **Context Providers**: AuthContext and GameContext for global state
- **Complex State**: Game state includes territories, resources, policies, rival civilizations
- **Real-time Updates**: Client-side state updates with server synchronization
- **Error Handling**: Comprehensive error boundaries and retry mechanisms

### AI Integration Details
- **Model**: Gemini 2.5-flash for fast, high-quality responses
- **Structured Output**: JSON schema validation for consistent game data
- **Retry Logic**: Exponential backoff for API reliability
- **Prompt Engineering**: Context-aware prompts for different game phases
- **Response Parsing**: Robust JSON parsing with error recovery

### Security Features
- **Password Security**: bcrypt hashing with salt rounds
- **Token Management**: JWT with 7-day expiration and secure storage
- **Input Validation**: Server-side validation for all API inputs
- **Rate Limiting**: Built-in protection against abuse
- **Data Sanitization**: MongoDB injection prevention

### Performance Optimizations
- **Server-Side Rendering**: Next.js for improved SEO and initial load
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js built-in image optimization
- **Caching**: Appropriate caching strategies for static assets
- **Lazy Loading**: Component and route lazy loading

### Development & Deployment
- **Package Manager**: npm with lockfile for reproducible builds
- **Linting**: ESLint with Next.js configuration
- **Build Process**: Next.js optimized production builds
- **Environment Variables**: Secure configuration management
- **Database Connection**: MongoDB connection pooling

---

**Ready to conquer the world? Your empire awaits!** 👑

*Built with cutting-edge AI technology and enterprise-grade security.*
