'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  return (
    <button 
      onClick={() => window.history.back()}
      className="w-full flex items-center justify-center gap-3 px-6 py-3 text-gray-500 hover:text-gray-700 transition font-medium"
    >
      <ArrowLeft size={18} />
      Go Back
    </button>
  );
}
