import { registerAs } from '@nestjs/config';

export default registerAs('file-writer', () => {
  const baseDirPath = process.env.BASE_DIR_PATH;

  if (!baseDirPath) {
    throw new Error('BASE_DIR_PATH env required');
  }

  return {
    baseDirPath,
  };
});
