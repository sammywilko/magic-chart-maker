
import { GoogleGenAI } from "@google/genai";
import { Task, Chore, UploadedImage, GeneratedAssets, StylePreset, LayoutStyle, MoodStyle, CharacterPosition } from "../types";

// Model configuration
const TEXT_MODEL = 'gemini-2.5-flash';           // For analysis/text generation
const IMAGE_MODEL = 'gemini-3-pro-image-preview'; // Nano Banana Pro for image generation

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

// --- HELPERS FOR STYLE PRESETS ---
const getMoodPrompt = (mood: MoodStyle): string => {
  switch (mood) {
    case 'adventure':
      return 'DYNAMIC and EXCITING atmosphere. Action poses, sense of movement, "Mission Log" adventure feel. Characters look ready for action!';
    case 'cozy':
      return 'WARM and NURTURING atmosphere. Calm, home-like environment. Soft lighting, comfortable feeling. Characters look happy and relaxed.';
    case 'magical':
      return 'ENCHANTED and WHIMSICAL atmosphere. Sparkles, glowing effects, fantasy elements. Dreamy, mystical feeling with magical particles.';
    case 'playful':
      return 'BRIGHT and ENERGETIC atmosphere. Celebration vibes, confetti, fun patterns. Characters look excited and joyful!';
    default:
      return '';
  }
};

const getLayoutPrompt = (layout: LayoutStyle): { aspectRatio: string; composition: string } => {
  switch (layout) {
    case 'immersive':
      return {
        aspectRatio: '16:9 (wide landscape)',
        composition: 'FULL SCENE that fills the ENTIRE frame edge-to-edge. Rich, detailed environment with themed details throughout (bubbles, stars, leaves, etc.). The scene should feel immersive, like stepping into the show.'
      };
    case 'classic':
      return {
        aspectRatio: '16:9 (wide landscape)',
        composition: 'Clean HEADER BANNER style. Characters prominently featured with a simple, uncluttered background. Title area clearly defined at top. Professional, polished look suitable for printing.'
      };
    case 'minimal':
      return {
        aspectRatio: '16:9 (wide landscape)',
        composition: 'SIMPLE and CLEAN design. Soft gradient or subtle pattern background. Characters featured but not overwhelming. Plenty of whitespace. Focus on clarity over detail.'
      };
    case 'portrait':
      return {
        aspectRatio: '9:16 (tall portrait, optimized for phones)',
        composition: 'VERTICAL layout optimized for mobile screens. Characters at top, with space below for content. Scene should work well when scrolling on a phone.'
      };
    default:
      return { aspectRatio: '16:9', composition: '' };
  }
};

const getCharacterPositionPrompt = (position: CharacterPosition): string => {
  switch (position) {
    case 'right':
      return 'Position 2-3 main characters on the RIGHT SIDE of the image, leaving LEFT SIDE more open for overlay content.';
    case 'left':
      return 'Position 2-3 main characters on the LEFT SIDE of the image, leaving RIGHT SIDE more open for overlay content.';
    case 'center':
      return 'Position the main characters in the CENTER TOP area, like a movie poster. Leave bottom half more open for overlay content.';
    case 'scattered':
      return 'Scatter smaller versions of the characters throughout the scene, creating a playful, dynamic composition with characters in different areas.';
    default:
      return '';
  }
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
    model: TEXT_MODEL,
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
    model: IMAGE_MODEL,
    contents: { parts: [...parts, { text: prompt }] },
  });

  return extractImage(response);
};

/**
 * COMPONENT: Header Banner / Full Background Scene
 * Designed to work as a full-bleed background for the chart
 */
export const generateHeaderBanner = async (
  childName: string,
  styleDescription: string,
  references: UploadedImage[],
  childPhoto?: UploadedImage,
  stylePreset?: StylePreset
): Promise<string | undefined> => {
  const ai = getAI();
  const parts = [...references.slice(0, 3).map(imageToPart)];
  if (childPhoto) parts.push(imageToPart(childPhoto));

  // Get style-specific prompts
  const layout = stylePreset?.layout || 'immersive';
  const mood = stylePreset?.mood || 'adventure';
  const charPosition = stylePreset?.characterPosition || 'right';

  const layoutInfo = getLayoutPrompt(layout);
  const moodPrompt = getMoodPrompt(mood);
  const positionPrompt = getCharacterPositionPrompt(charPosition);

  // Get title based on mood
  const titleText = mood === 'adventure' ? `${childName.toUpperCase()}'S MISSION LOG` :
                    mood === 'cozy' ? `${childName.toUpperCase()}'S ROUTINE` :
                    mood === 'magical' ? `${childName.toUpperCase()}'S MAGICAL CHART` :
                    `${childName.toUpperCase()}'S SUPER CHART`;

  const prompt = `
    Create a BACKGROUND illustration for a children's chore chart.

    **ART STYLE**: ${styleDescription}

    **MOOD/ATMOSPHERE**: ${moodPrompt}

    **COMPOSITION**:
    ${layoutInfo.composition}
    ${positionPrompt}
    - Characters should be full-body, not cropped, in poses matching the mood
    - Create a COMPLETE ENVIRONMENT/WORLD from the theme (underwater scene, space station, forest, etc.)

    **LAYOUT**:
    - Aspect ratio: ${layoutInfo.aspectRatio}
    - Include a banner/title area with "${titleText}"
    - The title should look like a TV show logo or movie title, integrated into the scene
    - Leave space for overlay content (this is where chart panels will go)

    **REQUIREMENTS**:
    - Vibrant colors that match the theme
    - Soft lighting that works well with white text overlays
    - NO watermarks, NO borders, edge-to-edge scene
  `;

  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
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
    model: IMAGE_MODEL,
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
    model: IMAGE_MODEL,
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
    model: IMAGE_MODEL,
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
    model: IMAGE_MODEL,
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
    model: IMAGE_MODEL,
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
