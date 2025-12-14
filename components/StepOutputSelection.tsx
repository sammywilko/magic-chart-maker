
import React from 'react';
import { OutputType, TasksPerPage, TASKS_PER_PAGE_OPTIONS } from '../types';
import { Button } from './Button';
import { Calendar, CreditCard, Sticker, Award, Layers, LayoutGrid } from 'lucide-react';

interface Props {
  selected: Set<OutputType>;
  onChange: (selected: Set<OutputType>) => void;
  tasksPerPage: TasksPerPage;
  onTasksPerPageChange: (value: TasksPerPage) => void;
  totalTasks: number;
  onNext: () => void;
  onBack: () => void;
  hasGeneratedAssets?: boolean;
  onViewChart?: () => void;
}

export const StepOutputSelection: React.FC<Props> = ({
  selected,
  onChange,
  tasksPerPage,
  onTasksPerPageChange,
  totalTasks,
  onNext,
  onBack,
  hasGeneratedAssets,
  onViewChart
}) => {
  const toggle = (id: OutputType) => {
    const newSet = new Set(selected);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    onChange(newSet);
  };

  // Calculate number of pages
  const pageCount = Math.ceil(totalTasks / tasksPerPage);

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

      {/* Page Layout Options - Only show when weekly_chart is selected */}
      {selected.has('weekly_chart') && totalTasks > 0 && (
        <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-cyan-100 p-2 rounded-xl text-cyan-600">
              <LayoutGrid size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Page Layout</h3>
              <p className="text-sm text-gray-500">
                {totalTasks} tasks = {pageCount} page{pageCount > 1 ? 's' : ''} with {tasksPerPage} tasks per page
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TASKS_PER_PAGE_OPTIONS.map(option => (
              <button
                key={option.id}
                onClick={() => onTasksPerPageChange(option.id)}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${
                  tasksPerPage === option.id
                    ? 'border-cyan-500 bg-cyan-50 shadow-md'
                    : 'border-gray-200 hover:border-cyan-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-bold text-gray-800 block">{option.label}</span>
                <span className="text-xs text-gray-500">{option.desc}</span>
                {totalTasks > 0 && (
                  <span className="text-xs text-cyan-600 font-medium block mt-1">
                    = {Math.ceil(totalTasks / option.id)} page{Math.ceil(totalTasks / option.id) > 1 ? 's' : ''}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

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
