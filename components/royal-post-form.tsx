'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import {
  royalPostFormSchema,
  type RoyalPostFormData,
} from '@/lib/validations';
import {
  Loader2,
  Send,
  CheckCircle2,
  Upload,
  User,
  Building2,
  Calendar,
  Phone,
} from 'lucide-react';

export function RoyalPostForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [photo1, setPhoto1] = useState<File | null>(null);
  const [photo2, setPhoto2] = useState<File | null>(null);

  const form = useForm<RoyalPostFormData>({
    resolver: zodResolver(royalPostFormSchema),
    defaultValues: {
      firstName1: '',
      lastName1: '',
      phone1: '',
      dob1: '',
      firstName2: '',
      lastName2: '',
      phone2: '',
      dob2: '',
      branchNumber: '',
    },
  });

  const handlePhotoUpload = (file: File | null, person: 1 | 2) => {
    if (person === 1) {
      setPhoto1(file);
    } else {
      setPhoto2(file);
    }
  };

  const onSubmit = async (data: RoyalPostFormData) => {
    setIsSubmitting(true);
    try {
      const formData = { ...data };
      if (photo1) {
        const base64Photo1 = await convertToBase64(photo1);
        (formData as any).photo1 = base64Photo1;
      }
      if (photo2) {
        const base64Photo2 = await convertToBase64(photo2);
        (formData as any).photo2 = base64Photo2;
      }
      const response = await fetch('/api/royal-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        setIsSubmitted(true);
        form.reset();
        setPhoto1(null);
        setPhoto2(null);
        toast.success('Form submitted successfully!', {
          description:
            'Thank you for your submission. We will get back to you in due course.',
        });
      } else {
        toast.error('Failed to submit form', {
          description: result.error || 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      toast.error('Failed to submit form', {
        description:
          'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg bg-white text-red-900">
      <CardHeader className=" border-b border-red-200 p-6">
        <CardTitle className="text-2xl font-bold">Royal Post Application Form</CardTitle>
        <CardDescription>If you were a post master, enter your details here...</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="branchNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-700">Branch Number</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="e.g. 123" {...field} className="bg-white border border-red-300 focus:border-red-500 h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {[1, 2].map((person) => (
              <div key={person} className="p-6 border rounded-lg border-red-200 ">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Person {person} Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`firstName${person}` as keyof RoyalPostFormData}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-700">First Name</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="First name" {...field} className="bg-white border border-red-300 focus:border-red-500 h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`lastName${person}` as keyof RoyalPostFormData}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-700">Last Name</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Last name" {...field} className="bg-white border border-red-300 focus:border-red-500 h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`phone${person}` as keyof RoyalPostFormData}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-red-700 flex items-center">
                          <Phone className="w-4 h-4 mr-1" /> Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="03XX-XXXXXXX" {...field} className="bg-white border border-red-300 focus:border-red-500 h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`dob${person}` as keyof RoyalPostFormData}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-red-700 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" /> Date of Birth
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="bg-white border border-red-300 focus:border-red-500 h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Photo Upload */}
                <div className="mt-4">
                  <label className="text-red-700 text-sm font-medium mb-2 flex items-center">
                    <Upload className="w-4 h-4 mr-1" /> Upload Photo ID
                  </label>
                  <div className="border-2 border-dashed border-red-300 rounded-lg p-4 bg-white">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e.target.files?.[0] || null, person as 1 | 2)}
                      className="w-full"
                    />
                    {(person === 1 ? photo1 : photo2) && (
                      <p className="text-sm text-red-600 mt-2">
                        ✓ {(person === 1 ? photo1 : photo2)?.name} selected
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white lg:text-lg font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" /> Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
