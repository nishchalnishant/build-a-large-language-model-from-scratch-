import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from "react-resizable-panels";
import { useState, useEffect, useRef } from "react";
import { BookOpen, Terminal as TerminalIcon, Code2, Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import CodeEditor from "../editor/CodeEditor";
import Terminal from "../console/Terminal";
import GuideRenderer from "../guide/GuideRenderer";
import ChatInterface from "../visualizations/ChatInterface";
import WelcomeView from "../visualizations/WelcomeView";
import GlossaryView from "../visualizations/GlossaryView";
import introductionContent from "../../content/introduction.md?raw";
import glossaryContent from "../../content/glossary.md?raw";
import chapter1Content from "../../content/chapter1.md?raw";
import chapter2Content from "../../content/chapter2.md?raw";
import chapter3Content from "../../content/chapter3.md?raw";
import chapter4Content from "../../content/chapter4.md?raw";
import chapter5Content from "../../content/chapter5.md?raw";
import chapter6Content from "../../content/chapter6.md?raw";
import chapter7Content from "../../content/chapter7.md?raw";
import TokenizeExplorer from "../visualizations/TokenizeExplorer";
import ArchitectureView from "../visualizations/ArchitectureView";
import AttentionMatrix from "../visualizations/AttentionMatrix";
import TrainingGraph from "../visualizations/TrainingGraph";


const CHAPTERS = [
    { title: "Introduction: Getting Started", content: introductionContent, viz: "welcome" },
    { title: "Chapter 1: Understanding LLMs", content: chapter1Content, viz: "architecture" },
    { title: "Chapter 2: Working with Text Data", content: chapter2Content, viz: "tokenizer" },
    { title: "Chapter 3: Coding Attention Mechanisms", content: chapter3Content, viz: "attention" },
    { title: "Chapter 4: Implementing a GPT Model", content: chapter4Content, viz: "architecture" },
    { title: "Chapter 5: Pretraining on Unlabeled Data", content: chapter5Content, viz: "training" },
    { title: "Chapter 6: Fine-tuning for Classification", content: chapter6Content, viz: "chat_class" },
    { title: "Chapter 7: Fine-tuning to Follow Instructions", content: chapter7Content, viz: "chat" },
    { title: "Glossary: Key Terms", content: glossaryContent, viz: "glossary" },
];

export default function Workbench() {
    // Only 'editor' and 'terminal' are valid tabs now for the top section
    const [activeTab, setActiveTab] = useState<"editor" | "terminal">("editor");
    const [logs, setLogs] = useState<string[]>([]);
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const workerRef = useRef<Worker | null>(null);

    const currentChapter = CHAPTERS[currentChapterIndex];

    const renderVisualization = () => {
        switch (currentChapter.viz) {
            case "welcome": return <WelcomeView />;
            case "architecture": return <ArchitectureView />;
            case "tokenizer": return <TokenizeExplorer />;
            case "attention": return <AttentionMatrix />;
            case "training": return <TrainingGraph />;
            case "chat":
            case "chat_class": return <ChatInterface />;
            case "glossary": return <GlossaryView />;
            default: return <ArchitectureView />;
        }
    };

    useEffect(() => {
        // Initialize Pyodide Worker
        workerRef.current = new Worker(new URL('../../runtime/worker.ts', import.meta.url), { type: 'module' });

        workerRef.current.onmessage = (event) => {
            const { type, message } = event.data;
            // Prefix errors for visibility
            const displayMsg = type === 'error' ? `[Error] ${message}` : message;
            setLogs(prev => [...prev, displayMsg]);
        };

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    const handleRunCode = (code: string) => {
        setActiveTab("terminal"); // Switch to terminal to see output
        setLogs(prev => [...prev, "Running code..."]);
        workerRef.current?.postMessage({ code });
    };

    const handleNextChapter = () => {
        if (currentChapterIndex < CHAPTERS.length - 1) {
            setCurrentChapterIndex(prev => prev + 1);
        }
    };

    const handlePrevChapter = () => {
        if (currentChapterIndex > 0) {
            setCurrentChapterIndex(prev => prev - 1);
        }
    };

    return (
        <div className="h-screen w-screen bg-[var(--color-bg)] text-zinc-100 overflow-hidden flex flex-col font-sans">
            <header className="h-14 border-b border-zinc-900 bg-[#0c0c0e] flex items-center px-6 shrink-0 z-20 shadow-[0_4px_20px_-10px_rgba(59,130,246,0.3)]">
                <BookOpen className="w-5 h-5 mr-3 text-blue-500" />
                <h1 className="font-bold text-lg tracking-wide bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                    Build a Large Language Model From Scratch
                </h1>
                <div className="ml-auto w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_2px_rgba(59,130,246,0.5)] animate-pulse"></div>
            </header>

            <div className="flex-1 overflow-hidden">
                <PanelGroup orientation="horizontal">
                    <Panel defaultSize={50} minSize={20} className="bg-[#09090b] flex flex-col border-r border-zinc-900">
                        <div className="h-full flex flex-col">
                            <div className="p-4 border-b border-zinc-900 shrink-0 flex justify-between items-center bg-[#0c0c0e]/80 backdrop-blur">
                                <div>
                                    <h2 className="font-semibold text-zinc-100">{currentChapter.title}</h2>
                                    <span className="text-xs text-zinc-500">Step {currentChapterIndex + 1} of {CHAPTERS.length}</span>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={handlePrevChapter}
                                        disabled={currentChapterIndex === 0}
                                        className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white disabled:opacity-30 transition-all duration-200"
                                        title="Previous Chapter"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={handleNextChapter}
                                        disabled={currentChapterIndex === CHAPTERS.length - 1}
                                        className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white disabled:opacity-30 transition-all duration-200"
                                        title="Next Chapter"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto p-8 bg-[#09090b] scroll-smooth">
                                <GuideRenderer content={currentChapter.content} />

                                <div className="mt-12 pt-8 border-t border-zinc-900 flex justify-between text-sm text-zinc-500">
                                    <button
                                        onClick={handlePrevChapter}
                                        disabled={currentChapterIndex === 0}
                                        className="hover:text-blue-400 disabled:opacity-0 transition-colors flex items-center"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                                    </button>
                                    <button
                                        onClick={handleNextChapter}
                                        disabled={currentChapterIndex === CHAPTERS.length - 1}
                                        className="hover:text-blue-400 disabled:opacity-0 transition-colors flex items-center"
                                    >
                                        Next <ChevronRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Panel>

                    <PanelResizeHandle className="w-[1px] bg-zinc-800 hover:bg-blue-500 transition-colors z-30" />

                    <Panel defaultSize={50} minSize={30} className="bg-slate-950 flex flex-col">
                        <PanelGroup orientation="vertical">
                            <Panel defaultSize={60} minSize={30}>
                                <div className="h-full flex flex-col">
                                    <div className="flex border-b border-slate-800 bg-slate-900">
                                        <button
                                            onClick={() => setActiveTab("editor")}
                                            className={cn(
                                                "px-4 py-3 text-xs font-medium flex items-center gap-2 border-r border-slate-800 hover:bg-slate-800 transition-colors",
                                                activeTab === 'editor' ? 'bg-slate-800 text-blue-400' : 'text-slate-400'
                                            )}
                                        >
                                            <Code2 className="w-4 h-4" /> Code
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("terminal")}
                                            className={cn(
                                                "px-4 py-3 text-xs font-medium flex items-center gap-2 border-r border-slate-800 hover:bg-slate-800 transition-colors",
                                                activeTab === 'terminal' ? 'bg-slate-800 text-green-400' : 'text-slate-400'
                                            )}
                                        >
                                            <TerminalIcon className="w-4 h-4" /> Output
                                        </button>
                                    </div>

                                    <div className="flex-1 relative overflow-hidden">
                                        <div className={cn("absolute inset-0", activeTab === 'editor' ? 'z-10' : 'z-0')}>
                                            <CodeEditor onRun={handleRunCode} />
                                        </div>

                                        <div className={cn("absolute inset-0 bg-black", activeTab === 'terminal' ? 'z-10' : 'z-0')}>
                                            <Terminal logs={logs} />
                                        </div>
                                    </div>
                                </div>
                            </Panel>

                            <PanelResizeHandle className="h-1 bg-slate-800 hover:bg-purple-500 transition-colors z-30" />

                            <Panel defaultSize={40} minSize={20} className="bg-slate-950 flex flex-col border-t border-slate-800">
                                <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-purple-400" />
                                    <span className="text-xs font-medium text-purple-400 uppercase tracking-widest">Visualization</span>
                                </div>
                                <div className="flex-1 overflow-hidden relative">
                                    {renderVisualization()}
                                </div>
                            </Panel>
                        </PanelGroup>
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    )
}
