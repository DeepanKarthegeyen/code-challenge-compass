
import React from 'react';
import { useApp } from '../context/AppContext';
import ChallengeList from './ChallengeList';
import ReportsPanel from './ReportsPanel';
import CreateChallenge from './CreateChallenge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, BarChart3, Code, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { currentUser, challenges, candidates } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser?.name}!
          </h1>
          <p className="text-gray-600">
            {currentUser?.role === 'admin' 
              ? 'Manage your coding challenges and monitor candidate progress'
              : 'Access your assigned coding challenges and track your progress'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Code className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{challenges.length}</h3>
                <p className="text-gray-600">Total Challenges</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{candidates.length}</h3>
                <p className="text-gray-600">Active Candidates</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">85%</h3>
                <p className="text-gray-600">Average Score</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="challenges" className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span>Challenges</span>
            </TabsTrigger>
            {currentUser?.role === 'admin' && (
              <>
                <TabsTrigger value="create" className="flex items-center space-x-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>Create Challenge</span>
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Reports</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="challenges">
            <ChallengeList />
          </TabsContent>

          {currentUser?.role === 'admin' && (
            <>
              <TabsContent value="create">
                <CreateChallenge />
              </TabsContent>
              <TabsContent value="reports">
                <ReportsPanel />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
