import { z } from 'zod';

export const zodSignupSchema = z.object({
  username: z
    .string({ message: 'username should be bigger than 5 characters' })
    .min(3),
  email: z.string({ message: 'Give proper email address' }).email(),
  password: z
    .string({ password: 'Password should have at-least 5 characters' })
    .min(5)
});

export const zodSigninSchema = z.object({
  email: z.string({ message: 'Give proper email address' }).email(),
  password: z
    .string({ password: 'Password should have at-least 5 characters' })
    .min(5)
});
