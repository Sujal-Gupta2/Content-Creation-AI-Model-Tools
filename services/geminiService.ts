
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";

// Creating AI instance inside functions to ensure latest API_KEY from process.env is used
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  // General text generation with optional thinking
  generateText: async (prompt: string, options: { systemInstruction?: string; useThinking?: boolean } = {}) => {
    const ai = getAI();
    const model = options.useThinking ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
    const config: any = {
      systemInstruction: options.systemInstruction,
    };

    if (options.useThinking) {
      config.thinkingConfig = { thinkingBudget: 32768 };
    } else {
      config.thinkingConfig = { thinkingBudget: 0 };
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config,
    });
    return response.text;
  },

  // Research mode with grounding and structured output
  researchTopic: async (topic: string) => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform an exhaustive research on the following topic: "${topic}". 
      Provide:
      1. A high-level executive summary.
      2. Key data points and statistics.
      3. Current trends (2024-2025).
      4. A list of primary sources.
      
      Format your response with clear headers and bullet points.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    const text = response.text || "";
    const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { text, grounding };
  },

  // Image generation using gemini-3-pro-image-preview
  generateImage: async (prompt: string, size: "1K" | "2K" | "4K" = "1K") => {
    const ai = getAI();
    // Enhanced prompt for better marketing quality
    const enhancedPrompt = `High-end professional marketing photography, ${prompt}, cinematic lighting, 8k resolution, commercial aesthetic, clean composition.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: enhancedPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: size
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  },

  // Video generation using Veo
  generateVideo: async (prompt: string, duration: '5s' | '120s') => {
    const ai = getAI();
    const model = duration === '5s' ? 'veo-3.1-fast-generate-preview' : 'veo-3.1-generate-preview';
    
    // For 5s posts, we emphasize a "loopable" cinematic feel
    const enhancedPrompt = duration === '5s' 
      ? `Cinematic loopable motion, ${prompt}, high-speed slow-motion, vibrant colors, premium commercial feel.` 
      : `Full cinematic narrative sequence, ${prompt}, professional color grading, ultra-detailed textures, 4k.`;

    let operation = await ai.models.generateVideos({
      model,
      prompt: enhancedPrompt,
      config: {
        numberOfVideos: 1,
        resolution: duration === '5s' ? '720p' : '1080p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
};
