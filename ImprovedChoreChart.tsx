import React, { useState, useEffect, useCallback } from 'react';
import { Edit3, Check, GripVertical, Plus, Trash2, RotateCcw } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  type: 'morning' | 'evening';
  tileImageUrl?: string;
}

interface Chore {
  id: string;
  title: string;
  value: string;
}

interface ChartData {
  childName: string;
  tasks: Task[];
  chores: Chore[];
  rewardGoal: RewardGoal;
}

interface RewardGoal {
  goalName: string;
  targetAmount: string;
  currencySymbol: string;
}

interface WeekData {
  weekStart: string; // ISO date string of the Monday
  taskChecks: Record<string, boolean[]>;
  choreChecks: Record<string, boolean[]>;
}

interface ChoreChartProps {
  childName: string;
  tasks: Task[];
  chores: Chore[];
  rewardGoal: RewardGoal;
  headerImageUrl?: string;
  rewardImageUrl?: string;
  storageKey?: string; // Unique key for localStorage (useful for multiple children)
  onUpdate?: (data: ChartData) => void;
}

// Helper to get the Monday of the current week
const getWeekStart = (): string => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
};

export const ImprovedChoreChart: React.FC<ChoreChartProps> = ({
  childName: initialName,
  tasks: initialTasks,
  chores: initialChores,
  rewardGoal: initialReward,
  headerImageUrl,
  rewardImageUrl,
  storageKey = 'chore-chart',
  onUpdate,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [childName, setChildName] = useState(initialName);
  const [tasks, setTasks] = useState(initialTasks);
  const [chores, setChores] = useState(initialChores);
  const [rewardGoal, setRewardGoal] = useState(initialReward);
  const [draggedItem, setDraggedItem] = useState<{ id: string; type: 'task' | 'chore' } | null>(null);

  // Track checkbox states (digital mode)
  const [taskChecks, setTaskChecks] = useState<Record<string, boolean[]>>({});
  const [choreChecks, setChoreChecks] = useState<Record<string, boolean[]>>({});
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart());

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(`${storageKey}-week`);
    if (savedData) {
      const weekData: WeekData = JSON.parse(savedData);
      const currentWeek = getWeekStart();

      // Check if it's a new week - if so, reset the checkboxes
      if (weekData.weekStart !== currentWeek) {
        // New week - start fresh
        setTaskChecks({});
        setChoreChecks({});
        setCurrentWeekStart(currentWeek);
      } else {
        // Same week - restore saved state
        setTaskChecks(weekData.taskChecks || {});
        setChoreChecks(weekData.choreChecks || {});
        setCurrentWeekStart(weekData.weekStart);
      }
    }
  }, [storageKey]);

  // Save checkbox state to localStorage whenever it changes
  useEffect(() => {
    const weekData: WeekData = {
      weekStart: currentWeekStart,
      taskChecks,
      choreChecks,
    };
    localStorage.setItem(`${storageKey}-week`, JSON.stringify(weekData));
  }, [taskChecks, choreChecks, currentWeekStart, storageKey]);

  // Manual week reset function
  const resetWeek = useCallback(() => {
    if (window.confirm('Reset all checkboxes for this week? This cannot be undone.')) {
      setTaskChecks({});
      setChoreChecks({});
      setCurrentWeekStart(getWeekStart());
    }
  }, []);

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

  const handleSave = () => {
    setEditMode(false);
    if (onUpdate) {
      onUpdate({ childName, tasks, chores, rewardGoal });
    }
  };

  const addTask = (type: 'morning' | 'evening') => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: 'New Task',
      type,
    };
    setTasks([...tasks, newTask]);
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateTask = (id: string, title: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, title } : t));
  };

  const addChore = () => {
    const newChore: Chore = {
      id: `chore-${Date.now()}`,
      title: 'New Chore',
      value: '50p',
    };
    setChores([...chores, newChore]);
  };

  const removeChore = (id: string) => {
    setChores(chores.filter(c => c.id !== id));
  };

  const updateChore = (id: string, field: 'title' | 'value', value: string) => {
    setChores(chores.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // Drag and drop handlers
  const handleDragStart = (id: string, type: 'task' | 'chore') => {
    setDraggedItem({ id, type });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropTask = (targetId: string, taskType: 'morning' | 'evening') => {
    if (!draggedItem || draggedItem.type !== 'task') return;

    const draggedTask = tasks.find((t: Task) => t.id === draggedItem.id);
    if (!draggedTask || draggedTask.type !== taskType) {
      setDraggedItem(null);
      return;
    }

    const filteredTasks = tasks.filter((t: Task) => t.type === taskType);
    const otherTasks = tasks.filter((t: Task) => t.type !== taskType);

    const draggedIndex = filteredTasks.findIndex((t: Task) => t.id === draggedItem.id);
    const targetIndex = filteredTasks.findIndex((t: Task) => t.id === targetId);

    if (draggedIndex === targetIndex) {
      setDraggedItem(null);
      return;
    }

    const reordered = [...filteredTasks];
    const [removed] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, removed);

    setTasks([...otherTasks, ...reordered]);
    setDraggedItem(null);
  };

  const handleDropChore = (targetId: string) => {
    if (!draggedItem || draggedItem.type !== 'chore') return;

    const draggedIndex = chores.findIndex((c: Chore) => c.id === draggedItem.id);
    const targetIndex = chores.findIndex((c: Chore) => c.id === targetId);

    if (draggedIndex === targetIndex) {
      setDraggedItem(null);
      return;
    }

    const reordered = [...chores];
    const [removed] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, removed);

    setChores(reordered);
    setDraggedItem(null);
  };

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden print:shadow-none print:rounded-none">
      {/* Edit Mode Toggle */}
      <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 flex justify-between items-center print:hidden">
        <h2 className="text-white font-bold text-lg">Magic Chart Maker</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={resetWeek}
            className="px-3 py-2 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center gap-2"
            title="Reset week"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={() => editMode ? handleSave() : setEditMode(true)}
            className="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2"
          >
            {editMode ? (
              <>
                <Check size={18} /> Save Changes
              </>
            ) : (
              <>
                <Edit3 size={18} /> Edit Chart
              </>
            )}
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="relative h-32 md:h-48 bg-gradient-to-r from-cyan-400 to-blue-500 overflow-hidden">
        {headerImageUrl && (
          <img src={headerImageUrl} className="w-full h-full object-cover" alt="Header" />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          {editMode ? (
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="text-3xl md:text-5xl font-black text-white bg-white/20 backdrop-blur-sm px-6 py-2 rounded-xl text-center border-2 border-white/50 focus:outline-none focus:border-white"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
            />
          ) : (
            <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg">
              {childName}'s Chart
            </h1>
          )}
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-8">
        {/* WEEKLY ROUTINE CHART */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-orange-500 flex items-center gap-2">
              <span className="text-3xl">☀️</span> Morning Missions
            </h2>
            {editMode && (
              <button
                onClick={() => addTask('morning')}
                className="text-sm px-3 py-1 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 flex items-center gap-1"
              >
                <Plus size={16} /> Add Task
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
                <div className="flex items-center gap-3 mb-2">
                  {editMode && (
                    <div className="flex gap-1">
                      <GripVertical size={20} className="text-gray-400 cursor-grab" />
                      <button
                        onClick={() => removeTask(task.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                  
                  {task.tileImageUrl && (
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 border-orange-300 flex-shrink-0">
                      <img src={task.tileImageUrl} className="w-full h-full object-cover" alt={task.title} />
                    </div>
                  )}
                  
                  {editMode ? (
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => updateTask(task.id, e.target.value)}
                      className="flex-1 text-lg font-bold text-gray-800 bg-white px-3 py-2 rounded-lg border-2 border-orange-300 focus:outline-none focus:border-orange-500"
                    />
                  ) : (
                    <h3 className="flex-1 text-lg md:text-xl font-bold text-gray-800">{task.title}</h3>
                  )}
                </div>
                
                {/* Checkbox Grid */}
                <div className="flex gap-1.5 md:gap-2 justify-end">
                  {dayLabels.map((day, index) => {
                    const isChecked = taskChecks[task.id]?.[index] || false;
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <span className="text-xs text-gray-500 mb-1">{day}</span>
                        <button
                          onClick={() => toggleTaskCheck(task.id, index)}
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-lg border-[3px] transition-all ${
                            isChecked
                              ? 'bg-orange-500 border-orange-600 shadow-lg'
                              : 'bg-white border-orange-300 hover:border-orange-400'
                          }`}
                        >
                          {isChecked && (
                            <Check size={24} className="text-white mx-auto" strokeWidth={3} />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EVENING TASKS */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-indigo-500 flex items-center gap-2">
              <span className="text-3xl">🌙</span> Evening Quests
            </h2>
            {editMode && (
              <button
                onClick={() => addTask('evening')}
                className="text-sm px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 flex items-center gap-1"
              >
                <Plus size={16} /> Add Task
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
                <div className="flex items-center gap-3 mb-2">
                  {editMode && (
                    <div className="flex gap-1">
                      <GripVertical size={20} className="text-gray-400 cursor-grab" />
                      <button
                        onClick={() => removeTask(task.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                  
                  {task.tileImageUrl && (
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 border-indigo-300 flex-shrink-0">
                      <img src={task.tileImageUrl} className="w-full h-full object-cover" alt={task.title} />
                    </div>
                  )}
                  
                  {editMode ? (
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => updateTask(task.id, e.target.value)}
                      className="flex-1 text-lg font-bold text-gray-800 bg-white px-3 py-2 rounded-lg border-2 border-indigo-300 focus:outline-none focus:border-indigo-500"
                    />
                  ) : (
                    <h3 className="flex-1 text-lg md:text-xl font-bold text-gray-800">{task.title}</h3>
                  )}
                </div>
                
                {/* Checkbox Grid */}
                <div className="flex gap-1.5 md:gap-2 justify-end">
                  {dayLabels.map((day, index) => {
                    const isChecked = taskChecks[task.id]?.[index] || false;
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <span className="text-xs text-gray-500 mb-1">{day}</span>
                        <button
                          onClick={() => toggleTaskCheck(task.id, index)}
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-lg border-[3px] transition-all ${
                            isChecked
                              ? 'bg-indigo-500 border-indigo-600 shadow-lg'
                              : 'bg-white border-indigo-300 hover:border-indigo-400'
                          }`}
                        >
                          {isChecked && (
                            <Check size={24} className="text-white mx-auto" strokeWidth={3} />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CHORE TRACKER */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-green-600 flex items-center gap-2">
              <span className="text-3xl">💰</span> Ways to Earn
            </h2>
            {editMode && (
              <button
                onClick={addChore}
                className="text-sm px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
              >
                <Plus size={16} /> Add Chore
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
                <div className="flex items-center gap-3 mb-2">
                  {editMode && (
                    <div className="flex gap-1">
                      <GripVertical size={20} className="text-gray-400 cursor-grab" />
                      <button
                        onClick={() => removeChore(chore.id)}
                        className="text-red-500 hover:text-red-700"
                      >
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
                        className="flex-1 text-lg font-bold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg border-2 border-green-300 focus:outline-none focus:border-green-500"
                        placeholder="Chore name"
                      />
                      <input
                        type="text"
                        value={chore.value}
                        onChange={(e) => updateChore(chore.id, 'value', e.target.value)}
                        className="w-20 text-lg font-bold text-green-700 bg-green-100 px-3 py-2 rounded-lg border-2 border-green-300 focus:outline-none focus:border-green-500 text-center"
                        placeholder="50p"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="flex-1 text-lg font-bold text-gray-800">{chore.title}</h3>
                      <span className="px-4 py-2 bg-green-100 text-green-700 font-black rounded-lg text-lg">
                        {chore.value}
                      </span>
                    </>
                  )}
                </div>
                
                {/* Checkbox Grid */}
                <div className="flex gap-1.5 md:gap-2 justify-end">
                  {dayLabels.map((day, index) => {
                    const isChecked = choreChecks[chore.id]?.[index] || false;
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <span className="text-xs text-gray-500 mb-1">{day}</span>
                        <button
                          onClick={() => toggleChoreCheck(chore.id, index)}
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-lg border-[3px] transition-all ${
                            isChecked
                              ? 'bg-green-500 border-green-600 shadow-lg'
                              : 'bg-white border-green-300 hover:border-green-400'
                          }`}
                        >
                          {isChecked && (
                            <Check size={24} className="text-white mx-auto" strokeWidth={3} />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* REWARD GOAL */}
        <section className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 border-2 border-yellow-200">
          <h2 className="text-xl font-bold text-yellow-600 text-center mb-3 uppercase tracking-wide">
            Saving For
          </h2>
          
          {editMode ? (
            <div className="space-y-3">
              <input
                type="text"
                value={rewardGoal.goalName}
                onChange={(e) => setRewardGoal({ ...rewardGoal, goalName: e.target.value })}
                className="w-full text-2xl font-black text-gray-800 bg-white px-4 py-3 rounded-lg border-2 border-yellow-300 focus:outline-none focus:border-yellow-500 text-center"
                placeholder="Reward name"
              />
              <div className="flex gap-2 justify-center">
                <input
                  type="text"
                  value={rewardGoal.currencySymbol}
                  onChange={(e) => setRewardGoal({ ...rewardGoal, currencySymbol: e.target.value })}
                  className="w-16 text-2xl font-black text-yellow-700 bg-white px-3 py-2 rounded-lg border-2 border-yellow-300 focus:outline-none focus:border-yellow-500 text-center"
                  placeholder="£"
                />
                <input
                  type="text"
                  value={rewardGoal.targetAmount}
                  onChange={(e) => setRewardGoal({ ...rewardGoal, targetAmount: e.target.value })}
                  className="flex-1 text-2xl font-black text-yellow-700 bg-white px-4 py-2 rounded-lg border-2 border-yellow-300 focus:outline-none focus:border-yellow-500 text-center"
                  placeholder="25.00"
                />
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-2xl md:text-3xl font-black text-gray-800 text-center mb-4">
                {rewardGoal.goalName}
              </h3>
              
              {rewardImageUrl && (
                <div className="w-full h-48 bg-white rounded-xl border-4 border-yellow-200 overflow-hidden mb-4">
                  <img src={rewardImageUrl} className="w-full h-full object-cover" alt="Reward" />
                </div>
              )}
              
              <div className="text-center">
                <div className="inline-block px-8 py-4 bg-yellow-400 text-white rounded-2xl shadow-lg">
                  <span className="text-4xl font-black">
                    {rewardGoal.currencySymbol}{rewardGoal.targetAmount}
                  </span>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
};
