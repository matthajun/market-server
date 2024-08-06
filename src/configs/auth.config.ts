import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  //TODO: impl auth login
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
}));
