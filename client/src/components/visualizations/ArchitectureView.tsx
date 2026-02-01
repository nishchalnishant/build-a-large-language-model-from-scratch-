
import { Network, Database, Cpu, ArrowDown, Info } from 'lucide-react';
import { useState } from 'react';

export default function ArchitectureView() {
    const [hoveredSection, setHoveredSection] = useState<string | null>(null);

    const Block = ({ id, icon: Icon, title, desc, color }: any) => {
        const isHovered = hoveredSection === id;
        return (
            <div
                className={`relative bg-zinc-900 border transition-all duration-300 p-3 rounded w-full flex items-center justify-center gap-3 cursor-help group ${isHovered ? 'border-blue-500 shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]' : 'border-zinc-800'}`}
                onMouseEnter={() => setHoveredSection(id)}
                onMouseLeave={() => setHoveredSection(null)}
            >
                <Icon className={`w-4 h-4 transition-colors ${isHovered ? 'text-blue-400' : color}`} />
                <span className={`text-sm font-medium transition-colors ${isHovered ? 'text-zinc-100' : 'text-zinc-400'}`}>{title}</span>

                {isHovered && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 w-64 p-3 bg-zinc-950 border border-blue-500/30 rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-left-2">
                        <h4 className="text-blue-400 text-xs font-bold uppercase mb-1">{title}</h4>
                        <p className="text-zinc-400 text-xs leading-relaxed">{desc}</p>
                        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-8 border-transparent border-r-zinc-950"></div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-6 text-zinc-400 overflow-y-auto relative">
            <div className="absolute top-4 right-4 flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800">
                <Info className="w-3 h-3 text-blue-500" />
                Hover blocks for details
            </div>

            <h3 className="text-zinc-100 font-semibold mb-8">GPT Architecture (Simplified)</h3>

            <div className="flex flex-col items-center space-y-3 w-full max-w-sm relative">
                {/* Input Embedding */}
                <Block
                    id="embedding"
                    icon={Database}
                    title="Input Embeddings"
                    desc="Converts raw text tokens into dense numerical vectors. Adds positional information so the model knows the order of words."
                    color="text-blue-500"
                />

                <ArrowDown className="w-4 h-4 text-zinc-700 animate-bounce" />

                {/* Transformer Blocks */}
                <div
                    className="bg-zinc-900/50 border border-dashed border-zinc-700 p-4 rounded-xl w-full space-y-3 relative"
                >
                    <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 font-mono rotate-90 origin-left">Nx Layes</div>

                    <Block
                        id="attention"
                        icon={Network}
                        title="Multi-Head Attention"
                        desc="The core 'brain'. Allows the model to look at other words in the sentence to understand context (e.g., matching 'bank' with 'money')."
                        color="text-yellow-500"
                    />

                    <Block
                        id="ffn"
                        icon={Cpu}
                        title="Feed Forward Network"
                        desc="Process the information gathered by attention. Think of this as the memory or knowledge processing step."
                        color="text-green-500"
                    />
                </div>

                <ArrowDown className="w-4 h-4 text-zinc-700 animate-bounce" />

                {/* Output Head */}
                <Block
                    id="head"
                    icon={Database}
                    title="Output Head"
                    desc="Converts the final vectors back into probability scores for every word in the vocabulary."
                    color="text-red-500"
                />

                <ArrowDown className="w-4 h-4 text-zinc-700" />

                <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-medium">
                    Output Probabilities
                </div>
            </div>
        </div>
    );
}
