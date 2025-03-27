import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import api from "../../utils/api";

// Modal para adicionar URL do YouTube
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
`;

const ModalContent = styled(motion.div)`
  background: rgba(30, 30, 34, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #f8f9fa;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
`;

const UrlInput = styled.input`
  width: 100%;
  padding: 1rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f8f9fa;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #6C63FF;
  }
`;

const ModalButtonsGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ModalButton = styled(motion.button)`
  flex: 1;
  padding: 1rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  
  &.primary {
    background: linear-gradient(45deg, #6C63FF, #00D9F5);
    color: white;
  }
  
  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: #f8f9fa;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const AddYoutubeUrlModal = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [cookies, setCookie] = useCookies(['userToken', 'userData']);
  
  useEffect(() => {
    const handleAddUrlClick = () => {
      setIsVisible(true);
    };
    
    // Adicionar event listener ao botão de adicionar URL
    document.querySelector('button[data-add-url]')?.addEventListener('click', handleAddUrlClick);
    
    return () => {
      document.querySelector('button[data-add-url]')?.removeEventListener('click', handleAddUrlClick);
    };
  }, []);
  
  const handleSubmit = async () => {
    // Aqui seria feita a lógica de processamento da URL
    const youtubeData = await api.post('/music/create', {
      url: youtubeUrl,
      email: cookies.userData,
      token: cookies.userToken
    });
    console.log(cookies.userData, cookies.userToken, youtubeData);
    
    // Após processamento, fechar o modal
    setIsVisible(false);
    setYoutubeUrl('');
    
    return {
      succes: true,
    }
  };
  
  return (
    <ModalOverlay 
      isVisible={isVisible}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      exit={{ opacity: 0 }}
    >
      <ModalContent
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: isVisible ? 1 : 0.9, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ModalTitle>Adicionar música do YouTube</ModalTitle>
        
        <p style={{ marginBottom: '1.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>
          Cole o link de um vídeo do YouTube para adicionar à sua biblioteca
        </p>
        
        <UrlInput
          type="text"
          placeholder="https://www.youtube.com/watch?v=..."
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
        />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <input type="checkbox" id="playlist" />
          <label htmlFor="playlist" style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            Adicionar como playlist (se aplicável)
          </label>
        </div>
        
        <ModalButtonsGroup>
          <ModalButton 
            className="secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsVisible(false)}
          >
            Cancelar
          </ModalButton>
          
          <ModalButton 
            className="primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
          >
            Adicionar
          </ModalButton>
        </ModalButtonsGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddYoutubeUrlModal;
