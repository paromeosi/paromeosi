import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';
import Header from './components/Header';
import Gallery from './pages/Gallery';
import About from './pages/About';
import { getTags } from './services/api';

function App() {
  const [activeTag, setActiveTag] = useState(null);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const fetchedTags = await getTags();
        setTags(fetchedTags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    // Fetch iniziale
    fetchTags();

    // Polling ogni 30 secondi per aggiornare i tag
    const interval = setInterval(fetchTags, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Header 
          tags={tags}
          activeTag={activeTag}
          onTagSelect={setActiveTag}
        />
        <Routes>
          <Route path="/" element={<Gallery activeTag={activeTag} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;