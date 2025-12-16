"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFineTuneWizardStore } from "@/lib/store";
import { formatBytes } from "@/lib/utils";
import {
  Upload,
  File,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  X,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

interface ValidationResult {
  isValid: boolean;
  totalRows: number;
  estimatedTokens: number;
  errors: string[];
  warnings: string[];
  sampleRows: Record<string, string>[];
  detectedColumns: string[];
}

const COLUMN_MAPPINGS = [
  { value: "prompt", label: "Prompt / Instruction" },
  { value: "response", label: "Response / Output" },
  { value: "system", label: "System Prompt" },
  { value: "context", label: "Context / Input" },
  { value: "label", label: "Label" },
  { value: "other", label: "Other (ignore)" },
];

export function DatasetUploader() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});
  const { setDatasetId } = useFineTuneWizardStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.name.endsWith(".jsonl") ? "jsonl" : "csv",
      });
      simulateValidation(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".jsonl", ".json"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const simulateValidation = async (file: File) => {
    setIsValidating(true);
    // Simulate validation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock validation result
    const mockValidation: ValidationResult = {
      isValid: true,
      totalRows: 2547,
      estimatedTokens: 1250000,
      errors: [],
      warnings: [
        "15 rows exceed 2048 tokens and will be truncated",
        "3 rows have empty response fields",
      ],
      sampleRows: [
        {
          instruction: "Explain quantum computing in simple terms",
          input: "",
          output: "Quantum computing is a type of computation that uses quantum mechanics...",
        },
        {
          instruction: "Write a Python function to sort a list",
          input: "[3, 1, 4, 1, 5, 9, 2, 6]",
          output: "def sort_list(lst):\n    return sorted(lst)",
        },
        {
          instruction: "Translate to French",
          input: "Hello, how are you?",
          output: "Bonjour, comment allez-vous?",
        },
      ],
      detectedColumns: ["instruction", "input", "output"],
    };

    setValidation(mockValidation);
    setIsValidating(false);

    // Auto-map detected columns
    const autoMappings: Record<string, string> = {};
    mockValidation.detectedColumns.forEach((col) => {
      if (col === "instruction" || col === "prompt") {
        autoMappings[col] = "prompt";
      } else if (col === "output" || col === "response" || col === "completion") {
        autoMappings[col] = "response";
      } else if (col === "input" || col === "context") {
        autoMappings[col] = "context";
      } else if (col === "system") {
        autoMappings[col] = "system";
      }
    });
    setColumnMappings(autoMappings);

    // Set dataset ID to indicate upload complete
    setDatasetId("dataset-" + Date.now());
  };

  const removeFile = () => {
    setUploadedFile(null);
    setValidation(null);
    setColumnMappings({});
    setDatasetId(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">
            {isDragActive ? "Drop your file here" : "Drag & drop your dataset"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Supported formats: JSONL, CSV (max 100MB)
          </p>
          <Button variant="outline">Browse Files</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* File Info */}
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
            <div className="flex items-center gap-3">
              <File className="h-10 w-10 text-primary" />
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatBytes(uploadedFile.size)} · {uploadedFile.type.toUpperCase()}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={removeFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Validation Status */}
          {isValidating ? (
            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
              <span>Validating dataset...</span>
            </div>
          ) : validation ? (
            <div className="space-y-4">
              {/* Validation Summary */}
              <div
                className={cn(
                  "flex items-start gap-3 p-4 rounded-lg border",
                  validation.isValid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                )}
              >
                {validation.isValid ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div>
                  <h4 className="font-medium">
                    {validation.isValid ? "Dataset validated successfully" : "Validation failed"}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {validation.totalRows.toLocaleString()} rows ·{" "}
                    {(validation.estimatedTokens / 1000000).toFixed(2)}M estimated tokens
                  </p>
                </div>
              </div>

              {/* Warnings */}
              {validation.warnings.length > 0 && (
                <div className="p-4 rounded-lg border bg-yellow-50 border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Warnings</span>
                  </div>
                  <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                    {validation.warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Column Mapping */}
              <div>
                <h4 className="font-medium mb-3">Column Mapping</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Map your dataset columns to the training format
                </p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {validation.detectedColumns.map((column) => (
                    <div key={column}>
                      <Label htmlFor={`col-${column}`} className="text-sm">
                        {column}
                      </Label>
                      <Select
                        value={columnMappings[column] || ""}
                        onValueChange={(value) =>
                          setColumnMappings({ ...columnMappings, [column]: value })
                        }
                      >
                        <SelectTrigger id={`col-${column}`} className="mt-1">
                          <SelectValue placeholder="Select mapping" />
                        </SelectTrigger>
                        <SelectContent>
                          {COLUMN_MAPPINGS.map((mapping) => (
                            <SelectItem key={mapping.value} value={mapping.value}>
                              {mapping.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Preview */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Sample Preview</h4>
                  <Badge variant="secondary">
                    <Eye className="h-3 w-3 mr-1" />
                    First 3 rows
                  </Badge>
                </div>
                <div className="rounded-lg border overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {validation.detectedColumns.map((col) => (
                          <TableHead key={col} className="min-w-[200px]">
                            {col}
                            {columnMappings[col] && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {columnMappings[col]}
                              </Badge>
                            )}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {validation.sampleRows.map((row, i) => (
                        <TableRow key={i}>
                          {validation.detectedColumns.map((col) => (
                            <TableCell key={col} className="max-w-[300px]">
                              <p className="truncate text-sm">
                                {(row as Record<string, string>)[col] || "-"}
                              </p>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
