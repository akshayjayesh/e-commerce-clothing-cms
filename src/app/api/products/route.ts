import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');

    let query = db.select().from(products);
    const conditions = [];

    // Search by name or description
    if (q) {
      conditions.push(
        or(
          like(products.name, `%${q}%`),
          like(products.description, `%${q}%`)
        )
      );
    }

    // Filter by category
    if (category) {
      conditions.push(eq(products.category, category));
    }

    // Apply WHERE conditions
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    // Apply sorting
    switch (sort) {
      case 'price_asc':
        query = query.orderBy(asc(products.priceCents));
        break;
      case 'price_desc':
        query = query.orderBy(desc(products.priceCents));
        break;
      case 'name_asc':
        query = query.orderBy(asc(products.name));
        break;
      case 'name_desc':
        query = query.orderBy(desc(products.name));
        break;
      default:
        query = query.orderBy(desc(products.createdAt));
    }

    const results = await query;
    return NextResponse.json(results);

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'Authorization header with Bearer token required',
        code: 'MISSING_AUTH_HEADER' 
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    } catch (jwtError) {
      return NextResponse.json({ 
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN' 
      }, { status: 401 });
    }

    // Check admin role
    if (payload.role !== 'admin') {
      return NextResponse.json({ 
        error: 'Admin role required',
        code: 'INSUFFICIENT_PERMISSIONS' 
      }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name, 
      slug, 
      description, 
      price_cents, 
      image, 
      category, 
      colors, 
      sizes, 
      featured 
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ 
        error: "Name is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!slug) {
      return NextResponse.json({ 
        error: "Slug is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!description) {
      return NextResponse.json({ 
        error: "Description is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!price_cents && price_cents !== 0) {
      return NextResponse.json({ 
        error: "Price cents is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!image) {
      return NextResponse.json({ 
        error: "Image is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ 
        error: "Category is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    // Validate price_cents is a number
    if (isNaN(parseInt(price_cents))) {
      return NextResponse.json({ 
        error: "Price cents must be a valid number",
        code: "INVALID_PRICE" 
      }, { status: 400 });
    }

    const now = Date.now();

    const insertData = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      priceCents: parseInt(price_cents),
      image: image.trim(),
      category: category.trim(),
      colors: colors ? colors.trim() : null,
      sizes: sizes ? sizes.trim() : null,
      featured: featured === true,
      createdAt: now,
      updatedAt: now
    };

    try {
      const newProduct = await db.insert(products)
        .values(insertData)
        .returning();

      return NextResponse.json(newProduct[0], { status: 201 });

    } catch (dbError: any) {
      // Handle unique constraint violation for slug
      if (dbError.message && dbError.message.includes('UNIQUE constraint failed: products.slug')) {
        return NextResponse.json({ 
          error: 'A product with this slug already exists',
          code: 'DUPLICATE_SLUG' 
        }, { status: 409 });
      }
      
      throw dbError;
    }

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}