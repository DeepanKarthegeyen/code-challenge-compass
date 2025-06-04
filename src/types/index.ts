
export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  language: string;
  testCases: TestCase[];
  timeLimit: number; // in minutes
  createdAt: Date;
  createdBy: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  loginTime: Date;
  submissions: Submission[];
  challengeId: string;
}

export interface Submission {
  id: string;
  candidateId: string;
  challengeId: string;
  code: string;
  language: string;
  status: 'Pending' | 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
  score: number;
  submissionTime: Date;
  executionTime: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'candidate';
}
