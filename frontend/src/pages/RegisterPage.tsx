import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { Department } from '../types/auth';
import { BookOpen, User, Mail, Lock, CreditCard, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { ApiError } from '../services/apiClient';

const DEPARTMENT_OPTIONS = [
  { value: 'CSE', label: 'Computer Science and Engineering (CSE)' },
  { value: 'AI_DS', label: 'Artificial Intelligence & Data Science (AI_DS)' },
  { value: 'IT', label: 'Information Technology (IT)' },
  { value: 'ENTC', label: 'Electronics & Telecommunication (ENTC)' },
  { value: 'MECH', label: 'Mechanical Engineering (MECH)' },
  { value: 'CIVIL', label: 'Civil Engineering (CIVIL)' },
];

const SEMESTER_OPTIONS = Array.from({ length: 8 }, (_, i) => ({
  value: i + 1,
  label: `Semester ${i + 1}`,
}));

const YEAR_OPTIONS = [
  { value: 1, label: '1st Year (FE)' },
  { value: 2, label: '2nd Year (SE)' },
  { value: 3, label: '3rd Year (TE)' },
  { value: 4, label: '4th Year (BE)' },
];

export const RegisterPage: React.FC = () => {
  const { registerStudent, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [department, setDepartment] = useState<Department>('CSE');
  const [semester, setSemester] = useState<number>(1);
  const [year, setYear] = useState<number>(1);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (fullName.trim().length < 3) {
      errors.fullName = 'Full name must be at least 3 characters.';
    }
    if (!email.trim() || !email.includes('@')) {
      errors.email = 'Please provide a valid email address.';
    }
    if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }
    if (enrollmentNo.trim().length < 3) {
      errors.enrollmentNo = 'Enrollment number must be at least 3 characters.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    if (!validate()) return;

    setIsLoading(true);
    try {
      await registerStudent({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        enrollmentNo: enrollmentNo.trim(),
        department,
        semester: Number(semester),
        year: Number(year),
      });
      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
        if (err.errors) {
          const mapped: Record<string, string> = {};
          err.errors.forEach((e) => {
            mapped[e.field] = e.message;
          });
          setFieldErrors(mapped);
        }
      } else {
        setErrorMessage('Registration request failed. Please check your network connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-center items-center px-4 py-10 relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-xl shadow-brand-500/20 mb-3 border border-brand-400/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Student Registration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create your student library account to borrow books and access catalog
          </p>
        </div>

        <div className="glass-panel p-6 sm:p-7 rounded-3xl shadow-2xl border border-slate-800/80">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. John Doe"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={fieldErrors.fullName}
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="student@college.edu"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password (min 8 chars)"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-slate-400 hover:text-slate-200 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <Input
              label="Enrollment / PRN Number"
              type="text"
              placeholder="e.g. EN2024001"
              required
              value={enrollmentNo}
              onChange={(e) => setEnrollmentNo(e.target.value)}
              error={fieldErrors.enrollmentNo}
              leftIcon={<CreditCard className="w-4 h-4" />}
            />

            <Select
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value as Department)}
              options={DEPARTMENT_OPTIONS}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Academic Year"
                value={year}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setYear(val);
                  setSemester((val - 1) * 2 + 1);
                }}
                options={YEAR_OPTIONS}
                required
              />

              <Select
                label="Current Semester"
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                options={SEMESTER_OPTIONS}
                required
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={isLoading}
                className="w-full py-2.5 text-sm"
              >
                Register & Sign In
              </Button>
            </div>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-brand-400 hover:text-brand-300 underline underline-offset-4"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
