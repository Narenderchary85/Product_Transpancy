import React, { useRef, useState } from "react";
import Navbar from './Navbar';
import { useSimplePdfExport } from "../hooks/usePdfExport";
import ProductTransparencyReport from "./ProductTransparencyReport";
import ReactDOM from "react-dom/client";

const AddProductForm = () => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [transparencyScore, setTransparencyScore] = useState(0);
  const [productInfo, setProductInfo] = useState({ 
    name: "", 
    category: "", 
    description: "" 
  });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [message, setMessage] = useState("");
  const pdfRef = useRef();
  const { exportToPdf } = useSimplePdfExport();

  const cleanQuestions = (questions) => {
    return (questions || [])
      .map(q => {
        let cleanQ = q
          .replace(/[\[\]\"\?`]/g, "")
          .replace(/json/gi, "")
          .replace(/\s+/g, " ")
          .trim();
        
        if (!cleanQ.endsWith('?') && !cleanQ.endsWith('.') && !cleanQ.endsWith('!')) {
          cleanQ += '?';
        }
        
        return cleanQ;
      })
      .filter(q => q.length > 5 && q.includes('?'));
  };

  const handleBasicSubmit = async () => {
    if (!productInfo.name || !productInfo.category) {
      setError("Please fill in product name and category");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://ai-rag-cune.onrender.com/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_info: productInfo,
          qa_history: [],
          current_score: 0
        })
      });
      
      if (!res.ok) throw new Error('Failed to generate questions');
      
      const data = await res.json();
      console.log("Initial response:", data);
      
      const cleanQuestionsData = cleanQuestions(data.questions);
      
      setQuestions(cleanQuestionsData);
      setTransparencyScore(data.transparency_score || 0);
      setProgress(data.transparency_score || 0);
      setMessage(data.message || "");
      setStep(2);
    } catch (err) {
      setError("Failed to generate questions. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextBatch = async () => {
    const unanswered = questions.filter(q => !answers[q]?.trim());
    if (unanswered.length > 0) {
      setError(`Please answer all questions before continuing.`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newHistory = [
        ...completedQuestions,
        ...questions.map((q) => ({ 
          question: q, 
          answer: answers[q] 
        }))
      ];

      console.log("Sending request with:", {
        history_length: newHistory.length,
        current_score: transparencyScore
      });

      const res = await fetch("https://ai-rag-cune.onrender.com/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_info: productInfo,
          qa_history: newHistory,
          current_score: transparencyScore
        })
      });

      if (!res.ok) throw new Error('Failed to generate questions');
      
      const data = await res.json();
      console.log("Next batch response:", data);
      
      const cleanQuestionsData = cleanQuestions(data.questions);
      
      setCompletedQuestions(newHistory);
      setAnswers({});
      setTransparencyScore(data.transparency_score || 0);
      setProgress(data.transparency_score || 0);
      setMessage(data.message || "");
      
      if (data.is_complete || data.transparency_score >= 100) {
        setIsComplete(true);
        setStep(3);
        setProgress(100);
      } else if (cleanQuestionsData.length === 0) {
        setStep(3);
        setProgress(100);
      } else {
        setQuestions(cleanQuestionsData);
      }
    } catch (err) {
      setError("Failed to generate next questions. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (question, answer) => {
    setAnswers(prev => ({
      ...prev,
      [question]: answer
    }));
    setError("");
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-orange-500";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLevel = (score) => {
    if (score >= 80) return "Excellent Transparency";
    if (score >= 60) return "Good Transparency";
    if (score >= 40) return "Moderate Transparency";
    if (score >= 20) return "Limited Transparency";
    return "Low Transparency";
  };

  const testScoring = async () => {
    const testAnswers = [
      {
        question: "What is the complete nutritional breakdown?",
        answer: "Our Classic Beef Burger contains 650 calories per serving, with 35g of total fat, 45g of protein, 45g of carbohydrates, and 980mg of sodium."
      },
      {
        question: "Are there any allergens present?",
        answer: "Yes, the burger contains gluten (wheat bun), dairy (cheese), and our sauce contains soy and eggs. Cooked on shared equipment with sesame."
      }
    ];

    const res = await fetch("https://ai-rag-cune.onrender.com/test-scoring", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test_answers: testAnswers })
    });
    
    const result = await res.json();
    console.log("Scoring test result:", result);
  };

  const handleAddProduct = async () => {
    setLoading(true);
    const qaArray = completedQuestions.map((qa) => ({
      question: qa.question,
      answer: qa.answer,
    }));

    const payload = {
      productName: productInfo.name,
      category: productInfo.category,
      description: productInfo.description,
      qa: qaArray,
    };

    try {
      const addRes = await fetch("https://product-transpancy-backend.onrender.com/product/addproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const addData = await addRes.json();
      setMessage("Product added successfully!");
      if (!addData.success) throw new Error("Failed to add product");

      
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const tempContainer = document.createElement("div");
      document.body.appendChild(tempContainer);

      const root = ReactDOM.createRoot(tempContainer);
      root.render(
        <ProductTransparencyReport
          productData={{
            productName: productInfo.name,
            category: productInfo.category,
            description: productInfo.description,
            qa: completedQuestions,
          }}
          transparencyScore={transparencyScore}
        />
      );
  
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await exportToPdf(tempContainer, `${productInfo.name}_transparency_report.pdf`);

      root.unmount();
      document.body.removeChild(tempContainer);
  
      console.log("Report generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-8 relative min-h-[600px]">
      <div className="flex justify-between items-center mb-8 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Transparency</h1>
          <p className="text-gray-600 mt-2">Build trust through detailed product information</p>
        </div>
        <div className="text-center">
          <div className={`text-4xl font-bold ${getScoreColor(transparencyScore)}`}>
            {transparencyScore}%
          </div>
          <div className="text-sm text-gray-600 font-medium">
            {getScoreLevel(transparencyScore)}
          </div>
          <div className="w-32 bg-gray-200 rounded-full h-3 mt-2 mx-auto">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                transparencyScore >= 80 ? 'bg-green-500' :
                transparencyScore >= 60 ? 'bg-orange-500' :
                transparencyScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${transparencyScore}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-orange-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between px-4">
          {[1, 2, 3].map((stepNum) => (
            <div
              key={stepNum}
              className={`flex flex-col items-center ${
                step >= stepNum ? 'text-orange-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold border-2 transition-all duration-300 ${
                  step >= stepNum
                    ? 'bg-orange-500 text-white border-orange-500 scale-110 shadow-lg'
                    : 'bg-white text-gray-500 border-gray-300'
                }`}
              >
                {stepNum}
              </div>
              <span className="text-sm mt-2 font-medium">
                {stepNum === 1 && 'Basic Info'}
                {stepNum === 2 && 'Questions'}
                {stepNum === 3 && 'Review'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">{message}</p>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-2xl z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Analyzing your responses...</p>
            <p className="text-gray-500 text-sm mt-2">Calculating transparency score: {transparencyScore}%</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Basic Product Details</h2>
          </div>
          
          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                value={productInfo.name}
                onChange={(e) => setProductInfo({ ...productInfo, name: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <input
                type="text"
                placeholder="e.g., Electronics, Clothing, Food"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                value={productInfo.category}
                onChange={(e) => setProductInfo({ ...productInfo, category: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                placeholder="Brief description of your product..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 resize-none"
                rows="4"
                value={productInfo.description}
                onChange={(e) => setProductInfo({ ...productInfo, description: e.target.value })}
              />
            </div>
            
            <button 
              onClick={handleBasicSubmit} 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isComplete ? 'Completed!' : 'Product Questions'}
            </h2>
            <p className="text-gray-600">
              {isComplete 
                ? 'Your product has achieved excellent transparency'
                : `Answered: ${completedQuestions.length} questions | Score: ${transparencyScore}%`
              }
            </p>
          </div>

          {!isComplete && (
            <>
              <div className="space-y-6 max-w-2xl mx-auto">
                {questions.map((q, index) => (
                  <div 
                    key={q} 
                    className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start space-x-3 mb-4">
                      <span className="bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full min-w-[40px] text-center">
                        Q{completedQuestions.length + index + 1}
                      </span>
                      <p className="text-gray-800 font-medium text-lg flex-1">{q}</p>
                    </div>
                    <input
                      type="text"
                      value={answers[q] || ""}
                      onChange={(e) => handleAnswerChange(q, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      placeholder="Provide detailed answer to improve transparency..."
                    />
                  </div>
                ))}
              </div>
              
              <div className="max-w-2xl mx-auto mt-8">
                <button 
                  onClick={handleNextBatch} 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {transparencyScore >= 80 ? 'Complete Assessment' : 'Submit Answers & Continue'}
                </button>
              </div>
            </>
          )}

          {isComplete && (
            <div className="text-center max-w-2xl mx-auto">
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">Completed!</h3>
                <p className="text-green-700">
                  Your product has achieved a transparency score of {transparencyScore}%
                </p>
              </div>
              <button 
                onClick={() => setStep(3)}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                View Detailed Report
              </button>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Transparency Report</h2>
            <p className="text-gray-600">Complete overview of your product transparency</p>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-6 text-white mb-8 text-center">
            <div className="text-5xl font-bold mb-2">{transparencyScore}%</div>
            <div className="text-xl font-semibold mb-2">{getScoreLevel(transparencyScore)}</div>
            <p className="opacity-90">
              Based on {completedQuestions.length} questions answered
            </p>
          </div>
          
          <div className="space-y-4 max-w-4xl mx-auto">
            {completedQuestions.map((qa, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Q{index + 1}
                      </span>
                      <span className="text-gray-500 text-sm">Question</span>
                    </div>
                    <p className="text-gray-800 font-medium mb-4">{qa.question}</p>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                        A{index + 1}
                      </span>
                      <span className="text-gray-500 text-sm">Your Answer</span>
                    </div>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{qa.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="max-w-2xl mx-auto mt-8 flex space-x-4"> 
            <button 
              onClick={handleAddProduct}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Submit
            </button>

            <button 
              onClick={handleGenerateReport}
              disabled={loading}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {loading ? 'Generating PDF...' : 'Download PDF Report'}
            </button>
          </div>

        </div>
      )}
    </div>
    </>
  );
};

export default AddProductForm;