import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, seedDatabase } from '../firebase';
import { AlertCircle, Activity, Users, MapPin } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'missingPersons'), orderBy('createdAt', 'desc'), limit(6));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentReports(reports);
    }, (error) => {
      console.error("Firestore Error: ", error);
    });
    return () => unsubscribe();
  }, []);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedDatabase();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Error seeding database");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Activity className="text-indigo-600" aria-hidden="true" />
          {t('stats_title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 rounded-lg p-4 flex items-start gap-4" role="status" aria-label="Stat 1">
            <div className="bg-indigo-100 p-3 rounded-full text-indigo-600" aria-hidden="true">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-indigo-900 font-medium">{t('stats_1')}</p>
            </div>
          </div>
          <div className="bg-rose-50 rounded-lg p-4 flex items-start gap-4" role="status" aria-label="Stat 2">
            <div className="bg-rose-100 p-3 rounded-full text-rose-600" aria-hidden="true">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-rose-900 font-medium">{t('stats_2')}</p>
            </div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 flex items-start gap-4" role="status" aria-label="Stat 3">
            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600" aria-hidden="true">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-emerald-900 font-medium">{t('stats_3')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('recent_reports')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Recent Reports List">
        {recentReports.map((person) => (
          <div key={person.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 w-full bg-gray-200 relative">
              <img 
                src={person.personImageWebLink || 'https://picsum.photos/seed/missing/400/300'} 
                alt={`Photo of ${person.name}`} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                {person.status || 'Missing'}
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{person.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium text-gray-900">Age:</span> {person.age}</p>
                <p><span className="font-medium text-gray-900">Last Seen:</span> {person.lastSeen}</p>
                <p><span className="font-medium text-gray-900">Date Missing:</span> {person.dateMissingFrom}</p>
                <p><span className="font-medium text-gray-900">District:</span> {person.district}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recentReports.length === 0 && (
        <div className="text-center mt-8 mb-8">
          <button 
            onClick={handleSeed} 
            disabled={isSeeding} 
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isSeeding ? "Seeding Database..." : "Seed Initial Database"}
          </button>
        </div>
      )}
    </div>
  );
}
