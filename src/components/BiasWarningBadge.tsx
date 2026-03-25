import { AlertTriangle } from "lucide-react";

interface BiasWarningBadgeProps {
  flag: string;
}

/** Badge indicating a detected bias flag */
const BiasWarningBadge = ({ flag }: BiasWarningBadgeProps) => (
  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-warning/10 text-warning border border-warning/20 text-xs font-medium">
    <AlertTriangle className="h-3 w-3" />
    {flag}
  </span>
);

export default BiasWarningBadge;
