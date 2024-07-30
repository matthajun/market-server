import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
}));
