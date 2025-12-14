
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

export interface AppState {
  step: AppStep;
  profile: ChildProfile;
  referenceImages: UploadedImage[];
  childPhoto?: UploadedImage;
  styleData: StyleData;
  tasks: Task[];
  chores: Chore[];
  rewardGoal: RewardGoal;
  selectedOutputs: Set<OutputType>;
  generatedAssets: GeneratedAssets;
  generationProgress: number; // 0-100
  generationStatus: string; // Current action description
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
