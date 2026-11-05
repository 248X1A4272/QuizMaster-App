import React, { useState, useEffect } from 'react';
import { useQuiz, ScreenName } from '../context/QuizContext';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  RotateCw,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Palette,
  Home,
  BookOpen,
  PlusCircle,
  History,
  Code2,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const {
    currentScreen,
    setCurrentScreen,
    isDarkMode,
    toggleDarkMode,
    soundEnabled,
    toggleSound,
    deviceOrientation,
    toggleOrientation,
    isDeviceFrame,
    toggleDeviceFrame,
    seedColor,
    setSeedColor,
  } = useQuiz();

  const [currentTime, setCurrentTime] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  const isLandscape = deviceOrientation === 'landscape';

  const navItems: { screen: ScreenName; label: string; icon: React.ElementType }[] = [
    { screen: 'home', label: 'Categories', icon: Home },
    { screen: 'question_bank', label: 'Bank', icon: BookOpen },
    { screen: 'add_question', label: 'Add Q', icon: PlusCircle },
    { screen: 'history', label: 'Scores', icon: History },
    { screen: 'flutter_code', label: 'Flutter', icon: Code2 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-start p-2 sm:p-4 lg:p-6 transition-colors">
      {/* Top Device Control Deck */}
      <header className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm mb-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-indigo-600/30">
            QM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                QuizMaster
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium">
                Android / Flutter
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Material 3 Quiz App with Provider Architecture & OpenTDB
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Frame Toggle */}
          <button
            onClick={toggleDeviceFrame}
            className={`p-2 rounded-xl text-xs flex items-center gap-1.5 border transition-all ${
              isDeviceFrame
                ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
            title="Toggle Android Device Frame"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden md:inline font-medium text-[11px]">
              {isDeviceFrame ? 'Phone View' : 'Full Width'}
            </span>
          </button>

          {/* Orientation Rotate */}
          {isDeviceFrame && (
            <button
              onClick={toggleOrientation}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 text-xs flex items-center gap-1.5 transition-colors"
              title="Rotate Device (Portrait / Landscape)"
            >
              <RotateCw className="w-4 h-4" />
              <span className="hidden md:inline font-medium text-[11px]">
                {isLandscape ? 'Landscape' : 'Portrait'}
              </span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl text-xs flex items-center gap-1.5 border transition-all ${
              soundEnabled
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-600 dark:text-rose-400'
            }`}
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 text-xs flex items-center gap-1.5 transition-colors"
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </header>

      {/* Main Canvas Container */}
      <div className="w-full flex justify-center items-start">
        {isDeviceFrame ? (
          /* Android Smartphone Shell */
          <div
            className={`relative transition-all duration-300 ease-out bg-slate-900 p-3 sm:p-3.5 rounded-[44px] shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50 ${
              isLandscape
                ? 'w-[760px] max-w-full h-[460px]'
                : 'w-[410px] max-w-full min-h-[760px] h-[86vh]'
            }`}
          >
            {/* Screen Inner Bezel */}
            <div className="relative w-full h-full bg-slate-50 dark:bg-slate-950 rounded-[34px] overflow-hidden flex flex-col border border-slate-800">
              {/* Android Top Status Bar */}
              <div className="h-8 w-full flex items-center justify-between px-6 pt-1 select-none text-[12px] font-semibold tracking-tight text-slate-700 dark:text-slate-300 shrink-0 z-30">
                <span className="font-mono text-xs">{currentTime}</span>

                {/* Camera Punch Hole */}
                <div className="w-4 h-4 rounded-full bg-slate-950 ring-2 ring-slate-800/80 mx-auto" />

                {/* Status Indicators */}
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <Signal className="w-3.5 h-3.5" />
                  <Wifi className="w-3.5 h-3.5" />
                  <div className="flex items-center gap-0.5">
                    <span className="text-[10px] font-mono">100%</span>
                    <Battery className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Scrollable Screen Content */}
              <div className="flex-1 overflow-y-auto px-4 py-3 select-none scrollbar-thin">
                {children}
              </div>

              {/* Android Fixed Bottom Navigation Bar (Thumb Zone) */}
              {currentScreen !== 'quiz' && (
                <div className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentScreen === item.screen;

                    return (
                      <button
                        key={item.screen}
                        onClick={() => setCurrentScreen(item.screen)}
                        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                          isActive
                            ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                            isActive
                              ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400'
                              : 'text-slate-500'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] mt-0.5">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Android Gesture Navigation Pill */}
              <div className="h-4 w-full flex items-center justify-center bg-white dark:bg-slate-900 shrink-0">
                <div className="w-32 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              </div>
            </div>
          </div>
        ) : (
          /* Full Viewport Layout */
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm min-h-[720px] flex flex-col">
            <div className="flex-1">{children}</div>

            {/* Bottom Nav Bar in Full Viewport */}
            {currentScreen !== 'quiz' && (
              <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.screen;

                  return (
                    <button
                      key={item.screen}
                      onClick={() => setCurrentScreen(item.screen)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
