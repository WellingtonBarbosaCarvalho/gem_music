import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Componentes estilizados
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #121214, #1E1E22);
  color: #f8f9fa;
  font-family: 'Poppins', sans-serif;
  padding-bottom: 5rem;
`;

const Header = styled.header`
  height: 250px;
  background: linear-gradient(45deg, #6C63FF, #00D9F5);
  position: relative;
`;

const BackButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
`;

const SettingsButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -75px;
  margin-bottom: 2rem;
`;

const ProfileAvatar = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(45deg, #6C63FF, #00D9F5);
  border: 5px solid #1E1E22;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const ProfileName = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const ProfileStats = styled.div`
  display: flex;
  gap: 2rem;
  margin: 1rem 0;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatNumber = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: #00D9F5;
`;

const StatLabel = styled.span`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

const ActionButton = styled(motion.button)`
  padding: 0.8rem 2rem;
  background: linear-gradient(45deg, #6C63FF, #00D9F5);
  border: none;
  border-radius: 50px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
`;

const ContentTabs = styled.div`
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
  padding: 0 1rem;
`;

const Tab = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? '#00D9F5' : 'rgba(255, 255, 255, 0.5)'};
  font-size: 1rem;
  font-weight: ${props => props.active ? '600' : '400'};
  padding: 1rem 0;
  cursor: pointer;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 100%;
    height: 3px;
    background: linear-gradient(45deg, #6C63FF, #00D9F5);
    transform: scaleX(${props => props.active ? '1' : '0'});
    transition: transform 0.3s ease;
  }
`;

const ContentSection = styled.div`
  padding: 0 1.5rem;
`;

const SongsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SongItem = styled(motion.div)`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const SongThumbnail = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  margin-right: 1rem;
  flex-shrink: 0;
`;

const SongInfo = styled.div`
  flex: 1;
  min-width: 0; /* Permite que o texto possa ser truncado */
`;

const SongTitle = styled.h4`
  margin: 0 0 0.3rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SongArtist = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SongControls = styled.div`
  display: flex;
  gap: 1rem;
`;

const SongButton = styled(motion.button)`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 1.2rem;
`;

const PlaylistItem = styled(motion.div)`
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  height: 120px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const PlaylistCover = styled.div`
  width: 120px;
  flex-shrink: 0;
  background-size: cover;
  background-position: center;
`;

const PlaylistInfo = styled.div`
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`;

const NoContentMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.5);
`;

const Footer = styled.footer`
  display: flex;
  justify-content: space-around;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 100;
`;

const FooterIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${props => props.active ? '#00D9F5' : 'rgba(255, 255, 255, 0.5)'};
  font-size: 0.8rem;
  cursor: pointer;
  
  svg {
    font-size: 1.5rem;
    margin-bottom: 0.3rem;
  }
`;

// Dados mockados para teste
const favoriteSongs = [
  {
    id: 1,
    title: 'What a Beautiful Name',
    artist: 'Hillsong Worship',
    thumbnail: 'https://via.placeholder.com/60x60?text=Beautiful+Name',
    duration: '5:43'
  },
  {
    id: 2,
    title: 'Oceans (Where Feet May Fail)',
    artist: 'Hillsong United',
    thumbnail: 'https://via.placeholder.com/60x60?text=Oceans',
    duration: '8:56'
  },
  {
    id: 3,
    title: 'O Bom Pastor',
    artist: 'Ministério Zoe',
    thumbnail: 'https://via.placeholder.com/60x60?text=BomPastor',
    duration: '7:12'
  }
];

const playlists = [
  {
    id: 1,
    title: 'Louvor e Adoração',
    songCount: 24,
    thumbnail: 'https://via.placeholder.com/120x120?text=Louvor'
  },
  {
    id: 2,
    title: 'Para Meditar',
    songCount: 15,
    thumbnail: 'https://via.placeholder.com/120x120?text=Meditar'
  }
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('favorites');
  
  return (
    <PageContainer>
      <Header>
        <BackButton whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          ←
        </BackButton>
        <SettingsButton whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          ⚙️
        </SettingsButton>
      </Header>
      
      <ProfileInfo>
        <ProfileAvatar>JD</ProfileAvatar>
        <ProfileName>João Discípulo</ProfileName>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>@joaodiscipulo</p>
        
        <ProfileStats>
          <StatItem>
            <StatNumber>42</StatNumber>
            <StatLabel>Playlists</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>156</StatNumber>
            <StatLabel>Favoritas</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>28</StatNumber>
            <StatLabel>Seguindo</StatLabel>
          </StatItem>
        </ProfileStats>
        
        <ActionButton 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
        >
          Editar Perfil
        </ActionButton>
      </ProfileInfo>
      
      <ContentTabs>
        <Tab 
          active={activeTab === 'favorites'} 
          onClick={() => setActiveTab('favorites')}
        >
          Favoritas
        </Tab>
        <Tab 
          active={activeTab === 'playlists'} 
          onClick={() => setActiveTab('playlists')}
        >
          Playlists
        </Tab>
        <Tab 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')}
        >
          Histórico
        </Tab>
      </ContentTabs>
      
      <ContentSection>
        {activeTab === 'favorites' && (
          <>
            {favoriteSongs.length > 0 ? (
              <SongsList>
                {favoriteSongs.map((song, index) => (
                  <SongItem
                    key={song.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <SongThumbnail style={{ backgroundImage: `url(${song.thumbnail})` }} />
                    <SongInfo>
                      <SongTitle>{song.title}</SongTitle>
                      <SongArtist>{song.artist}</SongArtist>
                    </SongInfo>
                    <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.5)', marginRight: '1rem' }}>
                      {song.duration}
                    </span>
                    <SongControls>
                      <SongButton whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                        ▶️
                      </SongButton>
                      <SongButton whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                        ❤️
                      </SongButton>
                      <SongButton whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                        ⋯
                      </SongButton>
                    </SongControls>
                  </SongItem>
                ))}
              </SongsList>
            ) : (
              <NoContentMessage>
                <h3>Sem músicas favoritas ainda</h3>
                <p>Adicione músicas aos favoritos para vê-las aqui</p>
              </NoContentMessage>
            )}
          </>
        )}
        
        {activeTab === 'playlists' && (
          <>
            {playlists.length > 0 ? (
              <PlaylistGrid>
                {playlists.map((playlist, index) => (
                  <PlaylistItem
                    key={playlist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <PlaylistCover style={{ backgroundImage: `url(${playlist.thumbnail})` }} />
                    <PlaylistInfo>
                      <div>
                        <h3 style={{ margin: 0 }}>{playlist.title}</h3>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                          {playlist.songCount} músicas
                        </p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                          Criada por você
                        </span>
                        <SongButton whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                          ▶️
                        </SongButton>
                      </div>
                    </PlaylistInfo>
                  </PlaylistItem>
                ))}
              </PlaylistGrid>
            ) : (
              <NoContentMessage>
                <h3>Sem playlists ainda</h3>
                <p>Crie suas primeiras playlists para facilitar a organização</p>
              </NoContentMessage>
            )}
          </>
        )}
        
        {activeTab === 'history' && (
          <NoContentMessage>
            <h3>Seu histórico</h3>
            <p>Aqui você verá as músicas que ouviu recentemente</p>
            <ActionButton 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              style={{ margin: '1.5rem auto', display: 'block' }}
            >
              Explorar músicas
            </ActionButton>
          </NoContentMessage>
        )}
      </ContentSection>
      
      {/* Player de Música Minimizado */}
      <MiniPlayer />
      
      <Footer>
        <FooterIcon>
          <span>🏠</span>
          <span>Início</span>
        </FooterIcon>
        <FooterIcon>
          <span>🔍</span>
          <span>Buscar</span>
        </FooterIcon>
        <FooterIcon>
          <span>❤️</span>
          <span>Favoritos</span>
        </FooterIcon>
        <FooterIcon active>
          <span>👤</span>
          <span>Perfil</span>
        </FooterIcon>
      </Footer>
    </PageContainer>
  );
};

// Mini Player para a página de perfil
const MiniPlayerContainer = styled(motion.div)`
  position: fixed;
  bottom: 5rem;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  padding: 0.8rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 90;
`;

const MiniPlayerInfo = styled.div`
  display: flex;
  align-items: center;
`;

const MiniPlayerImg = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background-size: cover;
  background-position: center;
  margin-right: 1rem;
`;

const MiniPlayerText = styled.div`
  max-width: 150px;
  overflow: hidden;
`;

const MiniPlayerControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MiniPlayer = () => {
  return (
    <MiniPlayerContainer
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <MiniPlayerInfo>
        <MiniPlayerImg style={{ backgroundImage: 'url(https://via.placeholder.com/40)' }} />
        <MiniPlayerText>
          <h4 style={{ margin: 0, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            What a Beautiful Name
          </h4>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Hillsong Worship
          </p>
        </MiniPlayerText>
      </MiniPlayerInfo>
      
      <MiniPlayerControls>
        <SongButton whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
          ⏮️
        </SongButton>
        <SongButton whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
          ▶️
        </SongButton>
        <SongButton whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
          ⏭️
        </SongButton>
      </MiniPlayerControls>
    </MiniPlayerContainer>
  );
};

export default ProfilePage;
