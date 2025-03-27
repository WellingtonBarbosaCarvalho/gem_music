import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService.js';

// Componentes estilizados
const AvatarButton = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, #6C63FF, #00D9F5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  cursor: pointer;
  position: relative;
`;

const MenuWrapper = styled(motion.div)`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 220px;
  background: rgba(30, 30, 34, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
`;

const UserInfo = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(45deg, #6C63FF, #00D9F5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin-right: 0.8rem;
`;

const UserDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.h4`
  margin: 0;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserEmail = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MenuItems = styled.div`
  padding: 0.5rem;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 0.8rem;
  text-align: left;
  background: none;
  border: none;
  border-radius: 8px;
  color: #f8f9fa;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &.danger {
    color: #ff4757;
  }
  
  span {
    margin-right: 0.8rem;
    font-size: 1.1rem;
  }
`;

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  
  const getInitials = () => {
    if (!user) return '?';
    
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };
  
  useEffect(() => {
    // Fechar o menu ao clicar fora dele
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleLogout = async () => {
    await AuthService.logout();
    navigate('/login');
  };
  
  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <AvatarButton onClick={() => setIsOpen(!isOpen)}>
        {getInitials()}
      </AvatarButton>
      
      <AnimatePresence>
        {isOpen && (
          <MenuWrapper
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <UserInfo>
              <UserAvatar>{getInitials()}</UserAvatar>
              <UserDetails>
                <UserName>{user ? `${user.firstName} ${user.lastName}` : 'Usuário'}</UserName>
                <UserEmail>{user ? user.email : 'email@example.com'}</UserEmail>
              </UserDetails>
            </UserInfo>
            
            <MenuItems>
              <MenuItem onClick={() => navigate('/profile')}>
                <span>👤</span> Meu Perfil
              </MenuItem>
              <MenuItem>
                <span>⚙️</span> Configurações
              </MenuItem>
              <MenuItem>
                <span>🎵</span> Minhas Playlists
              </MenuItem>
              <MenuItem>
                <span>📱</span> Dispositivos
              </MenuItem>
              <MenuItem className="danger" onClick={handleLogout}>
                <span>🚪</span> Sair
              </MenuItem>
            </MenuItems>
          </MenuWrapper>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
