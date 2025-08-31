import React, { ReactNode } from 'react';
import '../config/i18n';

interface I18nProviderProps {
  children: ReactNode;
}

const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export default I18nProvider;
