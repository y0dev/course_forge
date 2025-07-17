import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Edit3, 
  Download, 
  FileText, 
  Clock, 
  MoreHorizontal,
  Eye
} from "lucide-react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Course as CourseType } from "@/entities/Course";

const categoryColors = {
  Beginner: "bg-green-100 text-green-800 border-green-200",
  Intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Advanced: "bg-red-100 text-red-800 border-red-200"
};

interface CourseCardProps {
  course: CourseType;
  totalLessons: number;
  estimatedTime: number;
  onRefresh: () => void;
}

export default function CourseCard({ course, totalLessons, estimatedTime, onRefresh }: CourseCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
                {course.title}
              </CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={categoryColors[course.category]}>
                  {course.category}
                </Badge>
                {course.tags && course.tags.slice(0, 2).map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            {/* Dropdown menu for actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/courseEditor?id=${course.id}`}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Course
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Export HTML
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 hover:bg-red-50" onClick={() => setShowConfirm(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {course.description && (
            <p className="text-sm text-slate-600 line-clamp-2">
              {course.description}
            </p>
          )}
        </CardHeader>
        {/* Delete confirmation modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs border border-slate-200">
              <h3 className="text-lg font-semibold mb-2 text-red-700">Delete Course?</h3>
              <p className="text-slate-600 mb-4">Are you sure you want to delete <span className="font-bold">{course.title}</span>? This action cannot be undone.</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setShowConfirm(false)} disabled={deleting}>Cancel</Button>
                <Button variant="destructive" size="sm" onClick={async () => {
                  setDeleting(true);
                  await CourseType.delete(course.id);
                  setShowConfirm(false);
                  setDeleting(false);
                  if (onRefresh) onRefresh();
                }} disabled={deleting}>
                  {deleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        )}
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>{totalLessons} lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatTime(estimatedTime)}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/courseEditor?id=${course.id}`}>
              <Button variant="outline" size="sm" className="w-full">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}