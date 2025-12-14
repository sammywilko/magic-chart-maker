
import React, { useState } from 'react';
import { AppState, Task, Chore, OutputType } from '../types';
import { Printer, ArrowLeft, FileText } from 'lucide-react';
import { Button } from './Button';

interface Props {
  state: AppState;
  onReset: () => void;
}

export const StepPreview: React.FC<Props> = ({ state, onReset }) => {
  const [activeTab, setActiveTab] = useState<string>(Array.from(state.selectedOutputs)[0] || 'weekly_chart');
  
  const handlePrint = () => {
    window.print();
  };

  // --- TEMPLATES ---
  
  const PrintInstructionsTemplate = () => (
    <div className="bg-white w-[210mm] min-h-[297mm] mx-auto p-[20mm] shadow-2xl relative text-gray-800">
      <h1 className="text-4xl font-display font-black text-purple-900 mb-8 border-b-4 border-purple-200 pb-4">
        Magic Kit Instructions
      </h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-2 flex items-center gap-2">
            <span className="bg-purple-100 p-1 rounded-md">📄</span> Paper Recommendations
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li><strong>Charts & Certificates:</strong> Use heavy matte cardstock (160-200gsm) for durability.</li>
            <li><strong>Stickers:</strong> Use standard A4 full-sheet sticker paper (matte or glossy).</li>
            <li><strong>Flip Cards:</strong> Use thickest cardstock available or laminate standard paper.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-2 flex items-center gap-2">
            <span className="bg-orange-100 p-1 rounded-md">✂️</span> Cutting Guide
          </h2>
          <p className="text-lg mb-2">Most items are designed for standard A4. For Flip Cards:</p>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Cut along the dashed lines.</li>
            <li>Fold the front and back cards together before laminating for a double-sided finish.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-2 flex items-center gap-2">
            <span className="bg-blue-100 p-1 rounded-md">✨</span> Assembly Tips
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li><strong>Lamination:</strong> Highly recommended for the Weekly Chart so you can use dry-erase markers to check off tasks each week!</li>
            <li><strong>Velcro Dots:</strong> Use small velcro dots for the Flip Cards system. Attach one side to a board and the other to the card.</li>
          </ul>
        </section>
      </div>

      <div className="mt-12 p-6 bg-purple-50 rounded-2xl border-2 border-purple-100 text-center">
        <p className="font-bold text-purple-800 text-lg">Thank you for using Magic Chart Maker!</p>
        <p className="text-purple-600">We hope this brings a little magic to your daily routine.</p>
      </div>
    </div>
  );
  
  const WeeklyChartTemplate = () => (
    <div className="bg-white w-[297mm] h-[210mm] mx-auto shadow-2xl overflow-hidden relative flex flex-col">
      {/* Header */}
      <div className="h-[45mm] w-full relative bg-purple-100 overflow-hidden flex-shrink-0">
        {state.generatedAssets.headerBannerUrl ? (
          <img src={state.generatedAssets.headerBannerUrl} className="w-full h-full object-cover" alt="Header" />
        ) : (
           <div className="w-full h-full flex items-center justify-center text-purple-300 font-bold text-4xl">HEADER BANNER</div>
        )}
      </div>

      <div className="flex-1 p-8 flex gap-8 min-h-0">
         {/* Morning Column */}
         <div className="flex-1 flex flex-col gap-2 min-w-0">
            <h3 className="text-2xl font-black text-orange-500 uppercase tracking-wider mb-2 flex items-center gap-2 flex-shrink-0">
              <span className="text-3xl">☀️</span> Morning Missions
            </h3>
            <div className="flex flex-col gap-2 flex-1 overflow-visible">
              {state.tasks.filter(t => t.type === 'morning').map((task, i) => (
                <div key={i} className="flex items-center gap-3 border-b-2 border-orange-100 pb-2 min-h-[22mm]">
                  <div className="w-[20mm] h-[20mm] rounded-xl overflow-hidden border-2 border-orange-200 bg-orange-50 flex-shrink-0">
                    {task.tileImageUrl && <img src={task.tileImageUrl} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-xl text-gray-700 block leading-tight truncate pr-2">{task.title}</span>
                  </div>
                  {/* Days Grid */}
                  <div className="flex gap-2 flex-shrink-0">
                    {['M','T','W','T','F','S','S'].map((day, d) => (
                      <div key={d} className="w-[8.5mm] h-[8.5mm] rounded-lg border-2 border-orange-200 flex items-center justify-center opacity-50">
                        {state.generatedAssets.checkboxOutlineUrl && (
                          <img src={state.generatedAssets.checkboxOutlineUrl} className="w-full h-full p-0.5 opacity-30" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
         </div>

         {/* Evening Column */}
         <div className="flex-1 flex flex-col gap-2 min-w-0">
            <h3 className="text-2xl font-black text-indigo-500 uppercase tracking-wider mb-2 flex items-center gap-2 flex-shrink-0">
              <span className="text-3xl">🌙</span> Evening Quests
            </h3>
            <div className="flex flex-col gap-2 flex-1 overflow-visible">
              {state.tasks.filter(t => t.type === 'evening').map((task, i) => (
                <div key={i} className="flex items-center gap-3 border-b-2 border-indigo-100 pb-2 min-h-[22mm]">
                  <div className="w-[20mm] h-[20mm] rounded-xl overflow-hidden border-2 border-indigo-200 bg-indigo-50 flex-shrink-0">
                    {task.tileImageUrl && <img src={task.tileImageUrl} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-xl text-gray-700 block leading-tight truncate pr-2">{task.title}</span>
                  </div>
                  {/* Days Grid */}
                  <div className="flex gap-2 flex-shrink-0">
                    {['M','T','W','T','F','S','S'].map((day, d) => (
                      <div key={d} className="w-[8.5mm] h-[8.5mm] rounded-lg border-2 border-indigo-200 flex items-center justify-center opacity-50">
                        {state.generatedAssets.checkboxOutlineUrl && (
                          <img src={state.generatedAssets.checkboxOutlineUrl} className="w-full h-full p-0.5 opacity-30" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
         </div>
      </div>
      
      {/* Footer / Progress */}
      <div className="h-[30mm] bg-gray-50 border-t-4 border-white flex items-center px-8 justify-between relative flex-shrink-0">
        <div className="w-2/3 relative h-16 bg-gray-200 rounded-full overflow-hidden border-4 border-white shadow-inner">
           {state.generatedAssets.progressIllustrationUrl && (
             <img src={state.generatedAssets.progressIllustrationUrl} className="w-full h-full object-cover opacity-50 grayscale" />
           )}
           <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-400 tracking-widest uppercase">
             Weekly Progress
           </div>
        </div>
        <div className="font-display text-2xl text-purple-500 font-bold">
          Goal: {state.rewardGoal.goalName}
        </div>
      </div>
    </div>
  );

  const StickerSheetTemplate = () => (
    <div className="bg-white w-[210mm] h-[297mm] mx-auto shadow-2xl p-[10mm] relative">
       <h2 className="text-center font-display text-3xl text-gray-400 mb-8 opacity-50">STICKER SHEET</h2>
       {state.generatedAssets.stickerSheetUrl ? (
         <img src={state.generatedAssets.stickerSheetUrl} className="w-full h-full object-contain" />
       ) : (
         <div className="grid grid-cols-4 gap-6">
           {Array.from({length: 24}).map((_, i) => (
             <div key={i} className="aspect-square rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                {state.generatedAssets.checkboxFilledUrl && <img src={state.generatedAssets.checkboxFilledUrl} className="w-1/2" />}
             </div>
           ))}
         </div>
       )}
    </div>
  );

  const CertificateTemplate = () => (
    <div className="bg-white w-[297mm] h-[210mm] mx-auto shadow-2xl relative p-[15mm] flex flex-col items-center justify-between border-[10px] border-double border-yellow-200">
      {/* Decorative Corners */}
      <div className="absolute top-4 left-4 w-24 h-24 border-t-4 border-l-4 border-yellow-400 rounded-tl-3xl"></div>
      <div className="absolute top-4 right-4 w-24 h-24 border-t-4 border-r-4 border-yellow-400 rounded-tr-3xl"></div>
      <div className="absolute bottom-4 left-4 w-24 h-24 border-b-4 border-l-4 border-yellow-400 rounded-bl-3xl"></div>
      <div className="absolute bottom-4 right-4 w-24 h-24 border-b-4 border-r-4 border-yellow-400 rounded-br-3xl"></div>

      <div className="text-center space-y-4 pt-8">
        <h1 className="font-display text-6xl text-yellow-500 drop-shadow-sm">Star of the Week</h1>
        <p className="text-3xl text-gray-400 font-display">is proudly awarded to</p>
      </div>

      <div className="font-display text-[80px] text-purple-600 font-bold border-b-4 border-gray-100 px-20 pb-4">
        {state.profile.name}
      </div>

      <div className="flex items-center gap-12 w-full px-20">
        <div className="w-[40mm] h-[40mm] relative">
          {state.generatedAssets.certificateBadgeUrl ? (
            <img src={state.generatedAssets.certificateBadgeUrl} className="w-full h-full object-contain drop-shadow-xl" />
          ) : (
            <div className="w-full h-full bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">BADGE</div>
          )}
        </div>
        <div className="flex-1 text-center">
          <p className="text-2xl text-gray-500 italic">For completing an amazing week of adventures!</p>
        </div>
      </div>

      <div className="flex justify-between w-full px-20 pb-8 text-xl text-gray-400 font-bold">
        <div className="border-t-2 border-gray-300 pt-2 px-8">Date</div>
        <div className="border-t-2 border-gray-300 pt-2 px-8">Signed</div>
      </div>
    </div>
  );

  const ChoreTrackerTemplate = () => (
    <div className="bg-white w-[297mm] h-[210mm] mx-auto shadow-2xl relative flex flex-col">
      {/* Banner */}
      <div className="h-[40mm] bg-green-50 overflow-hidden relative">
        {state.generatedAssets.headerBannerUrl && (
          <img src={state.generatedAssets.headerBannerUrl} className="w-full h-full object-cover opacity-80" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl font-display font-black text-white drop-shadow-lg stroke-black" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
            {state.profile.name}'s Treasure Chest
          </h1>
        </div>
      </div>

      <div className="flex-1 p-8 flex gap-8">
        {/* Chore List */}
        <div className="w-2/3 bg-green-50 rounded-3xl p-6 border-4 border-green-100">
           <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
             <span className="text-3xl">💰</span> Ways to Earn
           </h3>
           <div className="space-y-3">
             {state.chores.map((chore, i) => (
               <div key={i} className="bg-white p-3 rounded-2xl flex items-center justify-between border-2 border-green-100 shadow-sm h-[18mm]">
                  <span className="font-bold text-xl text-gray-700 ml-2">{chore.title}</span>
                  <div className="flex items-center gap-4">
                     <div className="flex gap-1">
                        {[1,2,3,4,5,6,7].map(d => (
                          <div key={d} className="w-8 h-8 rounded-lg border-2 border-gray-200"></div>
                        ))}
                     </div>
                     <span className="bg-green-100 text-green-700 font-black px-4 py-2 rounded-xl min-w-[3rem] text-center">
                       {chore.value}
                     </span>
                  </div>
               </div>
             ))}
           </div>
        </div>

        {/* Savings Goal */}
        <div className="w-1/3 flex flex-col gap-4">
           <div className="bg-yellow-50 rounded-3xl p-6 border-4 border-yellow-100 flex-1 flex flex-col items-center justify-center text-center">
             <h3 className="text-xl font-bold text-yellow-600 uppercase mb-2">Saving For</h3>
             <div className="text-3xl font-black text-gray-800 mb-4">{state.rewardGoal.goalName}</div>
             <div className="w-full h-48 bg-white rounded-2xl border-4 border-yellow-200 relative overflow-hidden">
                {state.generatedAssets.progressIllustrationUrl && (
                  <img src={state.generatedAssets.progressIllustrationUrl} className="w-full h-full object-cover" />
                )}
             </div>
             <div className="mt-4 font-black text-4xl text-yellow-500">
               {state.rewardGoal.currencySymbol}{state.rewardGoal.targetAmount}
             </div>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Controls */}
      <div className="text-center space-y-4 print:hidden">
        <h2 className="text-4xl font-bold text-purple-900 display-font">Your Magic Kit is Ready!</h2>
        <div className="flex justify-center gap-4">
           {Array.from(state.selectedOutputs).map((type: OutputType) => (
             <button
               key={type}
               onClick={() => setActiveTab(type)}
               className={`px-4 py-2 rounded-xl font-bold transition-all ${activeTab === type ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
             >
               {type.replace('_', ' ').toUpperCase()}
             </button>
           ))}
           <button
             onClick={() => setActiveTab('instructions')}
             className={`px-4 py-2 rounded-xl font-bold transition-all ${activeTab === 'instructions' ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
           >
             INSTRUCTIONS
           </button>
        </div>
        <div className="flex justify-center gap-4 pt-4">
          <Button onClick={handlePrint} className="px-8 shadow-xl">
            <Printer size={20} className="mr-2" /> Print Current Page
          </Button>
          <Button variant="outline" onClick={onReset}>
             <ArrowLeft size={20} className="mr-2" /> Back to Menu
          </Button>
        </div>
      </div>

      {/* Render Active Template */}
      <div className="flex justify-center overflow-x-auto pb-10 print:block print:overflow-visible">
         <div id="printable-content" className="transform scale-[0.6] origin-top md:scale-[0.8] lg:scale-100 print:scale-100 transition-transform">
            {activeTab === 'weekly_chart' && <WeeklyChartTemplate />}
            {activeTab === 'sticker_sheet' && <StickerSheetTemplate />}
            {activeTab === 'certificate' && <CertificateTemplate />}
            {activeTab === 'chore_tracker' && <ChoreTrackerTemplate />}
            {activeTab === 'instructions' && <PrintInstructionsTemplate />}
            {activeTab === 'flip_cards' && (
              <div className="bg-white w-[210mm] min-h-[297mm] mx-auto p-12 shadow-2xl relative">
                 <h2 className="text-center font-display text-3xl mb-8">Daily Flip Cards</h2>
                 <div className="grid grid-cols-2 gap-8">
                   {state.tasks.map((task, i) => (
                     <div key={i} className="flex gap-4 border-2 border-dashed border-gray-200 p-4 rounded-xl">
                       <div className="w-[60mm] h-[60mm] border-2 border-black rounded-xl overflow-hidden relative">
                         <div className="absolute top-2 left-2 w-4 h-4 rounded-full border border-black"></div>
                         {task.tileImageUrl && <img src={task.tileImageUrl} className="w-full h-full object-cover" />}
                         <div className="absolute bottom-0 w-full bg-white/90 p-2 text-center font-bold">{task.title}</div>
                       </div>
                       <div className="w-[60mm] h-[60mm] border-2 border-black rounded-xl overflow-hidden relative">
                         <div className="absolute top-2 right-2 w-4 h-4 rounded-full border border-black"></div>
                         {task.celebrationImageUrl && <img src={task.celebrationImageUrl} className="w-full h-full object-cover" />}
                         <div className="absolute bottom-0 w-full bg-green-100/90 p-2 text-center font-bold text-green-800">DONE!</div>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            )}
         </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-content, #printable-content * {
            visibility: visible;
          }
          #printable-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            transform: scale(1) !important;
            box-shadow: none !important;
          }
          @page {
             size: auto;
             margin: 0mm;
          }
        }
      `}</style>
    </div>
  );
};
