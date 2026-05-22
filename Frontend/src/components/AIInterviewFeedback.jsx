import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Star, BookOpen, Target, MessageSquare } from 'lucide-react';

const AIInterviewFeedback = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('');
  const navigate = useNavigate();

  // Domain-specific interview questions with expected keywords
  const interviewQuestionsByDomain = {
    'Cloud Computing': [
      {
        question: "What is cloud computing and what are its main service models (IaaS, PaaS, SaaS)?",
        expectedKeywords: ['cloud computing', 'iaas', 'paas', 'saas', 'infrastructure', 'platform', 'software'],
        points: 10
      },
      {
        question: "Can you explain the concept of virtualization and how it relates to cloud computing?",
        expectedKeywords: ['virtualization', 'virtual machines', 'hypervisor', 'abstraction', 'hardware'],
        points: 10
      },
      {
        question: "What are the benefits of using cloud computing?",
        expectedKeywords: ['scalability', 'cost', 'flexibility', 'accessibility', 'reliability', 'security'],
        points: 10
      }
    ],
    'Frontend': [
      {
        question: "Can you explain the difference between let, const, and var?",
        expectedKeywords: ['let', 'const', 'var', 'block-scoped', 'function-scoped', 'reassignment'],
        points: 10
      },
      {
        question: "What is the Box Model in CSS?",
        expectedKeywords: ['box model', 'content', 'padding', 'border', 'margin', 'css'],
        points: 10
      },
      {
        question: "Explain the concept of closures in JavaScript.",
        expectedKeywords: ['closures', 'lexical scope', 'function', 'variables', 'outer scope'],
        points: 10
      }
    ],
    'Backend': [
      {
        question: "What is RESTful API design and its main principles?",
        expectedKeywords: ['rest', 'api', 'stateless', 'client-server', 'uniform interface', 'http'],
        points: 10
      },
      {
        question: "Explain the difference between SQL and NoSQL databases.",
        expectedKeywords: ['sql', 'nosql', 'relational', 'document', 'flexible schema', 'scalability'],
        points: 10
      },
      {
        question: "What is middleware in the context of a Node.js/Express application?",
        expectedKeywords: ['middleware', 'request', 'response', 'express', 'functions', 'pipeline'],
        points: 10
      }
    ]
  };

  const domains = Object.keys(interviewQuestionsByDomain);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer
    });
  };

  const calculateScore = () => {
    if (!selectedDomain || !interviewQuestionsByDomain[selectedDomain]) return 0;

    const questions = interviewQuestionsByDomain[selectedDomain];
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach((q, index) => {
      maxScore += q.points;
      const answer = answers[index] || '';
      const answerLower = answer.toLowerCase();
      let questionScore = 0;

      // Check for expected keywords
      const foundKeywords = q.expectedKeywords.filter(keyword =>
        answerLower.includes(keyword.toLowerCase())
      );

      // Score based on keywords found and answer length
      const keywordScore = (foundKeywords.length / q.expectedKeywords.length) * (q.points * 0.7);
      const lengthScore = Math.min(answer.length / 100, 1) * (q.points * 0.3);

      questionScore = keywordScore + lengthScore;
      totalScore += Math.min(questionScore, q.points);
    });

    return Math.round((totalScore / maxScore) * 100);
  };

  const generateFeedback = () => {
    const score = calculateScore();
    const questions = interviewQuestionsByDomain[selectedDomain];

    let feedback = {
      overall: '',
      strengths: [],
      improvements: [],
      detailedAnalysis: [],
      performanceMetrics: {
        technicalAccuracy: 0,
        communicationClarity: 0,
        answerCompleteness: 0,
        keywordUsage: 0
      }
    };

    // Calculate performance metrics
    let totalTechnicalScore = 0;
    let totalClarityScore = 0;
    let totalCompletenessScore = 0;
    let totalKeywordsFound = 0;
    let totalKeywordsPossible = 0;

    questions.forEach((q, index) => {
      const answer = answers[index] || '';
      const answerLower = answer.toLowerCase();
      const foundKeywords = q.expectedKeywords.filter(keyword =>
        answerLower.includes(keyword.toLowerCase())
      );

      totalKeywordsFound += foundKeywords.length;
      totalKeywordsPossible += q.expectedKeywords.length;

      // Technical accuracy based on keywords
      const techScore = (foundKeywords.length / q.expectedKeywords.length) * 100;
      totalTechnicalScore += techScore;

      // Clarity based on answer length and structure
      const clarityScore = Math.min(answer.length / 150 * 100, 100); // Longer answers generally clearer
      totalClarityScore += clarityScore;

      // Completeness based on addressing all key points
      const completenessScore = (foundKeywords.length / q.expectedKeywords.length) * 100;
      totalCompletenessScore += completenessScore;
    });

    feedback.performanceMetrics = {
      technicalAccuracy: Math.round(totalTechnicalScore / questions.length),
      communicationClarity: Math.round(totalClarityScore / questions.length),
      answerCompleteness: Math.round(totalCompletenessScore / questions.length),
      keywordUsage: Math.round((totalKeywordsFound / totalKeywordsPossible) * 100)
    };

    if (score >= 80) {
      feedback.overall = "Outstanding performance! You demonstrated exceptional technical knowledge and communication skills. Your answers show deep understanding and clear articulation of complex concepts.";
      feedback.strengths = [
        "Excellent technical accuracy and depth of knowledge",
        "Clear and well-structured responses",
        "Effective use of technical terminology",
        "Comprehensive coverage of key concepts",
        "Strong communication skills"
      ];
      if (feedback.performanceMetrics.keywordUsage < 70) {
        feedback.improvements = [
          "Incorporate more technical keywords to strengthen responses",
          "Consider adding industry-specific examples"
        ];
      }
    } else if (score >= 60) {
      feedback.overall = "Good performance with solid technical foundation. Your answers show understanding of key concepts with room for more detail and precision.";
      feedback.strengths = [
        "Basic technical knowledge is solid",
        "Clear communication style",
        "Good grasp of fundamental concepts"
      ];
      feedback.improvements = [
        "Provide more detailed explanations with examples",
        "Use more technical terminology appropriately",
        "Expand on complex topics with greater depth",
        "Practice structuring answers more comprehensively"
      ];
    } else {
      feedback.overall = "Needs improvement. Focus on building technical knowledge and practicing clear communication. Consider reviewing fundamental concepts and practicing with sample questions.";
      feedback.improvements = [
        "Review basic technical concepts thoroughly",
        "Practice explaining technical topics clearly",
        "Learn and use appropriate technical terminology",
        "Work on providing complete, detailed answers",
        "Consider taking courses or tutorials on the subject"
      ];
    }

    // Detailed analysis per question
    questions.forEach((q, index) => {
      const answer = answers[index] || '';
      const answerLower = answer.toLowerCase();
      const foundKeywords = q.expectedKeywords.filter(keyword =>
        answerLower.includes(keyword.toLowerCase())
      );

      const questionScore = Math.round((foundKeywords.length / q.expectedKeywords.length) * 100);
      const clarityScore = Math.min(answer.length / 100, 1) * 100;

      feedback.detailedAnalysis.push({
        question: q.question,
        answer: answer,
        foundKeywords: foundKeywords,
        missingKeywords: q.expectedKeywords.filter(k => !foundKeywords.includes(k)),
        score: questionScore,
        clarity: Math.round(clarityScore),
        feedback: questionScore >= 80 ? "Excellent answer with strong technical content" :
                 questionScore >= 60 ? "Good answer, could be more detailed" :
                 "Needs improvement - review the concept and try again"
      });
    });

    return { score, feedback };
  };

  const handleSubmit = () => {
    if (!selectedDomain) {
      alert('Please select a domain first');
      return;
    }

    const questions = interviewQuestionsByDomain[selectedDomain];
    const unanswered = questions.some((_, index) => !answers[index] || answers[index].trim() === '');

    if (unanswered) {
      alert('Please answer all questions before submitting');
      return;
    }

    setShowResults(true);
  };

  const resetInterview = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
    setSelectedDomain('');
  };

  if (!selectedDomain) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">AI Interview Feedback</h1>
            <p className="text-gray-600">Select your domain to begin the interview assessment</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {domains.map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-center">
                  <BookOpen className="w-6 h-6 mr-3" />
                  <span className="font-semibold">{domain}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const { score, feedback } = generateFeedback();

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Interview Results</h1>
            <div className="flex justify-center items-center mb-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{score}%</span>
                </div>
                <div className="absolute -top-2 -right-2">
                  {score >= 80 ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : score >= 60 ? (
                    <AlertTriangle className="w-8 h-8 text-yellow-500" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  )}
                </div>
              </div>
            </div>
            <p className="text-lg text-gray-600">{feedback.overall}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                <Star className="w-6 h-6 mr-2" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-green-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-yellow-800 mb-4 flex items-center">
                <Target className="w-6 h-6 mr-2" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {feedback.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-yellow-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
              <MessageSquare className="w-6 h-6 mr-2" />
              Performance Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{feedback.performanceMetrics.technicalAccuracy}%</div>
                <div className="text-sm text-gray-600">Technical Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{feedback.performanceMetrics.communicationClarity}%</div>
                <div className="text-sm text-gray-600">Communication Clarity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{feedback.performanceMetrics.answerCompleteness}%</div>
                <div className="text-sm text-gray-600">Answer Completeness</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{feedback.performanceMetrics.keywordUsage}%</div>
                <div className="text-sm text-gray-600">Keyword Usage</div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <MessageSquare className="w-6 h-6 mr-2" />
              Detailed Analysis
            </h3>
            <div className="space-y-6">
              {feedback.detailedAnalysis.map((analysis, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Question {index + 1}:</h4>
                  <p className="text-gray-700 mb-4 italic">"{analysis.question}"</p>

                  <div className="mb-4">
                    <h5 className="font-medium text-gray-800 mb-2">Your Answer:</h5>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded">{analysis.answer || 'No answer provided'}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="font-medium text-green-800 mb-2">Found Keywords:</h5>
                      <div className="flex flex-wrap gap-2">
                        {analysis.foundKeywords.map((keyword, i) => (
                          <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-red-800 mb-2">Missing Keywords:</h5>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missingKeywords.map((keyword, i) => (
                          <span key={i} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-800 mr-2">Technical Score:</span>
                      <span className={`font-bold ${analysis.score >= 70 ? 'text-green-600' : analysis.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {analysis.score}%
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-800 mr-2">Clarity Score:</span>
                      <span className={`font-bold ${analysis.clarity >= 70 ? 'text-green-600' : analysis.clarity >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {analysis.clarity}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <h5 className="font-medium text-gray-800 mb-2">Feedback:</h5>
                    <p className="text-gray-700 text-sm">{analysis.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={resetInterview}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold"
            >
              Take Another Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  const questions = interviewQuestionsByDomain[selectedDomain];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Interview Feedback</h1>
          <p className="text-gray-600">Domain: <span className="font-semibold text-blue-600">{selectedDomain}</span></p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {questions.length}</span>
            <div className="flex space-x-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentQuestion
                      ? 'bg-blue-500'
                      : answers[index]
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {questions[currentQuestion].question}
            </h2>
            <textarea
              value={answers[currentQuestion] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
            >
              Previous
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-8 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 font-semibold"
              >
                Submit Interview
              </button>
            )}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => setSelectedDomain('')}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Change Domain
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewFeedback;