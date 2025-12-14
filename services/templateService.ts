import { ChartTemplate, GeneratedAssets, UploadedImage } from '../types';

const TEMPLATES_STORAGE_KEY = 'magic-chart-templates';

// Get all saved templates
export const getTemplates = (): ChartTemplate[] => {
  const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

// Save a new template
export const saveTemplate = (
  name: string,
  themeName: string,
  assets: GeneratedAssets,
  styleDescription: string,
  referenceImages?: UploadedImage[]
): ChartTemplate => {
  const templates = getTemplates();

  const newTemplate: ChartTemplate = {
    id: `template-${Date.now()}`,
    name,
    themeName,
    createdAt: new Date().toISOString(),
    thumbnail: assets.headerBannerUrl, // Use header as thumbnail
    headerBannerUrl: assets.headerBannerUrl,
    progressIllustrationUrl: assets.progressIllustrationUrl,
    checkboxOutlineUrl: assets.checkboxOutlineUrl,
    checkboxFilledUrl: assets.checkboxFilledUrl,
    stickerSheetUrl: assets.stickerSheetUrl,
    certificateBadgeUrl: assets.certificateBadgeUrl,
    styleDescription,
    referenceImages: referenceImages?.slice(0, 3), // Store up to 3 references
  };

  templates.unshift(newTemplate); // Add to beginning
  localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));

  return newTemplate;
};

// Delete a template
export const deleteTemplate = (id: string): void => {
  const templates = getTemplates().filter(t => t.id !== id);
  localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
};

// Get a single template by ID
export const getTemplate = (id: string): ChartTemplate | undefined => {
  return getTemplates().find(t => t.id === id);
};

// Convert template assets back to GeneratedAssets format
export const templateToAssets = (template: ChartTemplate): GeneratedAssets => {
  return {
    headerBannerUrl: template.headerBannerUrl,
    progressIllustrationUrl: template.progressIllustrationUrl,
    checkboxOutlineUrl: template.checkboxOutlineUrl,
    checkboxFilledUrl: template.checkboxFilledUrl,
    stickerSheetUrl: template.stickerSheetUrl,
    certificateBadgeUrl: template.certificateBadgeUrl,
  };
};

// Import a template from a file (JSON)
export const importTemplate = (jsonString: string): ChartTemplate | null => {
  try {
    const template = JSON.parse(jsonString) as ChartTemplate;
    // Validate required fields
    if (!template.id || !template.name || !template.themeName) {
      return null;
    }
    // Assign new ID to avoid conflicts
    template.id = `template-${Date.now()}`;
    template.createdAt = new Date().toISOString();

    const templates = getTemplates();
    templates.unshift(template);
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));

    return template;
  } catch {
    return null;
  }
};

// Export a template as JSON string
export const exportTemplate = (id: string): string | null => {
  const template = getTemplate(id);
  if (!template) return null;
  return JSON.stringify(template, null, 2);
};
