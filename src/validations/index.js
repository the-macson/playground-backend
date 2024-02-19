const { z } = require('zod');

exports.signupSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name should be atleast 3 characters long' })
    .max(255),
  username: z
    .string()
    .min(3, {
      message: 'Username should be atleast 3 characters long',
    })
    .max(255),
  email: z.string().email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(6, {
      message: 'Password should be atleast 6 characters long',
    })
    .max(255),
});

exports.loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(6, {
      message: 'Password should be atleast 6 characters long',
    })
    .max(255),
});

exports.problemSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title should be atleast 3 characters long' }),
  description: z
    .string()
    .min(3, { message: 'Description should be atleast 3 characters long' }),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string()).optional(),
  input: z.array(z.string()),
  output: z.array(z.string()),
});
