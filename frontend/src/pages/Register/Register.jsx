import './Register.css';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [role, setRole] = useState('client');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { role: 'client' } });

  const password = watch('password');

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);

    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      role,
      ...(role === 'client'
        ? { address: data.address, phone: data.phone }
        : { permissionLevel: data.permissionLevel }),
    };

    try {
        const res = await apiClient.post('/auth/register', payload);

        setAuth(res.data.token, res.data.user);

        if (res.data.user.role === 'admin') {
            navigate('/booksAdmin');
        } else {
            navigate('/catalogue');
        }
    } catch (err) {
      const message = err.response?.data?.message ?? 'Network error. Please check your connection.';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register-page">
      <div className="register">

        {/* ── Left column ── */}
        <div className="col-1">
          <h2>Create account</h2>
          <span>Register and enjoy the service</span>

          {/* Role selector */}
          <div className="role-tabs">
            <button
              type="button"
              className={`tab ${role === 'client' ? 'tab--active' : ''}`}
              onClick={() => setRole('client')}
            >
              Client
            </button>
            <button
              type="button"
              className={`tab ${role === 'admin' ? 'tab--active' : ''}`}
              onClick={() => setRole('admin')}
            >
              Admin
            </button>
          </div>

          <form id="form" className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>

            {/* ── Shared User fields ── */}
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              placeholder="Full name"
            />
            {errors.name && <p className="field-error">{errors.name.message}</p>}

            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
              placeholder="Email address"
            />
            {errors.email && <p className="field-error">{errors.email.message}</p>}

            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              })}
              placeholder="Password"
            />
            {errors.password && <p className="field-error">{errors.password.message}</p>}

            <input
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              placeholder="Confirm password"
            />
            {errors.confirmPassword && (
              <p className="field-error">{errors.confirmPassword.message}</p>
            )}

            {/* ── Role-specific fields ── */}
            {role === 'client' && (
              <fieldset className="role-fields">
                <legend>Client details</legend>

                <input
                  type="text"
                  {...register('address', { required: 'Address is required' })}
                  placeholder="Address"
                />
                {errors.address && <p className="field-error">{errors.address.message}</p>}

                <input
                  type="tel"
                  {...register('phone', {
                    required: 'Phone is required',
                    maxLength: { value: 10, message: 'Phone must be at most 10 digits' },
                    pattern: { value: /^\d+$/, message: 'Digits only' },
                  })}
                  placeholder="Phone number (10 digits)"
                />
                {errors.phone && <p className="field-error">{errors.phone.message}</p>}
              </fieldset>
            )}

            {role === 'admin' && (
              <fieldset className="role-fields">
                <legend>Admin details</legend>

                <select
                  {...register('permissionLevel', { required: 'Permission level is required' })}
                >
                  <option value="">Select permission level</option>
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="manager">Manager</option>
                  <option value="superadmin">Superadmin</option>
                </select>
                {errors.permissionLevel && (
                  <p className="field-error">{errors.permissionLevel.message}</p>
                )}
              </fieldset>
            )}

            {serverError && <p className="server-error">{serverError}</p>}

            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Registering…' : 'Register'}
            </button>
          </form>

          <p className="register-footer">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;