import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { FaCalendarCheck, FaClock, FaTag } from 'react-icons/fa';
import api from '../api';
import AuthContext from '../context/AuthContext';

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = () => {
        api.get(`/bookings/user/${user.id}`).then(res => setBookings(res.data)).catch(console.error);
    };

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await api.post('/cancel_booking', { booking_id: bookingId });
                fetchBookings(); // Refresh bookings list
            } catch (err) {
                console.error(err);
                alert("Failed to cancel booking");
            }
        }
    };

    return (
        <div className="bookings-page page-enter">
            <Container>
                <div className="mb-4">
                    <h2 className="section-title mb-1">My Bookings</h2>
                    <p className="text-muted">Track all your appointments in one place</p>
                </div>

                {bookings.length > 0 ? (
                    <Row className="g-3">
                        {bookings.map(b => (
                            <Col md={6} lg={4} key={b.id}>
                                <div className={`booking-card-item status-${b.status || 'confirmed'}`}>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h6 className="text-white mb-0" style={{ fontWeight: 600 }}>{b.service_name}</h6>
                                        <span className={`booking-status-badge ${b.status || 'confirmed'}`}>
                                            {b.status || 'confirmed'}
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column gap-2">
                                        <div className="d-flex align-items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                                            <FaCalendarCheck size={13} style={{ color: 'var(--primary-light)', flexShrink: 0 }} />
                                            Booked: {new Date(b.booking_date.replace(' ', 'T')).toLocaleDateString([], { dateStyle: 'medium' })}
                                        </div>
                                        <div className="d-flex align-items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                                            <FaClock size={13} style={{ color: 'var(--primary-light)', flexShrink: 0 }} />
                                            Slot: {new Date(b.start_time.replace(' ', 'T')).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                        </div>
                                    </div>
                                    {b.status !== 'cancelled' && new Date() < new Date(b.start_time.replace(' ', 'T')) && (
                                        <div className="mt-3 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                            <button 
                                                className="btn btn-outline-danger btn-sm w-100"
                                                onClick={() => handleCancelBooking(b.id)}
                                            >
                                                Cancel Booking
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <p className="empty-state-text">No bookings found</p>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Book a service to see your appointments here</p>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default MyBookings;
