import React, { useState } from 'react';
import { useNavigate, Link, Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { AlertCircle, ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { VenkateshwaraNamamIcon } from '../../components/icons/VenkateshwaraIcons';
import { verifyAdminCredentials, createAdminSession, isAdminAuthenticated } from '../../config/adminAuth';
import { Field, Input } from '../../components/ui/Field';
import { Button } from '../../components/ui/Button';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (isAdminAuthenticated()) return <Navigate to={from} replace />;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setAuthError('Enter your administrator ID and password.');
      return;
    }
    setIsLoading(true);
    setAuthError(null);

    setTimeout(() => {
      if (verifyAdminCredentials(username, password)) {
        createAdminSession();
        toast.success('Signed in');
        navigate(from, { replace: true });
      } else {
        setAuthError('Those credentials are not recognised. Check the ID and password and try again.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="app-admin flex min-h-screen flex-col bg-admin-canvas px-5 py-8">
      <Link to="/home" className="inline-flex items-center gap-1.5 self-start text-[14px] font-medium text-slate-600 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Storefront
      </Link>

      <div className="mx-auto my-auto w-full max-w-sm py-10">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-deep">
            <VenkateshwaraNamamIcon className="h-6 w-6" />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-semibold text-slate-900">Sri Thirumala</span>
            <span className="block text-[12px] text-slate-500">Store administration</span>
          </span>
        </div>

        <div className="mt-8 rounded-xl border border-admin-line bg-white p-6 sm:p-7">
          <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">Staff sign in</h1>
          <p className="mt-1 text-[14px] text-slate-600">Inventory, orders and pickup management.</p>

          {authError && (
            <div role="alert" className="mt-5 flex gap-2.5 rounded-lg bg-rose-50 px-3.5 py-3 text-[13px] text-rose-800 ring-1 ring-rose-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} noValidate className="mt-5 space-y-4">
            <Field label="Administrator ID or email">
              {(a) => (
                <Input {...a} autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} aria-invalid={!!authError || undefined} />
              )}
            </Field>
            <Field label="Password">
              {(a) => (
                <div className="relative">
                  <Input
                    {...a}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!authError || undefined}
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-1 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              )}
            </Field>
            <Button type="submit" variant="admin-primary" size="lg" fullWidth isLoading={isLoading}>
              {isLoading ? 'Checking…' : 'Sign in'}
            </Button>
          </form>
        </div>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-[12px] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Authorised staff only · sessions expire after 24 hours
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
