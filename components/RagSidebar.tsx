import React from 'react';
import { RagDocument, FileType } from '../types';
import { formatBytes } from '../utils/fileUtils';

interface RagSidebarProps {
  documents: RagDocument[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (id: string) => void;
}

export const RagSidebar: React.FC<RagSidebarProps> = ({ documents, onUpload, onRemove }) => {
  return (
    <div className="w-full md:w-80 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          Knowledge Base
        </h2>
        <p className="text-xs text-gray-500 mt-2">
          Upload files to train the current session context.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {documents.length === 0 && (
          <div className="text-center py-10 text-gray-600 border-2 border-dashed border-gray-800 rounded-xl">
            <p className="text-sm">No documents uploaded.</p>
          </div>
        )}

        {documents.map((doc) => (
          <div key={doc.id} className="group relative bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-indigo-500 transition-all">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-md ${doc.type === FileType.IMAGE ? 'bg-purple-900/30 text-purple-400' : 'bg-blue-900/30 text-blue-400'}`}>
                {doc.type === FileType.IMAGE ? (
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                   </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">{doc.name}</p>
                <p className="text-xs text-gray-500">{formatBytes(doc.size)}</p>
              </div>
              <button 
                onClick={() => onRemove(doc.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {doc.type === FileType.IMAGE && (
              <div className="mt-2 rounded-md overflow-hidden h-20 w-full bg-black/20">
                <img src={doc.content} alt="preview" className="w-full h-full object-cover opacity-70" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-800/50 hover:bg-gray-800 hover:border-indigo-500 transition-all">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400 mb-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-xs text-gray-400"><span className="font-semibold">Click to upload</span> docs/images</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            onChange={onUpload}
            multiple
            accept=".txt,.md,.json,.csv,.js,.jsx,.ts,.tsx,.py,.html,.css,.png,.jpg,.jpeg,.webp"
          />
        </label>
        <p className="text-[10px] text-center text-gray-600 mt-2">
          Supports text, code, and images.
        </p>
      </div>
    </div>
  );
};