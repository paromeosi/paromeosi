import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
  max-width: 800px;
  min-height: calc(100vh - 100px);
  margin: 0 auto;
  padding: ${props => props.theme.spacing.large};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Text = styled.div`
  font-weight: 300;
  line-height: 1.6;
  
  p {
    margin-bottom: ${props => props.theme.spacing.large};
  }

  p:last-child {
    margin-bottom: 0;
  }
`;

const ParticipateLink = styled.a`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  border-bottom: 1px solid ${props => props.theme.colors.text};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const About = () => {
  const mailtoLink = `mailto:qualcosacosigallery@gmail.com?subject=tag: [paromeosi in the wild]&body=Allega la tua foto a questa email`;

  return (
    <AboutContainer>
      <Text>
        <p>
          In questa indagine tra i pattern del quotidiano, si nasconde una ricerca sulle similitudini che formano il nostro mondo. Ogni foto è una raccolta, una catalogazione di elementi ricorrenti, un'osservazione puntuale di dettagli che potrebbero sembrare banali ma che, nella loro ripetizione, rivelano una complessità inaspettata.
        </p>
        <p>
          Mi concentro su un soggetto speciale: lo stesso, diverso. Come i cerchioni delle auto, i nasi delle persone, le forme dei telecomandi. Un esercizio estetico che invita a scoprire l'ordine intrinseco delle cose.
        </p>
        <p>
          Sei invitato a partecipare a questa ricerca inviando le tue osservazioni. <ParticipateLink href={mailtoLink}>Clicca qui</ParticipateLink> per condividere i tuoi pattern e le tue similitudini trovate.
        </p>
        <p>
          Questo sito web è stato sviluppato grazie all'intelligenza artificiale, e questo automatismo nella creazione diventa esso stesso un supporto alla manualità del progetto, rispecchiando il tema della ripetizione e della standardizzazione che caratterizza la ricerca.
        </p>
      </Text>
    </AboutContainer>
  );
};

export default About;