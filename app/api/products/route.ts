import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Product from '@/lib/product.model';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10) || 1;
    const limit = parseInt(searchParams.get('limit') || '12', 10) || 12;
    const skip = (page - 1) * limit;
    
    // Optionally filter by category or sku
    const filter: any = {};
    if (searchParams.get('category')) {
      filter.categories = searchParams.get('category');
    }
    if (searchParams.get('sku')) {
      filter.sku = searchParams.get('sku');
    }
    
    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);
    
    // Transform products to match frontend expectations
    const transformedProducts = products.map(product => ({
      ...product.toObject(),
      category: product.categories[0], // Taking first category for frontend
      images: product.images || [] // Ensure images array exists
    }));
    
    return NextResponse.json({ 
      products: transformedProducts, 
      total, 
      page, 
      totalPages: Math.ceil(total / limit) 
    });
  } catch (error: unknown) {
    console.error('Error in GET products:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, price, sku, stock, categories, variants, description, images, status } = await req.json();
    
    // Validation
    if (!name || !price || !sku || !stock || !categories || !images || images.length === 0) {
      return NextResponse.json(
        { 
          message: 'Name, price, sku, stock, categories, and at least one image are required.',
          success: false 
        }, 
        { status: 400 }
      );
    }
    
    // Validate price and stock
    const numericPrice = Number(price);
    const numericStock = Number(stock);
    if (isNaN(numericPrice) || isNaN(numericStock)) {
      return NextResponse.json(
        { 
          message: 'Price and stock must be valid numbers',
          success: false 
        }, 
        { status: 400 }
      );
    }
    
    // Validate categories
    if (!Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { 
          message: 'Categories must be a non-empty array',
          success: false 
        }, 
        { status: 400 }
      );
    }
    
    // Validate images
    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { 
          message: 'Images must be a non-empty array',
          success: false 
        }, 
        { status: 400 }
      );
    }
    
    // Validate status
    const validStatuses = ['in_stock', 'out_of_stock', 'coming_soon'];
    const productStatus = status || 'in_stock';
    if (!validStatuses.includes(productStatus)) {
      return NextResponse.json(
        { 
          message: 'Invalid status. Must be one of: in_stock, out_of_stock, coming_soon',
          success: false 
        }, 
        { status: 400 }
      );
    }
    
    const product = new Product({ 
      name, 
      price: numericPrice,
      sku, 
      stock: numericStock, 
      categories, 
      variants: variants || [],
      description,
      images,
      status: productStatus 
    });
    
    try {
      await product.save();
      return NextResponse.json(
        { 
          message: 'Product created successfully.',
          success: true,
          product 
        },
        { status: 201 }
      );
    } catch (saveError) {
      console.error('Error saving product:', saveError);
      return NextResponse.json(
        { 
          message: 'Failed to save product to database',
          success: false,
          error: saveError instanceof Error ? saveError.message : 'Database error'
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Error in POST products:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Failed to create product',
        success: false,
        error: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const { id, name, price, sku, stock, categories, variants, description, images, status } = await req.json();
    
    if (!id) {
      return NextResponse.json({ message: 'Product ID is required.' }, { status: 400 });
    }
    
    // Convert stock to number
    const stockNum = Number(stock);
    if (isNaN(stockNum)) {
      return NextResponse.json({ message: 'Stock must be a valid number.' }, { status: 400 });
    }
    
    const product = await Product.findByIdAndUpdate(
      id,
      { 
        name, 
        price: Number(price),
        sku, 
        stock: stockNum, 
        categories, 
        variants, 
        description, 
        images,
        status 
      },
      { new: true }
    );
    
    if (!product) {
      return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Product updated successfully.', product });
  } catch (error: unknown) {
    console.error('Error in PUT products:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: error.message,
          details: error.stack 
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { 
        error: 'Failed to update product',
        details: error 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ message: 'Product ID is required.' }, { status: 400 });
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Product deleted successfully.' });
  } catch (error: unknown) {
    console.error('Error in DELETE products:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to delete product',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 