export type LearningMode = 'shallow' | 'deep';

/**
 * Parses markdown content and filters it based on learning mode
 * 
 * Content should be marked with HTML comments:
 * <!-- SHALLOW --> ... <!-- /SHALLOW -->
 * <!-- DEEP --> ... <!-- /DEEP -->
 * 
 * Content without markers is included in both modes
 */
export function parseContentByMode(markdown: string, mode: LearningMode): string {
    const lines = markdown.split('\n');
    const result: string[] = [];
    let currentMode: 'shallow' | 'deep' | 'both' = 'both';
    let skipDepth = 0; // Track nesting depth for skipped sections

    for (const line of lines) {
        const trimmed = line.trim();

        // Handle mode markers
        if (trimmed === '<!-- SHALLOW -->') {
            if (mode === 'shallow') {
                currentMode = 'shallow';
            } else {
                skipDepth++;
            }
            continue;
        }

        if (trimmed === '<!-- DEEP -->') {
            if (mode === 'deep') {
                currentMode = 'deep';
            } else {
                skipDepth++;
            }
            continue;
        }

        if (trimmed === '<!-- /SHALLOW -->' || trimmed === '<!-- /DEEP -->') {
            if (skipDepth > 0) {
                skipDepth--;
            } else {
                currentMode = 'both';
            }
            continue;
        }

        // Include line if we're not in a skipped section
        if (skipDepth === 0 && (currentMode === 'both' || currentMode === mode)) {
            result.push(line);
        }
    }

    return result.join('\n');
}

/**
 * Persists learning mode preference to localStorage
 */
export function saveLearningMode(mode: LearningMode): void {
    localStorage.setItem('learning-mode', mode);
}

/**
 * Retrieves learning mode preference from localStorage
 * Defaults to 'shallow' if not set
 */
export function loadLearningMode(): LearningMode {
    const stored = localStorage.getItem('learning-mode');
    return (stored === 'deep' ? 'deep' : 'shallow') as LearningMode;
}
