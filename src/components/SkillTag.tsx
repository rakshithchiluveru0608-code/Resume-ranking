import { cn } from "@/lib/utils";

interface SkillTagProps {
  skill: string;
  variant: "matched" | "missing" | "recommended";
}

/** Colored chip for displaying skills */
const SkillTag = ({ skill, variant }: SkillTagProps) => {
  const styles = {
    matched: "bg-success/10 text-success border-success/20",
    missing: "bg-destructive/10 text-destructive border-destructive/20",
    recommended: "bg-info/10 text-info border-info/20",
  };

  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border", styles[variant])}>
      {skill}
    </span>
  );
};

export default SkillTag;
