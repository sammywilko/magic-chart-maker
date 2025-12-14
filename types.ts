
export enum AppStep {
  API_KEY = 'API_KEY',
  UPLOAD = 'UPLOAD',
  DETAILS = 'DETAILS',
  ROUTINE = 'ROUTINE',
  CHORES = 'CHORES',
  OUTPUTS = 'OUTPUTS',
  GENERATING = 'GENERATING',
  PREVIEW = 'PREVIEW'
}

export interface Task {
  id: string;
  title: string;
  type: 'morning' | 'evening';
  status: 'pending' | 'generating' | 'completed' | 'failed';
  tileImageUrl?: string; // Small 1:1 icon
  celebrationImageUrl?: string; // Celebration version
}

export interface Chore {
  id: string;
  title: string;
  value: string; // e.g. "10p"
  status: 'pending' | 'generating' | 'completed' | 'failed';
  tileImageUrl?: string;
}

export interface ChildProfile {
  name: string;
  age: string;
}

export interface RewardGoal {
  goalName: string;
  targetAmount: string;
  currencySymbol: string;
}

export interface StyleData {
  description: string;
  isExtracted: boolean;
}

export interface UploadedImage {
  id: string;
  data: string; // Base64
  mimeType: string;
  type: 'reference' | 'child';
}

export interface GeneratedAssets {
  headerBannerUrl?: string; // 16:9
  progressIllustrationUrl?: string; // 4:1
  checkboxOutlineUrl?: string; // Small icon
  checkboxFilledUrl?: string; // Small icon
  stickerSheetUrl?: string; // A4 Sheet image
  certificateBadgeUrl?: string; // 1:1 Badge
  certificateCornerUrl?: string; // Corner element
}

export type OutputType = 'weekly_chart' | 'chore_tracker' | 'sticker_sheet' | 'certificate' | 'flip_cards';

// Layout options - how the chart elements are arranged
export type LayoutStyle = 'immersive' | 'classic' | 'minimal' | 'portrait';

// Mood/vibe options - the feel of the generated images
export type MoodStyle = 'adventure' | 'cozy' | 'magical' | 'playful';

// Character placement options
export type CharacterPosition = 'right' | 'left' | 'center' | 'scattered';

export interface StylePreset {
  layout: LayoutStyle;
  mood: MoodStyle;
  characterPosition: CharacterPosition;
}

export const LAYOUT_OPTIONS: { id: LayoutStyle; label: string; desc: string; icon: string }[] = [
  { id: 'immersive', label: 'Immersive', desc: 'Full background scene with characters', icon: '🌊' },
  { id: 'classic', label: 'Classic', desc: 'Clean header banner, light background', icon: '📋' },
  { id: 'minimal', label: 'Minimal', desc: 'Simple, less busy, focus on tasks', icon: '✨' },
  { id: 'portrait', label: 'Portrait', desc: 'Optimized for phone screens', icon: '📱' },
];

export const MOOD_OPTIONS: { id: MoodStyle; label: string; desc: string; icon: string }[] = [
  { id: 'adventure', label: 'Adventure', desc: 'Action poses, dynamic "Mission Log" feel', icon: '🚀' },
  { id: 'cozy', label: 'Cozy', desc: 'Calm, home environment, nurturing', icon: '🏠' },
  { id: 'magical', label: 'Magical', desc: 'Sparkles, fantasy, enchanted feel', icon: '🪄' },
  { id: 'playful', label: 'Playful', desc: 'Bright, energetic, celebration vibes', icon: '🎉' },
];

export const CHARACTER_POSITION_OPTIONS: { id: CharacterPosition; label: string; icon: string }[] = [
  { id: 'right', label: 'Right Side', icon: '➡️' },
  { id: 'left', label: 'Left Side', icon: '⬅️' },
  { id: 'center', label: 'Center', icon: '⬆️' },
  { id: 'scattered', label: 'Scattered', icon: '🎯' },
];

export const DEFAULT_STYLE_PRESET: StylePreset = {
  layout: 'immersive',
  mood: 'adventure',
  characterPosition: 'right',
};

// Page layout options - how many tasks per page
export type TasksPerPage = 4 | 6 | 8 | 10;

export const TASKS_PER_PAGE_OPTIONS: { id: TasksPerPage; label: string; desc: string }[] = [
  { id: 4, label: '4 Tasks', desc: 'Large tiles, best for younger children' },
  { id: 6, label: '6 Tasks', desc: 'Balanced size, most popular' },
  { id: 8, label: '8 Tasks', desc: 'Compact layout, fits more tasks' },
  { id: 10, label: '10 Tasks', desc: 'Most tasks, smaller tiles' },
];

export interface AppState {
  step: AppStep;
  profile: ChildProfile;
  referenceImages: UploadedImage[];
  childPhoto?: UploadedImage;
  styleData: StyleData;
  stylePreset: StylePreset;
  tasks: Task[];
  chores: Chore[];
  rewardGoal: RewardGoal;
  selectedOutputs: Set<OutputType>;
  generatedAssets: GeneratedAssets;
  generationProgress: number; // 0-100
  generationStatus: string; // Current action description
  tasksPerPage: TasksPerPage; // How many tasks to show per page
}

// Template system - save successful generations for reuse
export interface ChartTemplate {
  id: string;
  name: string;
  themeName: string; // e.g. "Octonauts", "Paw Patrol", "Bluey"
  createdAt: string;
  thumbnail?: string; // Small preview of headerBanner
  // Stored assets
  headerBannerUrl?: string;
  progressIllustrationUrl?: string;
  checkboxOutlineUrl?: string;
  checkboxFilledUrl?: string;
  stickerSheetUrl?: string;
  certificateBadgeUrl?: string;
  // Style info for regeneration
  styleDescription: string;
  // Reference images (optional - for regeneration)
  referenceImages?: UploadedImage[];
}
