
import React, { useState, useEffect } from 'react';
import { AppState, AppStep, Chore, OutputType, GeneratedAssets, UploadedImage } from './types';
import * as GeminiService from './services/geminiService';
import * as TemplateService from './services/templateService';
import { StepUpload } from './components/StepUpload';
import { StepDetails } from './components/StepDetails';
import { StepRoutine } from './components/StepRoutine';
import { StepChores } from './components/StepChores';
import { StepOutputSelection } from './components/StepOutputSelection';
import { StepGenerating } from './components/StepGenerating';
import { StepPreview } from './components/StepPreview';
import { TemplateGallery } from './components/TemplateGallery';
import { Button } from './components/Button';

const INITIAL_STATE: AppState = {
  step: AppStep.API_KEY,
  profile: { name: '', age: '' },
  referenceImages: [],
  childPhoto: undefined,
  styleData: { description: '', isExtracted: false },
  tasks: [],
  chores: [],
  rewardGoal: { goalName: '', targetAmount: '', currencySymbol: '£' },
  selectedOutputs: new Set<OutputType>(['weekly_chart']),
  generatedAssets: {},
  generationProgress: 0,
  generationStatus: 'Initializing...'
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [hasTemplates, setHasTemplates] = useState(false);

  useEffect(() => {
    checkApiKey();
    // Check if there are any saved templates
    setHasTemplates(TemplateService.getTemplates().length > 0);
  }, []);

  const checkApiKey = async () => {
    // Skip API key screen - go straight to upload
    setApiKeyReady(true);
    setState(s => ({ ...s, step: AppStep.UPLOAD }));
  };

  const handleSelectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      await aistudio.openSelectKey();
      checkApiKey();
    }
  };

  const handleSelectTemplate = (assets: GeneratedAssets, styleDescription: string, references?: UploadedImage[]) => {
    setState(s => ({
      ...s,
      generatedAssets: assets,
      styleData: { description: styleDescription, isExtracted: true },
      referenceImages: references || s.referenceImages,
    }));
    setShowTemplateGallery(false);
    // Skip to details if we have assets, or stay on upload to add child photo
  };

  const handleExtraction = async () => {
    setState(prev => ({ ...prev, step: AppStep.GENERATING, generationProgress: 5, generationStatus: "Preparing to weave magic..." }));

    try {
      // 1. EXTRACT STYLE
      setState(prev => ({ ...prev, generationStatus: "Analyzing your art style references..." }));
      const styleDesc = await GeminiService.extractStyleFromReferences(state.referenceImages);
      setState(prev => ({
        ...prev,
        styleData: { description: styleDesc, isExtracted: true },
        generationProgress: 10
      }));

      const { referenceImages, childPhoto, profile } = state;
      const assets = { ...state.generatedAssets };
      let currentProgress = 10;
      
      // Calculate total operations for progress bar
      const totalOps = 
        (state.tasks.length) + // Tiles
        (state.selectedOutputs.has('weekly_chart') || state.selectedOutputs.has('chore_tracker') ? 1 : 0) + // Header
        (state.selectedOutputs.has('weekly_chart') ? 1 : 0) + // Checkboxes
        (state.selectedOutputs.has('chore_tracker') ? 1 : 0) + // Progress Bar
        (state.selectedOutputs.has('sticker_sheet') ? 1 : 0) + // Stickers
        (state.selectedOutputs.has('certificate') ? 1 : 0); // Badge

      const incrementProgress = () => {
        currentProgress += (80 / totalOps);
        setState(prev => ({ ...prev, generationProgress: Math.min(95, currentProgress) }));
      };

      // 2. GENERATE GLOBAL ASSETS (Header, UI)
      if (state.selectedOutputs.has('weekly_chart') || state.selectedOutputs.has('chore_tracker')) {
        setState(prev => ({ ...prev, generationStatus: "Painting the main adventure banner..." }));
        assets.headerBannerUrl = await GeminiService.generateHeaderBanner(profile.name, styleDesc, referenceImages, childPhoto);
        incrementProgress();
      }

      if (state.selectedOutputs.has('weekly_chart')) {
        setState(prev => ({ ...prev, generationStatus: "Designing themed checkboxes..." }));
        assets.checkboxOutlineUrl = await GeminiService.generateThemedCheckbox(styleDesc, referenceImages, false);
        incrementProgress();
      }

      if (state.selectedOutputs.has('chore_tracker')) {
        setState(prev => ({ ...prev, generationStatus: "Building the progress tracker..." }));
        assets.progressIllustrationUrl = await GeminiService.generateProgressBar(state.rewardGoal.goalName, styleDesc, referenceImages);
        incrementProgress();
      }

      if (state.selectedOutputs.has('sticker_sheet')) {
        setState(prev => ({ ...prev, generationStatus: "Designing sticker sheet..." }));
        assets.stickerSheetUrl = await GeminiService.generateStickerSheet(styleDesc, referenceImages);
        incrementProgress();
      }

      if (state.selectedOutputs.has('certificate')) {
        setState(prev => ({ ...prev, generationStatus: "Forging the achievement badge..." }));
        assets.certificateBadgeUrl = await GeminiService.generateCertificateBadge(styleDesc, referenceImages);
        incrementProgress();
      }
      
      setState(prev => ({ ...prev, generatedAssets: assets }));

      // 3. GENERATE TASK TILES (Parallel)
      setState(prev => ({ ...prev, generationStatus: "Starting task illustrations..." }));
      const updatedTasks = [...state.tasks];
      for (let i = 0; i < updatedTasks.length; i++) {
        updatedTasks[i].status = 'generating';
        setState(prev => ({ 
          ...prev, 
          generationStatus: `Illustrating task: ${updatedTasks[i].title}...`,
          tasks: [...updatedTasks] 
        }));

        try {
          // Generate front tile
          const tileUrl = await GeminiService.generateTaskTile(updatedTasks[i].title, styleDesc, referenceImages, childPhoto);
          updatedTasks[i].tileImageUrl = tileUrl;
          
          if (state.selectedOutputs.has('flip_cards')) {
             // Generate Celebration/Back tile
             const celebrateUrl = await GeminiService.generateCelebrationTile(updatedTasks[i].title, styleDesc, referenceImages, childPhoto);
             updatedTasks[i].celebrationImageUrl = celebrateUrl;
          }
          
          updatedTasks[i].status = 'completed';
        } catch (e) {
          console.error(e);
          updatedTasks[i].status = 'failed';
        }
        incrementProgress();
        setState(prev => ({ ...prev, tasks: [...updatedTasks] }));
      }

      // Finish
      setState(prev => ({ ...prev, step: AppStep.PREVIEW, generationProgress: 100, generationStatus: "Magic Complete!" }));

    } catch (error) {
      console.error("Critical Generation Error", error);
      // alert("Something went wrong with the magic spell. Please try again.");
      setState(prev => ({ ...prev, step: AppStep.OUTPUTS, generationStatus: "Magic interrupted. Please try again." }));
    }
  };

  return (
    <div className="min-h-screen text-gray-800 selection:bg-purple-200">
      {/* Header */}
      <header className="py-6 px-8 bg-white/60 backdrop-blur-md sticky top-0 z-50 border-b-2 border-white shadow-sm print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-4xl filter drop-shadow-md">🌟</span>
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 display-font tracking-tight">
              Magic Chart Maker
            </h1>
          </div>
          <div className="text-sm font-bold text-gray-400 bg-white/50 px-4 py-1 rounded-full border border-white">
             {state.step !== AppStep.API_KEY && `Step: ${state.step}`}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 print:p-0 print:w-full print:max-w-none">
        
        {state.step === AppStep.API_KEY && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 text-center animate-fade-in">
             {/* Same API Key Screen */}
            <div className="w-24 h-24 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-5xl shadow-lg mb-4 text-white">
              ✨
            </div>
            <h2 className="text-5xl font-black display-font text-purple-900 tracking-tight">Unlock the Magic</h2>
            <p className="max-w-xl text-xl text-gray-600 font-medium leading-relaxed">
               Create professional, fully illustrated chore charts using your child's favorite characters.
               <br/><br/>
               <span className="text-sm text-gray-500">Requires a Gemini API Key.</span>
            </p>
            <Button onClick={handleSelectKey} className="text-xl px-12 py-5 shadow-2xl shadow-purple-500/30">
               Connect API Key
            </Button>
          </div>
        )}

        {state.step === AppStep.UPLOAD && (
          <StepUpload
            referenceImages={state.referenceImages}
            childPhoto={state.childPhoto}
            onReferenceChange={(imgs) => setState(s => ({ ...s, referenceImages: imgs }))}
            onChildPhotoChange={(img) => setState(s => ({ ...s, childPhoto: img }))}
            onNext={() => setState(s => ({ ...s, step: AppStep.DETAILS }))}
            onOpenTemplates={() => setShowTemplateGallery(true)}
            hasTemplates={hasTemplates}
          />
        )}

        {/* Template Gallery Modal */}
        {showTemplateGallery && (
          <TemplateGallery
            onSelectTemplate={handleSelectTemplate}
            onClose={() => setShowTemplateGallery(false)}
          />
        )}

        {state.step === AppStep.DETAILS && (
          <StepDetails 
            profile={state.profile}
            onChange={(p) => setState(s => ({ ...s, profile: p }))}
            onNext={() => setState(s => ({ ...s, step: AppStep.ROUTINE }))}
            onBack={() => setState(s => ({ ...s, step: AppStep.UPLOAD }))}
          />
        )}

        {state.step === AppStep.ROUTINE && (
          <StepRoutine 
            tasks={state.tasks}
            onTasksChange={(t) => setState(s => ({ ...s, tasks: t }))}
            onNext={() => setState(s => ({ ...s, step: AppStep.CHORES }))}
            onBack={() => setState(s => ({ ...s, step: AppStep.DETAILS }))}
          />
        )}

        {state.step === AppStep.CHORES && (
          <StepChores
            chores={state.chores}
            goal={state.rewardGoal}
            onChoresChange={(c) => setState(s => ({ ...s, chores: c }))}
            onGoalChange={(g) => setState(s => ({ ...s, rewardGoal: g }))}
            onNext={() => setState(s => ({ ...s, step: AppStep.OUTPUTS }))}
            onBack={() => setState(s => ({ ...s, step: AppStep.ROUTINE }))}
          />
        )}

        {state.step === AppStep.OUTPUTS && (
          <StepOutputSelection
            selected={state.selectedOutputs}
            onChange={(sel) => setState(s => ({ ...s, selectedOutputs: sel }))}
            onNext={handleExtraction}
            onBack={() => setState(s => ({ ...s, step: AppStep.CHORES }))}
            hasGeneratedAssets={!!state.generatedAssets.headerBannerUrl || state.tasks.some(t => t.tileImageUrl)}
            onViewChart={() => setState(s => ({ ...s, step: AppStep.PREVIEW }))}
          />
        )}

        {state.step === AppStep.GENERATING && (
          <StepGenerating state={state} />
        )}

        {state.step === AppStep.PREVIEW && (
          <StepPreview 
            state={state}
            onReset={() => setState(s => ({ ...s, step: AppStep.OUTPUTS }))}
          />
        )}

      </main>
    </div>
  );
};

export default App;
