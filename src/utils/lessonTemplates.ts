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

export const createEmbeddedSystemsBasicsCourse = () => {
  const now = Date.now();
  let seq = 0;
  const nextId = () => (now + (seq++)).toString();
  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
  const minutesFromText = (t: string) => {
    const m = /([0-9]+)\s*min/i.exec(t);
    return m ? parseInt(m[1], 10) : 15;
  };
  const toStep = (title: string, content: string) => ({ title, content: `<p>${content}</p>` });
  const makeLesson = (sectionTitle: string, l: { title: string; estimatedTime: string; difficulty: 'Beginner'|'Intermediate'|'Advanced'; progress: number; steps: { title: string; content: string }[]; }) => ({
    id: nextId(),
    title: l.title,
    course: 'Embedded Systems Basics',
    estimatedTime: minutesFromText(l.estimatedTime),
    difficulty: l.difficulty,
    progress: l.progress,
    steps: l.steps.map(s => toStep(s.title, s.content)),
    slug: slugify(l.title),
  });

  const sections = [
    {
      title: 'Getting Started with Digital I/O',
      slug: 'digital-io',
      lessons: [
        makeLesson('Getting Started with Digital I/O', {
          title: 'Blink LED',
          estimatedTime: '20 min',
          difficulty: 'Beginner',
          progress: 0,
          steps: [
            { title: 'Define', content: 'We want the microcontroller to blink an LED repeatedly.' },
            { title: 'Explore', content: 'Learn about GPIO pins, LED polarity, and resistors.' },
            { title: 'Prototype', content: 'Connect LED + resistor to a digital pin.' },
            { title: 'Test', content: 'Turn LED on/off with delays.' },
            { title: 'Iterate', content: 'Change blink speed.' },
            { title: 'Reflect', content: 'How does MCU control voltage on a pin?' },
            { title: 'Recap', content: 'Digital output control basics.' },
          ],
        }),
        makeLesson('Getting Started with Digital I/O', {
          title: 'Button Input',
          estimatedTime: '25 min',
          difficulty: 'Beginner',
          progress: 0,
          steps: [
            { title: 'Define', content: 'Turn an LED on/off with a button.' },
            { title: 'Explore', content: 'Buttons need pull-up or pull-down resistors.' },
            { title: 'Prototype', content: 'Connect button to input pin.' },
            { title: 'Test', content: 'Press → LED on, release → LED off.' },
            { title: 'Iterate', content: 'Add debounce logic.' },
            { title: 'Reflect', content: 'Why do buttons bounce?' },
            { title: 'Recap', content: 'Digital input handling.' },
          ],
        }),
        makeLesson('Getting Started with Digital I/O', {
          title: 'Multiple LEDs Sequence',
          estimatedTime: '30 min',
          difficulty: 'Beginner',
          progress: 0,
          steps: [
            { title: 'Define', content: 'Cycle multiple LEDs like chasing lights.' },
            { title: 'Explore', content: 'Loops and arrays simplify code.' },
            { title: 'Prototype', content: 'Wire 3–5 LEDs to pins.' },
            { title: 'Test', content: 'Run sequence with delay.' },
            { title: 'Iterate', content: 'Try reverse or faster sequence.' },
            { title: 'Reflect', content: 'Why use loops instead of writing each LED manually?' },
            { title: 'Recap', content: 'Efficient control with code.' },
          ],
        }),
      ],
    },
    {
      title: 'Working with Analog Signals',
      slug: 'analog-signals',
      lessons: [
        makeLesson('Working with Analog Signals', {
          title: 'Potentiometer Input',
          estimatedTime: '25 min',
          difficulty: 'Beginner',
          progress: 0,
          steps: [
            { title: 'Define', content: 'Read knob position with ADC.' },
            { title: 'Explore', content: 'Analog signals → ADC converts to numbers.' },
            { title: 'Prototype', content: 'Wire potentiometer to ADC pin.' },
            { title: 'Test', content: 'Print values 0–1023.' },
            { title: 'Iterate', content: 'Use value to adjust LED blink speed.' },
            { title: 'Reflect', content: 'Why use ADC vs digital?' },
            { title: 'Recap', content: 'Analog input basics.' },
          ],
        }),
        makeLesson('Working with Analog Signals', {
          title: 'PWM Output: LED Brightness',
          estimatedTime: '25 min',
          difficulty: 'Beginner',
          progress: 0,
          steps: [
            { title: 'Define', content: 'Fade LED brightness smoothly.' },
            { title: 'Explore', content: 'PWM controls duty cycle.' },
            { title: 'Prototype', content: 'Connect LED to PWM pin.' },
            { title: 'Test', content: 'LED fades in/out.' },
            { title: 'Iterate', content: 'Map potentiometer → brightness.' },
            { title: 'Reflect', content: 'PWM vs real analog voltage.' },
            { title: 'Recap', content: 'PWM lets us dim LEDs.' },
          ],
        }),
        makeLesson('Working with Analog Signals', {
          title: 'Buzzer Sound',
          estimatedTime: '20 min',
          difficulty: 'Beginner',
          progress: 0,
          steps: [
            { title: 'Define', content: 'Play sound with buzzer.' },
            { title: 'Explore', content: 'Frequency controls pitch.' },
            { title: 'Prototype', content: 'Wire piezo buzzer to pin.' },
            { title: 'Test', content: 'Play tone.' },
            { title: 'Iterate', content: 'Play melody.' },
            { title: 'Reflect', content: 'Active vs passive buzzer?' },
            { title: 'Recap', content: 'Sound output control.' },
          ],
        }),
      ],
    },
    {
      title: 'Interacting with the Environment',
      slug: 'sensors',
      lessons: [
        makeLesson('Interacting with the Environment', {
          title: 'Temperature Sensor',
          estimatedTime: '25 min',
          difficulty: 'Intermediate',
          progress: 0,
          steps: [
            { title: 'Define', content: 'Read temperature with sensor (LM35/DHT11).' },
            { title: 'Explore', content: 'Sensors convert physics → voltage/data.' },
            { title: 'Prototype', content: 'Wire sensor to ADC/digital interface.' },
            { title: 'Test', content: 'Print temperature on serial.' },
            { title: 'Iterate', content: 'LED on if temp > threshold.' },
            { title: 'Reflect', content: 'Mapping voltage to °C.' },
            { title: 'Recap', content: 'Sensing environment basics.' },
          ],
        }),
        makeLesson('Interacting with the Environment', {
          title: 'Light Sensor (LDR)',
          estimatedTime: '20 min',
          difficulty: 'Intermediate',
          progress: 0,
          steps: [
            { title: 'Define', content: 'Turn on LED in darkness.' },
            { title: 'Explore', content: 'LDR resistance changes with light.' },
            { title: 'Prototype', content: 'Resistor divider to ADC pin.' },
            { title: 'Test', content: 'Cover/uncover sensor → change values.' },
            { title: 'Iterate', content: 'Auto LED toggle.' },
            { title: 'Reflect', content: 'Threshold picking issues.' },
            { title: 'Recap', content: 'Reactive systems with sensors.' },
          ],
        }),
        makeLesson('Interacting with the Environment', {
          title: 'Ultrasonic Distance Sensor',
          estimatedTime: '30 min',
          difficulty: 'Intermediate',
          progress: 0,
          steps: [
            { title: 'Define', content: 'Measure distance with HC-SR04.' },
            { title: 'Explore', content: 'Ultrasound timing → distance.' },
            { title: 'Prototype', content: 'Wire TRIG/ECHO pins.' },
            { title: 'Test', content: 'Print distance on serial.' },
            { title: 'Iterate', content: 'Buzzer alarm if <20cm.' },
            { title: 'Reflect', content: 'Environment effects accuracy.' },
            { title: 'Recap', content: 'Distance sensing basics.' },
          ],
        }),
      ],
    },
    {
      title: 'Debugging and Communication',
      slug: 'communication',
      lessons: [
        makeLesson('Debugging and Communication', {
          title: 'UART Serial Debugging',
          estimatedTime: '25 min',
          difficulty: 'Intermediate',
          progress: 0,
          steps: [
            { title: 'Define', content: 'Send messages from MCU → PC.' },
            { title: 'Explore', content: 'UART, baud rate, TX/RX pins.' },
            { title: 'Prototype', content: 'Connect via USB/Serial.' },
            { title: 'Test', content: "Print 'Hello from MCU'." },
            { title: 'Iterate', content: 'Send sensor data.' },
            { title: 'Reflect', content: 'Why is logging important?' },
            { title: 'Recap', content: 'Communication foundation.' },
          ],
        }),
      ],
    },
  ].map(sec => ({
    id: nextId(),
    title: sec.title,
    slug: slugify(sec.slug || sec.title),
    lessons: sec.lessons,
    questions: [],
  }));

  return {
    id: nextId(),
    title: 'Embedded Systems Basics',
    slug: 'embedded-systems-basics',
    description: 'A hands-on introduction to embedded systems programming. Learn by building simple but powerful projects with microcontrollers.',
    category: 'Beginner' as const,
    estimatedCourseTime: 6,
    tags: ['embedded', 'microcontrollers', 'electronics', 'arduino'] as string[],
    sections,
  };
}; 