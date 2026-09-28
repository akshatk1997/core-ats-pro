import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { StructuredResume } from '@/types';
import { parseRawResumeText } from '@/lib/resumeParser';
import { sampleStructuredResume } from '@/lib/mockData';

interface FileUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (newResumeContent: StructuredResume, fileName: string) => void;
}

export const FileUploaderModal: React.FC<FileUploaderModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);

  const stages = [
    'Reading document text stream...',
    'Extracting contact nodes & headers...',
    'Identifying work experience & skills...',
    'Analyzing ATS structure & readability...',
    'Evaluating impact metrics & action verbs...'
  ];

  const processFile = (file: File) => {
    setIsUploading(true);
    setStageIndex(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string || '';
      
      const interval = setInterval(() => {
        setStageIndex((prev) => {
          if (prev < stages.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(() => {
              setIsUploading(false);
              const parsed = text.length > 50 ? parseRawResumeText(text) : sampleStructuredResume;
              onUploadComplete(parsed, file.name);
              onClose();
            }, 500);
            return prev;
          }
        });
      }, 400);
    };

    reader.readAsText(file);
  };

  const handleSimulatedUpload = (fileName: string) => {
    setIsUploading(true);
    setStageIndex(0);

    const interval = setInterval(() => {
      setStageIndex((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            onUploadComplete(sampleStructuredResume, fileName);
            onClose();
          }, 500);
          return prev;
        }
      });
    }, 400);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Resume Document"
      subtitle="Supported formats: PDF, DOCX, TXT, JSON • Max 10MB"
    >
      {!isUploading ? (
        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 rounded-2xl cursor-pointer bg-slate-50/50 dark:bg-slate-900/50 transition-all text-center">
            <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Drop your resume file here, or browse
            </span>
            <span className="text-[11px] text-slate-400 mt-1">
              PDF, DOCX, TXT • Max 10MB
            </span>
            <input
              type="file"
              accept=".pdf,.docx,.txt,.json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <div className="text-center pt-2">
            <button
              onClick={() => handleSimulatedUpload('Uploaded_Project_Manager_Resume.pdf')}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
            >
              Use Sample Project Manager Resume
            </button>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center space-y-4 animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 mx-auto">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              ATS Parser Running
            </h4>
            <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold mt-1">
              ✓ {stages[stageIndex]}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};
