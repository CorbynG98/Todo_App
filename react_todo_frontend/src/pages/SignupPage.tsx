import NotyfContext from '@src/context/NotyfContext';
import { signUp } from '@src/context/slices/auth_slice';
import { store } from '@src/context/store';
import { AuthResource } from '@src/models/AuthResource';
import { State } from '@src/models/State';
import React, { useContext, useState } from 'react';
import { Button, Card, Container, Form, Nav, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const isLoggedIn = useSelector((state: State) => state.isLoggedIn);
  const [signupData, setSignupData] = useState<AuthResource>(
    {} as AuthResource,
  );
  const [signupLoading, setsignupLoading] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>('' as string);
  const [confirmPasswordError, setConfirmPasswordError] =
    useState<boolean>(true);
  const navigate = useNavigate();
  const notyf = useContext(NotyfContext);

  const attemptSignup = async (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    if (signupLoading) return;
    if (confirmPasswordError) {
      notyf.error('Please fix validation errors');
      return;
    }

    setsignupLoading(true);
    try {
      await store.dispatch(
        signUp({
          username: signupData.username,
          password: signupData.password,
        }),
      );
      setSignupData({} as AuthResource);
      setsignupLoading(false);
      navigate('/Home');
    } catch (err: any) {
      // Handle errors here with some state variables probably
      setSignupData((previous) => ({ ...previous, password: '' }));
      setsignupLoading(false);
    }
  };

  const renderSignupForm = () => {
    return (
      <Form noValidate validated={true} onSubmit={attemptSignup}>
        <Form.Group className='mb-3 input-container' controlId='formUsername'>
          <Form.Label style={{ color: 'black' }}>Username</Form.Label>
          <Form.Control
            type='text'
            className='input-box'
            placeholder='Your username'
            value={signupData.username ?? ''}
            onChange={(event) =>
              setSignupData((prev) => ({
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
            value={signupData.password ?? ''}
            onChange={(event) => {
              setSignupData((prev) => ({
                ...prev,
                password: event.target.value,
              }));
              if (event.target.value != confirmPassword)
                setConfirmPasswordError(true);
              else setConfirmPasswordError(false);
            }}
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
        <Form.Group
          className='mb-3 input-container'
          controlId='formConfirmPassword'>
          <Form.Label style={{ color: 'black' }}>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            className='input-box'
            placeholder='Confirm password'
            value={confirmPassword ?? ''}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              if (event.target.value != signupData.password)
                setConfirmPasswordError(true);
              else setConfirmPasswordError(false);
            }}
            isInvalid={confirmPasswordError}
            isValid={!confirmPasswordError}
            required
            minLength={signupData.password?.length ?? 8}
            maxLength={signupData.password?.length ?? 8}
          />
          <Form.Control.Feedback type='invalid'>
            Must be the same as above
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
            disabled={signupLoading}
            style={{ width: '5rem' }}>
            {signupLoading ? (
              <Spinner animation='border' size='sm' />
            ) : (
              'Submit'
            )}
          </Button>
          <Nav.Link style={{ color: 'black' }} as={Link} to='/Login'>
            Have an account?
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
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>Signup</p>
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
            renderSignupForm()
          )}
        </Card>
      </Container>
    </React.Fragment>
  );
}
