import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

export default function Register() {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    dateMissingFrom: '',
    lastSeen: '',
    mobileNumbers: '',
    age: '',
    languagesKnown: '',
    district: '',
    policeStationArea: '',
    caseRegistered: '',
    mentalHealthStatus: '',
    personImageWebLink: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setStatus('idle');

    try {
      await addDoc(collection(db, 'missingPersons'), {
        ...formData,
        age: parseInt(formData.age) || 0,
        status: 'missing',
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({
        name: '', relation: '', dateMissingFrom: '', lastSeen: '', mobileNumbers: '',
        age: '', languagesKnown: '', district: '', policeStationArea: '', caseRegistered: '',
        mentalHealthStatus: '', personImageWebLink: ''
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('register_title')}</h2>
        
        {status === 'success' && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-md flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {t('success')}
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-md flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {t('error')}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')} *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('age')} *</label>
              <input required type="number" name="age" value={formData.age} onChange={handleChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('relation')}</label>
              <input type="text" name="relation" value={formData.relation} onChange={handleChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('date_missing')}</label>
              <input type="date" name="dateMissingFrom" value={formData.dateMissingFrom} onChange={handleChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('last_seen')}</label>
              <input type="text" name="lastSeen" value={formData.lastSeen} onChange={handleChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('mobile')}</label>
              <input type="text" name="mobileNumbers" value={formData.mobileNumbers} onChange={handleChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('languages')}</label>
              <input type="text" name="languagesKnown" value={formData.languagesKnown} onChange={handleChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('district')}</label>
              <input type="text" name="district" value={formData.district} onChange={handleChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('police_station')}</label>
              <input type="text" name="policeStationArea" value={formData.policeStationArea} onChange={handleChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('case_registered')}</label>
              <input type="text" name="caseRegistered" value={formData.caseRegistered} onChange={handleChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('mental_health')}</label>
              <input type="text" name="mentalHealthStatus" value={formData.mentalHealthStatus} onChange={handleChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('image_url')} *</label>
              <input required type="url" name="personImageWebLink" value={formData.personImageWebLink} onChange={handleChange} placeholder="https://..." className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t('submitting') : t('submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
