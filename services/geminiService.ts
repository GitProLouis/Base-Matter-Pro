
import { GoogleGenAI, Type } from "@google/genai";
import { BodyProfile, Workout, AnalysisResult } from "../types";

export const analyzeBodyImage = async (base64Image: string): Promise<BodyProfile> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Act as an elite fitness coach and physiotherapist. Analyze the provided image of a user (body scan).
    Assess their physical structure, estimated body composition, and posture.
    Provide a professional, motivating summary.
    
    Return the response in JSON format.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { text: prompt },
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          bodyType: { type: Type.STRING },
          suggestedFocus: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          estimatedFatMass: { type: Type.STRING },
          postureAnalysis: { type: Type.STRING },
          personalizedMessage: { type: Type.STRING }
        },
        required: ["bodyType", "suggestedFocus", "postureAnalysis", "personalizedMessage"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateWorkouts = async (profile: BodyProfile): Promise<Workout[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  const prompt = `
    Based on this body profile: ${JSON.stringify(profile)}, 
    generate 6 highly specific workout sessions categorized as "Cardio", "Strength", or "Flexibility". 
    For each workout, provide 4-5 specific exercises. 
    Include "Equipment Needed" as a list and 3 technical "Tips & Techniques" bullet points for each exercise.
    Make the exercises relevant to the user's suggested focus: ${profile.suggestedFocus.join(', ')}.
    Include descriptive names and technical instructions for each exercise.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            type: { type: Type.STRING, description: "Must be one of: Cardio, Strength, Flexibility" },
            duration: { type: Type.STRING },
            image: { type: Type.STRING },
            description: { type: Type.STRING },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  image: { type: Type.STRING },
                  equipment: { type: Type.ARRAY, items: { type: Type.STRING } },
                  tips: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["name", "description", "duration", "image", "equipment", "tips"]
              }
            }
          },
          required: ["id", "title", "type", "duration", "image", "exercises"]
        }
      }
    }
  });

  const workouts = JSON.parse(response.text || '[]');
  return workouts.map((w: Workout, i: number) => ({
    ...w,
    image: `https://picsum.photos/800/1000?sig=${i}`,
    exercises: w.exercises.map((e, j) => ({
      ...e,
      image: `https://picsum.photos/400/300?sig=${i}${j}`
    }))
  }));
};

export const generateMusicRecommendation = async (workoutTitle: string, type: string): Promise<{ track: string, artist: string, bpm: number }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Generate a high-performance audio track recommendation for a workout called "${workoutTitle}" of type "${type}".
    The name should sound technical, electronic, and high-intensity.
    Return JSON with "track", "artist", and "bpm".
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          track: { type: Type.STRING },
          artist: { type: Type.STRING },
          bpm: { type: Type.NUMBER }
        },
        required: ["track", "artist", "bpm"]
      }
    }
  });

  return JSON.parse(response.text || '{"track": "Neural Drift", "artist": "Base Matter AI", "bpm": 128}');
};

export const analyzeGoals = async (query: string, profile?: BodyProfile): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = "You are the Base Matter Central Intelligence, a technical, highly precise human performance AI. Analyze user fitness queries with clinical precision but motivational edge.";
  
  const response = await ai.models.generateContent({
    model,
    contents: `User Query: ${query}\nUser Profile Data: ${JSON.stringify(profile || 'None')}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          insight: { type: Type.STRING, description: "Deep physiological insight about the query." },
          recommendation: { type: Type.STRING, description: "Direct technical recommendation." },
          readiness: { type: Type.NUMBER, description: "Calculated readiness score 0-100." }
        },
        required: ["insight", "recommendation", "readiness"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
