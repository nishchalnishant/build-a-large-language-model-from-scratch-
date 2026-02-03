import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { parseContentByMode, type LearningMode } from '../../lib/contentParser';
import 'highlight.js/styles/atom-one-dark.css';

interface GuideRendererProps {
    content: string;
    learningMode?: LearningMode;
}

export default function GuideRenderer({ content, learningMode = 'shallow' }: GuideRendererProps) {
    // Parse content based on learning mode
    const filteredContent = parseContentByMode(content, learningMode);

    return (
        <div className="prose prose-invert prose-slate max-w-none prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    a: ({ node, ...props }) => <a {...props} className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer" />
                }}
            >
                {filteredContent}
            </ReactMarkdown>
        </div>
    )
}
