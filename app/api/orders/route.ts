import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Order from '@/lib/order.model';

export async function GET(req: NextRequest) {
  await dbConnect();
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('products.product', 'name price category');
  return NextResponse.json({ orders });
} 