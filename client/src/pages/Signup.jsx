import { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserPlus, FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaUserMd, FaUserCog } from 'react-icons/fa';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', mobile: '', password: '', role: 'user'
    });
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const { signup, login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMsg('');
        const res = await signup(formData);
        if (res.success) {
            setMsg(res.message || 'Signup successful! Logging you in...');
            
            // Auto login after signup
            setTimeout(async () => {
                const loginRes = await login(formData.email, formData.password);
                if (loginRes.success) {
                    const role = loginRes.user?.role;
                    if (role === 'admin') navigate('/admin/dashboard');
                    else if (role === 'provider') {
                        if (loginRes.user?.is_approved == 0) navigate('/login'); // If pending, go to login to see message 
                        else navigate('/provider/dashboard');
                    }
                    else navigate('/services');
                } else {
                    navigate('/login');
                }
            }, 1500);
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="auth-page fade-in">
            <div className="auth-wrapper" style={{ minHeight: '620px' }}>
                {/* Illustration Side */}
                <div className="auth-illustration">
                    <div className="auth-illustration-icon">
                        <FaUserPlus />
                    </div>
                    <h3>Join Us Today</h3>
                    <p>Create your account and start booking appointments with trusted professionals.</p>
                </div>

                {/* Form Side */}
                <div className="auth-form-side">
                    <h2 className="auth-form-title">Create Account</h2>
                    <p className="auth-form-subtitle">
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary-light)' }}>Sign In</Link>
                    </p>

                    {error && <Alert variant="danger" className="py-2">{error}</Alert>}
                    {msg && <Alert variant="success" className="py-2">{msg}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <div className="position-relative">
                                <FaUser style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 2 }} />
                                <Form.Control name="name" placeholder="Enter your full name" onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <div className="position-relative">
                                <FaEnvelope style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 2 }} />
                                <Form.Control type="email" name="email" placeholder="Enter email address" onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mobile Number</Form.Label>
                            <div className="position-relative">
                                <FaPhone style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 2 }} />
                                <Form.Control type="text" name="mobile" placeholder="Enter mobile number" onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <div className="position-relative">
                                <FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 2 }} />
                                <Form.Control
                                    type={showPass ? "text" : "password"}
                                    name="password"
                                    placeholder="Create a password"
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                />
                                <span
                                    onClick={() => setShowPass(!showPass)}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-muted)', zIndex: 2 }}>
                                    {showPass ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>I am a</Form.Label>
                            <div className="d-flex gap-2">
                                <button
                                    type="button"
                                    className={`flex-fill d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 border ${formData.role === 'user' ? 'text-white' : 'text-muted'}`}
                                    style={{
                                        background: formData.role === 'user'
                                            ? 'linear-gradient(135deg, var(--primary), var(--secondary))'
                                            : 'var(--surface)',
                                        borderColor: formData.role === 'user' ? 'transparent' : 'var(--border-light)',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        fontWeight: 500,
                                        fontSize: '0.9rem'
                                    }}
                                    onClick={() => setFormData({ ...formData, role: 'user' })}
                                >
                                    <FaUser /> Customer
                                </button>
                                <button
                                    type="button"
                                    className={`flex-fill d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 border ${formData.role === 'provider' ? 'text-white' : 'text-muted'}`}
                                    style={{
                                        background: formData.role === 'provider'
                                            ? 'linear-gradient(135deg, var(--primary), var(--secondary))'
                                            : 'var(--surface)',
                                        borderColor: formData.role === 'provider' ? 'transparent' : 'var(--border-light)',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        fontWeight: 500,
                                        fontSize: '0.9rem'
                                    }}
                                    onClick={() => setFormData({ ...formData, role: 'provider' })}
                                >
                                    <FaUserMd /> Provider
                                </button>
                            </div>
                        </Form.Group>
                        <Button type="submit" className="w-100 btn-primary" size="lg">
                            Create Account
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
