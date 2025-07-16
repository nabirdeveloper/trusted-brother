import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const uploadsDir = path.join(__dirname, '..', '..', 'public', 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Function to handle file upload
export async function filterUpload(file: File | Blob): Promise<{ url: string; success: boolean }> {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  
  // Get file name and extension
  const filename = `upload-${uniqueSuffix}${file instanceof File ? path.extname(file.name) : '.bin'}`;
  const filePath = path.join(uploadsDir, filename);

  // Convert blob to buffer
  const buffer = await file.arrayBuffer();

  // Write file to disk
  await fs.promises.writeFile(filePath, Buffer.from(buffer));

  // Return the URL and success status
  return {
    url: `/uploads/${filename}`,
    success: true
  };
}

// Set up multer storage
export const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    if (file.mimetype.startsWith('img/')) {
      cb(null, file.originalname);
    } else {
      cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
    }
  }
});