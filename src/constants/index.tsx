import React from 'react';
import { ShieldCheck, Stethoscope, Pill } from 'lucide-react';
import { Service, Pharmacy } from '../types';

export const SERVICES: Service[] = [
  { id: 'malaria', title: 'Malaria Testing', icon: <ShieldCheck className="w-6 h-6" />, price: 'UGX 15,000', color: 'bg-red-100 text-red-600' },
  { id: 'consult', title: 'Doctor Consult', icon: <Stethoscope className="w-6 h-6" />, price: 'UGX 30,000', color: 'bg-blue-100 text-blue-600' },
  { id: 'arv', title: 'ARV Access', icon: <ShieldCheck className="w-6 h-6" />, price: 'UGX 0', color: 'bg-green-100 text-green-600' },
  { id: 'vaccine', title: 'Vaccination', icon: <Pill className="w-6 h-6" />, price: 'UGX 25,000', color: 'bg-purple-100 text-purple-600' },
];

export const PHARMACIES: Pharmacy[] = [
  { id: 'ddembe', name: 'Ddembe Delivers', location: 'Kisementi, Kampala', rating: 4.8, deliveryTime: '20-30 mins' },
  { id: 'first-pharm', name: 'First Pharmacy', location: 'Wandegeya', rating: 4.5, deliveryTime: '30-45 mins' },
];

export const MEDICAL_PROVIDERS = [
  { id: 'mulago', name: 'Mulago National Referral Hospital', location: 'Mulago Hill, Kampala', distance: '1.2km' },
  { id: 'case', name: 'Case Hospital', location: 'Buganda Road, Kampala', distance: '2.5km' },
  { id: 'iueh', name: 'International University of East Africa Hospital', location: 'Kansanga, Kampala', distance: '4.8km' },
  { id: 'nsambya', name: 'St. Francis Hospital Nsambya', location: 'Nsambya, Kampala', distance: '3.1km' },
];

export const AI_MODEL = "gemini-3-flash-preview";
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCCFxXUW1lduA2ieSvKbiL9hNETUg-303M';
export const SYSTEM_INSTRUCTION = `You are the Health on Wheels Online Assistant, a medical and platform AI for "Health on Wheels" in Uganda. 

ABOUT HEALTH ON WHEELS:
Health on Wheels is a Ugandan digital healthcare platform that connects patients to licensed doctors and delivers genuine medicines directly to their doorstep.
It addresses critical healthcare challenges in Uganda:
- Long queues at hospitals and health centers
- Limited access to quality healthcare in rural and peri-urban areas
- Counterfeit and substandard medicines in informal markets
- Lack of convenient, reliable medicine home delivery services

BRAND VOICE: Trustworthy, Caring, Reliable, Modern.

YOUR GOALS:
1. Provide medical consultations and answer health-related questions.
2. Answer questions about the Health on Wheels platform, its services, and its mission.

STRICT RULES:
1. Respond to medical queries AND questions about the Health on Wheels platform. If a user asks about unrelated topics, politely decline and redirect them to health or platform services.
2. Provide clear, empathetic, and professional advice.
3. ALWAYS include a disclaimer for medical advice: "I am an AI assistant. For serious conditions, please consult a licensed doctor immediately via our 'Book Doctor' service."
4. Use Ugandan context where relevant (e.g., mentioning common local health issues like malaria).
5. Keep responses concise and easy to understand.`;
