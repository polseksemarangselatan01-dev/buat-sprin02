import React from 'react';
import { FileDown, Menu, Printer, Save } from 'lucide-react';
import { QuickWinsEmblem } from './PolriEmblems';

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
  onSaveToArchive: () => void;
  onExportWord: () => void;
  onPrint: () => void;
  completionPercent: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onToggleSidebar,
  onSaveToArchive,
  onExportWord,
  onPrint,
  completionPercent,
}) => {

  return (
    <header className="no-print sticky top-0 z-30 bg-[#1B150F] border-b border-[#3A3024]">
      <div className="px-4 lg:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Menu Button + Emblem + Title */}
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Buka atau tutup menu navigasi"
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#4A3D2C] bg-[#241C14] text-[#F5F0E6] hover:border-[#D4A017] hover:text-[#F4C94D] transition-colors shrink-0 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <QuickWinsEmblem className="w-10 h-11 shrink-0" />

          <div className="min-w-0">
            <h1 className="font-display text-lg lg:text-xl font-bold tracking-wide text-[#F7F2E8] leading-tight uppercase truncate">
              POLSEK SEMARANG SELATAN
            </h1>
            <p className="text-xs text-[#B5A894] truncate mt-0.5">
              POLRESTABES SEMARANG · Jalan Lamper Tengah XIV Semarang 50248
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2.5 ml-auto">
          <button
            type="button"
            onClick={onSaveToArchive}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#4A3D2C] bg-[#241C14] hover:bg-[#2F251A] hover:border-[#D4A017]/60 text-xs font-semibold text-[#F5F0E6] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[#D4A017]" />
            <span>Simpan Arsip</span>
          </button>

          <button
            type="button"
            onClick={onExportWord}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#4A3D2C] bg-[#241C14] hover:bg-[#2F251A] hover:border-[#D4A017]/60 text-xs font-semibold text-[#F5F0E6] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-[#D4A017]" />
            <span>Unduh .DOCX</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4A017] hover:bg-[#E5B022] text-xs font-bold text-[#14100C] transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* Gold Completion Accent Bar matching Image 1 */}
      <div className="h-[3px] w-full bg-[#2E251B]">
        <div
          className="h-full bg-[#D4A017] transition-all duration-300"
          style={{ width: `${Math.max(12, Math.min(100, completionPercent))}%` }}
        />
      </div>
    </header>
  );
};
