
import React from 'react';
import { Task, AppState } from '../types';
import { CheckCircle, Loader2, Image as ImageIcon } from 'lucide-react';

interface Props {
  state: AppState;
}

export const StepGenerating: React.FC<Props> = ({ state }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 text-center">
      <div className="space-y-4">
        <div className="inline-block p-4 rounded-full bg-purple-100 mb-4 animate-pulse">
          <span className="text-4xl">✨</span>
        </div>
        <h2 className="text-4xl font-bold text-purple-900 display-font animate-fade-in">
          Weaving the Magic...
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Our AI artists are analyzing your style and creating custom illustrations. 
          This usually takes about 30-60 seconds per item.
        </p>
      </div>

      {/* Active Status & Progress */}
      <div className="space-y-4 max-w-2xl mx-auto">
         <div className="w-full h-8 bg-gray-100 rounded-full p-1 shadow-inner relative overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 transition-all duration-500 ease-out relative overflow-hidden shadow-lg"
              style={{ width: `${state.generationProgress}%` }}
            >
               {/* Animated stripes overlay */}
               <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:24px_24px] animate-[pulse_1s_linear_infinite] opacity-50"></div>
            </div>
         </div>
         
         <div className="flex items-center justify-center gap-3 text-purple-700 font-bold text-xl animate-pulse min-h-[32px]">
           {state.generationProgress < 100 && <Loader2 className="animate-spin" size={24} />}
           {state.generationStatus}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-purple-50">
          <h3 className="font-bold text-purple-800 mb-4 border-b pb-2">Style Extraction</h3>
          <div className="flex items-center gap-3">
             {state.styleData.isExtracted ? (
               <CheckCircle className="text-green-500" />
             ) : (
               <Loader2 className="animate-spin text-purple-500" />
             )}
             <span className={state.styleData.isExtracted ? "text-gray-700" : "text-gray-500 font-medium"}>
               {state.styleData.isExtracted ? "Art style mastered" : "Analyzing reference images..."}
             </span>
          </div>
          {state.styleData.isExtracted && (
            <p className="mt-2 text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg">
              "{state.styleData.description.substring(0, 120)}..."
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border border-purple-50 h-96 overflow-y-auto custom-scrollbar">
          <h3 className="font-bold text-purple-800 mb-4 border-b pb-2">Card Illustrations</h3>
          <ul className="space-y-4">
            {state.tasks.map(task => (
              <li key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 flex-shrink-0">
                  {task.status === 'completed' ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : task.status === 'generating' ? (
                    <Loader2 className="animate-spin text-blue-500" size={20} />
                  ) : task.status === 'failed' ? (
                     <div className="text-red-500">x</div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-800">{task.title}</span>
                  <div className="text-xs text-gray-400">
                    {task.status === 'pending' && 'Waiting...'}
                    {task.status === 'generating' && 'Painting scene...'}
                    {task.status === 'completed' && 'Done'}
                  </div>
                </div>
                {task.frontImageUrl && (
                  <img src={task.frontImageUrl} alt="thumb" className="w-10 h-10 rounded-md object-cover border border-gray-200" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
