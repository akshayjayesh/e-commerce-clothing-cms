import { db } from '@/db';
import { products } from '@/db/schema';

async function main() {
    const now = Date.now();
    
    const sampleProducts = [
        {
            name: 'Classic White T-Shirt',
            slug: 'classic-white-t-shirt',
            description: 'A timeless essential made from 100% organic cotton. Soft, breathable, and perfect for layering or wearing on its own.',
            priceCents: 2999,
            image: '/images/product-1.jpg',
            category: 'tops',
            colors: '["white","black","navy","gray"]',
            sizes: '["XS","S","M","L","XL","XXL"]',
            featured: true,
            createdAt: now - 86400000 * 10,
            updatedAt: now - 86400000 * 10,
        },
        {
            name: 'Slim Fit Dark Jeans',
            slug: 'slim-fit-dark-jeans',
            description: 'Premium denim jeans with a modern slim fit. Crafted from stretch denim for comfort and style that lasts all day.',
            priceCents: 8999,
            image: '/images/product-2.jpg',
            category: 'bottoms',
            colors: '["dark wash","light wash","black"]',
            sizes: '["28","30","32","34","36","38","40"]',
            featured: false,
            createdAt: now - 86400000 * 8,
            updatedAt: now - 86400000 * 8,
        },
        {
            name: 'Vintage Denim Jacket',
            slug: 'vintage-denim-jacket',
            description: 'A classic denim jacket with authentic vintage styling. Features button closure and chest pockets for a timeless look.',
            priceCents: 12999,
            image: '/images/product-3.jpg',
            category: 'outerwear',
            colors: '["blue","black","stone wash"]',
            sizes: '["S","M","L","XL","XXL"]',
            featured: true,
            createdAt: now - 86400000 * 6,
            updatedAt: now - 86400000 * 6,
        },
        {
            name: 'Leather Cross-Body Bag',
            slug: 'leather-cross-body-bag',
            description: 'Handcrafted genuine leather bag perfect for everyday use. Adjustable strap and multiple compartments for organization.',
            priceCents: 15000,
            image: '/images/product-4.jpg',
            category: 'accessories',
            colors: '["brown","black","tan","burgundy"]',
            sizes: null,
            featured: false,
            createdAt: now - 86400000 * 5,
            updatedAt: now - 86400000 * 5,
        },
        {
            name: 'Running Sneakers',
            slug: 'running-sneakers',
            description: 'High-performance athletic shoes with advanced cushioning technology. Lightweight design perfect for running and training.',
            priceCents: 11999,
            image: '/images/product-5.jpg',
            category: 'footwear',
            colors: '["white","black","navy","red"]',
            sizes: '["6","7","8","9","10","11","12","13"]',
            featured: true,
            createdAt: now - 86400000 * 4,
            updatedAt: now - 86400000 * 4,
        },
        {
            name: 'Cozy Knit Sweater',
            slug: 'cozy-knit-sweater',
            description: 'Soft wool blend sweater with ribbed detailing. Perfect for layering during cooler months with a relaxed, comfortable fit.',
            priceCents: 7499,
            image: '/images/product-6.jpg',
            category: 'tops',
            colors: '["cream","charcoal","burgundy","forest green"]',
            sizes: '["XS","S","M","L","XL"]',
            featured: false,
            createdAt: now - 86400000 * 3,
            updatedAt: now - 86400000 * 3,
        },
        {
            name: 'Waterproof Rain Jacket',
            slug: 'waterproof-rain-jacket',
            description: 'Technical outerwear with full waterproof protection. Lightweight and packable with adjustable hood and sealed seams.',
            priceCents: 14500,
            image: '/images/product-7.jpg',
            category: 'outerwear',
            colors: '["navy","black","olive","yellow"]',
            sizes: '["S","M","L","XL","XXL"]',
            featured: false,
            createdAt: now - 86400000 * 2,
            updatedAt: now - 86400000 * 2,
        },
        {
            name: 'Chino Shorts',
            slug: 'chino-shorts',
            description: 'Classic cotton chino shorts with a tailored fit. Versatile style perfect for casual outings and warm weather comfort.',
            priceCents: 4999,
            image: '/images/product-8.jpg',
            category: 'bottoms',
            colors: '["khaki","navy","olive","stone"]',
            sizes: '["28","30","32","34","36","38"]',
            featured: false,
            createdAt: now - 86400000 * 1,
            updatedAt: now - 86400000 * 1,
        },
        {
            name: 'Minimalist Watch',
            slug: 'minimalist-watch',
            description: 'Elegant timepiece with clean lines and premium materials. Features Japanese quartz movement and genuine leather strap.',
            priceCents: 9999,
            image: '/images/product-9.jpg',
            category: 'accessories',
            colors: '["silver","gold","black","rose gold"]',
            sizes: null,
            featured: true,
            createdAt: now,
            updatedAt: now,
        }
    ];

    await db.insert(products).values(sampleProducts);
    
    console.log('✅ Products seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});