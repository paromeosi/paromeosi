import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getPhotos, getPhotosByTag } from '../services/api';

const GalleryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.medium};
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: repeat(auto-fill, minmax(calc(100% / 5), 1fr));
  }
`;

const PhotoItem = styled.div`
  position: relative;
  padding-bottom: 100%;
  background: ${props => props.theme.colors.background};
  overflow: hidden;
  cursor: pointer;
`;

const PhotoImg = styled.img.attrs(props => ({
  'data-loaded': props.isLoaded ? 'true' : 'false'
}))`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.2s ease;
  opacity: ${props => props['data-loaded'] === 'true' ? 1 : 0};
  
  &:hover {
    opacity: 0.8;
  }
`;

const Placeholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f0f0f0;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalImage = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.medium};
  right: ${props => props.theme.spacing.medium};
  border: 1px solid ${props => props.theme.colors.text};
  background: transparent;
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.large};
  font-weight: 300;
`;

const LazyImage = ({ photo, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const imageUrl = `${process.env.NODE_ENV === 'production' 
    ? 'https://paromeosi-backend.onrender.com' 
    : 'http://localhost:5001'}${isLoaded ? photo.url : photo.thumbnailUrl}`;

  return (
    <>
      {!isLoaded && !error && <Placeholder />}
      <PhotoImg
        src={imageUrl}
        alt={photo.tag}
        isLoaded={isLoaded}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setError(true);
          console.error('Error loading image:', imageUrl);
        }}
        onClick={onClick}
        loading="lazy"
      />
    </>
  );
};

const Gallery = ({ activeTag }) => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const data = activeTag 
          ? await getPhotosByTag(activeTag)
          : await getPhotos();
        setPhotos(data);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [activeTag]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedPhoto) {
        setSelectedPhoto(null);
      }
    };

    const preventDefault = (e) => e.preventDefault();

    if (selectedPhoto) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('contextmenu', preventDefault);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', preventDefault);
    };
  }, [selectedPhoto]);

  if (loading) {
    return <LoadingText>Caricamento...</LoadingText>;
  }

  return (
    <GalleryContainer>
      <PhotoGrid>
        {photos.map((photo) => (
          <PhotoItem key={photo._id}>
            <LazyImage
              photo={photo}
              onClick={() => setSelectedPhoto(photo)}
            />
          </PhotoItem>
        ))}
      </PhotoGrid>

      {selectedPhoto && (
        <Modal onClick={() => setSelectedPhoto(null)}>
          <CloseButton onClick={() => setSelectedPhoto(null)}>
            Chiudi
          </CloseButton>
          <ModalImage 
            src={`${process.env.NODE_ENV === 'production' 
              ? 'https://paromeosi-backend.onrender.com' 
              : 'http://localhost:5001'}${selectedPhoto.url}`}
            alt={selectedPhoto.tag}
            onClick={(e) => e.stopPropagation()}
          />
        </Modal>
      )}
    </GalleryContainer>
  );
};

export default Gallery;