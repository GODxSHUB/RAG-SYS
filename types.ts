export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export enum FileType {
  TEXT = 'text',
  IMAGE = 'image',
}

export interface RagDocument {
  id: string;
  name: string;
  type: FileType;
  content: string; // Plain text or Base64 string
  mimeType: string;
  size: number;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}
