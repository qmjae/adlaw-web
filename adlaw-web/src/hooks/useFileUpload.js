import { useState, useCallback } from 'react';

export const useFileUpload = (maxFiles = 5) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  const addFiles = useCallback((newFiles) => {
    setError(null);
    
    if (files.length + newFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return false;
    }

    const processedFiles = newFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type
    }));

    setFiles(prev => [...prev, ...processedFiles]);
    return true;
  }, [files.length, maxFiles]);

  const removeFile = useCallback((index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setError(null);
  }, []);

  return {
    files,
    error,
    addFiles,
    removeFile,
    clearFiles
  };
};