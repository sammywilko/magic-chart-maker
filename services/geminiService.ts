
import { GoogleGenAI } from "@google/genai";
import { Task, Chore, UploadedImage, GeneratedAssets } from "../types";

const getAI = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) throw new Error("API Key not found. Set VITE_API_KEY in environment variables.");
  return new GoogleGenAI({ apiKey });
};

const imageToPart = (img: UploadedImage) => ({
  inlineData: {
    mimeType: img.mimeType,
    data: img.data,
  }
});

// --- HELPER FOR SUBJECT ---
const getSubjectPrompt = (childPhoto?: UploadedImage) => {
  if (childPhoto) {
    return `
      A custom character based on the CHILD'S PHOTO provided (the last image in the list).
      Transform the child from the photo into a character that fits perfectly into the art style of the REFERENCE images.
      Maintain the child's key features (hair color/style, glasses, skin tone) but adapted to the cartoon world.
      Do NOT just paste the photo face. DRAW the child as a cartoon character in the target style.
    `;
  }
  return "The main character seen in the reference images.";
};

/**
 * Step 1: Analyze Style
 */
export const extractStyleFromReferences = async (images: UploadedImage[]): Promise<string> => {
  const ai = getAI();
  const imageParts = images.map(imageToPart);

  const prompt = `
    Analyze these reference images in extreme detail for an art team. 
    I need to recreate this EXACT style for a children's chore chart system.
    
    Describe:
    1. Line quality (weight, texture, color).
    2. Color palette (specific HSL/vibes, shading style).
    3. Character design language (proportions, eye style).
    4. Background rendering style.
    
    Return a concise but comprehensive descriptive paragraph.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [...imageParts, { text: prompt }] },
  });

  return response.text || "A colorful, friendly children's animation style.";
};

/**
 * COMPONENT: Task Tile (Small 1:1)
 * Optimized for small size, no text.
 */
export const generateTaskTile = async (
  title: string,
  styleDescription: string,
  references: UploadedImage[],
  childPhoto?: UploadedImage
): Promise<string | undefined> => {
  const ai = getAI();
  const parts = [...references.slice(0, 3).map(imageToPart)];
  if (childPhoto) parts.push(imageToPart(childPhoto));

  const prompt = `
    Create a SMALL, SIMPLE square icon illustration in [THEME STYLE].
    
    **STYLE**: ${styleDescription}
    **SUBJECT**: ${getSubjectPrompt(childPhoto)}
    **ACTION**: Performing the task "${title}".
    
    **COMPOSITION**: 
    - MID-SHOT framing.
    - KEEP HEAD AND BODY FULLY INSIDE FRAME with a safety margin. 
    - DO NOT CROP the top of the head.
    - Centered composition.
    
    **REQUIREMENTS**:
    - Minimal or no background detail (must read clearly at 60x60px).
    - NO TEXT.
    - Simple, clear, iconic representation.
    
    Aspect Ratio: 1:1
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [...parts, { text: prompt }] },
  });

  return extractImage(response);
};

/**
 * COMPONENT: Header Banner (16:9)
 */
export const generateHeaderBanner = async (
  childName: string,
  styleDescription: string,
  references: UploadedImage[],
  childPhoto?: UploadedImage
): Promise<string | undefined> => {
  const ai = getAI();
  const parts = [...references.slice(0, 3).map(imageToPart)];
  if (childPhoto) parts.push(imageToPart(childPhoto));

  const prompt = `
    Create a panoramic header banner illustration (16:9 ratio).
    
    **STYLE**: ${styleDescription}
    **SUBJECT**: ${getSubjectPrompt(childPhoto)} along with other characters from the theme.
    **SCENE**: An exciting group action pose or a beautiful wide shot of the theme's world.
    
    **TEXT**:
    Include the title "${childName.toUpperCase()}'S ADVENTURE CHART" as a decorative, integrated design element.
    Ensure text is CENTERED and not cut off by edges.
    The text should look like a movie title or logo within the scene.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [...parts, { text: prompt }] },
  });

  return extractImage(response);
};

/**
 * COMPONENT: Progress Bar Illustration (4:1)
 */
export const generateProgressBar = async (
  goalName: string,
  styleDescription: string,
  references: UploadedImage[]
): Promise<string | undefined> => {
  const ai = getAI();
  const parts = [...references.slice(0, 3).map(imageToPart)];

  const prompt = `
    Create a wide aspect ratio (4:1) illustration that serves as a progress meter background.
    
    **STYLE**: ${styleDescription}
    **CONCEPT**: A container or path that can be "filled".
    Examples: A long treasure chest filled with gold, a path to a castle, a shelf for trophies.
    
    The right side should feature the goal: "${goalName}" (visually represented if possible).
    It should look good when partially covered by a progress bar overlay.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [...parts, { text: prompt }] },
  });

  return extractImage(response);
};

/**
 * COMPONENT: Themed UI Elements (Checkboxes)
 */
export const generateThemedCheckbox = async (
  styleDescription: string,
  references: UploadedImage[],
  filled: boolean
): Promise<string | undefined> => {
  const ai = getAI();
  const parts = [...references.slice(0, 3).map(imageToPart)];

  const prompt = `
    Create a single small UI icon in [THEME STYLE].
    Object: A theme-appropriate collection item (e.g., a shell, a star, a bone, a coin).
    State: ${filled ? "FILLED IN, COLORFUL, GLOWING" : "SIMPLE OUTLINE ONLY, UNCOLORED"}.
    
    Must be on a plain white background (easy to mask).
    Simple shape.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [...parts, { text: prompt }] },
  });

  return extractImage(response);
};

/**
 * COMPONENT: Sticker Sheet (A4)
 */
export const generateStickerSheet = async (
  styleDescription: string,
  references: UploadedImage[]
): Promise<string | undefined> => {
  const ai = getAI();
  const parts = [...references.slice(0, 3).map(imageToPart)];

  const prompt = `
    Create a sticker sheet design on a white background.
    
    **STYLE**: ${styleDescription}
    **CONTENT**: 
    A grid of circular stickers (approx 20 stickers).
    - Row 1: "SUPER STAR", "GREAT JOB" in theme typography.
    - Row 2-4: Cute character faces and theme items (no text).
    
    High resolution, clean separation between items, white background.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [...parts, { text: prompt }] },
  });

  return extractImage(response);
};

/**
 * COMPONENT: Certificate Badge
 */
export const generateCertificateBadge = async (
  styleDescription: string,
  references: UploadedImage[]
): Promise<string | undefined> => {
  const ai = getAI();
  const parts = [...references.slice(0, 3).map(imageToPart)];

  const prompt = `
    Create a decorative Award Badge / Seal in [THEME STYLE].
    Text on badge: "STAR OF THE WEEK".
    Shape: Circular or Shield-like.
    Look: Premium, gold accents, but matching the cartoon style.
    Background: White/Clean.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [...parts, { text: prompt }] },
  });

  return extractImage(response);
};

/**
 * COMPONENT: Celebration Tile for Flip Cards
 */
export const generateCelebrationTile = async (
  taskTitle: string,
  styleDescription: string,
  references: UploadedImage[],
  childPhoto?: UploadedImage
): Promise<string | undefined> => {
  const ai = getAI();
  const parts = [...references.slice(0, 3).map(imageToPart)];
  if (childPhoto) parts.push(imageToPart(childPhoto));

  const prompt = `
    Create a square celebration illustration in [THEME STYLE].
    
    **SUBJECT**: ${getSubjectPrompt(childPhoto)} looking incredibly happy/proud.
    **ACTION**: Celebrating finishing "${taskTitle}".
    **ELEMENTS**: Confetti, stars, sparkles, or a big checkmark.
    **TEXT**: "DONE!" or "GREAT JOB!" integrated into the image.
    
    Aspect Ratio: 1:1
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [...parts, { text: prompt }] },
  });

  return extractImage(response);
};

// Helper
const extractImage = (response: any) => {
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return undefined;
};
