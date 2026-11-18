import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Eye, Printer, ZoomIn, ZoomOut } from 'lucide-react';
import { ArchiveView } from './components/ArchiveView';
import { DashboardHeader } from './components/DashboardHeader';
import { LetterPageOne } from './components/LetterPageOne';
import { LetterPageTwo } from './components/LetterPageTwo';
import { PersonnelRosterView } from './components/PersonnelRosterView';
import { SidebarNav } from './components/SidebarNav';
import { EditorSectionId, SprinEditorForm } from './components/SprinEditorForm';
import {
  DEFAULT_SPRIN_DOCUMENT,
  DEFAULT_STAMP_CONFIG,
  INITIAL_ARCHIVE_DOCUMENTS,
  INITIAL_PERSONNEL_ROSTER,
} from './data/defaultData';
import {
  AppView,
  LetterPreviewPage,
  PersonnelRow,
  SprinDocument,
} from './types/sprin';
import { exportSprinToWord } from './utils/exportDoc';

const STORAGE_KEYS = {
  ACTIVE_DOC: 'siprin_active_doc_v2',
  ARCHIVE: 'siprin_archive_docs_v2',
  ROSTER: 'siprin_roster_v2',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function normalizeDoc(doc: SprinDocument): SprinDocument {
  return {
    ...DEFAULT_SPRIN_DOCUMENT,
    ...doc,
    useLampiran: doc.useLampiran ?? false,
    stampConfig: {
      ...DEFAULT_STAMP_CONFIG,
      ...(doc.stampConfig || {}),
    },
  };
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<AppView>('editor');
  const [activeSection, setActiveSection] = useState<EditorSectionId>('hal1');
  const [previewPage, setPreviewPage] = useState<LetterPreviewPage>('both');
  const [zoom, setZoom] = useState<number>(0.72);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [activeDoc, setActiveDoc] = useState<SprinDocument>(() =>
    normalizeDoc(readStorage<SprinDocument>(STORAGE_KEYS.ACTIVE_DOC, DEFAULT_SPRIN_DOCUMENT))
  );
  const [archiveDocs, setArchiveDocs] = useState<SprinDocument[]>(() =>
    readStorage<SprinDocument[]>(STORAGE_KEYS.ARCHIVE, INITIAL_ARCHIVE_DOCUMENTS).map(normalizeDoc)
  );
  const [roster, setRoster] = useState<PersonnelRow[]>(() =>
    readStorage<PersonnelRow[]>(STORAGE_KEYS.ROSTER, INITIAL_PERSONNEL_ROSTER)
  );

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_DOC, JSON.stringify(activeDoc));
    } catch {
      // ignore storage quota error
    }
  }, [activeDoc]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ARCHIVE, JSON.stringify(archiveDocs));
    } catch {
      // ignore
    }
  }, [archiveDocs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROSTER, JSON.stringify(roster));
    } catch {
      // ignore
    }
  }, [roster]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Compute completion percentage for gold header bar
  const completionPercent = useMemo(() => {
    const checks = [
      Boolean(activeDoc.kopLine1.trim()),
      Boolean(activeDoc.kopLine2.trim()),
      Boolean(activeDoc.nomorSprin.trim()),
      Boolean(activeDoc.pertimbangan.trim()),
      activeDoc.dasarList.length > 0,
      activeDoc.untukList.length > 0,
      activeDoc.personelList.length > 0,
      Boolean(activeDoc.pejabatNama.trim()),
    ];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [activeDoc]);

  const handleSaveToArchive = () => {
    const stampedDoc: SprinDocument = {
      ...activeDoc,
      updatedAt: new Date().toISOString(),
    };
    setArchiveDocs((prev) => {
      const idx = prev.findIndex((d) => d.id === stampedDoc.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = stampedDoc;
        return next;
      }
      return [stampedDoc, ...prev];
    });
    showToast(`Surat ${stampedDoc.nomorSprin} disimpan ke arsip`);
  };

  const handleCreateNewSprin = () => {
    const nextNum = 1489 + archiveDocs.length;
    const blankDoc: SprinDocument = {
      ...DEFAULT_SPRIN_DOCUMENT,
      id: `sprin-${Date.now()}`,
      status: 'Draft',
      useLampiran: false,
      updatedAt: new Date().toISOString(),
      nomorSprin: `Sprin/ ${nextNum} /XI/KEP./2026`,
      pertimbangan:
        'guna tertib administrasi khususnya dalam rangka pelaksanaan tugas di lingkungan kesatuan, dipandang perlu mengeluarkan surat perintah.',
      untukList: [
        'melaksanakan tugas sesuai ploting dan arahan pimpinan;',
        'melaksanakan perintah ini dengan seksama dan penuh rasa tanggung jawab;',
        'surat perintah ini berlaku sejak dikeluarkan.',
      ],
      lampiranNomor: `SPRIN/ ${nextNum} /XI/KEP./2026`,
      personelList: [],
    };
    setActiveDoc(blankDoc);
    setActiveView('editor');
    setActiveSection('hal1');
    showToast(`Draft Surat Perintah baru (${nextNum}) siap diisi`);
  };

  const handleLoadReferenceTemplate = () => {
    setActiveDoc({
      ...DEFAULT_SPRIN_DOCUMENT,
      updatedAt: new Date().toISOString(),
    });
    setActiveView('editor');
    setActiveSection('hal1');
    showToast('Template Surat Perintah (Tanpa Lampiran) dimuat ulang');
  };

  const handleOpenFromArchive = (doc: SprinDocument) => {
    setActiveDoc({ ...doc });
    setActiveView('editor');
    showToast(`Membuka ${doc.nomorSprin}`);
  };

  const handleDuplicateArchive = (doc: SprinDocument) => {
    const copy: SprinDocument = {
      ...doc,
      id: `sprin-${Date.now()}`,
      status: 'Draft',
      nomorSprin: `${doc.nomorSprin} (Salinan)`,
      updatedAt: new Date().toISOString(),
    };
    setArchiveDocs((prev) => [copy, ...prev]);
    showToast('Surat berhasil diduplikasi ke arsip');
  };

  const handleDeleteArchive = (id: string) => {
    setArchiveDocs((prev) => prev.filter((d) => d.id !== id));
    showToast('Surat dihapus dari arsip');
  };

  const handleAddRosterPersonToActive = (person: PersonnelRow) => {
    const exists = activeDoc.personelList.some((p) => p.nrp === person.nrp && person.nrp !== '');
    if (exists) return;
    setActiveDoc((prev) => ({
      ...prev,
      personelList: [
        ...prev.personelList,
        { ...person, id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` },
      ],
      updatedAt: new Date().toISOString(),
    }));
    showToast(`${person.pangkat} ${person.nama} ditambahkan ke daftar personel`);
  };

  const handleFocusFromLetter = (section: EditorSectionId) => {
    setActiveSection(section);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#14100C] text-[#F5F0E6]">
      {/* SCREEN WORKSPACE (Hidden during print) */}
      <div className="no-print flex flex-col min-h-screen">
        <DashboardHeader
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
          onSaveToArchive={handleSaveToArchive}
          onExportWord={async () => {
            try {
              await exportSprinToWord(activeDoc);
              showToast('File .DOCX (A4 · Arial 12pt) diunduh');
            } catch {
              showToast('Gagal membuat file .DOCX');
            }
          }}
          onPrint={handlePrint}
          completionPercent={completionPercent}
        />

        <div className="flex flex-1 min-h-0">
          <SidebarNav
            isOpen={sidebarOpen}
            onCloseMobile={() => setSidebarOpen(false)}
            activeView={activeView}
            activeEditorSection={activeSection}
            onSelectView={(view) => {
              setActiveView(view);
              if (view === 'editor' && activeSection === 'ttd') {
                setActiveSection('hal1');
              }
            }}
            onOpenTtdMenu={() => {
              setActiveView('editor');
              setActiveSection('ttd');
            }}
            archiveCount={archiveDocs.length}
            rosterCount={roster.length}
            activeDocNumber={activeDoc.nomorSprin}
            useLampiran={activeDoc.useLampiran}
            onNewBlankSprin={handleCreateNewSprin}
            onLoadReferenceTemplate={handleLoadReferenceTemplate}
          />

          <main className="flex-1 min-w-0 bg-[#14100C]">
            {activeView === 'editor' && (
              <div className="flex flex-col xl:flex-row h-full">
                {/* Left Column: Tactical Form Editor matching Image 1 */}
                <div className="w-full xl:w-[470px] 2xl:w-[510px] shrink-0 border-b xl:border-b-0 xl:border-r border-[#3A3024] p-4 lg:p-5 overflow-y-auto xl:max-h-[calc(100vh-76px)]">
                  <SprinEditorForm
                    doc={activeDoc}
                    onChange={setActiveDoc}
                    roster={roster}
                    activeSection={activeSection}
                    onChangeSection={setActiveSection}
                  />
                </div>

                {/* Right Column: Live A4 2-Page Document Preview */}
                <div className="flex-1 min-w-0 bg-[#0D0A07] flex flex-col xl:max-h-[calc(100vh-76px)]">
                  {/* Preview Toolbar */}
                  <div className="px-4 lg:px-6 py-3 bg-[#17120D] border-b border-[#32291E] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[#D4A017]" />
                      <span className="text-xs font-semibold text-[#F5F0E6]">
                        Pratinjau Dokumen A4
                      </span>
                      <span className="text-xs text-[#8C7E69] hidden sm:inline">
                        · Klik area surat untuk langsung mengedit
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Page Switcher (only when Lampiran mode is enabled) */}
                      {activeDoc.useLampiran ? (
                        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#110D09] border border-[#32291E]">
                          {(
                            [
                              { id: 'both', label: 'Semua (2 Hal)' },
                              { id: 'page1', label: 'Halaman 1' },
                              { id: 'page2', label: 'Halaman 2' },
                            ] as const
                          ).map((tab) => (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setPreviewPage(tab.id)}
                              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                                previewPage === tab.id
                                  ? 'bg-[#D4A017] text-[#14100C]'
                                  : 'text-[#A89C89] hover:text-[#F5F0E6]'
                              }`}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-[#110D09] border border-[#32291E] text-xs font-semibold text-[#D4A017]">
                          1 Halaman · Tanpa Lampiran
                        </span>
                      )}

                      {/* Zoom Controls */}
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#110D09] border border-[#32291E]">
                        <button
                          type="button"
                          aria-label="Perkecil pratinjau"
                          onClick={() => setZoom((z) => Math.max(0.45, +(z - 0.1).toFixed(2)))}
                          className="p-1 text-[#A89C89] hover:text-[#F5F0E6] cursor-pointer"
                        >
                          <ZoomOut className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono-num text-xs text-[#F5F0E6] w-11 text-center">
                          {Math.round(zoom * 100)}%
                        </span>
                        <button
                          type="button"
                          aria-label="Perbesar pratinjau"
                          onClick={() => setZoom((z) => Math.min(1.1, +(z + 0.1).toFixed(2)))}
                          className="p-1 text-[#A89C89] hover:text-[#F5F0E6] cursor-pointer"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* A4 Paper Scroll Canvas */}
                  <div className="flex-1 overflow-auto p-6 lg:p-8 flex flex-col items-center gap-8">
                    {(!activeDoc.useLampiran ||
                      previewPage === 'both' ||
                      previewPage === 'page1') && (
                      <div className="flex flex-col items-center">
                        <div className="w-full flex items-center justify-between text-xs text-[#9E907A] mb-2 px-1">
                          <span>
                            {activeDoc.useLampiran
                              ? 'Halaman 1 — Surat Perintah'
                              : 'Surat Perintah (1 Halaman — Tanpa Lampiran)'}
                          </span>
                          <span className="font-mono-num">A4 · 210 × 297 mm</span>
                        </div>
                        <div
                          style={{
                            width: `calc(210mm * ${zoom})`,
                            height: `calc(297mm * ${zoom})`,
                          }}
                          className="relative shrink-0"
                        >
                          <div
                            style={{
                              transform: `scale(${zoom})`,
                              transformOrigin: 'top left',
                            }}
                          >
                            <LetterPageOne
                              doc={activeDoc}
                              onFocusSection={handleFocusFromLetter}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {activeDoc.useLampiran &&
                      (previewPage === 'both' || previewPage === 'page2') && (
                        <div className="flex flex-col items-center">
                          <div className="w-full flex items-center justify-between text-xs text-[#9E907A] mb-2 px-1">
                            <span>Halaman 2 — Lampiran Daftar Personel</span>
                            <span className="font-mono-num">
                              {activeDoc.personelList.length} Personel
                            </span>
                          </div>
                          <div
                            style={{
                              width: `calc(210mm * ${zoom})`,
                              height: `calc(297mm * ${zoom})`,
                            }}
                            className="relative shrink-0"
                          >
                            <div
                              style={{
                                transform: `scale(${zoom})`,
                                transformOrigin: 'top left',
                              }}
                            >
                              <LetterPageTwo
                                doc={activeDoc}
                                onFocusSection={handleFocusFromLetter}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}

            {activeView === 'arsip' && (
              <ArchiveView
                documents={archiveDocs}
                activeDocId={activeDoc.id}
                onOpenInEditor={handleOpenFromArchive}
                onDuplicate={handleDuplicateArchive}
                onDelete={handleDeleteArchive}
                onCreateNew={handleCreateNewSprin}
              />
            )}

            {activeView === 'personel' && (
              <PersonnelRosterView
                roster={roster}
                onChangeRoster={setRoster}
                onAddToActiveSprin={handleAddRosterPersonToActive}
                activeSprinNrps={activeDoc.personelList.map((p) => p.nrp)}
              />
            )}
          </main>
        </div>

        {/* Floating Quick Print Button on Mobile */}
        <button
          type="button"
          onClick={handlePrint}
          aria-label="Cetak Surat Perintah"
          className="fixed bottom-5 right-5 sm:hidden z-40 w-12 h-12 rounded-full bg-[#D4A017] text-[#14100C] shadow-xl flex items-center justify-center cursor-pointer"
        >
          <Printer className="w-5 h-5" />
        </button>

        {/* Non-blocking Toast */}
        {toastMessage && (
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#251E16] border border-[#D4A017]/60 text-xs font-medium text-[#F5F0E6] shadow-2xl">
            <CheckCircle2 className="w-4 h-4 text-[#D4A017] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* DEDICATED PRINT-ONLY CONTAINER (Renders Page 1, and optional Page 2 only when useLampiran is enabled) */}
      <div className="hidden print-only-container">
        <LetterPageOne doc={activeDoc} />
        {activeDoc.useLampiran && <LetterPageTwo doc={activeDoc} />}
      </div>
    </div>
  );
}
