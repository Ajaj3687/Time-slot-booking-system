import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Alert } from 'react-bootstrap';
import { FaClock, FaCalendarAlt, FaPhone, FaEnvelope, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import api from '../api';
import AuthContext from '../context/AuthContext';

const BookingPage = () => {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [service, setService] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showContact, setShowContact] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const sRes = await api.get('/services');
            const found = sRes.data.find(s => s.id == serviceId);
            setService(found);
            const slRes = await api.get(`/slots/service/${serviceId}`);
            setSlots(slRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleProceed = () => {
        if (!user) {
            alert('Please login to continue');
            navigate('/login');
            return;
        }
        if (!selectedSlot) return;
        navigate('/payment', { state: { service, slot: selectedSlot } });
    };

    if (!service) return (
        <Container className="mt-5 text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="text-muted mt-3">Loading service details...</p>
        </Container>
    );

    return (
        <div className="booking-page page-enter">
            <Container>
                <Row>
                    <Col lg={8}>
                        {/* Service Details */}
                        <div className="glass-card mb-4">
                            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                                <div>
                                    <span className="service-category-badge mb-2 d-inline-block">{service.category || 'General'}</span>
                                    <h2 className="text-white mt-2 mb-1" style={{ fontWeight: 700 }}>{service.name}</h2>
                                    <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>by {service.provider_name}</p>
                                </div>
                                <span className="service-price" style={{ fontSize: '1.8rem' }}>₹{service.price}</span>
                            </div>
                            <p className="text-muted">{service.description}</p>
                            <div className="d-flex gap-3 mt-3">
                                <Button
                                    className="btn-outline-primary"
                                    onClick={() => setShowContact(true)}
                                    style={{ padding: '0.5rem 1.2rem', fontSize: '0.88rem' }}
                                >
                                    <FaPhone className="me-2" size={12} /> Contact Provider
                                </Button>
                            </div>
                        </div>

                        {/* Time Slots */}
                        <h4 className="text-white mb-3 d-flex align-items-center gap-2">
                            <FaClock className="text-primary" /> Select a Time Slot
                        </h4>
                        <div className="slot-grid mb-4">
                            {slots.map(slot => (
                                <div
                                    key={slot.id}
                                    className={`slot-card ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedSlot(slot)}
                                >
                                    <div className="slot-time">
                                        {new Date(slot.start_time.replace(' ', 'T')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="slot-date">
                                        {new Date(slot.start_time.replace(' ', 'T')).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {slots.length === 0 && (
                            <div className="empty-state">
                                <div className="empty-state-icon">📅</div>
                                <p className="empty-state-text">No available slots right now</p>
                            </div>
                        )}
                    </Col>

                    <Col lg={4}>
                        <div className="booking-summary">
                            <div className="summary-card">
                                <h5 className="text-white mb-3 d-flex align-items-center gap-2">
                                    <FaCalendarAlt className="text-primary" /> Booking Summary
                                </h5>
                                <div className="mb-2">
                                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>Service</span>
                                    <p className="text-white mb-1" style={{ fontWeight: 600 }}>{service.name}</p>
                                </div>
                                <div className="mb-2">
                                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>Time Slot</span>
                                    <p className="text-white mb-1" style={{ fontWeight: 600 }}>
                                        {selectedSlot ? new Date(selectedSlot.start_time.replace(' ', 'T')).toLocaleString() : 'Select a slot'}
                                    </p>
                                </div>
                                <hr className="summary-divider" />
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-muted">Total</span>
                                    <span className="summary-total">₹{service.price}</span>
                                </div>
                                <Button
                                    size="lg"
                                    className="w-100 btn-primary d-flex align-items-center justify-content-center gap-2"
                                    disabled={!selectedSlot}
                                    onClick={handleProceed}
                                >
                                    Proceed to Pay <FaArrowRight size={14} />
                                </Button>
                                <div className="d-flex align-items-center justify-content-center gap-2 mt-3"
                                    style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                                    <FaShieldAlt size={12} /> Secure & encrypted payment
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Contact Modal */}
                <Modal show={showContact} onHide={() => setShowContact(false)} centered>
                    <Modal.Header closeButton style={{ borderBottom: '1px solid var(--border)' }}>
                        <Modal.Title className="text-white" style={{ fontSize: '1.1rem' }}>Contact Provider</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="text-white mb-3"><strong>Provider:</strong> {service.provider_name}</p>
                        <div className="d-flex flex-column gap-2">
                            <div className="d-flex align-items-center gap-2" style={{ color: 'var(--info)' }}>
                                <FaPhone size={14} /> +91 9876543210 (Mock)
                            </div>
                            <div className="d-flex align-items-center gap-2" style={{ color: 'var(--info)' }}>
                                <FaEnvelope size={14} /> provider@example.com (Mock)
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
};

export default BookingPage;
