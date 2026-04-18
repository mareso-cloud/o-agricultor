import { useState, useEffect } from 'react';
import { X, User, Mail, Camera, Upload, Trash2, LogOut, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';

export default function SettingsModal({ onClose }) {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('perfil');

  // Senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');

  // Conta
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
    await base44.auth.updateMe({ full_name: fullName, photo_url: photoUrl });
    setSaving(false);
    onClose();
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordMsg('As senhas novas não coincidem.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setSavingPassword(true);
    setPasswordMsg('');
    try {
      await base44.auth.changePassword({ current_password: currentPassword, new_password: newPassword });
      setPasswordMsg('✅ Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      setPasswordMsg('❌ Senha atual incorreta.');
    }
    setSavingPassword(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'EXCLUIR') return;
    await base44.auth.deleteMe();
    window.location.reload();
  };

  const tabs = [
    { key: 'perfil', label: 'Perfil', emoji: '👤' },
    { key: 'senha', label: 'Senha', emoji: '🔒' },
    { key: 'conta', label: 'Conta', emoji: '⚙️' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card rounded-2xl border border-border/60 animate-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/40">
          <h2 className="font-syne font-bold text-foreground">Configurações</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-4 border-b border-border/40">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 h-9 px-3 rounded-xl text-sm font-medium transition-all border ${tab === t.key ? 'bg-primary/15 border-primary/40 text-primary' : 'border-border/50 text-muted-foreground hover:text-foreground hover:border-border'}`}>
              <span>{t.emoji}</span> {t.label}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">

          {/* PERFIL */}
          {tab === 'perfil' && (
            <>
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-2xl bg-muted border border-border/50 overflow-hidden flex items-center justify-center">
                  {photoUrl ? (
                    <img src={photoUrl} alt="foto" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <label className="cursor-pointer flex items-center gap-1.5 h-8 px-3 rounded-xl border border-primary/40 text-primary bg-primary/10 hover:bg-primary/20 transition-all text-xs font-medium">
                  <Upload className="w-3.5 h-3.5" />
                  {uploading ? 'Enviando...' : 'Trocar foto'}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} disabled={uploading} />
                </label>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Nome completo</Label>
                <Input value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="Seu nome" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">E-mail</Label>
                <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-border/40 bg-muted/30 text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{user?.email || '—'}</span>
                </div>
              </div>
            </>
          )}

          {/* SENHA */}
          {tab === 'senha' && (
            <>
              <p className="text-xs text-muted-foreground">Altere sua senha de acesso ao aplicativo.</p>

              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Senha atual</Label>
                <div className="relative">
                  <Input type={showCurrent ? 'text' : 'password'} value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="••••••••" className="bg-input border-border/60 rounded-xl h-10 text-sm pr-10" />
                  <button type="button" onClick={() => setShowCurrent(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Nova senha</Label>
                <div className="relative">
                  <Input type={showNew ? 'text' : 'password'} value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••" className="bg-input border-border/60 rounded-xl h-10 text-sm pr-10" />
                  <button type="button" onClick={() => setShowNew(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Confirmar nova senha</Label>
                <Input type="password" value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
              </div>

              {passwordMsg && (
                <p className={`text-xs px-3 py-2 rounded-xl ${passwordMsg.startsWith('✅') ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-400'}`}>
                  {passwordMsg}
                </p>
              )}

              <Button onClick={handleChangePassword} disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl glow-green">
                {savingPassword ? 'Alterando...' : '🔒 Alterar senha'}
              </Button>
            </>
          )}

          {/* CONTA */}
          {tab === 'conta' && (
            <>
              <button onClick={() => base44.auth.logout()}
                className="w-full flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-all text-left">
                <div className="w-9 h-9 rounded-lg bg-muted border border-border/40 flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Sair da conta</p>
                  <p className="text-xs text-muted-foreground">Encerrar sessão atual</p>
                </div>
              </button>

              <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <p className="text-sm font-semibold text-red-300">Excluir minha conta</p>
                </div>
                <p className="text-xs text-muted-foreground">Esta ação é permanente e não pode ser desfeita.</p>
                {!showDeleteConfirm ? (
                  <button onClick={() => setShowDeleteConfirm(true)}
                    className="w-full h-9 rounded-xl border border-red-500/40 text-red-400 text-sm font-medium hover:bg-red-500/15 transition-all">
                    Quero excluir minha conta
                  </button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-red-300">Digite <strong>EXCLUIR</strong> para confirmar:</p>
                    <Input value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)}
                      placeholder="EXCLUIR" className="bg-input border-red-500/30 rounded-xl h-9 text-sm" />
                    <button onClick={handleDeleteAccount} disabled={deleteConfirmText !== 'EXCLUIR'}
                      className="w-full h-9 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                      Confirmar exclusão permanente
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {tab === 'perfil' && (
          <div className="p-5 border-t border-border/40">
            <Button onClick={handleSave} disabled={saving || uploading}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl glow-green">
              {saving ? 'Salvando...' : '✅ Salvar alterações'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}