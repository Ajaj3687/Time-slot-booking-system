import { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { FaLock, FaShieldAlt, FaCreditCard, FaMobile, FaUniversity } from 'react-icons/fa';
import api from '../api';
import AuthContext from '../context/AuthContext';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { service, slot } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('upi');

    if (!service || !slot) {
        return (
            <Container className="mt-5">
                <Alert variant="warning" className="text-center">Invalid Booking Session. Please start again.</Alert>
            </Container>
        );
    }

    const handlePayment = async (method) => {
        setLoading(true);
        setError('');
        setTimeout(async () => {
            try {
                await api.post('/bookings', {
                    user_id: user.id,
                    service_id: service.id,
                    slot_id: slot.id,
                    payment_method: method
                });
                alert('Booking Confirmed! Redirecting...');
                navigate('/bookings');
            } catch (err) {
                setError(err.response?.data?.message || 'Payment Failed');
                setLoading(false);
            }
        }, 2000);
    };

    const tabs = [
        { key: 'upi', label: 'UPI', icon: <FaMobile /> },
        { key: 'card', label: 'Card', icon: <FaCreditCard /> },
        { key: 'netbanking', label: 'NetBanking', icon: <FaUniversity /> }
    ];

    return (
        <div className="payment-page page-enter">
            <div className="payment-card">
                {/* Header */}
                <div className="payment-header">
                    <FaLock className="payment-header-icon" />
                    <h4>Secure Payment</h4>
                </div>

                <div className="payment-body">
                    {/* Details */}
                    <div className="payment-detail-row">
                        <span className="payment-detail-label">Service</span>
                        <span className="payment-detail-value">{service.name}</span>
                    </div>
                    <div className="payment-detail-row">
                        <span className="payment-detail-label">Slot</span>
                        <span className="payment-detail-value" style={{ fontSize: '0.85rem' }}>
                            {new Date(slot.start_time.replace(' ', 'T')).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                    </div>
                    <hr className="summary-divider" />
                    <div className="payment-detail-row">
                        <span className="payment-detail-label">Amount</span>
                        <span className="payment-amount">₹{service.price}</span>
                    </div>

                    {error && <Alert variant="danger" className="mt-3 py-2">{error}</Alert>}

                    {/* Payment Tabs */}
                    <div className="d-flex gap-2 mt-4 mb-3">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                className={`payment-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                <span className="d-flex align-items-center justify-content-center gap-2">
                                    {tab.icon} {tab.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="mt-3">
                        {activeTab === 'upi' && (
                            <div className="slide-up">
                                <Form.Control placeholder="Enter UPI ID (e.g. user@oksbi)" className="mb-3" />
                                <Button className="w-100 btn-primary" onClick={() => handlePayment('UPI')} disabled={loading}>
                                    {loading ? <Spinner size="sm" animation="border" /> : 'Pay with UPI'}
                                </Button>
                            </div>
                        )}
                        {activeTab === 'card' && (
                            <div className="slide-up">
                                <Form.Control placeholder="Card Number" className="mb-2" />
                                <div className="d-flex gap-2 mb-3">
                                    <Form.Control placeholder="MM/YY" />
                                    <Form.Control placeholder="CVV" />
                                </div>
                                <Button className="w-100 btn-primary" onClick={() => handlePayment('Card')} disabled={loading}>
                                    {loading ? <Spinner size="sm" animation="border" /> : 'Pay with Card'}
                                </Button>
                            </div>
                        )}
                        {activeTab === 'netbanking' && (
                            <div className="slide-up">
                                <Form.Select className="mb-3">
                                    <option>HDFC Bank</option>
                                    <option>SBI</option>
                                    <option>ICICI Bank</option>
                                    <option>Axis Bank</option>
                                </Form.Select>
                                <Button className="w-100 btn-primary" onClick={() => handlePayment('NetBanking')} disabled={loading}>
                                    {loading ? <Spinner size="sm" animation="border" /> : 'Pay via NetBanking'}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Security Note */}
                    <div className="payment-security">
                        <FaShieldAlt /> 256-bit SSL Encrypted · Secure Payment
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
