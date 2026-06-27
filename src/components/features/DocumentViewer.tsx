'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, FileText, Presentation, FileSpreadsheet, FileIcon, Maximize2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// =============================================================================
// Document Viewer — read-only, no download
// =============================================================================

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  documentTitle: string;
  fileType?: string;
}

/**
 * Get the embed URL for a document based on its file type.
 * - PDFs: Use browser's built-in PDF viewer via iframe
 * - PPTX/DOCX/XLSX: Use Google Docs Viewer (embedded, read-only)
 */
function getEmbedUrl(url: string, fileType: string): string {
  const ext = fileType?.toLowerCase() || '';

  // PDF — browser can render directly
  if (ext === 'pdf') {
    return url;
  }

  // Office documents (PPTX, DOCX, XLSX, PPT, DOC, XLS)
  // Use Google Docs Viewer for embedded read-only rendering
  if (['pptx', 'docx', 'xlsx', 'ppt', 'doc', 'xls'].includes(ext)) {
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
  }

  // Fallback: try Google Docs Viewer for unknown types
  return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
}

function getFileTypeLabel(ext: string): string {
  switch (ext) {
    case 'pptx': case 'ppt': return 'PowerPoint';
    case 'docx': case 'doc': return 'Word Document';
    case 'pdf': return 'PDF Document';
    case 'xlsx': case 'xls': return 'Excel Spreadsheet';
    default: return ext.toUpperCase() || 'Document';
  }
}

export function DocumentViewer({
  isOpen,
  onClose,
  documentUrl,
  documentTitle,
  fileType = '',
}: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const embedUrl = getEmbedUrl(documentUrl, fileType);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-[95vw] h-[90vh] max-w-6xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-700 to-emerald-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900 truncate">
                    {documentTitle}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    {fileType && (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-1.5 py-0">
                        .{fileType}
                      </Badge>
                    )}
                    <span className="text-[10px] text-slate-400">
                      {getFileTypeLabel(fileType)} · Read Only
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-200 shrink-0"
                aria-label="Close document viewer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Document iframe */}
            <div className="flex-1 relative bg-slate-100">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                  <div className="text-center">
                    <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-4" />
                    <p className="text-sm text-slate-500">Loading document...</p>
                    <p className="text-xs text-slate-400 mt-1">
                      This may take a moment for large files
                    </p>
                  </div>
                </div>
              )}
              <iframe
                src={embedUrl}
                title={documentTitle}
                className="w-full h-full border-0"
                onLoad={() => setIsLoading(false)}
                sandbox="allow-scripts allow-same-origin allow-popups"
                style={{ pointerEvents: 'auto' }}
              />
            </div>

            {/* Footer bar */}
            <div className="flex items-center justify-between px-5 py-2.5 border-t border-slate-200 bg-slate-50 shrink-0">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Eye className="w-3.5 h-3.5" />
                <span>View Only — Downloading is not available</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs rounded-lg"
              >
                Close Viewer
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// =============================================================================
// View Button — reusable trigger for the document viewer
// =============================================================================

interface ViewDocumentButtonProps {
  documentUrl: string;
  documentTitle: string;
  fileType?: string;
  /** Size variant: 'sm' for compact cards, 'default' for larger cards */
  size?: 'sm' | 'default';
  /** Show as icon-only button */
  iconOnly?: boolean;
  className?: string;
}

export function ViewDocumentButton({
  documentUrl,
  documentTitle,
  fileType = '',
  size = 'default',
  iconOnly = false,
  className = '',
}: ViewDocumentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  }, []);

  if (iconOnly) {
    return (
      <>
        <button
          onClick={handleOpen}
          className={`shrink-0 w-9 h-9 rounded-lg bg-[#f0fdf4] flex items-center justify-center text-[#059669] hover:bg-[#065f46] hover:text-white transition-colors ${className}`}
          aria-label={`View ${documentTitle}`}
          title="View document (read only)"
        >
          <Eye className="w-4 h-4" />
        </button>
        <DocumentViewer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          documentUrl={documentUrl}
          documentTitle={documentTitle}
          fileType={fileType}
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className={`inline-flex items-center gap-2 text-sm font-medium text-[#059669] hover:text-[#047857] transition-colors ${className}`}
        title="View document (read only)"
      >
        <Eye className="w-4 h-4" />
        {size === 'sm' ? 'View' : `View ${fileType ? fileType.toUpperCase() : 'Document'}`}
      </button>
      <DocumentViewer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        documentUrl={documentUrl}
        documentTitle={documentTitle}
        fileType={fileType}
      />
    </>
  );
}
