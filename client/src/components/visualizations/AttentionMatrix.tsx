
import React, { useState } from 'react';
import { MousePointer2 } from 'lucide-react';

export default function AttentionMatrix() {
    const [hoveredCell, setHoveredCell] = useState<{ q: string, k: string, v: number } | null>(null);

    // Mock data for a small sentence interaction
    const tokens = ["The", "cat", "sat", "on", "mat"];
    const matrix = [
        [0.9, 0.1, 0.0, 0.0, 0.0],
        [0.1, 0.8, 0.1, 0.0, 0.0],
        [0.1, 0.2, 0.7, 0.0, 0.0],
        [0.0, 0.0, 0.1, 0.9, 0.0],
        [0.1, 0.3, 0.1, 0.1, 0.4]
    ];

    return (
        <div className="h-full flex flex-col p-6 bg-[#09090b]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-zinc-100 font-semibold flex items-center gap-2">
                        Attention Weights
                        <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">Head 0</span>
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">Darker blue indicates higher attention score.</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center">
                <div className="relative">
                    {/* Y-Axis Label */}
                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-zinc-500 font-medium tracking-widest origin-center">
                        QUERY
                    </div>

                    {/* X-Axis Label */}
                    <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 text-xs text-zinc-500 font-medium tracking-widest">
                        KEY
                    </div>

                    <div className="grid grid-cols-6 gap-1 p-4 bg-zinc-900/30 rounded-xl border border-zinc-900">
                        {/* Header Row */}
                        <div className="h-10 w-12"></div>
                        {tokens.map((t, i) => (
                            <div key={`col-${i}`} className="h-10 w-12 flex items-end justify-center pb-2">
                                <span className="text-xs text-zinc-400 font-mono -rotate-45 origin-bottom-left translate-x-2 translate-y-2">{t}</span>
                            </div>
                        ))}

                        {/* Matrix Rows */}
                        {matrix.map((row, i) => (
                            <React.Fragment key={`row-${i}`}>
                                <div className="h-10 w-12 flex items-center justify-end pr-3">
                                    <span className="text-xs text-zinc-400 font-mono">{tokens[i]}</span>
                                </div>
                                {row.map((val, j) => (
                                    <div
                                        key={`${i}-${j}`}
                                        className={`h-10 w-12 rounded transition-all duration-200 border cursor-none ${hoveredCell?.q === tokens[i] && hoveredCell?.k === tokens[j]
                                            ? 'border-blue-400 scale-110 shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10'
                                            : 'border-transparent hover:border-blue-500/30'
                                            }`}
                                        style={{ backgroundColor: `rgba(59, 130, 246, ${val})` }}
                                        onMouseEnter={() => setHoveredCell({ q: tokens[i], k: tokens[j], v: val })}
                                        onMouseLeave={() => setHoveredCell(null)}
                                    >
                                        <div className="h-full w-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <span className="text-[10px] font-bold text-white drop-shadow-md">{val.toFixed(1)}</span>
                                        </div>
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Detail Panel */}
                <div className="mt-8 w-full max-w-sm h-24 bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-center transition-all duration-300">
                    {hoveredCell ? (
                        <div className="flex items-center gap-6 w-full animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex-1 text-center border-r border-zinc-800">
                                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Query</div>
                                <div className="text-lg text-zinc-200 font-serif font-medium">"{hoveredCell.q}"</div>
                            </div>
                            <div className="flex-1 text-center border-r border-zinc-800">
                                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Key</div>
                                <div className="text-lg text-zinc-200 font-serif font-medium">"{hoveredCell.k}"</div>
                            </div>
                            <div className="flex-1 text-center">
                                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Score</div>
                                <div className="text-2xl text-blue-400 font-bold">{(hoveredCell.v * 100).toFixed(0)}%</div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-zinc-600 gap-2">
                            <MousePointer2 className="w-5 h-5 opacity-50" />
                            <span className="text-sm">Hover over cells to see details</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
