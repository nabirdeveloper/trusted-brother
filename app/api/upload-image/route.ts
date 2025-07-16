import { NextResponse } from 'next/server';
import { filterUpload } from '@/lib/file-upload';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return NextResponse.json(
        { error: 'File size too large (max 5MB)' },
        { status: 400 }
      );
    }

    const uploadedFile = await filterUpload(file);

    return NextResponse.json({
      url: uploadedFile.url,
      success: true
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
