import { z } from 'zod';

const nameRegex = /^[A-Za-z]+$/;
const phoneRegex = /^[0-9]{11,15}$/; // Optional enhancement

// Date must be in the past or today
const today = new Date();
today.setHours(0, 0, 0, 0);

export const royalPostFormSchema = z
  .object({
    branchNumber: z.string().min(1, 'Branch number is required'),

    firstName1: z.string()
      .min(1, 'First name is required')
      .regex(nameRegex, 'Only alphabetic characters allowed'),

    lastName1: z.string()
      .min(1, 'Last name is required')
      .regex(nameRegex, 'Only alphabetic characters allowed'),

    phone1: z.string()
      .min(1, 'Phone number is required')
      .regex(phoneRegex, 'Phone number must be digits only and 11–15 characters long'),

    dob1: z.string()
      .refine((val) => {
        const inputDate = new Date(val);
        return inputDate <= today;
      }, {
        message: 'Date of birth must not be in the future',
      }),
      firstName2: z.string().default(''),
      lastName2: z.string().default(''),
      phone2: z.string().default(''),
      dob2: z.string().default(''),
      

    showSecondPerson: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.showSecondPerson) {
      if (!data.firstName2 || data.firstName2.trim() === '') {
        ctx.addIssue({ path: ['firstName2'], code: z.ZodIssueCode.custom, message: 'First name is required' });
      } else if (!nameRegex.test(data.firstName2)) {
        ctx.addIssue({ path: ['firstName2'], code: z.ZodIssueCode.custom, message: 'Only alphabetic characters allowed' });
      }

      if (!data.lastName2 || data.lastName2.trim() === '') {
        ctx.addIssue({ path: ['lastName2'], code: z.ZodIssueCode.custom, message: 'Last name is required' });
      } else if (!nameRegex.test(data.lastName2)) {
        ctx.addIssue({ path: ['lastName2'], code: z.ZodIssueCode.custom, message: 'Only alphabetic characters allowed' });
      }

      if (!data.phone2 || data.phone2.trim() === '') {
        ctx.addIssue({ path: ['phone2'], code: z.ZodIssueCode.custom, message: 'Phone number is required' });
      }
     
      if (!data.dob2 || data.dob2.trim() === '') {
        ctx.addIssue({ path: ['dob2'], code: z.ZodIssueCode.custom, message: 'Date of birth is required' });
      } else {
        const dobDate = new Date(data.dob2);
        if (dobDate > today) {
          ctx.addIssue({ path: ['dob2'], code: z.ZodIssueCode.custom, message: 'Date of birth must not be in the future' });
        }
      }
    }
  });

export type RoyalPostFormData = z.infer<typeof royalPostFormSchema>;
