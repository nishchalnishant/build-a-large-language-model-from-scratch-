import Editor, { type OnMount } from "@monaco-editor/react";
import { useRef } from "react";
import { Play } from "lucide-react";

interface CodeEditorProps {
    initialCode?: string;
    onRun?: (code: string) => void;
}

export default function CodeEditor({ initialCode = "# Write your Python code here\nprint('Hello World')", onRun }: CodeEditorProps) {
    const editorRef = useRef<any>(null);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;

        // Add Cmd+Enter to run
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
            if (onRun) {
                onRun(editor.getValue());
            }
        });
    };

    const handleRunClick = () => {
        if (editorRef.current && onRun) {
            onRun(editorRef.current.getValue());
        }
    }

    return (
        <div className="h-full flex flex-col bg-[#1e1e1e]">
            <div className="flex justify-between items-center px-4 py-2 bg-[#2d2d2d] border-b border-black">
                <span className="text-xs text-stone-400">main.py</span>
                <button
                    onClick={handleRunClick}
                    className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                >
                    <Play className="w-3 h-3 fill-current" /> Run
                </button>
            </div>
            <div className="flex-1 overflow-hidden">
                <Editor
                    height="100%"
                    defaultLanguage="python"
                    defaultValue={initialCode}
                    theme="vs-dark"
                    onMount={handleEditorDidMount}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                    }}
                />
            </div>
        </div>
    );
}
