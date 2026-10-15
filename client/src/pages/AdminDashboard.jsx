import { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Tab, Tabs, Row, Col } from 'react-bootstrap';
import { FaUsers, FaClock, FaCheck, FaUserShield } from 'react-icons/fa';
import api from '../api';

const AdminDashboard = () => {
    const [pendingProviders, setPendingProviders] = useState([]);
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [slots, setSlots] = useState([]);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetchPending();
        fetchUsers();
        fetchBookings();
        fetchSlots();
    }, []);

    const fetchPending = async () => {
        try {
            const res = await api.get('/admin/pending-providers');
            setPendingProviders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await api.get('/admin/bookings');
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSlots = async () => {
        try {
            const res = await api.get('/admin/slots');
            setSlots(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const approve = async (id) => {
        try {
            await api.post('/admin/approve-provider', { providerId: id });
            setMsg('Provider Approved!');
            fetchPending();
            fetchUsers();
        } catch (err) {
            setMsg('Error approving provider');
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await api.post('/cancel_booking', { booking_id: bookingId });
                setMsg('Booking cancelled successfully!');
                fetchBookings();
                fetchSlots();
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.error || "Failed to cancel booking");
            }
        }
    };

    const handleDeleteSlot = async (slotId) => {
        if (window.confirm("Are you sure you want to delete this slot? If it is booked, the booking will also be cancelled/deleted.")) {
            try {
                await api.post('/delete_slot', { slot_id: slotId });
                setMsg('Slot deleted!');
                fetchSlots();
                fetchBookings();
            } catch (err) {
                console.error(err);
                alert("Failed to delete slot");
            }
        }
    };

    const totalUsers = users.filter(u => u.role === 'user').length;
    const totalProviders = users.filter(u => u.role === 'provider').length;

    return (
        <div className="page-enter">
            <Container className="py-4">
                <div className="dashboard-header">
                    <h2 className="dashboard-title">Admin Dashboard</h2>
                    <p className="dashboard-subtitle">Manage providers and users across the platform</p>
                </div>

                {msg && <Alert variant="info" dismissible onClose={() => setMsg('')} className="mb-4">{msg}</Alert>}

                {/* Stat Cards */}
                <Row className="g-3 mb-4">
                    <Col sm={6} lg={3}>
                        <div className="stat-card stat-primary slide-up delay-1">
                            <div className="stat-icon icon-primary"><FaUsers /></div>
                            <div>
                                <div className="stat-value">{users.length}</div>
                                <div className="stat-label">Total Users</div>
                            </div>
                        </div>
                    </Col>
                    <Col sm={6} lg={3}>
                        <div className="stat-card stat-info slide-up delay-2">
                            <div className="stat-icon icon-info"><FaUserShield /></div>
                            <div>
                                <div className="stat-value">{totalProviders}</div>
                                <div className="stat-label">Providers</div>
                            </div>
                        </div>
                    </Col>
                    <Col sm={6} lg={3}>
                        <div className="stat-card stat-warning slide-up delay-3">
                            <div className="stat-icon icon-warning"><FaClock /></div>
                            <div>
                                <div className="stat-value">{pendingProviders.length}</div>
                                <div className="stat-label">Pending</div>
                            </div>
                        </div>
                    </Col>
                    <Col sm={6} lg={3}>
                        <div className="stat-card stat-success slide-up delay-4">
                            <div className="stat-icon icon-success"><FaCheck /></div>
                            <div>
                                <div className="stat-value">{totalUsers}</div>
                                <div className="stat-label">Customers</div>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Tabs defaultActiveKey="pending" className="mb-3">
                    <Tab eventKey="pending" title={`Pending Approvals (${pendingProviders.length})`}>
                        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                            <Table hover className="mb-0">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Mobile</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingProviders.map(p => (
                                        <tr key={p.id}>
                                            <td className="text-white fw-medium">{p.name}</td>
                                            <td>{p.email}</td>
                                            <td>{p.mobile}</td>
                                            <td>
                                                <Button
                                                    size="sm"
                                                    className="btn-primary"
                                                    onClick={() => approve(p.id)}
                                                    style={{ padding: '0.3rem 1rem', fontSize: '0.82rem', borderRadius: '50px' }}
                                                >
                                                    <FaCheck className="me-1" size={11} /> Approve
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {pendingProviders.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center text-muted py-4">No pending approvals</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Tab>
                    <Tab eventKey="users" title="All Users">
                        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                            <Table hover className="mb-0">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id}>
                                            <td className="text-white fw-medium">{u.name}</td>
                                            <td>
                                                <span className={`badge ${u.role === 'admin' ? 'bg-danger' : u.role === 'provider' ? 'bg-info' : 'bg-secondary'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td>
                                                {u.role === 'provider' ? (
                                                    u.is_approved ?
                                                        <span className="booking-status-badge confirmed">Active</span> :
                                                        <span className="booking-status-badge pending">Pending</span>
                                                ) : (
                                                    <span className="text-muted">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Tab>
                    <Tab eventKey="bookings" title={`All Bookings (${bookings.length})`}>
                        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                            <Table hover className="mb-0">
                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Provider</th>
                                        <th>Service</th>
                                        <th>Time Slot</th>
                                        <th>Payment</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(b => (
                                        <tr key={b.id}>
                                            <td className="text-white fw-medium">
                                                <div>{b.customer_name}</div>
                                                <div className="text-muted" style={{ fontSize: '0.78rem' }}>{b.customer_email}</div>
                                            </td>
                                            <td className="text-white fw-medium">
                                                <div>{b.provider_name}</div>
                                                <div className="text-muted" style={{ fontSize: '0.78rem' }}>{b.provider_email}</div>
                                            </td>
                                            <td className="text-white fw-medium">{b.service_name}</td>
                                            <td style={{ fontSize: '0.85rem' }}>
                                                <div>{new Date(b.start_time.replace(' ', 'T')).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</div>
                                                <div className="text-muted">to {new Date(b.end_time.replace(' ', 'T')).toLocaleTimeString([], { timeStyle: 'short' })}</div>
                                            </td>
                                            <td>
                                                <span className="service-category-badge">{b.payment_method}</span>
                                            </td>
                                            <td>
                                                <span className={`booking-status-badge ${b.status}`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td>
                                                {b.status !== 'cancelled' && new Date() < new Date(b.start_time.replace(' ', 'T')) ? (
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm"
                                                        onClick={() => handleCancelBooking(b.id)}
                                                    >
                                                        Cancel Booking
                                                    </Button>
                                                ) : (
                                                    <span className="text-muted">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {bookings.length === 0 && (
                                        <tr><td colSpan="7" className="text-center text-muted py-4">No bookings found</td></tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Tab>
                    <Tab eventKey="slots" title={`All Slots (${slots.length})`}>
                        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                            <Table hover className="mb-0">
                                <thead>
                                    <tr>
                                        <th>Service</th>
                                        <th>Provider</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {slots.map(sl => (
                                        <tr key={sl.id}>
                                            <td className="text-white fw-medium">{sl.service_name}</td>
                                            <td className="text-white fw-medium">
                                                <div>{sl.provider_name}</div>
                                                <div className="text-muted" style={{ fontSize: '0.78rem' }}>{sl.provider_email}</div>
                                            </td>
                                            <td style={{ fontSize: '0.88rem' }}>{new Date(sl.start_time.replace(' ', 'T')).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                                            <td style={{ fontSize: '0.88rem' }}>{new Date(sl.end_time.replace(' ', 'T')).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                                            <td>
                                                {sl.is_booked ? (
                                                    <span className="booking-status-badge" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)' }}>Booked</span>
                                                ) : (
                                                    <span className="booking-status-badge confirmed">Open</span>
                                                )}
                                            </td>
                                            <td>
                                                {new Date() < new Date(sl.start_time.replace(' ', 'T')) ? (
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm"
                                                        onClick={() => handleDeleteSlot(sl.id)}
                                                    >
                                                        Delete Slot
                                                    </Button>
                                                ) : (
                                                    <span className="text-muted">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {slots.length === 0 && (
                                        <tr><td colSpan="6" className="text-center text-muted py-4">No slots scheduled yet</td></tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Tab>
                </Tabs>
            </Container>
        </div>
    );
};

export default AdminDashboard;
