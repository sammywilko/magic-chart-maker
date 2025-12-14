
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, Task, Chore, OutputType } from '../types';
import {
  Printer, ArrowLeft, Smartphone, FileText, Check,
  Edit3, GripVertical, Plus, Trash2, RotateCcw, X, Save
} from 'lucide-react';
import { Button } from './Button';

interface Props {
  state: AppState;
  onReset: () => void;
}

interface WeekProgress {
  weekStart: string;
  taskChecks: Record<string, boolean[]>;
  choreChecks: Record<string, boolean[]>;
}

// Get Monday of current week
const getWeekStart = (): string => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
};

export const StepPreview: React.FC<Props> = ({ state, onReset }) => {
  const [activeTab, setActiveTab] = useState<string>(Array.from(state.selectedOutputs)[0] || 'weekly_chart');
  const [mode, setMode] = useState<'digital' | 'print'>('digital');
  const [editMode, setEditMode] = useState(false);

  // Editable state
  const [tasks, setTasks] = useState<Task[]>(state.tasks);
  const [chores, setChores] = useState<Chore[]>(state.chores);
  const [childName, setChildName] = useState(state.profile.name);
  const [rewardGoal, setRewardGoal] = useState(state.rewardGoal);

  // Checkbox state with localStorage persistence
  const [taskChecks, setTaskChecks] = useState<Record<string, boolean[]>>({});
  const [choreChecks, setChoreChecks] = useState<Record<string, boolean[]>>({});
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart());

  // Drag state
  const [draggedItem, setDraggedItem] = useState<{ id: string; type: 'task' | 'chore' } | null>(null);

  const storageKey = `magic-chart-${childName.toLowerCase().replace(/\s+/g, '-')}`;

  // Load saved checkbox state
  useEffect(() => {
    const saved = localStorage.getItem(`${storageKey}-week`);
    if (saved) {
      const data: WeekProgress = JSON.parse(saved);
      const currentWeek = getWeekStart();

      if (data.weekStart !== currentWeek) {
        // New week - reset
        setTaskChecks({});
        setChoreChecks({});
        setCurrentWeekStart(currentWeek);
      } else {
        setTaskChecks(data.taskChecks || {});
        setChoreChecks(data.choreChecks || {});
        setCurrentWeekStart(data.weekStart);
      }
    }
  }, [storageKey]);

  // Save checkbox state
  useEffect(() => {
    const data: WeekProgress = {
      weekStart: currentWeekStart,
      taskChecks,
      choreChecks,
    };
    localStorage.setItem(`${storageKey}-week`, JSON.stringify(data));
  }, [taskChecks, choreChecks, currentWeekStart, storageKey]);

  const toggleTaskCheck = (taskId: string, dayIndex: number) => {
    setTaskChecks(prev => {
      const current = prev[taskId] || Array(7).fill(false);
      const updated = [...current];
      updated[dayIndex] = !updated[dayIndex];
      return { ...prev, [taskId]: updated };
    });
  };

  const toggleChoreCheck = (choreId: string, dayIndex: number) => {
    setChoreChecks(prev => {
      const current = prev[choreId] || Array(7).fill(false);
      const updated = [...current];
      updated[dayIndex] = !updated[dayIndex];
      return { ...prev, [choreId]: updated };
    });
  };

  const resetWeek = useCallback(() => {
    if (window.confirm('Reset all checkboxes for this week?')) {
      setTaskChecks({});
      setChoreChecks({});
      setCurrentWeekStart(getWeekStart());
    }
  }, []);

  // Edit functions
  const updateTask = (id: string, title: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, title } : t));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addTask = (type: 'morning' | 'evening') => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: 'New Task',
      type,
      status: 'completed',
    };
    setTasks([...tasks, newTask]);
  };

  const updateChore = (id: string, field: 'title' | 'value', value: string) => {
    setChores(chores.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeChore = (id: string) => {
    setChores(chores.filter(c => c.id !== id));
  };

  const addChore = () => {
    const newChore: Chore = {
      id: `chore-${Date.now()}`,
      title: 'New Chore',
      value: '50p',
      status: 'completed',
    };
    setChores([...chores, newChore]);
  };

  // Drag handlers
  const handleDragStart = (id: string, type: 'task' | 'chore') => {
    setDraggedItem({ id, type });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropTask = (targetId: string, taskType: 'morning' | 'evening') => {
    if (!draggedItem || draggedItem.type !== 'task') return;

    const draggedTask = tasks.find(t => t.id === draggedItem.id);
    if (!draggedTask || draggedTask.type !== taskType) {
      setDraggedItem(null);
      return;
    }

    const filteredTasks = tasks.filter(t => t.type === taskType);
    const otherTasks = tasks.filter(t => t.type !== taskType);
    const draggedIndex = filteredTasks.findIndex(t => t.id === draggedItem.id);
    const targetIndex = filteredTasks.findIndex(t => t.id === targetId);

    if (draggedIndex !== targetIndex) {
      const reordered = [...filteredTasks];
      const [removed] = reordered.splice(draggedIndex, 1);
      reordered.splice(targetIndex, 0, removed);
      setTasks([...otherTasks, ...reordered]);
    }
    setDraggedItem(null);
  };

  const handleDropChore = (targetId: string) => {
    if (!draggedItem || draggedItem.type !== 'chore') return;

    const draggedIndex = chores.findIndex(c => c.id === draggedItem.id);
    const targetIndex = chores.findIndex(c => c.id === targetId);

    if (draggedIndex !== targetIndex) {
      const reordered = [...chores];
      const [removed] = reordered.splice(draggedIndex, 1);
      reordered.splice(targetIndex, 0, removed);
      setChores(reordered);
    }
    setDraggedItem(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // ==================== TEMPLATES ====================

  // Mobile-First Digital Weekly Chart
  const DigitalWeeklyChart = () => (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="relative h-32 sm:h-40 bg-gradient-to-r from-cyan-400 to-blue-500 overflow-hidden">
        {state.generatedAssets.headerBannerUrl ? (
          <img src={state.generatedAssets.headerBannerUrl} className="w-full h-full object-cover" alt="Header" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <h1 className="text-2xl sm:text-4xl font-black text-white drop-shadow-lg text-center px-4">
              {childName}'s Adventure Chart
            </h1>
          </div>
        )}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Controls Bar */}
      <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={resetWeek}
            className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            title="Reset week"
          >
            <RotateCcw size={18} />
          </button>
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2"
        >
          {editMode ? (
            <><Save size={18} /> Done</>
          ) : (
            <><Edit3 size={18} /> Edit</>
          )}
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Morning Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-orange-500 flex items-center gap-2">
              <span className="text-2xl">☀️</span> Morning
            </h2>
            {editMode && (
              <button
                onClick={() => addTask('morning')}
                className="text-sm px-3 py-1 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 flex items-center gap-1"
              >
                <Plus size={16} /> Add
              </button>
            )}
          </div>

          <div className="space-y-3">
            {tasks.filter(t => t.type === 'morning').map((task) => (
              <div
                key={task.id}
                className={`bg-orange-50 rounded-xl p-3 border-2 border-orange-200 ${editMode ? 'cursor-move' : ''}`}
                draggable={editMode}
                onDragStart={() => handleDragStart(task.id, 'task')}
                onDragOver={handleDragOver}
                onDrop={() => handleDropTask(task.id, 'morning')}
              >
                <div className="flex items-center gap-3 mb-3">
                  {editMode && (
                    <div className="flex gap-1 flex-shrink-0">
                      <GripVertical size={20} className="text-gray-400" />
                      <button onClick={() => removeTask(task.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}

                  {task.tileImageUrl && (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 border-orange-300 flex-shrink-0">
                      <img src={task.tileImageUrl} className="w-full h-full object-cover" alt={task.title} />
                    </div>
                  )}

                  {editMode ? (
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => updateTask(task.id, e.target.value)}
                      className="flex-1 text-base sm:text-lg font-bold text-gray-800 bg-white px-3 py-2 rounded-lg border-2 border-orange-300 focus:outline-none focus:border-orange-500"
                    />
                  ) : (
                    <h3 className="flex-1 text-base sm:text-lg font-bold text-gray-800">{task.title}</h3>
                  )}
                </div>

                {/* Checkbox Grid */}
                <div className="flex gap-1 sm:gap-2 justify-end">
                  {dayLabels.map((day, index) => {
                    const isChecked = taskChecks[task.id]?.[index] || false;
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <span className="text-xs text-gray-500 mb-1 font-medium">{day}</span>
                        <button
                          onClick={() => !editMode && toggleTaskCheck(task.id, index)}
                          disabled={editMode}
                          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl border-[3px] transition-all duration-200 flex items-center justify-center ${
                            isChecked
                              ? 'bg-orange-500 border-orange-600 shadow-lg scale-105'
                              : 'bg-white border-orange-300 hover:border-orange-400 hover:shadow-md'
                          } ${editMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
                        >
                          {isChecked && <Check size={20} className="text-white" strokeWidth={3} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Evening Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-500 flex items-center gap-2">
              <span className="text-2xl">🌙</span> Evening
            </h2>
            {editMode && (
              <button
                onClick={() => addTask('evening')}
                className="text-sm px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 flex items-center gap-1"
              >
                <Plus size={16} /> Add
              </button>
            )}
          </div>

          <div className="space-y-3">
            {tasks.filter(t => t.type === 'evening').map((task) => (
              <div
                key={task.id}
                className={`bg-indigo-50 rounded-xl p-3 border-2 border-indigo-200 ${editMode ? 'cursor-move' : ''}`}
                draggable={editMode}
                onDragStart={() => handleDragStart(task.id, 'task')}
                onDragOver={handleDragOver}
                onDrop={() => handleDropTask(task.id, 'evening')}
              >
                <div className="flex items-center gap-3 mb-3">
                  {editMode && (
                    <div className="flex gap-1 flex-shrink-0">
                      <GripVertical size={20} className="text-gray-400" />
                      <button onClick={() => removeTask(task.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}

                  {task.tileImageUrl && (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 border-indigo-300 flex-shrink-0">
                      <img src={task.tileImageUrl} className="w-full h-full object-cover" alt={task.title} />
                    </div>
                  )}

                  {editMode ? (
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => updateTask(task.id, e.target.value)}
                      className="flex-1 text-base sm:text-lg font-bold text-gray-800 bg-white px-3 py-2 rounded-lg border-2 border-indigo-300 focus:outline-none focus:border-indigo-500"
                    />
                  ) : (
                    <h3 className="flex-1 text-base sm:text-lg font-bold text-gray-800">{task.title}</h3>
                  )}
                </div>

                {/* Checkbox Grid */}
                <div className="flex gap-1 sm:gap-2 justify-end">
                  {dayLabels.map((day, index) => {
                    const isChecked = taskChecks[task.id]?.[index] || false;
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <span className="text-xs text-gray-500 mb-1 font-medium">{day}</span>
                        <button
                          onClick={() => !editMode && toggleTaskCheck(task.id, index)}
                          disabled={editMode}
                          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl border-[3px] transition-all duration-200 flex items-center justify-center ${
                            isChecked
                              ? 'bg-indigo-500 border-indigo-600 shadow-lg scale-105'
                              : 'bg-white border-indigo-300 hover:border-indigo-400 hover:shadow-md'
                          } ${editMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
                        >
                          {isChecked && <Check size={20} className="text-white" strokeWidth={3} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reward Goal */}
        <section className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-4 sm:p-6 border-2 border-yellow-200">
          <h2 className="text-lg font-bold text-yellow-600 text-center mb-3 uppercase tracking-wide">
            🎯 Saving For
          </h2>

          {editMode ? (
            <div className="space-y-3">
              <input
                type="text"
                value={rewardGoal.goalName}
                onChange={(e) => setRewardGoal({ ...rewardGoal, goalName: e.target.value })}
                className="w-full text-xl font-black text-gray-800 bg-white px-4 py-3 rounded-lg border-2 border-yellow-300 focus:outline-none focus:border-yellow-500 text-center"
                placeholder="Reward name"
              />
              <div className="flex gap-2 justify-center">
                <input
                  type="text"
                  value={rewardGoal.currencySymbol}
                  onChange={(e) => setRewardGoal({ ...rewardGoal, currencySymbol: e.target.value })}
                  className="w-16 text-xl font-black text-yellow-700 bg-white px-3 py-2 rounded-lg border-2 border-yellow-300 focus:outline-none focus:border-yellow-500 text-center"
                  placeholder="£"
                />
                <input
                  type="text"
                  value={rewardGoal.targetAmount}
                  onChange={(e) => setRewardGoal({ ...rewardGoal, targetAmount: e.target.value })}
                  className="flex-1 text-xl font-black text-yellow-700 bg-white px-4 py-2 rounded-lg border-2 border-yellow-300 focus:outline-none focus:border-yellow-500 text-center"
                  placeholder="25.00"
                />
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-800 text-center mb-3">
                {rewardGoal.goalName}
              </h3>
              <div className="text-center">
                <span className="inline-block px-6 py-3 bg-yellow-400 text-white rounded-2xl shadow-lg text-3xl font-black">
                  {rewardGoal.currencySymbol}{rewardGoal.targetAmount}
                </span>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );

  // Digital Chore Tracker
  const DigitalChoreTracker = () => (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="relative h-28 sm:h-36 bg-gradient-to-r from-green-400 to-emerald-500 overflow-hidden">
        {state.generatedAssets.headerBannerUrl ? (
          <img src={state.generatedAssets.headerBannerUrl} className="w-full h-full object-cover opacity-80" alt="Header" />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow-lg text-center px-4">
            💰 {childName}'s Treasure Chest
          </h1>
        </div>
      </div>

      {/* Controls */}
      <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 flex justify-between items-center print:hidden">
        <button
          onClick={resetWeek}
          className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
          title="Reset week"
        >
          <RotateCcw size={18} />
        </button>
        <button
          onClick={() => setEditMode(!editMode)}
          className="px-4 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center gap-2"
        >
          {editMode ? <><Save size={18} /> Done</> : <><Edit3 size={18} /> Edit</>}
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Chores List */}
        <section className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-green-700 flex items-center gap-2">
              <span className="text-2xl">✨</span> Ways to Earn
            </h2>
            {editMode && (
              <button
                onClick={addChore}
                className="text-sm px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
              >
                <Plus size={16} /> Add
              </button>
            )}
          </div>

          <div className="space-y-3">
            {chores.map((chore) => (
              <div
                key={chore.id}
                className={`bg-white rounded-xl p-3 border-2 border-green-200 ${editMode ? 'cursor-move' : ''}`}
                draggable={editMode}
                onDragStart={() => handleDragStart(chore.id, 'chore')}
                onDragOver={handleDragOver}
                onDrop={() => handleDropChore(chore.id)}
              >
                <div className="flex items-center gap-3 mb-3">
                  {editMode && (
                    <div className="flex gap-1 flex-shrink-0">
                      <GripVertical size={20} className="text-gray-400" />
                      <button onClick={() => removeChore(chore.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}

                  {editMode ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={chore.title}
                        onChange={(e) => updateChore(chore.id, 'title', e.target.value)}
                        className="flex-1 text-base font-bold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg border-2 border-green-300"
                        placeholder="Chore name"
                      />
                      <input
                        type="text"
                        value={chore.value}
                        onChange={(e) => updateChore(chore.id, 'value', e.target.value)}
                        className="w-20 text-base font-bold text-green-700 bg-green-100 px-3 py-2 rounded-lg border-2 border-green-300 text-center"
                        placeholder="50p"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="flex-1 text-base sm:text-lg font-bold text-gray-800">{chore.title}</h3>
                      <span className="px-4 py-2 bg-green-100 text-green-700 font-black rounded-lg text-lg flex-shrink-0">
                        {chore.value}
                      </span>
                    </>
                  )}
                </div>

                {/* Checkbox Grid */}
                <div className="flex gap-1 sm:gap-2 justify-end">
                  {dayLabels.map((day, index) => {
                    const isChecked = choreChecks[chore.id]?.[index] || false;
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <span className="text-xs text-gray-500 mb-1 font-medium">{day}</span>
                        <button
                          onClick={() => !editMode && toggleChoreCheck(chore.id, index)}
                          disabled={editMode}
                          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl border-[3px] transition-all duration-200 flex items-center justify-center ${
                            isChecked
                              ? 'bg-green-500 border-green-600 shadow-lg scale-105'
                              : 'bg-white border-green-300 hover:border-green-400 hover:shadow-md'
                          } ${editMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
                        >
                          {isChecked && <Check size={20} className="text-white" strokeWidth={3} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Savings Goal */}
        <section className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-4 sm:p-6 border-2 border-yellow-200 text-center">
          <h2 className="text-lg font-bold text-yellow-600 mb-2 uppercase tracking-wide">Saving For</h2>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mb-4">{rewardGoal.goalName}</h3>

          {state.generatedAssets.progressIllustrationUrl && (
            <div className="w-full h-32 sm:h-40 bg-white rounded-2xl border-4 border-yellow-200 overflow-hidden mb-4">
              <img src={state.generatedAssets.progressIllustrationUrl} className="w-full h-full object-cover" alt="Progress" />
            </div>
          )}

          <span className="inline-block px-8 py-4 bg-yellow-400 text-white rounded-2xl shadow-lg text-3xl sm:text-4xl font-black">
            {rewardGoal.currencySymbol}{rewardGoal.targetAmount}
          </span>
        </section>
      </div>
    </div>
  );

  // Print Templates (keep original mm-based layouts for printing)
  const PrintWeeklyChart = () => (
    <div className="bg-white w-[297mm] h-[210mm] mx-auto shadow-2xl overflow-hidden relative flex flex-col print:shadow-none">
      {/* Header */}
      <div className="h-[45mm] w-full relative bg-purple-100 overflow-hidden flex-shrink-0">
        {state.generatedAssets.headerBannerUrl ? (
          <img src={state.generatedAssets.headerBannerUrl} className="w-full h-full object-cover" alt="Header" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-purple-300 font-bold text-4xl">
            {childName}'s Adventure Chart
          </div>
        )}
      </div>

      <div className="flex-1 p-8 flex gap-8 min-h-0">
        {/* Morning Column */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <h3 className="text-2xl font-black text-orange-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="text-3xl">☀️</span> Morning Missions
          </h3>
          <div className="flex flex-col gap-2 flex-1">
            {tasks.filter(t => t.type === 'morning').map((task, i) => (
              <div key={i} className="flex items-center gap-3 border-b-2 border-orange-100 pb-2 min-h-[22mm]">
                <div className="w-[20mm] h-[20mm] rounded-xl overflow-hidden border-2 border-orange-200 bg-orange-50 flex-shrink-0">
                  {task.tileImageUrl && <img src={task.tileImageUrl} className="w-full h-full object-cover" />}
                </div>
                <span className="flex-1 font-bold text-xl text-gray-700">{task.title}</span>
                <div className="flex gap-2 flex-shrink-0">
                  {dayLabels.map((day, d) => (
                    <div key={d} className="flex flex-col items-center">
                      <span className="text-xs text-gray-400 mb-1">{day}</span>
                      <div className="w-[10mm] h-[10mm] rounded-lg border-2 border-orange-300 bg-white" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evening Column */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <h3 className="text-2xl font-black text-indigo-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="text-3xl">🌙</span> Evening Quests
          </h3>
          <div className="flex flex-col gap-2 flex-1">
            {tasks.filter(t => t.type === 'evening').map((task, i) => (
              <div key={i} className="flex items-center gap-3 border-b-2 border-indigo-100 pb-2 min-h-[22mm]">
                <div className="w-[20mm] h-[20mm] rounded-xl overflow-hidden border-2 border-indigo-200 bg-indigo-50 flex-shrink-0">
                  {task.tileImageUrl && <img src={task.tileImageUrl} className="w-full h-full object-cover" />}
                </div>
                <span className="flex-1 font-bold text-xl text-gray-700">{task.title}</span>
                <div className="flex gap-2 flex-shrink-0">
                  {dayLabels.map((day, d) => (
                    <div key={d} className="flex flex-col items-center">
                      <span className="text-xs text-gray-400 mb-1">{day}</span>
                      <div className="w-[10mm] h-[10mm] rounded-lg border-2 border-indigo-300 bg-white" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="h-[25mm] bg-gradient-to-r from-yellow-50 to-amber-50 border-t-4 border-yellow-200 flex items-center px-8 justify-between">
        <span className="text-xl font-bold text-yellow-600">🎯 Goal: {rewardGoal.goalName}</span>
        <span className="text-2xl font-black text-yellow-500">{rewardGoal.currencySymbol}{rewardGoal.targetAmount}</span>
      </div>
    </div>
  );

  const StickerSheetTemplate = () => (
    <div className="bg-white w-[210mm] h-[297mm] mx-auto shadow-2xl p-[10mm] relative print:shadow-none">
      <h2 className="text-center font-display text-3xl text-gray-400 mb-8">STICKER SHEET</h2>
      {state.generatedAssets.stickerSheetUrl ? (
        <img src={state.generatedAssets.stickerSheetUrl} className="w-full h-auto object-contain" alt="Stickers" />
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {Array.from({length: 24}).map((_, i) => (
            <div key={i} className="aspect-square rounded-full border-2 border-dashed border-gray-300" />
          ))}
        </div>
      )}
    </div>
  );

  const CertificateTemplate = () => (
    <div className="bg-white w-[297mm] h-[210mm] mx-auto shadow-2xl relative p-[15mm] flex flex-col items-center justify-between border-[10px] border-double border-yellow-200 print:shadow-none">
      <div className="absolute top-4 left-4 w-24 h-24 border-t-4 border-l-4 border-yellow-400 rounded-tl-3xl" />
      <div className="absolute top-4 right-4 w-24 h-24 border-t-4 border-r-4 border-yellow-400 rounded-tr-3xl" />
      <div className="absolute bottom-4 left-4 w-24 h-24 border-b-4 border-l-4 border-yellow-400 rounded-bl-3xl" />
      <div className="absolute bottom-4 right-4 w-24 h-24 border-b-4 border-r-4 border-yellow-400 rounded-br-3xl" />

      <div className="text-center space-y-4 pt-8">
        <h1 className="text-6xl text-yellow-500 font-black">⭐ Star of the Week ⭐</h1>
        <p className="text-3xl text-gray-400">is proudly awarded to</p>
      </div>

      <div className="text-[80px] text-purple-600 font-black border-b-4 border-gray-100 px-20 pb-4">
        {childName}
      </div>

      <div className="flex items-center gap-12 w-full px-20">
        <div className="w-[40mm] h-[40mm] relative">
          {state.generatedAssets.certificateBadgeUrl ? (
            <img src={state.generatedAssets.certificateBadgeUrl} className="w-full h-full object-contain drop-shadow-xl" alt="Badge" />
          ) : (
            <div className="w-full h-full bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold text-2xl">🏆</div>
          )}
        </div>
        <p className="flex-1 text-2xl text-gray-500 italic text-center">For completing an amazing week of adventures!</p>
      </div>

      <div className="flex justify-between w-full px-20 pb-8 text-xl text-gray-400 font-bold">
        <div className="border-t-2 border-gray-300 pt-2 px-8">Date</div>
        <div className="border-t-2 border-gray-300 pt-2 px-8">Signed</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Controls */}
      <div className="text-center space-y-4 print:hidden">
        <h2 className="text-3xl sm:text-4xl font-bold text-purple-900">✨ Your Magic Chart is Ready!</h2>

        {/* Mode Toggle */}
        <div className="flex justify-center gap-2 bg-gray-100 p-1 rounded-xl max-w-xs mx-auto">
          <button
            onClick={() => setMode('digital')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              mode === 'digital' ? 'bg-white shadow-md text-purple-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Smartphone size={18} /> Use
          </button>
          <button
            onClick={() => setMode('print')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              mode === 'print' ? 'bg-white shadow-md text-purple-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Printer size={18} /> Print
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from(state.selectedOutputs).map((type: OutputType) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                activeTab === type ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {type.replace(/_/g, ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        {mode === 'print' && (
          <div className="flex justify-center gap-4 pt-2">
            <Button onClick={handlePrint} className="px-8 shadow-xl">
              <Printer size={20} className="mr-2" /> Print
            </Button>
          </div>
        )}

        <button onClick={onReset} className="text-gray-500 hover:text-gray-700 flex items-center gap-2 mx-auto">
          <ArrowLeft size={18} /> Back to Menu
        </button>
      </div>

      {/* Content */}
      <div className="flex justify-center px-4 print:block print:px-0">
        <div id="printable-content" className={mode === 'print' ? 'transform scale-[0.4] sm:scale-[0.6] lg:scale-[0.8] origin-top print:scale-100' : ''}>
          {mode === 'digital' ? (
            <>
              {activeTab === 'weekly_chart' && <DigitalWeeklyChart />}
              {activeTab === 'chore_tracker' && <DigitalChoreTracker />}
              {activeTab === 'sticker_sheet' && <StickerSheetTemplate />}
              {activeTab === 'certificate' && <CertificateTemplate />}
            </>
          ) : (
            <>
              {activeTab === 'weekly_chart' && <PrintWeeklyChart />}
              {activeTab === 'chore_tracker' && <PrintWeeklyChart />}
              {activeTab === 'sticker_sheet' && <StickerSheetTemplate />}
              {activeTab === 'certificate' && <CertificateTemplate />}
            </>
          )}
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-content, #printable-content * { visibility: visible; }
          #printable-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            transform: scale(1) !important;
            box-shadow: none !important;
          }
          @page { size: auto; margin: 0mm; }
        }
      `}</style>
    </div>
  );
};
