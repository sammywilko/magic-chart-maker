
import React, { useState } from 'react';
import { Chore, RewardGoal } from '../types';
import { Button } from './Button';
import { Plus, Trash2, Coins, Target } from 'lucide-react';

interface Props {
  chores: Chore[];
  goal: RewardGoal;
  onChoresChange: (chores: Chore[]) => void;
  onGoalChange: (goal: RewardGoal) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepChores: React.FC<Props> = ({ 
  chores, goal, onChoresChange, onGoalChange, onNext, onBack 
}) => {
  const [newChoreTitle, setNewChoreTitle] = useState('');
  const [newChoreValue, setNewChoreValue] = useState('50p');

  const addChore = () => {
    if (!newChoreTitle.trim()) return;
    const newChore: Chore = {
      id: Math.random().toString(36).substr(2, 9),
      title: newChoreTitle,
      value: newChoreValue,
      status: 'pending'
    };
    onChoresChange([...chores, newChore]);
    setNewChoreTitle('');
  };

  const removeChore = (id: string) => {
    onChoresChange(chores.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-bold text-purple-900 display-font">Chores & Rewards</h2>
        <p className="text-xl text-gray-600 font-medium">Teach value with paid tasks and savings goals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* GOAL SECTION */}
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border-4 border-yellow-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-yellow-100 p-3 rounded-2xl text-yellow-600">
              <Target size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">The Big Goal</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Saving For</label>
              <input 
                value={goal.goalName}
                onChange={(e) => onGoalChange({...goal, goalName: e.target.value})}
                placeholder="e.g. New Lego Set"
                className="w-full p-4 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-yellow-400 outline-none font-bold"
              />
            </div>
            <div className="flex gap-4">
               <div className="flex-1">
                <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Target</label>
                <input 
                  value={goal.targetAmount}
                  onChange={(e) => onGoalChange({...goal, targetAmount: e.target.value})}
                  placeholder="20.00"
                  className="w-full p-4 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-yellow-400 outline-none font-bold"
                />
               </div>
               <div className="w-24">
                <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Symbol</label>
                <input 
                  value={goal.currencySymbol}
                  onChange={(e) => onGoalChange({...goal, currencySymbol: e.target.value})}
                  className="w-full p-4 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-yellow-400 outline-none font-bold text-center"
                />
               </div>
            </div>
          </div>
        </div>

        {/* CHORES SECTION */}
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border-4 border-green-50 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-3 rounded-2xl text-green-600">
              <Coins size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Paid Chores</h3>
          </div>

          <div className="flex gap-2 mb-4">
            <input 
              value={newChoreTitle}
              onChange={(e) => setNewChoreTitle(e.target.value)}
              placeholder="e.g. Wash Car"
              className="flex-1 p-3 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none font-bold"
            />
            <input 
              value={newChoreValue}
              onChange={(e) => setNewChoreValue(e.target.value)}
              className="w-20 p-3 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none font-bold text-center"
            />
            <button 
              onClick={addChore}
              className="bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition-colors shadow-md"
            >
              <Plus size={24} />
            </button>
          </div>

          <ul className="flex-1 space-y-2 overflow-y-auto max-h-64 custom-scrollbar pr-2">
            {chores.map(chore => (
              <li key={chore.id} className="flex justify-between items-center p-3 bg-green-50 rounded-xl border border-green-100">
                <div>
                  <span className="font-bold text-gray-700 block">{chore.title}</span>
                  <span className="text-xs font-bold text-green-600 bg-white px-2 py-0.5 rounded-full">{chore.value}</span>
                </div>
                <button onClick={() => removeChore(chore.id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
            {chores.length === 0 && (
              <li className="text-center text-gray-400 py-8 italic text-sm">No paid chores added yet</li>
            )}
          </ul>
        </div>
      </div>

      <div className="flex justify-between pt-8">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button onClick={onNext} className="text-xl px-12">Next: Choose Outputs</Button>
      </div>
    </div>
  );
};
