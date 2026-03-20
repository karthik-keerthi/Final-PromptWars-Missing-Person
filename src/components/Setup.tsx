import React, { useState } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { GoogleGenAI } from '@google/genai';
import missingPersonsData from '../data/missing_persons.json';

export default function Setup() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const runSetup = async () => {
    setIsProcessing(true);
    setStatus('Starting setup...');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      for (let i = 0; i < missingPersonsData.length; i++) {
        const person = missingPersonsData[i];
        setStatus(`Processing ${i + 1} of ${missingPersonsData.length}: ${person.name}`);
        setProgress(Math.round(((i + 1) / missingPersonsData.length) * 100));
        
        try {
          // Fetch the image from the local public folder
          const response = await fetch(person.personImageWebLink);
          if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
          
          const blob = await response.blob();
          
          // Convert blob to base64
          const base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          
          // Generate embedding
          const embedResult = await ai.models.embedContent({
            model: 'gemini-embedding-2-preview',
            contents: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: blob.type || 'image/jpeg',
                },
              },
            ],
          });
          
          const embedding = embedResult.embeddings?.[0]?.values;
          
          if (!embedding) {
            throw new Error('Failed to generate embedding');
          }
          
          // Save to Firestore
          const docRef = doc(collection(db, 'missingPersons'), person.id);
          await setDoc(docRef, {
            ...person,
            embedding,
            createdAt: new Date(),
          });
          
          // Add a small delay to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (err) {
          console.error(`Failed to process ${person.id}:`, err);
          // Continue with the next person even if one fails
        }
      }
      
      setStatus('Setup complete!');
    } catch (err) {
      console.error('Setup failed:', err);
      setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Database Setup</h2>
        <p className="text-gray-600 mb-6">
          This will process all missing persons, generate facial embeddings using Gemini, and save them to Firestore.
        </p>
        
        <div className="mb-6">
          <button
            onClick={runSetup}
            disabled={isProcessing}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Run Setup'}
          </button>
        </div>
        
        {status && (
          <div className="mb-4">
            <p className="font-medium text-gray-900">{status}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
