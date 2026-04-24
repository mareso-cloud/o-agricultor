import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminSubscriptions() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await base44.entities.User.list('-created_date');
      setUsers(allUsers);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const approveSubscription = async (userId) => {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    
    await base44.entities.User.update(userId, {
      subscription_status: 'active',
      subscription_expires: expiryDate.toISOString().split('T')[0]
    });
    
    setUsers(u => u.map(user => 
      user.id === userId 
        ? { ...user, subscription_status: 'active', subscription_expires: expiryDate.toISOString().split('T')[0] }
        : user
    ));
  };

  const rejectSubscription = async (userId) => {
    await base44.entities.User.update(userId, {
      subscription_status: 'inactive',
      subscription_expires: null
    });
    
    setUsers(u => u.map(user => 
      user.id === userId 
        ? { ...user, subscription_status: 'inactive', subscription_expires: null }
        : user
    ));
  };

  const pendingUsers = users.filter(u => u.subscription_status === 'pending');
  const activeUsers = users.filter(u => u.subscription_status === 'active');
  const inactiveUsers = users.filter(u => u.subscription_status === 'inactive');

  if (loading) return <div className="p-6 text-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-syne text-3xl font-bold mb-2">Gerenciar Assinaturas</h1>
        <p className="text-muted-foreground mb-8">Aprove ou rejeite pagamentos de usuários</p>

        {/* Pendentes */}
        {pendingUsers.length > 0 && (
          <div className="mb-8">
            <h2 className="font-syne text-xl font-bold text-yellow-400 mb-4">⏳ Pendentes ({pendingUsers.length})</h2>
            <div className="space-y-3">
              {pendingUsers.map(user => (
                <UserRow key={user.id} user={user} onApprove={approveSubscription} onReject={rejectSubscription} />
              ))}
            </div>
          </div>
        )}

        {/* Ativas */}
        {activeUsers.length > 0 && (
          <div className="mb-8">
            <h2 className="font-syne text-xl font-bold text-green-500 mb-4">✓ Ativas ({activeUsers.length})</h2>
            <div className="space-y-3">
              {activeUsers.map(user => (
                <UserRow key={user.id} user={user} onApprove={approveSubscription} onReject={rejectSubscription} />
              ))}
            </div>
          </div>
        )}

        {/* Inativas */}
        {inactiveUsers.length > 0 && (
          <div>
            <h2 className="font-syne text-xl font-bold text-muted-foreground mb-4">✗ Inativas ({inactiveUsers.length})</h2>
            <div className="space-y-3">
              {inactiveUsers.map(user => (
                <UserRow key={user.id} user={user} onApprove={approveSubscription} onReject={rejectSubscription} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UserRow({ user, onApprove, onReject }) {
  const statusIcon = {
    active: <Check className="w-4 h-4 text-green-500" />,
    pending: <Clock className="w-4 h-4 text-yellow-500" />,
    inactive: <X className="w-4 h-4 text-red-500" />
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card">
      <div className="flex items-center gap-3 flex-1">
        {statusIcon[user.subscription_status]}
        <div>
          <p className="font-semibold text-foreground">{user.full_name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {user.subscription_expires && (
        <div className="text-right mr-4">
          <p className="text-sm text-muted-foreground">Expires:</p>
          <p className="text-sm font-mono text-foreground">
            {format(new Date(user.subscription_expires), 'dd/MM/yyyy')}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">
        {user.subscription_status !== 'active' && (
          <Button
            onClick={() => onApprove(user.id)}
            className="h-9 px-3 bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-600/40"
          >
            Aprovar
          </Button>
        )}
        {user.subscription_status !== 'inactive' && (
          <Button
            onClick={() => onReject(user.id)}
            className="h-9 px-3 bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/40"
          >
            Rejeitar
          </Button>
        )}
      </div>
    </div>
  );
}