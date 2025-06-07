
import React from 'react';
import { useTranslation } from 'react-i18next';

export const LoadingSpinner: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center items-center p-4">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-400"></div>
      <p className="ml-3 text-purple-300">{t('loadingSpinner.aiThinking')}</p>
    </div>
  );
};