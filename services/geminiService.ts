import { GoogleGenAI } from "@google/genai";
import { RagDocument, FileType, Message, Role } from "../types";

// Initialize the API client
// We assume process.env.API_KEY is available as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-3-flash-preview";

export const generateRagResponse = async (
  currentHistory: Message[],
  documents: RagDocument[],
  userPrompt: string,
  onStream: (text: string) => void
): Promise<string> => {
  
  // 1. Construct the system instruction / context from documents.
  // In a true RAG, we would vector search these. 
  // Here, we use Long Context injection (In-Context Learning).
  
  const textDocs = documents.filter(d => d.type === FileType.TEXT);
  const imageDocs = documents.filter(d => d.type === FileType.IMAGE);

  // Prepare the content parts for the prompt
  const contents = [];

  // Add text documents as context blocks
  let contextBlock = "Here is the available Knowledge Base / Context for your reference:\n\n";
  
  if (textDocs.length > 0) {
    textDocs.forEach((doc, index) => {
      contextBlock += `--- Document ${index + 1}: ${doc.name} ---\n${doc.content}\n\n`;
    });
    contents.push({ text: contextBlock });
  } else {
    contents.push({ text: "No text documents loaded in knowledge base.\n" });
  }

  // Add image documents
  // Note: Gemini expects raw base64 data without the "data:image/png;base64," prefix for inlineData
  imageDocs.forEach(doc => {
    const base64Data = doc.content.split(',')[1]; 
    if (base64Data) {
        contents.push({
            inlineData: {
                mimeType: doc.mimeType,
                data: base64Data
            }
        });
    }
  });

  // Add Chat History (Simplified for this demo to just previous Q/A or just append to prompt)
  // For a robust app, we'd map `currentHistory` to Content objects.
  // To keep context window usage efficient, let's append the last few messages or rely on the prompt context.
  let conversationContext = "\n\nConversation History:\n";
  currentHistory.slice(-6).forEach(msg => {
     conversationContext += `${msg.role === Role.USER ? 'User' : 'Model'}: ${msg.text}\n`;
  });
  contents.push({ text: conversationContext });

  // Add the actual user prompt
  contents.push({ text: `\nUser's Current Question: ${userPrompt}\n\nAnswer the user's question based strictly on the provided documents/context above if applicable. If the answer is not in the context, use your general knowledge but mention that it wasn't found in the docs.` });

  try {
    const responseStream = await ai.models.generateContentStream({
      model: MODEL_NAME,
      contents: [{ parts: contents }],
      config: {
        systemInstruction: "You are an advanced RAG (Retrieval Augmented Generation) assistant. You analyze uploaded documents and images to provide fact-based answers.",
      }
    });

    let fullText = "";
    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onStream(fullText);
      }
    }
    return fullText;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
