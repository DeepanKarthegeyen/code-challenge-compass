
import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Code, Play, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ChallengeList: React.FC = () => {
  const { challenges, currentUser } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartChallenge = (challengeId: string) => {
    navigate(`/challenge/${challengeId}`);
  };

  const handleShareChallenge = (challengeId: string) => {
    const challengeUrl = `${window.location.origin}/challenge/${challengeId}`;
    navigator.clipboard.writeText(challengeUrl);
    toast({
      title: "Challenge Link Copied!",
      description: "Share this link with candidates to give them access to the challenge."
    });
  };

  if (challenges.length === 0) {
    return (
      <div className="text-center py-12">
        <Code className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges yet</h3>
        <p className="text-gray-600">
          {currentUser?.role === 'admin' 
            ? 'Create your first coding challenge to get started'
            : 'No challenges have been assigned to you yet'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {challenges.map((challenge) => (
        <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">{challenge.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {challenge.description}
                </CardDescription>
              </div>
              <Badge className={getDifficultyColor(challenge.difficulty)}>
                {challenge.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {challenge.timeLimit}m
              </div>
              <div className="flex items-center">
                <Code className="h-4 w-4 mr-1" />
                {challenge.language.charAt(0).toUpperCase() + challenge.language.slice(1)}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={() => handleStartChallenge(challenge.id)}
                className="flex-1"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Challenge
              </Button>
              {currentUser?.role === 'admin' && (
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleShareChallenge(challenge.id)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ChallengeList;
