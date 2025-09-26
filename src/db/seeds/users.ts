import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcrypt';

async function main() {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    
    const adminUser = {
        username: 'admin',
        passwordHash: hashedPassword,
        role: 'admin',
        createdAt: Date.now()
    };

    await db.insert(users).values([adminUser]);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});