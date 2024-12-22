// src/app/interfaces/score.interfaces.ts
export interface Score {
    id: number;
    user_id: number;
    user_name?: string;
    score: number;
    difficulty: string;
    created_at: string;
    user?: {
      id: number;
      name: string;
    };
  }
  
  export interface TopScores {
    easy: Score[];
    medium: Score[];
    hard: Score[];
  }