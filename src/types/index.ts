import React from 'react';

export type Screen = 'onboarding' | 'landing' | 'login' | 'signup' | 'home' | 'services' | 'pharmacy' | 'schedule' | 'profile' | 'delivery' | 'payment' | 'assistant' | 'notifications';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface Service {
  id: string;
  title: string;
  icon: React.ReactNode;
  price: string;
  color: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  location: string;
  rating: number;
  deliveryTime: string;
}
