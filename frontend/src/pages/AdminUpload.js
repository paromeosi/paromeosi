import React, { useState } from 'react';
import styled from 'styled-components';
import { adminUploadPhoto } from '../services/api';

const AdminContainer = styled.div`
  max-width: 800px;
  min-height: calc(100vh - 100px);
  margin: 0 auto;
  padding: ${props => props.theme.spacing.large};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  width: 100%;
  max-width: 500px;
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

  &:hover {
    opacity: 0.7;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  margin-top: ${props => props.theme.spacing.medium};
  font-weight: 300;
  text-align: center;
`;

const Title = styled.h1`
  font-weight: 300;
  margin-bottom: ${props => props.theme.spacing.large};
  text-align: center;
`;

const AdminUpload = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [tag, setTag] = useState('');
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    if (password === 'paromeosi2024') {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setMessage('Password non corretta');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !tag) {
      setMessage('Seleziona un file e inserisci un tag');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('tag', tag.toLowerCase());

    try {
      const result = await adminUploadPhoto(formData);
      setMessage('Foto caricata con successo');
      setFile(null);
      setTag('');
      e.target.reset();
    } catch (error) {
      setMessage('Errore durante il caricamento');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
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
      <Title>Carica una nuova foto</Title>
      <Form onSubmit={handleUpload}>
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept="image/*"
          required
        />
        <Input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="tag della foto"
          required
        />
        <Button type="submit" disabled={!file || !tag || isUploading}>
          {isUploading ? 'caricamento in corso...' : 'carica'}
        </Button>
        {message && <Message>{message}</Message>}
      </Form>
    </AdminContainer>
  );
};

export default AdminUpload;