import { useState } from "react";
import { mockBiasMetrics } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Switch } from "@/components/ui/switch";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScoreBar from "@/components/ScoreBar";

const BiasAudit = () => {
  const [biasRemoved, setBiasRemoved] = useState(false);

  const comparisonData = mockBiasMetrics.map((m) => ({
    category: m.category,
    "Original Score": m.originalScore,
    "Bias-Neutral Score": m.neutralScore,
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-10 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Bias Audit</h1>
            <p className="text-muted-foreground mt-1">Detect and understand potential biases in resume scoring.</p>
          </div>

          {/* Disclaimer */}
          <div className="border rounded-lg p-4 bg-primary/5 border-primary/20 mb-8 flex gap-3">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Ethical AI Commitment</p>
              <p className="text-muted-foreground mt-1">
                Our bias detection system is designed to promote fairness, not to discriminate. It identifies potential scoring influences from factors unrelated to job performance — such as university prestige or employer brand — so you can make informed hiring decisions.
              </p>
            </div>
          </div>

          {/* Toggle */}
          <div className="border rounded-lg p-6 bg-card mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-foreground">Recalculate with Bias Removed</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  View scores with identified biases neutralized.
                </p>
              </div>
              <Switch checked={biasRemoved} onCheckedChange={setBiasRemoved} />
            </div>
          </div>

          {/* Bias Metrics */}
          <div className="space-y-4 mb-8">
            {mockBiasMetrics.map((metric) => (
              <div key={metric.category} className="border rounded-lg p-6 bg-card space-y-3">
                <div className="flex items-center gap-2">
                  {metric.influence > 0 ? (
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-success" />
                  )}
                  <h3 className="font-semibold text-foreground">{metric.category}</h3>
                  {metric.influence > 0 && (
                    <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full">
                      {metric.influence}% influence
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{metric.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <ScoreBar label="Original Score" value={biasRemoved ? metric.neutralScore : metric.originalScore} />
                  <ScoreBar label="Bias-Neutral Score" value={metric.neutralScore} />
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Chart */}
          <section className="border rounded-lg p-6 bg-card">
            <h2 className="font-semibold text-foreground mb-4">Score Comparison</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Original Score" fill="hsl(220, 72%, 50%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Bias-Neutral Score" fill="hsl(175, 60%, 42%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BiasAudit;
