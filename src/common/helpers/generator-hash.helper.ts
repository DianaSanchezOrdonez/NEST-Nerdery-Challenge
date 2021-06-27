import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const characters =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const generateHash = () => {
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
};

export const generatePassword = async (
  plainPassword: string,
): Promise<string> => {
  if (!plainPassword) {
    throw new BadRequestException(`Password can't be empty`);
  }
  const hashed = await bcrypt.hash(plainPassword, 10);
  return hashed;
};
