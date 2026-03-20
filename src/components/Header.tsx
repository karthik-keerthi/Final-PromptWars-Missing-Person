import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Search, UserPlus, Home } from 'lucide-react';

export default function Header() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold flex items-center gap-2">
              <Home className="w-6 h-6" />
              {t('app_title')}
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-indigo-200 transition-colors">{t('home')}</Link>
            <Link to="/search" className="hover:text-indigo-200 transition-colors flex items-center gap-1"><Search className="w-4 h-4" /> {t('search_identify')}</Link>
            <Link to="/register" className="hover:text-indigo-200 transition-colors flex items-center gap-1"><UserPlus className="w-4 h-4" /> {t('register_missing')}</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <select 
              onChange={(e) => changeLanguage(e.target.value)} 
              value={i18n.language}
              className="bg-indigo-700 text-white border-none rounded-md py-1 px-2 focus:ring-2 focus:ring-white"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="te">తెలుగు</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
