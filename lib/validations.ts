import { z } from 'zod';

export const royalPostFormSchema = z.object({
  // First Person Details
  firstName1: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }).max(50, {
    message: "First name must not exceed 50 characters.",
  }),
  lastName1: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }).max(50, {
    message: "Last name must not exceed 50 characters.",
  }),
  phone1: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }).max(15, {
    message: "Phone number must not exceed 15 digits.",
  }),
  dob1: z.string().min(1, {
    message: "Date of birth is required.",
  }),
  
  // Second Person Details
  firstName2: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }).max(50, {
    message: "First name must not exceed 50 characters.",
  }),
  lastName2: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }).max(50, {
    message: "Last name must not exceed 50 characters.",
  }),
  phone2: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }).max(15, {
    message: "Phone number must not exceed 15 digits.",
  }),
  dob2: z.string().min(1, {
    message: "Date of birth is required.",
  }),
  
  // Branch Number
  branchNumber: z.string().min(1, {
    message: "Branch number is required.",
  }).max(20, {
    message: "Branch number must not exceed 20 characters.",
  }),
});

export type RoyalPostFormData = z.infer<typeof royalPostFormSchema>;

export const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }).max(100, {
    message: "Name must not exceed 100 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }).max(1000, {
    message: "Message must not exceed 1000 characters.",
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;