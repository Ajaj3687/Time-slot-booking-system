import { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaClock } from 'react-icons/fa';

const MyNavbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <Navbar expand="lg" variant="dark" fixed="top" className="glass py-3">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
                    <div style={{
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        borderRadius: '10px',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                    }}>
                        <FaClock size={18} color="#fff" />
                    </div>
                    <span style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: '1.3rem',
                        background: 'linear-gradient(135deg, #fff, var(--primary-light))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        TimeBooking
                    </span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="ms-auto align-items-center gap-1">
                        <Nav.Link as={Link} to="/" className="mx-1"
                            style={isActive('/') ? { color: '#fff', fontWeight: 600 } : {}}>
                            Home
                        </Nav.Link>
                        <Nav.Link as={Link} to="/services" className="mx-1"
                            style={isActive('/services') ? { color: '#fff', fontWeight: 600 } : {}}>
                            Services
                        </Nav.Link>
                        {!user ? (
                            <>
                                <Nav.Link as={Link} to="/login" className="mx-1"
                                    style={isActive('/login') ? { color: '#fff', fontWeight: 600 } : {}}>
                                    Login
                                </Nav.Link>
                                <Button as={Link} to="/signup" className="ms-2 btn-primary" size="sm"
                                    style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>
                                    Sign Up
                                </Button>
                            </>
                        ) : (
                            <>
                                {user.role === 'provider' && (
                                    <Nav.Link as={Link} to="/provider/dashboard" className="mx-1"
                                        style={isActive('/provider/dashboard') ? { color: '#fff', fontWeight: 600 } : {}}>
                                        Dashboard
                                    </Nav.Link>
                                )}
                                {user.role === 'admin' && (
                                    <Nav.Link as={Link} to="/admin/dashboard" className="mx-1"
                                        style={isActive('/admin/dashboard') ? { color: '#fff', fontWeight: 600 } : {}}>
                                        Admin Panel
                                    </Nav.Link>
                                )}
                                {user.role === 'user' && (
                                    <Nav.Link as={Link} to="/bookings" className="mx-1"
                                        style={isActive('/bookings') ? { color: '#fff', fontWeight: 600 } : {}}>
                                        My Bookings
                                    </Nav.Link>
                                )}
                                <div style={{
                                    width: '1px',
                                    height: '24px',
                                    background: 'var(--border-light)',
                                    margin: '0 0.5rem'
                                }} />
                                <Button variant="outline-light" onClick={handleLogout}
                                    className="btn-outline-primary"
                                    style={{ padding: '0.45rem 1.3rem', fontSize: '0.85rem' }}>
                                    Logout
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default MyNavbar;
