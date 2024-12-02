import { useState } from 'react';
import { defectApi } from '../lib/defectApi';

export const useDefectAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  const analyzeImages = async (files) => {
    setLoading(true);
    setError(null);
    try {
      const analysisResults = await defectApi.detectMultipleDefects(files);
      setResults(analysisResults);
      return analysisResults;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    results,
    analyzeImages
  };
};