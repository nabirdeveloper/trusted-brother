import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Order from '@/lib/order.model';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { status } = await req.json();
    
    if (!status) {
      return NextResponse.json({ message: 'Status is required.' }, { status: 400 });
    }
    
    // Validate status
    const validStatuses = ['pending', 'paid', 'shipped', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        message: `Status must be one of: ${validStatuses.join(', ')}.` 
      }, { status: 400 });
    }
    
    const order = await Order.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    ).populate('user', 'name email')
      .populate('products.product', 'name price category');
      
    if (!order) {
      return NextResponse.json({ message: 'Order not found.' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: 'Order status updated successfully.', 
      order 
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ 
      message: 'Failed to update order status.' 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const order = await Order.findById(params.id)
      .populate('user', 'name email')
      .populate('products.product', 'name price category');
      
    if (!order) {
      return NextResponse.json({ message: 'Order not found.' }, { status: 404 });
    }
    
    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ 
      message: 'Failed to fetch order details.' 
    }, { status: 500 });
  }
}