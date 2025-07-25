// validations.ts
import { z } from 'zod';

export const royalPostFormSchema = z
  .object({
    branchNumber: z.string().min(1, 'Branch number is required'),

    firstName1: z.string().min(1, 'First name is required'),
    lastName1: z.string().min(1, 'Last name is required'),
    phone1: z.string().min(1, 'Phone number is required'),
    dob1: z.string().min(1, 'Date of birth is required'),

    firstName2: z.string().optional(),
    lastName2: z.string().optional(),
    phone2: z.string().optional(),
    dob2: z.string().optional(),

    showSecondPerson: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.showSecondPerson) {
      if (!data.firstName2 || data.firstName2.trim() === '') {
        ctx.addIssue({ path: ['firstName2'], code: z.ZodIssueCode.custom, message: 'First name is required' });
      }
      if (!data.lastName2 || data.lastName2.trim() === '') {
        ctx.addIssue({ path: ['lastName2'], code: z.ZodIssueCode.custom, message: 'Last name is required' });
      }
      if (!data.phone2 || data.phone2.trim() === '') {
        ctx.addIssue({ path: ['phone2'], code: z.ZodIssueCode.custom, message: 'Phone number is required' });
      }
      if (!data.dob2 || data.dob2.trim() === '') {
        ctx.addIssue({ path: ['dob2'], code: z.ZodIssueCode.custom, message: 'Date of birth is required' });
      }
    }
  });

export type RoyalPostFormData = z.infer<typeof royalPostFormSchema>;
