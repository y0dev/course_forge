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
  Target, 
  Search, 
  Wrench, 
  TestTube, 
  RefreshCw, 
  Brain, 
  CheckCircle,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import { LessonTemplate, LESSON_TEMPLATES } from "./stepTemplates";

const lessonTemplates = [
  {
    id: "define",
    title: "Define",
    icon: Target,
    color: "bg-blue-500",
    description: "Set clear learning objectives and goals",
    content: `# Define: [Lesson Topic]

## Learning Objective
We want to [specific learning goal or skill to achieve].

## What You'll Learn
- [Key concept 1]
- [Key concept 2]
- [Key concept 3]

## Prerequisites
- [Required knowledge]
- [Tools or setup needed]

## Success Criteria
By the end of this lesson, you will be able to:
- [ ] [Specific skill 1]
- [ ] [Specific skill 2]
- [ ] [Specific skill 3]
`
  },
  {
    id: "explore",
    title: "Explore",
    icon: Search,
    color: "bg-green-500",
    description: "Discover and research the underlying concepts",
    content: `# Explore: [Topic Fundamentals]

## Key Concepts to Understand

### Concept 1: [Important Topic]
Learn about [specific concept], including:
- [Detail 1]
- [Detail 2]
- [Detail 3]

### Concept 2: [Related Topic]
Understanding [another concept] is crucial because:
- [Reason 1]
- [Reason 2]

## Background Information
[Provide context and background information]

## Common Terminology
- **[Term 1]**: [Definition]
- **[Term 2]**: [Definition]
- **[Term 3]**: [Definition]

## Further Reading
- [Resource 1]
- [Resource 2]
- [Documentation link]
`
  },
  {
    id: "prototype",
    title: "Prototype",
    icon: Wrench,
    color: "bg-purple-500",
    description: "Build and implement your first working version",
    content: `# Prototype: [Build Your Solution]

## Materials Needed
- [Item 1]
- [Item 2]
- [Item 3]

## Step-by-Step Implementation

### Step 1: [Setup]
\`\`\`
[Code or instructions for setup]
\`\`\`

### Step 2: [Core Implementation]
\`\`\`
[Main code or process]
\`\`\`

### Step 3: [Configuration]
[Additional configuration steps]

## Expected Outcome
After completing these steps, you should see:
- [Expected result 1]
- [Expected result 2]

## Troubleshooting
If something doesn't work:
- Check [common issue 1]
- Verify [common issue 2]
- Ensure [common issue 3]
`
  },
  {
    id: "test",
    title: "Test",
    icon: TestTube,
    color: "bg-orange-500",
    description: "Verify your implementation works correctly",
    content: `# Test: [Verify Your Solution]

## Testing Your Implementation

### Basic Functionality Test
1. [Test step 1]
2. [Test step 2]
3. [Test step 3]

### Expected Results
- ✅ [Expected behavior 1]
- ✅ [Expected behavior 2]
- ✅ [Expected behavior 3]

### Verification Checklist
- [ ] [Check 1]
- [ ] [Check 2]
- [ ] [Check 3]

## Debugging Common Issues

### Issue 1: [Problem Description]
**Symptoms**: [What you see]
**Solution**: [How to fix it]

### Issue 2: [Problem Description]
**Symptoms**: [What you see]
**Solution**: [How to fix it]

## Success Metrics
Your implementation is working correctly if:
- [Metric 1]
- [Metric 2]
- [Metric 3]
`
  },
  {
    id: "iterate",
    title: "Iterate",
    icon: RefreshCw,
    color: "bg-cyan-500",
    description: "Improve and enhance your solution",
    content: `# Iterate: [Enhance Your Solution]

## Improvement Opportunities
Now that you have a working solution, let's make it better:

### Enhancement 1: [Improvement Area]
**Current state**: [What you have now]
**Improvement**: [What to change]
**Benefit**: [Why this is better]

\`\`\`
[Code for enhancement 1]
\`\`\`

### Enhancement 2: [Another Area]
**Current state**: [What you have now]
**Improvement**: [What to change]
**Benefit**: [Why this is better]

\`\`\`
[Code for enhancement 2]
\`\`\`

## Advanced Features
Try implementing these advanced features:
- [Feature 1] - [Brief description]
- [Feature 2] - [Brief description]
- [Feature 3] - [Brief description]

## Performance Optimization
Consider these optimizations:
1. [Optimization 1]
2. [Optimization 2]
3. [Optimization 3]

## Challenge Yourself
- Can you [challenge 1]?
- What if you [challenge 2]?
- Try to [challenge 3]
`
  },
  {
    id: "reflect",
    title: "Reflect",
    icon: Brain,
    color: "bg-pink-500",
    description: "Analyze and understand the deeper concepts",
    content: `# Reflect: [Understanding the Why]

## Deep Dive Questions

### Question 1: [Fundamental Question]
[Prompt for deeper thinking about the topic]

**Consider**: 
- [Thinking point 1]
- [Thinking point 2]
- [Thinking point 3]

### Question 2: [Technical Question]
[Another question to promote understanding]

**Think about**:
- [Technical aspect 1]
- [Technical aspect 2]

## Real-World Applications
How does this concept apply in real situations?

- **Industry Use Case 1**: [Example]
- **Industry Use Case 2**: [Example]
- **Daily Life Example**: [Example]

## Connections to Other Topics
This lesson connects to:
- [Related topic 1] - [How it connects]
- [Related topic 2] - [How it connects]
- [Related topic 3] - [How it connects]

## Personal Reflection
Take a moment to think about:
- What was the most challenging part?
- What surprised you the most?
- How will you use this knowledge?
- What would you explore next?
`
  },
  {
    id: "recap",
    title: "Recap",
    icon: CheckCircle,
    color: "bg-emerald-500",
    description: "Summarize and reinforce key learnings",
    content: `# Recap: [Lesson Summary]

## What We Accomplished
In this lesson, we successfully:
- ✅ [Achievement 1]
- ✅ [Achievement 2]
- ✅ [Achievement 3]

## Key Takeaways
The most important concepts to remember:

### 1. [Key Concept 1]
[Brief explanation or reminder]

### 2. [Key Concept 2]
[Brief explanation or reminder]

### 3. [Key Concept 3]
[Brief explanation or reminder]

## Skills Developed
You now have the ability to:
- [Skill 1]
- [Skill 2]
- [Skill 3]

## Quick Reference
For future reference, remember these key points:
- **[Important Point 1]**: [One-line summary]
- **[Important Point 2]**: [One-line summary]
- **[Important Point 3]**: [One-line summary]

## Next Steps
To continue your learning journey:
1. [Next step 1]
2. [Next step 2]
3. [Next step 3]

## Practice Exercises
Reinforce your learning with these exercises:
- [Exercise 1]
- [Exercise 2]
- [Exercise 3]
`
  }
];

export default function LessonTemplates({ open, onClose, onSelectTemplate }: { open: boolean, onClose: () => void, onSelectTemplate: (template: LessonTemplate) => void }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleSelectTemplate = (template: LessonTemplate) => {
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
                      <template.icon className={`w-5 h-5 text-white ${template.color.replace('bg-', 'text-')}`} />
                    </div>
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                  </div>
                  <p className="text-sm text-slate-600">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge 
                      variant="outline" 
                      className={`${template.color.replace('bg-', 'border-').replace('500', '200')} ${template.color.replace('bg-', 'text-')}`}
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