import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaKey, FaLock, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';
import api from '../api';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setMsg('');
        setLoading(true);
        try {
            const res = await api.post('/auth/forgot-password', { email });
            // For local testing, show the dev_otp in the success message if it exists
            if (res.data.dev_otp) {
                setMsg(`${res.data.message} (TEST OTP: ${res.data.dev_otp})`);
                setOtp(res.data.dev_otp); // Auto-fill the OTP field for convenience
            } else {
                setMsg(res.data.message);
            }
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMsg('');
        setLoading(true);
        try {
            const res = await api.post('/auth/reset-password', { email, otp, new_password: newPassword });
            setMsg(res.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page fade-in">
            <div className="auth-wrapper">
                {/* Illustration Side */}
                <div className="auth-illustration">
                    <div className="auth-illustration-icon">
                        <FaShieldAlt />
                    </div>
                    <h3>Secure Reset</h3>
                    <p>Enter your confirmed email address and follow the instructions to securely reset your password.</p>
                </div>

                {/* Form Side */}
                <div className="auth-form-side">
                    <Link to="/login" className="d-flex align-items-center gap-2 mb-4" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
                        <FaArrowLeft /> Back to Login
                    </Link>
                    <h2 className="auth-form-title">Forgot Password</h2>
                    <p className="auth-form-subtitle">
                        {step === 1 ? "Enter your email to receive a recovery OTP." : "Enter the OTP sent to your email and your new password."}
                    </p>

                    {error && <Alert variant="danger" className="py-2">{error}</Alert>}
                    {msg && <Alert variant="success" className="py-2">{msg}</Alert>}

                    {step === 1 ? (
                        <Form onSubmit={handleSendOTP}>
                            <Form.Group className="mb-4">
                                <Form.Label>Email Address</Form.Label>
                                <div className="position-relative">
                                    <FaEnvelope style={{
                                        position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                                        color: 'var(--text-muted)', zIndex: 2
                                    }} />
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your registered email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{ paddingLeft: '2.5rem' }}
                                    />
                                </div>
                            </Form.Group>
                            <Button type="submit" className="w-100 btn-primary" size="lg" disabled={loading}>
                                {loading ? 'Sending...' : 'Send OTP'}
                            </Button>
                        </Form>
                    ) : (
                        <Form onSubmit={handleResetPassword} className="slide-up">
                            <Form.Group className="mb-3">
                                <Form.Label>One-Time Password (OTP)</Form.Label>
                                <div className="position-relative">
                                    <FaKey style={{
                                        position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                                        color: 'var(--text-muted)', zIndex: 2
                                    }} />
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        style={{ paddingLeft: '2.5rem', letterSpacing: '2px', fontWeight: 'bold' }}
                                    />
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>New Password</Form.Label>
                                <div className="position-relative">
                                    <FaLock style={{
                                        position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                                        color: 'var(--text-muted)', zIndex: 2
                                    }} />
                                    <Form.Control
                                        type="password"
                                        placeholder="Create a new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        style={{ paddingLeft: '2.5rem' }}
                                    />
                                </div>
                            </Form.Group>
                            <Button type="submit" className="w-100 btn-primary" size="lg" disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </Form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
