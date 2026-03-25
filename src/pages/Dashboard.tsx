import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FileUpload from "@/components/FileUpload";
import { useResults, mapApiResponse } from "@/lib/resultsContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { setCandidates } = useResults();

  const [jdText, setJdText] = useState("");
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [jdFile, setJdFile] = useState<File[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const canAnalyze = resumeFiles.length > 0 && (jdText.trim().length > 0 || jdFile.length > 0);

  const handleAnalyze = async () => {
    if (!canAnalyze) {
      setError("Please upload at least one resume and provide a job description.");
      return;
    }
    setError("");
    setAnalyzing(true);

    try {
      // Resolve job role text — either typed or from uploaded file
      let jobRole = jdText.trim();
      if (!jobRole && jdFile.length > 0) {
        jobRole = await jdFile[0].text();
      }

      const formData = new FormData();
      formData.append("jobRole", jobRole);

      if (resumeFiles.length === 1) {
        // Single resume → /api/analyze
        formData.append("resume", resumeFiles[0]);
        const res = await fetch("/api/analyze", { method: "POST", body: formData });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `Server error ${res.status}`);
        }
        const data = await res.json();
        // Wrap single result in array so Results page is uniform
        setCandidates(
          mapApiResponse([{ ...data, filename: resumeFiles[0].name }]),
          jobRole
        );
      } else {
        // Multiple resumes → /api/rank
        resumeFiles.forEach((f) => formData.append("resumes", f));
        const res = await fetch("/api/rank", { method: "POST", body: formData });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `Server error ${res.status}`);
        }
        const data = await res.json();
        setCandidates(mapApiResponse(data.rankings ?? []), jobRole);
      }

      navigate("/results");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Is the backend running?");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-10 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Resume Ranking Dashboard</h1>
            <p className="text-muted-foreground mt-1">Upload resumes and a job description to get AI-powered rankings.</p>
          </div>

          <div className="space-y-8">
            {/* Resume Upload */}
            <div className="border rounded-lg p-6 bg-card">
              <FileUpload
                label="Upload Resumes"
                accept=".pdf,.doc,.docx"
                multiple
                onFilesChange={setResumeFiles}
              />
            </div>

            {/* Job Description */}
            <div className="border rounded-lg p-6 bg-card space-y-4">
              <h3 className="text-sm font-medium text-foreground">Job Description</h3>
              <Textarea
                placeholder="Paste the job description here..."
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or upload a file</span>
                </div>
              </div>
              <FileUpload label="" accept=".pdf,.doc,.docx,.txt" onFilesChange={setJdFile} />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Analyze Button */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleAnalyze}
              disabled={!canAnalyze || analyzing}
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze & Rank
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
