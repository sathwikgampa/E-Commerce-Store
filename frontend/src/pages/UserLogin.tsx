import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Heart, Package, Store } from 'lucide-react';
import { toast } from 'sonner';
import { Field, Input } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { STORE } from '../components/landing/landingData';
import { cn } from '../lib/utils';

type Errors = Partial<Record<'name' | 'email' | 'password', string>>;

const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const validate = (): Errors => {
    const next: Errors = {};
    if (!isLogin && !name.trim()) next.name = 'Enter your full name.';
    if (!email.trim()) next.email = 'Enter your email address.';
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Enter your password.';
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    if (isLogin) {
      toast.success('Welcome back to Sri Thirumala Store!');
      navigate('/dashboard');
    } else {
      toast.success('Account created', { description: 'You can now sign in using your credentials.' });
      setIsLogin(true);
      setPassword('');
    }
  };

  const switchMode = (login: boolean) => {
    setIsLogin(login);
    setErrors({});
  };

  return (
    <div className="mx-auto grid max-w-store gap-10 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-16">
      {/* Editorial side panel */}
      <aside className="hidden flex-col justify-between rounded-2xl bg-store-charcoal p-10 text-white lg:flex">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">Sri Thirumala · Kamareddy</p>
          <h2 className="mt-6 text-balance font-serif text-[40px] font-semibold leading-[1.05] tracking-tight">
            Every textbook for the year, in one place.
          </h2>
        </div>
        <ul className="space-y-4 text-[15px] text-white/80">
          <li className="flex gap-3"><Package className="mt-0.5 h-5 w-5 shrink-0 text-store-coral" aria-hidden="true" /> Track your orders and pickups</li>
          <li className="flex gap-3"><Heart className="mt-0.5 h-5 w-5 shrink-0 text-store-coral" aria-hidden="true" /> Keep a wishlist for the new term</li>
          <li className="flex gap-3"><Store className="mt-0.5 h-5 w-5 shrink-0 text-store-coral" aria-hidden="true" /> Collect from {STORE.address.split(',')[0]}</li>
        </ul>
      </aside>

      {/* Form */}
      <div className="mx-auto w-full max-w-md lg:py-6">
        <div role="tablist" aria-label="Account" className="grid grid-cols-2 rounded-lg bg-store-accent-dark p-1">
          {[
            { label: 'Sign in', value: true },
            { label: 'Create account', value: false },
          ].map((tab) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={isLogin === tab.value}
              onClick={() => switchMode(tab.value)}
              className={cn(
                'h-10 rounded-md text-[14px] font-medium transition-colors',
                isLogin === tab.value ? 'bg-white text-store-charcoal shadow-card' : 'text-store-charcoal-light hover:text-store-charcoal'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <h1 className="mt-8 font-serif text-[32px] font-semibold tracking-tight text-store-charcoal">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-2 text-[15px] text-store-charcoal-light">
          {isLogin ? 'Sign in to see your orders, pickups and saved books.' : 'Save textbooks and keep track of your orders.'}
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          {!isLogin && (
            <Field label="Full name" required error={errors.name}>
              {(a) => <Input {...a} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />}
            </Field>
          )}
          <Field label="Email address" required error={errors.email}>
            {(a) => (
              <Input {...a} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            )}
          </Field>
          <Field label="Password" required error={errors.password}>
            {(a) => (
              <div className="relative">
                <Input
                  {...a}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-1 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-store-charcoal-light hover:bg-store-accent hover:text-store-charcoal"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            )}
          </Field>
          <Button type="submit" size="lg" fullWidth>
            {isLogin ? 'Sign in' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-[13px] text-store-charcoal-light">
          School or college? Use the{' '}
          <Link to="/portal/login" className="font-medium text-store-primary underline-offset-4 hover:underline">institution portal</Link>.
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
