
import React, { useState, useEffect, useMemo } from 'react';
import { X, Users, CheckCircle2, XCircle, Plus, Calendar, Trash2, ShieldAlert, Activity, DollarSign, Brain, Search, Lock, Zap, RefreshCw, AlertTriangle, Terminal, Save, ArrowRight, Download, UserPlus, ShieldCheck, Key, FileCode } from 'lucide-react';
import { ThalamusUser, getStoredUsers, saveUsers, updateUserSettings, addUser, getRemainingSpots, setRemainingSpots } from '../userManagementService';
import { LicenseService, License } from '../src/services/LicenseService';

interface Props {
  onClose: () => void;
}

const AdminDashboard: React.FC<Props> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<ThalamusUser[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [activeTab, setActiveTab] = useState<'USERS' | 'LICENSES'>('USERS');
  const [searchTerm, setSearchTerm] = useState('');
  const [remainingSpots, setRemainingSpotsState] = useState(getRemainingSpots());
  
  // States pour les modals
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Formulaire d'ajout
  const [newUserData, setNewUserData] = useState({ id: '', email: '', balance: '1000', platform: 'MT5', expiry: '' });
  // Formulaire d'extension
  const [newExpiryDate, setNewExpiryDate] = useState('');

  const ADMIN_PASS = "OBA_ROOT_ACCESS";

  useEffect(() => {
    if (isAuthenticated) {
      setUsers(getStoredUsers());
      setLicenses(LicenseService.getAllLicenses());
      const interval = setInterval(() => {
        setUsers(getStoredUsers());
        setLicenses(LicenseService.getAllLicenses());
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const stats = useMemo(() => {
    const totalEquity = users.reduce((acc, u) => acc + (u.lastBalance || 0), 0);
    const activeNodes = users.filter(u => u.status === 'ACTIVE').length;
    const pendingNodes = users.filter(u => u.status === 'PENDING').length;
    return { totalEquity, activeNodes, pendingNodes, totalUsers: users.length };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [users, searchTerm]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASS) {
      setIsAuthenticated(true);
    } else {
      alert("ACCÈS REFUSÉ : SIGNATURE DIGITALE INVALIDE");
    }
  };

  const updateUserStatus = (id: string, newStatus: 'ACTIVE' | 'SUSPENDED' | 'PENDING') => {
    updateUserSettings(id, { status: newStatus });
    setUsers(getStoredUsers());
  };

  const handleUpdateSpots = () => {
    setRemainingSpots(remainingSpots);
    alert(`Compteur de places mis à jour : ${remainingSpots}`);
  };

  const handleRevokeLicense = (licenseId: string) => {
    if (confirm("Voulez-vous vraiment révoquer cette licence ?")) {
      LicenseService.revokeLicense(licenseId);
      setLicenses(LicenseService.getAllLicenses());
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Email', 'Status', 'Registration Date', 'Expiry Date', 'Platform', 'Balance'];
    const rows = users.map(u => [
      u.id,
      u.email || 'N/A',
      u.status,
      new Date(u.registrationDate).toLocaleDateString(),
      new Date(u.expiryDate).toLocaleDateString(),
      u.platform,
      u.lastBalance
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `thalamus_pioneers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openExtensionModal = (user: ThalamusUser) => {
    setEditingUserId(user.id);
    const date = new Date(user.expiryDate);
    setNewExpiryDate(date.toISOString().split('T')[0]);
  };

  const handleSaveExtension = () => {
    if (editingUserId && newExpiryDate) {
      const timestamp = new Date(newExpiryDate).getTime();
      updateUserSettings(editingUserId, { expiryDate: timestamp });
      setUsers(getStoredUsers());
      setEditingUserId(null);
    }
  };

  const deleteUser = (id: string) => {
    if (confirm(`Confirmer la suppression du nœud ${id} ?`)) {
      const updated = users.filter(u => u.id !== id);
      saveUsers(updated);
      setUsers(updated);
    }
  };

  const handleCreateNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.id.trim()) return;

    addUser({
      id: newUserData.id.trim().toUpperCase(),
      email: newUserData.email.trim(),
      status: 'ACTIVE',
      registrationDate: Date.now(),
      expiryDate: new Date(newUserData.expiry || Date.now() + 1000 * 60 * 60 * 24 * 30).getTime(),
      isOnline: false,
      lastBalance: parseFloat(newUserData.balance),
      mhiScore: 100,
      platform: newUserData.platform
    });

    setNewUserData({ id: '', email: '', balance: '1000', platform: 'MT5', expiry: '' });
    setShowAddModal(false);
    setUsers(getStoredUsers());
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[3000] bg-slate-950 flex items-center justify-center p-6 font-mono">
        <div className="max-w-md w-full glass-panel p-10 rounded-[2.5rem] border border-cyan-500/20 text-center space-y-8 animate-in zoom-in duration-500">
          <Lock size={48} className="text-cyan-400 mx-auto animate-pulse" />
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">THALAMUS COMMAND</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol d'accès restreint</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Signature d'accès..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl text-center text-cyan-400 outline-none focus:border-cyan-500/50 transition-all"
            />
            <button type="submit" className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-[0.4em] rounded-xl transition-all shadow-xl">
              INITIALISER L'AUDIT
            </button>
          </form>
          <button onClick={onClose} className="text-[10px] font-black text-slate-600 hover:text-white uppercase tracking-widest transition-colors">Abandonner</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[2500] bg-slate-950/98 backdrop-blur-3xl flex flex-col p-4 md:p-8 font-mono text-white overflow-hidden">
      <div className="max-w-7xl w-full mx-auto flex flex-col h-full space-y-6">
        
        {/* HEADER & STATS */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 shrink-0">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/30">
              <Terminal className="text-cyan-400" size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Pioneer Command</h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1 italic">Gestion des Accès & Flux MT5</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
            <button 
              onClick={() => setActiveTab('USERS')}
              className={`px-4 py-2 rounded-xl border flex flex-col transition-all ${activeTab === 'USERS' ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-slate-950 border-white/5'}`}
            >
              <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1 flex items-center gap-1"><Users size={8} /> Pionniers</span>
              <span className={`text-lg font-black italic ${activeTab === 'USERS' ? 'text-cyan-400' : 'text-slate-400'}`}>{stats.totalUsers}</span>
            </button>
            <button 
              onClick={() => setActiveTab('LICENSES')}
              className={`px-4 py-2 rounded-xl border flex flex-col transition-all ${activeTab === 'LICENSES' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-950 border-white/5'}`}
            >
              <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1 flex items-center gap-1"><Key size={8} /> Licences</span>
              <span className={`text-lg font-black italic ${activeTab === 'LICENSES' ? 'text-emerald-400' : 'text-slate-400'}`}>{licenses.length}</span>
            </button>
            <div className="px-4 py-2 bg-slate-950 rounded-xl border border-white/5 flex flex-col">
              <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1 flex items-center gap-1"><DollarSign size={8} /> Equity</span>
              <span className="text-lg font-black italic text-emerald-400">${(stats.totalEquity / 1000000).toFixed(1)}M</span>
            </div>
            <button onClick={onClose} className="px-4 items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
              <X size={16} className="mr-2" /> Fermer
            </button>
          </div>
        </header>

        {/* CONTROLS & SEARCH */}
        <div className="flex flex-col md:flex-row gap-4 shrink-0 items-center">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher par ID ou Email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-white/5 p-4 pl-12 rounded-xl text-xs outline-none focus:border-cyan-500/30" 
            />
          </div>
          
          <div className="flex items-center gap-3 bg-slate-900/40 p-2 rounded-xl border border-white/5">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Places Restantes:</label>
            <input 
              type="number" 
              value={remainingSpots}
              onChange={(e) => setRemainingSpotsState(parseInt(e.target.value))}
              className="w-20 bg-black border border-white/10 p-2 rounded-lg text-xs text-center text-cyan-400 outline-none"
            />
            <button onClick={handleUpdateSpots} className="p-2 bg-cyan-600/20 text-cyan-400 rounded-lg hover:bg-cyan-600 hover:text-black transition-all">
              <Save size={16} />
            </button>
          </div>

          <button 
            onClick={exportToCSV}
            className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center gap-3 border border-white/10 transition-all"
          >
            <Download size={18} /> EXPORT CSV
          </button>

          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl flex items-center gap-3 shadow-lg transition-all"
          >
            <Plus size={18} /> NOUVEAU PIONNIER
          </button>
        </div>

        {/* MAIN MONITORING TABLE */}
        <div className="flex-1 glass-panel rounded-[2.5rem] border border-white/5 bg-slate-900/20 overflow-hidden flex flex-col shadow-2xl">
          <div className="overflow-x-auto scrollbar-hide">
            {activeTab === 'USERS' ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-slate-950/50">
                    <th className="px-8 py-5 text-[9px] font-black uppercase text-slate-500 tracking-widest">Trader / ID</th>
                    <th className="px-6 py-5 text-[9px] font-black uppercase text-slate-500 tracking-widest">Statut</th>
                    <th className="px-6 py-5 text-[9px] font-black uppercase text-slate-500 tracking-widest">Inscription</th>
                    <th className="px-6 py-5 text-[9px] font-black uppercase text-slate-500 tracking-widest">Flux MT5</th>
                    <th className="px-6 py-5 text-[9px] font-black uppercase text-slate-500 tracking-widest">MHI Score</th>
                    <th className="px-8 py-5 text-[9px] font-black uppercase text-slate-500 tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className={`group hover:bg-white/5 transition-all ${user.status === 'SUSPENDED' ? 'border-l-4 border-l-red-600 bg-red-500/5' : user.status === 'PENDING' ? 'border-l-4 border-l-amber-500 bg-amber-500/5' : 'border-l-4 border-l-emerald-500'}`}>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-black italic tracking-wider uppercase text-white">{user.id}</span>
                          <span className="text-[9px] text-slate-500 font-bold lowercase">{user.email || 'Pas d\'email'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          {user.status === 'ACTIVE' ? (
                            <div className="flex items-center gap-2 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                              <CheckCircle2 size={10} className="text-emerald-400" />
                              <span className="text-[9px] font-black text-emerald-400 uppercase">ACTIVÉ</span>
                            </div>
                          ) : user.status === 'PENDING' ? (
                            <div className="flex items-center gap-2 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                              <RefreshCw size={10} className="text-amber-400 animate-spin" />
                              <span className="text-[9px] font-black text-amber-400 uppercase">EN ATTENTE</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 px-2 py-1 rounded bg-red-500/10 border border-red-500/20">
                              <ShieldAlert size={10} className="text-red-500" />
                              <span className="text-[9px] font-black text-red-500 uppercase">SUSPENDU</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-[10px] font-bold text-slate-400">
                          {new Date(user.registrationDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${user.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                            <span className="text-[10px] font-mono font-bold text-white">${user.lastBalance.toLocaleString()}</span>
                          </div>
                          <span className="text-[8px] text-slate-600 uppercase font-black tracking-tighter">{user.platform} NODE active</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-12 h-1 bg-slate-950 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-1000 ${user.mhiScore < 30 ? 'bg-red-500' : user.mhiScore < 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                style={{ width: `${user.mhiScore}%` }} 
                              />
                           </div>
                           <span className={`text-[10px] font-black ${user.mhiScore < 30 ? 'text-red-500' : 'text-slate-400'}`}>{user.mhiScore}%</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          {user.status !== 'ACTIVE' && (
                            <button 
                              onClick={() => updateUserStatus(user.id, 'ACTIVE')}
                              className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition-all"
                              title="Approuver"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                          )}
                          {user.status === 'ACTIVE' && (
                            <button 
                              onClick={() => updateUserStatus(user.id, 'SUSPENDED')}
                              className="p-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                              title="Révoquer / Suspendre"
                            >
                              <XCircle size={16} />
                            </button>
                          )}
                          <button 
                            onClick={() => openExtensionModal(user)}
                            className="p-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-white rounded-lg transition-all"
                            title="Modifier Expiration"
                          >
                            <Calendar size={16} />
                          </button>
                          <button 
                            onClick={() => deleteUser(user.id)}
                            className="p-2 bg-slate-900 border border-white/10 text-slate-500 hover:bg-red-950 hover:text-red-500 hover:border-red-500/50 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-slate-950/50">
                    <th className="px-8 py-5 text-[9px] font-black uppercase text-slate-500 tracking-widest">Licence Key</th>
                    <th className="px-6 py-5 text-[9px] font-black uppercase text-slate-500 tracking-widest">Trader ID</th>
                    <th className="px-6 py-5 text-[9px] font-black uppercase text-slate-500 tracking-widest">Compte MT5</th>
                    <th className="px-6 py-5 text-[9px] font-black uppercase text-slate-500 tracking-widest">Date Création</th>
                    <th className="px-6 py-5 text-[9px] font-black uppercase text-slate-500 tracking-widest">Statut</th>
                    <th className="px-8 py-5 text-[9px] font-black uppercase text-slate-500 tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {licenses.filter(l => 
                    l.key.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    l.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    l.accountNumber?.includes(searchTerm)
                  ).map((license) => (
                    <tr key={license.id} className="group hover:bg-white/5 transition-all">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <Key size={14} className="text-emerald-500" />
                          <span className="text-sm font-mono font-black text-white tracking-wider">{license.key}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{license.userId}</span>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-sm font-mono font-bold text-white">{license.accountNumber || '---'}</span>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-[10px] font-bold text-slate-500">
                          {new Date(license.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        {license.status === 'ACTIVE' ? (
                          <div className="flex items-center gap-2 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 w-fit">
                            <CheckCircle2 size={10} className="text-emerald-400" />
                            <span className="text-[9px] font-black text-emerald-400 uppercase">VALIDE</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-2 py-1 rounded bg-red-500/10 border border-red-500/20 w-fit">
                            <XCircle size={10} className="text-red-500" />
                            <span className="text-[9px] font-black text-red-500 uppercase">RÉVOQUÉ</span>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        {license.status === 'ACTIVE' && (
                          <button 
                            onClick={() => handleRevokeLicense(license.id)}
                            className="p-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                            title="Révoquer la licence"
                          >
                            <ShieldAlert size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {licenses.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-20">
                          <FileCode size={48} />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Aucune licence générée</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* MODAL EXTENSION LICENCE */}
        {editingUserId && (
          <div className="fixed inset-0 z-[3100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in">
             <div className="max-w-md w-full glass-panel p-10 rounded-[2.5rem] border border-cyan-500/30 shadow-2xl space-y-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-xl">
                    <Calendar className="text-cyan-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase italic text-white tracking-tighter">Extension Protocol</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{editingUserId}</p>
                  </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase text-cyan-400 tracking-widest block">Nouvelle Date d'Expiration</label>
                   <input 
                    type="date" 
                    value={newExpiryDate}
                    onChange={(e) => setNewExpiryDate(e.target.value)}
                    className="w-full bg-slate-900 p-5 rounded-xl border border-white/10 text-white outline-none focus:border-cyan-500/50"
                   />
                </div>

                <div className="flex gap-4">
                   <button onClick={() => setEditingUserId(null)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">Annuler</button>
                   <button onClick={handleSaveExtension} className="flex-[2] py-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg flex items-center justify-center gap-2">
                     <Save size={16} /> VALIDER L'EXTENSION
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* MODAL AJOUT NŒUD */}
        {showAddModal && (
          <div className="fixed inset-0 z-[3100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in">
             <div className="max-w-lg w-full glass-panel p-10 rounded-[3rem] border border-emerald-500/30 shadow-2xl">
                <form onSubmit={handleCreateNode} className="space-y-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-black uppercase italic text-white tracking-tighter">Nouveau Nœud Trader</h3>
                      <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Initialisation de canal esclave</p>
                    </div>
                    <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-600 ml-2">THALAMUS_ID (PSEUDO)</label>
                      <input required type="text" value={newUserData.id} onChange={e => setNewUserData({...newUserData, id: e.target.value})} placeholder="ex: ALPHA-88" className="w-full bg-slate-900 p-4 rounded-xl border border-white/5 text-white text-xs outline-none focus:border-emerald-500/30" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-600 ml-2">EMAIL</label>
                      <input required type="email" value={newUserData.email} onChange={e => setNewUserData({...newUserData, email: e.target.value})} placeholder="trader@thalamus.ai" className="w-full bg-slate-900 p-4 rounded-xl border border-white/5 text-white text-xs outline-none focus:border-emerald-500/30" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-600 ml-2">CAPITAL ($)</label>
                      <input required type="number" value={newUserData.balance} onChange={e => setNewUserData({...newUserData, balance: e.target.value})} className="w-full bg-slate-900 p-4 rounded-xl border border-white/5 text-white text-xs outline-none focus:border-emerald-500/30" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-600 ml-2">EXPIRATION</label>
                      <input required type="date" value={newUserData.expiry} onChange={e => setNewUserData({...newUserData, expiry: e.target.value})} className="w-full bg-slate-900 p-4 rounded-xl border border-white/5 text-white text-xs outline-none focus:border-emerald-500/30" />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl shadow-xl flex items-center justify-center gap-3 italic transition-all active:scale-95">
                    GÉNÉRER L'ACCÈS NEURAL <ArrowRight size={16} />
                  </button>
                </form>
             </div>
          </div>
        )}

        {/* FOOTER ALERT */}
        <footer className="shrink-0 py-4 px-8 bg-red-600/10 border border-red-500/20 rounded-2xl flex items-center justify-between">
           <div className="flex items-center gap-3">
              <AlertTriangle size={18} className="text-red-500 animate-pulse" />
              <span className="text-[10px] font-black text-red-400 uppercase tracking-widest italic">ROOT ACCESS : Toute action est définitive et appliquée instantanément aux terminaux esclaves.</span>
           </div>
           <div className="text-[8px] font-black text-slate-600 uppercase">Version 33.6 Stable - Kernel: OBA_781</div>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;
