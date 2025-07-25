import { Lesson } from "@/entities/Course";

export const createEndiannessLesson = (courseTitle: string): Lesson => {
  return {
    id: Date.now().toString(),
    title: "Understanding Endianness",
    course: courseTitle,
    estimatedTime: 15,
    difficulty: "Beginner",
    progress: 45,
    steps: [
      {
        title: "What is Endianness?",
        content: `
          <h3>Welcome to the world of byte ordering! 🎯</h3>
          <p>Imagine you're writing a multi-digit number like <strong>1234</strong> on paper. Do you write it left-to-right or right-to-left?</p>
          
          <p>In embedded systems, computers face the same question when storing multi-byte numbers in memory. This ordering choice is called <strong>endianness</strong>.</p>
          
          <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 my-4">
            <p><strong>💡 Quick Analogy:</strong> Think of endianness like reading directions - some cultures read left-to-right (English), others right-to-left (Arabic). Both are correct, just different conventions!</p>
          </div>
        `
      },
      {
        title: "Big-Endian: The Intuitive Way",
        content: `
          <h3>Big-Endian: Most Significant Byte First 📊</h3>
          
          <p>Big-endian stores the most significant byte at the lowest memory address - just like how we naturally write numbers!</p>
          
          <div class="bg-gray-100 p-4 rounded-lg my-4">
            <h4>Example: Storing 0x12345678</h4>
            <table class="w-full mt-2">
              <tr class="bg-blue-100">
                <th class="p-2 border">Memory Address</th>
                <th class="p-2 border">0x1000</th>
                <th class="p-2 border">0x1001</th>
                <th class="p-2 border">0x1002</th>
                <th class="p-2 border">0x1003</th>
              </tr>
              <tr>
                <td class="p-2 border font-bold">Byte Value</td>
                <td class="p-2 border text-center">0x12</td>
                <td class="p-2 border text-center">0x34</td>
                <td class="p-2 border text-center">0x56</td>
                <td class="p-2 border text-center">0x78</td>
              </tr>
            </table>
          </div>
          
          <p><strong>💭 Think of it like this:</strong> Reading a book - you start with the most important (significant) information first!</p>
          
          <p><strong>Used by:</strong> Network protocols, PowerPC, SPARC, most RISC architectures</p>
        `
      },
      {
        title: "Little-Endian: The Processor's Choice",
        content: `
          <h3>Little-Endian: Least Significant Byte First 🔄</h3>
          
          <p>Little-endian stores the least significant byte at the lowest memory address. It might seem backwards, but there's a good reason!</p>
          
          <div class="bg-gray-100 p-4 rounded-lg my-4">
            <h4>Same Example: Storing 0x12345678</h4>
            <table class="w-full mt-2">
              <tr class="bg-green-100">
                <th class="p-2 border">Memory Address</th>
                <th class="p-2 border">0x1000</th>
                <th class="p-2 border">0x1001</th>
                <th class="p-2 border">0x1002</th>
                <th class="p-2 border">0x1003</th>
              </tr>
              <tr>
                <td class="p-2 border font-bold">Byte Value</td>
                <td class="p-2 border text-center">0x78</td>
                <td class="p-2 border text-center">0x56</td>
                <td class="p-2 border text-center">0x34</td>
                <td class="p-2 border text-center">0x12</td>
              </tr>
            </table>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 my-4">
            <p><strong>🚀 Why Little-Endian?</strong> It makes mathematical operations more efficient! When adding numbers, you start from the least significant digit - just like little-endian storage.</p>
          </div>
          
          <p><strong>Used by:</strong> x86/x64 processors, ARM (configurable), most microcontrollers</p>
        `
      },
      {
        title: "Practical Implications",
        content: `
          <h3>Why Does This Matter in Embedded Systems? ⚡</h3>
          
          <h4>1. Network Communication</h4>
          <p>Networks use big-endian (network byte order). Your little-endian microcontroller must convert!</p>
          
          <div class="bg-gray-100 p-4 rounded-lg my-4">
            <code>
// Converting for network transmission<br/>
uint32_t host_value = 0x12345678;<br/>
uint32_t network_value = htonl(host_value); // Host to Network Long
            </code>
          </div>
          
          <h4>2. File Formats & Protocols</h4>
          <p>Different file formats use different endianness. Always check the specification!</p>
          
          <h4>3. Multi-Processor Systems</h4>
          <p>When different processors communicate, endianness mismatches can corrupt data!</p>
          
          <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 my-4">
            <p><strong>⚠️ Real Bug Story:</strong> A famous bug in early PowerPC Macs occurred when copying files from Intel systems - endianness mismatch corrupted the data!</p>
          </div>
        `
      },
      {
        title: "Quick Test Your Knowledge",
        content: `
          <h3>Let's Practice! 🧠</h3>
          
          <p>Given the 32-bit value <code>0xAABBCCDD</code> stored at memory address <code>0x2000</code>:</p>
          
          <div class="grid md:grid-cols-2 gap-4 my-6">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h4 class="font-bold">Big-Endian Storage:</h4>
              <ul class="mt-2 space-y-1">
                <li>0x2000: <strong>0xAA</strong></li>
                <li>0x2001: <strong>0xBB</strong></li>
                <li>0x2002: <strong>0xCC</strong></li>
                <li>0x2003: <strong>0xDD</strong></li>
              </ul>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg">
              <h4 class="font-bold">Little-Endian Storage:</h4>
              <ul class="mt-2 space-y-1">
                <li>0x2000: <strong>0xDD</strong></li>
                <li>0x2001: <strong>0xCC</strong></li>
                <li>0x2002: <strong>0xBB</strong></li>
                <li>0x2003: <strong>0xAA</strong></li>
              </ul>
            </div>
          </div>
          
          <div class="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
            <p><strong>🎯 Pro Tip:</strong> Use <code>union</code> in C to easily convert between different data interpretations while respecting your processor's endianness!</p>
          </div>
        `
      }
    ],
    slug: `understanding-endianness-${Date.now()}`
  };
};

export const createSampleLesson = (courseTitle: string, title: string): Lesson => {
  return {
    id: Date.now().toString(),
    title,
    course: courseTitle,
    estimatedTime: 15,
    difficulty: "Beginner",
    progress: 0,
    steps: [
      {
        title: "Introduction",
        content: `
          <h3>Welcome to ${title}! 🎯</h3>
          <p>This is the first step of your lesson. Here you can introduce the main concepts that will be covered.</p>
          
          <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 my-4">
            <p><strong>💡 Learning Objective:</strong> By the end of this lesson, you will understand the key concepts and be able to apply them in practice.</p>
          </div>
        `
      },
      {
        title: "Main Content",
        content: `
          <h3>Core Concepts 📚</h3>
          
          <p>This is where you'll cover the main content of your lesson. You can include:</p>
          
          <ul class="list-disc pl-6 my-4">
            <li>Key definitions and concepts</li>
            <li>Examples and demonstrations</li>
            <li>Code snippets and explanations</li>
            <li>Visual aids and diagrams</li>
          </ul>
          
          <div class="bg-gray-100 p-4 rounded-lg my-4">
            <h4>Example Code:</h4>
            <pre><code>// Your code example here
function example() {
  return "Hello, World!";
}</code></pre>
          </div>
        `
      },
      {
        title: "Practice Exercise",
        content: `
          <h3>Let's Practice! 🧠</h3>
          
          <p>Now it's time to apply what you've learned:</p>
          
          <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 my-4">
            <h4 class="font-bold">Exercise:</h4>
            <p>Try implementing the concepts we just covered. You can:</p>
            <ul class="list-disc pl-6 mt-2">
              <li>Write some code</li>
              <li>Solve a problem</li>
              <li>Answer some questions</li>
            </ul>
          </div>
        `
      }
    ],
    slug: `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
  };
}; 