import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const generateResetToken = () => {
    return crypto.randomBytes(20).toString('hex');
};

export const hashPassword = async (password) => {
    const salts = 10;
    return await bcrypt.hash(password, salts);
};
export const comparePasswords = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};