
import React from 'react';
import { useApp } from '../context/AppContext';
import LoginForm from '../components/LoginForm';
import Dashboard from '../components/Dashboard';
import Header from '../components/Header';

const Index = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Dashboard />
    </div>
  );
};

export default Index;
