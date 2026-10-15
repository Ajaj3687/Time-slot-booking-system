import { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaRupeeSign, FaArrowRight } from 'react-icons/fa';
import api from '../api';

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/services').then(res => setServices(res.data)).catch(console.error);
    }, []);

    const filtered = services.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.category && s.category.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="service-list-page page-enter">
            <Container>
                <div className="service-list-header">
                    <h2 className="section-title mb-1">Available Services</h2>
                    <p className="text-muted mb-4">Browse and book from our verified providers</p>

                    {/* Search Box */}
                    <div className="position-relative" style={{ maxWidth: '400px' }}>
                        <FaSearch style={{
                            position: 'absolute', left: '14px', top: '50%',
                            transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 2
                        }} />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search services or categories..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                </div>

                <Row className="g-4">
                    {filtered.map(service => (
                        <Col md={4} sm={6} key={service.id}>
                            <div className="service-card slide-up">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <span className="service-category-badge">{service.category || 'General'}</span>
                                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>by {service.provider_name}</span>
                                </div>
                                <h5 className="text-white mb-2" style={{ fontWeight: 600 }}>{service.name}</h5>
                                <p className="text-muted mb-3" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                                    {service.description || 'Professional service with verified provider.'}
                                </p>
                                <div className="d-flex justify-content-between align-items-center mt-auto">
                                    <span className="service-price">₹{service.price}</span>
                                    <Button
                                        className="btn-primary d-flex align-items-center gap-2"
                                        onClick={() => navigate(`/book/${service.id}`)}
                                        style={{ padding: '0.55rem 1.4rem', fontSize: '0.88rem' }}
                                    >
                                        Book Now <FaArrowRight size={12} />
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    ))}
                    {filtered.length === 0 && (
                        <Col>
                            <div className="empty-state">
                                <div className="empty-state-icon">🔍</div>
                                <p className="empty-state-text">No services found</p>
                            </div>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    );
};

export default ServiceList;
