export interface DemoConfig {
  value: string;
  label: string;
  title: string;
  description: string;
}

export function generateDemoHtml(demoConfig: DemoConfig): string {
  const demoId = `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  switch (demoConfig.value) {
    case 'memory-viz':
      return generateMemoryVizDemo(demoId, demoConfig);
    case 'gpio-control':
      return generateGPIOControlDemo(demoId, demoConfig);
    case 'uart-comm':
      return generateUARTCommDemo(demoId, demoConfig);
    case 'define':
      return generateDefineStep(demoId, demoConfig);
    case 'explore':
      return generateExploreStep(demoId, demoConfig);
    case 'prototype':
      return generatePrototypeStep(demoId, demoConfig);
    case 'test':
      return generateTestStep(demoId, demoConfig);
    case 'iterate':
      return generateIterateStep(demoId, demoConfig);
    case 'reflect':
      return generateReflectStep(demoId, demoConfig);
    case 'recap':
      return generateRecapStep(demoId, demoConfig);
    default:
      return generateDefaultDemo(demoId, demoConfig);
  }
}

function generateMemoryVizDemo(demoId: string, demoConfig: DemoConfig): string {
  return `
<div class="rounded-xl border border-[var(--gray)] bg-[var(--white)] text-[var(--primary)] shadow-sm mb-6 border-blue-200 bg-blue-50" id="${demoId}">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2 text-blue-900">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cpu w-5 h-5" aria-hidden="true">
        <path d="M12 20v2"></path><path d="M12 2v2"></path><path d="M17 20v2"></path><path d="M17 2v2"></path><path d="M2 12h2"></path><path d="M2 17h2"></path><path d="M2 7h2"></path><path d="M20 12h2"></path><path d="M20 17h2"></path><path d="M20 7h2"></path><path d="M7 20v2"></path><path d="M7 2v2"></path><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="8" y="8" width="8" height="8" rx="1"></rect>
      </svg>
      ${demoConfig.title}
    </h3>
  </div>
  <div class="p-6 pt-4">
    <div class="bg-white p-4 rounded-lg">
      <h4 class="font-semibold mb-3">${demoConfig.title}</h4>
      
      <!-- Input Section -->
      <div class="mb-4 p-3 bg-gray-50 rounded-lg">
        <label class="block text-sm font-medium text-gray-700 mb-2">Enter a 32-bit value (hex):</label>
        <div class="flex gap-2">
          <input type="text" id="${demoId}-hex-input" value="0x12345678" class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0x12345678">
          <button onclick="updateMemory('${demoId}')" class="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">Update</button>
          <button onclick="randomValue('${demoId}')" class="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors">Random</button>
        </div>
      </div>

      <!-- Memory Grid -->
      <div class="grid grid-cols-4 gap-2 mb-4">
        <div class="text-center">
          <div class="text-xs text-slate-600 mb-1">0x1000</div>
          <div class="bg-green-100 border-2 border-green-300 rounded p-2 font-mono memory-cell" data-index="0" onclick="editMemoryCell(this, '${demoId}')">0x78</div>
        </div>
        <div class="text-center">
          <div class="text-xs text-slate-600 mb-1">0x1001</div>
          <div class="bg-green-100 border-2 border-green-300 rounded p-2 font-mono memory-cell" data-index="1" onclick="editMemoryCell(this, '${demoId}')">0x56</div>
        </div>
        <div class="text-center">
          <div class="text-xs text-slate-600 mb-1">0x1002</div>
          <div class="bg-green-100 border-2 border-green-300 rounded p-2 font-mono memory-cell" data-index="2" onclick="editMemoryCell(this, '${demoId}')">0x34</div>
        </div>
        <div class="text-center">
          <div class="text-xs text-slate-600 mb-1">0x1003</div>
          <div class="bg-green-100 border-2 border-green-300 rounded p-2 font-mono memory-cell" data-index="3" onclick="editMemoryCell(this, '${demoId}')">0x12</div>
        </div>
      </div>

      <!-- Results -->
      <div class="space-y-2 text-sm">
        <p class="text-slate-600">
          <strong>Little-Endian view:</strong> <span id="${demoId}-little-endian">0x12345678</span> stored in memory
        </p>
        <p class="text-slate-600">
          <strong>Big-Endian view:</strong> <span id="${demoId}-big-endian">0x78563412</span> would be stored as
        </p>
        <p class="text-slate-600">
          <strong>Decimal value:</strong> <span id="${demoId}-decimal-value">305419896</span>
        </p>
      </div>

      <!-- Endianness Toggle -->
      <div class="mt-4 p-3 bg-blue-50 rounded-lg">
        <label class="flex items-center gap-2 text-sm font-medium text-blue-900">
          <input type="checkbox" id="${demoId}-endian-toggle" onchange="toggleEndianness('${demoId}')" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
          Show Big-Endian representation
        </label>
      </div>
    </div>
  </div>
</div>

<script>
// Initialize the demo when the page loads
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    if (document.getElementById('${demoId}')) {
      updateMemory('${demoId}');
    }
  }, 100);
});

function updateMemory(demoId) {
  const input = document.getElementById(demoId + '-hex-input');
  const value = input.value.trim();
  
  if (!/^0x[0-9A-Fa-f]{8}$/.test(value)) {
    alert('Please enter a valid 8-character hex value (e.g., 0x12345678)');
    return;
  }
  
  const hex = value.substring(2);
  const bytes = [];
  for (let i = 0; i < 8; i += 2) {
    bytes.push('0x' + hex.substring(6 - i, 8 - i));
  }
  
  const cells = document.querySelectorAll('#' + demoId + ' .memory-cell');
  cells.forEach((cell, index) => {
    cell.textContent = bytes[index];
  });
  
  updateResults(demoId, value);
}

function editMemoryCell(cell, demoId) {
  const currentValue = cell.textContent;
  const newValue = prompt('Enter new byte value (hex):', currentValue);
  if (newValue && /^0x[0-9A-Fa-f]{2}$/.test(newValue)) {
    cell.textContent = newValue;
    updateFromCells(demoId);
  }
}

function updateFromCells(demoId) {
  const cells = document.querySelectorAll('#' + demoId + ' .memory-cell');
  const bytes = Array.from(cells).map(cell => cell.textContent.substring(2));
  const littleEndian = '0x' + bytes.join('');
  
  document.getElementById(demoId + '-hex-input').value = littleEndian;
  updateResults(demoId, littleEndian);
}

function updateResults(demoId, hexValue) {
  const hex = hexValue.substring(2);
  const littleEndian = hexValue;
  const bigEndian = '0x' + hex.split('').reverse().join('');
  const decimal = parseInt(hex, 16);
  
  document.getElementById(demoId + '-little-endian').textContent = littleEndian;
  document.getElementById(demoId + '-big-endian').textContent = bigEndian;
  document.getElementById(demoId + '-decimal-value').textContent = decimal.toLocaleString();
}

function randomValue(demoId) {
  const randomHex = '0x' + Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0');
  document.getElementById(demoId + '-hex-input').value = randomHex;
  updateMemory(demoId);
}

function toggleEndianness(demoId) {
  const toggle = document.getElementById(demoId + '-endian-toggle');
  const cells = document.querySelectorAll('#' + demoId + ' .memory-cell');
  const currentBytes = Array.from(cells).map(cell => cell.textContent);
  
  if (toggle.checked) {
    cells.forEach((cell, index) => {
      cell.textContent = currentBytes[3 - index];
    });
  } else {
    cells.forEach((cell, index) => {
      cell.textContent = currentBytes[3 - index];
    });
  }
}
</script>`;
}

function generateGPIOControlDemo(demoId: string, demoConfig: DemoConfig): string {
  return `
<div class="rounded-xl border border-[var(--gray)] bg-[var(--white)] text-[var(--primary)] shadow-sm mb-6 border-green-200 bg-green-50" id="${demoId}">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2 text-green-900">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap w-5 h-5" aria-hidden="true">
        <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"></polygon>
      </svg>
      ${demoConfig.title}
    </h3>
  </div>
  <div class="p-6 pt-4">
    <div class="bg-white p-4 rounded-lg">
      <h4 class="font-semibold mb-3">GPIO Pin Control</h4>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h5 class="font-medium mb-2">Pin Configuration</h5>
          <div class="space-y-2">
            <label class="flex items-center gap-2">
              <input type="radio" name="${demoId}-mode" value="output" checked onchange="updateGPIOMode('${demoId}')" class="text-green-600">
              <span class="text-sm">Output Mode</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" name="${demoId}-mode" value="input" onchange="updateGPIOMode('${demoId}')" class="text-green-600">
              <span class="text-sm">Input Mode</span>
            </label>
          </div>
        </div>
        
        <div>
          <h5 class="font-medium mb-2">Pin State</h5>
          <div class="space-y-2">
            <button onclick="toggleGPIO('${demoId}')" id="${demoId}-gpio-btn" class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              HIGH (3.3V)
            </button>
            <div class="text-xs text-gray-600">
              Current: <span id="${demoId}-current-state">HIGH</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-4 p-3 bg-gray-50 rounded-lg">
        <h5 class="font-medium mb-2">GPIO Register</h5>
        <div class="font-mono text-sm bg-gray-900 text-green-400 p-3 rounded">
          <div>GPIO_DIR: <span id="${demoId}-dir-reg">0x00000001</span></div>
          <div>GPIO_DATA: <span id="${demoId}-data-reg">0x00000001</span></div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
let gpioState = true;
let gpioMode = 'output';

function updateGPIOMode(demoId) {
  const modeInputs = document.querySelectorAll('input[name="' + demoId + '-mode"]:checked');
  gpioMode = modeInputs[0]?.value || 'output';
  
  const btn = document.getElementById(demoId + '-gpio-btn');
  if (gpioMode === 'input') {
    btn.textContent = 'READ INPUT';
    btn.className = 'w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors';
  } else {
    btn.textContent = gpioState ? 'HIGH (3.3V)' : 'LOW (0V)';
    btn.className = 'w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors';
  }
  
  updateGPIORegisters(demoId);
}

function toggleGPIO(demoId) {
  if (gpioMode === 'input') {
    // Simulate reading input
    const randomValue = Math.random() > 0.5;
    document.getElementById(demoId + '-current-state').textContent = randomValue ? 'HIGH' : 'LOW';
  } else {
    gpioState = !gpioState;
    const btn = document.getElementById(demoId + '-gpio-btn');
    btn.textContent = gpioState ? 'HIGH (3.3V)' : 'LOW (0V)';
    document.getElementById(demoId + '-current-state').textContent = gpioState ? 'HIGH' : 'LOW';
  }
  
  updateGPIORegisters(demoId);
}

function updateGPIORegisters(demoId) {
  const dirReg = gpioMode === 'output' ? '0x00000001' : '0x00000000';
  const dataReg = gpioState ? '0x00000001' : '0x00000000';
  
  document.getElementById(demoId + '-dir-reg').textContent = dirReg;
  document.getElementById(demoId + '-data-reg').textContent = dataReg;
}
</script>`;
}

function generateUARTCommDemo(demoId: string, demoConfig: DemoConfig): string {
  return `
<div class="rounded-xl border border-[var(--gray)] bg-[var(--white)] text-[var(--primary)] shadow-sm mb-6 border-purple-200 bg-purple-50" id="${demoId}">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2 text-purple-900">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle w-5 h-5" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      ${demoConfig.title}
    </h3>
  </div>
  <div class="p-6 pt-4">
    <div class="bg-white p-4 rounded-lg">
      <h4 class="font-semibold mb-3">UART Communication</h4>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h5 class="font-medium mb-2">Transmitter</h5>
          <div class="space-y-2">
            <input type="text" id="${demoId}-tx-data" placeholder="Enter message..." class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
            <button onclick="sendUART('${demoId}')" class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm">
              Send
            </button>
          </div>
        </div>
        
        <div>
          <h5 class="font-medium mb-2">Receiver</h5>
          <div class="h-20 p-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono overflow-y-auto" id="${demoId}-rx-display">
            Waiting for data...
          </div>
        </div>
      </div>
      
      <div class="mt-4 p-3 bg-gray-50 rounded-lg">
        <h5 class="font-medium mb-2">UART Configuration</h5>
        <div class="grid grid-cols-3 gap-4 text-sm">
          <div>
            <label class="block text-gray-600">Baud Rate</label>
            <select id="${demoId}-baud" onchange="updateUARTConfig('${demoId}')" class="w-full px-2 py-1 border border-gray-300 rounded">
              <option value="9600">9600</option>
              <option value="19200">19200</option>
              <option value="38400">38400</option>
              <option value="57600">57600</option>
              <option value="115200" selected>115200</option>
            </select>
          </div>
          <div>
            <label class="block text-gray-600">Data Bits</label>
            <select id="${demoId}-databits" onchange="updateUARTConfig('${demoId}')" class="w-full px-2 py-1 border border-gray-300 rounded">
              <option value="7">7</option>
              <option value="8" selected>8</option>
            </select>
          </div>
          <div>
            <label class="block text-gray-600">Parity</label>
            <select id="${demoId}-parity" onchange="updateUARTConfig('${demoId}')" class="w-full px-2 py-1 border border-gray-300 rounded">
              <option value="none" selected>None</option>
              <option value="even">Even</option>
              <option value="odd">Odd</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
let uartConfig = {
  baudRate: 115200,
  dataBits: 8,
  parity: 'none'
};

function sendUART(demoId) {
  const data = document.getElementById(demoId + '-tx-data').value;
  if (!data) return;
  
  const display = document.getElementById(demoId + '-rx-display');
  const timestamp = new Date().toLocaleTimeString();
  display.innerHTML += \`<div class="text-green-600">[\${timestamp}] Received: "\${data}"</div>\`;
  display.scrollTop = display.scrollHeight;
  
  document.getElementById(demoId + '-tx-data').value = '';
}

function updateUARTConfig(demoId) {
  uartConfig.baudRate = parseInt(document.getElementById(demoId + '-baud').value);
  uartConfig.dataBits = parseInt(document.getElementById(demoId + '-databits').value);
  uartConfig.parity = document.getElementById(demoId + '-parity').value;
}
</script>`;
}

function generateDefineStep(demoId: string, demoConfig: DemoConfig): string {
  return `
<div class="rounded-xl border border-[var(--gray)] bg-[var(--white)] text-[var(--primary)] shadow-sm mb-6 border-orange-200 bg-orange-50" id="${demoId}">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2 text-orange-900">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-target w-5 h-5" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>
      </svg>
      ${demoConfig.title}
    </h3>
  </div>
  <div class="p-6 pt-4">
    <div class="bg-white p-4 rounded-lg">
      <h4 class="font-semibold mb-3">🎯 Learning Objective</h4>
      <p class="text-gray-700 mb-4">${demoConfig.description}</p>
      
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

function generateExploreStep(demoId: string, demoConfig: DemoConfig): string {
  return `
<div class="rounded-xl border border-[var(--gray)] bg-[var(--white)] text-[var(--primary)] shadow-sm mb-6 border-blue-200 bg-blue-50" id="${demoId}">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2 text-blue-900">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search w-5 h-5" aria-hidden="true">
        <circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path>
      </svg>
      ${demoConfig.title}
    </h3>
  </div>
  <div class="p-6 pt-4">
    <div class="bg-white p-4 rounded-lg">
      <h4 class="font-semibold mb-3">🔍 Knowledge Discovery</h4>
      <p class="text-gray-700 mb-4">${demoConfig.description}</p>
      
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

function generatePrototypeStep(demoId: string, demoConfig: DemoConfig): string {
  return `
<div class="rounded-xl border border-[var(--gray)] bg-[var(--white)] text-[var(--primary)] shadow-sm mb-6 border-green-200 bg-green-50" id="${demoId}">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2 text-green-900">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wrench w-5 h-5" aria-hidden="true">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
      </svg>
      ${demoConfig.title}
    </h3>
  </div>
  <div class="p-6 pt-4">
    <div class="bg-white p-4 rounded-lg">
      <h4 class="font-semibold mb-3">🛠️ Hands-On Building</h4>
      <p class="text-gray-700 mb-4">${demoConfig.description}</p>
      
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

function generateTestStep(demoId: string, demoConfig: DemoConfig): string {
  return `
<div class="rounded-xl border border-[var(--gray)] bg-[var(--white)] text-[var(--primary)] shadow-sm mb-6 border-purple-200 bg-purple-50" id="${demoId}">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2 text-purple-900">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play-circle w-5 h-5" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle><polygon points="10,8 16,12 10,16 10,8"></polygon>
      </svg>
      ${demoConfig.title}
    </h3>
  </div>
  <div class="p-6 pt-4">
    <div class="bg-white p-4 rounded-lg">
      <h4 class="font-semibold mb-3">🧪 Testing & Validation</h4>
      <p class="text-gray-700 mb-4">${demoConfig.description}</p>
      
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

function generateIterateStep(demoId: string, demoConfig: DemoConfig): string {
  return `
<div class="rounded-xl border border-[var(--gray)] bg-[var(--white)] text-[var(--primary)] shadow-sm mb-6 border-indigo-200 bg-indigo-50" id="${demoId}">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2 text-indigo-900">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw w-5 h-5" aria-hidden="true">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M3 21v-5h5"></path>
      </svg>
      ${demoConfig.title}
    </h3>
  </div>
  <div class="p-6 pt-4">
    <div class="bg-white p-4 rounded-lg">
      <h4 class="font-semibold mb-3">🔄 Experiment & Improve</h4>
      <p class="text-gray-700 mb-4">${demoConfig.description}</p>
      
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

function generateReflectStep(demoId: string, demoConfig: DemoConfig): string {
  return `
<div class="rounded-xl border border-[var(--gray)] bg-[var(--white)] text-[var(--primary)] shadow-sm mb-6 border-teal-200 bg-teal-50" id="${demoId}">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2 text-teal-900">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain w-5 h-5" aria-hidden="true">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1 .34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0-.34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
      </svg>
      ${demoConfig.title}
    </h3>
  </div>
  <div class="p-6 pt-4">
    <div class="bg-white p-4 rounded-lg">
      <h4 class="font-semibold mb-3">🤔 Deep Thinking</h4>
      <p class="text-gray-700 mb-4">${demoConfig.description}</p>
      
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

function generateRecapStep(demoId: string, demoConfig: DemoConfig): string {
  return `
<div class="rounded-xl border border-[var(--gray)] bg-[var(--white)] text-[var(--primary)] shadow-sm mb-6 border-emerald-200 bg-emerald-50" id="${demoId}">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2 text-emerald-900">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle w-5 h-5" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline>
      </svg>
      ${demoConfig.title}
    </h3>
  </div>
  <div class="p-6 pt-4">
    <div class="bg-white p-4 rounded-lg">
      <h4 class="font-semibold mb-3">📝 Summary & Key Takeaways</h4>
      <p class="text-gray-700 mb-4">${demoConfig.description}</p>
      
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

function generateDefaultDemo(demoId: string, demoConfig: DemoConfig): string {
  return `
<div class="rounded-xl border border-[var(--gray)] bg-[var(--white)] text-[var(--primary)] shadow-sm mb-6 border-blue-200 bg-blue-50" id="${demoId}">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-lg font-semibold leading-none tracking-tight text-[var(--primary)] flex items-center gap-2 text-blue-900">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cpu w-5 h-5" aria-hidden="true">
        <path d="M12 20v2"></path><path d="M12 2v2"></path><path d="M17 20v2"></path><path d="M17 2v2"></path><path d="M2 12h2"></path><path d="M2 17h2"></path><path d="M2 7h2"></path><path d="M20 12h2"></path><path d="M20 17h2"></path><path d="M20 7h2"></path><path d="M7 20v2"></path><path d="M7 2v2"></path><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="8" y="8" width="8" height="8" rx="1"></rect>
      </svg>
      ${demoConfig.title}
    </h3>
  </div>
  <div class="p-6 pt-4">
    <div class="bg-white p-4 rounded-lg">
      <h4 class="font-semibold mb-3">${demoConfig.title}</h4>
      <p class="text-gray-600">${demoConfig.description}</p>
      <p class="text-sm text-gray-500 mt-2">Demo implementation coming soon...</p>
    </div>
  </div>
</div>`;
} 