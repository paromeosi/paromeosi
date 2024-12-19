import React, { useState } from 'react';
import styled from 'styled-components';
import { submitPhoto } from '../services/api';

const UploadContainer = styled.div`
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
`;

const UploadForm = styled.form`
  width: 100%;
  max-width: 500px;
  margin-top: ${props => props.theme.spacing.large};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.large};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.small};
  font-weight: 300;
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.small};
  border: 1px solid ${props => props.theme.colors.text};
  background: transparent;
  
  &:focus {
    outline: none;
    opacity: 0.7;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.small};
  border: 1px solid ${props => props.theme.colors.text};
  background: transparent;
  cursor: pointer;
  transition: opacity 0.2s ease;

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
  padding: ${props => props.theme.spacing.small};
  text-align: center;
  font-weight: 300;
`;

const Upload = () => {
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const formData = new FormData();
    formData.append('email', email);
    formData.append('image', file);

    try {
      await submitPhoto(formData);
      setMessage('Grazie! La tua foto è stata inviata con successo.');
      setEmail('');
      setFile(null);
      e.target.reset();
    } catch (error) {
      setMessage('Si è verificato un errore. Per favore riprova più tardi.');
      console.error('Upload error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UploadContainer>
      <Title>Partecipa al progetto</Title>
      <UploadForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="photo">Foto</Label>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </FormGroup>
        <SubmitButton type="submit" disabled={isSubmitting || !email || !file}>
          {isSubmitting ? 'Invio in corso...' : 'Invia'}
        </SubmitButton>
        {message && <Message>{message}</Message>}
      </UploadForm>
    </UploadContainer>
  );
};

export default Upload;