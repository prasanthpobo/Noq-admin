import React from 'react';
import { Header } from '../components/layout/Header';

interface PlaceholderProps {
  title: string;
  crumbs?: string;
  description?: string;
  addLabel?: string;
}

export const Placeholder = ({ title, crumbs, description, addLabel }: PlaceholderProps) => (
  <div>
    <Header title={title} crumbs={crumbs} addLabel={addLabel} />
    <div className="p-6 flex items-center justify-center min-h-64">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl brand-gradient mx-auto mb-4 flex items-center justify-center shadow-lg">
          <span className="text-white text-2xl">🏗️</span>
        </div>
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">{title}</h3>
        <p className="text-sm text-[#6B7C93]">{description || 'This module is coming soon. The API is ready — connect it to complete the UI.'}</p>
      </div>
    </div>
  </div>
);
