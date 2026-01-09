import { RagDocument, FileType } from '../types';

export const generateId = (): string => Math.random().toString(36).substring(2, 9);

export const readFile = (file: File): Promise<RagDocument> => {
  return new Promise((resolve, reject) => {
    const isImage = file.type.startsWith('image/');
    const reader = new FileReader();

    reader.onload = () => {
      let content = reader.result as string;
      
      // For images, we keep the base64 data URL initially to display, 
      // but strictly we might want to strip the prefix for the API later.
      // For text, it's just the string.
      
      resolve({
        id: generateId(),
        name: file.name,
        type: isImage ? FileType.IMAGE : FileType.TEXT,
        content: content,
        mimeType: file.type || 'text/plain',
        size: file.size
      });
    };

    reader.onerror = () => reject(new Error('Failed to read file'));

    if (isImage) {
      reader.readAsDataURL(file);
    } else {
      // Default to text for code, txt, md, etc.
      reader.readAsText(file);
    }
  });
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};