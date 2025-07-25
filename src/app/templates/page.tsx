'use client';

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Palette } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const templates = [
  {
    id: "academic",
    name: "Academic",
    description: "Professional template for educational institutions",
    features: ["Clean typography", "Sidebar navigation", "Progress tracking", "Print-friendly"],
    color: "blue",
    preview: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with interactive elements",
    features: ["Dark mode", "Animations", "Mobile-first", "Code highlighting"],
    color: "purple",
    preview: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and distraction-free reading experience",
    features: ["Typography focus", "Fast loading", "Accessibility", "Simple navigation"],
    color: "green",
    preview: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop&crop=center"
  }
];

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState("academic");

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Course Templates</h1>
        <p className="text-slate-600">Choose a template for your exported courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTemplate === template.id ? 'ring-2 ring-slate-400' : ''
            }`}
            onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <Image
                  src={template.preview}
                  alt={template.name}
                  fill
                  className="w-full h-full object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index === 0}
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      template.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                      template.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}
                  >
                    {template.id === selectedTemplate ? 'Selected' : 'Available'}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">{template.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Palette className="w-4 h-4 mr-2" />
                      Customize
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-slate-100 rounded-lg">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Custom Template</h3>
        <p className="text-slate-600 mb-4">
          Need a unique design? Create your own template with custom HTML, CSS, and JavaScript.
        </p>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download Template Kit
        </Button>
      </div>
    </div>
  );
}