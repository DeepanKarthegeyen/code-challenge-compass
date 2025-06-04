
import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Mail, Calendar, Clock, User, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ReportsPanel: React.FC = () => {
  const { candidates, submissions, challenges } = useApp();
  const { toast } = useToast();

  // Mock data for charts
  const scoreDistribution = [
    { range: '0-20', count: 2 },
    { range: '21-40', count: 5 },
    { range: '41-60', count: 8 },
    { range: '61-80', count: 12 },
    { range: '81-100', count: 15 }
  ];

  const languageStats = [
    { name: 'Python', value: 35, color: '#3B82F6' },
    { name: 'JavaScript', value: 25, color: '#10B981' },
    { name: 'Java', value: 20, color: '#F59E0B' },
    { name: 'C#', value: 12, color: '#EF4444' },
    { name: 'SQL', value: 8, color: '#8B5CF6' }
  ];

  const averageScore = submissions.length > 0 
    ? submissions.reduce((sum, sub) => sum + sub.score, 0) / submissions.length 
    : 0;

  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "Candidate report has been exported to CSV format"
    });
  };

  const handleSendEmail = (candidateEmail: string) => {
    const subject = "Your Coding Challenge Results";
    const body = "Thank you for participating in our coding challenge. Your results are attached.";
    const mailtoUrl = `mailto:${candidateEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="text-2xl font-bold">{candidates.length}</h3>
                <p className="text-gray-600">Total Candidates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h3 className="text-2xl font-bold">{averageScore.toFixed(1)}%</h3>
                <p className="text-gray-600">Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <h3 className="text-2xl font-bold">{submissions.length}</h3>
                <p className="text-gray-600">Total Submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h3 className="text-2xl font-bold">{challenges.length}</h3>
                <p className="text-gray-600">Active Challenges</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>Distribution of candidate scores across all challenges</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Language Preferences</CardTitle>
            <CardDescription>Programming languages chosen by candidates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={languageStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {languageStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Candidate Results Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Candidate Results</CardTitle>
              <CardDescription>Detailed results for all candidates</CardDescription>
            </div>
            <Button onClick={handleExportReport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {candidates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No candidate data available yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Login Time</TableHead>
                  <TableHead>Challenge</TableHead>
                  <TableHead>Best Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => {
                  const candidateSubmissions = submissions.filter(sub => sub.candidateId === candidate.id);
                  const bestScore = candidateSubmissions.length > 0 
                    ? Math.max(...candidateSubmissions.map(sub => sub.score))
                    : 0;
                  const challenge = challenges.find(c => c.id === candidate.challengeId);
                  
                  return (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>{candidate.email}</TableCell>
                      <TableCell>{formatDate(candidate.loginTime)}</TableCell>
                      <TableCell>{challenge?.title || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={bestScore >= 80 ? 'default' : bestScore >= 60 ? 'secondary' : 'destructive'}>
                          {bestScore.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={candidateSubmissions.length > 0 ? 'default' : 'secondary'}>
                          {candidateSubmissions.length > 0 ? 'Completed' : 'In Progress'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleSendEmail(candidate.email)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPanel;
