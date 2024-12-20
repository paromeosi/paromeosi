import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const AdminContainer = styled.div`
  max-width: 800px;
  min-height: calc(100vh - 100px);
  margin: 0 auto;
  padding: ${props => props.theme.spacing.large};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-weight: 300;
  margin-bottom: ${props => props.theme.spacing.large};
  text-align: center;
`;

const Form = styled.form`
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.medium};
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.small};
  border: 1px solid ${props => props.theme.colors.text};
  background: transparent;
  font-weight: 300;
`;

const Button = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.small};
  border: 1px solid ${props => props.theme.colors.text};
  background: transparent;
  cursor: pointer;
  transition: opacity 0.2s ease;
  font-weight: 300;
  margin-bottom: ${props => props.theme.spacing.small};

  &:hover {
    opacity: 0.7;
  }
`;

const Message = styled.div`
  margin-top: ${props => props.theme.spacing.medium};
  text-align: center;
  font-weight: 300;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.medium};
  width: 100%;
  max-width: 300px;
`;

const AdminPanel = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    if (password === 'paromeosi2024') {
      setIsAuthenticated(true);
      setPassword('');
      setMessage('');
    } else {
      setMessage('Password non corretta');
    }
  };

  if (!isAuthenticated) {
    return (
      <AdminContainer>
        <Title>Accesso</Title>
        <Form onSubmit={handleAuth}>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <Button type="submit">accedi</Button>
          {message && <Message>{message}</Message>}
        </Form>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <Title>Pannello Amministrazione</Title>
      <ButtonContainer>
        <Button onClick={() => navigate('/segreta/upload')}>
          upload foto
        </Button>
        <Button onClick={() => navigate('/segreta/manage')}>
          gestione foto
        </Button>
      </ButtonContainer>
    </AdminContainer>
  );
};

export default AdminPanel;