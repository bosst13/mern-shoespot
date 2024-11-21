import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import logo from '/images/shoespotlogo.png';
import { useAuth } from '../../context/AuthContext'; // Correct import path
import AccountMenu from '../../Components/User/AccountMenu'; 
import { MdOutlineRestaurantMenu } from 'react-icons/md';
import OrderSidebar from '../Product/OrderSidebar';

const Header = ({ orderCount, onUpdateOrderCount }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
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
              {/* <Nav.Link href="/">Let's Connect</Nav.Link>
              <Nav.Link href="/">About Us</Nav.Link> */}

              <Nav className="ms-auto d-flex align-items-center">
                <div
                  className="order-icon-container"
                  style={{ position: 'relative', marginRight: '15px' }}
                >
                  <MdOutlineRestaurantMenu
                    style={{ fontSize: '1.5rem', color: 'white', cursor: 'pointer' }}
                    onClick={toggleSidebar}
                  />
                  {orderCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-10px',
                        backgroundColor: 'gold',
                        color: 'black',
                        borderRadius: '50%',
                        padding: '2px 6px',
                        fontSize: '0.75rem',
                      }}
                    >
                      {orderCount}
                    </span>
                  )}
                </div>
                {user ? <AccountMenu /> : <Nav.Link href="/login">Login</Nav.Link>}
              </Nav>
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

      {/* Sidebar Component */}
      <OrderSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        user={user}
        onUpdateOrderCount={onUpdateOrderCount}
      />
    </>
  );
};

export default Header;