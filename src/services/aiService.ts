import { StudentProfile, Project, RoadmapTask } from '../types';

export interface AIResponse<T> {
  success: boolean;
  data: T;
  isAiGenerated: boolean;
  message?: string;
}

export interface RoadmapAdviceData {
  summary: string;
  keyPriorities: string[];
  recommendedWeeklyFocus: string;
  careerInsight: string;
  proTips: string[];
}

export interface WeeklyStudyPlanData {
  weeklyHours: number;
  allocations: {
    domain: string;
    hours: number;
    description: string;
    activities: string[];
  }[];
  weekendStrategy: string;
  consistencyTip: string;
}

export class AIService {
  private static getApiKey(profile?: StudentProfile | null): string | null {
    if (profile?.geminiApiKey && profile.geminiApiKey.trim().length > 0) {
      return profile.geminiApiKey.trim();
    }
    // Check Vite environment variable if available
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (typeof envKey === 'string' && envKey.trim().length > 0) {
      return envKey.trim();
    }
    return null;
  }

  /**
   * Direct call to Gemini 1.5 Flash API with timeout and error protection
   */
  
private static async callGemini(
  apiKey: string,
  prompt: string
): Promise<string> {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 30000);

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 1024,
          },
        }),
        signal: controller.signal,
      }
    );

    const responseText = await response.text();

    if (!responseText.trim()) {
      throw new Error(
        `Gemini returned an empty response (HTTP ${response.status}).`
      );
    }

    let json: any;

    try {
      json = JSON.parse(responseText);
    } catch {
      throw new Error(
        `Gemini returned invalid JSON (HTTP ${response.status}): ` +
        responseText.slice(0, 200)
      );
    }

    if (!response.ok) {
      throw new Error(
        json.error?.message ||
        `Gemini API request failed (HTTP ${response.status}).`
      );
    }

    const generatedText = json.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text || '')
      .join('')
      .trim();

    if (generatedText) {
      return generatedText;
    }

    const blockReason = json.promptFeedback?.blockReason;

    if (blockReason) {
      throw new Error(
        `Gemini blocked the prompt. Reason: ${blockReason}`
      );
    }

    throw new Error(
      'Gemini returned no text. Please try another question.'
    );
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Gemini request timed out. Please try again.');
    }

    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}


  /**
   * Generates personalized roadmap strategic advice for the student's profile
   */
  static async getRoadmapAdvice(
    profile: StudentProfile
  ): Promise<AIResponse<RoadmapAdviceData>> {
    const apiKey = this.getApiKey(profile);

    if (apiKey) {
      try {
        const prompt = `You are a premier senior engineering career mentor in India.
Student Profile:
- Year: ${profile.academicYear} Year B.Tech
- Branch: ${profile.branch}
- Career Goal: ${profile.careerGoal}
- Current Skill Level: ${profile.skillLevel}
- Available Study Time: ${profile.weeklyStudyHours} hours/week
- Target Organization: ${profile.targetCompany || 'Tier-1 Product / Core Firm'}

Provide structured, realistic career guidance in JSON format with exactly these keys:
{
  "summary": "2-3 sentences overview of where they should be right now in their degree",
  "keyPriorities": ["Priority 1", "Priority 2", "Priority 3"],
  "recommendedWeeklyFocus": "How to distribute their ${profile.weeklyStudyHours} hours this semester",
  "careerInsight": "Specific competitive edge needed for ${profile.careerGoal}",
  "proTips": ["Actionable tip 1", "Actionable tip 2"]
}
Do not include markdown backticks around the json if possible, or format cleanly as json.`;

        const raw = await this.callGemini(apiKey, prompt);
        const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        return {
          success: true,
          data: parsed,
          isAiGenerated: true,
          message: 'Personalized roadmap guidance generated via Gemini AI',
        };
      } catch (err) {
        console.warn('Gemini API call failed or timed out. Falling back to deterministic mentor rules:', err);
      }
    }

    // Deterministic fallback based on profile parameters
    return {
      success: true,
      data: this.getDeterministicRoadmapAdvice(profile),
      isAiGenerated: false,
      message: 'Guidance generated using SkillPath AI Built-In Engineering Rules (Deterministic)',
    };
  }

  /**
   * Explains why a specific skill matters for the student's branch and goal
   */
  static async explainSkillRelevance(
    skillName: string,
    profile: StudentProfile
  ): Promise<AIResponse<string>> {
    const apiKey = this.getApiKey(profile);

    if (apiKey) {
      try {
        const prompt = `Explain in 3 concise, punchy sentences why the skill "${skillName}" is crucial for a ${profile.academicYear} Year ${profile.branch} student targeting "${profile.careerGoal}". Include one real interview or practical workplace context where this skill is tested.`;
        const text = await this.callGemini(apiKey, prompt);
        return {
          success: true,
          data: text.trim(),
          isAiGenerated: true,
        };
      } catch (err) {
        console.warn('Gemini failed, using local explanation engine:', err);
      }
    }

    // Fallback explanation
    return {
      success: true,
      data: this.getDeterministicSkillExplanation(skillName, profile),
      isAiGenerated: false,
    };
  }

  /**
   * Generates a tailored weekly study breakdown
   */
  static async getWeeklyStudyPlan(
    profile: StudentProfile
  ): Promise<AIResponse<WeeklyStudyPlanData>> {
    const hours = profile.weeklyStudyHours || 15;

    // Distribute hours logically
    const coreHours = Math.round(hours * 0.45);
    const projectHours = Math.round(hours * 0.35);
    const aptitudeHours = Math.max(1, hours - coreHours - projectHours);

    const data: WeeklyStudyPlanData = {
      weeklyHours: hours,
      allocations: [
        {
          domain: profile.branch === 'ECE' ? 'Core Hardware & Protocol Foundations' : 'Core CS Fundamentals & Problem Solving',
          hours: coreHours,
          description: `Deep theoretical & conceptual practice aligned with your ${profile.careerGoal} goal.`,
          activities: [
            profile.branch === 'ECE'
              ? 'Read microcontroller datasheets, register maps, and communication timing diagrams'
              : 'Algorithmic problem sets on LeetCode/GeeksforGeeks (2-3 problems/session)',
            'Core subject notes revision and concept synthesis',
            'Quiz and test-case verification',
          ],
        },
        {
          domain: 'Hands-on Projects & Lab Prototyping',
          hours: projectHours,
          description: 'Applying theoretical concepts to verifiable engineering artifacts.',
          activities: [
            'Active code/circuit implementation and hardware debugging',
            'Writing structured commits and documentation in GitHub README',
            'Unit testing and edge-case boundary verification',
          ],
        },
        {
          domain: 'Aptitude, Soft Skills & Industry Research',
          hours: aptitudeHours,
          description: 'Preparing for screening rounds, networking, and technical communication.',
          activities: [
            'Speed arithmetic and logical puzzles on IndiaBIX (30 mins daily)',
            'LinkedIn technical updates and industry engineering blogs reading',
            'Rehearsing STAR method behavioral answers',
          ],
        },
      ],
      weekendStrategy: 'Dedicate Saturdays to continuous 3-4 hour focused deep-work project sprints; use Sunday evenings for roadmap review and next week planning.',
      consistencyTip: 'Consistent 2 hours daily delivers far superior retention than cramming 14 hours over a single weekend.',
    };

    return {
      success: true,
      data,
      isAiGenerated: false,
    };
  }

  /**
   * Generates customized project suggestions
   */
  static async generateProjectIdea(
    profile: StudentProfile,
    customInterest?: string
  ): Promise<AIResponse<Partial<Project>>> {
    const apiKey = this.getApiKey(profile);

    if (apiKey) {
      try {
        const prompt = `Suggest a novel, impressive engineering project for a ${profile.academicYear} Year ${profile.branch} student whose goal is "${profile.careerGoal}" and interest is "${customInterest || 'Practical Real-world Solution'}".
Return JSON with:
{
  "title": "Project Title",
  "problemStatement": "Clear problem statement",
  "description": "2-sentence overview",
  "difficulty": "${profile.skillLevel === 'Beginner' ? 'Beginner' : profile.skillLevel === 'Advanced' ? 'Advanced' : 'Intermediate'}",
  "technologies": ["Tech 1", "Tech 2", "Tech 3", "Tech 4"],
  "skillsGained": ["Skill 1", "Skill 2", "Skill 3"],
  "estimatedHours": 40,
  "implementationSteps": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
  "expectedOutput": "Observable working output",
  "testingSuggestions": ["Test 1", "Test 2"]
}`;
        const raw = await this.callGemini(apiKey, prompt);
        const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        return {
          success: true,
          data: {
            ...parsed,
            branch: profile.branch,
            careerGoal: profile.careerGoal,
            recommendedYear: profile.academicYear,
          },
          isAiGenerated: true,
        };
      } catch (err) {
        console.warn('Gemini project generation failed, falling back:', err);
      }
    }

    // Deterministic project recommendation
    const fallbackTitle =
      profile.branch === 'ECE'
        ? 'Real-Time Edge-Triggered Sensor Telemetry Node'
        : 'Microservices-Based Campus Resource Booking Engine';

    return {
      success: true,
      data: {
        title: fallbackTitle,
        problemStatement:
          profile.branch === 'ECE'
            ? 'Battery-operated remote monitoring units suffer from excessive power consumption during idle periods.'
            : 'Fragmented departmental reservations lead to conflicting schedule overlaps and idle classroom utilization.',
        description:
          profile.branch === 'ECE'
            ? 'A battery-optimized sensor system utilizing low-power deep sleep and hardware interrupts to stream environmental metrics.'
            : 'A robust web service featuring real-time room availability calendar, role-based approval flows, and automated email confirmation notifications.',
        branch: profile.branch,
        careerGoal: profile.careerGoal,
        recommendedYear: profile.academicYear,
        difficulty: profile.skillLevel === 'Advanced' ? 'Advanced' : 'Intermediate',
        technologies:
          profile.branch === 'ECE'
            ? ['ESP32', 'FreeRTOS', 'KiCad', 'MQTT', 'C++']
            : ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
        skillsGained:
          profile.branch === 'ECE'
            ? ['Low-Power Firmware Design', 'Peripheral Interrupt Handling', 'Hardware Protocol Debugging']
            : ['RESTful API Architecture', 'Concurrency & Locking', 'Database Indexing'],
        estimatedHours: 35,
        implementationSteps: [
          'Design the core architecture diagram and schema definitions.',
          'Implement core driver / service layer with automated tests.',
          'Construct UI dashboard or hardware testing jig.',
          'Conduct end-to-end stress tests under peak load.',
          'Package documentation with architectural diagrams and demo walk-through.',
        ],
        expectedOutput: 'A fully functional prototype with zero critical errors under continuous stress testing.',
        testingSuggestions: [
          'Verify edge conditions under simulated network drops or power dips.',
          'Measure execution latency across 50 consecutive operations.',
        ],
      },
      isAiGenerated: false,
      message: 'Generated using SkillPath AI rule engine',
    };
  }

  // Helper deterministic logic
  private static getDeterministicRoadmapAdvice(profile: StudentProfile): RoadmapAdviceData {
    const isEce = profile.branch === 'ECE';
    const isCse = profile.branch === 'CSE' || profile.branch === 'IT';
    const year = profile.academicYear;

    if (year === '1st') {
      return {
        summary: `As a 1st-year ${profile.branch} student, your primary mandate is building strong procedural logic and mathematical foundations before choosing deep specializations.`,
        keyPriorities: [
          'Master C programming and memory pointers completely — this underpins every high-performance software and hardware system.',
          'Establish a daily problem-solving routine (at least 3-4 hours per week on logic).',
          'Learn basic Git & GitHub commands to document all lab assignments publicly.',
        ],
        recommendedWeeklyFocus: `Divide your ${profile.weeklyStudyHours} hours: 50% on C/Python logic, 30% on Engineering Math & physics labs, and 20% on exploring domain clubs.`,
        careerInsight: isEce
          ? 'ECE requires both physical hardware intuition and low-level code understanding. Don’t skip breadboard and multimeter labs!'
          : 'CSE placement interviews start with algorithms. A student who starts logic in 1st year has a 3x higher placement advantage.',
        proTips: [
          'Avoid tutorial paralysis. Write code on your own machine from day one.',
          'Join your college IEEE, ACM, or Robotics student chapters early.',
        ],
      };
    }

    if (year === '2nd') {
      return {
        summary: `2nd year is the critical turning point where you transition from generic engineering subjects into core domain differentiation for ${profile.careerGoal}.`,
        keyPriorities: isEce
          ? [
              'Master microcontroller architectures (timers, interrupts, ADC) and protocols (UART, SPI, I2C).',
              'Learn schematic capture and PCB layout in KiCad or digital logic in Verilog.',
              'Build at least 2 tangible hardware projects and participate in your first 24-hour hackathon.',
            ]
          : [
              'Master Data Structures & Algorithms (Trees, Graphs, Dynamic Programming) in C++ or Java.',
              'Build a non-trivial full-stack web or systems application with persistent database storage.',
              'Maintain an active GitHub profile with clean README documentation.',
            ],
        recommendedWeeklyFocus: `Allocate your ${profile.weeklyStudyHours} hours: 40% on core subjects, 40% on project development, and 20% on competitive practice.`,
        careerInsight: `Top recruiters assess 2nd year students on depth over breadth. One completed, deeply understood project beats five half-finished tutorials.`,
        proTips: [
          'Target upcoming summer internships by drafting cold outreach messages in semester 4.',
          'Never leave lab code on flash drives; push every single line of code to GitHub.',
        ],
      };
    }

    if (year === '3rd') {
      return {
        summary: `3rd year is the peak preparation phase. Your portfolio, aptitude speed, and technical depth will decide your pre-placement offers (PPO) and tier-1 internships.`,
        keyPriorities: [
          'Lock in a comprehensive ATS-friendly 1-page resume using Jake’s / Overleaf LaTeX template.',
          'Complete an advanced capstone-grade project with testing, benchmarks, and architectural documentation.',
          'Begin timed quantitative aptitude and core subject revision (DBMS, OS, Networks, or Digital Systems).',
        ],
        recommendedWeeklyFocus: `With ${profile.weeklyStudyHours} hours/week: spend 35% on interview coding/core revision, 35% on capstone project completion, and 30% on active internship applications.`,
        careerInsight: `Company technical tests eliminate 70% of candidates on timed aptitude and DSA/core fundamentals before any interview begins. Speed is crucial.`,
        proTips: [
          'Conduct mock interviews with peers to get comfortable explaining your project choices.',
          'Apply broadly: aim for 15-20 targeted applications across product firms, startups, and research labs.',
        ],
      };
    }

    // 4th Year
    return {
      summary: `You are in the final execution semester! Every week must be laser-focused on campus drives, technical mock rounds, and converting interviews into confirmed offers.`,
      keyPriorities: [
        'Tailor your resume for specific job descriptions and company domains.',
        'Master the STAR method for behavioral and HR rounds (leadership, conflict, failure).',
        'Finish your final-year capstone project and prepare an airtight IEEE-standard presentation.',
      ],
      recommendedWeeklyFocus: `Dedicate your ${profile.weeklyStudyHours} hours: 40% on company-specific past placement papers, 30% on mock technical rounds, and 30% on capstone deliverables.`,
      careerInsight: `Confidence, articulate communication, and honest ownership of your project contributions are what separate offered candidates from rejected ones in final rounds.`,
      proTips: [
        'Never memorize answers; understand the first-principles reasoning behind every system design choice.',
        'Track every application status meticulously in SkillPath AI’s application tracker.',
      ],
    };
  }

  /**
   * Generic AI query endpoint – returns answer for any user prompt.
   * If Gemini API key is configured, forwards the prompt to Gemini.
   * Otherwise returns a deterministic placeholder response.
   */
  static async queryAI(prompt: string, profile?: StudentProfile): Promise<AIResponse<string>> {
    const apiKey = profile ? this.getApiKey(profile) : null;
    if (apiKey) {
      try {
        const text = await this.callGemini(apiKey, prompt);
        return { success: true, data: text.trim(), isAiGenerated: true };
      } catch (err) {
        console.warn('Gemini query failed, falling back to deterministic response:', err);
      }
    }
    const fallback = `AI query received but no Gemini API key is configured. Your prompt was: "${prompt}"`;
    return { success: true, data: fallback, isAiGenerated: false };
  }

  private static getDeterministicSkillExplanation(skillName: string, profile: StudentProfile): string {
    return `In ${profile.branch} engineering and ${profile.careerGoal}, "${skillName}" is an essential competency that signals hands-on problem solving to technical interviewers. Candidates who demonstrate practical proficiency in this area regularly outperform peers who rely strictly on textbook theory.`;
  }
}
