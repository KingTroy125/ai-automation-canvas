import React, { useState, useEffect } from 'react';
import { testBackendConnection, getAvailableModels } from './lib/api';

interface TestResult {
  name: string;
  success: boolean;
  error?: string;
  data?: any;
}

const TestPage: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      // Test 1: Basic connectivity
      const connectionTest = await testBackendConnection();
      setResults(prev => [...prev, {
        name: 'Backend Connectivity',
        success: connectionTest.success,
        error: connectionTest.success ? undefined : connectionTest.error,
        data: connectionTest.success ? connectionTest.data : undefined
      }]);
      
      // Test 2: Get models
      try {
        const modelsData = await getAvailableModels();
        setResults(prev => [...prev, {
          name: 'Models API',
          success: true,
          data: modelsData
        }]);
      } catch (error) {
        setResults(prev => [...prev, {
          name: 'Models API',
          success: false,
          error: error instanceof Error ? error.message : String(error)
        }]);
      }
      
      // Test 3: Environment info
      setResults(prev => [...prev, {
        name: 'Environment Info',
        success: true,
        data: {
          href: window.location.href,
          hostname: window.location.hostname,
          protocol: window.location.protocol,
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        }
      }]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    runTests();
  }, []);
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Netlify API Connection Test</h1>
      
      <button 
        onClick={runTests}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4 disabled:opacity-50"
      >
        {loading ? 'Running Tests...' : 'Run Tests Again'}
      </button>
      
      <div className="space-y-6">
        {results.map((result, index) => (
          <div 
            key={index} 
            className={`p-4 rounded border ${result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}
          >
            <h2 className="text-lg font-bold flex items-center">
              <span 
                className={`w-4 h-4 rounded-full mr-2 ${result.success ? 'bg-green-500' : 'bg-red-500'}`}
              ></span>
              {result.name}: {result.success ? 'Success' : 'Failed'}
            </h2>
            
            {result.error && (
              <div className="mt-2 p-2 bg-red-100 text-red-800 rounded">
                <strong>Error:</strong> {result.error}
              </div>
            )}
            
            {result.data && (
              <div className="mt-2">
                <strong>Data:</strong>
                <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto text-xs">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestPage; 