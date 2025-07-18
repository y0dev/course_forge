import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Clock,
  Target,
  Code2,
  FileText
} from "lucide-react";
import { Lesson, LessonStep } from "@/entities/Course";
// FormattingToolbar from StepBasedLessonEditor
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { generateDemoHtml } from "@/components/editor/demoTemplates";

export const codeListBlocks = [
  {
    label: "Blue Code List",
    value: "blue-codelist",
    html: `<div class="bg-blue-50 p-4 rounded-lg">
  <h4 class="font-bold text-blue-800 mb-2">🔧 Key Functions:</h4>
  <ul class="text-blue-700 text-sm space-y-1">
    <li><code>gpio_init()</code> - Initialize GPIO system</li>
    <li><code>gpio_set_direction()</code> - Configure pin mode</li>
    <li><code>gpio_write()</code> - Set pin HIGH/LOW</li>
  </ul>
</div>`
  },
  {
    label: "Green Code List",
    value: "green-codelist",
    html: `<div class="bg-green-50 p-4 rounded-lg">
  <h4 class="font-bold text-green-800 mb-2">🔧 Key Functions:</h4>
  <ul class="text-green-700 text-sm space-y-1">
    <li><code>adc_init()</code> - Initialize ADC</li>
    <li><code>adc_read()</code> - Read analog value</li>
    <li><code>adc_disable()</code> - Disable ADC</li>
  </ul>
</div>`
  },
  {
    label: "Purple Code List",
    value: "purple-codelist",
    html: `<div class="bg-purple-50 p-4 rounded-lg">
  <h4 class="font-bold text-purple-800 mb-2">🔧 Key Functions:</h4>
  <ul class="text-purple-700 text-sm space-y-1">
    <li><code>uart_init()</code> - Initialize UART</li>
    <li><code>uart_send()</code> - Send data</li>
    <li><code>uart_receive()</code> - Receive data</li>
  </ul>
</div>`
  }
];

interface FormattingToolbarProps {
  onFormat: (format: string, placeholder?: string) => void;
}

function FormattingToolbar({ onFormat }: FormattingToolbarProps) {
  const formatButtons = [
    { icon: Code2, label: "P", format: "p", placeholder: "Paragraph" },
    // List Block dropdown will be added below
    { icon: Code2, label: "Quote", format: "blockquote", placeholder: "Quote" },
    { icon: Code2, label: "Link", format: "a", placeholder: "Link text" },
    { icon: Code2, label: "Table", format: "table", placeholder: "Table" },
    // Demo dropdown will be added below
    { icon: Code2, label: "BR", format: "br", placeholder: "" },
    // Media dropdown will be added below
    // Div dropdown below
  ];
  // Text formatting options
  const textFormatOptions = [
    { label: "Bold", format: "strong", placeholder: "Bold text" },
    { label: "Italic", format: "em", placeholder: "Italic text" },
    { label: "Underline", format: "u", placeholder: "Underlined text" },
  ];
  // Header options
  const headerOptions = [
    { label: "Heading 1", format: "h1", placeholder: "Heading 1" },
    { label: "Heading 2", format: "h2", placeholder: "Heading 2" },
    { label: "Heading 3", format: "h3", placeholder: "Heading 3" },
  ];
  // List block color options
  const listBlockColors = [
    { label: "Blue Unordered", value: "blue-50", title: "Big-Endian Storage:", ulClass: "mt-2 space-y-1", type: "ul" },
    { label: "Green Unordered", value: "green-50", title: "Little-Endian Storage:", ulClass: "mt-2 space-y-1", type: "ul" },
    { label: "Blue Ordered", value: "blue-50", title: "Step-by-Step Process:", olClass: "mt-2 space-y-1 list-decimal list-inside", type: "ol" },
    { label: "Green Ordered", value: "green-50", title: "Implementation Steps:", olClass: "mt-2 space-y-1 list-decimal list-inside", type: "ol" },
  ];

  // Colored bullet list options
  const coloredBulletLists = [
    {
      label: "Red/Yellow/Blue Bullets",
      value: "rgb-bullets",
      html: `<ul class="space-y-2">
  <li class="flex items-center gap-2">
    <span class="w-3 h-3 bg-red-500 rounded-full"></span>
    <strong>LED:</strong> Light Emitting Diode (has polarity!)
  </li>
  <li class="flex items-center gap-2">
    <span class="w-3 h-3 bg-yellow-500 rounded-full"></span>
    <strong>Resistor:</strong> Limits current flow (220Ω recommended)
  </li>
  <li class="flex items-center gap-2">
    <span class="w-3 h-3 bg-blue-500 rounded-full"></span>
    <strong>GPIO Pin:</strong> Digital output from microcontroller
  </li>
</ul>`
    },
    {
      label: "Green/Orange/Purple Bullets",
      value: "gop-bullets",
      html: `<ul class="space-y-2">
  <li class="flex items-center gap-2">
    <span class="w-3 h-3 bg-green-500 rounded-full"></span>
    <strong>Component 1:</strong> Description of first component
  </li>
  <li class="flex items-center gap-2">
    <span class="w-3 h-3 bg-orange-500 rounded-full"></span>
    <strong>Component 2:</strong> Description of second component
  </li>
  <li class="flex items-center gap-2">
    <span class="w-3 h-3 bg-purple-500 rounded-full"></span>
    <strong>Component 3:</strong> Description of third component
  </li>
</ul>`
    },
    {
      label: "Cyan/Magenta/Indigo Bullets",
      value: "cmi-bullets",
      html: `<ul class="space-y-2">
  <li class="flex items-center gap-2">
    <span class="w-3 h-3 bg-cyan-500 rounded-full"></span>
    <strong>Step 1:</strong> First step description
  </li>
  <li class="flex items-center gap-2">
    <span class="w-3 h-3 bg-pink-500 rounded-full"></span>
    <strong>Step 2:</strong> Second step description
  </li>
  <li class="flex items-center gap-2">
    <span class="w-3 h-3 bg-indigo-500 rounded-full"></span>
    <strong>Step 3:</strong> Third step description
  </li>
</ul>`
    }
  ];
  // More tags for dropdown
  const moreTags = [
    { label: "Horizontal Rule", format: "hr", placeholder: "" },
    { label: "Superscript", format: "sup", placeholder: "superscript" },
    { label: "Subscript", format: "sub", placeholder: "subscript" },
    { label: "Mark", format: "mark", placeholder: "highlighted" },
    { label: "Deleted", format: "del", placeholder: "deleted" },
    { label: "Keyboard", format: "kbd", placeholder: "Ctrl+C" },
    { label: "Abbreviation", format: "abbr", placeholder: "abbr" },
  ];
  // Code languages for dropdown
  const codeLanguages = [
    { label: "JavaScript", value: "javascript", placeholder: "console.log('Hello, world!');" },
    { label: "Python", value: "python", placeholder: "print('Hello, world!')" },
    { label: "C++", value: "cpp", placeholder: "#include <iostream>\nint main() { std::cout << \"Hello, world!\"; }" },
    { label: "Java", value: "java", placeholder: "public class Main { public static void main(String[] args) { System.out.println(\"Hello, world!\"); } }" },
    { label: "HTML", value: "html", placeholder: "<h1>Hello, world!</h1>" },
    { label: "CSS", value: "css", placeholder: "body { color: blue; }" },
    { label: "TypeScript", value: "typescript", placeholder: "let message: string = 'Hello, world!';" },
    { label: "Bash", value: "bash", placeholder: "echo 'Hello, world!'" },
    { label: "JSON", value: "json", placeholder: "{ \"message\": \"Hello, world!\" }" },
    { label: "Other", value: "plaintext", placeholder: "code here" },
  ];
  
  // Demo options for embedded engineering
  const demoOptions = [
    { 
      label: "Memory Visualization", 
      value: "memory-viz", 
      title: "Memory Visualization Tool",
      description: "Interactive memory layout and endianness demonstration"
    },
    { 
      label: "GPIO Control", 
      value: "gpio-control", 
      title: "GPIO Pin Control Simulator",
      description: "Simulate GPIO pin states and configurations"
    },
    { 
      label: "UART Communication", 
      value: "uart-comm", 
      title: "UART Communication Simulator",
      description: "Interactive UART data transmission visualization"
    },
    { 
      label: "Interrupt Handler", 
      value: "interrupt-handler", 
      title: "Interrupt Handler Simulator",
      description: "Visualize interrupt processing and priority handling"
    },
    { 
      label: "Timer Configuration", 
      value: "timer-config", 
      title: "Timer Configuration Tool",
      description: "Configure and visualize timer settings"
    },
    { 
      label: "ADC Reading", 
      value: "adc-reading", 
      title: "ADC Reading Simulator",
      description: "Simulate analog-to-digital conversion readings"
    },
    { 
      label: "PWM Generator", 
      value: "pwm-generator", 
      title: "PWM Signal Generator",
      description: "Generate and visualize PWM signals"
    },
    { 
      label: "I2C Communication", 
      value: "i2c-comm", 
      title: "I2C Communication Simulator",
      description: "Interactive I2C master-slave communication"
    },
    { 
      label: "SPI Communication", 
      value: "spi-comm", 
      title: "SPI Communication Simulator",
      description: "Visualize SPI data transfer and clock signals"
    },
    { 
      label: "Watchdog Timer", 
      value: "watchdog-timer", 
      title: "Watchdog Timer Simulator",
      description: "Simulate watchdog timer behavior and resets"
    },
    { 
      label: "Interactive Code Simulator", 
      value: "code-sim-demo", 
      title: "Interactive Code Simulator",
      description: "Simulate GPIO pin and code execution"
    }
  ];
  const divDesigns = [
    {
      label: "Gray",
      value: "div-gray",
      html: '<div class="bg-gray-100 p-4 rounded-lg my-4">Div content</div>'
    },
    {
      label: "Red Alert",
      value: "div-red",
      html: '<div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 my-4">Div content</div>'
    },
    {
      label: "Amber Alert",
      value: "div-amber",
      html: '<div class="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">Div content</div>'
    },
    {
      label: "Green Alert",
      value: "div-green",
      html: '<div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">Div content</div>'
    }
  ];

  // Card layout options
  const cardLayouts = [
    {
      label: "2 Columns",
      value: "2-cols",
      html: `<div class="grid md:grid-cols-2 gap-6 my-6">
  <div class="bg-white p-5 rounded-lg shadow-md border border-slate-200">
    <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-2">
      <span class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs">1</span>
      Card Title 1
    </h4>
    <p class="text-slate-600 text-sm">Card description goes here.</p>
  </div>
  
  <div class="bg-white p-5 rounded-lg shadow-md border border-slate-200">
    <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-2">
      <span class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">2</span>
      Card Title 2
    </h4>
    <p class="text-slate-600 text-sm">Card description goes here.</p>
  </div>
</div>`
    },
    {
      label: "3 Columns",
      value: "3-cols",
      html: `<div class="grid md:grid-cols-3 gap-6 my-6">
  <div class="bg-white p-5 rounded-lg shadow-md border border-slate-200">
    <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-2">
      <span class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs">1</span>
      Card Title 1
    </h4>
    <p class="text-slate-600 text-sm">Card description goes here.</p>
  </div>
  
  <div class="bg-white p-5 rounded-lg shadow-md border border-slate-200">
    <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-2">
      <span class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">2</span>
      Card Title 2
    </h4>
    <p class="text-slate-600 text-sm">Card description goes here.</p>
  </div>
  
  <div class="bg-white p-5 rounded-lg shadow-md border border-slate-200">
    <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-2">
      <span class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">3</span>
      Card Title 3
    </h4>
    <p class="text-slate-600 text-sm">Card description goes here.</p>
  </div>
</div>`
    },
    {
      label: "4 Columns",
      value: "4-cols",
      html: `<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
  <div class="bg-white p-5 rounded-lg shadow-md border border-slate-200">
    <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-2">
      <span class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs">1</span>
      Card Title 1
    </h4>
    <p class="text-slate-600 text-sm">Card description goes here.</p>
  </div>
  
  <div class="bg-white p-5 rounded-lg shadow-md border border-slate-200">
    <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-2">
      <span class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">2</span>
      Card Title 2
    </h4>
    <p class="text-slate-600 text-sm">Card description goes here.</p>
  </div>
  
  <div class="bg-white p-5 rounded-lg shadow-md border border-slate-200">
    <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-2">
      <span class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">3</span>
      Card Title 3
    </h4>
    <p class="text-slate-600 text-sm">Card description goes here.</p>
  </div>
  
  <div class="bg-white p-5 rounded-lg shadow-md border border-slate-200">
    <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-2">
      <span class="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-xs">4</span>
      Card Title 4
    </h4>
    <p class="text-slate-600 text-sm">Card description goes here.</p>
  </div>
</div>`
    }
  ];

  // Info box options
  const infoBoxes = [
    {
      label: "Next Steps (Green)",
      value: "next-steps-green",
      html: `<div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
  <h4 class="font-bold text-green-800 mb-3">🎓 Next Steps:</h4>
  <ul class="text-green-700 space-y-2">
    <li>• Try controlling multiple LEDs simultaneously</li>
    <li>• Experiment with different blinking patterns</li>
    <li>• Add button input to control LED behavior</li>
    <li>• Create a traffic light simulation</li>
  </ul>
</div>`
    },
    {
      label: "Tips (Blue)",
      value: "tips-blue",
      html: `<div class="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
  <h4 class="font-bold text-blue-800 mb-3">💡 Pro Tips:</h4>
  <ul class="text-blue-700 space-y-2">
    <li>• Always check your connections before powering on</li>
    <li>• Use appropriate resistor values for your LEDs</li>
    <li>• Consider power consumption in your designs</li>
    <li>• Test your code incrementally</li>
  </ul>
</div>`
    },
    {
      label: "Warning (Amber)",
      value: "warning-amber",
      html: `<div class="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-200">
  <h4 class="font-bold text-amber-800 mb-3">⚠️ Important Notes:</h4>
  <ul class="text-amber-700 space-y-2">
    <li>• Never connect LEDs directly to GPIO pins</li>
    <li>• Always use current-limiting resistors</li>
    <li>• Check voltage levels before connecting</li>
    <li>• Double-check your wiring connections</li>
  </ul>
</div>`
    },
    {
      label: "Resources (Purple)",
      value: "resources-purple",
      html: `<div class="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
  <h4 class="font-bold text-purple-800 mb-3">📚 Additional Resources:</h4>
  <ul class="text-purple-700 space-y-2">
    <li>• Official microcontroller documentation</li>
    <li>• Community forums and discussions</li>
    <li>• Video tutorials and walkthroughs</li>
    <li>• Sample code repositories</li>
  </ul>
</div>`
    }
  ];
  return (
    <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border border-slate-200 rounded-md mb-2">
      
      {/* Headers dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" title="Headers">
            <Code2 className="w-3 h-3 mr-1" />Headers
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-white border border-slate-200 shadow-lg">
          {headerOptions.map((option) => (
            <DropdownMenuItem
              key={option.format}
              onClick={() => onFormat(option.format, option.placeholder)}
              className="hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {formatButtons.map((button) => {
        const Icon = button.icon;
        return (
          <Button
            key={button.format}
            variant="ghost"
            size="sm"
            onClick={() => onFormat(button.format, button.placeholder)}
            className="h-8 px-2 text-xs"
            title={`Insert ${button.label}`}
          >
            <Icon className="w-3 h-3 mr-1" />
            {button.label}
          </Button>
        );
      })}   
      {/* Text Formatting dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" title="Text Formatting">
            <Code2 className="w-3 h-3 mr-1" />Text
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-white border border-slate-200 shadow-lg">
          {textFormatOptions.map((option) => (
            <DropdownMenuItem
              key={option.format}
              onClick={() => onFormat(option.format, option.placeholder)}
              className="hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Demo dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" title="Insert Interactive Demo">
            <Code2 className="w-3 h-3 mr-1" />Demo
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-white border border-slate-200 shadow-lg max-w-md">
          {demoOptions.map((demo) => (
            <DropdownMenuItem
              key={demo.value}
              onClick={() => onFormat("demo", JSON.stringify(demo))}
              className="hover:bg-blue-50 hover:text-blue-700 transition-colors p-3"
            >
              <div className="flex flex-col">
                <span className="font-medium">{demo.label}</span>
                <span className="text-xs text-slate-600 mt-1">{demo.description}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Media dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" title="Insert Media">
            <Code2 className="w-3 h-3 mr-1" />Media
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-white border border-slate-200 shadow-lg">
          <DropdownMenuItem
            onClick={() => onFormat("image", "https://example.com/image.jpg")}
            className="hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
              Image
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFormat("gif", "https://example.com/animation.gif")}
            className="hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
              GIF
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFormat("video", "https://example.com/video.mp4")}
            className="hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <polygon points="5,3 19,12 5,21 5,3"></polygon>
              </svg>
              Video
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFormat("youtube", "https://www.youtube.com/watch?v=dQw4w9WgXcQ")}
            className="hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.34A85.85 85.85 0 0 1 12 2a85.85 85.85 0 0 1 8.1 3.66A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.34A85.85 85.85 0 0 1 12 22a85.85 85.85 0 0 1-8.1-3.66A2 2 0 0 1 2.5 17Z"></path>
                <path d="m10 15 5-3-5-3z"></path>
              </svg>
              YouTube
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Code dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" title="Insert Code Block">
            <Code2 className="w-3 h-3 mr-1" />Code
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-white border border-slate-200 shadow-lg">
          {codeLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.value}
              onClick={() => onFormat("codeblock", JSON.stringify(lang))}
              className="hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {lang.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" title="Insert Div">
            <Code2 className="w-3 h-3 mr-1" />Div
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-white border border-slate-200 shadow-lg">
          {divDesigns.map((design) => (
            <DropdownMenuItem
              key={design.value}
              onClick={() => onFormat("div", design.html)}
              className="hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {design.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* List Block dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" title="Insert List Block">
            <Code2 className="w-3 h-3 mr-1" />List Block
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-white border border-slate-200 shadow-lg">
          {listBlockColors.map((color) => (
            <DropdownMenuItem
              key={`${color.value}-${color.type}`}
              onClick={async () => {
                let title = prompt(`Enter list block title:`, color.title);
                if (!title) title = color.title;
                const config = {
                  color: color.value,
                  title,
                  type: color.type,
                  ulClass: color.ulClass,
                  olClass: color.olClass
                };
                onFormat("listblock", JSON.stringify(config));
              }}
              className="hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {color.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Colored Bullet Lists dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" title="Insert Colored Bullet List">
            <Code2 className="w-3 h-3 mr-1" />Colored Bullets
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-white border border-slate-200 shadow-lg">
          {coloredBulletLists.map((list) => (
            <DropdownMenuItem
              key={list.value}
              onClick={() => onFormat("coloredbullets", list.html)}
              className="hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {list.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* More tags dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" title="More HTML Tags">
            <Code2 className="w-3 h-3 mr-1" />More
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-white border border-slate-200 shadow-lg">
          {moreTags.map((tag) => (
            <DropdownMenuItem
              key={tag.format}
              onClick={() => onFormat(tag.format, tag.placeholder)}
              className="hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {tag.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Cards dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" title="Insert Card Layout">
            <Code2 className="w-3 h-3 mr-1" />Cards
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-white border border-slate-200 shadow-lg">
          {cardLayouts.map((layout) => (
            <DropdownMenuItem
              key={layout.value}
              onClick={() => onFormat("cards", layout.html)}
              className="hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {layout.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Info Box dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" title="Insert Info Box">
            <Code2 className="w-3 h-3 mr-1" />Info Box
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-white border border-slate-200 shadow-lg">
          {infoBoxes.map((box) => (
            <DropdownMenuItem
              key={box.value}
              onClick={() => onFormat("infobox", box.html)}
              className="hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {box.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Code List dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" title="Insert Code List">
            <Code2 className="w-3 h-3 mr-1" />Code List
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-white border border-slate-200 shadow-lg">
          {codeListBlocks.map((block: { label: string; value: string; html: string }) => (
            <DropdownMenuItem
              key={block.value}
              onClick={() => onFormat("codelist", block.html)}
              className="hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {block.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface LessonTemplateCreatorProps {
  courseTitle: string;
  onSave: (lesson: Lesson) => void;
  onCancel: () => void;
  initialLesson?: Lesson;
}

function getPreviewHtml(content: string): string {
  if (!content) return '';
  
  // Regex to find the first <h1>, <h2>, or <h3>
  const headerRegex = /<(h[1-3])[^>]*>([\s\S]*?)<\/h[1-3]>/i;
  const match = content.match(headerRegex);
  
  if (!match) return content;
  
  const headerText = match[2].trim();
  const headerStart = match.index!;
  const headerEnd = headerStart + match[0].length;
  
  // Create the styled header with book icon
  const styledHeader = `<div class="flex flex-col space-y-1.5 p-6"><h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2"><div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open w-4 h-4 text-blue-600" aria-hidden="true"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg></div>${headerText}</h3></div>`;
  
  // Split content into before header, header, and after header
  const beforeHeader = content.slice(0, headerStart);
  const afterHeader = content.slice(headerEnd);
  
  // Wrap the content after header with the specified div structure
  const wrappedAfterHeader = afterHeader.trim() ? `<div class="p-6 pt-4 prose prose-slate max-w-none"><div class="space-y-4">${afterHeader}</div></div>` : '';
  
  // Return the content with the styled header and wrapped content
  return beforeHeader + styledHeader + wrappedAfterHeader;
}

export default function LessonTemplateCreator({ 
  courseTitle, 
  onSave, 
  onCancel,
  initialLesson
}: LessonTemplateCreatorProps) {
  const [lesson, setLesson] = useState<Partial<Lesson>>(initialLesson || {
    title: "",
    course: courseTitle,
    estimatedTime: 15,
    difficulty: "Beginner",
    progress: 0,
    steps: []
  });
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateLesson = (updates: Partial<Lesson>) => {
    setLesson(prev => ({ ...prev, ...updates }));
  };

  const addStep = () => {
    const newStep: LessonStep = {
      title: "New Step",
      content: `<h1>Step Content</h1>\n\n<p>Add your content here...</p>`
    };
    const updatedSteps = [...(lesson.steps || []), newStep];
    updateLesson({ steps: updatedSteps });
    setActiveStepIndex(updatedSteps.length - 1);
  };

  const updateStep = (index: number, updates: Partial<LessonStep>) => {
    const updatedSteps = [...(lesson.steps || [])];
    updatedSteps[index] = { ...updatedSteps[index], ...updates };
    updateLesson({ steps: updatedSteps });
  };

  const deleteStep = (index: number) => {
    const updatedSteps = (lesson.steps || []).filter((_, i) => i !== index);
    updateLesson({ steps: updatedSteps });
    if (activeStepIndex >= updatedSteps.length) {
      setActiveStepIndex(Math.max(0, updatedSteps.length - 1));
    }
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const updatedSteps = [...(lesson.steps || [])];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < updatedSteps.length) {
      [updatedSteps[index], updatedSteps[newIndex]] = [updatedSteps[newIndex], updatedSteps[index]];
      updateLesson({ steps: updatedSteps });
      setActiveStepIndex(newIndex);
    }
  };

  const handleSave = () => {
    if (lesson.title && lesson.steps && lesson.steps.length > 0) {
      const newLesson: Lesson = {
        id: lesson.id || Date.now().toString(),
        title: lesson.title,
        course: lesson.course || courseTitle,
        estimatedTime: lesson.estimatedTime || 15,
        difficulty: lesson.difficulty || "Beginner",
        progress: lesson.progress || 0,
        steps: lesson.steps,
        slug: lesson.slug || `lesson-${Date.now()}`,
      };
      onSave(newLesson);
    }
  };

  const canSave = lesson.title && lesson.steps && lesson.steps.length > 0;

  function extractYouTubeId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  function handleFormat(format: string, placeholder?: string) {
    if (!textareaRef.current || activeStepIndex < 0 || !lesson.steps || activeStepIndex >= lesson.steps.length) {
      return;
    }
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const currentContent = lesson.steps[activeStepIndex].content || "";
    let newContent = '';
    let newCursorPos = start;
    switch (format) {
      case 'h1':
        newContent = currentContent.substring(0, start) + `<h1>${selectedText || placeholder || 'Heading 1'}</h1>` + currentContent.substring(end);
        newCursorPos = start + 4 + (selectedText || placeholder || 'Heading 1').length + 5;
        break;
      case 'h2':
        newContent = currentContent.substring(0, start) + `<h2>${selectedText || placeholder || 'Heading 2'}</h2>` + currentContent.substring(end);
        newCursorPos = start + 4 + (selectedText || placeholder || 'Heading 2').length + 5;
        break;
      case 'h3':
        newContent = currentContent.substring(0, start) + `<h3>${selectedText || placeholder || 'Heading 3'}</h3>` + currentContent.substring(end);
        newCursorPos = start + 4 + (selectedText || placeholder || 'Heading 3').length + 5;
        break;
      case 'p':
        newContent = currentContent.substring(0, start) + `<p>${selectedText || placeholder || 'Paragraph'}</p>` + currentContent.substring(end);
        newCursorPos = start + 3 + (selectedText || placeholder || 'Paragraph').length + 4;
        break;
      case 'strong':
        newContent = currentContent.substring(0, start) + `<strong>${selectedText || placeholder || 'Bold text'}</strong>` + currentContent.substring(end);
        newCursorPos = start + 8 + (selectedText || placeholder || 'Bold text').length + 9;
        break;
      case 'em':
        newContent = currentContent.substring(0, start) + `<em>${selectedText || placeholder || 'Italic text'}</em>` + currentContent.substring(end);
        newCursorPos = start + 4 + (selectedText || placeholder || 'Italic text').length + 5;
        break;
      case 'listblock':
        // placeholder param is a stringified color/title object
        let listBlock = { color: 'blue-50', title: 'List', type: 'ul', ulClass: 'mt-2 space-y-1', olClass: 'mt-2 space-y-1 list-decimal list-inside' };
        try {
          if (placeholder) listBlock = JSON.parse(placeholder);
        } catch {}
        
        const listItems = listBlock.type === 'ol' 
          ? `<ol class="${listBlock.olClass}">\n    <li>Step 1</li>\n    <li>Step 2</li>\n    <li>Step 3</li>\n  </ol>`
          : `<ul class="${listBlock.ulClass}">\n    <li>Item 1</li>\n    <li>Item 2</li>\n    <li>Item 3</li>\n  </ul>`;
          
        newContent = currentContent.substring(0, start) +
          `<div class="bg-${listBlock.color} p-4 rounded-lg border border-${listBlock.color.replace('-50', '-200')}">\n  <h4 class="font-bold text-${listBlock.color.replace('-50', '-900')} mb-2">${listBlock.title}</h4>\n  ${listItems}\n</div>`
          + currentContent.substring(end);
        newCursorPos = start + 0;
        break;
      case 'table':
        newContent = currentContent.substring(0, start) + `<div class="bg-gray-100 p-4 rounded-lg my-4">\n  <h4>Same Example: Storing 0x12345678</h4>\n  <table class="w-full mt-2">\n    <tr class="bg-green-100">\n      <th class="p-2 border">Memory Address</th>\n      <th class="p-2 border">0x1000</th>\n      <th class="p-2 border">0x1001</th>\n      <th class="p-2 border">0x1002</th>\n      <th class="p-2 border">0x1003</th>\n    </tr>\n    <tr>\n      <td class="p-2 border font-bold">Byte Value</td>\n      <td class="p-2 border text-center">0x78</td>\n      <td class="p-2 border text-center">0x56</td>\n      <td class="p-2 border text-center">0x34</td>\n      <td class="p-2 border text-center">0x12</td>\n    </tr>\n  </table>\n</div>` + currentContent.substring(end);
        newCursorPos = start + 0;
        break;
      case 'div':
        let divHtml = placeholder || '<div class="bg-gray-100 p-4 rounded-lg my-4">Div content</div>';
        if (selectedText) {
          divHtml = divHtml.replace('Div content', selectedText);
        }
        newContent = currentContent.substring(0, start) + divHtml + currentContent.substring(end);
        newCursorPos = start + divHtml.length;
        break;
      case 'blockquote':
        newContent = currentContent.substring(0, start) + `<blockquote>${selectedText || placeholder || 'Quote'}</blockquote>` + currentContent.substring(end);
        newCursorPos = start + 12 + (selectedText || placeholder || 'Quote').length + 13;
        break;
      case 'a':
        newContent = currentContent.substring(0, start) + `<a href="#" target="_blank">${selectedText || placeholder || 'Link text'}</a>` + currentContent.substring(end);
        newCursorPos = start + 9 + (selectedText || placeholder || 'Link text').length + 4;
        break;
      case 'demo':
        // placeholder param is a stringified demo object
        let demoConfig = { 
          value: 'memory-viz', 
          label: 'Memory Visualization', 
          title: 'Memory Visualization Tool',
          description: 'Interactive memory layout and endianness demonstration'
        };
        try {
          if (placeholder) demoConfig = JSON.parse(placeholder);
        } catch {}
        
        const demoHtml = generateDemoHtml(demoConfig);
        newContent = currentContent.substring(0, start) + demoHtml + currentContent.substring(end);
        newCursorPos = start + 0;
        break;
        newContent = currentContent.substring(0, start) + demoHtml + currentContent.substring(end);
        newCursorPos = start + 0;
        break;
      case 'codeblock':
        // placeholder param is a stringified language object
        let langObj = { value: 'plaintext', label: 'Other', placeholder: 'code here' };
        try {
          if (placeholder) langObj = JSON.parse(placeholder);
        } catch {}
        const codeContent = selectedText || langObj.placeholder;
        // Escape code for data-code attribute
        const escapeForAttr = (str: string) => str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        newContent = currentContent.substring(0, start) +
          `<div class="rounded-lg shadow-lg overflow-hidden border border-slate-200 mb-4">
            <div class="flex items-center justify-between bg-blue-600 px-4 py-2">
              <span class="text-xs font-semibold uppercase tracking-wide text-white bg-blue-800 rounded px-2 py-1">${langObj.label}</span>
              <button class="copy-btn flex items-center gap-1 text-xs text-white hover:text-blue-200 transition" data-code="${escapeForAttr(codeContent)}" title="Copy code">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>
                Copy
              </button>
            </div>
            <pre class="bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto font-mono"><code class="language-${langObj.value}">${codeContent}</code></pre>
          </div>`
          + currentContent.substring(end);
        newCursorPos = start + 0;
        break;
      case 'br':
        newContent = currentContent.substring(0, start) + '<br />' + currentContent.substring(end);
        newCursorPos = start + 6;
        break;
      case 'hr':
        newContent = currentContent.substring(0, start) + '<hr />' + currentContent.substring(end);
        newCursorPos = start + 6;
        break;
      case 'sup':
        newContent = currentContent.substring(0, start) + `<sup>${selectedText || placeholder || ''}</sup>` + currentContent.substring(end);
        newCursorPos = start + 5 + (selectedText || placeholder || '').length + 6;
        break;
      case 'sub':
        newContent = currentContent.substring(0, start) + `<sub>${selectedText || placeholder || ''}</sub>` + currentContent.substring(end);
        newCursorPos = start + 5 + (selectedText || placeholder || '').length + 6;
        break;
      case 'mark':
        newContent = currentContent.substring(0, start) + `<mark>${selectedText || placeholder || ''}</mark>` + currentContent.substring(end);
        newCursorPos = start + 6 + (selectedText || placeholder || '').length + 7;
        break;
      case 'del':
        newContent = currentContent.substring(0, start) + `<del>${selectedText || placeholder || ''}</del>` + currentContent.substring(end);
        newCursorPos = start + 5 + (selectedText || placeholder || '').length + 6;
        break;
      case 'kbd':
        newContent = currentContent.substring(0, start) + `<kbd>${selectedText || placeholder || ''}</kbd>` + currentContent.substring(end);
        newCursorPos = start + 5 + (selectedText || placeholder || '').length + 6;
        break;
      case 'abbr':
        newContent = currentContent.substring(0, start) + `<abbr>${selectedText || placeholder || ''}</abbr>` + currentContent.substring(end);
        newCursorPos = start + 6 + (selectedText || placeholder || '').length + 7;
        break;
      case 'u':
        newContent = currentContent.substring(0, start) + `<u>${selectedText || placeholder || ''}</u>` + currentContent.substring(end);
        newCursorPos = start + 3 + (selectedText || placeholder || '').length + 4;
        break;
      case 'image':
        const imageUrl = selectedText || placeholder || 'https://example.com/image.jpg';
        const imageAlt = prompt('Enter alt text for the image:', 'Image description');
        const imageTitle = prompt('Enter title for the image (optional):', '');
        const imageHtml = imageTitle 
          ? `<div class="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-200 my-6">
  <img src="${imageUrl}" alt="${imageAlt || 'Image'}" class="w-full h-48 object-cover rounded-lg mb-4 shadow-md">
  <p class="text-sm text-cyan-700 text-center"><strong>${imageTitle}</strong></p>
</div>`
          : `<div class="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-200 my-6">
  <img src="${imageUrl}" alt="${imageAlt || 'Image'}" class="w-full h-48 object-cover rounded-lg shadow-md">
</div>`;
        newContent = currentContent.substring(0, start) + imageHtml + currentContent.substring(end);
        newCursorPos = start + 0;
        break;
      case 'gif':
        const gifUrl = selectedText || placeholder || 'https://example.com/animation.gif';
        const gifAlt = prompt('Enter alt text for the GIF:', 'Animated GIF');
        const gifTitle = prompt('Enter title for the GIF (optional):', '');
        const gifHtml = gifTitle 
          ? `<div class="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-200 my-6">
  <img src="${gifUrl}" alt="${gifAlt || 'GIF'}" class="w-full h-48 object-cover rounded-lg mb-4 shadow-md">
  <p class="text-sm text-cyan-700 text-center"><strong>${gifTitle}</strong></p>
</div>`
          : `<div class="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-200 my-6">
  <img src="${gifUrl}" alt="${gifAlt || 'GIF'}" class="w-full h-48 object-cover rounded-lg shadow-md">
</div>`;
        newContent = currentContent.substring(0, start) + gifHtml + currentContent.substring(end);
        newCursorPos = start + 0;
        break;
      case 'video':
        const videoUrl = selectedText || placeholder || 'https://example.com/video.mp4';
        const videoTitle = prompt('Enter title for the video:', 'Video');
        newContent = currentContent.substring(0, start) + `<div class="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-200 my-6">
  <video controls class="w-full h-48 object-cover rounded-lg mb-4 shadow-md">
    <source src="${videoUrl}" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  <p class="text-sm text-cyan-700 text-center"><strong>${videoTitle || 'Video'}</strong></p>
</div>` + currentContent.substring(end);
        newCursorPos = start + 0;
        break;
      case 'youtube':
        const youtubeUrl = selectedText || placeholder || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        const videoId = extractYouTubeId(youtubeUrl);
        const youtubeTitle = prompt('Enter title for the YouTube video:', 'YouTube Video');
        if (videoId) {
          newContent = currentContent.substring(0, start) + `<div class="my-4"><div class="relative w-full" style="padding-bottom: 56.25%;"><iframe src="https://www.youtube.com/embed/${videoId}" class="absolute top-0 left-0 w-full h-full rounded-lg shadow-md" frameborder="0" allowfullscreen></iframe></div><p class="text-sm text-gray-600 mt-2">${youtubeTitle || 'YouTube Video'}</p></div>` + currentContent.substring(end);
        } else {
          newContent = currentContent.substring(0, start) + `<div class="my-4 p-4 bg-red-50 border border-red-200 rounded-lg"><p class="text-red-600">Invalid YouTube URL. Please provide a valid YouTube video URL.</p></div>` + currentContent.substring(end);
        }
        newCursorPos = start + 0;
        break;
      case 'cards':
        let cardsHtml = placeholder || `<div class="grid md:grid-cols-2 gap-6 my-6">
  <div class="bg-white p-5 rounded-lg shadow-md border border-slate-200">
    <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-2">
      <span class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs">1</span>
      Card Title 1
    </h4>
    <p class="text-slate-600 text-sm">Card description goes here.</p>
  </div>
  
  <div class="bg-white p-5 rounded-lg shadow-md border border-slate-200">
    <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-2">
      <span class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">2</span>
      Card Title 2
    </h4>
    <p class="text-slate-600 text-sm">Card description goes here.</p>
  </div>
</div>`;
        if (selectedText) {
          // Replace card titles with selected text if provided
          cardsHtml = cardsHtml.replace(/Card Title \d+/g, (match: string) => {
            const cardNumber = match.match(/\d+/)?.[0];
            if (cardNumber) {
              const lines = selectedText.split('\n');
              return lines[parseInt(cardNumber) - 1] || match;
            }
            return match;
          });
        }
        newContent = currentContent.substring(0, start) + cardsHtml + currentContent.substring(end);
        newCursorPos = start + 0;
        break;
      case 'infobox':
        let infoboxHtml = placeholder || `<div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
  <h4 class="font-bold text-green-800 mb-3">🎓 Next Steps:</h4>
  <ul class="text-green-700 space-y-2">
    <li>• Try controlling multiple LEDs simultaneously</li>
    <li>• Experiment with different blinking patterns</li>
    <li>• Add button input to control LED behavior</li>
    <li>• Create a traffic light simulation</li>
  </ul>
</div>`;
        if (selectedText) {
          // Replace list items with selected text if provided
          const lines = selectedText.split('\n').filter(line => line.trim());
          if (lines.length > 0) {
            const listItems = lines.map(line => `    <li>• ${line.trim()}</li>`).join('\n');
            infoboxHtml = infoboxHtml.replace(/    <li>• .*<\/li>/g, '').replace(/(<ul class="[^"]*">)/, `$1\n${listItems}\n  `);
          }
        }
        newContent = currentContent.substring(0, start) + infoboxHtml + currentContent.substring(end);
        newCursorPos = start + 0;
        break;
      case 'coloredbullets':
        let coloredBulletsHtml = placeholder || `<ul class="space-y-2">
  <li class="flex items-center gap-2">
    <span class="w-3 h-3 bg-red-500 rounded-full"></span>
    <strong>LED:</strong> Light Emitting Diode (has polarity!)
  </li>
  <li class="flex items-center gap-2">
    <span class="w-3 h-3 bg-yellow-500 rounded-full"></span>
    <strong>Resistor:</strong> Limits current flow (220Ω recommended)
  </li>
  <li class="flex items-center gap-2">
    <span class="w-3 h-3 bg-blue-500 rounded-full"></span>
    <strong>GPIO Pin:</strong> Digital output from microcontroller
  </li>
</ul>`;
        if (selectedText) {
          // Replace list items with selected text if provided
          const lines = selectedText.split('\n').filter(line => line.trim());
          if (lines.length > 0) {
            const colors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500', 'bg-cyan-500', 'bg-pink-500', 'bg-indigo-500'];
            const listItems = lines.map((line, index) => {
              const color = colors[index % colors.length];
              return `  <li class="flex items-center gap-2">
    <span class="w-3 h-3 ${color} rounded-full"></span>
    <strong>${line.trim()}</strong>
  </li>`;
            }).join('\n');
            coloredBulletsHtml = `<ul class="space-y-2">\n${listItems}\n</ul>`;
          }
        }
        newContent = currentContent.substring(0, start) + coloredBulletsHtml + currentContent.substring(end);
        newCursorPos = start + 0;
        break;
      case 'codelist':
        let codeListHtml = placeholder || codeListBlocks[0].html;
        if (selectedText) {
          // Each line becomes a code item
          const lines = selectedText.split('\n').filter(line => line.trim());
          if (lines.length > 0) {
            // Pick color from placeholder html
            const colorMatch = codeListHtml.match(/bg-(\w+)-50/);
            const color = colorMatch ? colorMatch[1] : 'blue';
            const textColor = color === 'blue' ? 'text-blue-700' : color === 'green' ? 'text-green-700' : 'text-purple-700';
            const h4Color = color === 'blue' ? 'text-blue-800' : color === 'green' ? 'text-green-800' : 'text-purple-800';
            const blockBg = `bg-${color}-50`;
            const listItems = lines.map(line => `<li><code>${line.trim().split(' ')[0]}</code> - ${line.trim().split(' ').slice(1).join(' ')}</li>`).join('\n');
            codeListHtml = `<div class="${blockBg} p-4 rounded-lg">\n  <h4 class="${h4Color} mb-2">🔧 Key Functions:</h4>\n  <ul class="${textColor} text-sm space-y-1">\n    ${listItems}\n  </ul>\n</div>`;
          }
        }
        newContent = currentContent.substring(0, start) + codeListHtml + currentContent.substring(end);
        newCursorPos = start + 0;
        break;
      default:
        return;
    }
    updateStep(activeStepIndex, { content: newContent });
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  }

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{initialLesson ? 'Edit Lesson' : 'Create New Lesson'}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {lesson.estimatedTime}m
              </Badge>
              <Badge variant="outline">
                {lesson.difficulty}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Lesson Title</label>
              <Input
                value={lesson.title}
                onChange={(e) => updateLesson({ title: e.target.value })}
                placeholder="Enter lesson title"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Estimated Time (minutes)</label>
              <Input
                type="number"
                value={lesson.estimatedTime}
                onChange={(e) => updateLesson({ estimatedTime: parseInt(e.target.value) || 15 })}
                min="1"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Difficulty</label>
            <select
              value={lesson.difficulty}
              onChange={(e) => updateLesson({ difficulty: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' })}
              className="w-full mt-1 p-2 border border-slate-200 rounded-md"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Steps Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lesson Steps ({lesson.steps?.length || 0})</CardTitle>
            <Button onClick={addStep} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!lesson.steps || lesson.steps.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 mb-4">No steps yet. Add your first step to get started!</p>
              <Button onClick={addStep}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Step
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Steps List */}
              <div className="lg:col-span-1">
                <h4 className="font-medium text-slate-700 mb-3">Steps</h4>
                <div className="space-y-2">
                  {lesson.steps.map((step, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        activeStepIndex === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setActiveStepIndex(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {index + 1}. {step.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveStep(index, 'up');
                            }}
                            disabled={index === 0}
                          >
                            <MoveUp className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveStep(index, 'down');
                            }}
                            disabled={index === lesson.steps!.length - 1}
                          >
                            <MoveDown className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteStep(index);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Editor */}
              <div className="lg:col-span-2">
                {activeStepIndex >= 0 && activeStepIndex < (lesson.steps?.length || 0) && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Step Title</label>
                      <Input
                        value={lesson.steps![activeStepIndex].title}
                        onChange={(e) => updateStep(activeStepIndex, { title: e.target.value })}
                        placeholder="Enter step title"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Step Content (HTML)</label>
                      <FormattingToolbar onFormat={handleFormat} />
                      {/* Formatting logic for HTML content */}
                      <textarea
                        ref={textareaRef}
                        value={lesson.steps![activeStepIndex].content}
                        onChange={(e) => updateStep(activeStepIndex, { content: e.target.value })}
                        placeholder="Enter HTML content for this step..."
                        className="w-full mt-1 p-3 border border-slate-200 rounded-md h-64 font-mono text-sm"
                      />
                    </div>
                    
                    {/* Content Preview */}
                    <div>
                      <label className="text-sm font-medium text-slate-700">Step Preview</label>
                      <div
                        className="mt-1 p-4 border border-slate-200 rounded-md bg-white min-h-32 prose prose-slate max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: getPreviewHtml(lesson.steps![activeStepIndex].content)
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!canSave}>
          <Save className="w-4 h-4 mr-2" />
          {initialLesson ? 'Save Changes' : 'Create Lesson'}
        </Button>
      </div>
    </div>
  );
} 