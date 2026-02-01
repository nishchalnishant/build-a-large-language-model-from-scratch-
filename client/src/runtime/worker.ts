/* eslint-disable no-restricted-globals */
/// <reference lib="webworker" />
// We use the CDN to avoid bundling issues with wasm files

// Global error handler for the worker
self.onerror = function (e: any) {
    self.postMessage({ type: 'error', message: `Worker Global Error: ${e.message} (${e.filename}:${e.lineno})` });
};


// @ts-ignore
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.mjs";

let pyodide: any = null;

async function loadPyodideAndPackages() {
    try {
        self.postMessage({ type: 'status', message: 'Initializing Pyodide Runtime...' });
        // @ts-ignore
        pyodide = await loadPyodide();

        self.postMessage({ type: 'status', message: 'Loading Python dependencies (numpy, micropip)...' });
        await pyodide.loadPackage(["numpy", "micropip"]);

        self.postMessage({ type: 'status', message: 'Pyodide Runtime Ready.' });
    } catch (e: any) {
        self.postMessage({ type: 'error', message: `Pyodide Init Failed: ${e.message}` });
    }
}

loadPyodideAndPackages();

self.onmessage = async (event) => {
    const { code } = event.data;
    if (!pyodide) {
        self.postMessage({ type: 'error', message: 'Pyodide is still loading... please wait.' });
        return;
    }

    try {
        // Capture stdout
        pyodide.setStdout({ batched: (msg: string) => self.postMessage({ type: 'output', message: msg }) });
        pyodide.setStderr({ batched: (msg: string) => self.postMessage({ type: 'error', message: msg }) });

        self.postMessage({ type: 'status', message: 'Exec: Running...' });

        // Execute code
        await pyodide.runPythonAsync(code);

        self.postMessage({ type: 'status', message: 'Exec: Completed.' });
    } catch (err: any) {
        self.postMessage({ type: 'error', message: err.toString() });
    }
};
