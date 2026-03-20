import React, { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Webcam from 'react-webcam';
import { Camera, Upload, Search as SearchIcon, CheckCircle, XCircle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function Search() {
  const { t } = useTranslation();
  const webcamRef = useRef<Webcam>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setImageSrc(imageSrc || null);
  }, [webcamRef]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!imageSrc) return;
    setIsAnalyzing(true);
    setError(null);
    setMatchResult(null);

    try {
      // 1. Fetch all missing persons from Firestore
      const snapshot = await getDocs(collection(db, 'missingPersons'));
      const missingPersons = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));

      // 2. Use Gemini to get embedding for the uploaded image
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Extract base64 data
      const base64Data = imageSrc.split(',')[1];
      const mimeType = imageSrc.split(';')[0].split(':')[1];
      
      const embedResult = await ai.models.embedContent({
        model: 'gemini-embedding-2-preview',
        contents: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType || 'image/jpeg',
            },
          },
        ],
      });
      
      const uploadedEmbedding = embedResult.embeddings?.[0]?.values;
      
      if (!uploadedEmbedding) {
        throw new Error('Failed to generate embedding for the uploaded image');
      }

      // 3. Compute cosine similarity
      let bestMatch = null;
      let highestSimilarity = -1;

      const cosineSimilarity = (vecA: number[], vecB: number[]) => {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vecA.length; i++) {
          dotProduct += vecA[i] * vecB[i];
          normA += vecA[i] * vecA[i];
          normB += vecB[i] * vecB[i];
        }
        if (normA === 0 || normB === 0) return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
      };

      for (const person of missingPersons) {
        if (person.embedding && Array.isArray(person.embedding)) {
          const similarity = cosineSimilarity(uploadedEmbedding, person.embedding);
          if (similarity > highestSimilarity) {
            highestSimilarity = similarity;
            bestMatch = person;
          }
        }
      }

      // 4. Determine if match is found (threshold can be adjusted)
      const MATCH_THRESHOLD = 0.75; // Adjust based on testing
      
      if (bestMatch && highestSimilarity >= MATCH_THRESHOLD) {
        setMatchResult({
          matchFound: true,
          person: bestMatch,
          confidenceScore: Math.round(highestSimilarity * 100),
          reasoning: `Found a match with ${(highestSimilarity * 100).toFixed(1)}% confidence.`
        });
      } else {
        setMatchResult({ matchFound: false });
      }
    } catch (err) {
      console.error(err);
      setError(t('error'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('search_title')}</h2>
        <p className="text-gray-600 mb-8">{t('search_desc')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {!imageSrc ? (
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden bg-gray-100 aspect-video relative">
                  {/* @ts-ignore */}
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                    videoConstraints={{ facingMode: "user" }}
                  />
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={capture}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                    aria-label="Capture Photo"
                  >
                    <Camera className="w-4 h-4" aria-hidden="true" /> {t('capture_photo')}
                  </button>
                  <label className="flex-1 flex items-center justify-center gap-2 bg-white text-indigo-600 border border-indigo-600 py-2 px-4 rounded-md hover:bg-indigo-50 transition-colors cursor-pointer" aria-label="Upload Photo">
                    <Upload className="w-4 h-4" aria-hidden="true" /> {t('upload_photo')}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} aria-hidden="true" />
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden bg-gray-100 aspect-video relative">
                  <img src={imageSrc} alt="Captured" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => { setImageSrc(null); setMatchResult(null); }}
                    className="absolute top-2 right-2 bg-gray-900/50 text-white p-1 rounded-full hover:bg-gray-900/70"
                    aria-label="Clear Image"
                  >
                    <XCircle className="w-6 h-6" aria-hidden="true" />
                  </button>
                </div>
                <button 
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  aria-busy={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <span className="animate-pulse">{t('analyzing')}</span>
                  ) : (
                    <><SearchIcon className="w-5 h-5" aria-hidden="true" /> Analyze Image</>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 flex flex-col justify-center min-h-[300px]" aria-live="polite">
            {isAnalyzing && (
              <div className="text-center text-gray-500">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" aria-hidden="true"></div>
                <p>{t('analyzing')}</p>
              </div>
            )}

            {!isAnalyzing && matchResult && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {matchResult.matchFound && matchResult.person ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t('match_found')}</h3>
                    <p className="text-emerald-600 font-medium mb-6">Confidence: {matchResult.confidenceScore}%</p>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-left">
                      <img src={matchResult.person.personImageWebLink} alt={matchResult.person.name} className="w-32 h-32 object-cover rounded-md mx-auto mb-4" referrerPolicy="no-referrer" />
                      <h4 className="font-bold text-lg mb-2 text-center">{matchResult.person.name}</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium text-gray-900">Age:</span> {matchResult.person.age}</p>
                        <p><span className="font-medium text-gray-900">Last Seen:</span> {matchResult.person.lastSeen}</p>
                        <p><span className="font-medium text-gray-900">Contact:</span> {matchResult.person.mobileNumbers}</p>
                        <p><span className="font-medium text-gray-900">Police Station:</span> {matchResult.person.policeStationArea}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <XCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Match Found</h3>
                    <p className="text-gray-600 mb-6">{t('no_match')}</p>
                    <a href="/register" className="inline-block bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors">
                      {t('register_missing')}
                    </a>
                  </div>
                )}
              </div>
            )}

            {!isAnalyzing && !matchResult && !error && (
              <div className="text-center text-gray-400">
                <SearchIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Upload or capture an image to begin identification.</p>
              </div>
            )}

            {error && (
              <div className="text-center text-rose-600">
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
