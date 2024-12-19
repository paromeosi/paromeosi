import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.medium};
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.medium};
`;

const PhotoCard = styled.div`
  position: relative;
  border: 1px solid ${props => props.theme.colors.secondary};
  padding: ${props => props.theme.spacing.small};
`;

const DeleteButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.small};
  right: ${props => props.theme.spacing.small};
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
`;

const Admin = () => {
  const [photos, setPhotos] = useState([]);

  const handleDelete = async (photoId) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        await fetch(`http://localhost:5001/api/photos/${photoId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
          }
        });
        setPhotos(photos.filter(photo => photo._id !== photoId));
      } catch (error) {
        console.error('Error deleting photo:', error);
      }
    }
  };

  return (
    <AdminContainer>
      <h1>Admin Panel</h1>
      <PhotoGrid>
        {photos.map(photo => (
          <PhotoCard key={photo._id}>
            <img src={photo.url} alt={photo.tag} />
            <p>Tag: {photo.tag}</p>
            <DeleteButton onClick={() => handleDelete(photo._id)}>
              Delete
            </DeleteButton>
          </PhotoCard>
        ))}
      </PhotoGrid>
    </AdminContainer>
  );
};

export default Admin;