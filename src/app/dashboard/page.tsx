'use client';

import React, { useState, useEffect } from "react";
import { Course } from "@/entities/Course";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { 
  BookOpen, 
  Plus, 
  FileText, 
  Clock, 
  Users, 
  TrendingUp,
  Edit3,
  Download,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

import StatsOverview from "@/components/dashboard/statsOverview";
import CourseCard from "@/components/dashboard/courseCard";

export default function Dashboard() {
  const [courses, setCourses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const data = await Course.list("-updated_date");
      setCourses(data);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
    setIsLoading(false);
  };

  const filteredCourses = courses.filter((course: any) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTotalLessons = (course: any) => {
    return course.sections?.reduce((total: number, section: any) => total + (section.lessons?.length || 0), 0) || 0;
  };

  const getEstimatedTime = (course: any) => {
    return course.sections?.reduce((total: number, section: any) => 
      total + (section.lessons?.reduce((sectionTotal: number, lesson: any) => 
        sectionTotal + (lesson.estimatedTime || 0), 0) || 0), 0) || 0;
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Course Dashboard</h1>
          <p className="text-slate-600">Manage and create educational content</p>
        </div>
        <Link href="/courseEditor">
          <Button className="bg-slate-800 hover:bg-slate-700 text-white shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            Create New Course
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <StatsOverview 
        totalCourses={courses.length}
        totalLessons={courses.reduce((total, course) => total + getTotalLessons(course), 0)}
        totalTime={courses.reduce((total, course) => total + getEstimatedTime(course), 0)}
      />

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-slate-200 focus:border-slate-400"
          />
        </div>
        <div className="flex gap-2">
          {["all", "Beginner", "Intermediate", "Advanced"].map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-slate-800 text-white" : ""}
            >
              {category === "all" ? "All Levels" : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="h-3 bg-slate-200 rounded w-4/5"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                totalLessons={getTotalLessons(course)}
                estimatedTime={getEstimatedTime(course)}
                onRefresh={loadCourses}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                {searchTerm || selectedCategory !== "all" ? "No courses found" : "No courses yet"}
              </h3>
              <p className="text-slate-500 mb-6">
                {searchTerm || selectedCategory !== "all" 
                  ? "Try adjusting your search or filters"
                  : "Create your first course to get started"
                }
              </p>
              {!searchTerm && selectedCategory === "all" && (
                <Link href="/courseEditor">
                  <Button className="bg-slate-800 hover:bg-slate-700">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Course
                  </Button>
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
