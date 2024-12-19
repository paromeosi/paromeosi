import React from 'react';
import styled from 'styled-components';

const TagContainer = styled.div`
  position: fixed;
  top: ${props => props.theme.spacing.large};
  right: ${props => props.theme.spacing.large};
  padding: ${props => props.theme.spacing.medium};
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.text};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    position: static;
    margin-bottom: ${props => props.theme.spacing.large};
  }
`;

const Tag = styled.button`
  display: block;
  width: 100%;
  margin-bottom: ${props => props.theme.spacing.small};
  background: ${props => props.active ? props.theme.colors.text : 'transparent'};
  color: ${props => props.active ? props.theme.colors.background : props.theme.colors.text};

  &:last-child {
    margin-bottom: 0;
  }
`;

const TagFilter = ({ tags, activeTag, onTagSelect }) => {
  return (
    <TagContainer>
      <Tag 
        active={!activeTag} 
        onClick={() => onTagSelect(null)}
      >
        All
      </Tag>
      {tags.map(tag => (
        <Tag
          key={tag}
          active={activeTag === tag}
          onClick={() => onTagSelect(tag)}
        >
          {tag}
        </Tag>
      ))}
    </TagContainer>
  );
};

export default TagFilter;