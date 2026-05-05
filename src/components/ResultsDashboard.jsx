import React, { useState, useEffect } from 'react';
import { AuthContext } from '../App';




const ResultsDashboard = ({ gameData, onClose, language = 'sinhala' }) => {
  const analyzer = new ADHDAnalyzer();
  const results = analyzer.analyzeGameData(gameData);
  
  const translations = {
    sinhala: {
      title: 'ඇඩීඑච්ඩී තක්සේරු ප්‍රතිඵල',
      riskLevel: 'අවදානම් මට්ටම',
      adhdPercentage: 'ඇඩීඑච්ඩී අවදානම් ප්‍රතිශතය',
      indicators: 'අංග',
      strengths: 'ශක්තිමත් අංග',
      recommendations: 'උපදෙස්',
      detailedAnalysis: 'විස්තරාත්මක විශ්ලේෂණය',
      disclaimer: 'සටහන: මෙම ප්‍රතිඵල නිශ්චිත විනිශ්චයක් නොවේ. වෛද්‍ය විශේෂඥයෙකු සමඟ සාකච්ඡා කරන්න.',
      saveResults: 'ප්‍රතිඵල සුරකින්න',
      print: 'මුද්‍රණය කරන්න',
      close: 'වසන්න'
    },
    english: {
      title: 'ADHD Assessment Results',
      riskLevel: 'Risk Level',
      adhdPercentage: 'ADHD Risk Percentage',
      indicators: 'Indicators',
      strengths: 'Strengths',
      recommendations: 'Recommendations',
      detailedAnalysis: 'Detailed Analysis',
      disclaimer: 'Note: These results are not a diagnosis. Consult with a healthcare professional.',
      saveResults: 'Save Results',
      print: 'Print',
      close: 'Close'
    }
  };
  
  const t = translations[language] || translations.english;

  const getRiskColor = (level) => {
    switch(level) {
      case 'Low Risk': return 'bg-green-500';
      case 'Mild Risk': return 'bg-yellow-500';
      case 'Moderate Risk': return 'bg-orange-500';
      case 'High Risk': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPercentageColor = (percentage) => {
    if (percentage < 30) return 'text-green-600';
    if (percentage < 50) return 'text-yellow-600';
    if (percentage < 70) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t.title}</h1>
          <p className="opacity-90">Game Session: {new Date(gameData.timestamp).toLocaleDateString()}</p>
        </div>

        {/* Main Results */}
        <div className="p-8">
          {/* Risk Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* ADHD Percentage */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.adhdPercentage}</h2>
              <div className="relative">
                <div className={`text-6xl font-bold ${getPercentageColor(results.adhdPercentage)} mb-2`}>
                  {results.adhdPercentage}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div 
                    className={`h-4 rounded-full ${getRiskColor(results.riskLevel)} transition-all duration-1000`}
                    style={{ width: `${results.adhdPercentage}%` }}
                  ></div>
                </div>
                <div className={`inline-block px-4 py-2 rounded-full text-white font-bold ${getRiskColor(results.riskLevel)}`}>
                  {results.riskLevel}
                </div>
              </div>
            </div>

            {/* Key Indicators */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.indicators}</h2>
              <div className="space-y-4">
                {Object.entries(results.adhdIndicators).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}:
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${value * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-bold w-12 text-right">
                        {Math.round(value * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.detailedAnalysis}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(results.detailedAnalysis).map(([key, data]) => (
                <div key={key} className="bg-white border border-gray-200 rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 capitalize">
                    {key}
                  </h3>
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Score</span>
                      <span className="text-sm font-bold text-blue-600">
                        {Math.round(data.score * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          data.score > 0.6 ? 'bg-red-500' : 
                          data.score > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${data.score * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{data.description}</p>
                  <ul className="space-y-2">
                    {data.examples.map((example, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className={`inline-block w-2 h-2 rounded-full mt-2 mr-2 ${
                          data.score > 0.6 ? 'bg-red-500' : 'bg-green-500'
                        }`}></span>
                        <span className="text-sm text-gray-700">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths */}
          {results.strengths.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.strengths}</h2>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600">✓</span>
                      </div>
                      <p className="text-gray-700 font-medium">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.recommendations}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.recommendations.map((rec, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-bold rounded-full">
                      {rec.category}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-3">{rec.suggestion}</h4>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-600 mb-2">සුදුසු ක්‍රියාකාරකම්:</p>
                    {rec.activities.map((activity, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <p className="text-sm text-gray-700">{activity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-2xl">ℹ️</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Important Notice</h3>
                <p className="text-gray-700 leading-relaxed">
                  {t.disclaimer} This assessment is based on game performance and provides 
                  preliminary insights. It should be used as part of a comprehensive 
                  evaluation conducted by qualified professionals.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              {t.print}
            </button>
            <button
              onClick={() => {
                const dataStr = JSON.stringify(results, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                const exportFileDefaultName = `ADHD-Assessment-${new Date().toISOString()}.json`;
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
              }}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              {t.saveResults}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;