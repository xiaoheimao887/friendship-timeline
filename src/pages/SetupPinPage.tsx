import { useState } from 'react';
import { sha256 } from '../utils/crypto';
import { useFriendStore } from '../store/useFriendStore';

interface SetupPinPageProps {
  onComplete: () => void;
}

export function SetupPinPage({ onComplete }: SetupPinPageProps) {
  const [mode, setMode] = useState<'login' | 'setup'>('login');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loadFriends, setPinHash } = useFriendStore();

  const handleSubmit = async () => {
    setError('');

    if (pin.length < 4 || pin.length > 6) {
      setError('PIN 码为 4-6 位数字');
      return;
    }

    if (mode === 'setup' && pin !== confirmPin) {
      setError('两次输入的 PIN 码不一致');
      return;
    }

    setLoading(true);
    try {
      const hash = await sha256(pin);
      setPinHash(hash);
      await loadFriends(hash);
      onComplete();
    } catch (err) {
      setError('验证失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg flex items-center justify-center px-4">
      <div className="bg-white rounded-card p-8 shadow-card max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🤝</div>
          <h1 className="text-xl font-semibold text-warm-text">友谊时间线</h1>
          <p className="text-sm text-warm-muted mt-1">记录每一段相遇</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 rounded-btn text-sm transition-colors ${
              mode === 'login' ? 'bg-warm-primary text-white' : 'bg-warm-bg text-warm-muted'
            }`}
          >
            登录
          </button>
          <button
            onClick={() => { setMode('setup'); setError(''); setConfirmPin(''); }}
            className={`flex-1 py-2 rounded-btn text-sm transition-colors ${
              mode === 'setup' ? 'bg-warm-primary text-white' : 'bg-warm-bg text-warm-muted'
            }`}
          >
            首次设置
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-warm-text mb-1">PIN 码</label>
            <input
              type="password"
              value={pin}
              onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
              className="w-full px-4 py-3 rounded-btn border border-warm-border bg-warm-bg focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary text-center text-lg tracking-widest transition-colors"
              placeholder="输入 4-6 位 PIN"
              maxLength={6}
              inputMode="numeric"
              autoFocus
            />
          </div>

          {mode === 'setup' && (
            <div>
              <label className="block text-sm font-medium text-warm-text mb-1">确认 PIN 码</label>
              <input
                type="password"
                value={confirmPin}
                onChange={e => { setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
                className="w-full px-4 py-3 rounded-btn border border-warm-border bg-warm-bg focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary text-center text-lg tracking-widest transition-colors"
                placeholder="再次输入 PIN"
                maxLength={6}
                inputMode="numeric"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading || pin.length < 4}
            className="w-full py-3 rounded-btn bg-warm-primary text-white hover:bg-warm-primary/90 transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? '验证中...' : mode === 'setup' ? '开始使用' : '登录'}
          </button>

          <p className="text-xs text-warm-muted text-center leading-relaxed">
            PIN 码仅用于加密保护你的数据，请牢记你的 PIN 码，忘记后将无法找回数据。
          </p>
        </div>
      </div>
    </div>
  );
}
