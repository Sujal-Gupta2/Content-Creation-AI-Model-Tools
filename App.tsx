
import React, { useState, useEffect, useCallback } from 'react';
import { ToolType, VoiceProfile } from './types';
import Sidebar from './components/Sidebar';
import Advisor from './components/Advisor';
import StudioLayout from './components/StudioLayout';
import FormattedOutput from './components/FormattedOutput';
import PlatformPreview from './components/PlatformPreview';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.DASHBOARD);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [prompt, setPrompt] = useState('');
  const [reference, setReference] = useState('');
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [videoDuration, setVideoDuration] = useState<'5s' | '120s'>('5s');
  const [enableThinking, setEnableThinking] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [activePreview, setActivePreview] = useState<'X' | 'LinkedIn' | 'Instagram'>('X');
  
  // Brand Voice state
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile>({ name: 'Default', samples: ['', '', ''], description: '' });

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const checkKeyStatus = useCallback(async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(hasKey);
      return hasKey;
    }
    return true;
  }, []);

  useEffect(() => {
    checkKeyStatus();
  }, [checkKeyStatus, activeTool]);

  const requestApiKeySelection = async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasApiKey(true); // Assume success to proceed as per instructions
    }
  };

  const ensureApiKey = async () => {
    const hasKey = await checkKeyStatus();
    if (!hasKey) {
      await requestApiKeySelection();
    }
    return true;
  };

  const handleAction = async (type: ToolType, customPrompt?: string) => {
    setLoading(true);
    setLoadingMessage('Initializing Intelligence...');
    try {
      // Enforce key selection for advanced models
      if (type === ToolType.SOCIAL_POST || type === ToolType.VIDEO_GEN || enableThinking) {
        await ensureApiKey();
      }

      const activePrompt = customPrompt || prompt;
      const voiceContext = voiceProfile.description ? `Brand Persona Profile:\n${voiceProfile.description}\n\nSTRICTLY ADHERE TO THIS VOICE.\n\n` : '';
      const formatRequirement = "FORMATTING: Use *text* for bold, # for bullets, and - for lines. Tables: | col1 | col2 |.";

      if (type === ToolType.SOCIAL_POST) {
        setLoadingMessage('Generating Pro Visual & Copy...');
        const imageUrl = await geminiService.generateImage(activePrompt, imageSize);
        const caption = await geminiService.generateText(`${voiceContext}Create a viral social media caption for this image concept: "${activePrompt}". ${formatRequirement}`);
        setResult({ imageUrl, caption });
      } else if (type === ToolType.BLOG_SEO) {
        setLoadingMessage('Writing Authority Blog...');
        const blog = await geminiService.generateText(`${voiceContext}Topic: ${activePrompt}\n\nReference: ${reference}\n\nWrite a 1500-word blog post. ${formatRequirement}`, {
          useThinking: enableThinking
        });
        setResult({ blog });
      } else if (type === ToolType.VIDEO_GEN) {
        setLoadingMessage(`Rendering ${videoDuration === '5s' ? 'GIF Post' : '2m Video'}...`);
        const videoUrl = await geminiService.generateVideo(activePrompt, videoDuration);
        setResult({ videoUrl, duration: videoDuration });
      } else if (type === ToolType.RESEARCH) {
        setLoadingMessage('Scanning Web for Real-time Data...');
        const researchData = await geminiService.researchTopic(activePrompt);
        setResult({ research: researchData.text, sources: researchData.grounding });
      } else if (type === ToolType.BRAND_VOICE) {
        setLoadingMessage('Extracting Voice Fingerprint...');
        const analysis = await geminiService.generateText(
          `Extract the brand voice profile from these samples. List tone, vocabulary, and structure preferences. Samples:\n${voiceProfile.samples.filter(s => s).join('\n\n')}`,
          { useThinking: true }
        );
        setVoiceProfile({ ...voiceProfile, description: analysis || '' });
        setResult({ voiceDescription: analysis });
      } else if (type === ToolType.BATCH_GEN) {
        setLoadingMessage('Generating 7-Day Matrix...');
        const batch = await geminiService.generateText(
          `${voiceContext}Create a 7-day social media plan for: ${activePrompt}. Include Day, Platform, Content, and Hook in a TABLE.`,
          { useThinking: true }
        );
        setResult({ batch });
      } else if (type === ToolType.CAROUSEL) {
        setLoadingMessage('Designing Carousel Slides...');
        const carousel = await geminiService.generateText(`${voiceContext}Outline 10 slides for a carousel about: ${activePrompt}. ${formatRequirement}`);
        setResult({ carousel });
      } else if (type === ToolType.INFOGRAPHIC) {
        setLoadingMessage('Structuring Infographic Data...');
        const info = await geminiService.generateText(`${voiceContext}Structure information for an infographic about: ${activePrompt}. Include a stats TABLE.`);
        setResult({ info });
      } else if (type === ToolType.ADS_COPY) {
        setLoadingMessage('Crafting High-Conversion Ads...');
        const ads = await geminiService.generateText(`${voiceContext}Write 3 ad variations for: ${activePrompt}. ${formatRequirement}`);
        setResult({ ads });
      }
    } catch (error: any) {
      console.error("Studio API Error:", error);
      const errorString = JSON.stringify(error).toLowerCase();
      const isPermissionError = errorString.includes("403") || 
                               errorString.includes("permission_denied") || 
                               errorString.includes("not found") ||
                               error.message?.toLowerCase().includes("permission");

      if (isPermissionError) {
        setHasApiKey(false); // Reset internal state to trigger visual warning
        alert("This feature (Veo / Gemini 3 Pro) requires an API key from a paid Google Cloud project. Please select a valid key.");
        // @ts-ignore
        if (window.aistudio?.openSelectKey) {
          // @ts-ignore
          await window.aistudio.openSelectKey();
        }
      } else {
        alert("Action failed: " + (error.message || "Unknown communication error"));
      }
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleExportResearch = () => {
    if (!result?.research) return;
    const blob = new Blob([result.research], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-${prompt.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
  };

  const handleRecycle = (newTool: ToolType) => {
    let sourceContent = result?.blog || result?.research || result?.ads || result?.carousel || result?.info || result?.caption || "";
    setPrompt(`[REPURPOSE] Transform this content into a ${newTool}: ${sourceContent.substring(0, 800)}...`);
    setActiveTool(newTool);
    setResult(null);
  };

  const renderActionButtons = (toolType: ToolType) => (
    <div className="flex flex-wrap gap-2 mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border dark:border-gray-800">
      <span className="text-[10px] font-black uppercase text-gray-400 w-full mb-1">Repurpose Asset:</span>
      {[ToolType.SOCIAL_POST, ToolType.ADS_COPY, ToolType.CAROUSEL, ToolType.BATCH_GEN].map(t => (
        <button 
          key={t}
          onClick={() => handleRecycle(t)} 
          className="px-3 py-1.5 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg text-[10px] font-bold hover:bg-gray-100 transition-all uppercase"
        >
          ♻ {t.replace('_', ' ')}
        </button>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTool) {
      case ToolType.DASHBOARD:
        return (
          <div className="space-y-10 animate-in fade-in duration-700">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl text-white shadow-xl">
                 <h3 className="text-xs font-black uppercase tracking-widest opacity-60">Success Rate</h3>
                 <p className="text-4xl font-black mt-2">99.2%</p>
               </div>
               <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border dark:border-gray-800 shadow-xl">
                 <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Brand Persona</h3>
                 <p className="text-4xl font-black mt-2 text-blue-500">{voiceProfile.description ? 'SYNCED' : 'READY'}</p>
               </div>
               <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border dark:border-gray-800 shadow-xl">
                 <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Assets Built</h3>
                 <p className="text-4xl font-black mt-2 text-indigo-500">2,109</p>
               </div>
             </div>
             <Advisor />
          </div>
        );

      case ToolType.BRAND_VOICE:
        return (
          <StudioLayout title="Brand Voice Cloning" description="Sync AI with your unique tone of voice." icon="🎭">
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {voiceProfile.samples.map((s, i) => (
                  <div key={i} className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Writing Sample {i+1}</label>
                    <textarea 
                      value={s} 
                      onChange={(e) => {
                        const next = [...voiceProfile.samples];
                        next[i] = e.target.value;
                        setVoiceProfile({...voiceProfile, samples: next});
                      }}
                      placeholder="Paste an existing blog or post..."
                      className="w-full h-48 p-4 text-sm rounded-2xl border dark:border-gray-800 dark:bg-gray-950 focus:ring-2 focus:ring-blue-500 resize-none outline-none"
                    />
                  </div>
                ))}
              </div>
              <button 
                onClick={() => handleAction(ToolType.BRAND_VOICE)} 
                disabled={loading || !voiceProfile.samples.some(s => s)}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl transition-all"
              >
                {loading ? 'Synthesizing Patterns...' : 'Cloné Voice Persona'}
              </button>
              {voiceProfile.description && (
                <div className="p-8 bg-gray-50 dark:bg-gray-900 rounded-3xl border dark:border-gray-800">
                  <h3 className="font-black text-xs uppercase text-gray-400 mb-4 tracking-widest">Voice DNA Profile</h3>
                  <FormattedOutput content={voiceProfile.description} />
                </div>
              )}
            </div>
          </StudioLayout>
        );

      case ToolType.RESEARCH:
        return (
          <StudioLayout title="Research Lab" description="Deep web research with primary source grounding." icon="🔬">
            <div className="p-10 space-y-8">
              <div className="flex gap-4">
                <input 
                  value={prompt} 
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Topic to research..."
                  className="flex-1 p-4 rounded-2xl border dark:border-gray-800 dark:bg-gray-950 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={() => handleAction(ToolType.RESEARCH)} disabled={loading || !prompt} className="px-8 bg-blue-600 text-white rounded-2xl font-black uppercase">
                  Research
                </button>
              </div>
              {result?.research && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest">Detailed Report</h3>
                    <button onClick={handleExportResearch} className="text-xs font-black text-blue-600 hover:underline">Download Markdown ↓</button>
                  </div>
                  <div className="p-10 bg-white dark:bg-gray-950 rounded-3xl border dark:border-gray-800 shadow-inner">
                    <FormattedOutput content={result.research} />
                  </div>
                  {renderActionButtons(ToolType.RESEARCH)}
                </div>
              )}
            </div>
          </StudioLayout>
        );

      case ToolType.SOCIAL_POST:
        return (
          <StudioLayout title="Static Post Studio" description="Viral imagery and captions combined." icon="🖼️">
            <div className="p-10 space-y-8">
              <textarea 
                value={prompt} 
                onChange={e => setPrompt(e.target.value)}
                placeholder="Post concept or visual idea..."
                className="w-full h-32 p-4 rounded-2xl border dark:border-gray-800 dark:bg-gray-950 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-full">
                  {['1K', '2K', '4K'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => setImageSize(s as any)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${imageSize === s ? 'bg-white dark:bg-gray-700 text-blue-600 shadow' : 'text-gray-500'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button onClick={() => handleAction(ToolType.SOCIAL_POST)} disabled={loading || !prompt} className="w-full md:w-64 py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest shadow-lg">
                  {loading ? 'Generating...' : 'Build Post'}
                </button>
              </div>
              
              {result?.imageUrl && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in zoom-in-95 duration-700">
                  <div className="space-y-6">
                    <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 group relative">
                      <img src={result.imageUrl} alt="Result" className="w-full h-auto" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <button className="px-6 py-2 bg-white text-black font-bold rounded-full text-xs">Download Image</button>
                      </div>
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border dark:border-gray-800">
                      <FormattedOutput content={result.caption} />
                    </div>
                    {renderActionButtons(ToolType.SOCIAL_POST)}
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                      {['X', 'LinkedIn', 'Instagram'].map(p => (
                        <button key={p} onClick={() => setActivePreview(p as any)} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${activePreview === p ? 'bg-white dark:bg-gray-700 text-blue-600 shadow' : 'text-gray-500'}`}>{p}</button>
                      ))}
                    </div>
                    <PlatformPreview content={result.caption} imageUrl={result.imageUrl} platform={activePreview} />
                  </div>
                </div>
              )}
            </div>
          </StudioLayout>
        );

      case ToolType.VIDEO_GEN:
        return (
          <StudioLayout title="GIF & Video Studio" description="Premium motion synthesis for marketing." icon="🎬">
            <div className="p-10 space-y-8">
              <textarea 
                value={prompt} 
                onChange={e => setPrompt(e.target.value)}
                placeholder="Cinematic motion description..."
                className="w-full h-32 p-4 rounded-2xl border dark:border-gray-800 dark:bg-gray-950 focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => { setVideoDuration('5s'); handleAction(ToolType.VIDEO_GEN); }} className={`p-6 border-2 rounded-3xl transition-all ${videoDuration === '5s' ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 shadow-lg' : 'border-gray-100 dark:border-gray-800'}`}>
                  <span className="text-3xl block mb-2">🌠</span>
                  <span className="font-black uppercase tracking-widest text-xs">5s GIF Post</span>
                  <p className="text-[10px] text-gray-500 mt-1">Loopable • 720p</p>
                </button>
                <button onClick={() => { setVideoDuration('120s'); handleAction(ToolType.VIDEO_GEN); }} className={`p-6 border-2 rounded-3xl transition-all ${videoDuration === '120s' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-lg' : 'border-gray-100 dark:border-gray-800'}`}>
                  <span className="text-3xl block mb-2">🎥</span>
                  <span className="font-black uppercase tracking-widest text-xs">2m Video</span>
                  <p className="text-[10px] text-gray-500 mt-1">Cinematic • 1080p</p>
                </button>
              </div>
              {result?.videoUrl && (
                <div className="space-y-6 animate-in zoom-in-95 duration-700">
                   <div className="rounded-[40px] overflow-hidden border-8 border-white dark:border-gray-800 shadow-2xl bg-black aspect-video">
                     <video src={result.videoUrl} controls autoPlay loop className="w-full h-full" />
                   </div>
                   <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                     <span className="text-xs font-black text-gray-400 uppercase">Master Asset: {result.duration === '5s' ? 'GIF (5s)' : 'Longform (120s)'}</span>
                     <a href={result.videoUrl} download="omni-render.mp4" className="text-xs font-black text-blue-600 uppercase hover:underline">Download File ↓</a>
                   </div>
                   {renderActionButtons(ToolType.VIDEO_GEN)}
                </div>
              )}
            </div>
          </StudioLayout>
        );

      default:
        return (
          <StudioLayout title={`${activeTool.replace('_', ' ')} Studio`} description="Professional AI tool." icon="✨">
            <div className="p-10 space-y-6">
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full h-40 p-4 rounded-2xl border dark:border-gray-800 dark:bg-gray-950" placeholder="Describe objective..." />
              <button onClick={() => handleAction(activeTool)} disabled={loading || !prompt} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">Execute Task</button>
              {(result?.ads || result?.carousel || result?.info || result?.batch || result?.blog) && (
                <div className="space-y-6">
                  <div className="p-10 bg-white dark:bg-gray-950 rounded-3xl border dark:border-gray-800 shadow-inner">
                    <FormattedOutput content={result.ads || result.carousel || result.info || result.batch || result.blog} />
                  </div>
                  {renderActionButtons(activeTool)}
                </div>
              )}
            </div>
          </StudioLayout>
        );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${isDark ? 'dark' : ''}`}>
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-[60]">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-serif">OmniContent</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-500 rounded-lg">☰</button>
      </div>

      <Sidebar 
        activeTool={activeTool} 
        setActiveTool={t => { setActiveTool(t); setPrompt(''); setResult(null); setIsSidebarOpen(false); }} 
        isDark={isDark} 
        toggleTheme={() => setIsDark(!isDark)}
        isOpen={isSidebarOpen}
        hasApiKey={hasApiKey}
        requestKey={requestApiKeySelection}
      />
      
      <main className={`flex-1 md:ml-64 p-4 md:p-10 transition-colors duration-300 min-h-screen ${isSidebarOpen ? 'blur-sm md:blur-none' : ''}`}>
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
        
        {loading && (
          <div className="fixed inset-0 bg-white/70 dark:bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 p-10 rounded-[40px] shadow-2xl border dark:border-gray-800 flex flex-col items-center space-y-6 text-center">
              <div className="w-20 h-20 border-8 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
              <div>
                <p className="font-black text-xl tracking-tight text-gray-800 dark:text-gray-100">{loadingMessage}</p>
                <p className="text-xs text-gray-500 mt-2 font-medium italic">Multimodal Neural Orchestration</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
