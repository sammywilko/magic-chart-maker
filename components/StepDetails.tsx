import React from 'react';
import { ChildProfile } from '../types';
import { Button } from './Button';

interface Props {
  profile: ChildProfile;
  onChange: (profile: ChildProfile) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepDetails: React.FC<Props> = ({ profile, onChange, onNext, onBack }) => {
  return (
    <div className="space-y-10 max-w-2xl mx-auto">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-bold text-purple-900 display-font">Who is this for?</h2>
        <p className="text-xl text-gray-600 font-medium">Personalize the experience for your little one.</p>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border-4 border-white/50 space-y-8 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-orange-100 rounded-full opacity-50 blur-3xl"></div>

        <div className="relative z-10">
          <label className="block text-sm font-black text-gray-500 mb-3 uppercase tracking-wider ml-2">Child's Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => onChange({ ...profile, name: e.target.value })}
            className="w-full p-5 text-2xl font-bold text-gray-800 border-4 border-gray-100 rounded-2xl focus:border-purple-400 focus:bg-purple-50/30 transition-all outline-none placeholder-gray-300"
            placeholder="e.g. Leo"
          />
        </div>

        <div className="relative z-10">
          <label className="block text-sm font-black text-gray-500 mb-3 uppercase tracking-wider ml-2">Age</label>
          <input
            type="text"
            value={profile.age}
            onChange={(e) => onChange({ ...profile, age: e.target.value })}
            className="w-full p-5 text-2xl font-bold text-gray-800 border-4 border-gray-100 rounded-2xl focus:border-purple-400 focus:bg-purple-50/30 transition-all outline-none placeholder-gray-300"
            placeholder="e.g. 5"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4 px-2">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button 
          onClick={onNext} 
          disabled={!profile.name || !profile.age}
          className="px-10 text-lg"
        >
          Next: Build Routine
        </Button>
      </div>
    </div>
  );
};