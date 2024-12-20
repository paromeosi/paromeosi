import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getPhotos, deletePhoto } from '../services/api';

const ManageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.medium};
`;

const Title = styled.h1`
  font-weight: 300;
  margin-bottom: ${props => props.theme.spacing.large};
  text-align: center;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2px;
`;

const PhotoItem = styled.div`
  position: relative;
  padding-bottom: 100%;
  background: ${props => props.theme.colors.background};
  overflow: hidden;
`;

const Photo = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PhotoInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${props => props.theme.spacing.small};
  background: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 300;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.small};
  right: ${props => props.theme.spacing.small};
  border: 1px solid ${props => props.theme.colors.text};
  background: white;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const Message = styled.div`
  position: fixed;
  bottom: ${props => props.theme.spacing.large};
  left: 50%;
  transform: translateX(-50%);
  padding: ${props => props.theme.spacing.medium};
  background: white;
  border: 1px solid ${props => props.theme.colors.text};
  text-align: center;
  font-weight: 300;
`;

const AdminManage = () => {
  const [photos, setPhotos] = useState([]);
  const [message, setMessage] = useState('');

  const fetchPhotos = async () => {
    try {
      const data = await getPhotos();
      setPhotos(data);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setMessage('Errore nel caricamento delle foto');
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleDelete = async (photoId) => {
    if (window.confirm('Sei sicuro di voler eliminare questa foto?')) {
      try {
        await deletePhoto(photoId);
        setMessage('Foto eliminata con successo');
        fetchPhotos(); // Ricarica le foto dopo l'eliminazione
        setTimeout(() => setMessage(''), 3000); // Nascondi il messaggio dopo 3 secondi
      } catch (error) {
        setMessage('Errore durante l\'eliminazione della foto');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  return (
    <ManageContainer>
      <Title>Gestione Foto</Title>
      <PhotoGrid>
        {photos.map((photo) => (
          <PhotoItem key={photo._id}>
            <Photo src={`${process.env.NODE_ENV === 'production' 
              ? 'https://paromeosi-backend.onrender.com' 
              : 'http://localhost:5001'}${photo.url}`} 
              alt={photo.tag} 
            />
            <PhotoInfo>
              Tag: {photo.tag}
            </PhotoInfo>
            <DeleteButton onClick={() => handleDelete(photo._id)}>
              elimina
            </DeleteButton>
          </PhotoItem>
        ))}
      </PhotoGrid>
      {message && <Message>{message}</Message>}
    </ManageContainer>
  );
};

export default AdminManage;