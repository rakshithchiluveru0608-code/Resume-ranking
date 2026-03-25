import { Progress } from "@/components/ui/progress";

interface ScoreBarProps {
  label: string;
  value: number;
  maxValue?: number;
}

/** Horizontal bar for showing a score/percentage */
const ScoreBar = ({ label, value, maxValue = 100 }: ScoreBarProps) => {
  const percentage = (value / maxValue) * 100;

  const getColor = () => {
    if (percentage >= 80) return "[&>div]:bg-success";
    if (percentage >= 60) return "[&>div]:bg-warning";
    return "[&>div]:bg-destructive";
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground font-medium">{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <Progress value={percentage} className={`h-2 ${getColor()}`} />
    </div>
  );
};

export default ScoreBar;
