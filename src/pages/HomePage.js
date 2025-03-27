import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import UserMenu from '../components/sections/UserMenu.js';
import AuthService from '../services/AuthService.js';
import { defaultTrendingSongs, defaultCategories } from '../data/defaultData';
import AddYoutubeUrlModal from '../components/layout/AddYoutubeModal.js';
import ModernPlayer from '../components/layout/ModernPlayer.js';
import { useCookies } from 'react-cookie';
import { Play, Search, Heart, Home, User, Plus, X, Music, Headphones } from 'lucide-react';

// Variações de cores e gradientes
const colors = {
  primary: '#3e85f3',
  secondary: '#00D9F5',
  background: '#121214',
  backgroundLight: '#1E1E22',
  cardBg: 'rgba(30, 30, 34, 0.7)',
  textPrimary: '#f8f9fa',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  gradient: 'linear-gradient(45deg, #3e85f3, #00D9F5)'
};

// Animações
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Componentes estilizados
const PageContainer = styled.div`
  min-height: 100vh;
  background: ${colors.background};
  color: ${colors.textPrimary};
  font-family: 'Poppins', sans-serif;
  padding-bottom: 136px; // Espaço para o player fixo e footer
`;

const Header = styled(motion.header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(18, 18, 20, 0.8);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: 800;
  background: ${colors.gradient};
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

const SearchBar = styled.div`
  position: relative;
  width: 40%;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    width: 80%;
    position: absolute;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    pointer-events: none;
    
    &.active {
      top: 70px;
      opacity: 1;
      pointer-events: all;
    }
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 3rem;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: ${colors.textPrimary};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(62, 133, 243, 0.5);
    box-shadow: 0 0 0 3px rgba(62, 133, 243, 0.15);
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MainContent = styled.main`
  padding: 1.5rem 2rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const HeroSection = styled(motion.div)`
  margin-bottom: 3rem;
  position: relative;
  height: 320px;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  background-position: center;
  background-size: cover;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(18, 18, 20, 0.3),
      rgba(18, 18, 20, 0.7)
    );
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    height: 240px;
  }
`;

const HeroContent = styled.div`
  padding: 2rem;
  width: 100%;
  position: relative;
  z-index: 2;
  
  h2 {
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    font-size: 2.5rem;
    font-weight: 800;
    background: ${colors.gradient};
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.2;
    
    @media (max-width: 768px) {
      font-size: 1.8rem;
    }
  }
  
  p {
    max-width: 80%;
    
    @media (max-width: 768px) {
      max-width: 100%;
    }
  }
`;

const ListenNowButton = styled(motion.button)`
  margin-top: 1rem;
  padding: 0.7rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${colors.gradient};
  border: none;
  border-radius: 50px;
  color: white;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(62, 133, 243, 0.3);
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: ${colors.gradient};
    border-radius: 3px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  font-family: 'Montserrat', sans-serif;
`;

const ViewAll = styled.a`
  color: ${colors.secondary};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  &:hover {
    color: ${colors.primary};
  }
  
  &::after {
    content: '→';
    transition: transform 0.3s ease;
  }
  
  &:hover::after {
    transform: translateX(3px);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
  }
`;

const Card = styled(motion.div)`
  background: ${colors.cardBg};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.03);
  
  &:hover {
    transform: scale(1.03);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
`;

const CardImage = styled.div`
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(18, 18, 20, 0),
      rgba(18, 18, 20, 0.6)
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }
  
  ${Card}:hover &::before {
    opacity: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(circle, rgba(62, 133, 243, 0.2) 0%, rgba(0, 0, 0, 0) 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 0;
  }
  
  ${Card}:hover &::after {
    width: 200px;
    height: 200px;
  }
`;

const PlayButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${colors.gradient};
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
  }
  
  &:hover::before {
    width: 150%;
    height: 150%;
  }
  
  ${Card}:hover & {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const CardContent = styled.div`
  padding: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardDescription = styled.p`
  font-size: 0.9rem;
  color: ${colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CategoryTabsContainer = styled.div`
  margin-bottom: 2rem;
  position: relative;
`;

const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 80px;
  height: 100%;
  background: linear-gradient(to right, rgba(18, 18, 20, 0), ${colors.background});
  pointer-events: none;
  z-index: 5;
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 0.8rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  scrollbar-width: none; /* Firefox */
  
  &::-webkit-scrollbar {
    height: 0;
    width: 0;
    display: none;
  }
`;

const CategoryTab = styled(motion.button)`
  padding: 0.6rem 1.5rem;
  border-radius: 50px;
  background: ${props => props.active ? colors.gradient : 'rgba(255, 255, 255, 0.05)'};
  border: none;
  color: ${colors.textPrimary};
  font-family: 'Poppins', sans-serif;
  font-weight: ${props => props.active ? '600' : '400'};
  font-size: 0.9rem;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? colors.gradient : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-2px);
  }
`;

const Footer = styled.footer`
  display: flex;
  justify-content: space-around;
  padding: 1.5rem;
  background: rgba(18, 18, 20, 0.9);
  backdrop-filter: blur(10px);
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 90;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
`;

const FooterIcon = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${props => props.active ? colors.secondary : 'rgba(255, 255, 255, 0.5)'};
  font-size: 0.75rem;
  cursor: pointer;
  
  span:first-child {
    margin-bottom: 0.3rem;
  }
`;

const AddUrlButton = styled(motion.button)`
  position: fixed;
  right: 2rem;
  bottom: 5.5rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${colors.gradient};
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(62, 133, 243, 0.4);
  z-index: 95;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.7rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${props => props.offline ? '#ff4757' : colors.primary};
  color: white;
`;

const AddButton = styled(motion.button)`
  padding: 0.7rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${colors.gradient};
  border: none;
  border-radius: 50px;
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(62, 133, 243, 0.2);
  
  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }
`;

const FavoriteButton = styled(motion.button)`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: ${props => props.active ? '#ff6b81' : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${Card}:hover & {
    opacity: 1;
  }
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const NoContentMessage = styled.div`
  text-align: center;
  padding: 3rem 0;
  color: ${colors.textSecondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  
  svg {
    opacity: 0.5;
  }
`;

const MobileSearchButton = styled(motion.button)`
  background: transparent;
  border: none;
  color: ${colors.textSecondary};
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isOffline, setIsOffline] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cookies, setCookie] = useCookies(['userToken']);
  const categoryTabsRef = useRef(null);
  const audioRef = useRef(null);
  const navigate = useNavigate();
  
  // Verificar status online/offline
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Verificar status atual
    setIsOffline(!navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Carregar dados reais ou fallback para offline
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allMusics = await axios.get('http://localhost:3001/music/all');
        setTrendingSongs(allMusics.data.data);
        setCategories(defaultCategories);
        
        // Obter favoritos do localStorage (como exemplo)
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        // Em caso de erro, cai no fallback
        setTrendingSongs(defaultTrendingSongs);
        setCategories(defaultCategories);
      }
    };
    
    fetchData();
  }, [isOffline]);
  
  // Filtrar músicas por categoria
  const filteredSongs = activeCategory === 'Todos'
    ? trendingSongs
    : trendingSongs.filter(song => song.category === activeCategory);
  
  // Simulação de dados para o banner principal
  const featuredArtist = {
    name: "Hillsong United",
    title: "Novos Lançamentos",
    description: "Ouça as novas músicas deste mês com a qualidade e profundidade que transformam sua experiência de adoração.",
    image: "https://via.placeholder.com/1200x600"
  };
  
  // Função para alternar favoritos
  const toggleFavorite = (songId) => {
    if (favorites.includes(songId)) {
      const newFavorites = favorites.filter(id => id !== songId);
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      const newFavorites = [...favorites, songId];
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
  };
  
  // Função para rolar categorias
  const scrollCategories = (direction) => {
    if (categoryTabsRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      categoryTabsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  // Tocar música diretamente no player
  const playMusic = (e, song) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Tocando música:', song.title);
    
    // Atualiza o estado com a música selecionada
    setCurrentSong(song);
    console.log(song);
    
    
    // Inicia a reprodução
    setIsPlaying(true);
  };
  
  return (
    <PageContainer>
      <Header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Logo>GEM</Logo>
        
        <SearchBar className={showSearch ? 'active' : ''}>
          <SearchIconWrapper>
            <Search size={18} opacity={0.7} />
          </SearchIconWrapper>
          <SearchInput placeholder="Buscar músicas, artistas, álbuns..." />
        </SearchBar>
        
        <HeaderControls>
          <MobileSearchButton
            onClick={() => setShowSearch(!showSearch)}
            whileTap={{ scale: 0.9 }}
          >
            <Search size={20} />
          </MobileSearchButton>
          
          {isOffline && (
            <StatusBadge offline>Offline</StatusBadge>
          )}
          
          <AddButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
          >
            <Music size={16} />
            Adicionar música
          </AddButton>
          
          <UserMenu />
        </HeaderControls>
      </Header>
      
      <MainContent>
        <HeroSection
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.8 }}
          style={{ backgroundImage: `url(${featuredArtist.image})` }}
        >
          <HeroContent>
            <h3 style={{ fontSize: '1.1rem', opacity: 0.9 }}>{featuredArtist.title}</h3>
            <h2>{featuredArtist.name}</h2>
            <p>{featuredArtist.description}</p>
            <ListenNowButton 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Headphones size={18} />
              Ouvir agora
            </ListenNowButton>
          </HeroContent>
        </HeroSection>
        
        <CategoryTabsContainer>
          <CategoryTabs ref={categoryTabsRef}>
            {['Todos', ...categories].map((category) => (
              <CategoryTab 
                key={category} 
                active={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </CategoryTab>
            ))}
          </CategoryTabs>
          <GradientOverlay />
        </CategoryTabsContainer>
        
        {isOpen && <AddYoutubeUrlModal onClose={() => setIsOpen(false)} />}
        
        <Section>
          <SectionHeader>
            <SectionTitle>Tendências</SectionTitle>
            <ViewAll href="#">Ver tudo</ViewAll>
          </SectionHeader>
          
          {filteredSongs.length > 0 ? (
            <Grid>
              <AnimatePresence>
                {filteredSongs.map((song, index) => (
                  <Card
                    key={song.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <CardImage style={{ backgroundImage: `url(${song.coverImage})` }}>
                      <PlayButton
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => playMusic(e, song)}
                      >
                        <Play size={20} fill="white" />
                      </PlayButton>
                      <FavoriteButton
                        active={favorites.includes(song.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(song.id);
                        }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart size={16} fill={favorites.includes(song.id) ? '#ff6b81' : 'none'} />
                      </FavoriteButton>
                    </CardImage>
                    <CardContent>
                      <CardTitle>{song.title}</CardTitle>
                      <CardDescription>{song.artist}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </AnimatePresence>
            </Grid>
          ) : (
            <NoContentMessage>
              <Music size={48} />
              <p>Nenhuma música encontrada para essa categoria.</p>
              <AddButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
              >
                <Plus size={16} />
                Adicionar música
              </AddButton>
            </NoContentMessage>
          )}
        </Section>
        
        <Section>
          <SectionHeader>
            <SectionTitle>Recomendados para você</SectionTitle>
            <ViewAll href="#">Ver tudo</ViewAll>
          </SectionHeader>
          
          <Grid>
            {trendingSongs.slice(0, 4).map((song, index) => (
              <Card
                key={`recommended-${song.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <CardImage style={{ backgroundImage: `url(${song.coverImage})` }}>
                  <PlayButton
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => playMusic(e, song)}
                  >
                    <Play size={20} fill="white" />
                  </PlayButton>
                  <FavoriteButton
                    active={favorites.includes(song.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(song.id);
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart size={16} fill={favorites.includes(song.id) ? '#ff6b81' : 'none'} />
                  </FavoriteButton>
                </CardImage>
                <CardContent>
                  <CardTitle>{song.title}</CardTitle>
                  <CardDescription>{song.artist}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Section>
      </MainContent>
      
      <AddUrlButton
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
      >
        <Plus size={24} />
      </AddUrlButton>
      
      <Footer>
        <FooterIcon 
          active={true}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <Home size={20} />
          <span>Início</span>
        </FooterIcon>
        <FooterIcon
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <Search size={20} />
          <span>Buscar</span>
        </FooterIcon>
        <FooterIcon
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart size={20} />
          <span>Favoritos</span>
        </FooterIcon>
        <FooterIcon
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <User size={20} />
          <span>Perfil</span>
        </FooterIcon>
      </Footer>
      
      {/* Player de Música Fixo */}
      <ModernPlayer 
        songTitle={currentSong ? currentSong.title : "Selecione uma música"}
        artist={currentSong ? currentSong.artist : ""}
        coverImage={currentSong ? currentSong.coverImage : "/path/to/default-cover.jpg"}
        audioSrc={currentSong ? currentSong.audioUrl : ""}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        onNext={() => {
          // Lógica para próxima música
          if (currentSong) {
            const currentIndex = trendingSongs.findIndex(song => song.id === currentSong.id);
            if (currentIndex < trendingSongs.length - 1) {
              setCurrentSong(trendingSongs[currentIndex + 1]);
            }
          }
        }}
        onPrevious={() => {
          // Lógica para música anterior
          if (currentSong) {
            const currentIndex = trendingSongs.findIndex(song => song.id === currentSong.id);
            if (currentIndex > 0) {
              setCurrentSong(trendingSongs[currentIndex - 1]);
            }
          }
        }}
        ref={audioRef}
      />
    </PageContainer>
  );
};

export default HomePage;
