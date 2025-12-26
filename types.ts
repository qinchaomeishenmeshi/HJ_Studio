
// Shared types for the application
export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export interface GenerationParams {
  prompt: string;
  negativePrompt: string;
  aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
}
