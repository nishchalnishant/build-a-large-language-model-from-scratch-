import { useEffect, useRef } from "react";

interface TerminalProps {
    logs: string[];
}

export default function Terminal({ logs }: TerminalProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="h-full bg-black font-mono text-sm p-4 overflow-auto text-stone-300">
            {logs.map((log, i) => (
                <div key={i} className="whitespace-pre-wrap break-all mb-1 border-b border-stone-900 pb-1 last:border-0 layer">
                    <span className="text-green-500 mr-2">$</span>
                    {log}
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
}
