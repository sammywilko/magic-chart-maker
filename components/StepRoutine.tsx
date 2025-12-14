import React, { useState } from 'react';
import { Plus, Trash2, Sun, Moon, Star } from 'lucide-react';
import { Task } from '../types';
import { Button } from './Button';

interface Props {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const MORNING_SUGGESTIONS = ['Brush Teeth', 'Get Dressed', 'Make Bed', 'Eat Breakfast', 'Pack Bag', 'Put Shoes On'];
const EVENING_SUGGESTIONS = ['Put Pajamas On', 'Brush Teeth', 'Bath Time', 'Read Book', 'Clean Up Toys', 'Go to Sleep'];

export const StepRoutine: React.FC<Props> = ({ tasks, onTasksChange, onNext, onBack }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskType, setNewTaskType] = useState<'morning' | 'evening'>('morning');

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      type: newTaskType,
      status: 'pending'
    };
    
    onTasksChange([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const removeTask = (id: string) => {
    onTasksChange(tasks.filter(t => t.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addTask();
  };

  const morningTasks = tasks.filter(t => t.type === 'morning');
  const eveningTasks = tasks.filter(t => t.type === 'evening');

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-bold text-purple-900 display-font">Build The Routine</h2>
        <p className="text-xl text-gray-600 font-medium">What does a successful day look like?</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Input Area */}
        <div className="w-full lg:w-5/12 bg-white p-8 rounded-[2rem] shadow-xl border-4 border-purple-50 sticky top-24">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 font-display">Add a Task</h3>
          
          <div className="flex gap-3 mb-6 bg-gray-50 p-2 rounded-2xl">
            <button 
              onClick={() => setNewTaskType('morning')}
              className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${newTaskType === 'morning' ? 'bg-white text-orange-500 shadow-md ring-2 ring-orange-200' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Sun size={20} className={newTaskType === 'morning' ? "fill-orange-500" : ""} /> Morning
            </button>
            <button 
              onClick={() => setNewTaskType('evening')}
              className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${newTaskType === 'evening' ? 'bg-white text-indigo-500 shadow-md ring-2 ring-indigo-200' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Moon size={20} className={newTaskType === 'evening' ? "fill-indigo-500" : ""} /> Evening
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`e.g. ${newTaskType === 'morning' ? 'Eat Breakfast' : 'Read a Story'}`}
                className="w-full p-4 pl-5 pr-14 bg-white text-gray-900 border-4 border-purple-100 rounded-2xl focus:border-purple-400 outline-none text-lg placeholder-gray-400 shadow-sm font-bold"
              />
              <button 
                onClick={addTask}
                disabled={!newTaskTitle.trim()}
                className="absolute right-2 top-2 bottom-2 bg-purple-500 text-white w-12 rounded-xl disabled:opacity-50 hover:bg-purple-600 transition-colors flex items-center justify-center shadow-md"
              >
                <Plus size={24} strokeWidth={3} />
              </button>
            </div>
            
            <div className="pt-2">
              <p className="font-bold text-gray-400 text-sm uppercase tracking-wider mb-3">
                {newTaskType === 'morning' ? 'Morning Ideas' : 'Evening Ideas'}
              </p>
              <div className="flex flex-wrap gap-2">
                {(newTaskType === 'morning' ? MORNING_SUGGESTIONS : EVENING_SUGGESTIONS).map(s => (
                  <button 
                    key={s} 
                    onClick={() => { setNewTaskTitle(s); }}
                    className="bg-purple-50 hover:bg-purple-100 border-2 border-purple-100 text-purple-700 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* List Area */}
        <div className="w-full lg:w-7/12 space-y-6">
          <div className="bg-orange-50 p-6 rounded-[2rem] border-4 border-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Sun size={120} />
            </div>
            <h4 className="text-orange-800 font-bold text-2xl mb-6 flex items-center gap-3 relative z-10">
              <div className="bg-orange-200 p-2 rounded-full text-orange-600"><Sun size={24} className="fill-orange-600"/></div>
              Morning Routine
            </h4>
            <ul className="space-y-3 relative z-10">
              {morningTasks.map(task => (
                <li key={task.id} className="bg-white p-4 rounded-2xl shadow-sm border-2 border-orange-100 flex justify-between items-center group hover:scale-[1.01] transition-transform">
                  <span className="font-bold text-gray-700 text-lg">{task.title}</span>
                  <button onClick={() => removeTask(task.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2">
                    <Trash2 size={20} />
                  </button>
                </li>
              ))}
              {morningTasks.length === 0 && (
                <li className="border-2 border-dashed border-orange-200 rounded-2xl p-6 text-center text-orange-300 font-bold">
                  No morning tasks yet
                </li>
              )}
            </ul>
          </div>

          <div className="bg-indigo-50 p-6 rounded-[2rem] border-4 border-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Moon size={120} />
            </div>
            <h4 className="text-indigo-800 font-bold text-2xl mb-6 flex items-center gap-3 relative z-10">
              <div className="bg-indigo-200 p-2 rounded-full text-indigo-600"><Moon size={24} className="fill-indigo-600"/></div>
              Evening Routine
            </h4>
            <ul className="space-y-3 relative z-10">
              {eveningTasks.map(task => (
                <li key={task.id} className="bg-white p-4 rounded-2xl shadow-sm border-2 border-indigo-100 flex justify-between items-center group hover:scale-[1.01] transition-transform">
                  <span className="font-bold text-gray-700 text-lg">{task.title}</span>
                  <button onClick={() => removeTask(task.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2">
                    <Trash2 size={20} />
                  </button>
                </li>
              ))}
              {eveningTasks.length === 0 && (
                 <li className="border-2 border-dashed border-indigo-200 rounded-2xl p-6 text-center text-indigo-300 font-bold">
                  No evening tasks yet
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-8 border-t-2 border-purple-100">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button 
          onClick={onNext} 
          disabled={tasks.length === 0}
          className="text-xl px-12"
        >
          Generate Magic Chart ✨
        </Button>
      </div>
    </div>
  );
};