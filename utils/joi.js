import Joi from 'joi';

export const phoneSchema = Joi.string().regex(/^[0-9]{10,11}$/);

export const nicknameSchema = Joi.string().min(2).max(10)
  .required();

export const passwordSchema = Joi.string().min(6).max(8)
  .required();

export const codeSchema = Joi.string().alphanum().min(4).max(8)
  .required();

export default (val, schema) => new Promise((resolve, reject) => {
  return Joi.validate(val, schema, (err, value) => {
    if (err) reject(err);
    resolve(value);
  });
});

