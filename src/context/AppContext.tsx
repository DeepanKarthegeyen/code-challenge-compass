
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Challenge, Candidate, Submission, User } from '../types';

interface AppContextType {
  challenges: Challenge[];
  candidates: Candidate[];
  submissions: Submission[];
  currentUser: User | null;
  addChallenge: (challenge: Challenge) => void;
  addCandidate: (candidate: Candidate) => void;
  addSubmission: (submission: Submission) => void;
  setCurrentUser: (user: User | null) => void;
  getChallengeById: (id: string) => Challenge | undefined;
  getCandidatesByChallenge: (challengeId: string) => Candidate[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      difficulty: 'Easy',
      language: 'python',
      testCases: [
        {
          id: '1',
          input: '[2,7,11,15]\n9',
          expectedOutput: '[0,1]',
          isHidden: false
        }
      ],
      timeLimit: 30,
      createdAt: new Date(),
      createdBy: 'admin'
    }
  ]);
  
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const addChallenge = (challenge: Challenge) => {
    setChallenges(prev => [...prev, challenge]);
  };

  const addCandidate = (candidate: Candidate) => {
    setCandidates(prev => [...prev, candidate]);
  };

  const addSubmission = (submission: Submission) => {
    setSubmissions(prev => [...prev, submission]);
  };

  const getChallengeById = (id: string) => {
    return challenges.find(challenge => challenge.id === id);
  };

  const getCandidatesByChallenge = (challengeId: string) => {
    return candidates.filter(candidate => candidate.challengeId === challengeId);
  };

  return (
    <AppContext.Provider value={{
      challenges,
      candidates,
      submissions,
      currentUser,
      addChallenge,
      addCandidate,
      addSubmission,
      setCurrentUser,
      getChallengeById,
      getCandidatesByChallenge
    }}>
      {children}
    </AppContext.Provider>
  );
};
