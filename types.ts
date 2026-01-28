export enum AppTab {
  HOME = 'home',
  CLASSES = 'classes',
  RUN = 'run',
  COMMUNITY = 'community',
  PROGRESS = 'progress',
  SETTINGS = 'settings'
}

export interface Exercise {
  name: string;
  description: string;
  duration: string;
  image: string;
  equipment?: string[];
  tips?: string[];
}

export interface Workout {
  id: string;
  title: string;
  type: string;
  duration: string;
  image: string;
  description?: string;
  exercises: Exercise[];
}

export interface BodyProfile {
  bodyType: string;
  suggestedFocus: string[];
  estimatedFatMass?: string;
  postureAnalysis: string;
  personalizedMessage: string;
}

export interface UserState {
  isPrimed: boolean;
  profile?: BodyProfile;
  lastWorkoutDate?: string;
  currentWorkouts: Workout[];
}

export interface AnalysisResult {
  insight: string;
  recommendation: string;
  readiness: number;
}