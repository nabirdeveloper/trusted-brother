import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Category from '@/lib/category.model';

export async function GET() {
  await dbConnect();
  const categories = await Category.find();
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { name, description } = await req.json();
  if (!name) {
    return NextResponse.json({ message: 'Name is required.' }, { status: 400 });
  }
  const exists = await Category.findOne({ name });
  if (exists) {
    return NextResponse.json({ message: 'Category already exists.' }, { status: 400 });
  }
  const category = new Category({ name, description });
  await category.save();
  return NextResponse.json({ message: 'Category created.', category });
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const { id, name, description } = await req.json();
  if (!id) {
    return NextResponse.json({ message: 'Category ID is required.' }, { status: 400 });
  }
  const category = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
  if (!category) {
    return NextResponse.json({ message: 'Category not found.' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Category updated.', category });
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ message: 'Category ID is required.' }, { status: 400 });
  }
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return NextResponse.json({ message: 'Category not found.' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Category deleted.' });
} 