import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen;
    font-weight: 300;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  button {
    background: transparent;
    border: 1px solid ${props => props.theme.colors.text};
    padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
    cursor: pointer;
    font-weight: 300;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.7;
    }
  }

  a {
    color: ${props => props.theme.colors.text};
    text-decoration: none;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.7;
    }
  }
`;

export default GlobalStyle;