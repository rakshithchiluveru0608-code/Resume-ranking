import { createContext, useContext, useState, ReactNode } from "react";

export interface RankedCandidate {
  id: string;
  filename: string;
  score: number;               // match score 0-100
  matched_skills: string[];
  missing_skills: string[];
  resume_quality_score: number;
  suggestions: string[];
  // derived / display helpers
  skillMatch: number;          // same as score for now
  experienceLevel: string;     // inferred from quality score
}

interface ResultsContextValue {
  candidates: RankedCandidate[];
  jobRole: string;
  setCandidates: (c: RankedCandidate[], jobRole: string) => void;
}

const ResultsContext = createContext<ResultsContextValue>({
  candidates: [],
  jobRole: "",
  setCandidates: () => {},
});

export function ResultsProvider({ children }: { children: ReactNode }) {
  const [candidates, setCandidatesState] = useState<RankedCandidate[]>([]);
  const [jobRole, setJobRole] = useState("");

  const setCandidates = (c: RankedCandidate[], role: string) => {
    setCandidatesState(c);
    setJobRole(role);
  };

  return (
    <ResultsContext.Provider value={{ candidates, jobRole, setCandidates }}>
      {children}
    </ResultsContext.Provider>
  );
}

export function useResults() {
  return useContext(ResultsContext);
}

/** Map raw API /rank response into RankedCandidate[] */
export function mapApiResponse(rankings: any[]): RankedCandidate[] {
  return rankings.map((r, idx) => ({
    id: r.id ?? String(idx),
    filename: r.filename ?? `Resume ${idx + 1}`,
    score: r.score ?? 0,
    matched_skills: r.matched_skills ?? [],
    missing_skills: r.missing_skills ?? [],
    resume_quality_score: r.resume_quality_score ?? 0,
    suggestions: r.suggestions ?? [],
    skillMatch: Math.round((r.matched_skills?.length / Math.max((r.matched_skills?.length + r.missing_skills?.length), 1)) * 100),
    experienceLevel: r.resume_quality_score >= 8 ? "Senior" : r.resume_quality_score >= 5 ? "Mid" : "Junior",
  }));
}
