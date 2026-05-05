// AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { AuthContext } from '../App';

const AdminDashboard = () => {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  useEffect(() => {
    // Load saved assessments from localStorage
    const saved = JSON.parse(localStorage.getItem('adhd-assessments') || '[]');
    setAssessments(saved);
  }, []);

  const getRiskColor = (percentage) => {
    if (percentage < 30) return 'bg-green-100 text-green-800';
    if (percentage < 50) return 'bg-yellow-100 text-yellow-800';
    if (percentage < 70) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">ADHD Assessment Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assessment List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Assessments</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Child ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Risk Level
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ADHD %
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {assessments.map((assessment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(assessment.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          Child-{assessment.sessionId.toString().slice(-6)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(assessment.adhdPercentage)}`}>
                            {assessment.riskLevel}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  assessment.adhdPercentage < 30 ? 'bg-green-500' :
                                  assessment.adhdPercentage < 50 ? 'bg-yellow-500' :
                                  assessment.adhdPercentage < 70 ? 'bg-orange-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${assessment.adhdPercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-bold text-gray-700">
                              {assessment.adhdPercentage}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedAssessment(assessment)}
                            className="text-blue-600 hover:text-blue-900 font-medium text-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Statistics Sidebar */}
          <div className="space-y-6">
            {/* Risk Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">Risk Distribution</h3>
              <div className="space-y-3">
                {['Low Risk', 'Mild Risk', 'Moderate Risk', 'High Risk'].map((level) => {
                  const count = assessments.filter(a => a.riskLevel === level).length;
                  const percentage = assessments.length > 0 
                    ? Math.round((count / assessments.length) * 100) 
                    : 0;
                  
                  return (
                    <div key={level} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{level}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              level === 'Low Risk' ? 'bg-green-500' :
                              level === 'Mild Risk' ? 'bg-yellow-500' :
                              level === 'Moderate Risk' ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-700 w-8 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Average Indicators */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">Average Indicators</h3>
              <div className="space-y-4">
                {assessments.length > 0 && Object.keys(assessments[0].adhdIndicators || {}).map((indicator) => {
                  const avg = assessments.reduce((sum, a) => 
                    sum + (a.adhdIndicators?.[indicator] || 0), 0) / assessments.length;
                  
                  return (
                    <div key={indicator}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 capitalize">
                          {indicator.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <span className="font-bold text-gray-700">
                          {Math.round(avg * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${avg * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed View Modal */}
        {selectedAssessment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <ResultsDashboard 
                gameData={selectedAssessment}
                onClose={() => setSelectedAssessment(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;