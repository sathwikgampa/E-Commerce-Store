import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Eye, EyeOff, PackageCheck, LibraryBig, Store } from 'lucide-react';
import { VenkateshwaraFullEmblem } from '../../components/icons/VenkateshwaraIcons';
import { Field, Input } from '../../components/ui/Field';
import { Button } from '../../components/ui/Button';
import { STORE } from '../../components/landing/landingData';

const CustomerPortalLogin: React.FC = () => {
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ id?: string; password?: string }>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!emailOrPhone.trim()) next.id = 'Enter your email or mobile number.';
    if (!password) next.password = 'Enter your password or PIN.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('customer_token', 'valid_student_session');
      toast.success('Welcome to the Sri Thirumala student portal');
      navigate('/portal');
    }, 350);
  };

  return (
    <div className="app-portal grid min-h-screen bg-admin-canvas lg:grid-cols-2">
      {/* Institutional panel */}
      <aside className="hidden flex-col justify-between bg-navy-deep p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-white/10 px-3 py-2"><VenkateshwaraFullEmblem className="h-8 w-24" /></span>
        </div>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-saffron">Student &amp; institution portal</p>
          <h2 className="mt-4 max-w-md text-[34px] font-semibold leading-tight tracking-tight">
            Course books, pickups and orders for schools and colleges in Kamareddy.
          </h2>
          <ul className="mt-10 space-y-4 text-[15px] text-white/80">
            <li className="flex gap-3"><PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-saffron" aria-hidden="true" /> Pickup tokens for the Station Road counter</li>
            <li className="flex gap-3"><LibraryBig className="mt-0.5 h-5 w-5 shrink-0 text-saffron" aria-hidden="true" /> Saved course and syllabus titles</li>
            <li className="flex gap-3"><Store className="mt-0.5 h-5 w-5 shrink-0 text-saffron" aria-hidden="true" /> Counter open {STORE.hours}</li>
          </ul>
        </div>
        <p className="text-[13px] text-white/50">Sri Thirumala Book Seller &amp; Stationery · Station Road, Kamareddy</p>
      </aside>

      {/* Form */}
      <div className="flex flex-col px-5 py-8 sm:px-10">
        <Link to="/home" className="inline-flex items-center gap-1.5 self-start text-[14px] font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to the bookstore
        </Link>

        <div className="mx-auto my-auto w-full max-w-sm py-10">
          <div className="mb-6 lg:hidden"><VenkateshwaraFullEmblem className="h-8 w-24" /></div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-saffron-ink">Student portal</p>
          <h1 className="mt-2 text-[28px] font-semibold tracking-tight text-slate-900">Sign in</h1>
          <p className="mt-1.5 text-[14px] text-slate-600">Use the email or mobile number registered with the store.</p>

          <form onSubmit={handleLogin} noValidate className="mt-8 space-y-5">
            <Field label="Email or mobile number" required error={errors.id}>
              {(a) => (
                <Input {...a} autoComplete="username" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} placeholder="name@college.ac.in" />
              )}
            </Field>
            <Field
              label="Password or PIN"
              required
              error={errors.password}
              labelAction={<Link to="/contact" className="text-[13px] font-medium text-navy hover:underline">Forgot it?</Link>}
            >
              {(a) => (
                <div className="relative">
                  <Input
                    {...a}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              {isLoading ? 'Signing in…' : 'Sign in to portal'}
            </Button>
          </form>

          <p className="mt-8 text-center text-[13px] text-slate-500">
            Shopping for yourself? <Link to="/login" className="font-medium text-navy hover:underline">Customer sign in</Link>
            <span aria-hidden="true"> · </span>
            <Link to="/admin/login" className="hover:underline">Staff</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerPortalLogin;
