import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import CategorySlider from '@/lib/category-slider.model';
import Category from '@/lib/category.model';

export async function GET() {
  await dbConnect();
  const sliders = await CategorySlider.find({ isActive: true })
    .populate('category')
    .sort({ order: 1 });
  return NextResponse.json({ sliders });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { categoryId, title, description, imageUrl, linkUrl, order } = await req.json();
  
  // Validate category exists
  const category = await Category.findById(categoryId);
  if (!category) {
    return NextResponse.json({ message: 'Category not found' }, { status: 404 });
  }
  
  const slider = new CategorySlider({
    category: categoryId,
    title,
    description,
    imageUrl,
    linkUrl,
    order: order || 0,
  });
  
  await slider.save();
  return NextResponse.json({ message: 'Category slider created successfully', slider });
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const { id, ...updates } = await req.json();
  
  if (!id) {
    return NextResponse.json({ message: 'Category slider ID is required' }, { status: 400 });
  }
  
  const slider = await CategorySlider.findByIdAndUpdate(id, updates, { new: true });
  
  if (!slider) {
    return NextResponse.json({ message: 'Category slider not found' }, { status: 404 });
  }
  
  return NextResponse.json({ message: 'Category slider updated successfully', slider });
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const { id } = await req.json();
  
  if (!id) {
    return NextResponse.json({ message: 'Category slider ID is required' }, { status: 400 });
  }
  
  const slider = await CategorySlider.findByIdAndDelete(id);
  
  if (!slider) {
    return NextResponse.json({ message: 'Category slider not found' }, { status: 404 });
  }
  
  return NextResponse.json({ message: 'Category slider deleted successfully' });
}
