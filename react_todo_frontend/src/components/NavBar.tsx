import { changeApiType, signOut } from '@src/context/slices/auth_slice';
import { store } from '@src/context/store';
import { Col, Row } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Select, { SingleValue } from 'react-select';
import { State } from '../models/State';

function NavBar() {
  const isLoggedIn = useSelector((state: State) => state.isLoggedIn);
  const username = useSelector((state: State) => state.username);
  const apiType = useSelector((state: State) => state.apiType);

  const runSignout = () => {
    store.dispatch(signOut());
  };

  const getApiTypeLabel = (type: string) => {
    switch (type) {
      case 'node':
        return 'NodeJS';
      case 'rails':
        return 'Rails';
      case 'rust':
        return 'Rust';
      default:
        return 'Rust';
    }
  };

  const handleApiTypeChange = (
    newValue: SingleValue<{ value: string; label: string }>,
  ) => {
    store.dispatch(changeApiType(newValue?.value ?? 'rust'));
  };

  const options = [
    { value: 'node', label: getApiTypeLabel('node') },
    { value: 'rails', label: getApiTypeLabel('rails') },
    { value: 'rust', label: getApiTypeLabel('rust') },
  ];

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
                <strong style={{ marginLeft: '1rem' }}>Todo App</strong>
              </Navbar.Brand>
            </Col>
            <Col md='6'></Col>
            <Col md='4'>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'right',
                  alignItems: 'center',
                }}>
                <div style={{ marginRight: '1rem', width: '10rem' }}>
                  <Select
                    options={options}
                    value={{
                      value: apiType,
                      label: `${getApiTypeLabel(apiType)}`,
                    }}
                    onChange={handleApiTypeChange}
                  />
                </div>
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
