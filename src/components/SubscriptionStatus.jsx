import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

const PIX_KEY = '12991320781';
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(PIX_KEY)}`;

export default function SubscriptionStatus() {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 flex flex-col items-center text-center gap-3">
      <p className="font-syne font-bold text-base text-foreground">💚 Apoie o Projeto</p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        O app é gratuito! Se quiser ajudar a manter no ar, mande um PIX de <span className="text-primary font-semibold">R$ 10,00</span> — é 10 a 1 pra fortalecer. 🌱
      </p>
      <div className="bg-white rounded-2xl p-3 shadow-md">
        <img src={QR_URL} alt="QR Code PIX" className="w-44 h-44" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Chave PIX (celular)</p>
        <p className="font-mono text-sm text-foreground select-all mt-0.5">{PIX_KEY}</p>
      </div>
      <p className="text-xs text-muted-foreground">Obrigado pelo apoio! 🙏</p>
    </div>
  );
}