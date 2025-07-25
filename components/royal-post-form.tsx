'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { royalPostFormSchema, type RoyalPostFormData } from '@/lib/validations';

import { toast } from 'sonner';
import { Loader2, Send, Upload, User } from 'lucide-react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from './ui/card';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function RoyalPostForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSecondPerson, setShowSecondPerson] = useState(false);
  const [photo1, setPhoto1] = useState<File | null>(null);
  const [photo2, setPhoto2] = useState<File | null>(null);

  const photo1Ref = useRef<HTMLInputElement>(null);
  const photo2Ref = useRef<HTMLInputElement>(null);

  const form = useForm<RoyalPostFormData>({
    resolver: zodResolver(royalPostFormSchema),
    defaultValues: {
      branchNumber: '',
      firstName1: '',
      lastName1: '',
      phone1: '',
      dob1: '',
      firstName2: '',
      lastName2: '',
      phone2: '',
      dob2: '',
      showSecondPerson: false,
    },
  });

  const MAX_FILE_SIZE_MB = 2;

  const handlePhotoUpload = (file: File | null, person: 1 | 2) => {
    if (!file) return;
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > MAX_FILE_SIZE_MB) {
      toast.error('File too large', { description: `Must be under ${MAX_FILE_SIZE_MB}MB.` });
      return;
    }
    person === 1 ? setPhoto1(file) : setPhoto2(file);
  };

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => res(reader.result as string);
      reader.onerror = (err) => rej(err);
    });

  const resetAllFields = () => {
    form.reset();
    setPhoto1(null);
    setPhoto2(null);
    setShowSecondPerson(false);
    if (photo1Ref.current) photo1Ref.current.value = '';
    if (photo2Ref.current) photo2Ref.current.value = '';
  };

  const onSubmit = async (raw: RoyalPostFormData) => {
    const data = { ...raw, showSecondPerson };
    setIsSubmitting(true);

    try {
      const formData: any = { ...data };
      if (photo1) formData.photo1 = await convertToBase64(photo1);
      if (showSecondPerson && photo2) formData.photo2 = await convertToBase64(photo2);

      const res = await fetch('/api/royal-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success('Form submitted successfully');
        resetAllFields();
      } else {
        console.log({ result })
        let errorMessage = result.error || 'Something went wrong.';
  
        // If backend returns Zod-style errors
        if (typeof result.details === 'string') {
          try {
            const parsed = JSON.parse(result.details);
            if (Array.isArray(parsed)) {
              const fieldErrors = parsed.map((e: any) => `${e.path?.[0] ?? 'Field'}: ${e.message}`).join('\n');
              errorMessage += `\n${fieldErrors}`;
            }
          } catch (e) {
            // Ignore JSON parse error
          }
        }
      
        toast.error('Failed to submit', { description: errorMessage });      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg bg-white text-red-900 border border-red-200">
      <CardHeader className="border-b border-red-200 p-6">
        <CardTitle className="text-2xl font-bold">Royal Post Application</CardTitle>
        <CardDescription>Submit your branch & user information.</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => onSubmit({ ...d, showSecondPerson }))} className="space-y-6">
            <FormField name="branchNumber" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel className="text-red-700">Branch Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. 3456723456782" className="bg-white border border-red-300 focus:border-red-500 h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {[1].concat(showSecondPerson ? [2] : []).map((p) => (
              <div key={p} className="border border-red-200 p-6 rounded-lg relative">
                {p === 2 && (
                  <button type="button" className="absolute top-2 right-3 text-red-500 hover:text-red-700 text-xl" onClick={() => {
                    setShowSecondPerson(false);
                    form.setValue('firstName2', '');
                    form.setValue('lastName2', '');
                    form.setValue('phone2', '');
                    form.setValue('dob2', '');
                    setPhoto2(null);
                    if (photo2Ref.current) photo2Ref.current.value = '';
                  }}>×</button>
                )}
                <h3 className="font-semibold mb-4 text-red-800 flex items-center">
                  <User className="w-4 h-4 mr-2" /> Person {p} Details
                </h3>
                {[['firstName', 'First Name', 'John'], ['lastName', 'Last Name', 'Doe'], ['phone', 'Phone Number', '03XX-XXXXXXX'], ['dob', 'Date of Birth', '']].map(([key, label, placeholder]) => (
                  <FormField key={key + p} name={`${key}${p}` as keyof RoyalPostFormData} control={form.control} render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-red-700">{label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={typeof field.value === 'string' ? field.value : ''}
                          placeholder={placeholder}
                          type={key === 'dob' ? 'date' : 'text'}
                          className="bg-white border border-red-300 focus:border-red-500 h-11"
                        />

                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                ))}

                <div className="mt-4">
                  <label className="text-red-700 text-sm font-medium mb-2 flex items-center">
                    <Upload className="w-4 h-4 mr-1" /> Upload Photo ID
                  </label>
                  <div className="border-2 border-dashed border-red-300 rounded-lg p-4 bg-white">
                    <input
                      ref={p === 1 ? photo1Ref : photo2Ref}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e.target.files?.[0] || null, p as 1 | 2)}
                      className="w-full"
                    />
                    {(p === 1 ? photo1 : photo2) && (
                      <p className="text-sm text-red-600 mt-2">
                        ✓ {(p === 1 ? photo1 : photo2)?.name} selected
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {!showSecondPerson && (
              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  className="border border-red-400 text-red-700 hover:bg-red-50"
                  onClick={() => setShowSecondPerson(true)}
                >
                  + Add Second Person
                </Button>
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-red-600 hover:bg-red-700 text-white lg:text-lg font-semibold">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" /> Submit
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
