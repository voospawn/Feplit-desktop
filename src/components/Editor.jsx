import React, { useEffect, useRef, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import { useParams } from 'react-router-dom';
import useProjectStore from '../store/projectStore';
import { CompilerOutput } from './CompilerOutput';
import { Toolbar } from './Toolbar';
import { marked } from 'marked';
import hljs from 'highlight.js';
import { runCode } from '../services/languageRunner';

export function Editor() {
  const { projectId } = useParams();
  const editorRef = useRef(null);
  const { currentProject } = useProjectStore();
  const [output, setOutput] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [markdownHtml, setMarkdownHtml] = useState('');

  useEffect(() => {
    if (!editorRef.current || !projectId || !currentProject) return;

    const doc = new Y.Doc();
    const provider = new WebsocketProvider(
      'wss://your-collaboration-server.com',
      projectId,
      doc
    );
    const type = doc.getText('monaco');

    const binding = new MonacoBinding(
      type,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );

    return () => {
      binding.destroy();
      provider.destroy();
      doc.destroy();
    };
  }, [projectId, currentProject]);

  useEffect(() => {
    if (currentProject?.language === 'markdown' && editorRef.current) {
      const content = editorRef.current.getValue();
      const html = marked(content, {
        highlight: (code, lang) => {
          if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
          }
          return hljs.highlightAuto(code).value;
        }
      });
      setMarkdownHtml(html);
    }
  }, [currentProject]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleRun = async () => {
    if (!editorRef.current || !currentProject) return;
    
    const code = editorRef.current.getValue();
    setIsCompiling(true);
    setError('');
    
    try {
      const result = await runCode(currentProject.language, code);
      setOutput(result?.toString() || 'Execution completed');
    } catch (err) {
      setError(err.toString());
    } finally {
      setIsCompiling(false);
    }
  };

  if (!currentProject) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col h-[600px]">
        <Toolbar 
          onRun={handleRun}
          isCompiling={isCompiling}
          language={currentProject.language}
          onTogglePreview={() => setShowPreview(!showPreview)}
          showPreview={showPreview}
        />
        <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden">
          <MonacoEditor
            height="100%"
            language={currentProject.language}
            theme="vs-dark"
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              automaticLayout: true
            }}
          />
        </div>
      </div>
      {currentProject.language === 'markdown' && showPreview ? (
        <div 
          className="h-[600px] bg-gray-800 rounded-lg p-4 overflow-auto prose prose-invert"
          dangerouslySetInnerHTML={{ __html: markdownHtml }}
        />
      ) : (
        <CompilerOutput 
          output={output}
          error={error}
          isCompiling={isCompiling}
          language={currentProject.language}
        />
      )}
    </div>
  );
}