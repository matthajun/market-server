import { registerAs } from '@nestjs/config';

interface DatabaseConfigData {
  POSTGRES_URL: string;
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_USERNAME: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DATABASE: string;
  DATABASE_LOGGING: boolean;
}

export default registerAs<DatabaseConfigData>('database', () => ({
  POSTGRES_URL: process.env.POSTGRES_URL,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_PORT: Number.parseInt(process.env.POSTGRES_PORT),
  POSTGRES_USERNAME: process.env.POSTGRES_USERNAME,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
  DATABASE_LOGGING: !!process.env.DATABASE_LOGGING,
}));
