
import { useState } from 'react';
import { Search, Book } from 'lucide-react';

const TERMS = [
    {
        term: "Transformer",
        category: "LLM",
        definition: "A deep learning architecture based on self-attention, serving as the backbone for models like GPT and BERT.",
        details: "Transformers process input data in parallel (unlike RNNs) and rely on attention mechanisms to capture long-range dependencies in text."
    },
    {
        term: "Self-Attention",
        category: "LLM",
        definition: "A mechanism allowing the model to weigh the relevance of different words in a sequence to each other.",
        details: "It calculates 'query', 'key', and 'value' vectors for each token to determine how much focus to put on other tokens when processing the current one."
    },
    {
        term: "Embedding",
        category: "LLM",
        definition: "A vector representation of text where semantically similar words are close in vector space.",
        details: "Embeddings turn discrete tokens (integers) into continuous vectors that neural networks can process mathematically."
    },
    {
        term: "Token",
        category: "LLM",
        definition: "The fundamental unit of text (word, subword, or char) processed by the model.",
        details: "GPT-4, for example, has a vocabulary size of over 100,000 distinct tokens."
    },
    {
        term: "Temperature",
        category: "LLM",
        definition: "A hyperparameter controlling the randomness of predictions.",
        details: "Lower values (e.g., 0.1) make the model deterministic (greedy sampling), while higher values (e.g., 1.0) increase diversity."
    },
    {
        term: "Agent",
        category: "Agent",
        definition: "An AI system that uses an LLM as a brain to perceive, reason, and act to achieve goals.",
        details: "Agents go beyond simple Q&A by actively interacting with environments, using tools, and maintaining state."
    },
    {
        term: "Chain of Thought",
        category: "Agent",
        definition: "A technique prompting the model to produce intermediate reasoning steps.",
        details: "By outputting its 'thought process', the model often avoids logical errors in complex tasks."
    },
    {
        term: "ReAct",
        category: "Agent",
        definition: "Combine Reasoning and Acting in an iterative loop.",
        details: "The agent generates a Thought, performs an Action (tool use), receives an Observation, and repeats."
    },
    {
        term: "Tool Use",
        category: "Agent",
        definition: "The capability of an LLM to call external functions/APIs.",
        details: "This creates a bridge between the frozen weights of the model and the dynamic real world (e.g., searching the web)."
    },
    {
        term: "Hallucination",
        category: "Key Concept",
        definition: "Confident generation of false or non-existent information.",
        details: "Since LLMs are probabilistic token predictors, they can construct plausible-sounding but factually wrong sentences."
    }
];

export default function GlossaryView() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

    const filteredTerms = TERMS.filter(t =>
        t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeItem = TERMS.find(t => t.term === selectedTerm) || (filteredTerms.length > 0 ? filteredTerms[0] : null);

    return (
        <div className="h-full flex flex-col bg-[#09090b] text-zinc-100">
            <div className="p-4 border-b border-zinc-900 bg-[#0c0c0e]">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search glossary..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-zinc-600"
                    />
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* List */}
                <div className="w-1/3 border-r border-zinc-900 overflow-y-auto">
                    {filteredTerms.map((item) => (
                        <button
                            key={item.term}
                            onClick={() => setSelectedTerm(item.term)}
                            className={`w-full text-left p-3 border-b border-zinc-900/50 hover:bg-zinc-900 transition-colors ${selectedTerm === item.term || (!selectedTerm && activeItem?.term === item.term) ? 'bg-blue-500/10 border-l-2 border-l-blue-500' : 'border-l-2 border-l-transparent'}`}
                        >
                            <div className="font-medium text-sm text-zinc-200">{item.term}</div>
                            <div className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">{item.category}</div>
                        </button>
                    ))}
                    {filteredTerms.length === 0 && (
                        <div className="p-4 text-center text-zinc-500 text-sm">No terms found.</div>
                    )}
                </div>

                {/* Details */}
                <div className="flex-1 p-6 overflow-y-auto bg-zinc-950/50">
                    {activeItem ? (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                    <Book className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-zinc-100">{activeItem.term}</h2>
                                    <span className="text-xs font-mono text-blue-400 bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10">
                                        {activeItem.category}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Definition</h4>
                                    <p className="text-zinc-300 leading-relaxed text-sm bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                                        {activeItem.definition}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Key Details</h4>
                                    <p className="text-zinc-400 leading-relaxed text-sm">
                                        {activeItem.details}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-zinc-600">
                            Select a term to view details
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
