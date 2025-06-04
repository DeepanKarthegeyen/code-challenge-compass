
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '../context/AppContext';
import { Challenge, TestCase } from '../types';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';

const CreateChallenge: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [language, setLanguage] = useState('python');
  const [timeLimit, setTimeLimit] = useState(30);
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: '1', input: '', expectedOutput: '', isHidden: false }
  ]);

  const { addChallenge, currentUser } = useApp();
  const { toast } = useToast();

  const addTestCase = () => {
    const newTestCase: TestCase = {
      id: Date.now().toString(),
      input: '',
      expectedOutput: '',
      isHidden: false
    };
    setTestCases([...testCases, newTestCase]);
  };

  const removeTestCase = (id: string) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter(tc => tc.id !== id));
    }
  };

  const updateTestCase = (id: string, field: keyof TestCase, value: string | boolean) => {
    setTestCases(testCases.map(tc => 
      tc.id === id ? { ...tc, [field]: value } : tc
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || testCases.some(tc => !tc.input || !tc.expectedOutput)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and test cases",
        variant: "destructive"
      });
      return;
    }

    const challenge: Challenge = {
      id: Date.now().toString(),
      title,
      description,
      difficulty,
      language,
      testCases,
      timeLimit,
      createdAt: new Date(),
      createdBy: currentUser?.id || 'unknown'
    };

    addChallenge(challenge);
    
    // Reset form
    setTitle('');
    setDescription('');
    setDifficulty('Easy');
    setLanguage('python');
    setTimeLimit(30);
    setTestCases([{ id: '1', input: '', expectedOutput: '', isHidden: false }]);

    toast({
      title: "Success",
      description: "Challenge created successfully!"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Challenge</CardTitle>
        <CardDescription>
          Design a coding challenge for candidates to solve
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Challenge Title</Label>
              <Input
                id="title"
                placeholder="e.g., Two Sum Problem"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
              <Input
                id="timeLimit"
                type="number"
                min="5"
                max="180"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Problem Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the problem statement, constraints, and examples..."
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={difficulty} onValueChange={(value: 'Easy' | 'Medium' | 'Hard') => setDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Programming Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="sql">SQL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Test Cases</Label>
              <Button type="button" variant="outline" size="sm" onClick={addTestCase}>
                <Plus className="h-4 w-4 mr-2" />
                Add Test Case
              </Button>
            </div>
            
            {testCases.map((testCase, index) => (
              <Card key={testCase.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Test Case {index + 1}</h4>
                  {testCases.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTestCase(testCase.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Input</Label>
                    <Textarea
                      placeholder="Input data for this test case"
                      value={testCase.input}
                      onChange={(e) => updateTestCase(testCase.id, 'input', e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Expected Output</Label>
                    <Textarea
                      placeholder="Expected output for this input"
                      value={testCase.expectedOutput}
                      onChange={(e) => updateTestCase(testCase.id, 'expectedOutput', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Create Challenge
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateChallenge;
