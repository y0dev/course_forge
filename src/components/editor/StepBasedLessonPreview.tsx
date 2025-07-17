import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Target,
  CheckCircle,
  Circle
} from "lucide-react";
import { Lesson } from "@/entities/Course";

interface StepBasedLessonPreviewProps {
  lesson: Lesson;
}

export default function StepBasedLessonPreview({ lesson }: StepBasedLessonPreviewProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = lesson.steps[currentStepIndex];
  const totalSteps = lesson.steps.length;
  const progress = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;

  const goToNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const goToStep = (index: number) => {
    setCurrentStepIndex(index);
  };

  if (!lesson || lesson.steps.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-600 mb-2">
          No lesson content available
        </h3>
        <p className="text-slate-500">
          This lesson doesn't have any steps yet.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Lesson Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {lesson.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-60">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{lesson.estimatedTime} minutes</span>
              </div>
              <Badge variant="outline">
                {lesson.difficulty}
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
            <span>Progress</span>
            <span>{currentStepIndex + 1}/{totalSteps} steps</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        {/* Step Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {lesson.steps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`w-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                  index === currentStepIndex
                    ? "bg-blue-500 text-white"
                    : index < currentStepIndex
                    ? "bg-green-500 text-white"
                    : "bg-slate-200 text-slate-60 hover:bg-slate-300"
                }`}
              >
                {index < currentStepIndex ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={goToNextStep}
            disabled={currentStepIndex === totalSteps - 1}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Current Step Content */}
      <Card className="mb-6">
        <CardContent className="p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="text-sm">
                Step {currentStepIndex + 1}
              </Badge>
              <h2 className="text-2xl font-bold text-slate-900">
                {currentStep.title}
              </h2>
            </div>

            <div 
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: currentStep.content }}
            />
          </div>

          {/* Step Navigation Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              {currentStepIndex + 1}/{totalSteps} steps
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                disabled={currentStepIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={goToNextStep}
                disabled={currentStepIndex === totalSteps - 1}
              >
                {currentStepIndex === totalSteps - 1 ? 'Complete' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Overview */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Lesson Overview
          </h3>
          <div className="space-y-3">
            {lesson.steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  index === currentStepIndex
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-slate-50"
                }`}
                onClick={() => goToStep(index)}
              >
                <div className={`w-6 rounded-full flex items-center justify-center text-xs ${
                  index === currentStepIndex
                    ? "bg-blue-500 text-white"
                    : index < currentStepIndex
                    ? "bg-green-500 text-white"
                    : "bg-slate-200 text-slate-60"
                }`}>
                  {index < currentStepIndex ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    index === currentStepIndex ? "text-blue-900" : "text-slate-900"
                  }`}>
                    {step.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 