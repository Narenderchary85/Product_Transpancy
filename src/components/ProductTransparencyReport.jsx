import React from 'react';

const ProductTransparencyReport = React.forwardRef(({ productData, transparencyScore }, ref) => {
    const { productName, category, description, qa } = productData;

    const getScoreColor = (score) => {
      if (score >= 80) return "bg-green-600";
      if (score >= 60) return "bg-orange-600";
      if (score >= 40) return "bg-yellow-500";
      return "bg-red-600";
    };
  
    const formatDate = () => {
      return new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
  
    return (
      <div ref={ref} className="w-full min-h-screen bg-white p-8">
        <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Product Transparency Report
          </h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Generated on {formatDate()}</p>
            <div className="text-right">
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${getScoreColor(transparencyScore)} text-white font-bold`}>
                {transparencyScore}%
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {transparencyScore >= 80 ? 'Excellent' : 
                 transparencyScore >= 60 ? 'Good' : 
                 transparencyScore >= 40 ? 'Moderate' : 'Limited'} Transparency
              </p>
            </div>
          </div>
        </div>
  
        <div className="mb-8 bg-gray-50 rounded-lg p-6 border border-gray-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Product Name</h3>
              <p className="text-gray-900">{productName}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Category</h3>
              <p className="text-gray-900">{category}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Description</h3>
              <p className="text-gray-900">{description}</p>
            </div>
          </div>
        </div>
  
        <div className="mb-8 bg-white border border-gray-300 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Transparency Assessment</h2>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Overall Score</h3>
              <p className="text-gray-600">Based on {qa.length} questions</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{transparencyScore}%</div>
            </div>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-4">
            <div
              className={`h-4 rounded-full ${getScoreColor(transparencyScore)}`}
              style={{ width: `${transparencyScore}%` }}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions & Answers</h2>
          <div className="space-y-4">
            {qa.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-300">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    Q{index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                    <div className="bg-white rounded p-3 border border-gray-400">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                          A
                        </div>
                        <span className="text-sm font-medium text-gray-700">Answer</span>
                      </div>
                      <p className="text-gray-800">{item.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
          <div className="mt-8 pt-6 border-t-2 border-gray-300 text-center text-gray-500 text-sm">
          <p>Report ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          <p className="mt-1">Generated automatically by Transparency</p>
        </div>
      </div>
    );
  });

ProductTransparencyReport.displayName = 'ProductTransparencyReport';

export default ProductTransparencyReport;