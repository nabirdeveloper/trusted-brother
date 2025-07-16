import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Banner from '@/lib/banner.model';

export async function GET() {
  await dbConnect();
  const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
  return NextResponse.json({ banners });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { title, description, imageUrl, linkUrl, order } = await req.json();
  
  const banner = new Banner({
    title,
    description,
    imageUrl,
    linkUrl,
    order: order || 0,
  });
  
  await banner.save();
  return NextResponse.json({ message: 'Banner created successfully', banner });
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const { id, ...updates } = await req.json();
  
  if (!id) {
    return NextResponse.json({ message: 'Banner ID is required' }, { status: 400 });
  }
  
  const banner = await Banner.findByIdAndUpdate(id, updates, { new: true });
  
  if (!banner) {
    return NextResponse.json({ message: 'Banner not found' }, { status: 404 });
  }
  
  return NextResponse.json({ message: 'Banner updated successfully', banner });
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const { id } = await req.json();
  
  if (!id) {
    return NextResponse.json({ message: 'Banner ID is required' }, { status: 400 });
  }
  
  const banner = await Banner.findByIdAndDelete(id);
  
  if (!banner) {
    return NextResponse.json({ message: 'Banner not found' }, { status: 404 });
  }
  
  return NextResponse.json({ message: 'Banner deleted successfully' });
}
