import { Project } from '../types';

export const DEFAULT_PROJECTS: Project[] = [
  // =========================================================================
  // ECE / EMBEDDED & VLSI PROJECTS
  // =========================================================================
  {
    id: 'proj-ece-y1-01',
    title: 'Smart LED Pattern Automation & Traffic Light Controller',
    problemStatement: 'Manual traffic control causes delays and confusion. Learn digital output switching, delay loops, and state sequences using an Arduino Uno.',
    description: 'A beginner micro-controller project implementing realistic 4-way traffic signaling with pedestrian walk override buttons and LED sequencing.',
    branch: 'ECE',
    careerGoal: 'Embedded Systems and IoT',
    recommendedYear: '1st',
    difficulty: 'Beginner',
    technologies: ['Arduino Uno', 'C/C++', 'Breadboard', 'LEDs', 'Pushbuttons', 'Resistors'],
    skillsGained: ['GPIO Configuration', 'State Sequencing', 'Hardware Breadboarding', 'Arduino IDE'],
    estimatedHours: 12,
    implementationSteps: [
      'Assemble 12 LEDs (Red, Yellow, Green for 4 lanes) on a breadboard with current-limiting resistors.',
      'Connect control pins to Arduino digital I/O lines (pins 2 through 13).',
      'Code a timed state machine with proper amber transition intervals in C++.',
      'Add an external interrupt on digital pin 2 for a pedestrian walk push button.',
      'Test debouncing with software delay or hardware capacitor.'
    ],
    expectedOutput: 'A functioning 4-phase traffic cycle that switches smoothly and responds immediately to pedestrian crosswalk requests.',
    testingSuggestions: [
      'Verify LED current draw using a multimeter to ensure safety.',
      'Test push button response during each phase to confirm interrupt priority.',
      'Stress test the loop over 1 hour to detect memory leaks or timing drift.'
    ],
    resourceUrl: 'https://docs.arduino.cc/built-in-examples/digital/BlinkWithoutDelay',
    githubSearchQuery: 'arduino traffic light controller',
  },
  {
    id: 'proj-ece-y1-02',
    title: 'Basic Multi-Sensor Environmental Monitor (DHT11 & LDR)',
    problemStatement: 'Classrooms and dorms lack real-time visibility into temperature, humidity, and ambient brightness.',
    description: 'Interface DHT11 digital humidity/temperature sensor and analog Light Dependent Resistor (LDR) with a 16x2 I2C LCD screen.',
    branch: 'ECE',
    careerGoal: 'Embedded Systems and IoT',
    recommendedYear: '1st',
    difficulty: 'Beginner',
    technologies: ['Arduino Nano', 'DHT11 Sensor', 'LDR', '16x2 I2C LCD', 'C++'],
    skillsGained: ['ADC Analog Reading', 'I2C Bus Addressing', 'Sensor Calibration', 'LiquidCrystal Library'],
    estimatedHours: 16,
    implementationSteps: [
      'Wire the I2C LCD (SDA to A4, SCL to A5) on Arduino.',
      'Connect DHT11 signal pin to digital pin 4 and LDR voltage divider to analog pin A0.',
      'Write modular code reading temperature every 2 seconds.',
      'Format output strings clearly on the two LCD display rows.',
      'Add visual alert when temperature exceeds 35°C.'
    ],
    expectedOutput: 'Real-time readings of Temperature (°C), Humidity (%), and Light Level (%) updating continuously on LCD display.',
    testingSuggestions: [
      'Compare temperature reading against a standard digital thermometer.',
      'Expose LDR to flashlight and shadow to verify analog range (0-1023).',
      'Validate I2C scanner script to ensure device address is 0x27 or 0x3F.'
    ],
    resourceUrl: 'https://learn.adafruit.com/dht',
    githubSearchQuery: 'arduino dht11 lcd environmental monitor',
  },
  {
    id: 'proj-ece-y2-01',
    title: 'ESP32 Smart Home IoT Gateway with MQTT & Web Dashboard',
    problemStatement: 'Traditional home appliances lack wireless remote control and energy telemetry.',
    description: 'Build a dual-core ESP32 IoT node that hosts an internal asynchronous web server, connects to Wi-Fi, and streams relay states over MQTT.',
    branch: 'ECE',
    careerGoal: 'Embedded Systems and IoT',
    recommendedYear: '2nd',
    difficulty: 'Intermediate',
    technologies: ['ESP32', 'FreeRTOS Tasks', 'MQTT Protocol', 'ESPAsyncWebServer', 'Optocoupled Relays', 'HTML/JS'],
    skillsGained: ['Dual-Core Task Pinning', 'MQTT Broker Integration', 'AC Appliance Safety Isolation', 'Wi-Fi Reconnect Handling'],
    estimatedHours: 35,
    implementationSteps: [
      'Set up ESP32 toolchain and verify Wi-Fi station connectivity.',
      'Wire 4-channel 5V relay module with optocoupler isolation to ESP32 GPIOs.',
      'Implement an asynchronous web page stored in LittleFS with responsive toggle buttons.',
      'Publish status payloads via Mosquitto MQTT broker for remote smartphone sync.',
      'Store relay states in non-volatile flash (Preferences API) to persist across reboots.'
    ],
    expectedOutput: 'A web dashboard and MQTT topic feed that toggles physical relays with sub-100ms latency and survives power loss.',
    testingSuggestions: [
      'Simulate Wi-Fi dropouts by turning off the router and verifying automatic reconnection logic.',
      'Measure 3.3V supply rail voltage under active Wi-Fi transmission bursts.',
      'Verify electrical isolation between 230V mains contacts and micro-controller ground.'
    ],
    resourceUrl: 'https://randomnerdtutorials.com/esp32-web-server-spiffs-spiffs-flash-file-system/',
    githubSearchQuery: 'esp32 mqtt home automation relay web server',
  },
  {
    id: 'proj-ece-y2-02',
    title: 'Ultrasonic Distance Meter with OLED & Buzzer Proximity Alarm',
    problemStatement: 'Blind spot detection and obstacle proximity measurement in compact mobile robots.',
    description: 'Interface HC-SR04 ultrasonic sensor with an SSD1306 0.96" OLED display and piezo buzzer with dynamic frequency pitch based on obstacle distance.',
    branch: 'ECE',
    careerGoal: 'Embedded Systems and IoT',
    recommendedYear: '2nd',
    difficulty: 'Intermediate',
    technologies: ['Arduino/STM32', 'HC-SR04 Sensor', 'SSD1306 OLED (I2C)', 'Piezo Buzzer', 'C++'],
    skillsGained: ['Pulse Timing Calculation', 'OLED Graphics Buffer', 'Dynamic Sound Modulation', 'Interrupts'],
    estimatedHours: 20,
    implementationSteps: [
      'Trigger 10 microsecond pulse on HC-SR04 trigger pin.',
      'Measure pulse width on echo pin using hardware timer input capture.',
      'Calculate distance in centimeters using speed of sound in air (343 m/s).',
      'Draw real-time distance gauge and graphic bars on OLED screen.',
      'Modulate buzzer frequency from 200Hz (far) to 2.5kHz continuous tone (<10cm).'
    ],
    expectedOutput: 'OLED graphical distance meter with millisecond response time and reverse-parking style acoustic alert.',
    testingSuggestions: [
      'Test accuracy against a ruler at 10cm, 50cm, 100cm, and 200cm intervals.',
      'Check reflection angles on soft fabrics vs hard flat surfaces.',
      'Profile execution time to avoid blocking delays in the main loop.'
    ],
    resourceUrl: 'https://learn.sparkfun.com/tutorials/distance-sensor-hookup-guide',
    githubSearchQuery: 'hc-sr04 oled distance meter buzzer',
  },
  {
    id: 'proj-ece-y2-03',
    title: '32-Bit ALU & Register File in Verilog with Testbench',
    problemStatement: 'Understanding fundamental processor datapath computation requires hardware description modeling and timing simulation.',
    description: 'Design and simulate a parameterized 32-bit Arithmetic Logic Unit (ALU) supporting 16 operations (Add, Sub, AND, OR, XOR, SLL, SRL, SLT) with a 32-entry dual-read register file in Verilog.',
    branch: 'ECE',
    careerGoal: 'VLSI and Semiconductor Design',
    recommendedYear: '2nd',
    difficulty: 'Intermediate',
    technologies: ['Verilog HDL', 'ModelSim', 'Icarus Verilog', 'GTKWave', 'Digital Design'],
    skillsGained: ['Synthesizable RTL Coding', 'Corner-Case Testbench Construction', 'Propagation Delay Analysis', 'Waveform Debugging'],
    estimatedHours: 35,
    implementationSteps: [
      'Define modular Verilog interface for opcode, operands, zero flag, overflow flag, and carry flag.',
      'Write behavioral and structural models for 16 arithmetic/logical operations.',
      'Implement 32x32-bit register file with asynchronous read and synchronous clock write.',
      'Write exhaustive self-checking testbench asserting randomized vectors.',
      'View signals and verify zero/overflow flags in GTKWave waveform viewer.'
    ],
    expectedOutput: 'Zero-warning synthesizable Verilog code with automated pass/fail testbench reporting 100% assertion coverage.',
    testingSuggestions: [
      'Test signed arithmetic edge cases: 0x7FFFFFFF + 1 (overflow) and 0x80000000 - 1 (underflow).',
      'Validate write-then-read within same cycle behavior on register file.',
      'Check for unintended latches in conditional statements.'
    ],
    resourceUrl: 'https://hdlbits.01xz.net/',
    githubSearchQuery: 'verilog 32 bit alu register file testbench',
  },
  {
    id: 'proj-ece-y3-01',
    title: 'FreeRTOS-Based Industrial Wireless Sensor Node (STM32 / ESP32)',
    problemStatement: 'Industrial machine vibration and temperature monitoring requires deterministic task scheduling and low-power sleep cycles.',
    description: 'Develop a deterministic multithreaded sensor telemetry node using FreeRTOS with separate tasks for sampling, filtering, encryption, and radio transmission.',
    branch: 'ECE',
    careerGoal: 'Embedded Systems and IoT',
    recommendedYear: '3rd',
    difficulty: 'Advanced',
    technologies: ['STM32 / ESP32', 'FreeRTOS', 'SPI Flash', 'MPU6050 Accelerometer', 'I2C', 'AES-128'],
    skillsGained: ['Preemptive Task Scheduling', 'Semaphores & Mutex Locks', 'Queue Data Passing', 'Watchdog Timers', 'Power Optimization'],
    estimatedHours: 55,
    implementationSteps: [
      'Configure FreeRTOS with priority levels for Sensor Acquisition, Data Filter, and Comms.',
      'Create mutex-guarded I2C driver for MPU6050 vibration sensor.',
      'Pass sensor frames through FreeRTOS Queues without race conditions.',
      'Implement deep sleep state waking every 30 seconds via RTC timer.',
      'Measure power consumption using an inline ammeter shunt.'
    ],
    expectedOutput: 'A robust RTOS node capable of continuous vibration analysis that never deadlocks and consumes under 15uA during sleep.',
    testingSuggestions: [
      'Force queue full condition to verify graceful buffer overflow handling.',
      'Trigger watchdog reset intentionally to ensure automatic system recovery.',
      'Analyze task stack high-water mark with uxTaskGetStackHighWaterMark().'
    ],
    resourceUrl: 'https://www.freertos.org/Documentation/RTOS_book.html',
    githubSearchQuery: 'freertos sensor node stm32 esp32 queue mutex',
  },
  {
    id: 'proj-ece-y3-02',
    title: 'Custom Two-Layer Power & Sensor PCB Design in KiCad',
    problemStatement: 'Breadboard circuits suffer from parasitic noise, loose wires, and cannot be deployed in harsh real-world environments.',
    description: 'Design, simulate, and lay out an industrial-grade 2-layer PCB containing a 5V/3.3V switching regulator, microcontroller, and sensor headers in KiCad.',
    branch: 'ECE',
    careerGoal: 'Embedded Systems and IoT',
    recommendedYear: '3rd',
    difficulty: 'Advanced',
    technologies: ['KiCad 8', 'Schematic Capture', 'PCB Layout', 'Design Rule Check (DRC)', 'Gerber Generation'],
    skillsGained: ['Ground Plane Optimization', 'Decoupling Capacitor Placement', 'Thermal Relief Pads', 'BOM Generation', 'DFM Rules'],
    estimatedHours: 40,
    implementationSteps: [
      'Create complete schematic with power stage, decoupling caps, and ESD protection diodes.',
      'Select footprints adhering to IPC standards from manufacturer datasheets.',
      'Route power rails with thick 30mil+ traces and 50-ohm impedance matching where needed.',
      'Pour copper ground plane on bottom layer and stitch vias to reduce ground loop inductance.',
      'Run DRC, generate 3D PCB render, BOM spreadsheet, and Gerber ZIP for fabrication.'
    ],
    expectedOutput: 'Production-ready Gerber files verified with zero DRC violations, ready for JLCPCB / PCBWay manufacturing.',
    testingSuggestions: [
      'Review track widths against IPC-2152 current capacity charts.',
      'Verify pin 1 orientation markings for all IC footprints.',
      'Inspect 3D viewer model to check component clearance and connector orientation.'
    ],
    resourceUrl: 'https://www.kicad.org/learn/',
    githubSearchQuery: 'kicad sensor board pcb design gerber',
  },
  {
    id: 'proj-ece-y3-03',
    title: '5-Stage Pipelined RISC-V (RV32I) Processor Core in Verilog',
    problemStatement: 'Modern microprocessors achieve high instruction throughput using pipelining, resolving data hazards and branch penalties.',
    description: 'Implement a 5-stage pipelined RV32I processor core (Fetch, Decode, Execute, Memory, Writeback) with hazard forwarding and branch prediction.',
    branch: 'ECE',
    careerGoal: 'VLSI and Semiconductor Design',
    recommendedYear: '3rd',
    difficulty: 'Advanced',
    technologies: ['SystemVerilog / Verilog', 'Xilinx Vivado', 'RISC-V Toolchain', 'GTKWave', 'Static Timing Analysis'],
    skillsGained: ['Pipelining Microarchitecture', 'Forwarding Unit Design', 'Hazard Detection Unit', 'Static Timing Analysis', 'FPGA Synthesis'],
    estimatedHours: 75,
    implementationSteps: [
      'Define pipeline registers (IF/ID, ID/EX, EX/MEM, MEM/WB).',
      'Implement instruction decoder for R, I, S, B, U, J format RV32I instructions.',
      'Design forwarding logic to bypass results directly from EX/MEM and MEM/WB to ID/EX.',
      'Add stall unit to handle load-use data dependencies.',
      'Compile test C programs using riscv32-unknown-elf-gcc and execute binary on Vivado simulator.'
    ],
    expectedOutput: 'Working RV32I core executing fibonacci and sorting benchmarks with correct register state and zero pipeline hazards.',
    testingSuggestions: [
      'Run standard RISC-V architectural compliance test suite.',
      'Synthesize on Artix-7 FPGA in Vivado and verify maximum operating frequency (Fmax).',
      'Validate pipeline stall cycles against theoretical CPI expectations.'
    ],
    resourceUrl: 'https://riscv.org/technical/specifications/',
    githubSearchQuery: '5 stage pipelined risc v rv32i verilog vivado',
  },
  {
    id: 'proj-ece-y4-01',
    title: 'Edge-AI TinyML Vision Sensor for Industrial Defect Detection',
    problemStatement: 'Cloud vision analytics introduces high latency and requires high bandwidth. Running inference directly on microcontrollers enables real-time decisions.',
    description: 'Train a quantized MobileNet / CNN model and deploy it on an ESP32-CAM or Raspberry Pi Pico to detect manufacturing defects in real time.',
    branch: 'ECE',
    careerGoal: 'Embedded Systems and IoT',
    recommendedYear: '4th',
    difficulty: 'Advanced',
    technologies: ['ESP32-CAM', 'TensorFlow Lite for Microcontrollers (TFLite)', 'TinyML', 'Edge Impulse', 'C++'],
    skillsGained: ['INT8 Neural Network Quantization', 'Camera Framebuffer DMA', 'Embedded Inference Optimization', 'Edge AI Deployment'],
    estimatedHours: 80,
    implementationSteps: [
      'Collect and annotate 500+ industrial product surface defect images.',
      'Train lightweight Convolutional Neural Network on Google Colab / Edge Impulse.',
      'Quantize weights to 8-bit integer (INT8) to fit within 512KB SRAM limits.',
      'Deploy C++ model tensor arena on ESP32-CAM using TFLite Micro runtime.',
      'Trigger audio/relay output within 150ms when a defective item is identified.'
    ],
    expectedOutput: 'An autonomous camera node running 8-12 FPS real-time defect classification at >92% test accuracy completely offline.',
    testingSuggestions: [
      'Measure inference latency per frame using micros() timing counters.',
      'Evaluate false-positive and false-negative rates across changing lighting conditions.',
      'Verify thermal stability of the ESP32 chip during continuous 2-hour vision inference.'
    ],
    resourceUrl: 'https://www.tensorflow.org/lite/microcontrollers',
    githubSearchQuery: 'tinyml esp32 cam defect detection tflite micro',
  },
  {
    id: 'proj-ece-y4-02',
    title: 'ASIC Physical Design: OpenLane RTL-to-GDSII of a Crypto Accelerator',
    problemStatement: 'Bridging the gap between RTL Verilog code and actual silicon manufacturing requires automated place-and-route and DRC/LVS closure.',
    description: 'Take an AES-128 encryption RTL core through the complete open-source OpenLane / SkyWater 130nm ASIC flow down to verified GDSII layout.',
    branch: 'ECE',
    careerGoal: 'VLSI and Semiconductor Design',
    recommendedYear: '4th',
    difficulty: 'Advanced',
    technologies: ['OpenLane', 'SkyWater 130nm PDK', 'Yosys', 'OpenROAD', 'Magic', 'Netgen LVS', 'KLayout'],
    skillsGained: ['Logic Synthesis', 'Floorplanning & Pin Placement', 'Clock Tree Synthesis (CTS)', 'Routing & Antenna Checks', 'DRC/LVS Verification'],
    estimatedHours: 85,
    implementationSteps: [
      'Synthesize AES RTL with Yosys and map onto SkyWater 130nm standard cell library.',
      'Define die area, core utilization (e.g. 55%), and power distribution network (PDN).',
      'Execute global placement and run TritonCTS for balanced clock tree synthesis.',
      'Perform detailed routing and fix antenna rule violations.',
      'Verify Design Rule Checking (DRC) in Magic and Layout vs Schematic (LVS) in Netgen.'
    ],
    expectedOutput: 'Clean GDSII layout with zero DRC and zero LVS violations, ready for tape-out on Efabless chipIgnite / Tiny Tapeout.',
    testingSuggestions: [
      'Inspect Static Timing Analysis (STA) report for worst negative slack (WNS).',
      'Check IR drop across the power grid to ensure supply integrity.',
      'Verify pin placement alignments in KLayout viewer.'
    ],
    resourceUrl: 'https://openlane.readthedocs.io/',
    githubSearchQuery: 'openlane sky130 rtl to gdsii aes crypto',
  },

  // =========================================================================
  // CSE / IT / SOFTWARE & AI PROJECTS
  // =========================================================================
  {
    id: 'proj-cse-y1-01',
    title: 'Command-Line Engineering Student Grade & CGPA Calculator',
    problemStatement: 'First-year students struggle to compute weighted SGPA/CGPA with university grading credits.',
    description: 'A modular CLI program written in C/Python that reads semester course credits, computes SGPA/CGPA, and exports formatted ASCII transcripts.',
    branch: 'CSE',
    careerGoal: 'Software Development',
    recommendedYear: '1st',
    difficulty: 'Beginner',
    technologies: ['Python / C', 'File I/O (CSV/JSON)', 'Terminal UI', 'Unit Tests'],
    skillsGained: ['Structured Data Types', 'Defensive Input Validation', 'File Persistence', 'Clean Functions'],
    estimatedHours: 14,
    implementationSteps: [
      'Define data structures representing Courses (name, code, credits, grade).',
      'Write parsing routines that validate input scale (O, A+, A, B, etc.).',
      'Calculate weighted credit points and semester cumulative grade points.',
      'Save and load student records from structured JSON/CSV files.',
      'Create formatted terminal summary tables.'
    ],
    expectedOutput: 'An error-proof terminal application that calculates exact CGPA and stores historical transcript records.',
    testingSuggestions: [
      'Test invalid input values (e.g. negative credits, invalid letter grades).',
      'Verify edge cases like zero total credits or 10.0 perfect SGPA.',
      'Ensure data files persist correctly when application restarts.'
    ],
    resourceUrl: 'https://docs.python.org/3/tutorial/inputoutput.html',
    githubSearchQuery: 'python cgpa calculator terminal json',
  },
  {
    id: 'proj-cse-y2-01',
    title: 'Full-Stack Campus Event & Workshop Management Portal',
    problemStatement: 'College technical clubs struggle with scattered Google Forms for workshop registrations, QR ticket validation, and attendance logs.',
    description: 'Develop a responsive web application with student authentication, event browsing, automated QR-code admission passes, and club admin analytics.',
    branch: 'CSE',
    careerGoal: 'Software Development',
    recommendedYear: '2nd',
    difficulty: 'Intermediate',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL / Supabase', 'Tailwind CSS'],
    skillsGained: ['RESTful API Design', 'JWT Authentication & Role-Based Access', 'Relational Schema Modeling', 'QR Code Generation'],
    estimatedHours: 45,
    implementationSteps: [
      'Design PostgreSQL schema: Users, Clubs, Events, Registrations, and Check-ins.',
      'Build Express backend with secure bcrypt password hashing and JWT cookies.',
      'Create responsive React frontend with search, date filters, and event details.',
      'Implement QR ticket generator (UUID signed payload) emailed on successful RSVP.',
      'Build club coordinator scanner view using HTML5 camera barcode detector.'
    ],
    expectedOutput: 'A complete live web application where students register for events and organizers scan QR passes in real time.',
    testingSuggestions: [
      'Test role authorization: ensure regular students cannot edit club event details.',
      'Test double registration prevention using database unique constraints.',
      'Profile database queries with EXPLAIN ANALYZE for 500+ mock attendees.'
    ],
    resourceUrl: 'https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs',
    githubSearchQuery: 'react express event registration qr code postgresql',
  },
  {
    id: 'proj-cse-y2-02',
    title: 'Automated Resume ATS Keyword Matcher & Formatting Checker',
    problemStatement: 'Engineering students send resumes without knowing if they match company job descriptions or pass applicant tracking systems.',
    description: 'A Python application that extracts text from PDF resumes, performs NLP tokenization, matches keywords against a job description, and provides an ATS score.',
    branch: 'CSE',
    careerGoal: 'Artificial Intelligence and Machine Learning',
    recommendedYear: '2nd',
    difficulty: 'Intermediate',
    technologies: ['Python', 'spaCy / NLTK', 'pdfplumber', 'Streamlit / FastAPI', 'Cosine Similarity'],
    skillsGained: ['Text Extraction & Parsing', 'TF-IDF & Vectorization', 'Cosine Similarity Scoring', 'Streamlit UI Prototyping'],
    estimatedHours: 30,
    implementationSteps: [
      'Extract plain text and structural sections from PDF resumes using pdfplumber.',
      'Clean text: remove stop words, punctuation, and perform lemmatization with spaCy.',
      'Extract skill keywords matching a pre-built taxonomy of engineering skills.',
      'Compute TF-IDF vectors and calculate Cosine Similarity score with the target Job Description.',
      'Highlight missing keywords and display actionable recommendations in Streamlit.'
    ],
    expectedOutput: 'An interactive web app where students upload their resume, paste a job posting, and receive a 0-100% match score with missing skills list.',
    testingSuggestions: [
      'Test with multi-column PDFs and scanned images to verify text extraction reliability.',
      'Verify identical resume and job description outputs a 100% match.',
      'Ensure execution time stays under 3 seconds per resume.'
    ],
    resourceUrl: 'https://spacy.io/usage/spacy-101',
    githubSearchQuery: 'python streamlit resume ats scanner nlp',
  },
  {
    id: 'proj-cse-y3-01',
    title: 'Distributed In-Memory Key-Value Store with Raft Consensus',
    problemStatement: 'Understanding distributed databases requires implementing replication, leader election, and fault tolerance from scratch.',
    description: 'Build a distributed key-value cache in Go or Java implementing the Raft consensus algorithm, supporting cluster leader election and log replication.',
    branch: 'CSE',
    careerGoal: 'Software Development',
    recommendedYear: '3rd',
    difficulty: 'Advanced',
    technologies: ['Go / Java', 'gRPC / TCP', 'Raft Consensus Algorithm', 'Concurrency & Mutexes'],
    skillsGained: ['Distributed Consensus', 'Network Partition Recovery', 'Leader Election Timers', 'Heartbeat Protocol'],
    estimatedHours: 65,
    implementationSteps: [
      'Implement Raft node state machine: Follower, Candidate, and Leader.',
      'Build randomized election timer and RequestVote RPC mechanism.',
      'Implement AppendEntries RPC with log consistency checks and commit index advancement.',
      'Build client HTTP/gRPC interface for GET/SET operations redirected to cluster leader.',
      'Simulate network drops to verify cluster continues operating with majority quorum.'
    ],
    expectedOutput: 'A 3-node distributed cluster where any node can crash and the cluster maintains consistency without data loss.',
    testingSuggestions: [
      'Simulate network partition (split-brain) and test whether old leader steps down.',
      'Run Jepsen-style randomized chaos test inserting keys during leader failures.',
      'Verify serializable read/write operations under heavy concurrent traffic.'
    ],
    resourceUrl: 'https://raft.github.io/',
    githubSearchQuery: 'distributed key value store raft consensus go',
  },
  {
    id: 'proj-cse-y3-02',
    title: 'Multimodal AI RAG Assistant for Engineering Textbooks',
    problemStatement: 'Engineering students spend hours searching through 800-page textbooks for specific circuit theorems, formulas, and proofs.',
    description: 'Build a Retrieval-Augmented Generation (RAG) assistant using LangChain/LlamaIndex that chunks engineering PDF textbooks, indexes vector embeddings, and answers queries with page citations.',
    branch: 'CSE',
    careerGoal: 'Artificial Intelligence and Machine Learning',
    recommendedYear: '3rd',
    difficulty: 'Advanced',
    technologies: ['Python', 'LangChain', 'ChromaDB / Qdrant', 'Gemini / OpenAI API', 'FastAPI', 'React'],
    skillsGained: ['Vector Embeddings', 'Semantic Chunking Strategies', 'Hybrid Search (BM25 + Dense)', 'Hallucination Mitigation', 'Prompt Engineering'],
    estimatedHours: 50,
    implementationSteps: [
      'Parse engineering PDF documents preserving formulas and section headers.',
      'Generate embeddings using open-source sentence-transformers or text-embedding-004.',
      'Store vectors in ChromaDB vector database with page number metadata.',
      'Construct retrieval pipeline fetching top-k chunks with re-ranking.',
      'Feed context into LLM with strict prompt instructing citations and refusing out-of-context queries.'
    ],
    expectedOutput: 'A clean web chat interface that gives accurate technical answers with exact book page references and formula breakdowns.',
    testingSuggestions: [
      'Ask questions not present in the book to confirm the system admits lack of context rather than hallucinating.',
      'Evaluate retrieval precision across varying chunk sizes (256, 512, 1024 tokens).',
      'Test query latency and optimize vector cache.'
    ],
    resourceUrl: 'https://python.langchain.com/docs/tutorials/rag/',
    githubSearchQuery: 'rag langchain chromadb pdf textbook question answering',
  },
  {
    id: 'proj-cse-y4-01',
    title: 'High-Throughput Microservices E-Commerce Core with Kafka & Kubernetes',
    problemStatement: 'Monolithic architectures struggle under high-concurrency flash sales, requiring microservice decomposition and event streaming.',
    description: 'A production-grade microservices architecture featuring Order, Inventory, Payment, and Notification services communicating asynchronously via Apache Kafka.',
    branch: 'CSE',
    careerGoal: 'Software Development',
    recommendedYear: '4th',
    difficulty: 'Advanced',
    technologies: ['Docker', 'Kubernetes (k8s)', 'Apache Kafka', 'Node.js / Go', 'PostgreSQL', 'Redis', 'Prometheus'],
    skillsGained: ['Event-Driven Architecture', 'Saga Pattern for Distributed Transactions', 'Container Orchestration', 'Circuit Breakers', 'Metrics Telemetry'],
    estimatedHours: 85,
    implementationSteps: [
      'Decompose system into Order Service, Inventory Service, and Payment Service.',
      'Set up Apache Kafka topics for order.created, payment.processed, inventory.reserved.',
      'Implement Saga Orchestrator pattern to handle compensating rollback transactions.',
      'Containerize each service with Docker and deploy Helm charts to a local Minikube cluster.',
      'Add Prometheus metrics and Grafana dashboards tracking requests/second and latency percentiles (p95/p99).'
    ],
    expectedOutput: 'A distributed system processing 5,000+ orders/min with automatic rollback on payment failures and zero service cascading crashes.',
    testingSuggestions: [
      'Simulate Payment Service outage: verify orders transition to CANCELLED and reserved inventory is unlocked.',
      'Run Apache JMeter load tests to find system throughput bottleneck.',
      'Kill a Kubernetes pod in the middle of a request to verify replica failover.'
    ],
    resourceUrl: 'https://microservices.io/patterns/data/saga.html',
    githubSearchQuery: 'microservices kafka saga pattern docker kubernetes',
  },

  // =========================================================================
  // EEE / CORE ELECTRICAL PROJECTS
  // =========================================================================
  {
    id: 'proj-eee-y2-01',
    title: 'Microcontroller-Based Smart Solar Power Meter & Battery Charger',
    problemStatement: 'Solar energy harvesting requires maximum power extraction and battery health monitoring to prevent overcharging.',
    description: 'Design a solar photovoltaic charge controller with INA219 current/voltage sensor, Arduino, and LCD displaying solar yield (Watts, Ah).',
    branch: 'EEE',
    careerGoal: 'Core Engineering',
    recommendedYear: '2nd',
    difficulty: 'Intermediate',
    technologies: ['Arduino', 'INA219 I2C Sensor', '12V Solar Panel', 'Lead-Acid / Li-Ion Battery', 'Buck Converter'],
    skillsGained: ['DC-DC Converter Control', 'Current Shunt Measurement', 'Battery State of Charge (SoC)', 'Power Calculations'],
    estimatedHours: 30,
    implementationSteps: [
      'Construct adjustable buck converter circuit from solar panel voltage down to battery charging level.',
      'Wire INA219 sensor in series with the battery to measure voltage and current with 1% accuracy.',
      'Code a multi-stage charging algorithm: Bulk, Absorption, and Float modes.',
      'Display real-time generated Watts, accumulated Watt-hours, and battery voltage.',
      'Add reverse-current protection diode preventing battery discharge at night.'
    ],
    expectedOutput: 'An automated solar controller that charges a battery safely and displays real-time voltage, current, and energy generation metrics.',
    testingSuggestions: [
      'Verify cut-off voltage matches exact battery chemistry threshold (e.g. 14.4V for Lead-Acid).',
      'Test under low-sun and high-sun conditions to confirm regulator stability.',
      'Measure standby power draw to ensure battery does not drain overnight.'
    ],
    resourceUrl: 'https://www.electronicshub.org/solar-charge-controller/',
    githubSearchQuery: 'arduino solar charge controller ina219 buck converter',
  },

  // =========================================================================
  // MECHANICAL & CIVIL ENGINEERING PROJECTS
  // =========================================================================
  {
    id: 'proj-mech-y2-01',
    title: '3D-Printed Robotic Arm with Inverse Kinematics & Servo Control',
    problemStatement: 'Industrial pick-and-place automation requires articulated coordinate movement and inverse kinematics trajectory calculations.',
    description: 'Design a 4-DOF articulated robotic arm in SolidWorks, 3D print the links, and control position using PCA9685 servo driver and inverse kinematics equations.',
    branch: 'Mechanical',
    careerGoal: 'Core Engineering',
    recommendedYear: '2nd',
    difficulty: 'Intermediate',
    technologies: ['SolidWorks / Fusion 360', '3D Printing (PLA)', 'MG996R Servos', 'PCA9685 I2C Driver', 'Python / Arduino'],
    skillsGained: ['CAD Mechanism Design', 'Inverse Kinematics (Trigonometric & Geometric)', 'Servo PWM Control', 'Structural Rigidity Analysis'],
    estimatedHours: 45,
    implementationSteps: [
      'Model 4 links, gripper, and base in SolidWorks with bearing slots and servo horns.',
      '3D print parts with 30%+ infill for torsional stiffness.',
      'Derive geometric inverse kinematics equations mapping target (X, Y, Z) to joint angles (theta 1-4).',
      'Control servos smoothly using PCA9685 16-channel PWM driver to eliminate jitter.',
      'Program automatic pick, lift, move, and release sequence for small objects.'
    ],
    expectedOutput: 'A working 4-axis robotic arm that accurately positions its gripper at designated physical coordinates.',
    testingSuggestions: [
      'Test payload capacity before servo stall occurs.',
      'Measure repeatability of pick-and-place accuracy over 50 continuous cycles.',
      'Inspect joint gear wear and backlash after extended operation.'
    ],
    resourceUrl: 'https://howtomechatronics.com/tutorials/arduino/diy-arduino-robot-arm-with-smartphone-control/',
    githubSearchQuery: '3d printed robot arm inverse kinematics pca9685 arduino',
  },
  {
    id: 'proj-civil-y3-01',
    title: 'Smart Campus GIS Mapping & Stormwater Drainage Simulation',
    problemStatement: 'Campus flooding during monsoon seasons requires accurate runoff modeling and optimal drainage canal capacity estimation.',
    description: 'Create a 3D digital elevation model (DEM) of college campus in QGIS, compute rational method runoff coefficients, and simulate drainage network capacity in EPA-SWMM.',
    branch: 'Civil',
    careerGoal: 'Core Engineering',
    recommendedYear: '3rd',
    difficulty: 'Advanced',
    technologies: ['QGIS', 'EPA-SWMM', 'AutoCAD', 'Hydrological Modeling', 'Satellite DEM Data'],
    skillsGained: ['Geographic Information Systems (GIS)', 'Hydrology & Watershed Delineation', 'Stormwater Pipe Hydraulics', 'Flood Risk Assessment'],
    estimatedHours: 40,
    implementationSteps: [
      'Import campus topographic survey and high-resolution drone/satellite DEM into QGIS.',
      'Delineate sub-catchment drainage basins and calculate impervious surface area percentages.',
      'Model rainfall intensity-duration-frequency (IDF) curves for local meteorological data.',
      'Construct pipe network nodes, conduits, and storage outfalls in EPA-SWMM simulation software.',
      'Identify bottlenecks and propose optimized culvert dimensions to prevent waterlogging.'
    ],
    expectedOutput: 'A comprehensive hydrological simulation report and visual flood map demonstrating zero overflow during 25-year storm events.',
    testingSuggestions: [
      'Verify rational method runoff totals against empirical Manning formula calculations.',
      'Simulate 10-year, 25-year, and 50-year storm recurrence intervals.',
      'Check pipe slope invert elevations to ensure minimum self-cleansing velocity.'
    ],
    resourceUrl: 'https://www.epa.gov/water-research/storm-water-management-model-swmm',
    githubSearchQuery: 'qgis epa swmm stormwater drainage simulation',
  }
];
