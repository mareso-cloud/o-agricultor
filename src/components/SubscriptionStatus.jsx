import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function SubscriptionStatus() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return <div className="p-4 text-center">Carregando...</div>;
  if (!user) return null;

  const isActive = user.subscription_status === 'active';
  const isPending = user.subscription_status === 'pending';

  return (
    <div className="p-6 rounded-2xl border border-border/50 bg-card">
      <div className="flex items-start gap-4">
        {isActive ? (
          <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
        ) : isPending ? (
          <Clock className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
        ) : (
          <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
        )}
        
        <div className="flex-1">
          <h3 className="font-syne font-bold text-lg mb-1">
            {isActive && 'Assinatura Ativa'}
            {isPending && 'Assinatura Pendente'}
            {!isActive && !isPending && 'Assinatura Inativa'}
          </h3>
          
          {isActive && user.subscription_expires && (
            <p className="text-sm text-muted-foreground mb-3">
              Válida até {format(new Date(user.subscription_expires), 'dd/MM/yyyy')}
            </p>
          )}
          
          {isPending && (
            <p className="text-sm text-yellow-400 mb-3">
              Aguardando confirmação do pagamento (PIX)
            </p>
          )}
          
          {!isActive && !isPending && (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Apoie o projeto com R$ 10/mês via PIX e tenha acesso completo ao app! É 10 a 1 pra fortalecer. 🌱
              </p>
              <div className="bg-card/80 border border-border/40 rounded-xl p-4 mb-4">
                <p className="text-xs text-muted-foreground mb-2">Chave PIX (Celular):</p>
                <p className="font-mono text-sm text-foreground select-all">12991320781</p>
                <p className="text-xs text-muted-foreground mt-2">Valor: R$ 10,00 / mês</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Após enviar o PIX, entre em contato informando seu e-mail para ativar o acesso.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}