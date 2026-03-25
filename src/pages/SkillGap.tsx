import { useState } from "react";
import { mockSkillGapData, mockRadarData } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FileUpload from "@/components/FileUpload";

const priorityColors: Record<string, string> = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Low: "bg-success/10 text-success border-success/20",
};

const SkillGap = () => {
  const [targetRole, setTargetRole] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-10 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Skill Gap Analysis</h1>
            <p className="text-muted-foreground mt-1">Identify missing skills for a target role and get learning recommendations.</p>
          </div>

          {/* Input Section */}
          <div className="border rounded-lg p-6 bg-card space-y-4 mb-8">
            <FileUpload label="Upload Resume" accept=".pdf,.doc,.docx" />
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Target Role</label>
              <Input
                placeholder="e.g., Senior ML Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
            <Button onClick={handleAnalyze} disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" /> Analyze Skills</>}
            </Button>
          </div>

          {!analyzed && !loading && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg font-medium">Upload a resume and enter a target role to begin</p>
            </div>
          )}

          {analyzed && (
            <div className="space-y-8 animate-fade-in">
              {/* Skill Gap Table */}
              <section className="border rounded-lg p-6 bg-card">
                <h2 className="font-semibold text-foreground mb-4">Missing Skills & Priorities</h2>
                <div className="space-y-3">
                  {mockSkillGapData
                    .filter((s) => s.current < s.required)
                    .map((skill) => (
                      <div key={skill.skill} className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-foreground">{skill.skill}</span>
                          <Badge variant="outline" className={priorityColors[skill.priority]}>
                            {skill.priority}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {skill.current}% / {skill.required}% required
                        </span>
                      </div>
                    ))}
                </div>
              </section>

              {/* Learning Recommendations */}
              <section className="border rounded-lg p-6 bg-card">
                <h2 className="font-semibold text-foreground mb-4">Learning Recommendations</h2>
                <div className="space-y-3">
                  {[
                    { skill: "NLP", resource: "Stanford CS224N — Natural Language Processing", type: "Course" },
                    { skill: "TensorFlow", resource: "TensorFlow Developer Certificate Program", type: "Certification" },
                    { skill: "Docker", resource: "Docker Mastery — Udemy", type: "Course" },
                    { skill: "Kubernetes", resource: "Kubernetes the Hard Way — GitHub", type: "Tutorial" },
                  ].map((rec) => (
                    <div key={rec.skill} className="flex items-center justify-between p-3 rounded-md border">
                      <div>
                        <span className="text-sm font-medium text-foreground">{rec.skill}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{rec.resource}</p>
                      </div>
                      <Badge variant="secondary">{rec.type}</Badge>
                    </div>
                  ))}
                </div>
              </section>

              {/* Bar Chart */}
              <section className="border rounded-lg p-6 bg-card">
                <h2 className="font-semibold text-foreground mb-4">Skill Coverage</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockSkillGapData} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <YAxis dataKey="skill" type="category" tick={{ fontSize: 12 }} width={90} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="current" fill="hsl(220, 72%, 50%)" name="Current Level" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="required" fill="hsl(220, 14%, 80%)" name="Required Level" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Radar Chart */}
              <section className="border rounded-lg p-6 bg-card">
                <h2 className="font-semibold text-foreground mb-4">Role Readiness</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={mockRadarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar name="Current" dataKey="value" stroke="hsl(220, 72%, 50%)" fill="hsl(220, 72%, 50%)" fillOpacity={0.2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SkillGap;
