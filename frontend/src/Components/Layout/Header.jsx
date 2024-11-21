import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import logo from '/images/shoespotlogo.png';
import { useAuth } from '../../context/AuthContext'; // Correct import path
import AccountMenu from '../../Components/User/AccountMenu'; 

const Header = () => {
  const { user } = useAuth();

  return (
    <Navbar variant="dark" expand="lg" className='navbar'>
      <Container>
        <Navbar.Brand href="/">
          <img
            src={logo}
            alt="ShoeSpot Logo"
            style={{ width: '40px', height: '40px', marginRight: '10px' }}
          />
          ShoeSpot
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/products">Shoes</Nav.Link>
            <Nav.Link href="/">Let's Connect</Nav.Link>
            <Nav.Link href="/">About Us</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {user ? (
              <AccountMenu /> // Display AccountMenu if user is logged in
            ) : (
              <Nav.Link href="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
