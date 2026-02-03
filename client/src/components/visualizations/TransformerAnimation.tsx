import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

type TransformerType = 'decoder' | 'encoder' | 'encoder-decoder';

export default function TransformerAnimation() {
    const [selectedType, setSelectedType] = useState<TransformerType>('decoder');
    const [isPlaying, setIsPlaying] = useState(false);
    const [step, setStep] = useState(0);

    // Animation loop
    useEffect(() => {
        if (!isPlaying) return;

        const timer = setInterval(() => {
            setStep((prev) => (prev + 1) % 12);
        }, 800);

        return () => clearInterval(timer);
    }, [isPlaying]);

    const reset = () => {
        setStep(0);
        setIsPlaying(false);
    };

    return (
        <div className="h-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-8 flex flex-col">
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-zinc-100 mb-4">Transformer Architecture Visualization</h3>

                {/* Architecture Type Selector */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => { setSelectedType('decoder'); reset(); }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedType === 'decoder'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                            }`}
                    >
                        Decoder-Only (GPT)
                    </button>
                    <button
                        onClick={() => { setSelectedType('encoder'); reset(); }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedType === 'encoder'
                                ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                            }`}
                    >
                        Encoder-Only (BERT)
                    </button>
                    <button
                        onClick={() => { setSelectedType('encoder-decoder'); reset(); }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedType === 'encoder-decoder'
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                            }`}
                    >
                        Encoder-Decoder (T5)
                    </button>
                </div>

                {/* Controls */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <button
                        onClick={reset}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </button>
                </div>
            </div>

            {/* Visualization Area */}
            <div className="flex-1 relative border border-zinc-800 rounded-lg bg-zinc-950/50 overflow-hidden">
                {selectedType === 'decoder' && <DecoderAnimation step={step} />}
                {selectedType === 'encoder' && <EncoderAnimation step={step} />}
                {selectedType === 'encoder-decoder' && <EncoderDecoderAnimation step={step} />}
            </div>

            {/* Step Indicator */}
            <div className="mt-4 text-sm text-zinc-400 text-center">
                Step: {step + 1} / 12 - {getStepDescription(selectedType, step)}
            </div>
        </div>
    );
}

function DecoderAnimation({ step }: { step: number }) {
    const tokens = ['The', 'cat', 'sat', '→'];
    const activeToken = Math.min(step % 4, 3);

    return (
        <div className="h-full flex flex-col items-center justify-center p-8">
            {/* Input Tokens */}
            <div className="mb-8">
                <div className="text-xs text-zinc-500 mb-2 text-center">Input Tokens</div>
                <div className="flex gap-2">
                    {tokens.map((token, i) => (
                        <div
                            key={i}
                            className={`px-4 py-2 rounded-lg font-mono transition-all ${i <= activeToken
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50 scale-110'
                                    : 'bg-zinc-800 text-zinc-500'
                                }`}
                        >
                            {token}
                        </div>
                    ))}
                </div>
            </div>

            {/* Causal Mask Visualization */}
            <div className="mb-8">
                <div className="text-xs text-zinc-500 mb-2 text-center">Causal Attention Mask</div>
                <div className="grid grid-cols-4 gap-1">
                    {Array.from({ length: 16 }).map((_, i) => {
                        const row = Math.floor(i / 4);
                        const col = i % 4;
                        const isAttending = col <= row && row <= activeToken;
                        const isActive = row === activeToken && col <= activeToken;

                        return (
                            <div
                                key={i}
                                className={`w-8 h-8 rounded transition-all ${isActive
                                        ? 'bg-blue-500 shadow-lg shadow-blue-500/50'
                                        : isAttending
                                            ? 'bg-blue-900/50'
                                            : 'bg-zinc-800/30'
                                    }`}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Decoder Blocks */}
            <div className="space-y-4">
                {[1, 2, 3].map((layer) => (
                    <div
                        key={layer}
                        className={`px-6 py-3 rounded-lg border transition-all ${step >= layer * 3
                                ? 'bg-blue-950/50 border-blue-700 shadow-lg shadow-blue-500/20'
                                : 'bg-zinc-900/50 border-zinc-800'
                            }`}
                    >
                        <div className="text-sm text-zinc-300">Decoder Block {layer}</div>
                        <div className="text-xs text-zinc-500">Causal Self-Attention + FFN</div>
                    </div>
                ))}
            </div>

            {/* Output */}
            <div className="mt-8">
                <div className="text-xs text-zinc-500 mb-2 text-center">Next Token Prediction</div>
                <div className={`px-6 py-3 rounded-lg font-mono transition-all ${step >= 10
                        ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}>
                    "on"
                </div>
            </div>
        </div>
    );
}

function EncoderAnimation({ step }: { step: number }) {
    const tokens = ['[CLS]', 'Hello', 'world', '[SEP]'];
    const highlightedToken = step % 4;

    return (
        <div className="h-full flex flex-col items-center justify-center p-8">
            {/* Input */}
            <div className="mb-8">
                <div className="text-xs text-zinc-500 mb-2 text-center">Input Tokens</div>
                <div className="flex gap-2">
                    {tokens.map((token, i) => (
                        <div
                            key={i}
                            className={`px-4 py-2 rounded-lg font-mono transition-all ${i === highlightedToken
                                    ? 'bg-green-600 text-white shadow-lg shadow-green-500/50 scale-110'
                                    : 'bg-zinc-800 text-zinc-300'
                                }`}
                        >
                            {token}
                        </div>
                    ))}
                </div>
            </div>

            {/* Bidirectional Attention Matrix */}
            <div className="mb-8">
                <div className="text-xs text-zinc-500 mb-2 text-center">Bidirectional Attention (All-to-All)</div>
                <div className="grid grid-cols-4 gap-1">
                    {Array.from({ length: 16 }).map((_, i) => {
                        const row = Math.floor(i / 4);
                        const isActive = row === highlightedToken || i % 4 === highlightedToken;

                        return (
                            <div
                                key={i}
                                className={`w-8 h-8 rounded transition-all ${isActive
                                        ? 'bg-green-500 shadow-lg shadow-green-500/50'
                                        : 'bg-green-900/30'
                                    }`}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Encoder Blocks */}
            <div className="space-y-4 mb-8">
                {[1, 2, 3].map((layer) => (
                    <div
                        key={layer}
                        className={`px-6 py-3 rounded-lg border transition-all ${step >= layer * 3
                                ? 'bg-green-950/50 border-green-700 shadow-lg shadow-green-500/20'
                                : 'bg-zinc-900/50 border-zinc-800'
                            }`}
                    >
                        <div className="text-sm text-zinc-300">Encoder Block {layer}</div>
                        <div className="text-xs text-zinc-500">Bidirectional Self-Attention + FFN</div>
                    </div>
                ))}
            </div>

            {/* Output */}
            <div>
                <div className="text-xs text-zinc-500 mb-2 text-center">[CLS] Token Representation</div>
                <div className={`px-6 py-3 rounded-lg transition-all ${step >= 10
                        ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/50'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}>
                    Classification: Positive
                </div>
            </div>
        </div>
    );
}

function EncoderDecoderAnimation({ step }: { step: number }) {
    const sourceTokens = ['Hello', 'world'];
    const targetTokens = ['Bonjour', '→'];
    const encStep = Math.min(step, 5);
    const decStep = Math.max(0, step - 6);

    return (
        <div className="h-full flex items-center justify-center p-8 gap-12">
            {/* Encoder Side */}
            <div className="flex-1 flex flex-col items-center">
                <div className="text-sm text-purple-400 mb-4 font-semibold">ENCODER</div>

                <div className="mb-6">
                    <div className="text-xs text-zinc-500 mb-2">Source</div>
                    <div className="flex gap-2">
                        {sourceTokens.map((token, i) => (
                            <div
                                key={i}
                                className={`px-4 py-2 rounded-lg font-mono transition-all ${encStep > i
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                                        : 'bg-zinc-800 text-zinc-500'
                                    }`}
                            >
                                {token}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    {[1, 2].map((layer) => (
                        <div
                            key={layer}
                            className={`px-5 py-2 rounded-lg border transition-all ${encStep >= layer * 2
                                    ? 'bg-purple-950/50 border-purple-700'
                                    : 'bg-zinc-900/50 border-zinc-800'
                                }`}
                        >
                            <div className="text-xs text-zinc-400">Encoder {layer}</div>
                        </div>
                    ))}
                </div>

                <div className={`mt-4 px-4 py-2 rounded-lg text-xs transition-all ${encStep >= 5
                        ? 'bg-purple-700 text-white'
                        : 'bg-zinc-900 text-zinc-600'
                    }`}>
                    Context
                </div>
            </div>

            {/* Cross-Attention Arrow */}
            <div className="flex flex-col items-center">
                <div className={`text-4xl transition-all ${step >= 6 ? 'text-purple-500' : 'text-zinc-800'
                    }`}>
                    →
                </div>
                <div className="text-xs text-zinc-500 mt-2">Cross<br />Attention</div>
            </div>

            {/* Decoder Side */}
            <div className="flex-1 flex flex-col items-center">
                <div className="text-sm text-blue-400 mb-4 font-semibold">DECODER</div>

                <div className="mb-6">
                    <div className="text-xs text-zinc-500 mb-2">Target</div>
                    <div className="flex gap-2">
                        {targetTokens.map((token, i) => (
                            <div
                                key={i}
                                className={`px-4 py-2 rounded-lg font-mono transition-all ${decStep > i
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                                        : 'bg-zinc-800 text-zinc-500'
                                    }`}
                            >
                                {token}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    {[1, 2].map((layer) => (
                        <div
                            key={layer}
                            className={`px-5 py-2 rounded-lg border transition-all ${decStep >= layer * 2
                                    ? 'bg-blue-950/50 border-blue-700'
                                    : 'bg-zinc-900/50 border-zinc-800'
                                }`}
                        >
                            <div className="text-xs text-zinc-400">Decoder {layer}</div>
                        </div>
                    ))}
                </div>

                <div className={`mt-4 px-4 py-2 rounded-lg font-mono text-sm transition-all ${decStep >= 5
                        ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
                        : 'bg-zinc-900 text-zinc-600'
                    }`}>
                    "monde"
                </div>
            </div>
        </div>
    );
}

function getStepDescription(type: TransformerType, step: number): string {
    if (type === 'decoder') {
        const descriptions = [
            'Token embedding', 'Positional encoding', 'Layer 1 attention',
            'Layer 1 FFN', 'Layer 2 attention', 'Layer 2 FFN',
            'Layer 3 attention', 'Layer 3 FFN', 'Final layer norm',
            'Output projection', 'Softmax', 'Next token predicted'
        ];
        return descriptions[step] || 'Processing';
    }

    if (type === 'encoder') {
        const descriptions = [
            'Token embedding', 'Positional encoding', 'Layer 1 attention',
            'Layer 1 FFN', 'Layer 2 attention', 'Layer 2 FFN',
            'Layer 3 attention', 'Layer 3 FFN', 'Extract [CLS]',
            'Classification head', 'Softmax', 'Prediction'
        ];
        return descriptions[step] || 'Processing';
    }

    // encoder-decoder
    const descriptions = [
        'Encoder: embed source', 'Encoder: Block 1', 'Encoder: Block 2',
        'Encoder: output context', 'Cross-attention setup', 'Decoder: embed target',
        'Decoder: self-attention', 'Decoder: cross-attention', 'Decoder: FFN',
        'Decoder: Block 2', 'Output projection', 'Translation complete'
    ];
    return descriptions[step] || 'Processing';
}
