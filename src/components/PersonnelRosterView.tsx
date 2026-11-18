import React, { useMemo, useState } from 'react';
import { Plus, Search, Trash2, UserPlus } from 'lucide-react';
import { PersonnelRow } from '../types/sprin';

interface PersonnelRosterViewProps {
  roster: PersonnelRow[];
  onChangeRoster: (next: PersonnelRow[]) => void;
  onAddToActiveSprin: (person: PersonnelRow) => void;
  activeSprinNrps: string[];
}

export const PersonnelRosterView: React.FC<PersonnelRosterViewProps> = ({
  roster,
  onChangeRoster,
  onAddToActiveSprin,
  activeSprinNrps,
}) => {
  const [search, setSearch] = useState('');
  const [nama, setNama] = useState('');
  const [pangkat, setPangkat] = useState('AIPDA');
  const [nrp, setNrp] = useState('');
  const [jabatan, setJabatan] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return roster;
    return roster.filter(
      (r) =>
        r.nama.toLowerCase().includes(q) ||
        r.pangkat.toLowerCase().includes(q) ||
        r.nrp.toLowerCase().includes(q) ||
        r.jabatan.toLowerCase().includes(q)
    );
  }, [roster, search]);

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !nrp.trim()) return;
    const newPerson: PersonnelRow = {
      id: `pers-${Date.now()}`,
      nama: nama.trim().toUpperCase(),
      pangkat: pangkat.trim().toUpperCase(),
      nrp: nrp.trim(),
      jabatan: jabatan.trim().toUpperCase() || 'ANGGOTA',
      ket: '',
    };
    onChangeRoster([newPerson, ...roster]);
    setNama('');
    setNrp('');
    setJabatan('');
  };

  const handleDelete = (id: string) => {
    onChangeRoster(roster.filter((p) => p.id !== id));
  };

  return (
    <div className="p-5 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-wide text-[#F7F2E8] uppercase">
          DATABASE PERSONEL KESATUAN
        </h2>
        <p className="text-sm text-[#A89C89] mt-0.5">
          Kelola daftar induk personel untuk mempercepat pengisian Lampiran Surat Perintah halaman 2.
        </p>
      </div>

      {/* Add New Person Form */}
      <form
        onSubmit={handleAddPerson}
        className="rounded-xl bg-[#1E1812] border border-[#3A3024] p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end"
      >
        <div>
          <label className="block text-xs font-medium text-[#B5A894] mb-1">Nama Lengkap</label>
          <input
            type="text"
            required
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: BUDI SANTOSO, SH"
            className="w-full rounded-lg bg-[#15110C] border border-[#3D3225] focus:border-[#D4A017] focus:outline-none px-3 py-2 text-xs text-[#F5F0E6] uppercase"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#B5A894] mb-1">Pangkat</label>
          <input
            type="text"
            required
            value={pangkat}
            onChange={(e) => setPangkat(e.target.value)}
            placeholder="AIPTU / AIPDA / BRIPKA"
            className="w-full rounded-lg bg-[#15110C] border border-[#3D3225] focus:border-[#D4A017] focus:outline-none px-3 py-2 text-xs text-[#F5F0E6] uppercase"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#B5A894] mb-1">NRP</label>
          <input
            type="text"
            required
            value={nrp}
            onChange={(e) => setNrp(e.target.value)}
            placeholder="8 digit NRP"
            className="w-full rounded-lg bg-[#15110C] border border-[#3D3225] focus:border-[#D4A017] focus:outline-none px-3 py-2 text-xs text-[#F5F0E6] font-mono-num"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#B5A894] mb-1">Jabatan</label>
          <input
            type="text"
            value={jabatan}
            onChange={(e) => setJabatan(e.target.value)}
            placeholder="BHABIN / PANIT / ANGGOTA"
            className="w-full rounded-lg bg-[#15110C] border border-[#3D3225] focus:border-[#D4A017] focus:outline-none px-3 py-2 text-xs text-[#F5F0E6] uppercase"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#D4A017] hover:bg-[#E5B022] text-xs font-bold text-[#14100C] transition-colors cursor-pointer h-[34px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Simpan Personel</span>
        </button>
      </form>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#8C7E69] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, pangkat, NRP, atau jabatan..."
          className="w-full rounded-lg bg-[#1E1812] border border-[#3A3024] focus:border-[#D4A017] focus:outline-none pl-10 pr-4 py-2 text-sm text-[#F5F0E6]"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl bg-[#1E1812] border border-[#3A3024] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#3A3024] bg-[#18130E] text-[11px] font-semibold uppercase tracking-wider text-[#9E907A]">
                <th className="py-3 px-4 w-12">No</th>
                <th className="py-3 px-4">Nama</th>
                <th className="py-3 px-4">Pangkat</th>
                <th className="py-3 px-4">NRP</th>
                <th className="py-3 px-4">Jabatan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E251B] text-xs">
              {filtered.map((p, idx) => {
                const inSprin = activeSprinNrps.includes(p.nrp);
                return (
                  <tr key={p.id} className="hover:bg-[#251E16] transition-colors">
                    <td className="py-3 px-4 font-mono-num text-[#9E907A]">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-[#F5F0E6] uppercase">
                      {p.nama}
                    </td>
                    <td className="py-3 px-4 text-[#C8BCA8] uppercase">{p.pangkat}</td>
                    <td className="py-3 px-4 font-mono-num text-[#F4C94D]">{p.nrp}</td>
                    <td className="py-3 px-4 text-[#C8BCA8] uppercase">{p.jabatan}</td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          disabled={inSprin}
                          onClick={() => onAddToActiveSprin(p)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                            inSprin
                              ? 'bg-[#2A2218] text-[#8C7E69] cursor-not-allowed'
                              : 'bg-[#2A2218] hover:bg-[#D4A017] hover:text-[#14100C] text-[#F4C94D]'
                          }`}
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>{inSprin ? 'Di Lampiran' : 'Ke Sprin Aktif'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          aria-label="Hapus dari database"
                          className="p-1.5 rounded-md text-[#9E907A] hover:text-red-400 hover:bg-[#2A2218] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
