import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env'), override: true });

import mongoose from 'mongoose';
import User from '../models/User.js';

const ADMIN = {
    username: 'admin',
    email: 'admin@workspace.com',
    password: 'Admin@123',
    role: 'admin',
};

async function createAdmin() {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN.email });
    if (existing) {
        console.log('Admin already exists:', existing.email);
        process.exit(0);
    }

    const user = new User(ADMIN);
    await user.save();

    console.log('✅ Admin created successfully!');
    console.log('   Email   :', ADMIN.email);
    console.log('   Password:', ADMIN.password);
    process.exit(0);
}

createAdmin().catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
});
