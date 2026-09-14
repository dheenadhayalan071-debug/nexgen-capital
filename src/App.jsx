import React, { useState, useEffect } from 'react';
import { Flame, Heart, Zap, Lock, Map, Trophy, LayoutDashboard, User, X, Check, Eye } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('sprint');
  const [activeModal, setActiveModal] = useState(null); // 'node1', 'node2'

  // The Builder Economy State
  const [hearts, setHearts] = useState(3);
  const [coins, setCoins] = useState(150);
  const [streak, setStreak] = useState(0);

  // Node 1 State (The Bleeding Neck)
  const [node1Completed, setNode1Completed] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);

  // Node 2 State (The 3-Second UI)
  const [node2Completed, setNode2Completed] = useState(false);
  const [node2Phase, setNode2Phase] = useState('intro'); // 'intro', 'flash', 'question'

  // VC State
  const [vcMessage, setVcMessage] = useState("");
  const [vcStatus, setVcStatus] = useState("neutral");

  const cards = [
    { id: 1, text: "An AI app that recommends Netflix shows based on your current mood.", type: "vitamin" },
    { id: 2, text: "A digital habit tracker that awards badges for drinking water.", type: "vitamin" },
    { id: 3, text: "A one-click formatting tool that fixes broken project citations at 11:30 PM before a midnight submission deadline.", type: "painkiller" }
  ];

  // --- NODE 1 LOGIC ---
  const openNode1 = () => {
    if (node1Completed) return;
    setVcMessage("Swipe Right on the Painkiller. Swipe Left on the Vitamin. Don't waste my time.");
    setVcStatus("neutral");
    setActiveModal('node1');
  };

  const handleSwipe = (direction) => {
    const currentCard = cards[cardIndex];
    if (direction === 'right') {
      if (currentCard.type === 'painkiller') {
        setVcMessage("Execution logged. That's a bleeding neck. Your equity is safe.");
        setVcStatus('success');
        setCoins(c => c + 50);
        setStreak(s => (s === 0 ? 1 : s)); 
        setNode1Completed(true);
        setTimeout(() => setActiveModal(null), 2000);
      } else {
        setVcMessage("You call that a startup? Nobody pays to be reminded to drink water. Heart removed.");
        setVcStatus('error');
        setHearts(h => Math.max(0, h - 1));
      }
    } else {
      if (currentCard.type === 'vitamin') {
        setVcMessage("Good. You avoided a trap. Next idea.");
        setVcStatus('success');
        setTimeout(() => {
          setCardIndex(i => i + 1);
          setVcStatus('neutral');
          setVcMessage("Next. Swipe Right on the Painkiller. Swipe Left on the Vitamin.");
        }, 1200);
      } else {
        setVcMessage("Are you blind? That was a massive pain point and you rejected it. Heart removed.");
        setVcStatus('error');
        setHearts(h => Math.max(0, h - 1));
      }
    }
  };

  // --- NODE 2 LOGIC ---
  const openNode2 = () => {
    if (!node1Completed || node2Completed) return;
    setNode2Phase('intro');
    setVcMessage("People buy with their eyes. You have exactly 3 seconds to look at the next screen.");
    setVcStatus("neutral");
    setActiveModal('node2');
  };

  const startFlash = () => {
    setNode2Phase('flash');
    setVcMessage("Memorize it. 3... 2... 1...");
    
    // The 3-second timer
    setTimeout(() => {
      setNode2Phase('question');
      setVcMessage("Time's up. What was the biggest conversion killer on that page?");
    }, 3000);
  };

  const handleNode2Answer = (isCorrect) => {
    if (isCorrect) {
      setVcMessage("Correct. Confusion kills conversion. Never use 5 buttons when you need 1.");
      setVcStatus('success');
      setCoins(c => c + 75);
      setNode2Completed(true);
      setTimeout(() => setActiveModal(null), 2500);
    } else {
      setVcMessage("Wrong. You're obsessed with aesthetics instead of revenue. Heart removed.");
      setVcStatus('error');
      setHearts(h => Math.max(0, h - 1));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans relative overflow-hidden">
      
      {/* ECONOMY HEADER */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-gray-900 px-4 py-4 flex justify-between items-center relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-900 border border-gray-700 rounded text-[10px] font-bold font-mono flex items-center justify-center text-gray-400">VC</div>
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
        {vcStatus === 'error' && (
          <div className="absolute inset-0 bg-red-500/20 animate-pulse pointer-events-none"></div>
        )}
      </header>

      {/* SKILL TREE */}
      <main className="flex-1 overflow-y-auto pb-24 relative flex flex-col items-center pt-8">
        <div className="w-full max-w-md px-6 flex flex-col items-center">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white">Zero-to-One Sprint</h2>
            <p className="text-gray-500 text-sm mt-1">Prove you can execute.</p>
          </div>

          <div className="relative flex flex-col items-center gap-12 w-full">
            <div className="absolute top-8 bottom-12 w-1 bg-gray-900 -z-10 rounded"></div>

            {/* Node 1: The Bleeding Neck */}
            <div onClick={openNode1} className={`relative flex flex-col items-center cursor-pointer ${node1Completed ? 'opacity-50' : 'group'}`}>
              {!node1Completed && (
                <div className="absolute -top-3 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider animate-bounce">Tap to Build</div>
              )}
              <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transform transition-transform active:scale-95 ${node1Completed ? 'bg-gray-900 border-yellow-400' : 'bg-yellow-400 border-black shadow-[0_0_20px_rgba(251,255,0,0.4)]'}`}>
                {node1Completed ? <Check size={32} className="text-yellow-400" /> : <Zap size={32} className="text-black" fill="currentColor" />}
              </div>
              <span className="mt-3 font-bold text-sm">The Bleeding Neck</span>
            </div>

            {/* Node 2: The 3-Second UI */}
            <div onClick={openNode2} className={`relative flex flex-col items-center transition-all duration-500 ${node1Completed ? 'cursor-pointer opacity-100' : 'opacity-50'} ${node2Completed ? 'opacity-50' : ''}`}>
              {node1Completed && !node2Completed && (
                 <div className="absolute -top-3 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider animate-bounce">Unlocked</div>
              )}
              <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transform transition-transform ${!node1Completed ? 'bg-gray-900 border-black' : node2Completed ? 'bg-gray-900 border-yellow-400' : 'bg-yellow-400 border-black active:scale-95 shadow-[0_0_20px_rgba(251,255,0,0.4)]'}`}>
                {node2Completed ? <Check size={24} className="text-yellow-400" /> : !node1Completed ? <Lock size={24} className="text-gray-600" /> : <Eye size={24} className="text-black" />}
              </div>
              <span className={`mt-3 font-bold text-sm ${node1Completed ? 'text-white' : 'text-gray-500'}`}>The 3-Second UI</span>
            </div>
            
            {/* Node 3: Wiring the Engine (Locked for now) */}
            <div className={`relative flex flex-col items-center transition-all duration-500 ${node2Completed ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${node2Completed ? 'bg-yellow-400 border-black shadow-[0_0_20px_rgba(251,255,0,0.4)]' : 'bg-gray-900 border-black'}`}>
                {node2Completed ? <Zap size={24} className="text-black" fill="currentColor" /> : <Lock size={24} className="text-gray-600" />}
              </div>
              <span className={`mt-3 font-bold text-sm ${node2Completed ? 'text-white' : 'text-gray-500'}`}>Wiring the Engine</span>
            </div>

            {/* Boss Level */}
            <div className="relative flex flex-col items-center mt-4">
              <div className="w-24 h-24 rounded-lg bg-red-950 border-4 border-red-500 flex items-center justify-center shadow-[0_0_30px_rgba(255,0,60,0.2)]">
                <Lock size={32} className="text-red-500" />
              </div>
              <span className="mt-4 font-extrabold text-red-500 uppercase tracking-widest text-sm">Boss: Public Ship</span>
            </div>
          </div>
        </div>
      </main>

      {/* REUSABLE MODAL CONTAINER */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-6 pointer-events-auto">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setActiveModal(null)}></div>
          
          <div className="relative w-full max-w-md bg-gray-950 border-t sm:border border-gray-800 rounded-t-3xl sm:rounded-3xl p-6 flex flex-col animate-in slide-in-from-bottom-full duration-300 min-h-[400px]">
            
            {/* VC Dialogue Box */}
            <div className={`p-4 rounded-xl mb-6 border ${vcStatus === 'error' ? 'bg-red-950/30 border-red-900 text-red-200' : vcStatus === 'success' ? 'bg-yellow-900/20 border-yellow-700/50 text-yellow-200' : 'bg-gray-900 border-gray-700 text-gray-300'} text-sm leading-relaxed font-mono`}>
              <span className="font-bold uppercase tracking-wider block mb-1 text-[10px]">The VC Says:</span>
              {vcMessage}
            </div>

            {/* NODE 1 CONTENT */}
            {activeModal === 'node1' && (
              <>
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
              </>
            )}

            {/* NODE 2 CONTENT */}
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
                    <button onClick={() => handleNode2Answer(false)} className="bg-gray-900 border border-gray-700 p-4 rounded-xl text-left hover:bg-gray-800 text-sm">
                      The logo was too small.
                    </button>
                    <button onClick={() => handleNode2Answer(true)} className="bg-gray-900 border border-gray-700 p-4 rounded-xl text-left hover:bg-gray-800 text-sm">
                      There were 5 conflicting CTA buttons.
                    </button>
                    <button onClick={() => handleNode2Answer(false)} className="bg-gray-900 border border-gray-700 p-4 rounded-xl text-left hover:bg-gray-800 text-sm">
                      It didn't have enough text.
                    </button>
                  </div>
                )}
                
              </div>
            )}
          </div>
        </div>
      )}

      {/* BOTTOM TABS */}
      <footer className="fixed bottom-0 w-full bg-black/95 backdrop-blur-lg border-t border-gray-900 pb-safe z-30">
        <div className="flex justify-around items-center p-4 max-w-md mx-auto">
          <button onClick={() => setActiveTab('sprint')} className={`flex flex-col items-center gap-1 ${activeTab === 'sprint' ? 'text-yellow-400' : 'text-gray-600'}`}>
            <Map size={24} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Sprint</span>
          </button>
          <button onClick={() => setActiveTab('leaderboard')} className={`flex flex-col items-center gap-1 ${activeTab === 'leaderboard' ? 'text-yellow-400' : 'text-gray-600'}`}>
            <Trophy size={24} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Rank</span>
          </button>
          <button onClick={() => setActiveTab('portfolio')} className={`flex flex-col items-center gap-1 ${activeTab === 'portfolio' ? 'text-yellow-400' : 'text-gray-600'}`}>
            <LayoutDashboard size={24} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Proof</span>
          </button>
          <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-yellow-400' : 'text-gray-600'}`}>
            <User size={24} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
          </button>
        </div>
      </footer>
    </div>
  )
}
