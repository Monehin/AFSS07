import React, { useState, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Download } from "lucide-react";
import useMediaSizes from "@/hooks/useMediaSizes";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./Guidelines.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDF_FILE = "/documents/guidelines.pdf";

export default function Guidelines() {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { isMobile, isTablet, isDesktop } = useMediaSizes();

  const pageWidth = useMemo(() => {
    if (isMobile) return 300;
    if (isTablet) return 750;
    return 650;
  }, [isMobile, isTablet]);

  // Handle successful PDF document load.
  const handleDocumentLoadSuccess = ({
    numPages,
  }: {
    numPages: number;
  }): void => {
    setNumPages(numPages);
  };

  const handlePrevPage = (): void => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = (): void => {
    if (numPages && currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="relative flex-col place-items-center mt-6 w-lvw overflow-x-hidden">
      <h1 className="text-2xl font-bold mb-6">AFSS07 Guidelines</h1>

      <div className="m-4">
        <a
          href={PDF_FILE}
          download
          className="flex items-center space-x-2 text-blue-500 cursor-pointer"
        >
          <span>Download Guidelines</span>
          <Download className="w-5 h-5" />
        </a>
      </div>

      <div className="flex justify-center items-center w-full h-full">
        {isDesktop && numPages && (
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="cursor-pointer h-20 flex items-center p-2 md:p-4 bg-blue-500 hover:bg-blue-300 text-white rounded-s-md"
          >
            Back
          </button>
        )}

        <Document
          file={PDF_FILE}
          onLoadSuccess={handleDocumentLoadSuccess}
          onItemClick={() => setCurrentPage((prev) => prev + 1)}
        >
          <Page pageNumber={currentPage} width={pageWidth} />
        </Document>

        {isDesktop && numPages && (
          <button
            onClick={handleNextPage}
            disabled={currentPage === numPages}
            className="cursor-pointer h-20 flex items-center p-2 md:p-4 bg-blue-500 hover:bg-blue-300 text-white rounded-e-md"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
