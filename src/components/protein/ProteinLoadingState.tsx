
import React from 'react';

const ProteinLoadingState: React.FC = () => {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="space-y-2 text-left">
        <h2 className="text-xl font-medium text-nature-text">Selecteer eiwitten in de aanbieding</h2>
        <p className="text-nature-text text-opacity-70">Eiwitten laden...</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 w-full">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg p-4 bg-white w-full h-48 animate-pulse">
            <div className="bg-gray-200 h-4 w-3/4 mb-2 rounded"></div>
            <div className="bg-gray-200 h-3 w-1/2 mb-4 rounded"></div>
            <div className="flex justify-between mt-auto">
              <div className="bg-gray-200 h-5 w-16 rounded"></div>
              <div className="bg-gray-200 h-5 w-12 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProteinLoadingState;
