import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import { LessonTemplate, LESSON_TEMPLATES } from "./stepTemplates";
import { debugLog } from "@/lib/utils";

export default function LessonTemplates({ open, onClose, onSelectTemplate }: { open: boolean, onClose: () => void, onSelectTemplate: (template: LessonTemplate) => void }) {

  const handleSelectTemplate = (template: LessonTemplate) => {
    debugLog("Selected template:", template);
    onSelectTemplate(template);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Choose a Lesson Template
          </DialogTitle>
          <p className="text-sm text-slate-600">
            Select a structured template to create focused, effective lessons
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LESSON_TEMPLATES.map((template, index)  => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 h-full"
                onClick={() => handleSelectTemplate(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`${template.color} p-2 rounded-lg`}>
                      <template.icon className={`w-5 h-5 text-white bg-blue ${template.color}`} />
                    </div>
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                  </div>
                  <p className="text-sm text-slate-600">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge 
                      variant="outline" 
                      className={`${template.color}`}
                    >
                      {template.title} Phase
                    </Badge>
                    
                    {/* Preview of template structure */}
                    <div className="text-xs text-slate-500 space-y-1">
                      {template.content.split('\n').slice(0, 4).map((line: string, i: number) => (
                        line.trim() && (
                          <div key={i} className="truncate">
                            {line.startsWith('#') ? (
                              <span className="font-semibold">{line}</span>
                            ) : (
                              line
                            )}
                          </div>
                        )
                      ))}
                      <div className="text-slate-400">...</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <h3 className="font-semibold mb-2">About These Templates</h3>
          <p className="text-sm text-slate-600 mb-3">
            These templates follow a structured learning methodology that guides students through 
            a complete learning cycle: from defining objectives to practical application and reflection.
          </p>
          <div className="flex flex-wrap gap-2">
            {LESSON_TEMPLATES.map((template) => (
              <Badge key={template.id} variant="outline" className="text-xs">
                {template.title}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}