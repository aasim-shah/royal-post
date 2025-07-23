import { RoyalPostForm } from '@/components/royal-post-form';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="text-center mb-8 lg:mb-12">
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="">
<Image src="/rmg_logo.svg" alt="Description" width={100} height={100} />
              </div>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-red-600 via-orage-600 to-red-800 bg-clip-text text-transparent">
              Royal Post
            </h1>
            <p className="text-md lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              If you were a post master, enter your details here. Complete the form below with information for both applicants.
            </p>
          </div>
          
          <div className="flex justify-center mt-8">
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full"></div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          
          <div className="relative">
            <RoyalPostForm />
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-200/50 max-w-2xl mx-auto">
           
            <p className="text-muted-foreground">
              Thank you! We have received your details, we will get back to you in due course.
              <br />
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}