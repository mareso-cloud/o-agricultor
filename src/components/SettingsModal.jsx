import { useState, useEffect } from 'react';
import { X, User, Mail, Camera, Upload, Trash2, LogOut } from 'lucide-react';
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

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'EXCLUIR') return;
    await base44.auth.deleteMe();
    window.location.reload();
  };

  const tabs = [
    { key: 'perfil', label: 'Perfil', emoji: '👤' },
    { key: 'conta', label: 'Conta', emoji: '⚙️' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-card rounded-t-3xl sm:rounded-2xl border border-border/60 animate-fade-in">

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
              className={`flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-medium transition-all border ${tab === t.key ? 'bg-primary/15 border-primary/40 text-primary' : 'border-border/50 text-muted-foreground hover:text-foreground hover:border-border'}`}>
              <span>{t.emoji}</span> {t.label}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">

          {tab === 'perfil' && (
            <>
              {/* Avatar */}
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

              {/* Nome */}
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Nome completo</Label>
                <Input value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="Seu nome" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
              </div>

              {/* Email (read-only) */}
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">E-mail</Label>
                <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-border/40 bg-muted/30 text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{user?.email || '—'}</span>
                </div>
              </div>
            </>
          )}

          {tab === 'conta' && (
            <>
              {/* Logout */}
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

              {/* Delete Account */}
              <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <p className="text-sm font-semibold text-red-300">Excluir minha conta</p>
                </div>
                <p className="text-xs text-muted-foreground">Esta ação é permanente e não pode ser desfeita. Todos os seus dados serão apagados.</p>
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