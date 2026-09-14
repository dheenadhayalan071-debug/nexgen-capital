import React, { useState } from 'react';
import { Flame, Heart, Zap, Lock, Map, Trophy, LayoutDashboard, User, X, Check, Eye, Code, Link as LinkIcon, Send, Shield, ChevronRight, Github } from 'lucide-react';

export default function App() {
  // --- HIGH-LEVEL APP STATE ---
  const [appState, setAppState] = useState('onboarding'); // 'onboarding' | 'main'
  const [onboardingStep, setOnboardingStep] = useState('hook'); // 'hook' | 'intent' | 'game' | 'gate'

  // --- PLATFORM STATE ---
  const [activeTab, setActiveTab] = useState('sprint');
  const [activeModal, setActiveModal] = useState(null);

  // Economy State
  const [hearts, setHearts] = useState(3);
  const [coins, setCoins] = useState(150); 
  const [streak, setStreak] = useState(0);
  const [streakFreezes, setStreakFreezes] = useState(0);

  // Node States
  const [node1Completed, setNode1Completed] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);

  const [node2Completed, setNode2Completed] = useState(false);
  const [node2Phase, setNode2Phase] = useState('intro');

  const [node3Completed, setNode3Completed] = useState(false);
  const [bossCompleted, setBossCompleted] = useState(false);
  const [launchUrl, setLaunchUrl] = useState("");

  // VC State
  const [vcMessage, setVcMessage] = useState("");
  const [vcStatus, setVcStatus] = useState("neutral");

  // --- ONBOARDING LOGIC ---
  const handleOnboardingAnswer = (isCorrect) => {
    if (isCorrect) {
      setOnboardingStep('gate');
    } else {
      // Brutal feedback if they fail the intro, but push them forward anyway to learn
      alert("Wrong. Dog dream translation is a scam. We have a lot of work to do. Let's get you in the system.");
      setOnboardingStep('gate');
    }
  };

  const handleAuth = () => {
    // Simulates GitHub OAuth and transitions to the main platform
    setAppState('main');
  };


  // --- MAIN APP LOGIC (Identical to previous build) ---
  const cards = [
    { id: 1, text: "An AI app that recommends Netflix shows based on your current mood.", type: "vitamin" },
    { id: 2, text: "A digital habit tracker that awards badges for drinking water.", type: "vitamin" },
    { id: 3, text: "A one-click formatting tool that fixes broken citations at 11:30 PM before a midnight deadline.", type: "painkiller" }
  ];

  const openNode1 = () => {
    if (node1Completed) return;
    setVcMessage("Swipe Right on the Painkiller. Swipe Left on the Vitamin.");
    setVcStatus("neutral");
    setActiveModal('node1');
  };

  const handleSwipe = (direction) => {
    const currentCard = cards[cardIndex];
    if (direction === 'right') {
      if (currentCard.type === 'painkiller') {
        setVcMessage("Execution logged. That's a bleeding neck.");
        setVcStatus('success');
        setCoins(c => c + 50);
        setStreak(s => (s === 0 ? 1 : s)); 
        setNode1Completed(true);
        setTimeout(() => setActiveModal(null), 2000);
      } else {
        setVcMessage("Nobody pays to be reminded to drink water. Heart removed.");
        setVcStatus('error');
        setHearts(h => Math.max(0, h - 1));
      }
    } else {
      if (currentCard.type === 'vitamin') {
        setVcMessage("Good. You avoided a trap.");
        setVcStatus('success');
        setTimeout(() => {
          setCardIndex(i => i + 1);
          setVcStatus('neutral');
          setVcMessage("Next. Swipe Right on the Painkiller. Swipe Left on the Vitamin.");
        }, 1200);
      } else {
        setVcMessage("You just rejected a massive pain point. Heart removed.");
        setVcStatus('error');
        setHearts(h => Math.max(0, h - 1));
      }
    }
  };

  const openNode2 = () => {
    if (!node1Completed || node2Completed) return;
    setNode2Phase('intro');
    setVcMessage("People buy with their eyes. You have 3 seconds to look at the next screen.");
    setVcStatus("neutral");
    setActiveModal('node2');
  };

  const startFlash = () => {
    setNode2Phase('flash');
    setVcMessage("Memorize it. 3... 2... 1...");
    setTimeout(() => {
      setNode2Phase('question');
      setVcMessage("Time's up. What was the biggest conversion killer?");
    }, 3000);
  };

  const handleNode2Answer = (isCorrect) => {
    if (isCorrect) {
      setVcMessage("Correct. Confusion kills conversion.");
      setVcStatus('success');
      setCoins(c => c + 75);
      setNode2Completed(true);
      setTimeout(() => setActiveModal(null), 2000);
    } else {
      setVcMessage("Wrong. You're obsessed with aesthetics instead of revenue. Heart removed.");
      setVcStatus('error');
      setHearts(h => Math.max(0, h - 1));
    }
  };

  const openNode3 = () => {
    if (!node2Completed || node3Completed) return;
    setVcMessage("The UI looks good, but the Waitlist button is dead. Fix the logic block to capture the email.");
    setVcStatus("neutral");
    setActiveModal('node3');
  };

  const handleNode3Answer = (type) => {
    if (type === 'console' || type === 'alert') {
      setVcMessage(type === 'console' ? "Logging to the console doesn't pay the bills. Heart removed." : "A fake success alert? I should report you to the SEC. Heart removed.");
      setVcStatus('error');
      setHearts(h => Math.max(0, h - 1));
    } else if (type === 'database') {
      setVcMessage("Database connected. Email secured. Now we have a real business.");
      setVcStatus('success');
      setCoins(c => c + 100);
      setNode3Completed(true);
      setTimeout(() => setActiveModal(null), 2500);
    }
  };

  const openBossLevel = () => {
    if (!node3Completed || bossCompleted) return;
    setVcMessage("I don't fund private demos. Drop the public launch link below. LinkedIn, GitHub, or Google Docs only.");
    setVcStatus("neutral");
    setActiveModal('boss');
  };

  const handleBossSubmit = (e) => {
    e.preventDefault();
    const url = launchUrl.toLowerCase();
    if (!url.startsWith("http")) {
      setVcMessage("That is not a URL. Don't play games with me. Heart removed.");
      setVcStatus('error');
      setHearts(h => Math.max(0, h - 1));
      return;
    }
    const isWhitelisted = url.includes("linkedin.com") || url.includes("github.com") || url.includes("docs.google.com");
    if (isWhitelisted) {
      setVcMessage("Audit passed. The market can see you now. Welcome to the 1%.");
      setVcStatus('success');
      setCoins(c => c + 500);
      setStreak(s => s + 1);
      setBossCompleted(true);
      setTimeout(() => setActiveModal(null), 3000);
    } else {
      setVcMessage("Invalid domain. Your launch must be public on an approved platform. Heart removed.");
      setVcStatus('error');
      setHearts(h => Math.max(0, h - 1));
    }
  };

  const handleBuyFreeze = () => {
    if (coins >= 200) {
      setCoins(c => c - 200);
      setStreakFreezes(f => f + 1);
      setVcMessage("Smart move. A freeze bought is equity saved. Don't make a habit of it.");
      setVcStatus('success');
      setActiveModal('shopMessage');
    } else {
      setVcMessage("You're broke. Ship more nodes to earn Builder Coins. I don't run a charity.");
      setVcStatus('error');
      setActiveModal('shopMessage');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'sprint':
        return (
          <div className="w-full max-w-md px-6 flex flex-col items-center">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white">Zero-to-One Sprint</h2>
              <p className="text-gray-500 text-sm mt-1">Prove you can execute.</p>
            </div>

            <div className="relative flex flex-col items-center w-full py-8">
              <div className="absolute top-0 bottom-12 w-6 bg-gray-900 -z-10 rounded-full opacity-50"></div>

              {/* Node 1 */}
              <div onClick={openNode1} className={`relative flex flex-col items-center -translate-x-16 cursor-pointer z-10 ${node1Completed ? 'opacity-50' : 'group'}`}>
                <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transform transition-transform active:scale-95 ${node1Completed ? 'bg-gray-900 border-yellow-400' : 'bg-yellow-400 border-black shadow-[0_0_20px_rgba(251,255,0,0.4)]'}`}>
                  {node1Completed ? <Check size={32} className="text-yellow-400" /> : <Zap size={32} className="text-black" fill="currentColor" />}
                </div>
                <span className="mt-3 font-bold text-sm bg-black/80 px-2 rounded">The Bleeding Neck</span>
              </div>

              {/* Node 2 */}
              <div onClick={openNode2} className={`relative flex flex-col items-center translate-x-16 -mt-4 transition-all duration-500 z-10 ${node1Completed ? 'cursor-pointer opacity-100' : 'opacity-50'} ${node2Completed ? 'opacity-50' : ''}`}>
                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transform transition-transform ${!node1Completed ? 'bg-gray-900 border-black' : node2Completed ? 'bg-gray-900 border-yellow-400' : 'bg-yellow-400 border-black active:scale-95 shadow-[0_0_20px_rgba(251,255,0,0.4)]'}`}>
                  {node2Completed ? <Check size={24} className="text-yellow-400" /> : !node1Completed ? <Lock size={24} className="text-gray-600" /> : <Eye size={24} className="text-black" />}
                </div>
                <span className={`mt-3 font-bold text-sm bg-black/80 px-2 rounded ${node1Completed ? 'text-white' : 'text-gray-500'}`}>The 3-Second UI</span>
              </div>
              
              {/* Node 3 */}
              <div onClick={openNode3} className={`relative flex flex-col items-center -translate-x-16 -mt-4 transition-all duration-500 z-10 ${node2Completed ? 'cursor-pointer opacity-100' : 'opacity-50'} ${node3Completed ? 'opacity-50' : ''}`}>
                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transform transition-transform ${!node2Completed ? 'bg-gray-900 border-black' : node3Completed ? 'bg-gray-900 border-yellow-400' : 'bg-yellow-400 border-black active:scale-95 shadow-[0_0_20px_rgba(251,255,0,0.4)]'}`}>
                  {node3Completed ? <Check size={24} className="text-yellow-400" /> : !node2Completed ? <Lock size={24} className="text-gray-600" /> : <Code size={24} className="text-black" />}
                </div>
                <span className={`mt-3 font-bold text-sm bg-black/80 px-2 rounded ${node2Completed ? 'text-white' : 'text-gray-500'}`}>Wiring the Engine</span>
              </div>

              {/* Boss Level */}
              <div onClick={openBossLevel} className={`relative flex flex-col items-center mt-8 transition-all duration-700 z-10 ${node3Completed ? 'opacity-100 cursor-pointer' : 'opacity-50'}`}>
                <div className={`w-24 h-24 rounded-lg border-4 flex items-center justify-center transform transition-transform ${bossCompleted ? 'bg-yellow-400 border-black shadow-[0_0_40px_rgba(251,255,0,0.4)]' : node3Completed ? 'bg-red-600 border-red-400 shadow-[0_0_40px_rgba(255,0,60,0.6)] animate-pulse active:scale-95' : 'bg-red-950 border-red-500 shadow-[0_0_30px_rgba(255,0,60,0.2)]'}`}>
                  {bossCompleted ? <Trophy size={40} className="text-black" /> : node3Completed ? <Zap size={32} className="text-white" fill="currentColor" /> : <Lock size={32} className="text-red-500" />}
                </div>
                <span className={`mt-4 font-extrabold uppercase tracking-widest text-sm bg-black/80 px-2 rounded ${bossCompleted ? 'text-yellow-400' : 'text-red-500'}`}>Boss: Public Ship</span>
              </div>
            </div>
          </div>
        );
      case 'leaderboard':
        return (
          <div className="w-full max-w-md px-6 flex flex-col items-center animate-in fade-in duration-300">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white mb-8">Global Rank</h2>
            <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400 font-bold text-lg">1</span>
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">AJ</div>
                  <span className="font-bold">Aryan J.</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-400 font-bold"><Flame size={16} fill="currentColor"/> 24</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-950 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-bold text-lg">2</span>
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">SK</div>
                  <span className="font-bold">Sarah K.</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 font-bold"><Flame size={16} fill="currentColor"/> 18</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-950 border border-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-bold text-lg">42</span>
                  <div className="w-10 h-10 bg-yellow-400 text-black font-bold rounded-full flex items-center justify-center">YOU</div>
                  <span className="font-bold">You</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 font-bold"><Flame size={16} fill="currentColor"/> {streak}</div>
              </div>
            </div>
          </div>
        );
      case 'portfolio':
        return (
          <div className="w-full max-w-md px-6 flex flex-col items-center animate-in fade-in duration-300">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white mb-8">Proof of Work</h2>
            <div className="w-full flex flex-col gap-4">
              {bossCompleted ? (
                 <div className="bg-gray-900 border border-yellow-400/30 p-6 rounded-2xl flex flex-col gap-2">
                   <span className="text-yellow-400 text-[10px] font-bold uppercase tracking-wider">Zero-to-One Sprint</span>
                   <h3 className="font-bold text-lg">MVP Successfully Shipped</h3>
                   <a href={launchUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm flex items-center gap-1 mt-2 underline"><LinkIcon size={14}/> View Public Link</a>
                 </div>
              ) : (
                <div className="bg-gray-900/50 border border-gray-800 border-dashed p-12 rounded-2xl flex flex-col items-center text-center opacity-50">
                  <Lock size={32} className="text-gray-600 mb-4" />
                  <h3 className="font-bold">No Proof Yet</h3>
                  <p className="text-xs text-gray-500 mt-2">Defeat the Boss Level to build your portfolio.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="w-full max-w-md px-6 flex flex-col items-center animate-in fade-in duration-300">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white mb-8">HQ</h2>
            
            <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 shadow-inner">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-yellow-400 text-black rounded-full flex items-center justify-center font-bold text-xl border-2 border-black shadow-[0_0_15px_rgba(251,255,0,0.3)]">
                  YOU
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Builder_01</h3>
                  <p className="text-gray-400 text-sm font-mono mt-1">Novice Executioner</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 border-t border-gray-800 pt-6">
                <div className="flex flex-col items-center">
                  <Flame size={24} className="text-yellow-400 mb-1" fill="currentColor" />
                  <span className="font-bold text-lg text-white">{streak}</span>
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Streak</span>
                </div>
                <div className="flex flex-col items-center border-l border-r border-gray-800">
                  <Zap size={24} className="text-blue-400 mb-1" fill="currentColor" />
                  <span className="font-bold text-lg text-white">{coins}</span>
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Coins</span>
                </div>
                <div className="flex flex-col items-center">
                  <Shield size={24} className="text-indigo-400 mb-1" fill="currentColor" />
                  <span className="font-bold text-lg text-white">{streakFreezes}</span>
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Freezes</span>
                </div>
              </div>
            </div>

            <div className="w-full bg-black border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg text-white">The Black Market</h3>
                <div className="text-[10px] font-mono text-gray-500 border border-gray-800 px-2 py-1 rounded tracking-widest uppercase">VC Approved</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-700 rounded-xl hover:border-gray-600 transition-colors">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-indigo-900/30 rounded-full flex items-center justify-center border border-indigo-500/30 shrink-0">
                    <Shield size={20} className="text-indigo-400" fill="currentColor" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Streak Freeze</h4>
                    <p className="text-[10px] text-gray-400 mt-1 leading-tight">Protects your streak if you miss a day of execution.</p>
                  </div>
                </div>
                <button 
                  onClick={handleBuyFreeze}
                  className="bg-gray-950 hover:bg-gray-800 text-white py-2 px-4 rounded-lg flex flex-col items-center justify-center transition-colors active:scale-95 border border-gray-700 shrink-0 ml-2"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest mb-0.5">Buy</span>
                  <div className="flex items-center gap-1 text-xs text-blue-400 font-bold">
                    <Zap size={12} fill="currentColor" /> 200
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // ==========================================
  // RENDER CONTROLLER (App Router)
  // ==========================================

  if (appState === 'onboarding') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="w-full max-w-sm z-10 flex flex-col">
          
          {onboardingStep === 'hook' && (
            <div className="animate-in fade-in zoom-in duration-700">
              <h1 className="text-4xl font-extrabold tracking-tighter mb-6 uppercase text-white">
                School teaches you to <span className="text-gray-600 line-through">wait.</span><br/>
                We teach you to <span className="text-yellow-400">build.</span>
              </h1>
              <p className="text-gray-400 mb-12 text-sm leading-relaxed font-mono">
                The market doesn't care about your GPA. It cares about what you can ship.
              </p>
              <button 
                onClick={() => setOnboardingStep('intent')}
                className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                Prove It <ChevronRight size={18} />
              </button>
            </div>
          )}

          {onboardingStep === 'intent' && (
            <div className="animate-in slide-in-from-right duration-500">
              <h2 className="text-2xl font-bold mb-2">Why are you here?</h2>
              <p className="text-gray-500 text-sm mb-8">We don't do tourists. Choose your objective.</p>
              
              <div className="flex flex-col gap-3">
                <button onClick={() => setOnboardingStep('game')} className="w-full bg-gray-900 border border-gray-800 hover:border-gray-600 text-white py-4 px-6 rounded-xl text-left font-medium active:scale-95 transition-all">
                  I want to build a startup.
                </button>
                <button onClick={() => setOnboardingStep('game')} className="w-full bg-gray-900 border border-gray-800 hover:border-gray-600 text-white py-4 px-6 rounded-xl text-left font-medium active:scale-95 transition-all">
                  I need a real portfolio for college.
                </button>
                <button onClick={() => setOnboardingStep('game')} className="w-full bg-gray-900 border border-gray-800 hover:border-gray-600 text-white py-4 px-6 rounded-xl text-left font-medium active:scale-95 transition-all">
                  I'm just tired of boring classes.
                </button>
              </div>
            </div>
          )}

          {onboardingStep === 'game' && (
            <div className="animate-in slide-in-from-right duration-500">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-yellow-400 text-black font-bold font-mono text-xs rounded-full flex items-center justify-center">VC</div>
                 <div>
                   <h2 className="text-lg font-bold text-white">The VC is watching.</h2>
                   <p className="text-gray-400 text-xs">Which of these is a fake startup?</p>
                 </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <button onClick={() => handleOnboardingAnswer(true)} className="w-full bg-[#0a0a0a] border-2 border-gray-800 hover:border-yellow-400 text-white p-6 rounded-2xl text-left active:scale-95 transition-all flex flex-col gap-2">
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Option A</span>
                  <span className="font-medium text-lg">AI that translates your dog's dreams.</span>
                </button>
                
                <button onClick={() => handleOnboardingAnswer(false)} className="w-full bg-[#0a0a0a] border-2 border-gray-800 hover:border-yellow-400 text-white p-6 rounded-2xl text-left active:scale-95 transition-all flex flex-col gap-2">
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Option B</span>
                  <span className="font-medium text-lg">Invoicing software for freelancers.</span>
                </button>
              </div>
            </div>
          )}

          {onboardingStep === 'gate' && (
            <div className="animate-in slide-in-from-bottom duration-500 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center mb-6">
                <Check size={40} className="text-yellow-400" />
              </div>
              <h2 className="text-2xl font-extrabold mb-2 text-white">You have an eye for BS.</h2>
              <p className="text-gray-400 text-sm mb-10">That's a good start. Create your profile to save your equity and enter the arena.</p>
              
              <button 
                onClick={handleAuth}
                className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
              >
                <Github size={20} /> Authenticate via GitHub
              </button>
              <p className="text-[10px] text-gray-600 mt-4 uppercase tracking-widest">Takes 1 Click • No Passwords</p>
            </div>
          )}

        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN APP RENDER
  // ==========================================
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans relative overflow-hidden">
      
      {/* ECONOMY HEADER */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-gray-900 px-4 py-4 flex justify-between items-center relative animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-900 border border-gray-700 rounded flex items-center justify-center overflow-hidden">
             <span className="text-[10px] font-bold font-mono text-gray-400">VC</span>
          </div>
        </div>
        <div className="flex items-center gap-4 font-bold text-sm">
          <div className="flex items-center gap-1 text-yellow-400">
            <Flame size={18} fill="currentColor" />
            <span>{streak}</span>
          </div>
          <div className="flex items-center gap-1 text-blue-400">
            <Zap size={18} fill="currentColor" />
            <span>{coins}</span>
          </div>
          <div className="flex items-center gap-1 text-red-500">
            <Heart size={18} fill={hearts > 0 ? "currentColor" : "none"} />
            <span>{hearts}</span>
          </div>
        </div>
        {vcStatus === 'error' && <div className="absolute inset-0 bg-red-500/20 animate-pulse pointer-events-none"></div>}
      </header>

      {/* MAIN CONTENT ROUTER */}
      <main className="flex-1 overflow-y-auto pb-24 relative flex flex-col items-center pt-8 animate-in fade-in duration-500">
        {renderContent()}
      </main>

      {/* REUSABLE MODALS (Nodes & Shop message) */}
      {activeModal && activeModal !== 'shopMessage' && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-6 pointer-events-auto">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setActiveModal(null)}></div>
          
          <div className="relative w-full max-w-md bg-gray-950 border-t sm:border border-gray-800 rounded-t-3xl sm:rounded-3xl p-6 flex flex-col animate-in slide-in-from-bottom-full duration-300 min-h-[400px] max-h-[90vh] overflow-y-auto">
            
            <div className={`p-4 rounded-xl mb-6 border shrink-0 ${vcStatus === 'error' ? 'bg-red-950/30 border-red-900 text-red-200' : vcStatus === 'success' ? 'bg-yellow-900/20 border-yellow-700/50 text-yellow-200' : 'bg-gray-900 border-gray-700 text-gray-300'} text-sm leading-relaxed font-mono`}>
              <span className="font-bold uppercase tracking-wider block mb-1 text-[10px]">The VC Says:</span>
              {vcMessage}
            </div>

            {activeModal === 'node1' && (
              <div className="flex-1 flex flex-col">
                {cardIndex < cards.length && (
                  <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 aspect-square flex flex-col justify-center items-center text-center mb-8 shadow-2xl relative overflow-hidden">
                    <span className="text-gray-500 font-mono text-xs absolute top-4 left-4">Idea {cardIndex + 1}/{cards.length}</span>
                    <p className="text-lg font-medium text-white leading-relaxed">"{cards[cardIndex].text}"</p>
                  </div>
                )}
                {cardIndex < cards.length && (
                  <div className="flex gap-4 mt-auto">
                    <button onClick={() => handleSwipe('left')} className="flex-1 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white rounded-xl py-4 flex flex-col items-center justify-center gap-1 active:scale-95">
                      <X size={24} className="text-gray-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Vitamin</span>
                    </button>
                    <button onClick={() => handleSwipe('right')} className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl py-4 flex flex-col items-center justify-center gap-1 shadow-[0_0_15px_rgba(251,255,0,0.3)] active:scale-95">
                      <Flame size={24} fill="currentColor" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Painkiller</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeModal === 'node2' && (
              <div className="flex-1 flex flex-col justify-center">
                {node2Phase === 'intro' && (
                  <button onClick={startFlash} className="w-full bg-yellow-400 text-black font-bold py-4 rounded-xl active:scale-95 transition-transform uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(251,255,0,0.3)]">
                    Start 3-Second Test
                  </button>
                )}
                {node2Phase === 'flash' && (
                  <div className="bg-white rounded-xl p-4 aspect-video flex flex-col gap-2 relative animate-pulse">
                    <div className="h-4 bg-gray-300 w-1/3 rounded"></div>
                    <div className="flex gap-2 mt-4">
                       <div className="h-8 bg-blue-500 w-1/4 rounded"></div>
                       <div className="h-8 bg-green-500 w-1/4 rounded"></div>
                       <div className="h-8 bg-red-500 w-1/4 rounded"></div>
                       <div className="h-8 bg-purple-500 w-1/4 rounded"></div>
                    </div>
                    <div className="h-10 bg-orange-500 w-full rounded mt-auto flex items-center justify-center text-xs text-white font-bold">BUY NOW / SIGN UP / LEARN MORE</div>
                  </div>
                )}
                {node2Phase === 'question' && (
                  <div className="flex flex-col gap-3">
                    <button onClick={() => handleNode2Answer(false)} className="bg-gray-900 border border-gray-700 p-4 rounded-xl text-left hover:bg-gray-800 text-sm">The logo was too small.</button>
                    <button onClick={() => handleNode2Answer(true)} className="bg-gray-900 border border-gray-700 p-4 rounded-xl text-left hover:bg-gray-800 text-sm">There were 5 conflicting CTA buttons.</button>
                    <button onClick={() => handleNode2Answer(false)} className="bg-gray-900 border border-gray-700 p-4 rounded-xl text-left hover:bg-gray-800 text-sm">It didn't have enough text.</button>
                  </div>
                )}
              </div>
            )}

            {activeModal === 'node3' && (
              <div className="flex-1 flex flex-col">
                <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-4 font-mono text-xs text-gray-300 mb-6 overflow-x-auto shadow-inner">
                  <p className="text-purple-400">async function <span className="text-blue-400">submitWaitlist</span>(email) {'{'}</p>
                  <p className="pl-4 text-gray-500">// TODO: Save email to database</p>
                  <p className="pl-4 font-bold text-yellow-400 border-b border-dashed border-yellow-700 inline-block">__________MISSING_LOGIC__________</p>
                  <p>{'}'}</p>
                </div>
                <div className="flex flex-col gap-3 mt-auto">
                  <button onClick={() => handleNode3Answer('console')} className="bg-gray-900 border border-gray-700 p-4 rounded-xl text-left hover:bg-gray-800 text-xs font-mono text-gray-300">
                    <span className="text-blue-400">console</span>.<span className="text-yellow-200">log</span>(email);
                  </button>
                  <button onClick={() => handleNode3Answer('database')} className="bg-gray-900 border border-gray-700 p-4 rounded-xl text-left hover:bg-gray-800 text-xs font-mono text-gray-300">
                    <span className="text-purple-400">await</span> supabase.<span className="text-blue-400">from</span>('waitlist').<span className="text-blue-400">insert</span>({'{'} email {'}'});
                  </button>
                  <button onClick={() => handleNode3Answer('alert')} className="bg-gray-900 border border-gray-700 p-4 rounded-xl text-left hover:bg-gray-800 text-xs font-mono text-gray-300">
                    <span className="text-blue-400">setTimeout</span>(() =&gt; <span className="text-blue-400">alert</span>("Saved!"), <span className="text-orange-400">1000</span>);
                  </button>
                </div>
              </div>
            )}

            {activeModal === 'boss' && (
              <form onSubmit={handleBossSubmit} className="flex-1 flex flex-col">
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-8 text-center flex flex-col items-center shadow-inner">
                  <div className="w-16 h-16 bg-red-950/50 rounded-full flex items-center justify-center mb-4">
                    <LinkIcon size={32} className="text-red-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Submit Proof of Execution</h3>
                  <p className="text-gray-400 text-xs">Approved domains: LinkedIn, GitHub, Google Docs.</p>
                </div>
                <div className="flex flex-col gap-4 mt-auto">
                  <input 
                    type="text" 
                    placeholder="https://linkedin.com/in/..." 
                    value={launchUrl}
                    onChange={(e) => setLaunchUrl(e.target.value)}
                    className="bg-gray-950 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                  <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl active:scale-95 transition-transform uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(255,0,60,0.3)] flex items-center justify-center gap-2">
                    <Send size={18} /> Face The VC
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SHOP MESSAGE MODAL */}
      {activeModal === 'shopMessage' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-auto">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setActiveModal(null)}></div>
          <div className="relative w-full max-w-sm bg-gray-950 border border-gray-800 rounded-2xl p-6 flex flex-col animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className={`p-4 rounded-xl mb-4 border ${vcStatus === 'error' ? 'bg-red-950/30 border-red-900 text-red-200' : 'bg-yellow-900/20 border-yellow-700/50 text-yellow-200'} text-sm leading-relaxed font-mono`}>
              <span className="font-bold uppercase tracking-wider block mb-1 text-[10px]">The VC Says:</span>
              {vcMessage}
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl active:scale-95 transition-colors uppercase tracking-wider text-xs mt-2 border border-gray-700">
              Understood
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM TABS */}
      <footer className="fixed bottom-0 w-full bg-black/95 backdrop-blur-lg border-t border-gray-900 pb-safe z-30 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-around items-center p-4 max-w-md mx-auto">
          <button onClick={() => setActiveTab('sprint')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'sprint' ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400'}`}>
            <Map size={24} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Sprint</span>
          </button>
          <button onClick={() => setActiveTab('leaderboard')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'leaderboard' ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400'}`}>
            <Trophy size={24} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Rank</span>
          </button>
          <button onClick={() => setActiveTab('portfolio')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'portfolio' ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400'}`}>
            <LayoutDashboard size={24} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Proof</span>
          </button>
          <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400'}`}>
            <User size={24} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
          </button>
        </div>
      </footer>
    </div>
  );
}