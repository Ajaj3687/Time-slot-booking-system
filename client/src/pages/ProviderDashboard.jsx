import { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Table, Tabs, Tab, Alert, Row, Col } from 'react-bootstrap';
import { FaPlus, FaCalendarAlt, FaClock, FaTag, FaRupeeSign, FaListAlt } from 'react-icons/fa';
import api from '../api';
import AuthContext from '../context/AuthContext';

const ProviderDashboard = () => {
    const { user } = useContext(AuthContext);
    const [services, setServices] = useState([]);
    const [slots, setSlots] = useState([]);
    const [bookings, setBookings] = useState([]);

    const [newService, setNewService] = useState({ name: '', description: '', price: '', category: '' });
    const [newSlot, setNewSlot] = useState({ service_id: '', start_time: '', end_time: '' });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (user) {
            fetchServices();
            fetchSlots();
            fetchBookings();
        }
    }, [user]);

    const fetchServices = async () => {
        const res = await api.get(`/services/provider/${user.id}`);
        setServices(res.data);
    };

    const fetchSlots = async () => {
        const res = await api.get(`/slots/provider/${user.id}`);
        setSlots(res.data);
    };

    const fetchBookings = async () => {
        try {
            const res = await api.get(`/bookings/provider/${user.id}`);
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/services', { ...newService, provider_id: user.id });
            setMsg('Service added!');
            setNewService({ name: '', description: '', price: '', category: '' });
            fetchServices();
        } catch (err) {
            alert('Error adding service');
        }
    };

    const handleSlotSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedSlot = {
                ...newSlot,
                provider_id: user.id,
                start_time: newSlot.start_time.replace('T', ' ') + ':00',
                end_time: newSlot.end_time.replace('T', ' ') + ':00'
            };
            await api.post('/slots', formattedSlot);
            setMsg('Slot added!');
            fetchSlots();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Error adding slot');
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

    const openSlots = slots.filter(s => !s.is_booked).length;
    const bookedSlots = slots.filter(s => s.is_booked).length;

    return (
        <div className="page-enter">
            <Container className="py-4">
                <div className="dashboard-header">
                    <h2 className="dashboard-title">Provider Dashboard</h2>
                    <p className="dashboard-subtitle">Manage your services and slots</p>
                </div>

                {msg && <Alert variant="success" onClose={() => setMsg('')} dismissible className="mb-4">{msg}</Alert>}

                {/* Stat Cards */}
                <Row className="g-3 mb-4">
                    <Col sm={6} lg={3}>
                        <div className="stat-card stat-primary slide-up delay-1">
                            <div className="stat-icon icon-primary"><FaListAlt /></div>
                            <div>
                                <div className="stat-value">{services.length}</div>
                                <div className="stat-label">Services</div>
                            </div>
                        </div>
                    </Col>
                    <Col sm={6} lg={3}>
                        <div className="stat-card stat-success slide-up delay-2">
                            <div className="stat-icon icon-success"><FaCalendarAlt /></div>
                            <div>
                                <div className="stat-value">{openSlots}</div>
                                <div className="stat-label">Open Slots</div>
                            </div>
                        </div>
                    </Col>
                    <Col sm={6} lg={3}>
                        <div className="stat-card stat-warning slide-up delay-3">
                            <div className="stat-icon icon-warning"><FaClock /></div>
                            <div>
                                <div className="stat-value">{bookedSlots}</div>
                                <div className="stat-label">Booked</div>
                            </div>
                        </div>
                    </Col>
                    <Col sm={6} lg={3}>
                        <div className="stat-card stat-info slide-up delay-4">
                            <div className="stat-icon icon-info"><FaTag /></div>
                            <div>
                                <div className="stat-value">{slots.length}</div>
                                <div className="stat-label">Total Slots</div>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Tabs defaultActiveKey="services" className="mb-3">
                    <Tab eventKey="services" title="My Services">
                        <Row className="g-4">
                            <Col md={4}>
                                <div className="glass-card">
                                    <h5 className="text-white d-flex align-items-center gap-2 mb-3">
                                        <FaPlus className="text-primary" size={14} /> Add Service
                                    </h5>
                                    <Form onSubmit={handleServiceSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Service Name</Form.Label>
                                            <Form.Control
                                                placeholder="e.g. General Consultation"
                                                required
                                                value={newService.name}
                                                onChange={e => setNewService({ ...newService, name: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                placeholder="Brief description"
                                                value={newService.description}
                                                onChange={e => setNewService({ ...newService, description: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Price (₹)</Form.Label>
                                            <Form.Control
                                                placeholder="500"
                                                type="number"
                                                required
                                                value={newService.price}
                                                onChange={e => setNewService({ ...newService, price: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Category</Form.Label>
                                            <Form.Control
                                                placeholder="e.g. Healthcare"
                                                value={newService.category}
                                                onChange={e => setNewService({ ...newService, category: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Button type="submit" className="w-100 btn-primary">
                                            <FaPlus className="me-2" size={12} /> Add Service
                                        </Button>
                                    </Form>
                                </div>
                            </Col>
                            <Col md={8}>
                                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                                    <Table hover className="mb-0">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Price</th>
                                                <th>Category</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {services.map(s => (
                                                <tr key={s.id}>
                                                    <td className="text-white fw-medium">{s.name}</td>
                                                    <td>
                                                        <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>₹{s.price}</span>
                                                    </td>
                                                    <td><span className="service-category-badge">{s.category || 'General'}</span></td>
                                                </tr>
                                            ))}
                                            {services.length === 0 && (
                                                <tr><td colSpan="3" className="text-center text-muted py-4">No services added yet</td></tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                    </Tab>
                    <Tab eventKey="slots" title="Manage Slots">
                        <Row className="g-4">
                            <Col md={4}>
                                <div className="glass-card">
                                    <h5 className="text-white d-flex align-items-center gap-2 mb-3">
                                        <FaClock className="text-primary" size={14} /> Add Availability
                                    </h5>
                                    <Form onSubmit={handleSlotSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Service</Form.Label>
                                            <Form.Select required onChange={e => setNewSlot({ ...newSlot, service_id: e.target.value })}>
                                                <option value="">Select Service</option>
                                                {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Start Time</Form.Label>
                                            <Form.Control type="datetime-local" required onChange={e => setNewSlot({ ...newSlot, start_time: e.target.value })} />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>End Time</Form.Label>
                                            <Form.Control type="datetime-local" required onChange={e => setNewSlot({ ...newSlot, end_time: e.target.value })} />
                                        </Form.Group>
                                        <Button type="submit" className="w-100 btn-primary">
                                            <FaPlus className="me-2" size={12} /> Add Slot
                                        </Button>
                                    </Form>
                                </div>
                            </Col>
                            <Col md={8}>
                                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                                    <Table hover className="mb-0">
                                        <thead>
                                            <tr>
                                                <th>Service</th>
                                                <th>Start</th>
                                                <th>End</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {slots.map(sl => (
                                                <tr key={sl.id}>
                                                    <td className="text-white fw-medium">
                                                        {services.find(s => s.id === sl.service_id)?.name || sl.service_id}
                                                    </td>
                                                    <td style={{ fontSize: '0.88rem' }}>{new Date(sl.start_time.replace(' ', 'T')).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                                                    <td style={{ fontSize: '0.88rem' }}>{new Date(sl.end_time.replace(' ', 'T')).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                                                    <td>
                                                        {sl.is_booked ?
                                                            <span className="booking-status-badge" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)' }}>Booked</span> :
                                                            <span className="booking-status-badge confirmed">Open</span>
                                                        }
                                                    </td>
                                                    <td>
                                                        {new Date() < new Date(sl.start_time.replace(' ', 'T')) && (
                                                            <Button 
                                                                variant="outline-danger" 
                                                                size="sm"
                                                                onClick={() => handleDeleteSlot(sl.id)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            {slots.length === 0 && (
                                                <tr><td colSpan="5" className="text-center text-muted py-4">No slots added yet</td></tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                    </Tab>
                    <Tab eventKey="bookings" title={`Manage Bookings (${bookings.length})`}>
                        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                            <Table hover className="mb-0">
                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Contact</th>
                                        <th>Service</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                        <th>Payment</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(b => (
                                        <tr key={b.id}>
                                            <td className="text-white fw-medium">{b.customer_name}</td>
                                            <td style={{ fontSize: '0.85rem' }}>
                                                <div>{b.customer_email}</div>
                                                <div className="text-muted">{b.customer_mobile}</div>
                                            </td>
                                            <td className="text-white fw-medium">{b.service_name}</td>
                                            <td style={{ fontSize: '0.88rem' }}>{new Date(b.start_time.replace(' ', 'T')).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                                            <td style={{ fontSize: '0.88rem' }}>{new Date(b.end_time.replace(' ', 'T')).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
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
                                        <tr><td colSpan="8" className="text-center text-muted py-4">No bookings received yet</td></tr>
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

export default ProviderDashboard;
