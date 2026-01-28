import React, { useState } from 'react';
import { AppTab, UserState, Workout, BodyProfile } from './types';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import ClassesView from './components/ClassesView';
import RunView from './components/RunView';
import CommunityView from './components/CommunityView';
import ProgressView from './components/ProgressView';
import BodyScan from './components/BodyScan';
import Landing from './components/Landing';
import Auth from './components/Auth';
import SettingsView from './components/SettingsView';
import { generateWorkouts } from './services/geminiService';

const DEFAULT_WORKOUTS: Workout[] = [
  {
    id: '1',
    title: "Baseline Protocol",
    type: "Mechanical",
    duration: "30 min",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    description: "Your introductory protocol to the Base Matter ecosystem.",
    exercises: [
      { 
        name: "Good Morning", 
        description: "Hinge at the hips with controlled eccentric phase.", 
        duration: "30 sec", 
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400",
        equipment: ["Bodyweight", "Optional Barbell"],
        tips: ["Maintain neutral spine", "Engage posterior chain", "Avoid knee lockout"]
      },
      { 
        name: "Knee Hug", 
        description: "Dynamic decompression of the lumbar spine.", 
        duration: "30 sec", 
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400",
        equipment: ["None"],
        tips: ["Pull firmly to chest", "Engage core", "Keep opposite leg straight"]
      }
    ]
  }
];

type AppFlow = 'LANDING' | 'AUTH' | 'MAIN';

const App: React.FC = () => {
  const [flow, setFlow] = useState<AppFlow>('LANDING');
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [isScanning, setIsScanning] = useState(false);
  const [userState, setUserState] = useState<UserState>({
    isPrimed: true,
    currentWorkouts: DEFAULT_WORKOUTS
  });

  const handleScanComplete = async (profile: BodyProfile) => {
    setIsScanning(false);
    const workouts = await generateWorkouts(profile);
    setUserState(prev => ({
      ...prev,
      profile,
      currentWorkouts: workouts.length > 0 ? workouts : DEFAULT_WORKOUTS
    }));
  };

  const handleSignOut = () => {
    setFlow('LANDING');
    setActiveTab(AppTab.HOME);
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.HOME: return <Dashboard userState={userState} onScanRequest={() => setIsScanning(true)} />;
      case AppTab.CLASSES: return <ClassesView />;
      case AppTab.RUN: return <RunView />;
      case AppTab.COMMUNITY: return <CommunityView />;
      case AppTab.PROGRESS: return <ProgressView />;
      case AppTab.SETTINGS: return <SettingsView userState={userState} onSignOut={handleSignOut} />;
      default: return <Dashboard userState={userState} onScanRequest={() => setIsScanning(true)} />;
    }
  };

  if (flow === 'LANDING') {
    return <Landing onInitialize={() => setFlow('AUTH')} />;
  }

  if (flow === 'AUTH') {
    return <Auth onAuthenticated={() => setFlow('MAIN')} onBack={() => setFlow('LANDING')} />;
  }

  return (
    <div className="min-h-screen max-w-md mx-auto relative overflow-x-hidden bg-black selection:bg-[#ccff00]/30">
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-[#ccff00]/5 blur-[120px] pointer-events-none"></div>
      <main className="relative z-10">
        {renderContent()}
      </main>
      {isScanning && <BodyScan onComplete={handleScanComplete} onCancel={() => setIsScanning(false)} />}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="h-safe-bottom"></div>
    </div>
  );
};

export default App;