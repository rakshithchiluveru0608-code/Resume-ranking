import { useParams, Link } from "react-router-dom";
import { useResults } from "@/lib/resultsContext";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScoreRing from "@/components/ScoreRing";
import ScoreBar from "@/components/ScoreBar";
import SkillTag from "@/components/SkillTag";
import { Badge } from "@/components/ui/badge";

const ResumeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { candidates, jobRole } = useResults();
  const candidate = candidates.find((c) => c.id === id);

  if (!candidate) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">Candidate not found</h2>
            <Link to="/results" className="text-primary text-sm mt-2 inline-block hover:underline">
              ← Back to results
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-10 max-w-3xl">
          <Link
            to="/results"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to results
          </Link>

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <ScoreRing score={candidate.score} label="Overall Match" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">{candidate.filename}</h1>
                <Badge variant="secondary">{candidate.experienceLevel}</Badge>
              </div>
              {jobRole && (
                <p className="text-muted-foreground text-sm mt-1">
                  Analyzed for: <span className="font-medium">{jobRole}</span>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Score Breakdown */}
            <section className="border rounded-lg p-6 bg-card space-y-4">
              <h2 className="font-semibold text-foreground">Score Breakdown</h2>
              <ScoreBar label="Match Score" value={candidate.score} />
              <ScoreBar label="Skill Match" value={candidate.skillMatch} />
              <ScoreBar label="Resume Quality" value={candidate.resume_quality_score * 10} />
            </section>

            {/* Skill Analysis */}
            <section className="border rounded-lg p-6 bg-card space-y-4">
              <h2 className="font-semibold text-foreground">Skill Analysis</h2>
              {candidate.matched_skills.length > 0 && (
                <div>
                  <h3 className="text-sm text-muted-foreground mb-2">Matched Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.matched_skills.map((s) => (
                      <SkillTag key={s} skill={s} variant="matched" />
                    ))}
                  </div>
                </div>
              )}
              {candidate.missing_skills.length > 0 && (
                <div>
                  <h3 className="text-sm text-muted-foreground mb-2">Missing Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.missing_skills.map((s) => (
                      <SkillTag key={s} skill={s} variant="missing" />
                    ))}
                  </div>
                </div>
              )}
              {candidate.matched_skills.length === 0 && candidate.missing_skills.length === 0 && (
                <p className="text-sm text-muted-foreground">No specific skills detected for this job role.</p>
              )}
            </section>

            {/* Resume Quality */}
            <section className="border rounded-lg p-6 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Resume Quality</h2>
                <span className="text-lg font-bold text-foreground">{candidate.resume_quality_score}/10</span>
              </div>
              {candidate.suggestions.length > 0 && (
                <ul className="space-y-2">
                  {candidate.suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResumeDetail;
