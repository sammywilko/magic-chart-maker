
import React from 'react';
import { OutputType } from '../types';
import { Button } from './Button';
import { Calendar, CreditCard, Sticker, Award, Layers } from 'lucide-react';

interface Props {
  selected: Set<OutputType>;
  onChange: (selected: Set<OutputType>) => void;
  onNext: () => void;
  onBack: () => void;
  hasGeneratedAssets?: boolean;
  onViewChart?: () => void;
}

export const StepOutputSelection: React.FC<Props> = ({ selected, onChange, onNext, onBack, hasGeneratedAssets, onViewChart }) => {
  const toggle = (id: OutputType) => {
    const newSet = new Set(selected);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    onChange(newSet);
  };

  const options: {id: OutputType, label: string, desc: string, icon: React.ReactNode}[] = [
    {
      id: 'weekly_chart',
      label: 'Weekly Routine Chart',
      desc: 'A4 Landscape grid for morning & evening habits.',
      icon: <Calendar size={32} className="text-blue-500" />
    },
    {
      id: 'chore_tracker',
      label: 'Chore & Savings Tracker',
      desc: 'Track paid jobs and progress toward a goal.',
      icon: <CreditCard size={32} className="text-green-500" />
    },
    {
      id: 'sticker_sheet',
      label: 'Reward Sticker Sheet',
      desc: 'A4 sheet of themed stickers to print.',
      icon: <Sticker size={32} className="text-pink-500" />
    },
    {
      id: 'certificate',
      label: 'Achievement Certificate',
      desc: 'Award for a great week.',
      icon: <Award size={32} className="text-yellow-500" />
    },
    {
      id: 'flip_cards',
      label: 'Daily Flip Cards',
      desc: 'Physical cards to flip when tasks are done.',
      icon: <Layers size={32} className="text-purple-500" />
    }
  ];

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-bold text-purple-900 display-font">Choose Your Kit</h2>
        <p className="text-xl text-gray-600 font-medium">Select the magical items you want to generate.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {options.map(opt => (
          <div 
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className={`cursor-pointer p-6 rounded-3xl border-4 transition-all duration-200 relative overflow-hidden group ${
              selected.has(opt.id) 
              ? 'bg-white border-purple-500 shadow-xl scale-[1.02]' 
              : 'bg-gray-50 border-transparent hover:bg-white hover:border-gray-200'
            }`}
          >
            {selected.has(opt.id) && (
              <div className="absolute top-4 right-4 bg-purple-500 text-white p-1 rounded-full shadow-md">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
            )}
            <div className={`mb-4 p-4 rounded-2xl w-fit ${selected.has(opt.id) ? 'bg-purple-100' : 'bg-white'}`}>
              {opt.icon}
            </div>
            <h3 className={`text-xl font-bold mb-2 ${selected.has(opt.id) ? 'text-purple-900' : 'text-gray-700'}`}>{opt.label}</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">{opt.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-8">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <div className="flex gap-3">
          {hasGeneratedAssets && onViewChart && (
            <Button
              onClick={onViewChart}
              variant="secondary"
              className="text-xl px-8"
            >
              View Chart
            </Button>
          )}
          <Button
            onClick={onNext}
            disabled={selected.size === 0}
            className="text-xl px-12"
          >
            {hasGeneratedAssets ? 'Regenerate ✨' : 'Generate Kit ✨'}
          </Button>
        </div>
      </div>
    </div>
  );
};
