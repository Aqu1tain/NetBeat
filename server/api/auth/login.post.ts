import { defineEventHandler, readBody, createError } from 'h3';
import connectToDatabase from '../../utils/db';
import User from '../../models/User'; // Now typed as Model<IUser>
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'development_secret';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { username, password } = body;

    if (!username || !password) {
        throw createError({ statusCode: 400, statusMessage: 'Missing username or password' });
    }

    await connectToDatabase();

    // Use .exec() to resolve the Query to a Promise<IUser | null>
    const user = await User.findOne({ username }).exec();
    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' });
    }

    // Create a JWT token for the user
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    return { success: true, token };
});