import { useState, useEffect } from 'react';
import { BookOpen, GraduationCap } from 'lucide-react';

type LearningMode = 'shallow' | 'deep';

interface LearningModeToggleProps {
    value: LearningMode;
    onChange: (mode: LearningMode) => void;
}

export default function LearningModeToggle({ value, onChange }: LearningModeToggleProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        // Show tooltip on first visit
        const hasSeenTooltip = localStorage.getItem('learning-mode-tooltip-seen');
        if (!hasSeenTooltip) {
            setShowTooltip(true);
            const timer = setTimeout(() => {
                setShowTooltip(false);
                localStorage.setItem('learning-mode-tooltip-seen', 'true');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <div className="relative flex items-center gap-3">
            {/* Toggle Switch */}
            <button
                onClick={() => onChange(value === 'shallow' ? 'deep' : 'shallow')}
                className="relative inline-flex h-7 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
                style={{ backgroundColor: value === 'deep' ? '#3b82f6' : '#52525b' }}
            >
                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${value === 'deep' ? 'translate-x-9' : 'translate-x-1'
                        }`}
                />
            </button>

            {/* Labels */}
            <div className="flex items-center gap-2">
                <BookOpen className={`w-4 h-4 transition-colors ${value === 'shallow' ? 'text-zinc-400' : 'text-zinc-600'}`} />
                <span className={`text-xs font-medium transition-colors ${value === 'shallow' ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    Quick
                </span>
                <span className="text-zinc-700">|</span>
                <GraduationCap className={`w-4 h-4 transition-colors ${value === 'deep' ? 'text-blue-400' : 'text-zinc-600'}`} />
                <span className={`text-xs font-medium transition-colors ${value === 'deep' ? 'text-blue-300' : 'text-zinc-600'}`}>
                    Deep
                </span>
            </div>

            {/* Tooltip */}
            {showTooltip && (
                <div className="absolute top-full left-0 mt-2 w-64 p-3 bg-zinc-900 border border-blue-500/30 rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
                    <p className="text-xs text-zinc-300 leading-relaxed">
                        <span className="text-blue-400 font-semibold">Quick:</span> High-level overview (5-10 min)
                        <br />
                        <span className="text-blue-400 font-semibold">Deep:</span> Comprehensive details (20-30 min)
                    </p>
                </div>
            )}
        </div>
    );
}
