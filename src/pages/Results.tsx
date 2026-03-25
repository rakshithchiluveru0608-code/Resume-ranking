import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useResults } from "@/lib/resultsContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResumeCard from "@/components/ResumeCard";

const Results = () => {
  const navigate = useNavigate();
  const { candidates, jobRole } = useResults();
  const [sortBy, setSortBy] = useState("score");
  const [filterExp, setFilterExp] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = [...candidates];
    if (filterExp !== "all") list = list.filter((c) => c.experienceLevel === filterExp);
    if (search) list = list.filter((c) => c.filename.toLowerCase().includes(search.toLowerCase()));
    list.sort((a, b) => {
      if (sortBy === "score") return b.score - a.score;
      if (sortBy === "skills") return b.skillMatch - a.skillMatch;
      return a.missing_skills.length - b.missing_skills.length;
    });
    return list;
  }, [candidates, sortBy, filterExp, search]);

  // No results yet — send back to dashboard
  if (candidates.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-lg font-medium text-foreground">No results yet.</p>
            <p className="text-sm text-muted-foreground">Upload resumes and a job description first.</p>
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
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
          <div className="mb-8">
            <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-1" /> New Analysis
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Ranked Resumes</h1>
            <p className="text-muted-foreground mt-1">
              {candidates.length} candidate{candidates.length !== 1 ? "s" : ""} analyzed for:{" "}
              <span className="font-medium text-foreground">{jobRole}</span>
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by filename..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Match Score</SelectItem>
                <SelectItem value="skills">Skill Match</SelectItem>
                <SelectItem value="gaps">Fewest Gaps</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterExp} onValueChange={setFilterExp}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Junior">Junior</SelectItem>
                <SelectItem value="Mid">Mid</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results List */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg font-medium">No candidates match your filters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((candidate) => (
                <ResumeCard key={candidate.id} candidate={candidate} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
