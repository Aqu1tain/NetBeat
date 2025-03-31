// server/api/auth/register.post.ts
import { defineEventHandler, readBody, createError } from 'h3';
import connectToDatabase from '../../utils/db';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { username, password } = body;

    if (!username || !password) {
        throw createError({ statusCode: 400, statusMessage: 'Missing username or password' });
    }

    await connectToDatabase();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw createError({ statusCode: 400, statusMessage: 'Username already exists' });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return { success: true, message: 'User registered successfully' };
});
