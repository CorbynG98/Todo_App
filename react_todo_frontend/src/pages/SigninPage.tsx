import { signIn } from '@src/context/slices/auth_slice';
import { store } from '@src/context/store';
import { AuthResource } from '@src/models/AuthResource';
import { State } from '@src/models/State';
import React, { useState } from 'react';
import { Button, Card, Container, Form, Nav, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

export default function SigninPage() {
  const isLoggedIn = useSelector((state: State) => state.isLoggedIn);
  const [loginData, setLoginData] = useState<AuthResource>({} as AuthResource);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const attemptLogin = async (event: any) => {
    if (loginLoading) return;
    event.preventDefault();
    event.stopPropagation();

    setLoginLoading(true);
    try {
      await store.dispatch(
        signIn({
          username: loginData.username,
          password: loginData.password,
        }),
      );
      setLoginData({} as AuthResource);
      setLoginLoading(false);
      navigate('/Home');
    } catch (err: any) {
      // Handle errors here with some state variables probably
      setLoginData((previous) => ({ ...previous, password: '' }));
      setLoginLoading(false);
    }
  };

  const renderLoginForm = () => {
    return (
      <Form noValidate validated={true} onSubmit={attemptLogin}>
        <Form.Group className='mb-3 input-container' controlId='formUsername'>
          <Form.Label style={{ color: 'black' }}>Username</Form.Label>
          <Form.Control
            type='text'
            className='input-box'
            placeholder='Your username'
            value={loginData.username ?? ''}
            onChange={(event) =>
              setLoginData((prev) => ({
                ...prev,
                username: event.target.value,
              }))
            }
            required
            minLength={3}
          />
          <Form.Control.Feedback type='invalid'>
            3 or more characters required
          </Form.Control.Feedback>
          <Form.Control.Feedback type='valid'>
            Looks good!
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className='mb-3 input-container' controlId='formPassword'>
          <Form.Label style={{ color: 'black' }}>Password</Form.Label>
          <Form.Control
            type='password'
            className='input-box'
            placeholder='Your password'
            value={loginData.password ?? ''}
            onChange={(event) =>
              setLoginData((prev) => ({
                ...prev,
                password: event.target.value,
              }))
            }
            required
            minLength={8}
          />
          <Form.Control.Feedback type='invalid'>
            8 or more characters required
          </Form.Control.Feedback>
          <Form.Control.Feedback type='valid'>
            Looks good!
          </Form.Control.Feedback>
        </Form.Group>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Button
            type='submit'
            disabled={loginLoading}
            style={{ width: '5rem' }}>
            {loginLoading ? <Spinner animation='border' size='sm' /> : 'Submit'}
          </Button>
          <Nav.Link style={{ color: 'black' }} as={Link} to='/Signup'>
            Need an account?
          </Nav.Link>
        </div>
      </Form>
    );
  };

  // Build UI
  return (
    <React.Fragment>
      <Container
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
        }}
        id='loginPage'>
        <Card style={{ width: '50%', padding: '2rem', marginTop: '2rem' }}>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>Login</p>
          {isLoggedIn ? (
            <div>
              <p>
                You are already logged in! I might do something with this at
                some stage.
              </p>
              <div style={{ display: 'flex' }}>
                <p>For now though,&nbsp;</p>
                <Nav.Link as={Link} to='/Home' style={{ color: '#55cc69' }}>
                  go home?
                </Nav.Link>
              </div>
              <div style={{ display: 'flex' }}>
                <p>Or continue to&nbsp;</p>
                <Nav.Link as={Link} to='/Admin' style={{ color: '#55cc69' }}>
                  profile page?
                </Nav.Link>
              </div>
            </div>
          ) : (
            renderLoginForm()
          )}
        </Card>
      </Container>
    </React.Fragment>
  );
}
