import React, { useState, useRef } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Member } from '../types';
import { MemberCardModal } from './MemberCardModal';
import { 
  Users, UserPlus, Search, QrCode, Edit2, Trash2, 
  CheckCircle2, XCircle, Filter, Download, Upload, 
  Briefcase, GraduationCap, Image as ImageIcon, FileSpreadsheet, X, Check
} from 'lucide-react';
import { downloadCsv } from '../utils/export';

export const MembersView: React.FC = () => {
  const { members, addMember, updateMember, deleteMember, pushNotification } = useLibrary();

  // Active Category: 'siswa' or 'pegawai'
  const [activeCategory, setActiveCategory] = useState<'siswa' | 'pegawai'>('siswa');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedMemberForCard, setSelectedMemberForCard] = useState<Member | null>(null);

  // Add/Edit Member Form State
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    nis: '',
    nisn: '',
    nip: '',
    nuptk: '',
    role: 'siswa' as 'siswa' | 'guru' | 'pegawai',
    grade: 'X' as 'X' | 'XI' | 'XII' | 'Guru' | 'Pegawai',
    classGroup: 'X Fase E-1',
    position: '',
    employmentStatus: 'Pelajar' as any,
    email: '',
    phone: '',
    avatar: '',
    status: 'aktif' as 'aktif' | 'nonaktif'
  });

  // Photo upload ref & state
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoFileName, setPhotoFileName] = useState('');

  // Batch CSV Import Modal State
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const csvFileRef = useRef<HTMLInputElement>(null);

  // Filter members by category
  const categoryMembers = members.filter(m => {
    if (activeCategory === 'siswa') {
      return m.role === 'siswa';
    } else {
      return m.role === 'guru' || m.role === 'pegawai';
    }
  });

  const filteredMembers = categoryMembers.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nis.includes(searchQuery) ||
      (m.nip && m.nip.includes(searchQuery)) ||
      (m.nuptk && m.nuptk.includes(searchQuery)) ||
      m.classGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.position && m.position.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeCategory === 'siswa') {
      const matchesGrade = selectedFilter === 'all' || m.grade === selectedFilter;
      return matchesSearch && matchesGrade;
    } else {
      const matchesType = selectedFilter === 'all' 
        ? true 
        : selectedFilter === 'pustakawan' 
          ? (m.role === 'pegawai' && m.position?.toLowerCase().includes('pustaka'))
          : selectedFilter === 'guru' 
            ? m.role === 'guru' 
            : m.role === 'pegawai';
      return matchesSearch && matchesType;
    }
  });

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormData(prev => ({ ...prev, avatar: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Open Add Modal
  const openAddModal = (category: 'siswa' | 'pegawai') => {
    setEditingMember(null);
    setPhotoFileName('');
    if (category === 'siswa') {
      setFormData({
        name: '',
        nis: '2425' + Math.floor(Math.random() * 9000 + 1000),
        nisn: '00' + Math.floor(Math.random() * 90000000 + 10000000),
        nip: '',
        nuptk: '',
        role: 'siswa',
        grade: 'X',
        classGroup: 'X Fase E-1',
        position: 'Siswa / Siswi SMA',
        employmentStatus: 'Pelajar',
        email: '',
        phone: '0812-',
        avatar: '',
        status: 'aktif'
      });
    } else {
      setFormData({
        name: '',
        nis: 'PEG-' + Math.floor(Math.random() * 9000 + 1000),
        nisn: '-',
        nip: '19' + Math.floor(Math.random() * 8000000000000000 + 1000000000000000),
        nuptk: String(Math.floor(Math.random() * 8000000000000000 + 1000000000000000)),
        role: 'pegawai',
        grade: 'Pegawai',
        classGroup: 'Unit Pelaksana Teknis Perpustakaan',
        position: 'Pustakawan Pelaksana',
        employmentStatus: 'PNS',
        email: '',
        phone: '0812-',
        avatar: '',
        status: 'aktif'
      });
    }
    setShowMemberModal(true);
  };

  // Open Edit Modal
  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setPhotoFileName('');
    setFormData({
      name: member.name,
      nis: member.nis,
      nisn: member.nisn,
      nip: member.nip || '',
      nuptk: member.nuptk || '',
      role: member.role,
      grade: member.grade,
      classGroup: member.classGroup,
      position: member.position || '',
      employmentStatus: member.employmentStatus || (member.role === 'siswa' ? 'Pelajar' : 'PNS'),
      email: member.email,
      phone: member.phone,
      avatar: member.avatar,
      status: member.status
    });
    setShowMemberModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.nis.trim()) return;

    const defaultAvatar = formData.avatar || `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1534528741775-53994a69daeb' : '1507003211169-0a1dd7228f2d'}?w=150&auto=format&fit=crop&q=80`;

    if (editingMember) {
      updateMember(editingMember.id, {
        ...formData,
        avatar: defaultAvatar
      });
      pushNotification(
        'Data Diperbarui',
        `Data ${formData.role === 'siswa' ? 'siswa' : 'pegawai'} "${formData.name}" berhasil diupdate.`,
        'success'
      );
    } else {
      addMember({
        ...formData,
        avatar: defaultAvatar,
        joinDate: new Date().toISOString().split('T')[0]
      });
      pushNotification(
        'Pendaftaran Berhasil',
        `${formData.role === 'siswa' ? 'Siswa' : 'Pegawai'} "${formData.name}" berhasil ditambahkan ke sistem.`,
        'success'
      );
    }

    setShowMemberModal(false);
  };

  // Export CSV
  const handleExportCsv = () => {
    if (activeCategory === 'siswa') {
      const headers = ['ID', 'NIS', 'NISN', 'Nama Siswa', 'Tingkat', 'Kelas / Rombel', 'Email', 'No. HP', 'Status', 'Tgl Daftar'];
      const rows = filteredMembers.map(m => [
        m.id, m.nis, m.nisn, m.name, m.grade, m.classGroup, m.email, m.phone, m.status, m.joinDate
      ]);
      downloadCsv(`data_siswa_sma_${new Date().toISOString().split('T')[0]}`, headers, rows);
    } else {
      const headers = ['ID', 'NIP / ID', 'NUPTK', 'Nama Pegawai', 'Role', 'Jabatan / Tugas', 'Status Pegawai', 'Email', 'No. HP', 'Status'];
      const rows = filteredMembers.map(m => [
        m.id, m.nip || m.nis, m.nuptk || '-', m.name, m.role, m.position || m.classGroup, m.employmentStatus || 'PNS', m.email, m.phone, m.status
      ]);
      downloadCsv(`data_pegawai_guru_sma_${new Date().toISOString().split('T')[0]}`, headers, rows);
    }

    pushNotification('Ekspor Berhasil', `${filteredMembers.length} data diekspor ke format CSV Excel.`, 'success');
  };

  // Download Sample Template for Batch Import
  const handleDownloadTemplate = () => {
    if (activeCategory === 'siswa') {
      const headers = ['NIS', 'NISN', 'Nama Siswa', 'Tingkat (X/XI/XII)', 'Kelas Rombel', 'Email', 'No HP'];
      const sampleRows = [
        ['24251099', '0089912345', 'Muhammad Rizky Pratama', 'X', 'X Fase E-2', 'rizky.pratama@siswa.sch.id', '0812-3344-5566'],
        ['23241088', '0078823456', 'Dinda Ayu Lestari', 'XI', 'XI MIPA 3', 'dinda.lestari@siswa.sch.id', '0813-7788-9900']
      ];
      downloadCsv('template_import_siswa_sma', headers, sampleRows);
    } else {
      const headers = ['NIP', 'NUPTK', 'Nama Lengkap & Gelar', 'Role (pegawai/guru)', 'Jabatan', 'Status (PNS/PPPK/Honorer)', 'Email', 'No HP'];
      const sampleRows = [
        ['19800101 200501 1 003', '7890123456780001', 'Budi Santoso, S.Pd.', 'guru', 'Guru Bahasa Indonesia SMA', 'PNS', 'budi.santoso@guru.sch.id', '0811-9988-7766'],
        ['19920510 202221 2 008', '8901234567890002', 'Rina Wulandari, S.I.Pust.', 'pegawai', 'Pustakawan Pelaksana', 'PPPK', 'rina.wulandari@staff.sch.id', '0856-1122-3344']
      ];
      downloadCsv('template_import_pegawai_sma', headers, sampleRows);
    }
  };

  // Handle Batch CSV File Upload
  const handleBatchCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
      if (lines.length <= 1) {
        alert('Berkas CSV kosong atau tidak memiliki baris data.');
        return;
      }

      let count = 0;
      // Skip header line (index 0)
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        if (cols.length >= 3 && cols[0]) {
          if (activeCategory === 'siswa') {
            addMember({
              nis: cols[0],
              nisn: cols[1] || '0000000000',
              name: cols[2],
              grade: (cols[3] as any) || 'X',
              classGroup: cols[4] || 'X Fase E',
              role: 'siswa',
              position: 'Siswa / Siswi SMA',
              employmentStatus: 'Pelajar',
              email: cols[5] || `${cols[0]}@siswa.sch.id`,
              phone: cols[6] || '0812-',
              avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
              joinDate: new Date().toISOString().split('T')[0],
              status: 'aktif'
            });
            count++;
          } else {
            addMember({
              nis: cols[0] || 'PEG-' + Math.floor(Math.random() * 9000 + 1000),
              nip: cols[0],
              nuptk: cols[1] || '-',
              nisn: cols[1] || '-',
              name: cols[2],
              role: (cols[3]?.toLowerCase() === 'guru' ? 'guru' : 'pegawai') as any,
              grade: (cols[3]?.toLowerCase() === 'guru' ? 'Guru' : 'Pegawai') as any,
              classGroup: cols[4] || 'Unit Perpustakaan',
              position: cols[4] || 'Staf / Guru SMA',
              employmentStatus: (cols[5] as any) || 'PNS',
              email: cols[6] || 'staf@sman1teladan.sch.id',
              phone: cols[7] || '0812-',
              avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80`,
              joinDate: new Date().toISOString().split('T')[0],
              status: 'aktif'
            });
            count++;
          }
        }
      }

      pushNotification(
        'Upload Batch Berhasil',
        `${count} data ${activeCategory === 'siswa' ? 'siswa' : 'pegawai'} berhasil diimpor ke sistem.`,
        'success'
      );
      setShowBatchModal(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header with Title and Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Manajemen Data Pengguna & Anggota
          </h2>
          <p className="text-xs text-slate-500">
            Kelola data siswa, guru, pustakawan, staf pegawai sekolah, upload foto KTA, serta impor/ekspor data
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowBatchModal(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            title="Import Data via Berkas CSV / Excel"
          >
            <Upload className="w-3.5 h-3.5 text-[#0B192C]" /> Upload Batch CSV
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#0B192C]" /> Ekspor Data
          </button>

          <button
            onClick={() => openAddModal(activeCategory)}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-400/20 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 stroke-[2.2]" /> 
            {activeCategory === 'siswa' ? 'Tambah Data Siswa' : 'Tambah Pegawai / Guru'}
          </button>
        </div>
      </div>

      {/* Main Sub-Tab Switcher: Siswa vs Pegawai & Guru */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl max-w-md">
        <button
          onClick={() => {
            setActiveCategory('siswa');
            setSelectedFilter('all');
          }}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeCategory === 'siswa'
              ? 'bg-[#0B192C] text-amber-400 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Data Siswa SMA ({members.filter(m => m.role === 'siswa').length})</span>
        </button>

        <button
          onClick={() => {
            setActiveCategory('pegawai');
            setSelectedFilter('all');
          }}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeCategory === 'pegawai'
              ? 'bg-[#0B192C] text-amber-400 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Pegawai & Guru ({members.filter(m => m.role !== 'siswa').length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Sub-Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-medium">
          {activeCategory === 'siswa' ? (
            [
              { id: 'all', label: 'Semua Siswa' },
              { id: 'X', label: 'Kelas X (Fase E)' },
              { id: 'XI', label: 'Kelas XI (Fase F)' },
              { id: 'XII', label: 'Kelas XII' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  selectedFilter === tab.id
                    ? 'bg-[#0B192C] text-amber-400 font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))
          ) : (
            [
              { id: 'all', label: 'Semua Staf & Pendidik' },
              { id: 'pustakawan', label: 'Pustakawan & TI' },
              { id: 'guru', label: 'Dewan Guru' },
              { id: 'pegawai', label: 'Staf Administrasi' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  selectedFilter === tab.id
                    ? 'bg-[#0B192C] text-amber-400 font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))
          )}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeCategory === 'siswa' ? "Cari nama siswa, NIS, kelas..." : "Cari nama, NIP, jabatan..."}
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Foto & Nama Lengkap</th>
                <th className="py-3 px-4">
                  {activeCategory === 'siswa' ? 'Nomor Induk (NIS/NISN)' : 'NIP & NUPTK'}
                </th>
                <th className="py-3 px-4">
                  {activeCategory === 'siswa' ? 'Tingkat & Rombel' : 'Jabatan & Status Kepegawaian'}
                </th>
                <th className="py-3 px-4">Kontak & Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">KTA & Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ada data {activeCategory === 'siswa' ? 'siswa' : 'pegawai'} yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredMembers.map(member => (
                  <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Name & Avatar */}
                    <td className="py-3.5 px-4 min-w-[220px]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="text-xs font-bold text-slate-500">
                              {member.name.slice(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{member.name}</p>
                          <span className="text-[10px] text-slate-500 font-mono block">
                            {member.role === 'pegawai' 
                              ? (member.position || 'Staf Perpustakaan') 
                              : member.role === 'guru' 
                                ? 'Tenaga Pendidik / Guru' 
                                : `Kelas ${member.grade} · ${member.classGroup}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Identifiers */}
                    <td className="py-3.5 px-4 font-mono text-[11px] whitespace-nowrap">
                      {member.role === 'siswa' ? (
                        <>
                          <div>NIS: <span className="font-bold text-slate-800">{member.nis}</span></div>
                          <div className="text-slate-400 text-[10px]">NISN: {member.nisn}</div>
                        </>
                      ) : (
                        <>
                          <div>NIP: <span className="font-bold text-slate-800">{member.nip || member.nis}</span></div>
                          <div className="text-slate-400 text-[10px]">NUPTK: {member.nuptk || '-'}</div>
                        </>
                      )}
                    </td>

                    {/* Position / Class Details */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {member.role === 'siswa' ? (
                        <>
                          <span className="font-semibold text-slate-800">{member.classGroup}</span>
                          <div className="text-[10px] text-slate-500">Tingkat {member.grade}</div>
                        </>
                      ) : (
                        <>
                          <span className="font-semibold text-slate-800">{member.position || member.classGroup}</span>
                          <div className="text-[10px] text-indigo-600 font-medium">
                            {member.employmentStatus || 'Pegawai Aktif'}
                          </div>
                        </>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      <div>{member.email}</div>
                      <div className="text-[11px] font-mono text-slate-400">{member.phone}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                        member.status === 'aktif' ? 'text-emerald-600' : 'text-slate-400'
                      }`}>
                        {member.status === 'aktif' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {member.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedMemberForCard(member)}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1 transition-colors"
                          title="Cetak KTA Digital"
                        >
                          <QrCode className="w-3.5 h-3.5" /> KTA
                        </button>
                        <button
                          onClick={() => openEditModal(member)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Edit Data"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Apakah Anda yakin ingin menghapus data "${member.name}"?`)) {
                              deleteMember(member.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Card Modal (KTA) */}
      {selectedMemberForCard && (
        <MemberCardModal
          member={selectedMemberForCard}
          onClose={() => setSelectedMemberForCard(null)}
        />
      )}

      {/* Add / Edit Member Modal (with real photo upload) */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <h3 className="text-base font-bold text-slate-900">
                {editingMember 
                  ? `Edit Data ${formData.role === 'siswa' ? 'Siswa' : 'Pegawai / Guru'}` 
                  : `Tambah Data ${formData.role === 'siswa' ? 'Siswa' : 'Pegawai / Guru'} Baru`}
              </h3>
              <button 
                onClick={() => setShowMemberModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              
              {/* Photo Upload Section */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
                <div className="w-16 h-20 rounded-xl bg-slate-200 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Preview Foto" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold text-center px-1">
                      Pas Foto
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <span className="text-xs font-bold text-slate-800 block">
                    Upload Pas Foto KTA Resmi
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={photoInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-indigo-600" /> Pilih Foto dari Komputer
                    </button>
                    {formData.avatar && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, avatar: '' }));
                          setPhotoFileName('');
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Hapus Foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {photoFileName && (
                    <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" /> Foto terpilih: {photoFileName}
                    </p>
                  )}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={formData.role === 'siswa' ? "Nama lengkap siswa" : "Nama lengkap beserta gelar (cth: Dra. Endang S., M.Pd.)"}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                />
              </div>

              {/* Identifiers Grid */}
              {formData.role === 'siswa' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Nomor Induk Siswa (NIS) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nis}
                      onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      NISN *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nisn}
                      onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Nomor Induk Pegawai (NIP) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nip || formData.nis}
                      onChange={(e) => setFormData({ ...formData, nip: e.target.value, nis: e.target.value })}
                      placeholder="19740518 199903 2 003"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      NUPTK (Opsional)
                    </label>
                    <input
                      type="text"
                      value={formData.nuptk}
                      onChange={(e) => setFormData({ ...formData, nuptk: e.target.value, nisn: e.target.value })}
                      placeholder="Nomor Unik Pendidik"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Role & Position Breakdown */}
              {formData.role === 'siswa' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Tingkat Kelas
                    </label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value as any })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="X">Kelas X (Fase E)</option>
                      <option value="XI">Kelas XI (Fase F)</option>
                      <option value="XII">Kelas XII</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Rombel / Kelas
                    </label>
                    <input
                      type="text"
                      value={formData.classGroup}
                      onChange={(e) => setFormData({ ...formData, classGroup: e.target.value })}
                      placeholder="XI MIPA 1"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Kategori Staf
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        role: e.target.value as any,
                        grade: e.target.value === 'guru' ? 'Guru' : 'Pegawai'
                      })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="pegawai">Staf Perpustakaan / Tendik</option>
                      <option value="guru">Guru / Tenaga Pendidik</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Jabatan / Penugasan
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="Pustakawan Pelaksana / Guru Fisika"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Status Kepegawaian
                    </label>
                    <select
                      value={formData.employmentStatus}
                      onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value as any })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="PNS">PNS</option>
                      <option value="PPPK">PPPK</option>
                      <option value="Honorer / GTT">Honorer / GTT</option>
                      <option value="Tenaga Kependidikan">Tenaga Kependidikan</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@sekolah.sch.id"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    No. WhatsApp / HP
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0812-..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Status Keanggotaan
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="aktif">Aktif Terdaftar</option>
                  <option value="nonaktif">Nonaktif / Cuti</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Simpan Data
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Batch Import CSV Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Import Batch {activeCategory === 'siswa' ? 'Siswa' : 'Pegawai'} via CSV
                  </h3>
                  <p className="text-xs text-slate-500">
                    Upload banyak data sekaligus dari format Excel / CSV
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowBatchModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-indigo-950 block">Petunjuk Format Berkas:</span>
              <p className="text-indigo-900 leading-relaxed">
                Unduh template resmi di bawah ini agar kolom dan urutan data sesuai dengan sistem pangkalan data sekolah.
              </p>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="px-3 py-1.5 rounded-lg bg-white border border-indigo-300 text-indigo-700 font-bold hover:bg-indigo-50 flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" /> Unduh Format Template CSV
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-3 hover:border-indigo-500 transition-colors bg-slate-50/50">
              <input
                type="file"
                ref={csvFileRef}
                onChange={handleBatchCsvUpload}
                accept=".csv,text/csv"
                className="hidden"
              />
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Pilih Berkas CSV dari Perangkat Anda
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mendukung berkas berekstensi .csv hasil ekspor spreadsheet Excel
                </p>
              </div>
              <button
                type="button"
                onClick={() => csvFileRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs inline-flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" /> Unggah & Proses Data CSV
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowBatchModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
