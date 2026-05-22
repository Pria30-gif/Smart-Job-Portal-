import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Send, Sparkles, User, Compass, Zap, CheckCircle, Map } from 'lucide-react';

// --- ADVANCED FEATURE: Interactive Career Discovery Quiz & Roadmap Engine ---
const QUIZ_QUESTIONS = [
<<<<<<< HEAD
    { id: 1, text: "Let's start with your interests. Which of these activities sounds more appealing?", options: ["Building something tangible, like an app or a website.", "Analyzing data to find hidden patterns."], scores: { "Building something tangible, like an app or a website.": { tech: 2 }, "Analyzing data to find hidden patterns.": { data: 2 } } },
    { id: 2, text: "When working on a project, what role do you naturally take?", options: ["I like to organize the team and plan the project.", "I prefer focusing on the creative aspects, like the user experience."], scores: { "I like to organize the team and plan the project.": { management: 2 }, "I prefer focusing on the creative aspects, like the user experience.": { design: 2 } } },
    { id: 3, text: "Which of these problems would you rather solve?", options: ["Making a complex system run faster and more efficiently.", "Understanding user needs to create a product people love."], scores: { "Making a complex system run faster and more efficiently.": { tech: 2 }, "Understanding user needs to create a product people love.": { management: 1, design: 1 } } },
    { id: 4, text: "What kind of work environment do you thrive in?", options: ["A collaborative environment with lots of brainstorming.", "A focused environment where I can solve complex problems independently."], scores: { "A collaborative environment with lots of brainstorming.": { management: 1, design: 1 }, "A focused environment where I can solve complex problems independently.": { tech: 1, data: 1 } } }
];

const getCareerRecommendation = (scores) => {
    const finalScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topCareer = finalScores[0][0];
    const recommendations = {
        tech: { title: "Software Engineer", description: "You enjoy building and problem-solving. A career in software engineering would be a great fit.", skills: ["Programming (Python, Java, JS)", "Data Structures", "Cloud Computing"], link: "/jobs?q=Software Engineer" },
        data: { title: "Data Analyst", description: "You have a knack for finding patterns. A role as a data analyst, turning data into actionable intelligence, is a strong match.", skills: ["SQL", "Python/R", "Data Visualization", "Statistics"], link: "/jobs?q=Data Analyst" },
        management: { title: "Product Manager", description: "Your strength lies in organization and strategy. As a product manager, you would lead the development of products.", skills: ["Roadmapping", "User Research", "Agile Methodologies", "Leadership"], link: "/jobs?q=Product Manager" },
        design: { title: "UI/UX Designer", description: "You have a creative eye and a passion for user experience. A career in UI/UX design is perfect for you.", skills: ["Figma/Sketch", "Prototyping", "User Research"], link: "/jobs?q=UI/UX Designer" }
    };
    return recommendations[topCareer];
=======
  { id: 1, text: "Let's start with your interests. Which of these activities sounds more appealing?", options: ["Building something tangible, like an app or a website.", "Analyzing data to find hidden patterns."], scores: { "Building something tangible, like an app or a website.": { tech: 2 }, "Analyzing data to find hidden patterns.": { data: 2 } } },
  { id: 2, text: "When working on a project, what role do you naturally take?", options: ["I like to organize the team and plan the project.", "I prefer focusing on the creative aspects, like the user experience."], scores: { "I like to organize the team and plan the project.": { management: 2 }, "I prefer focusing on the creative aspects, like the user experience.": { design: 2 } } },
  { id: 3, text: "Which of these problems would you rather solve?", options: ["Making a complex system run faster and more efficiently.", "Understanding user needs to create a product people love."], scores: { "Making a complex system run faster and more efficiently.": { tech: 2 }, "Understanding user needs to create a product people love.": { management: 1, design: 1 } } },
  { id: 4, text: "What kind of work environment do you thrive in?", options: ["A collaborative environment with lots of brainstorming.", "A focused environment where I can solve complex problems independently."], scores: { "A collaborative environment with lots of brainstorming.": { management: 1, design: 1 }, "A focused environment where I can solve complex problems independently.": { tech: 1, data: 1 } } }
];

const getCareerRecommendation = (scores) => {
  const finalScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topCareer = finalScores[0][0];
  const recommendations = {
    tech: { title: "Software Engineer", description: "You enjoy building and problem-solving. A career in software engineering would be a great fit.", skills: ["Programming (Python, Java, JS)", "Data Structures", "Cloud Computing"], link: "/jobs?q=Software Engineer" },
    data: { title: "Data Analyst", description: "You have a knack for finding patterns. A role as a data analyst, turning data into actionable intelligence, is a strong match.", skills: ["SQL", "Python/R", "Data Visualization", "Statistics"], link: "/jobs?q=Data Analyst" },
    management: { title: "Product Manager", description: "Your strength lies in organization and strategy. As a product manager, you would lead the development of products.", skills: ["Roadmapping", "User Research", "Agile Methodologies", "Leadership"], link: "/jobs?q=Product Manager" },
    design: { title: "UI/UX Designer", description: "You have a creative eye and a passion for user experience. A career in UI/UX design is perfect for you.", skills: ["Figma/Sketch", "Prototyping", "User Research"], link: "/jobs?q=UI/UX Designer" }
  };
  return recommendations[topCareer];
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
};

const getRoadmap = (field) => {
    const roadmaps = {
        "Frontend": {
            title: "Frontend Developer Roadmap",
            stages: [
                { name: "1. Learn the Basics", skills: ["HTML5", "CSS3 (Flexbox, Grid)", "JavaScript (ES6+)"] },
                { name: "2. Master a Framework", skills: ["React.js (recommended)", "Vue.js", "Angular"] },
                { name: "3. Understand Styling", skills: ["CSS Preprocessors (Sass)", "CSS-in-JS", "Tailwind CSS"] },
                { name: "4. Know Your Tools", skills: ["Git & GitHub", "Package Managers (npm/yarn)", "Build Tools (Vite/Webpack)"] },
            ],
            link: "/jobs?q=Frontend"
        },
        "Backend": {
            title: "Backend Developer Roadmap",
            stages: [
                { name: "1. Choose a Language", skills: ["Node.js (JavaScript)", "Python (Django/Flask)", "Java (Spring)", "Go"] },
                { name: "2. Understand Databases", skills: ["SQL (PostgreSQL, MySQL)", "NoSQL (MongoDB, Redis)"] },
                { name: "3. Learn About APIs", skills: ["REST APIs", "GraphQL"] },
                { name: "4. Master Deployment", skills: ["Docker", "CI/CD", "Cloud Providers (AWS, Azure)"] },
            ],
            link: "/jobs?q=Backend"
        },
    };
    return roadmaps[field];
}

const mockApiCall = (userMessage, state) => {
<<<<<<< HEAD
    return new Promise(resolve => {
        setTimeout(() => {
            let response = {};
            const lowerInput = userMessage.text.toLowerCase();

            if (state.mode === 'quiz') {
                const { currentQuestionIndex, scores } = state;
                const lastQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
                const answerScores = lastQuestion.scores[userMessage.text] || {};
                const newScores = { ...scores };
                for (const key in answerScores) { newScores[key] = (newScores[key] || 0) + answerScores[key]; }
                const nextQuestionIndex = currentQuestionIndex + 1;
                if (nextQuestionIndex < QUIZ_QUESTIONS.length) {
                    response = { isQuiz: true, quizContent: QUIZ_QUESTIONS[nextQuestionIndex], quizProgress: ((nextQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100, state: { ...state, currentQuestionIndex: nextQuestionIndex, scores: newScores } };
                } else {
                    // Quiz is finished, send recommendation and suggestions to start over.
                    // Also, explicitly reset the state for the next interaction.
                    response = { isRecommendation: true, recommendationContent: getCareerRecommendation(newScores), suggestions: ["Start Over"], state: { mode: 'initial' } };
                }
            } else if (state.mode === 'roadmap_selection') {
                const roadmap = getRoadmap(userMessage.text);
                // Roadmap is shown, send content and suggestions to start over.
                // Also, explicitly reset the state.
                response = { isRoadmap: true, roadmapContent: roadmap, suggestions: ["Start Over"], state: { mode: 'initial' } };
            }
            else { // Initial state
                if (lowerInput.includes("quiz")) {
                    const firstQuestion = QUIZ_QUESTIONS[0];
                    response = { isQuiz: true, quizContent: firstQuestion, quizProgress: (1 / QUIZ_QUESTIONS.length) * 100, state: { mode: 'quiz', currentQuestionIndex: 0, scores: { tech: 0, data: 0, management: 0, design: 0 } } };
                } else if (lowerInput.includes("roadmap")) {
                    response = { text: "Great! Which tech career roadmap would you like to explore?", isOptions: true, options: ["Frontend", "Backend"], state: { mode: 'roadmap_selection' } };
                } else {
                    // Fallback for unrecognized input in the initial state
                    response = { text: "Sorry, I didn't understand that. You can take the quiz or explore roadmaps.", isOptions: true, options: ["Take the Career Discovery Quiz", "Explore Tech Career Roadmaps"] };
                }
            }
            resolve(response);
        }, 1000);
    });
};

export default function CareerPathChatbot() {
    const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem('careerPathBotChat') || '[]'));
    const [isLoading, setIsLoading] = useState(false);
    const [currentState, setCurrentState] = useState({ mode: 'initial' });
    const [suggestions, setSuggestions] = useState([]); // State for suggestion chips
    const chatEndRef = useRef(null);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);
    useEffect(() => { localStorage.setItem('careerPathBotChat', JSON.stringify(messages)); }, [messages]);

    const startConversation = () => {
        const initialMessage = { from: 'bot', text: "Welcome to your Career Guidance session. What would you like to do?", isOptions: true, options: ["Take the Career Discovery Quiz", "Explore Tech Career Roadmaps"] };
        setMessages([initialMessage]);
        setCurrentState({ mode: 'initial' });
        setSuggestions([]);
    };

    const resetConversation = () => {
        localStorage.removeItem('careerPathBotChat');
        startConversation();
    };

    useEffect(() => { if (messages.length === 0) { startConversation(); } }, []);

    const handleSend = async (messageText) => {
        if (isLoading) return;

        // Directly handle the reset action
        if (messageText === "Start Over") {
            resetConversation();
            return;
        }

        const userMessage = { from: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setSuggestions([]); // Clear suggestions once user makes a choice

        const botResponse = await mockApiCall(userMessage, currentState);

        // Only update state if the response contains a new state
        if (botResponse.state) {
            setCurrentState(botResponse.state);
        }

        if (botResponse.suggestions) {
            setSuggestions(botResponse.suggestions);
        }

        setMessages(prev => [...prev, { from: 'bot', ...botResponse }]);
        setIsLoading(false);
    };

    return (
        <div className="w-full h-[calc(100vh-80px)] bg-gray-900 flex justify-center items-center font-sans">
            <div className="w-full h-full flex flex-col bg-gray-800/50 backdrop-blur-xl border border-gray-700/50">
                <div className="p-4 border-b border-gray-700/50 text-center flex-shrink-0"><h1 className="text-xl font-bold text-white flex items-center justify-center"><Compass className="h-6 w-6 text-cyan-400 mr-2" /> Career Guidance</h1></div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-4 animate-fade-in ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.from === 'bot' && <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center flex-shrink-0 shadow-lg"><Sparkles className="text-cyan-300" /></div>}
                            
                            {msg.isQuiz ? (
                                <div className="w-full max-w-lg p-6 bg-gray-800/80 rounded-2xl border border-gray-700/60 shadow-2xl">
                                    <p className="text-gray-300 text-sm mb-4">{msg.quizContent.text}</p>
                                    <div className="space-y-3">{msg.quizContent.options.map((option) => (<button key={option} onClick={() => handleSend(option)} className="w-full text-left p-3 text-cyan-300 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors border border-gray-600/50">{option}</button>))}</div>
                                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-6"><div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${msg.quizProgress}%`, transition: 'width 0.5s ease-in-out' }}></div></div>
                                </div>
                            ) : msg.isRecommendation ? (
                                <div className="w-full max-w-lg p-6 bg-gray-800/80 rounded-2xl border border-green-500/40 shadow-2xl">
                                    <h3 className="text-lg font-bold text-white flex items-center mb-4"><CheckCircle size={20} className="text-green-400 mr-2" /> Your Recommended Career Path</h3>
                                    <div className="p-4 bg-gray-900/50 rounded-lg"><p className="text-2xl font-extrabold text-green-400">{msg.recommendationContent.title}</p><p className="text-gray-300 text-sm mt-2">{msg.recommendationContent.description}</p><p className="font-semibold text-cyan-400 text-sm mt-4">Key Skills to Develop:</p><ul className="list-disc list-inside text-gray-300 text-sm mt-1 space-y-1">{msg.recommendationContent.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></div>
                                    <Link to={msg.recommendationContent.link} className="block w-full text-center mt-4 p-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors">Find Relevant Jobs</Link>
                                </div>
                            ) : msg.isRoadmap ? (
                                <div className="w-full max-w-lg p-6 bg-gray-800/80 rounded-2xl border border-purple-500/40 shadow-2xl">
                                    <h3 className="text-lg font-bold text-white flex items-center mb-4"><Map size={20} className="text-purple-400 mr-2" /> {msg.roadmapContent.title}</h3>
                                    <div className="space-y-4">{msg.roadmapContent.stages.map(stage => (<div key={stage.name}><p className="font-semibold text-purple-400 text-sm">{stage.name}</p><p className="text-gray-300 text-sm mt-1">{stage.skills.join(", ")}</p></div>))}</div>
                                    <Link to={msg.roadmapContent.link} className="block w-full text-center mt-6 p-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors">Find Relevant Jobs</Link>
                                </div>
                            ) : ( // Regular message or options
                                <div className={`max-w-md p-4 rounded-2xl shadow-lg ${msg.from === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-700/70 text-gray-200 rounded-bl-none'}`}>
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                    {msg.isOptions && (<div className="mt-4 space-y-3">{msg.options.map(option => (<button key={option} onClick={() => handleSend(option)} className="w-full text-left p-3 text-cyan-300 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors border border-gray-600/50">{option}</button>))}</div>)}
                                </div>
                            )}
                            {msg.from === 'user' && <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0 shadow-lg"><User size={20} className="text-gray-300" /></div>}
                        </div>
                    ))}
                    {isLoading && <div className="flex items-start gap-4 animate-fade-in"><div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0"><Sparkles className="text-cyan-300" /></div><div className="p-4 rounded-2xl shadow-md bg-gray-700/70"><div className="flex items-center space-x-1.5"><div className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div><div className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div><div className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce"></div></div></div></div>}
                    <div ref={chatEndRef} />
                </div>

                <div className="p-4 bg-gray-900/50 border-t border-gray-700/50 flex-shrink-0">
                    {!isLoading && suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((suggestion) => (
                                <button key={suggestion} onClick={() => handleSend(suggestion)} className="px-3 py-1.5 text-sm bg-gray-700/60 text-cyan-300 rounded-full hover:bg-gray-600/80 transition-colors border border-gray-600/50">
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
=======
  return new Promise(resolve => {
    setTimeout(() => {
      let response = {};
      const lowerInput = userMessage.text.toLowerCase();

      if (state.mode === 'quiz') {
        const { currentQuestionIndex, scores } = state;
        const lastQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
        const answerScores = lastQuestion.scores[userMessage.text] || {};
        const newScores = { ...scores };
        for (const key in answerScores) { newScores[key] = (newScores[key] || 0) + answerScores[key]; }
        const nextQuestionIndex = currentQuestionIndex + 1;
        if (nextQuestionIndex < QUIZ_QUESTIONS.length) {
          response = { isQuiz: true, quizContent: QUIZ_QUESTIONS[nextQuestionIndex], quizProgress: ((nextQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100, state: { ...state, currentQuestionIndex: nextQuestionIndex, scores: newScores }};
        } else {
          response = { isRecommendation: true, recommendationContent: getCareerRecommendation(newScores), suggestions: ["Start Over"]};
        }
      } else if (state.mode === 'roadmap_selection') {
        const roadmap = getRoadmap(userMessage.text);
        response = { isRoadmap: true, roadmapContent: roadmap, suggestions: ["Start Over"] };
      }
      else { // Initial state
        if (lowerInput.includes("quiz")) {
            const firstQuestion = QUIZ_QUESTIONS[0];
            response = { isQuiz: true, quizContent: firstQuestion, quizProgress: (1 / QUIZ_QUESTIONS.length) * 100, state: { mode: 'quiz', currentQuestionIndex: 0, scores: { tech: 0, data: 0, management: 0, design: 0 } } };
        } else if (lowerInput.includes("roadmap")) {
            response = { text: "Great! Which tech career roadmap would you like to explore?", isOptions: true, options: ["Frontend", "Backend"], state: { mode: 'roadmap_selection' } };
        }
      }
      resolve(response);
    }, 1000);
  });
};

export default function CareerPathChatbot() {
  const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem('careerPathBotChat') || '[]'));
  const [isLoading, setIsLoading] = useState(false);
  const [currentState, setCurrentState] = useState({ mode: 'initial' });
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);
  useEffect(() => { localStorage.setItem('careerPathBotChat', JSON.stringify(messages)); }, [messages]);
  
  const startConversation = () => {
    setMessages([{ from: 'bot', text: "Welcome to your Career Guidance session. What would you like to do?", isOptions: true, options: ["Take the Career Discovery Quiz", "Explore Tech Career Roadmaps"] }]);
    setCurrentState({ mode: 'initial' });
  };
  
  useEffect(() => { if (messages.length === 0) { startConversation(); } }, []);

  const handleSend = async (messageText) => {
    if (isLoading) return;
    const userMessage = { from: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    const botResponse = await mockApiCall(userMessage, currentState);
    if (botResponse.state) { setCurrentState(botResponse.state); } 
    else { setCurrentState({ mode: 'initial' }); } // Reset after flow is complete
    setMessages(prev => [...prev, { from: 'bot', ...botResponse }]);
    setIsLoading(false);
  };
  
  return (
    <div className="w-full h-[calc(100vh-80px)] bg-gray-900 flex justify-center items-center font-sans">
      <div className="w-full h-full flex flex-col bg-gray-800/50 backdrop-blur-xl border border-gray-700/50">
        <div className="p-4 border-b border-gray-700/50 text-center flex-shrink-0"><h1 className="text-xl font-bold text-white flex items-center justify-center"><Compass className="h-6 w-6 text-cyan-400 mr-2" /> Career Guidance</h1></div>
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-4 animate-fade-in ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.from === 'bot' && <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center flex-shrink-0 shadow-lg"><Sparkles className="text-cyan-300" /></div>}
              
              {msg.isQuiz ? (
                <div className="w-full max-w-lg p-6 bg-gray-800/80 rounded-2xl border border-gray-700/60 shadow-2xl">
                    <p className="text-gray-300 text-sm mb-4">{msg.quizContent.text}</p>
                    <div className="space-y-3">{msg.quizContent.options.map((option) => (<button key={option} onClick={() => handleSend(option)} className="w-full text-left p-3 text-cyan-300 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors border border-gray-600/50">{option}</button>))}</div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-6"><div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${msg.quizProgress}%`, transition: 'width 0.5s ease-in-out' }}></div></div>
                </div>
              ) : msg.isRecommendation ? (
                <div className="w-full max-w-lg p-6 bg-gray-800/80 rounded-2xl border border-green-500/40 shadow-2xl">
                    <h3 className="text-lg font-bold text-white flex items-center mb-4"><CheckCircle size={20} className="text-green-400 mr-2"/> Your Recommended Career Path</h3>
                    <div className="p-4 bg-gray-900/50 rounded-lg"><p className="text-2xl font-extrabold text-green-400">{msg.recommendationContent.title}</p><p className="text-gray-300 text-sm mt-2">{msg.recommendationContent.description}</p><p className="font-semibold text-cyan-400 text-sm mt-4">Key Skills to Develop:</p><ul className="list-disc list-inside text-gray-300 text-sm mt-1 space-y-1">{msg.recommendationContent.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></div>
                    <Link to={msg.recommendationContent.link} className="block w-full text-center mt-4 p-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors">Find Relevant Jobs</Link>
                </div>
              ) : msg.isRoadmap ? (
                <div className="w-full max-w-lg p-6 bg-gray-800/80 rounded-2xl border border-purple-500/40 shadow-2xl">
                    <h3 className="text-lg font-bold text-white flex items-center mb-4"><Map size={20} className="text-purple-400 mr-2"/> {msg.roadmapContent.title}</h3>
                    <div className="space-y-4">{msg.roadmapContent.stages.map(stage => (<div key={stage.name}><p className="font-semibold text-purple-400 text-sm">{stage.name}</p><p className="text-gray-300 text-sm mt-1">{stage.skills.join(", ")}</p></div>))}</div>
                    <Link to={msg.roadmapContent.link} className="block w-full text-center mt-6 p-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors">Find Relevant Jobs</Link>
                </div>
              ) : ( // Regular message or options
                <div className={`max-w-md p-4 rounded-2xl shadow-lg ${msg.from === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-700/70 text-gray-200 rounded-bl-none'}`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    {msg.isOptions && (<div className="mt-4 space-y-3">{msg.options.map(option => (<button key={option} onClick={() => handleSend(option)} className="w-full text-left p-3 text-cyan-300 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors border border-gray-600/50">{option}</button>))}</div>)}
                </div>
              )}
              {msg.from === 'user' && <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0 shadow-lg"><User size={20} className="text-gray-300"/></div>}
            </div>
          ))}
          {isLoading && <div className="flex items-start gap-4 animate-fade-in"><div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0"><Sparkles className="text-cyan-300" /></div><div className="p-4 rounded-2xl shadow-md bg-gray-700/70"><div className="flex items-center space-x-1.5"><span className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce"></span></div></div></div>}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-gray-900/50 border-t border-gray-700/50 flex-shrink-0">
            {!isLoading && messages[messages.length-1]?.suggestions && (
                <div className="flex flex-wrap gap-2">
                    {messages[messages.length-1].suggestions.map((suggestion) => (
                        <button key={suggestion} onClick={() => handleSend(suggestion)} className="px-3 py-1.5 text-sm bg-gray-700/60 text-cyan-300 rounded-full hover:bg-gray-600/80 transition-colors border border-gray-600/50">
                            {suggestion === "Start Over" ? "Start Over" : suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
