// ModernPlayer.js - Versão corrigida
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Repeat, Shuffle } from 'lucide-react';

// Componentes estilizados já existentes...

// Função para codificar URLs com espaços ou caracteres especiais
const sanitizeUrl = (url) => {
  if (!url) return '';
  
  // Se a URL já começar com http ou https, não precisa de base URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Adicionar base URL se necessário (ajuste conforme seu ambiente)
  const baseUrl = process.env.REACT_APP_API_URL || window.location.origin;
  
  // Tratar caminhos relativos
  let fullPath = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
  
  // Codificar o caminho para lidar com espaços e caracteres especiais
  return encodeURI(fullPath);
};

// Componente principal com forwardRef para aceitar uma ref externa
const ModernPlayer = forwardRef(({ 
  songTitle = "Selecione uma música",
  artist = "",
  coverImage = "",
  audioSrc = "",
  isPlaying = false,
  setIsPlaying,
  onNext = () => {},
  onPrevious = () => {}
}, ref) => {
  // Estados
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [audioError, setAudioError] = useState(null);
  
  // Refs
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  
  // Expor métodos para o componente pai através da ref
  useImperativeHandle(ref, () => ({
    play: () => {
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.error("Erro ao reproduzir áudio:", err);
          setAudioError(err.message);
        });
      }
    },
    pause: () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    },
    seek: (time) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
      }
    },
    getElement: () => audioRef.current
  }));
  
  // Processar mudanças no audioSrc
  useEffect(() => {
    if (audioRef.current) {
      // Quando a fonte de áudio muda, resetamos o player
      setCurrentTime(0);
      
      if (audioSrc) {
        console.log("Carregando áudio:", audioSrc);
        
        // Se isPlaying for true, tentar reproduzir automaticamente
        if (isPlaying) {
          // Pequeno atraso para garantir que o src foi atualizado
          setTimeout(() => {
            audioRef.current.play().catch(err => {
              console.error("Erro ao reproduzir após mudança de fonte:", err);
              setAudioError(err.message);
              if (setIsPlaying) setIsPlaying(false);
            });
          }, 100);
        }
      } else {
        // Se não tiver audioSrc, garantir que o player está pausado
        audioRef.current.pause();
        if (setIsPlaying) setIsPlaying(false);
      }
    }
  }, [audioSrc, isPlaying, setIsPlaying]);
  
  // Controlar mudanças no estado isPlaying
  useEffect(() => {
    if (!audioRef.current || !audioSrc) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error("Erro ao reproduzir:", err);
        setAudioError(err.message);
        if (setIsPlaying) setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, audioSrc, setIsPlaying]);
  
  // Configurar o áudio e eventos
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Definir volume inicial
    audio.volume = volume;
    
    // Manipuladores de eventos
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setAudioError(null); // Limpar erros quando o áudio carrega com sucesso
      console.log("Áudio carregado com sucesso, duração:", audio.duration);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(err => console.error("Erro ao repetir:", err));
      } else {
        if (setIsPlaying) setIsPlaying(false);
        onNext();
      }
    };
    
    const handleError = (e) => {
      console.error("Erro no elemento de áudio:", e);
      setAudioError(e.target.error ? e.target.error.message : "Erro ao carregar áudio");
      if (setIsPlaying) setIsPlaying(false);
    };
    
    // Adicionar eventos
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    // Limpar eventos ao desmontar
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [isRepeat, onNext, setIsPlaying, volume]);
  
  // Formatar tempo (MM:SS)
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Toggle Play/Pause
  const togglePlay = () => {
    if (!audioSrc) {
      console.log("Nenhuma fonte de áudio disponível");
      setAudioError("Nenhuma música selecionada");
      return;
    }
    
    if (setIsPlaying) {
      setIsPlaying(!isPlaying);
    } else {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.error("Erro ao reproduzir:", err);
          setAudioError(err.message);
        });
      }
    }
  };
  
  // Manipular alteração de volume
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };
  
  // Toggle Mute
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 0.5;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };
  
  // Manipular seek (arrastar a barra de progresso)
  const handleSeek = (e) => {
    if (!audioRef.current || !progressRef.current) return;
    
    const progressRect = progressRef.current.getBoundingClientRect();
    const seekPosition = (e.clientX - progressRect.left) / progressRect.width;
    const newTime = seekPosition * duration;
    
    if (!isNaN(newTime) && isFinite(newTime)) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  // Calcular porcentagem de progresso
  const progressPercentage = (currentTime / duration) * 100 || 0;
  
  // URL sanitizada para a fonte de áudio
  const sanitizedAudioUrl = sanitizeUrl(audioSrc);
  
  return (
    <PlayerContainer>
      <audio 
        ref={audioRef} 
        src={sanitizedAudioUrl}
        preload="metadata"
      />
      
      <ProgressContainer onClick={handleSeek} ref={progressRef}>
        <ProgressBar progress={progressPercentage} />
      </ProgressContainer>
      
      <PlayerControls>
        <SongInfo>
          <Thumbnail image={coverImage || '/path/to/default-cover.jpg'} />
          <SongDetails>
            <SongTitle>{songTitle}</SongTitle>
            <ArtistName>{artist}</ArtistName>
            {audioError && (
              <ErrorMessage>Erro: {audioError}</ErrorMessage>
            )}
          </SongDetails>
          <LikeButton active={isLiked} onClick={() => setIsLiked(!isLiked)}>
            <Heart fill={isLiked ? "#3e85f3" : "none"} size={18} />
          </LikeButton>
        </SongInfo>
        
        <MainControls>
          <ControlButton onClick={() => setIsShuffle(!isShuffle)} active={isShuffle}>
            <Shuffle size={18} />
          </ControlButton>
          
          <ControlButton onClick={onPrevious}>
            <SkipBack size={20} />
          </ControlButton>
          
          <PlayButton primary onClick={togglePlay}>
            {isPlaying ? (
              <>
                <Pause size={20} />
                <PulseAnimation />
              </>
            ) : (
              <Play size={20} />
            )}
          </PlayButton>
          
          <ControlButton onClick={onNext}>
            <SkipForward size={20} />
          </ControlButton>
          
          <ControlButton onClick={() => setIsRepeat(!isRepeat)} active={isRepeat}>
            <Repeat size={18} />
          </ControlButton>
        </MainControls>
        
        <ExtraControls>
          <VolumeContainer>
            <ControlButton onClick={toggleMute}>
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </ControlButton>
            <VolumeSlider
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
            />
          </VolumeContainer>
          <TimeInfo>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </TimeInfo>
        </ExtraControls>
      </PlayerControls>
    </PlayerContainer>
  );
});

// Adicionar os componentes estilizados que faltaram
const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #121212;
  border-top: 1px solid #333;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  z-index: 100;
`;

const ProgressContainer = styled.div`
  width: 100%;
  height: 4px;
  background-color: #333;
  cursor: pointer;
  position: absolute;
  top: -2px;
  left: 0;
`;

const ProgressBar = styled.div`
  height: 100%;
  background-color: #3e85f3;
  border-radius: 2px;
  position: relative;
  transition: width 0.1s linear;
  width: ${props => props.progress}%;
  
  &:hover::after {
    content: '';
    position: absolute;
    right: -6px;
    top: -4px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #3e85f3;
  }
`;

const PlayerControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const SongInfo = styled.div`
  display: flex;
  align-items: center;
  width: 30%;
`;

const Thumbnail = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 4px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  margin-right: 12px;
  flex-shrink: 0;
  background-color: #333;
`;

const SongDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const SongTitle = styled.span`
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ArtistName = styled.span`
  color: #aaa;
  font-size: 12px;
`;

const ErrorMessage = styled.span`
  color: #ff4757;
  font-size: 11px;
  margin-top: 4px;
`;

const MainControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40%;
`;

const ExtraControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 30%;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? '#3e85f3' : '#fff'};
  cursor: pointer;
  margin: 0 8px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  &:hover {
    transform: ${props => props.primary ? 'scale(1.08)' : 'scale(1.05)'};
  }
  
  &:active {
    transform: ${props => props.primary ? 'scale(0.95)' : 'scale(0.98)'};
  }
  
  transition: all 0.2s ease;
`;

const LikeButton = styled(ControlButton)``;

const PlayButton = styled(ControlButton)`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #3e85f3;
  color: #121212;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: #5a94f5;
  }
`;

const PulseAnimation = styled.div`
  position: absolute;
  width: 36px;
  height: 36px;
  background: rgba(62, 133, 243, 0.3);
  border-radius: 50%;
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.6;
    }
    70% {
      transform: scale(1.3);
      opacity: 0;
    }
    100% {
      transform: scale(1.3);
      opacity: 0;
    }
  }
`;

const TimeInfo = styled.div`
  display: flex;
  font-size: 11px;
  color: #aaa;
  margin-top: 8px;
  justify-content: space-between;
  width: 40%;
  margin: 4px auto 0;
`;

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
`;

const VolumeSlider = styled.input`
  -webkit-appearance: none;
  width: 80px;
  height: 4px;
  border-radius: 2px;
  background: #333;
  outline: none;
  margin-left: 8px;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  &:hover::-webkit-slider-thumb {
    background: #3e85f3;
    transform: scale(1.2);
  }
`;

export default ModernPlayer;
