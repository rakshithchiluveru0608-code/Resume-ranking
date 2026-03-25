import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, FileSearch, BarChart3, Shield, Sparkles, ArrowRight, Brain, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const steps = [
  { icon: Upload, label: "Upload Resume", description: "Upload one or multiple resumes in PDF or DOC format" },
  { icon: FileSearch, label: "Upload JD", description: "Paste or upload the target job description" },
  { icon: Brain, label: "AI Matching", description: "Semantic analysis compares skills, context, and intent" },
  { icon: Eye, label: "Explainable Score", description: "Transparent scoring with full breakdown" },
];

const features = [
  { icon: Sparkles, title: "Semantic Matching", description: "Goes beyond keywords — understands context, synonyms, and related experience using embedding-based similarity." },
  { icon: BarChart3, title: "Skill Gap Analysis", description: "Identifies missing skills with priority levels and learning recommendations to help candidates grow." },
  { icon: Shield, title: "Bias Audit", description: "Detects and flags college name bias, company brand influence, and gender-coded language in scoring." },
  { icon: Eye, title: "Explainable Scoring", description: "Every score comes with a full breakdown — which sections matched, why, and what's missing." },
];


const Index = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />

    {/* Hero */}
    <section className="border-b">
      <div className="container py-20 md:py-28 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
          AI-Powered Resume Ranking.{" "}
          <span className="text-primary">Fair. Transparent. Intelligent.</span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
          Rank resumes using semantic matching, not just keywords. Detect hidden biases, analyze skill gaps, and understand exactly why each candidate scored the way they did.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link to="/dashboard">
              Rank Resumes <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/skill-gap">Analyze Skill Gaps</Link>
          </Button>
        </div>
      </div>
    </section>

    {/* Workflow Steps */}
    <section className="border-b bg-secondary/30">
      <div className="container py-16">
        <h2 className="text-2xl font-bold text-center text-foreground mb-10">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-lg bg-card border animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-xs font-semibold text-primary mb-1">Step {i + 1}</div>
              <h3 className="font-semibold text-foreground">{step.label}</h3>
              <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="border-b bg-secondary/30">
      <div className="container py-16">
        <h2 className="text-2xl font-bold text-center text-foreground mb-10">Key Features</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <div key={i} className="p-6 rounded-lg bg-card border space-y-3 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                <feat.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{feat.title}</h3>
              <p className="text-sm text-muted-foreground">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="border-b">
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-3">Ready to rank smarter?</h2>
        <p className="text-muted-foreground mb-6">Start analyzing resumes with AI-powered fairness and transparency.</p>
        <Button size="lg" asChild>
          <Link to="/dashboard">
            Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>

    <Footer />
  </div>
);

export default Index;
