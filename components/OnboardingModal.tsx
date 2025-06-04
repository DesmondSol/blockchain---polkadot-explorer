import React, { useState } from 'react';

interface OnboardingModalProps {
  onSubmit: (expertise: string) => void;
  onSkip: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onSubmit, onSkip }) => {
  const [expertise, setExpertise] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(expertise);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-lg modal-content transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modalFadeInScale">
        <h2 className="text-2xl font-bold text-purple-300 mb-4">Let's Personalize Your Learning!</h2>
        <p className="text-gray-300 mb-1">
          Tell us a bit about your background, current role, or area of expertise (e.g., "Software Developer", "Student in Finance", "Marketing Manager", "Curious about Web3").
        </p>
        <p className="text-gray-400 text-sm mb-6">
          This will help us tailor examples and explanations to what you already know, making complex topics easier to grasp.
        </p>
        <form onSubmit={handleSubmit}>
          <textarea
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
            placeholder="E.g., 'Frontend developer with 3 years experience', 'Marketing professional new to tech', 'Economics student'"
            className="w-full p-3 mb-6 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none h-28 custom-scrollbar"
            aria-label="Describe your experience or expertise"
          />
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={onSkip}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors w-full sm:w-auto"
              aria-label="Skip providing expertise for now"
            >
              Skip for Now
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition-colors w-full sm:w-auto"
              aria-label="Submit expertise and start learning"
            >
              Submit & Start Learning
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};