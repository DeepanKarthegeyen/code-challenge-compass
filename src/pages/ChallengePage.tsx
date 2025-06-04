
import React from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LoginForm from '../components/LoginForm';
import CodeEditor from '../components/CodeEditor';
import Header from '../components/Header';

const ChallengePage: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const { currentUser } = useApp();

  if (!currentUser) {
    return <LoginForm challengeId={challengeId} />;
  }

  if (!challengeId) {
    return <div>Challenge not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CodeEditor challengeId={challengeId} />
    </div>
  );
};

export default ChallengePage;
