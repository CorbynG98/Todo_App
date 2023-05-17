import React from 'react';
import { Card, Container } from 'react-bootstrap';

export default function SignupPage() {
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
        <Card style={{ padding: '2rem' }}>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>Signup</p>
        </Card>
      </Container>
    </React.Fragment>
  );
}
