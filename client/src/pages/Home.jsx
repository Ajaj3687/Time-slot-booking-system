import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUserMd, FaCheckCircle, FaArrowRight, FaStar, FaUsers, FaCalendarCheck } from 'react-icons/fa';

const Home = () => {
    return (
        <div className="home-page fade-in">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content slide-up">
                    <p className="hero-subtitle">✨ Premium Booking Platform</p>
                    <h1 className="hero-title">
                        Smart Appointments,<br />Simplified.
                    </h1>
                    <p className="hero-text">
                        Book appointments with trusted professionals effortlessly.
                        Manage your schedule with our intelligent and secure booking platform.
                    </p>
                    <div className="hero-buttons">
                        <Button as={Link} to="/services" className="btn-primary" size="lg">
                            Book Now <FaArrowRight className="ms-2" size={14} />
                        </Button>
                        <Button as={Link} to="/signup" className="btn-outline-primary" size="lg">
                            Get Started Free
                        </Button>
                    </div>
                    <div className="hero-stats slide-up delay-3">
                        <div className="hero-stat">
                            <div className="hero-stat-number">500+</div>
                            <div className="hero-stat-label">Active Users</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-number">50+</div>
                            <div className="hero-stat-label">Verified Providers</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-number">10K+</div>
                            <div className="hero-stat-label">Bookings Made</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="features-section">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="section-title">Why Choose Us?</h2>
                        <p className="section-subtitle">
                            Everything you need for seamless appointment management
                        </p>
                    </div>
                    <Row className="g-4">
                        <Col md={4}>
                            <div className="feature-card text-center slide-up delay-1">
                                <div className="feature-icon icon-blue">
                                    <FaCalendarAlt />
                                </div>
                                <h4 className="text-white mb-2">Easy Scheduling</h4>
                                <p className="text-muted mb-0">
                                    Book slots in seconds with our intuitive calendar interface. Pick your time, confirm, done.
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="feature-card text-center slide-up delay-2">
                                <div className="feature-icon icon-purple">
                                    <FaUserMd />
                                </div>
                                <h4 className="text-white mb-2">Verified Providers</h4>
                                <p className="text-muted mb-0">
                                    Connect with verified doctors, tutors, and experts. Every provider is vetted and approved.
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="feature-card text-center slide-up delay-3">
                                <div className="feature-icon icon-green">
                                    <FaCheckCircle />
                                </div>
                                <h4 className="text-white mb-2">Instant Confirmation</h4>
                                <p className="text-muted mb-0">
                                    Get immediate booking confirmation and reminders. Never miss an appointment again.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* How it Works Section */}
            <div className="how-it-works-section">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-subtitle">
                            Three simple steps to your next appointment
                        </p>
                    </div>
                    <Row className="g-4">
                        <Col md={4}>
                            <div className="step-card slide-up delay-1">
                                <div className="step-number">1</div>
                                <h5 className="text-white mb-2">Browse Services</h5>
                                <p className="text-muted mb-0">
                                    Explore our wide range of services from verified providers.
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="step-card slide-up delay-2">
                                <div className="step-number">2</div>
                                <h5 className="text-white mb-2">Pick a Slot</h5>
                                <p className="text-muted mb-0">
                                    Choose a time that works best for you from available slots.
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="step-card slide-up delay-3">
                                <div className="step-number">3</div>
                                <h5 className="text-white mb-2">Confirm & Pay</h5>
                                <p className="text-muted mb-0">
                                    Secure payment and instant booking confirmation.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* CTA Section */}
            <div className="cta-section">
                <Container>
                    <div className="cta-card slide-up">
                        <h2 className="text-white mb-3" style={{ fontSize: '2rem' }}>
                            Ready to Get Started?
                        </h2>
                        <p className="text-muted mb-4" style={{ maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                            Join thousands of users who trust TimeBooking for their appointments.
                        </p>
                        <div className="d-flex justify-content-center gap-3">
                            <Button as={Link} to="/signup" className="btn-primary" size="lg">
                                Create Free Account
                            </Button>
                            <Button as={Link} to="/services" className="btn-outline-primary" size="lg">
                                Browse Services
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
};

export default Home;
