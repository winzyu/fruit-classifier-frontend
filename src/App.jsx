import React, { useState, useEffect } from 'react';
import { Upload, Loader2, History } from 'lucide-react';
import fruitsBg from './static/fruits-background.jpg';
import uploadBg from './static/upload-background.jpg';

const API_URL = 'http://localhost:5000';

const gridBackground = {
  backgroundImage: `
    linear-gradient(to right, rgba(220, 252, 231, 0.2) 2px, transparent 5px),
    linear-gradient(to bottom, rgba(220, 252, 231, 0.9) 2px, transparent 5px)
  `,
  backgroundSize: '24px 24px',
  backgroundColor: '#f0fdf4' 
};

const imageContainerStyles = {
  maxHeight: 'calc(100vh - 13rem)',
  overflowY: 'auto',
  overflowX: 'hidden'
};

export default function App() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(`${API_URL}/models`);
        const data = await response.json();
        setModels(data.models);
      } catch (err) {
        setError('Failed to fetch available models. Please ensure the server is running.');
      }
    };
    fetchModels();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setResult(null);
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
    setResult(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !selectedModel) {
      setError('Please select both an image and a model');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/predict/${selectedModel}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      const processedResult = { ...data };
      
      if (selectedModel.toLowerCase() === 'strawberry') {
        processedResult.originalPrediction = processedResult.prediction;
        processedResult.prediction = processedResult.prediction === 'Fresh' ? 'Rotten' : 'Fresh';
        processedResult.isStrawberry = true;
      }
      
      setResult(processedResult);
      setHistory(prev => [{
        id: Date.now(),
        image: preview,
        result: processedResult,
        model: selectedModel
      }, ...prev].slice(0, 8));
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during classification');
    } finally {
      setLoading(false);
    }
  };

  const loadHistoryItem = (item) => {
    setPreview(item.image);
    setSelectedModel(item.model);
    setResult(item.result);
    setError('');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={gridBackground}>
      {/* Header Bar */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-12 flex items-center">
            <div className="text-xl font-bold text-green-800">
              Fresc<span className="text-green-600">AI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto flex gap-4">
          <form onSubmit={handleSubmit} className="flex-1">
            <div className="grid grid-cols-3 gap-4 h-full">
              {/* Image Upload Area */}
              <div className="col-span-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 relative overflow-hidden h-[calc(100vh-6rem)]">
                <div 
                  className="absolute inset-0 opacity-70 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${uploadBg})`
                  }}
                />
                <div className="relative flex flex-col h-full">
                  <h2 className="text-lg font-bold text-green-800 mb-2">Upload Image</h2>
                  <div className="flex-1 bg-white/80 rounded-md p-4 overflow-hidden">
                    <div 
                      className="h-full border-2 border-green-300 border-dashed rounded-md hover:border-green-400 transition-colors overflow-auto"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <div style={imageContainerStyles}>
                        <div className="min-h-full w-full flex items-center justify-center p-2">
                          {preview ? (
                            <div className="relative w-full flex items-center justify-center">
                              <img
                                src={preview}
                                alt="Preview"
                                className="max-w-full object-contain"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                                <label className="cursor-pointer bg-white/90 rounded-md px-4 py-2 text-sm font-medium text-green-600 hover:text-green-500">
                                  Change Image
                                  <input
                                    type="file"
                                    className="sr-only"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                  />
                                </label>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <Upload className="h-8 w-8 text-green-400 mb-2 mx-auto" />
                              <div className="flex text-sm text-green-700 justify-center">
                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                  <span>Upload a file</span>
                                  <input
                                    type="file"
                                    className="sr-only"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-green-500 mt-1">PNG, JPG, JPEG up to 10MB</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 h-[calc(100vh-6rem)] flex flex-col">
                {/* Fruit Selection */}
                <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 relative overflow-hidden">
                  <div 
                    // className="absolute inset-0 opacity-80 bg-cover bg-center"
                    // style={{
                    //   backgroundImage: `url(${fruitsBg})`
                    // }}
                  />
                  <div className="relative">
                    <h2 className="text-lg font-bold text-green-800 mb-2">Select Fruit Type</h2>
                    <div className="bg-white/80 rounded-md p-4">
                      <div className="space-y-4">
                        <select
                          value={selectedModel}
                          onChange={handleModelChange}
                          className="block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        >
                          <option value="">Choose a fruit type...</option>
                          {models.map((model) => (
                            <option key={model} value={model}>
                              {model.charAt(0).toUpperCase() + model.slice(1)}
                            </option>
                          ))}
                        </select>

                        <button
                          type="submit"
                          disabled={loading || !file || !selectedModel}
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                              Processing...
                            </>
                          ) : (
                            'Classify Image'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results Area */}
                <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 relative overflow-hidden flex-1">
                  <div 
                    // className="absolute inset-0 opacity-80 bg-cover bg-center"
                    // style={{
                    //   backgroundImage: `url(${fruitsBg})`
                    // }}
                  />
                  <div className="relative h-full flex flex-col">
                    <h2 className="text-lg font-bold text-green-800 mb-2">Results</h2>
                    <div className="bg-white/80 rounded-md p-4 flex-1 overflow-auto">
                      {result && (
                        <div className="space-y-2">
                          <div className="text-sm text-green-700">
                            <p>Fruit Type: {result.fruit}</p>
                            <p className="text-lg font-semibold">Prediction: {result.prediction}</p>
                            <div className="border-t border-green-100 pt-2 mt-2">
                              <p className="font-medium mb-1">Processing Times:</p>
                              <ul className="space-y-0.5 text-sm">
                                <li>Image Processing: {result.timing.image_processing}</li>
                                <li>Prediction: {result.timing.prediction}</li>
                                <li>Total Time: {result.timing.total}</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {error && (
                        <div className="text-red-700">
                          <h3 className="font-medium">Error</h3>
                          <p className="text-sm">{error}</p>
                        </div>
                      )}

                      {!result && !error && (
                        <p className="text-sm text-green-600">Upload an image and select a fruit type to see results</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* History Panel */}
          <div className="w-24 flex flex-col bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 relative overflow-hidden h-[calc(100vh-6rem)]">
            <div 
              className="absolute inset-0 opacity-70 bg-cover bg-center"
              style={{
                backgroundImage: `url(${fruitsBg})`
              }}
            />
            <div className="relative">
              <div className="flex items-center justify-between text-green-800 font-medium mb-2 p-1">
                <History className="h-4 w-4" />
                <span className="text-sm">History</span>
              </div>
              
              <div className="bg-white/80 rounded-md p-2">
                <div className="h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar">
                  <div className="space-y-2">
                    {history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => loadHistoryItem(item)}
                        className="w-full aspect-square bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border-2 border-transparent hover:border-green-500 focus:outline-none focus:border-green-600"
                      >
                        <img
                          src={item.image}
                          alt="Historical prediction"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
