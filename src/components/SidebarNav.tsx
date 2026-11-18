import React from 'react';
import {
  Archive,
  FilePlus2,
  FileText,
  RotateCcw,
  Stamp,
  Users,
  X,
} from 'lucide-react';
import { AppView } from '../types/sprin';

interface SidebarNavProps {
  isOpen: boolean;
  onCloseMobile: () => void;
  activeView: AppView;
  activeEditorSection?: string;
  onSelectView: (view: AppView) => void;
  onOpenTtdMenu: () => void;
  archiveCount: number;
  rosterCount: number;
  activeDocNumber: string;
  useLampiran: boolean;
  onNewBlankSprin: () => void;
  onLoadReferenceTemplate: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  isOpen,
  onCloseMobile,
  activeView,
  activeEditorSection,
  onSelectView,
  onOpenTtdMenu,
  archiveCount,
  rosterCount,
  activeDocNumber,
  useLampiran,
  onNewBlankSprin,
  onLoadReferenceTemplate,
}) => {
  const navItems: { id: AppView; label: string; count?: number; icon: React.ReactNode }[] = [
    {
      id: 'editor',
      label: 'Editor & Pratinjau',
      icon: <FileText className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'arsip',
      label: 'Arsip Surat Perintah',
      count: archiveCount,
      icon: <Archive className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'personel',
      label: 'Database Personel',
      count: rosterCount,
      icon: <Users className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="no-print fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`no-print fixed lg:static inset-y-0 left-0 z-50 w-[256px] shrink-0 bg-[#19140E] border-r border-[#3A3024] flex flex-col transition-transform duration-200 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
        }`}
      >
        {/* Mobile Drawer Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#3A3024] lg:hidden">
          <span className="font-display text-sm tracking-wider text-[#F5F0E6] uppercase">
            Menu Administrasi
          </span>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Tutup menu"
            className="p-1.5 rounded-md text-[#B5A894] hover:text-[#F5F0E6] hover:bg-[#2A2218] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="p-3.5 space-y-1">
          <div className="px-2.5 pb-1.5 text-[11px] font-semibold tracking-wider text-[#8C7E69] uppercase">
            Ruang Kerja
          </div>
          {navItems.map((item) => {
            const isActive =
              activeView === item.id &&
              !(item.id === 'editor' && activeEditorSection === 'ttd');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectView(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#D4A017]/15 text-[#F4C94D] border border-[#D4A017]/40'
                    : 'text-[#C8BCA8] hover:bg-[#241D15] hover:text-[#F5F0E6] border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </span>
                {typeof item.count === 'number' && (
                  <span className="font-mono-num text-xs text-[#9E907A]">{item.count}</span>
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => {
              onOpenTtdMenu();
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'editor' && activeEditorSection === 'ttd'
                ? 'bg-[#D4A017]/15 text-[#F4C94D] border border-[#D4A017]/40'
                : 'text-[#C8BCA8] hover:bg-[#241D15] hover:text-[#F5F0E6] border border-transparent'
            }`}
          >
            <span className="flex items-center gap-2.5 truncate">
              <Stamp className="w-4 h-4 shrink-0" />
              <span className="truncate">Import TTD & Stempel</span>
            </span>
          </button>
        </div>

        <div className="mx-3.5 my-1 border-t border-[#32291E]" />

        {/* Quick Template Actions */}
        <div className="p-3.5 space-y-2">
          <div className="px-2.5 pb-0.5 text-[11px] font-semibold tracking-wider text-[#8C7E69] uppercase">
            Aksi Cepat Dokumen
          </div>
          <button
            type="button"
            onClick={() => {
              onNewBlankSprin();
              onCloseMobile();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-[#F5F0E6] bg-[#241D15] hover:bg-[#2E251A] border border-[#3E3325] transition-colors whitespace-nowrap cursor-pointer"
          >
            <FilePlus2 className="w-4 h-4 text-[#D4A017] shrink-0" />
            <span>Buat Sprin Baru</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onLoadReferenceTemplate();
              onCloseMobile();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-[#C8BCA8] hover:text-[#F5F0E6] bg-transparent hover:bg-[#241D15] border border-[#32291E] transition-colors whitespace-nowrap cursor-pointer"
          >
              <RotateCcw className="w-4 h-4 text-[#A89C89] shrink-0" />
              <span>Reset Template Default</span>
            </button>
          </div>

          {/* Active Document Summary Footer */}
          <div className="mt-auto p-4 border-t border-[#32291E] bg-[#15100B]">
            <div className="text-[11px] text-[#8C7E69]">Dokumen Aktif</div>
            <div className="font-mono-num text-xs text-[#F4C94D] mt-0.5 truncate">
              {activeDocNumber || 'Belum bernomor'}
            </div>
            <div className="text-[11px] text-[#9E907A] mt-1">
              {useLampiran ? '2 Halaman A4 · Hal 1 & Lampiran' : '1 Halaman A4 · Tanpa Lampiran'}
            </div>
          </div>
      </aside>
    </>
  );
};
