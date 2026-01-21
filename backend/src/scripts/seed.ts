import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';

const seedUsers = async () => {
  try {
    await connectDB();

    const users = [
      {
        email: 'developwithdubey@gmail.com',
        role: 'admin' as const,
      },
      {
        email: 'ayushdubey2017@gmail.com',
        role: 'admin' as const,
      },
    ];

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create(userData);
        console.log(`✅ Created user: ${userData.email}`);
      } else {
        console.log(`⏭️  User already exists: ${userData.email}`);
      }
    }

    console.log('✅ Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedUsers();
