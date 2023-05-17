import { signOut } from '@src/context/slices/auth_slice';
import { store } from '@src/context/store';
import { Col, Row } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { State } from '../models/State';

function NavBar() {
  const isLoggedIn = useSelector((state: State) => state.isLoggedIn);
  const username = useSelector((state: State) => state.username);

  const runSignout = () => {
    store.dispatch(signOut());
  };

  return (
    <Navbar variant='dark' sticky='top' className='navSemiBackground'>
      <Container style={{ paddingTop: '0.3rem', paddingBottom: '0.3rem' }}>
        <Container className='p-0 m-0'>
          <Row style={{ display: 'flex', alignItems: 'center' }}>
            <Col md='2'>
              <Navbar.Brand
                href='/Home'
                style={{
                  display: 'flex',
                  justifyContent: 'left',
                  alignItems: 'center',
                }}>
                <img
                  alt=''
                  src='https://storage.googleapis.com/public_images_us/icon-512x512.png'
                  width='40'
                  height='40'
                  className='d-inline-block align-top'
                  style={{ borderRadius: '15%' }}
                />{' '}
                <strong style={{ marginLeft: '1rem' }}>Rails Todo App</strong>
              </Navbar.Brand>
            </Col>
            <Col md='8'></Col>
            <Col md='2'>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'right',
                  alignItems: 'center',
                }}>
                {isLoggedIn ? (
                  <NavDropdown
                    style={{ color: 'white' }}
                    title={username}
                    id='basic-nav-dropdown'>
                    <NavDropdown.Item
                      style={{ color: 'black' }}
                      onClick={runSignout}>
                      Signout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Nav.Link style={{ color: 'white' }} as={Link} to='/Login'>
                    Login
                  </Nav.Link>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
    </Navbar>
  );
}

export default NavBar;
