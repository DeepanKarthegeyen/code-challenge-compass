
import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useApp } from '../context/AppContext';
import { Submission } from '../types';
import { useToast } from '@/hooks/use-toast';
import { Play, Clock, CheckCircle, XCircle } from 'lucide-react';

interface CodeEditorProps {
  challengeId: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ challengeId }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState<{ passed: number; total: number }>({ passed: 0, total: 0 });

  const { getChallengeById, addSubmission, currentUser } = useApp();
  const { toast } = useToast();
  
  const challenge = getChallengeById(challengeId);

  useEffect(() => {
    if (challenge) {
      setTimeLeft(challenge.timeLimit * 60); // Convert to seconds
      setLanguage(challenge.language);
      
      // Set default code template based on language
      const templates = {
        python: '# Write your solution here\ndef solution():\n    pass',
        javascript: '// Write your solution here\nfunction solution() {\n    \n}',
        java: 'public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}',
        csharp: 'using System;\n\npublic class Solution {\n    public static void Main() {\n        // Write your solution here\n    }\n}',
        cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}',
        sql: '-- Write your SQL query here\nSELECT * FROM table_name;'
      };
      setCode(templates[language as keyof typeof templates] || '');
    }
  }, [challenge, language]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLanguageId = (lang: string) => {
    const languageMap = {
      python: 'python',
      javascript: 'javascript',
      java: 'java',
      csharp: 'csharp',
      cpp: 'cpp',
      sql: 'sql'
    };
    return languageMap[lang as keyof typeof languageMap] || 'python';
  };

  const runCode = async () => {
    if (!challenge || !code.trim()) {
      toast({
        title: "Error",
        description: "Please write some code before running",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setOutput('Running code...');

    // Simulate code execution
    setTimeout(() => {
      const mockResults = {
        passed: Math.floor(Math.random() * challenge.testCases.length) + 1,
        total: challenge.testCases.length
      };
      
      setTestResults(mockResults);
      setOutput(`Execution completed!\nTest cases passed: ${mockResults.passed}/${mockResults.total}`);
      
      if (currentUser) {
        const submission: Submission = {
          id: Date.now().toString(),
          candidateId: currentUser.id,
          challengeId,
          code,
          language,
          status: mockResults.passed === mockResults.total ? 'Accepted' : 'Wrong Answer',
          score: (mockResults.passed / mockResults.total) * 100,
          submissionTime: new Date(),
          executionTime: Math.random() * 1000
        };
        
        addSubmission(submission);
        
        toast({
          title: submission.status === 'Accepted' ? "Success!" : "Partial Success",
          description: `${mockResults.passed}/${mockResults.total} test cases passed`
        });
      }
      
      setIsRunning(false);
    }, 2000);
  };

  if (!challenge) {
    return <div>Challenge not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{challenge.title}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <Badge className={`${
                challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {challenge.difficulty}
              </Badge>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Problem Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{challenge.description}</p>
                
                <h4 className="font-semibold mt-6 mb-3">Test Cases:</h4>
                {challenge.testCases.map((testCase, index) => (
                  <div key={testCase.id} className="bg-gray-50 p-3 rounded mb-3">
                    <h5 className="font-medium">Example {index + 1}:</h5>
                    <div className="mt-2">
                      <p><strong>Input:</strong></p>
                      <pre className="bg-white p-2 rounded text-sm">{testCase.input}</pre>
                      <p className="mt-2"><strong>Output:</strong></p>
                      <pre className="bg-white p-2 rounded text-sm">{testCase.expectedOutput}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Code Editor</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-32">
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
                    <Button onClick={runCode} disabled={isRunning}>
                      <Play className="h-4 w-4 mr-2" />
                      {isRunning ? 'Running...' : 'Run Code'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Editor
                    height="400px"
                    language={getLanguageId(language)}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      automaticLayout: true
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Output</span>
                  {testResults.total > 0 && (
                    <div className="flex items-center space-x-2">
                      {testResults.passed === testResults.total ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="text-sm font-normal">
                        {testResults.passed}/{testResults.total} passed
                      </span>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap">
                  {output || 'Click "Run Code" to see output here...'}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
