import { registerAs } from '@nestjs/config';

export default registerAs('payment', () => ({
  PAYMENT_SERVER_API_ENDPOINT: process.env.PAYMENT_SERVER_API_ENDPOINT,
  PAYMENT_SERVER_API_KEY: process.env.PAYMENT_SERVER_API_KEY,
  PAYMENT_SERVER_API_SECRET: process.env.PAYMENT_SERVER_API_SECRET,
}));
