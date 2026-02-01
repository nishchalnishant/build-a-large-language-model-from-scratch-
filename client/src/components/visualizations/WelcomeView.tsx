
import { BookOpen, Code2, Activity, ArrowRight } from 'lucide-react';

export default function WelcomeView() {
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#09090b] text-zinc-100 overflow-y-auto">
            <div className="mb-8 relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                <BookOpen className="w-16 h-16 text-blue-500 relative z-10" />
            </div>

            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Let's Build an LLM
            </h2>

            <p className="text-zinc-400 max-w-md mb-8 text-sm leading-relaxed">
                This interactive workbench combines theory, code, and visualization to help you understand how GPT models work from the ground up.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg mb-8">
                <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex flex-col items-center hover:border-blue-500/30 transition-colors cursor-default group">
                    <BookOpen className="w-6 h-6 text-zinc-500 mb-2 group-hover:text-blue-400 transition-colors" />
                    <span className="text-xs font-medium text-zinc-300">Detailed Guide</span>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex flex-col items-center hover:border-purple-500/30 transition-colors cursor-default group">
                    <Code2 className="w-6 h-6 text-zinc-500 mb-2 group-hover:text-purple-400 transition-colors" />
                    <span className="text-xs font-medium text-zinc-300">Live Python</span>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex flex-col items-center hover:border-green-500/30 transition-colors cursor-default group">
                    <Activity className="w-6 h-6 text-zinc-500 mb-2 group-hover:text-green-400 transition-colors" />
                    <span className="text-xs font-medium text-zinc-300">Visualizations</span>
                </div>
            </div>

            <div className="animate-bounce">
                <span className="text-xs text-zinc-500 flex items-center gap-2">
                    Start with Chapter 1 <ArrowRight className="w-3 h-3" />
                </span>
            </div>
        </div>
    );
}
