import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test'),
  DATABASE_URL: Joi.string().required(),
  SESSION_SECRET: Joi.string().required(),
  SESSION_MAX_AGE: Joi.number().integer().min(1000).optional(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().port().required(),
  SESSION_SITE: Joi.string().valid('lax', 'none', 'strict').default('lax'),
});
