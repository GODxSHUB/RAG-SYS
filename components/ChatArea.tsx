import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Role } from '../types';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center opacity-40 select-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-24 h-24 mb-4 text-indigo-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-300">NeuroRag System</h1>
          <p className="text-gray-500 mt-2 max-w-md text-center">
            Upload documents or images to the Knowledge Base on the left, then ask questions. 
            The system uses the context to answer factually.
          </p>
        </div>
      )}

      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}>
          <div 
            className={`
              max-w-[85%] rounded-2xl px-5 py-4 shadow-sm
              ${msg.role === Role.USER 
                ? 'bg-indigo-600 text-white rounded-br-sm' 
                : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-sm'
              }
            `}
          >
            {msg.role === Role.MODEL && (
               <div className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold mb-1 opacity-75">
                  AI Response
               </div>
            )}
            
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
           <div className="bg-gray-800 text-gray-200 border border-gray-700 rounded-2xl rounded-bl-sm px-5 py-4 flex items-center gap-2">
             <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
             <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
             <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
           </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};