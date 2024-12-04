import axios from 'axios';

const API_URL = 'http://192.168.1.56:8000/';

export const defectApi = {
  async detectDefects(imageFile) {
    try {
      console.log('Starting defect detection...');

      // Add a ping check before sending the main request
      try {
        await axios.get(API_URL, { timeout: 5000 });
      } catch (error) {
        throw new Error('API server is not responding. It may be in cold start mode. Please try again in a few moments.');
      }

      const formData = new FormData();
      formData.append('file', imageFile);

      console.log('Sending request to:', `${API_URL}/detect/`);
      const response = await axios.post(`${API_URL}/detect/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        timeout: 60000,
        validateStatus: function (status) {
          return status < 500;
        }
      });

      console.log('Response received:', response.status, response.data);
      return response.data;
    } catch (error) {
      console.error('Detailed error info:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        }
      });
      throw error;
    }
  },

  async detectMultipleDefects(files) {
    try {
      console.log('Processing multiple files for detection...');
      const results = await Promise.all(
        files.map(async (file) => {
          const result = await this.detectDefects(file);
          return {
            ...file,
            detections: result.detections
          };
        })
      );
      console.log('Multiple detection results:', results);
      return results;
    } catch (error) {
      console.error('Error detecting multiple defects:', error);
      throw error;
    }
  }
};