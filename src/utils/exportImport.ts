import { Resource } from '../types';

// Export resources as JSON
export function exportAsJSON(resources: Resource[], filename: string = 'resources.json') {
  const dataStr = JSON.stringify(resources, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  downloadFile(dataBlob, filename);
}

// Export resources as CSV
export function exportAsCSV(resources: Resource[], filename: string = 'resources.csv') {
  // CSV headers
  const headers = ['Name', 'URL', 'Description', 'Category', 'Tags', 'Created At'];
  
  // Convert resources to CSV rows
  const rows = resources.map(resource => [
    escapeCsvField(resource.name),
    escapeCsvField(resource.url),
    escapeCsvField(resource.description),
    escapeCsvField(resource.category),
    escapeCsvField(resource.tags.join(', ')),
    resource.createdAt?.toDate?.()?.toISOString() || ''
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const dataBlob = new Blob([csvContent], { type: 'text/csv' });
  downloadFile(dataBlob, filename);
}

// Helper: Escape CSV fields (handle commas, quotes, newlines)
function escapeCsvField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

// Helper: Trigger file download
function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Validate imported JSON data
export function validateImportedData(data: any): { valid: boolean; error?: string } {
  if (!Array.isArray(data)) {
    return { valid: false, error: 'Invalid format: Expected an array of resources' };
  }
  
  for (let i = 0; i < data.length; i++) {
    const resource = data[i];
    
    if (!resource.name || typeof resource.name !== 'string') {
      return { valid: false, error: `Resource ${i + 1}: Missing or invalid name` };
    }
    
    if (!resource.url || typeof resource.url !== 'string') {
      return { valid: false, error: `Resource ${i + 1}: Missing or invalid URL` };
    }
    
    if (!resource.description || typeof resource.description !== 'string') {
      return { valid: false, error: `Resource ${i + 1}: Missing or invalid description` };
    }
    
    if (!resource.category || typeof resource.category !== 'string') {
      return { valid: false, error: `Resource ${i + 1}: Missing or invalid category` };
    }
    
    if (!Array.isArray(resource.tags)) {
      return { valid: false, error: `Resource ${i + 1}: Tags must be an array` };
    }
  }
  
  return { valid: true };
}

// Parse imported JSON file
export async function parseImportFile(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        resolve(data);
      } catch (error) {
        reject(new Error('Failed to parse JSON file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}