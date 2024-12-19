import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  padding: ${props => props.theme.spacing.medium};
  border-bottom: 1px solid ${props => props.theme.colors.text};
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: ${props => props.isAbout ? '32px' : '24px'};
  font-weight: 300;
  letter-spacing: 2px;
  margin-bottom: ${props => props.isAbout ? '0' : props.theme.spacing.medium};
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  gap: ${props => props.theme.spacing.large};
  margin-bottom: ${props => props.theme.spacing.large};
`;

const NavLink = styled(Link)`
  font-weight: 300;
  transition: opacity 0.2s ease;
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  text-transform: lowercase;

  &:hover {
    opacity: 0.7;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.medium};
  justify-content: center;
  margin-top: ${props => props.theme.spacing.medium};
`;

const TagButton = styled.button.attrs(props => ({
  'data-active': props.active ? 'true' : 'false'
}))`
  background: transparent;
  border: none;
  font-weight: ${props => props['data-active'] === 'true' ? '700' : '300'};
  font-style: ${props => props['data-active'] === 'true' ? 'italic' : 'normal'};
  cursor: pointer;
  transition: opacity 0.2s ease;
  padding: 0;
  text-transform: lowercase;

  &:hover {
    opacity: 0.7;
  }
`;

const Header = ({ tags = [], activeTag, onTagSelect }) => {
  const location = useLocation();
  const isAbout = location.pathname === '/about';

  if (isAbout) {
    return (
      <HeaderContainer>
        <HeaderContent>
          <Logo to="/" isAbout>PAROMEOSI</Logo>
        </HeaderContent>
      </HeaderContainer>
    );
  }

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">PAROMEOSI</Logo>
        <NavLinks>
          <NavLink to="/about">about</NavLink>
        </NavLinks>
        <TagsContainer>
          <TagButton 
            data-active={!activeTag}
            onClick={() => onTagSelect(null)}
          >
            all
          </TagButton>
          {tags.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            .map(tag => (
              <TagButton
                key={tag}
                data-active={activeTag === tag}
                onClick={() => onTagSelect(tag)}
              >
                {tag}
              </TagButton>
          ))}
        </TagsContainer>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;