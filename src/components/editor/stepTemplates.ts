import { Target, Search, Wrench, TestTube, RefreshCw, Brain, CheckCircle, PlayCircle } from "lucide-react";

export interface LessonTemplate {
  id: string;
  label: string;
  title: string;
  description: string;
  icon: React.ElementType;
    color: string;
    content: string;
}

export const LESSON_TEMPLATES: LessonTemplate[] = [
  {
    id: 'define',
    label: 'Define',
    title: 'Define Learning Objective',
    description: 'Set clear goals and success criteria for what you want to achieve.',
    icon: Target,
    color: 'orange',
    content: `# Define: [Lesson Topic]

## Learning Objective
We want to [specific learning goal or skill to achieve].

## What You'll Learn
- [Key concept 1]
- [Key concept 2]
- [Key concept 3]
`
  },
  {
    id: 'explore',
    label: 'Explore',
    title: 'Explore Concepts',
    description: 'Learn about key concepts, terminology, and background knowledge.',
    icon: Search,
    color: 'blue',
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
    id: 'test',
    label: 'Test',
    title: 'Test & Validate',
    description: 'Test your creation and validate it works as expected.',
    icon: PlayCircle,
    color: 'purple',
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
    id: 'iterate',
    label: 'Iterate',
    title: 'Experiment & Improve',
    description: 'Try variations and improvements to enhance your work.',
    icon: RefreshCw,
    color: 'indigo',
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
    id: 'reflect',
    label: 'Reflect',
    title: 'Think Deeply',
    description: 'Reflect on what you learned and understand the underlying principles.',
    icon: Brain,
    color: 'teal',
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
    id: 'recap',
    label: 'Recap',
    title: 'Summarize & Review',
    description: 'Summarize key takeaways and prepare for next steps.',
    icon: CheckCircle,
    color: 'emerald',
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

export function generateLessonTemplateHtml(lessonTemplate: LessonTemplate): string {
  const demoId = `lesson-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  switch (lessonTemplate.id) {
    case 'define':
      return generateDefineLesson(demoId, lessonTemplate);
    case 'explore':
      return generateExploreLesson(demoId, lessonTemplate);
    case 'prototype':
      return generatePrototypeLesson(demoId, lessonTemplate);
    case 'test':
      return generateTestLesson(demoId, lessonTemplate);
    case 'iterate':
      return generateIterateLesson(demoId, lessonTemplate);
    case 'reflect':
      return generateReflectLesson(demoId, lessonTemplate);
    case 'recap':
      return generateRecapLesson(demoId, lessonTemplate);
    default:
      return generateDefaultLesson(demoId, lessonTemplate);
  }
}

function generateDefineLesson(demoId: string, lessonTemplate: LessonTemplate): string {
  return `
<div class="rounded-xl border border-[var(--gray)] bg-[var(--white)] text-[var(--primary)] shadow-sm mb-6 border-orange-200 bg-orange-50" id="${demoId}">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2 text-orange-900">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-target w-5 h-5" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>
      </svg>
      ${lessonTemplate.title}
    </h3>
  </div>
  <div class="p-6 pt-4">
    <div class="bg-white p-4 rounded-lg">
      <h4 class="font-semibold mb-3">🎯 Learning Objective</h4>
      <p class="text-gray-700 mb-4">${lessonTemplate.description}</p>
      
      <div class="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
        <h5 class="font-semibold text-orange-800 mb-2">What we want to achieve:</h5>
        <ul class="text-orange-700 space-y-1">
          <li>• Create a clear, measurable goal</li>
          <li>• Understand the expected outcome</li>
          <li>• Set success criteria</li>
        </ul>
      </div>
      
      <div class="bg-gray-50 p-3 rounded-lg">
        <h5 class="font-medium mb-2">💡 Pro Tip</h5>
        <p class="text-sm text-gray-600">Start with the end in mind. A well-defined objective makes the rest of the learning process much clearer!</p>
      </div>
    </div>
  </div>
</div>`;
}

function generateExploreLesson(demoId: string, lessonTemplate: LessonTemplate): string {
  return `
<div class="rounded-xl border border-[var(--gray)] bg-[var(--white)] text-[var(--primary)] shadow-sm mb-6 border-blue-200 bg-blue-50" id="${demoId}">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2 text-blue-900">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search w-5 h-5" aria-hidden="true">
        <circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path>
      </svg>
      ${lessonTemplate.title}
    </h3>
  </div>
  <div class="p-6 pt-4">
    <div class="bg-white p-4 rounded-lg">
      <h4 class="font-semibold mb-3">🔍 Knowledge Discovery</h4>
      <p class="text-gray-700 mb-4">${lessonTemplate.description}</p>
      
      <div class="grid md:grid-cols-2 gap-4 mb-4">
        <div class="bg-blue-50 p-4 rounded-lg">
          <h5 class="font-semibold text-blue-800 mb-2">Key Concepts</h5>
          <ul class="text-blue-700 space-y-1 text-sm">
            <li>• Fundamental principles</li>
            <li>• Important terminology</li>
            <li>• Core relationships</li>
          </ul>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <h5 class="font-semibold text-green-800 mb-2">Background Knowledge</h5>
          <ul class="text-green-700 space-y-1 text-sm">
            <li>• Prerequisites to understand</li>
            <li>• Related concepts</li>
            <li>• Historical context</li>
          </ul>
        </div>
      </div>
      
      <div class="bg-gray-50 p-3 rounded-lg">
        <h5 class="font-medium mb-2">📚 Research Areas</h5>
        <p class="text-sm text-gray-600">Take time to understand the theory before jumping into practice. This foundation will make everything else click!</p>
      </div>
    </div>
  </div>
</div>`;
}

function generatePrototypeLesson(demoId: string, lessonTemplate: LessonTemplate): string {
  return `
<div class="rounded-xl border border-[var(--gray)] bg-[var(--white)] text-[var(--primary)] shadow-sm mb-6 border-green-200 bg-green-50" id="${demoId}">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2 text-green-900">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wrench w-5 h-5" aria-hidden="true">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
      </svg>
      ${lessonTemplate.title}
    </h3>
  </div>
  <div class="p-6 pt-4">
    <div class="bg-white p-4 rounded-lg">
      <h4 class="font-semibold mb-3">🛠️ Hands-On Building</h4>
      <p class="text-gray-700 mb-4">${lessonTemplate.description}</p>
      
      <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
        <h5 class="font-semibold text-green-800 mb-2">Build Checklist</h5>
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-green-700">
            <input type="checkbox" class="rounded border-green-300 text-green-600">
            <span class="text-sm">Gather all required components</span>
          </label>
          <label class="flex items-center gap-2 text-green-700">
            <input type="checkbox" class="rounded border-green-300 text-green-600">
            <span class="text-sm">Follow safety guidelines</span>
          </label>
          <label class="flex items-center gap-2 text-green-700">
            <input type="checkbox" class="rounded border-green-300 text-green-600">
            <span class="text-sm">Double-check connections</span>
          </label>
        </div>
      </div>
      
      <div class="bg-yellow-50 p-3 rounded-lg">
        <h5 class="font-medium mb-2">⚠️ Safety First</h5>
        <p class="text-sm text-yellow-700">Always double-check your connections and follow proper safety procedures when working with electronics.</p>
      </div>
    </div>
  </div>
</div>`;
}

function generateTestLesson(demoId: string, lessonTemplate: LessonTemplate): string {
  return `
<div class="rounded-xl border border-[var(--gray)] bg-[var(--white)] text-[var(--primary)] shadow-sm mb-6 border-purple-200 bg-purple-50" id="${demoId}">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2 text-purple-900">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play-circle w-5 h-5" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle><polygon points="10,8 16,12 10,16 10,8"></polygon>
      </svg>
      ${lessonTemplate.title}
    </h3>
  </div>
  <div class="p-6 pt-4">
    <div class="bg-white p-4 rounded-lg">
      <h4 class="font-semibold mb-3">🧪 Testing & Validation</h4>
      <p class="text-gray-700 mb-4">${lessonTemplate.description}</p>
      
      <div class="bg-purple-50 border-l-4 border-purple-400 p-4 mb-4">
        <h5 class="font-semibold text-purple-800 mb-2">Test Procedure</h5>
        <ol class="text-purple-700 space-y-1 text-sm list-decimal list-inside">
          <li>Power on your circuit</li>
          <li>Observe the expected behavior</li>
          <li>Document any issues</li>
          <li>Measure key parameters</li>
        </ol>
      </div>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-green-50 p-3 rounded-lg">
          <h5 class="font-semibold text-green-800 mb-1">✅ Success Criteria</h5>
          <p class="text-sm text-green-700">What should happen when everything works correctly</p>
        </div>
        <div class="bg-red-50 p-3 rounded-lg">
          <h5 class="font-semibold text-red-800 mb-1">❌ Troubleshooting</h5>
          <p class="text-sm text-red-700">Common issues and how to fix them</p>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

function generateIterateLesson(demoId: string, lessonTemplate: LessonTemplate): string {
  return `
<div class="rounded-xl border border-[var(--gray)] bg-[var(--white)] text-[var(--primary)] shadow-sm mb-6 border-indigo-200 bg-indigo-50" id="${demoId}">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2 text-indigo-900">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw w-5 h-5" aria-hidden="true">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M3 21v-5h5"></path>
      </svg>
      ${lessonTemplate.title}
    </h3>
  </div>
  <div class="p-6 pt-4">
    <div class="bg-white p-4 rounded-lg">
      <h4 class="font-semibold mb-3">🔄 Experiment & Improve</h4>
      <p class="text-gray-700 mb-4">${lessonTemplate.description}</p>
      
      <div class="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-4">
        <h5 class="font-semibold text-indigo-800 mb-2">Iteration Ideas</h5>
        <ul class="text-indigo-700 space-y-1 text-sm">
          <li>• Try different parameter values</li>
          <li>• Modify the timing or sequence</li>
          <li>• Add new features or variations</li>
          <li>• Optimize for better performance</li>
        </ul>
      </div>
      
      <div class="bg-gray-50 p-3 rounded-lg">
        <h5 class="font-medium mb-2">💭 Think About</h5>
        <p class="text-sm text-gray-600">What happens if you change this? How can you make it better, faster, or more interesting?</p>
      </div>
    </div>
  </div>
</div>`;
}

function generateReflectLesson(demoId: string, lessonTemplate: LessonTemplate): string {
  return `
<div class="rounded-xl border border-[var(--gray)] bg-[var(--white)] text-[var(--primary)] shadow-sm mb-6 border-teal-200 bg-teal-50" id="${demoId}">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2 text-teal-900">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain w-5 h-5" aria-hidden="true">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1 .34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0-.34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
      </svg>
      ${lessonTemplate.title}
    </h3>
  </div>
  <div class="p-6 pt-4">
    <div class="bg-white p-4 rounded-lg">
      <h4 class="font-semibold mb-3">🤔 Deep Thinking</h4>
      <p class="text-gray-700 mb-4">${lessonTemplate.description}</p>
      
      <div class="bg-teal-50 border-l-4 border-teal-400 p-4 mb-4">
        <h5 class="font-semibold text-teal-800 mb-2">Reflection Questions</h5>
        <ul class="text-teal-700 space-y-2 text-sm">
          <li>• Why does this work the way it does?</li>
          <li>• What are the underlying principles?</li>
          <li>• How does this connect to what you already know?</li>
          <li>• What would happen if you changed X?</li>
        </ul>
      </div>
      
      <div class="bg-blue-50 p-3 rounded-lg">
        <h5 class="font-medium mb-2">💡 Key Insight</h5>
        <p class="text-sm text-blue-700">Understanding the "why" behind the "how" is what transforms knowledge into wisdom.</p>
      </div>
    </div>
  </div>
</div>`;
}

function generateRecapLesson(demoId: string, lessonTemplate: LessonTemplate): string {
  return `
<div class="rounded-xl border border-[var(--gray)] bg-[var(--white)] text-[var(--primary)] shadow-sm mb-6 border-emerald-200 bg-emerald-50" id="${demoId}">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2 text-emerald-900">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle w-5 h-5" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline>
      </svg>
      ${lessonTemplate.title}
    </h3>
  </div>
  <div class="p-6 pt-4">
    <div class="bg-white p-4 rounded-lg">
      <h4 class="font-semibold mb-3">📝 Summary & Key Takeaways</h4>
      <p class="text-gray-700 mb-4">${lessonTemplate.description}</p>
      
      <div class="bg-emerald-50 border-l-4 border-emerald-400 p-4 mb-4">
        <h5 class="font-semibold text-emerald-800 mb-2">What You've Learned</h5>
        <ul class="text-emerald-700 space-y-1 text-sm">
          <li>• Core concepts and principles</li>
          <li>• Practical skills and techniques</li>
          <li>• Important connections and relationships</li>
          <li>• Next steps for further learning</li>
        </ul>
      </div>
      
      <div class="bg-yellow-50 p-3 rounded-lg">
        <h5 class="font-medium mb-2">🎯 Ready for Next Steps</h5>
        <p class="text-sm text-yellow-700">You now have the foundation to build upon. Consider how this knowledge applies to more complex projects!</p>
      </div>
    </div>
  </div>
</div>`;
}

function generateDefaultLesson(demoId: string, lessonTemplate: LessonTemplate): string {
  return `
<div class="rounded-xl border border-[var(--gray)] bg-[var(--white)] text-[var(--primary)] shadow-sm mb-6 border-blue-200 bg-blue-50" id="${demoId}">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2 text-blue-900">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cpu w-5 h-5" aria-hidden="true">
        <path d="M12 20v2"></path><path d="M12 2v2"></path><path d="M17 20v2"></path><path d="M17 2v2"></path><path d="M2 12h2"></path><path d="M2 17h2"></path><path d="M2 7h2"></path><path d="M20 12h2"></path><path d="M20 17h2"></path><path d="M20 7h2"></path><path d="M7 20v2"></path><path d="M7 2v2"></path><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="8" y="8" width="8" height="8" rx="1"></rect>
      </svg>
      ${lessonTemplate.title}
    </h3>
  </div>
  <div class="p-6 pt-4">
    <div class="bg-white p-4 rounded-lg">
      <h4 class="font-semibold mb-3">${lessonTemplate.title}</h4>
      <p class="text-gray-600">${lessonTemplate.description}</p>
      <p class="text-sm text-gray-500 mt-2">Lesson template implementation coming soon...</p>
    </div>
  </div>
</div>`;
}
