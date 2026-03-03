// src/utils/fetchMetadata.ts

interface Metadata {
  title: string;
  description: string;
  image?: string;
}

export async function fetchMetadata(url: string): Promise<Metadata | null> {
  try {
    // Validate URL first
    new URL(url);
    
    const apiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }
    
    const data = await response.json();
    
    if (data.status === 'success' && data.data) {
      return {
        title: data.data.title || '',
        description: data.data.description || '',
        image: data.data.image?.url || undefined
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
}