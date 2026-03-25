import { Upload, FileText, X } from "lucide-react";
import { useState, useCallback } from "react";

interface FileUploadProps {
  label: string;
  accept?: string;
  multiple?: boolean;
  onFilesChange?: (files: File[]) => void;
}

const FileUpload = ({ label, accept = ".pdf,.doc,.docx", multiple = false, onFilesChange }: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const fileArray = Array.from(newFiles);
    const updated = multiple ? [...files, ...fileArray] : fileArray;
    setFiles(updated);
    onFilesChange?.(updated);
  }, [files, multiple, onFilesChange]);

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange?.(updated);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = accept;
          input.multiple = multiple;
          input.onchange = (e) => handleFiles((e.target as HTMLInputElement).files);
          input.click();
        }}
      >
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">
          Drag & drop or <span className="text-primary font-medium">browse files</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {accept.replace(/\./g, "").toUpperCase().replace(/,/g, ", ")} files supported
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-md bg-secondary text-sm">
              <FileText className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate text-foreground flex-1">{file.name}</span>
              <span className="text-muted-foreground text-xs shrink-0">
                {(file.size / 1024).toFixed(0)} KB
              </span>
              <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
