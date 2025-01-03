import { registerAs } from '@nestjs/config';
import { DATABASE_CONFIG_TOKEN } from './config.tokens';

export default registerAs(DATABASE_CONFIG_TOKEN, () => {
  return {
    database_url: process.env.DATABASE_URL,
  };
});
