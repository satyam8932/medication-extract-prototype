import React, { useState, useRef } from 'react';
import axios from 'axios';
import apiURL from './apiURL.js';

function App() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleCaptureAndUpload = async () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL('image/png');
    const blob = dataURItoBlob(image);
    uploadImage(blob);
    setShowCamera(false);
  };

  const uploadImage = async (image) => {
    try {
      console.log("Loading data...");
      setLoading(true);
      const formData = new FormData();
      formData.append('image', image);
      const response = await axios.post(`${apiURL}/api/vision`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 300000,
      });
      setResponse(response.data);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      setResponse('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const byteArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: mimeString });
  };

  const handleTakePicture = () => {
    setShowCamera(true);
    const constraints = {
      video: {
        facingMode: 'environment' // Use the back camera if available
      }
    };
    try{
      navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error('Error accessing camera:', err);
      });
    } catch {
      navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error('Error accessing camera:', err);
      });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8"> {/* Changed max-w-lg to max-w-xl */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Process Medication</h2>
        <div className="mb-4 mx-auto flex justify-center">
          <button onClick={handleTakePicture} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Take a Picture
          </button>
          <button onClick={() => fileInputRef.current.click()} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4">
            Select Image
          </button>
          <input type="file" accept="image/*" className="file-input file-input-bordered hidden" ref={fileInputRef} onChange={handleFileInputChange} />
        </div>
  
        {showCamera && (
          <div className='mx-auto flex flex-col items-center'>
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-auto mb-4"></video>
            <div className="flex">
              <button onClick={handleCaptureAndUpload} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4">
                Capture and Upload
              </button>
              <button onClick={() => setShowCamera(false)} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Close Camera
              </button>
            </div>
          </div>
        )}
        {loading && <div className="text-center"><div className="spinner"><span className="loading loading-dots loading-lg"></span></div></div>}
        {response && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-white font-semibold">Response:</p>
            <pre className="text-yellow-500 overflow-auto break-words">{response}</pre>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </div>
  );  
}

export default App;
