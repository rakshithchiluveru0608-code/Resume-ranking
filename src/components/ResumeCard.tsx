import { Link } from "react-router-dom";
import { ChevronRight, FileText } from "lucide-react";
import { RankedCandidate } from "@/lib/resultsContext";
import ScoreBar from "@/components/ScoreBar";
import { Badge } from "@/components/ui/badge";

interface ResumeCardProps {
  candidate: RankedCandidate;
}

const ResumeCard = ({ candidate }: ResumeCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <Link
      to={`/results/${candidate.id}`}
      className="block border rounded-lg p-4 bg-card hover:shadow-md transition-shadow group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {candidate.filename}
            </h3>
            <Badge variant="secondary" className="text-xs">{candidate.experienceLevel}</Badge>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <ScoreBar label="Match" value={candidate.score} />
            <ScoreBar label="Skills" value={candidate.skillMatch} />
          </div>

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {candidate.missing_skills.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {candidate.missing_skills.length} missing skill{candidate.missing_skills.length !== 1 ? "s" : ""}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              Quality: {candidate.resume_quality_score}/10
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-2xl font-bold ${getScoreColor(candidate.score)}`}>
            {candidate.score}
          </span>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Score</div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ResumeCard;
