'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { royalPostFormSchema, type RoyalPostFormData } from '@/lib/validations';
import { Loader2, Send, CheckCircle2, Upload, User, Building2, Calendar, Phone } from 'lucide-react';

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
      // Convert photos to base64 if they exist
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        form.reset();
        setPhoto1(null);
        setPhoto2(null);
        toast.success('Form submitted successfully!', {
          description: 'Thank you for your submission. We will get back to you in due course.',
        });
      } else {
        toast.error('Failed to submit form', {
          description: result.error || 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      toast.error('Failed to submit form', {
        description: 'Network error. Please check your connection and try again.',
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

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-5xl mx-auto shadow-lg">
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-bold text-green-900">Form Submitted Successfully!</h3>
              <p className="text-muted-foreground max-w-md text-lg">
                Thank you for your submission. We have received your details and will get back to you in due course.
              </p>
              <p className="text-sm text-muted-foreground">
                Your IDs should arrive via email confirmation.
              </p>
            </div>
            <Button 
              onClick={() => setIsSubmitted(false)} 
              variant="outline"
              className="mt-6"
              size="lg"
            >
              Submit Another Form
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg">
      <CardHeader className="space-y-4 pb-8 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Royal Post Application Form
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              If you were a post master, enter your details here...
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Branch Number */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Branch Information
              </h3>
              <FormField
                control={form.control}
                name="branchNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-700">Branch Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter branch number" 
                        {...field} 
                        className="h-12 bg-white border-green-300 focus:border-green-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Person 1 Details */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-800 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Person 1 Details
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-700">First Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="First name" 
                              {...field} 
                              className="h-11 bg-white border-blue-300 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-700">Last Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Last name" 
                              {...field} 
                              className="h-11 bg-white border-blue-300 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="phone1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700 flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Phone number" 
                            {...field} 
                            className="h-11 bg-white border-blue-300 focus:border-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dob1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Date of Birth
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            className="h-11 bg-white border-blue-300 focus:border-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Photo Upload for Person 1 */}
                  <div>
                    <label className="text-blue-700 text-sm font-medium mb-2 flex items-center">
                      <Upload className="w-4 h-4 mr-1" />
                      Upload Photo ID 1
                    </label>
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-white">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e.target.files?.[0] || null, 1)}
                        className="w-full"
                      />
                      {photo1 && (
                        <p className="text-sm text-blue-600 mt-2">
                          ✓ {photo1.name} selected
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Person 2 Details */}
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-xl font-semibold text-purple-800 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Person 2 Details
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-700">First Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="First name" 
                              {...field} 
                              className="h-11 bg-white border-purple-300 focus:border-purple-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-700">Last Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Last name" 
                              {...field} 
                              className="h-11 bg-white border-purple-300 focus:border-purple-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="phone2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-700 flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Phone number" 
                            {...field} 
                            className="h-11 bg-white border-purple-300 focus:border-purple-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dob2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-700 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Date of Birth
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            className="h-11 bg-white border-purple-300 focus:border-purple-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Photo Upload for Person 2 */}
                  <div>
                    <label className="text-purple-700 text-sm font-medium mb-2 flex items-center">
                      <Upload className="w-4 h-4 mr-1" />
                      Upload Photo ID 2
                    </label>
                    <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 bg-white">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e.target.files?.[0] || null, 2)}
                        className="w-full"
                      />
                      {photo2 && (
                        <p className="text-sm text-purple-600 mt-2">
                          ✓ {photo2.name} selected
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button 
                type="submit" 
                className="w-full max-w-md h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Submit Application
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