import { useState, useEffect } from 'react';
import { X, User, Upload, LogOut, Trash2, Mail, Lock, ChevronRight, Heart } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const PIX_KEY = '12991320781';
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(PIX_KEY)}`;

export default function SettingsModal({ onClose }) {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setFullName(u.full_name || '');
      setPhotoUrl(u.photo_url || '');
    });
  }, []);

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setPhotoUrl(file_url);
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');
    await base44.auth.updateMe({ full_name: fullName, photo_url: photoUrl });
    setSaving(false);
    setSaveMsg('Salvo!');
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) { setPasswordMsg('As senhas novas não coincidem.'); return; }
    if (newPassword.length < 6) { setPasswordMsg('Mínimo 6 caracteres.'); return; }
    setSavingPassword(true);
    setPasswordMsg('');
    try {
      await base44.auth.changePassword({ current_password: currentPassword, new_password: newPassword });
      setPasswordMsg('✅ Senha alterada!');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setTimeout(() => { setPasswordMsg(''); setShowChangePassword(false); }, 2000);
    } catch {
      setPasswordMsg('❌ Senha atual incorreta.');
    }
    setSavingPassword(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'EXCLUIR') return;
    await base44.auth.deleteMe();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl"
        style={{ background: '#0d1117', border: '1px solid rgba(34,197,94,0.15)' }}>

        {/* Handle bar mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="font-syne font-bold text-lg text-white">Configurações</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-8">

          {/* ── CONTA ── */}
          <section>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Conta</p>

            {/* Avatar + Nome + Email */}
            <div className="flex items-center gap-4 mb-5">
              <label className="cursor-pointer relative group flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                  {photoUrl
                    ? <img src={photoUrl} alt="foto" className="w-full h-full object-cover" />
                    : <User className="w-7 h-7 text-white/30" />}
                </div>
                <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} disabled={uploading} />
              </label>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{fullName || 'Seu nome'}</p>
                <p className="text-white/40 text-sm truncate">{user?.email || '—'}</p>
                {uploading && <p className="text-primary text-xs mt-1">Enviando foto...</p>}
              </div>
            </div>

            {/* Campo nome */}
            <div className="space-y-3">
              <FieldGroup icon={<User className="w-4 h-4" />} label="Nome">
                <input
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/25"
                />
              </FieldGroup>

              <FieldGroup icon={<Mail className="w-4 h-4" />} label="E-mail">
                <span className="text-white/40 text-sm">{user?.email || '—'}</span>
              </FieldGroup>

              <FieldGroup icon={<Lock className="w-4 h-4" />} label="Senha">
                <input type="password" placeholder="••••••••"
                  className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/25 cursor-not-allowed"
                  disabled
                  title="Para alterar a senha, use a opção abaixo"
                />
              </FieldGroup>
            </div>

            <button onClick={handleSave} disabled={saving || uploading}
              className="mt-4 w-full h-11 rounded-xl font-semibold text-sm text-white transition-all"
              style={{ background: 'linear-gradient(135deg, hsl(158 64% 38%), hsl(158 64% 28%))', boxShadow: '0 0 20px rgba(34,197,94,0.2)' }}>
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
            {saveMsg && <p className="text-center text-primary text-xs mt-2">{saveMsg}</p>}
          </section>

          {/* ── ALTERAR SENHA (submenu oculto) ── */}
          <section>
            <button
              onClick={() => setShowChangePassword(v => !v)}
              className="w-full flex items-center justify-between text-left group">
              <span className="text-xs text-white/35 group-hover:text-white/60 transition-all underline underline-offset-2">
                Esqueci minha senha / Alterar senha
              </span>
              <ChevronRight className={`w-3.5 h-3.5 text-white/25 transition-transform ${showChangePassword ? 'rotate-90' : ''}`} />
            </button>

            {showChangePassword && (
              <div className="mt-3 space-y-3 p-4 rounded-xl border" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }}>
                <FieldGroup icon={<Lock className="w-4 h-4" />} label="Senha atual">
                  <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="••••••••" className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/25" />
                </FieldGroup>
                <FieldGroup icon={<Lock className="w-4 h-4" />} label="Nova senha">
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••" className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/25" />
                </FieldGroup>
                <FieldGroup icon={<Lock className="w-4 h-4" />} label="Confirmar nova senha">
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/25" />
                </FieldGroup>

                {passwordMsg && (
                  <p className={`text-xs px-3 py-2 rounded-lg ${passwordMsg.startsWith('✅') ? 'text-primary bg-primary/10' : 'text-red-400 bg-red-500/10'}`}>
                    {passwordMsg}
                  </p>
                )}

                <button onClick={handleChangePassword}
                  disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
                  className="w-full h-10 rounded-xl font-semibold text-sm text-white disabled:opacity-40 transition-all"
                  style={{ background: 'linear-gradient(135deg, hsl(158 64% 38%), hsl(158 64% 28%))' }}>
                  {savingPassword ? 'Alterando...' : 'Confirmar nova senha'}
                </button>
              </div>
            )}
          </section>

          {/* ── APOIO ── */}
          <section>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Apoie o Projeto</p>
            <div className="rounded-2xl p-5 flex flex-col items-center gap-4 border border-primary/15"
              style={{ background: 'rgba(34,197,94,0.04)' }}>
              <div className="flex items-center gap-2 text-white/80">
                <Heart className="w-4 h-4 text-primary" />
                <p className="text-sm font-medium">App gratuito — contribuição voluntária</p>
              </div>
              <p className="text-xs text-white/40 text-center leading-relaxed">
                Se quiser ajudar a manter no ar, mande um PIX de <span className="text-primary font-semibold">R$ 10,00</span>. É 10 pra fortalecer! 🌱
              </p>
              <div className="bg-white rounded-xl p-2.5">
                <img src={QR_URL} alt="QR Code PIX" className="w-36 h-36" />
              </div>
              <div className="text-center">
                <p className="text-xs text-white/30">Chave PIX (celular)</p>
                <p className="font-mono text-sm text-white/80 select-all mt-0.5">{PIX_KEY}</p>
              </div>
            </div>
          </section>

          {/* ── SAIR / EXCLUIR ── */}
          <section className="space-y-3 pb-2">
            <button onClick={() => base44.auth.logout()}
              className="w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left hover:border-white/20"
              style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                <LogOut className="w-4 h-4 text-white/50" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Sair da conta</p>
                <p className="text-xs text-white/35">Encerrar sessão atual</p>
              </div>
            </button>

            <div className="rounded-xl border border-red-500/20 p-4 space-y-3" style={{ backgroundColor: 'rgba(239,68,68,0.04)' }}>
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-400" />
                <p className="text-sm font-semibold text-red-300">Excluir minha conta</p>
              </div>
              <p className="text-xs text-white/35">Esta ação é permanente e não pode ser desfeita.</p>
              {!showDeleteConfirm ? (
                <button onClick={() => setShowDeleteConfirm(true)}
                  className="w-full h-9 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-all">
                  Quero excluir minha conta
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-red-300">Digite <strong>EXCLUIR</strong> para confirmar:</p>
                  <input value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)}
                    placeholder="EXCLUIR"
                    className="w-full h-9 px-3 rounded-xl text-sm text-white outline-none border border-red-500/30"
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
                  <button onClick={handleDeleteAccount} disabled={deleteConfirmText !== 'EXCLUIR'}
                    className="w-full h-9 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all disabled:opacity-40">
                    Confirmar exclusão permanente
                  </button>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

function FieldGroup({ icon, label, children }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border"
      style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
      <span className="text-primary/60 flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/35 mb-0.5">{label}</p>
        {children}
      </div>
    </div>
  );
}