import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  FileText, 
  Download, 
  Users, 
  Zap, 
  Palette,
  ArrowRight,
  CheckCircle,
  Star,
  Play,
  Code,
  Globe
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: FileText,
      title: "Step-by-Step Lessons",
      description: "Create structured lessons with interactive steps that guide learners through complex topics."
    },
    {
      icon: Palette,
      title: "Multiple Templates",
      description: "Choose from academic, modern, or minimal templates to match your brand and audience."
    },
    {
      icon: Download,
      title: "Export & Share",
      description: "Export your courses as standalone HTML files that can be shared anywhere, no hosting required."
    },
    {
      icon: Zap,
      title: "Real-time Preview",
      description: "See your changes instantly with live preview as you build your course content."
    },
    {
      icon: Code,
      title: "HTML Editor",
      description: "Advanced HTML editor with formatting toolbar for rich, interactive content creation."
    },
    {
      icon: Globe,
      title: "Responsive Design",
      description: "All exported courses are mobile-friendly and work perfectly on any device."
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Computer Science Professor",
      content: "Course Forge has revolutionized how I create programming tutorials. The step-by-step format is perfect for complex topics.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Corporate Trainer",
      content: "I can create professional training materials in minutes, not hours. The export feature is a game-changer for our team.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Online Educator",
      content: "The templates are beautiful and the interface is intuitive. My students love the clean, professional look of my courses.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Create Beautiful
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Courses</span>
              <br />
              in Minutes
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Course Forge is the ultimate tool for educators, trainers, and content creators. 
              Build interactive, step-by-step lessons and export them as standalone courses.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/courseEditor">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
                  <Play className="w-5 h-5 mr-2" />
                  Start Creating
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-2">
                  <BookOpen className="w-5 h-5 mr-2" />
                  View Examples
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No registration required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Export to HTML</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Create Amazing Courses
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Powerful features designed to make course creation simple, fast, and enjoyable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600">
              Create your course in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Create Your Course</h3>
              <p className="text-slate-600">Set up your course details, add sections, and organize your content structure.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Build Your Lessons</h3>
              <p className="text-slate-600">Create step-by-step lessons with rich HTML content and interactive elements.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Export & Share</h3>
              <p className="text-slate-600">Export your course as a standalone HTML file and share it anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Loved by Educators Worldwide
            </h2>
            <p className="text-xl text-slate-600">
              See what others are saying about Course Forge
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Create Your First Course?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of educators who are already using Course Forge to create amazing learning experiences.
          </p>
          <Link href="/courseEditor">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-3 text-lg">
              <BookOpen className="w-5 h-5 mr-2" />
              Start Creating Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold">Course Forge</span>
            </div>
            <p className="text-slate-400 mb-4">
              The ultimate tool for creating beautiful, interactive courses
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
              <span>© 2024 Course Forge. All rights reserved.</span>
              <span>•</span>
              <span>Made with ❤️ for educators</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
