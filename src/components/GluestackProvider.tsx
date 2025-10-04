import React from 'react';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { gluestackConfig } from '@/theme/gluestack';

interface GluestackProviderProps {
  children: React.ReactNode;
}

export const GluestackProvider: React.FC<GluestackProviderProps> = ({ children }) => {
  return (
    <GluestackUIProvider config={gluestackConfig}>
      {children}
    </GluestackUIProvider>
  );
};

