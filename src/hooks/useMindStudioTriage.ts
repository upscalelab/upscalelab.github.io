import { useState } from 'react';

interface TriageInput {
  companyName: string;
  description: string;
  stage: string;
  teamSize?: number;
  fundingRaised?: number;
}

interface TriageResult {
  score: number; // 0-100
  recommendation: 'approve' | 'review' | 'reject';
  reasoning: string;
  suggestedStage: string;
  confidence: number; // 70-90%
}

export function useMindStudioTriage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTriage = async (input: TriageInput): Promise<TriageResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/triage/mindstudio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error('Erro ao executar triage');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    runTriage,
    isLoading,
    error,
  };
}
