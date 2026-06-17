import { useState } from 'react';
import { sha256 } from '../utils/crypto';
import { getAuthByPinHash, createAuth } from '../services/authService';
import { useFriendStore } from '../store/useFriendStore';

interface SetupPinPageProps {
  onComplete: () => void;
}

export function SetupPinPage({ onComplete }: SetupPinPageProps) {
  const [mode, setMode] = useState<'login' | 'setup'>('login');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinKey, setPinKey] = useState('');
  const [confirmPinKey, setConfirmPinKey] = useState('');
  const [step, setStep] = useState<'pin' | 'key'>('pin');
  const [pinHashTemp, setPinHashTemp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loadFriends, setPinHash } = useFriendStore();

  const handlePinSubmit = async () => {
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

      if (mode === 'login') {
        // Check if this PIN exists
        const auth = await getAuthByPinHash(hash);
        if (!auth) {
          setError('该 PIN 码尚未注册，请先切换到"首次设置"');
          setLoading(false);
          return;
        }
        if (auth.pin_key_hash) {
          // Has secondary password, go to step 2
          setPinHashTemp(hash);
          setStep('key');
          setLoading(false);
          return;
        }
        // No secondary password, proceed
        setPinHash(hash);
        await loadFriends(hash);
        onComplete();
      } else {
        // Setup mode: check if PIN is already taken
        const existing = await getAuthByPinHash(hash);
        if (existing) {
          setError('该 PIN 码已被使用，请更换其他 PIN');
          setLoading(false);
          return;
        }
        // Save pin hash temporarily, ask for secondary password
        setPinHashTemp(hash);
        setStep('key');
        setLoading(false);
      }
    } catch (err) {
      setError('验证失败，请重试');
      setLoading(false);
    }
  };

  const handleKeySubmit = async () => {
    setError('');

    if (pinKey.length < 4) {
      setError('二级密码至少 4 位');
      return;
    }

    if (mode === 'setup' && pinKey !== confirmPinKey) {
      setError('两次输入的二级密码不一致');
      return;
    }

    setLoading(true);
    try {
      const keyHash = await sha256(pinKey);

      if (mode === 'login') {
        // Verify secondary password
        const auth = await getAuthByPinHash(pinHashTemp);
        if (!auth || auth.pin_key_hash !== keyHash) {
          setError('二级密码错误');
          setLoading(false);
          return;
        }
        setPinHash(pinHashTemp);
        await loadFriends(pinHashTemp);
        onComplete();
      } else {
        // Save secondary password to Supabase
        await createAuth({ pin_hash: pinHashTemp, pin_key_hash: keyHash });
        setPinHash(pinHashTemp);
        await loadFriends(pinHashTemp);
        onComplete();
      }
    } catch (err) {
      setError('保存失败，请重试');
      setLoading(false);
    }
  };

  // Step 2: Secondary password
  if (step === 'key') {
    return (
      <div className="min-h-screen bg-warm-bg flex items-center justify-center px-4">
        <div className="bg-white rounded-card p-8 shadow-card max-w-sm w-full">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🔐</div>
            <h1 className="text-xl font-semibold text-warm-text">二级密码</h1>
            <p className="text-sm text-warm-muted mt-1">
              {mode === 'setup' ? '设置二级密码以保护你的数据' : '请输入二级密码'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warm-text mb-1">二级密码</label>
              <input
                type="password"
                value={pinKey}
                onChange={e => { setPinKey(e.target.value); setError(''); }}
                onKeyDown={e => { if (e.key === 'Enter') handleKeySubmit(); }}
                className="w-full px-4 py-3 rounded-btn border border-warm-border bg-warm-bg focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary text-center text-lg tracking-widest transition-colors"
                placeholder="输入二级密码"
                autoFocus
              />
            </div>

            {mode === 'setup' && (
              <div>
                <label className="block text-sm font-medium text-warm-text mb-1">确认二级密码</label>
                <input
                  type="password"
                  value={confirmPinKey}
                  onChange={e => { setConfirmPinKey(e.target.value); setError(''); }}
                  onKeyDown={e => { if (e.key === 'Enter') handleKeySubmit(); }}
                  className="w-full px-4 py-3 rounded-btn border border-warm-border bg-warm-bg focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary text-center text-lg tracking-widest transition-colors"
                  placeholder="再次输入二级密码"
                />
              </div>
            )}

            {error && <p className="text-sm text-red-400 text-center">{error}</p>}

            <button
              onClick={handleKeySubmit}
              disabled={loading || pinKey.length < 4}
              className="w-full py-3 rounded-btn bg-warm-primary text-white hover:bg-warm-primary/90 transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? '验证中...' : '确认'}
            </button>

            <button
              onClick={() => { setStep('pin'); setPinKey(''); setConfirmPinKey(''); setError(''); }}
              className="w-full py-2 text-sm text-warm-muted hover:text-warm-primary transition-colors"
            >
              返回上一步
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: PIN code
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
            onClick={() => { setMode('login'); setStep('pin'); setError(''); setPinKey(''); setConfirmPinKey(''); }}
            className={`flex-1 py-2 rounded-btn text-sm transition-colors ${
              mode === 'login' ? 'bg-warm-primary text-white' : 'bg-warm-bg text-warm-muted'
            }`}
          >
            登录
          </button>
          <button
            onClick={() => { setMode('setup'); setStep('pin'); setError(''); setConfirmPin(''); setPinKey(''); setConfirmPinKey(''); }}
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
              onKeyDown={e => { if (e.key === 'Enter') handlePinSubmit(); }}
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
                onKeyDown={e => { if (e.key === 'Enter') handlePinSubmit(); }}
                className="w-full px-4 py-3 rounded-btn border border-warm-border bg-warm-bg focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary text-center text-lg tracking-widest transition-colors"
                placeholder="再次输入 PIN"
                maxLength={6}
                inputMode="numeric"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <button
            onClick={handlePinSubmit}
            disabled={loading || pin.length < 4}
            className="w-full py-3 rounded-btn bg-warm-primary text-white hover:bg-warm-primary/90 transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? '验证中...' : '下一步'}
          </button>

          <p className="text-xs text-warm-muted text-center leading-relaxed">
            PIN 码仅用于加密保护你的数据，请牢记你的 PIN 码，忘记后将无法找回数据。
          </p>
        </div>
      </div>
    </div>
  );
}
