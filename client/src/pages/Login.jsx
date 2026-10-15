import { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaCalendarAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(identifier, password);
        if (res.success) {
            const role = res.user?.role;
            if (role === 'admin') navigate('/admin/dashboard');
            else if (role === 'provider') navigate('/provider/dashboard');
            else navigate('/services');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="auth-page fade-in">
            <div className="auth-wrapper">
                {/* Illustration Side */}
                <div className="auth-illustration">
                    <div className="auth-illustration-icon">
                        <FaCalendarAlt />
                    </div>
                    <h3>Welcome Back!</h3>
                    <p>Log in to manage your appointments and bookings seamlessly.</p>
                </div>

                {/* Form Side */}
                <div className="auth-form-side">
                    <h2 className="auth-form-title">Sign In</h2>
                    <p className="auth-form-subtitle">
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--primary-light)' }}>Create one</Link>
                    </p>

                    {error && <Alert variant="danger" className="py-2">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email or Mobile</Form.Label>
                            <div className="position-relative">
                                <FaEnvelope style={{
                                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)', zIndex: 2
                                }} />
                                <Form.Control
                                    type="text"
                                    placeholder="Enter email or mobile"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    required
                                    style={{ paddingLeft: '2.5rem' }}
                                />
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <Form.Label className="mb-0">Password</Form.Label>
                                <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary-light)', textDecoration: 'none' }}>
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="position-relative">
                                <FaLock style={{
                                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)', zIndex: 2
                                }} />
                                <Form.Control
                                    type={showPass ? "text" : "password"}
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                />
                                <span
                                    onClick={() => setShowPass(!showPass)}
                                    style={{
                                        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                                        cursor: 'pointer', color: 'var(--text-muted)', zIndex: 2
                                    }}>
                                    {showPass ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </Form.Group>
                        <Button type="submit" className="w-100 btn-primary" size="lg">
                            Sign In
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;
