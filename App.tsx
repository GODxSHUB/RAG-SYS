import React, { useState, useCallback } from 'react';
import { RagSidebar } from './components/RagSidebar';
import { ChatArea } from './components/ChatArea';
import { RagDocument, Message, Role } from './types';
import { readFile, generateId } from './utils/fileUtils';
import { generateRagResponse } from './services/geminiService';

const App: React.FC = () => {
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle File Uploads
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newDocs: RagDocument[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        try {
          const doc = await readFile(e.target.files[i]);
          newDocs.push(doc);
        } catch (err) {
          console.error("Error reading file:", err);
          alert(`Could not read file ${e.target.files[i].name}`);
        }
      }
      setDocuments(prev => [...prev, ...newDocs]);
    }
  }, []);

  // Remove Document
  const handleRemoveDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  }, []);

  // Send Message
  const handleSendMessage = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: generateId(),
      role: Role.USER,
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Placeholder for stream
    const modelMsgId = generateId();
    const initialModelMsg: Message = {
      id: modelMsgId,
      role: Role.MODEL,
      text: '',
      timestamp: new Date(),
      isStreaming: true
    };
    
    setMessages(prev => [...prev, initialModelMsg]);

    try {
        await generateRagResponse(
            messages, // pass current history including the new userMsg (implied in logic)
            documents,
            userMsg.text,
            (streamedText) => {
                setMessages(prev => prev.map(msg => 
                    msg.id === modelMsgId ? { ...msg, text: streamedText } : msg
                ));
            }
        );
    } catch (error) {
        setMessages(prev => prev.map(msg => 
            msg.id === modelMsgId ? { ...msg, text: "Error generating response. Please check your API key or connection." } : msg
        ));
    } finally {
        setIsLoading(false);
        setMessages(prev => prev.map(msg => 
            msg.id === modelMsgId ? { ...msg, isStreaming: false } : msg
        ));
    }
  }, [input, isLoading, messages, documents]);

  return (
    <div className="flex h-screen w-screen bg-[#0f1115] overflow-hidden">
      {/* Sidebar for Knowledge Base */}
      <RagSidebar 
        documents={documents}
        onUpload={handleFileUpload}
        onRemove={handleRemoveDocument}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        <header className="h-14 border-b border-gray-800 flex items-center px-6 justify-between bg-gray-900/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-mono text-gray-400">Gemini-3-Flash Connected</span>
          </div>
          <div className="text-xs text-gray-500 font-mono">
            Mode: In-Context RAG
          </div>
        </header>

        <ChatArea messages={messages} isLoading={isLoading} />

        {/* Input Area */}
        <div className="p-4 bg-gray-900/80 border-t border-gray-800 backdrop-blur-md">
          <form 
            onSubmit={handleSendMessage}
            className="max-w-4xl mx-auto relative flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question based on your documents..."
                className="w-full bg-gray-800 text-white border-0 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-indigo-500 shadow-lg placeholder-gray-500"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                ENTER
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`
                p-3 rounded-xl transition-all shadow-lg flex items-center justify-center
                ${!input.trim() || isLoading 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-105 active:scale-95'
                }
              `}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
          <div className="text-center mt-2">
             <p className="text-[10px] text-gray-600">
               Note: This system uses Gemini's Long Context window to simulate RAG. Uploading large files consumes tokens.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;