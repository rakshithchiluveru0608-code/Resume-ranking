import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

const Footer = () => (
  <footer className="border-t bg-secondary/30">
    <div className="container py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <FileText className="h-5 w-5 text-primary" />
            <span>Resume Ranker</span>
          </div>
          <p className="text-sm text-muted-foreground">
            AI-powered resume ranking that's fair, transparent, and intelligent.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Product</h4>
          <nav className="flex flex-col gap-2">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            <Link to="/skill-gap" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Skill Gap Analysis</Link>
            <Link to="/bias-audit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Bias Audit</Link>
          </nav>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Company</h4>
          <nav className="flex flex-col gap-2">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
          </nav>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Contact</h4>
          <nav className="flex flex-col gap-2">
            <a href="mailto:hello@resumeranker.ai" className="text-sm text-muted-foreground hover:text-foreground transition-colors">hello@resumeranker.ai</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Support Center</a>
          </nav>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Resume Ranker. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
