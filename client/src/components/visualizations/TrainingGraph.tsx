
import { Play, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TrainingGraph() {
    const [isTraining, setIsTraining] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval: any;
        if (isTraining && progress < 100) {
            interval = setInterval(() => {
                setProgress(p => Math.min(p + 1, 100));
            }, 50);
        } else if (progress >= 100) {
            setIsTraining(false);
        }
        return () => clearInterval(interval);
    }, [isTraining, progress]);

    const handleStart = () => {
        setProgress(0);
        setIsTraining(true);
    };

    return (
        <div className="h-full flex flex-col p-6 bg-[#09090b]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-zinc-100 font-semibold">Training Loss</h3>
                    <p className="text-xs text-zinc-500 mt-1">Real-time optimization visualization</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1.5 text-zinc-400"><div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div> Train</span>
                        <span className="flex items-center gap-1.5 text-zinc-400"><div className="w-2 h-2 bg-purple-500 rounded-full"></div> Val</span>
                    </div>
                    <button
                        onClick={handleStart}
                        disabled={isTraining}
                        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded border border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                        {progress === 100 ? <RotateCcw className="w-3 h-3" /> : <Play className="w-3 h-3 text-green-400" />}
                        {progress === 100 ? "Restart" : isTraining ? "Training..." : "Start"}
                    </button>
                </div>
            </div>

            <div className="flex-1 border-l border-b border-zinc-800 relative bg-zinc-900/10 rounded-tr-lg">
                {/* Y-axis labels */}
                <div className="absolute -left-8 top-0 text-[10px] text-zinc-500 font-mono">3.00</div>
                <div className="absolute -left-8 bottom-0 text-[10px] text-zinc-500 font-mono">0.00</div>

                {/* X-axis labels */}
                <div className="absolute left-0 -bottom-6 text-[10px] text-zinc-500 font-mono">Step 0</div>
                <div className="absolute right-0 -bottom-6 text-[10px] text-zinc-500 font-mono">Step 1000</div>

                {/* Animated SVG Graph */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="trainGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[25, 50, 75].map(y => (
                        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#27272a" strokeWidth="0.5" strokeDasharray="2,2" />
                    ))}
                    {[25, 50, 75].map(x => (
                        <line key={x} x1={x} y1="0" x2={x} y2="100" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2,2" />
                    ))}

                    {/* Mask for animation */}
                    <mask id="revealMask">
                        <rect x="0" y="0" width={progress} height="100" fill="white" />
                    </mask>

                    <g mask="url(#revealMask)">
                        {/* Train Loss Curve (Blue) */}
                        <path
                            d="M0,10 C20,50 50,80 100,90"
                            fill="url(#trainGradient)"
                            stroke="#3b82f6"
                            strokeWidth="1.5"
                            className="drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                            vectorEffect="non-scaling-stroke"
                        />

                        {/* Val Loss Curve (Purple) */}
                        <path
                            d="M0,15 C20,55 50,75 100,85"
                            fill="none"
                            stroke="#a855f7"
                            strokeWidth="1.5"
                            strokeDasharray="4,2"
                            vectorEffect="non-scaling-stroke"
                        />

                        {/* Current Head Dot */}
                        <circle cx={progress} cy={10 + (progress / 100) * 80} r="1.5" fill="#fff" className="animate-pulse" />
                    </g>
                </svg>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 flex items-center justify-between">
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">Current Loss</span>
                    <span className="text-lg font-mono text-zinc-200 font-medium">
                        {progress === 0 ? "2.845" : (2.845 - (progress / 100) * 2.5).toFixed(3)}
                    </span>
                </div>
                <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 flex items-center justify-between">
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">Perplexity</span>
                    <span className="text-lg font-mono text-zinc-200 font-medium">
                        {progress === 0 ? "17.20" : (17.2 - (progress / 100) * 16).toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}
