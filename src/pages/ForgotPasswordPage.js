import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';

// Componentes estilizados
const ForgotContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #121214, #1E1E22);
  position: relative;
  overflow: hidden;
`;

const GlassMorphism = styled(motion.div)`
  backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 10;
`;

const Logo = styled(motion.div)`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(to right, #6C63FF, #00D9F5, #7928CA);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Montserrat', sans-serif;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #f8f9fa;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 1rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f8f9fa;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #6C63FF;
    box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.3);
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  border-radius: 10px;
  background: linear-gradient(45deg, #6C63FF, #00D9F5);
  color: white;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(45deg, #5A52E0, #00C2E0);
  }
`;

const FloatingOrb = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 1;
  opacity: 0.6;
`;

const TextLink = styled(Link)`
  color: #00D9F5;
  text-decoration: none;
  font-size: 0.9rem;
  display: block;
  text-align: center;
  margin-top: 1rem;
  font-family: 'Poppins', sans-serif;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular envio do email
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <ForgotContainer>
      {/* Orbs decorativas animadas */}
      <FloatingOrb
        initial={{ x: '10%', y: '10%' }}
        animate={{ 
          x: ['10%', '20%', '15%', '10%'],
          y: ['10%', '15%', '20%', '10%']
        }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{ 
          width: '300px', 
          height: '300px', 
          background: 'radial-gradient(circle, #6C63FF, transparent)',
          top: '20%',
          left: '10%'
        }}
      />
      
      <FloatingOrb
        initial={{ x: '80%', y: '70%' }}
        animate={{ 
          x: ['80%', '75%', '85%', '80%'],
          y: ['70%', '75%', '65%', '70%']
        }}
        transition={{ duration: 15, repeat: Infinity }}
        style={{ 
          width: '350px', 
          height: '350px', 
          background: 'radial-gradient(circle, #00D9F5, transparent)',
          bottom: '10%',
          right: '10%'
        }}
      />
      
      <GlassMorphism
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Logo
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          GEM
        </Logo>
        
        <h2 style={{ textAlign: 'center', margin: '0 0 2rem 0', color: '#f8f9fa' }}>
          Recuperar senha
        </h2>
        
        {!isSent ? (
          <>
            <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              Digite seu email abaixo e enviaremos um link para você redefinir sua senha.
            </p>
            
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                />
              </FormGroup>
              
              <Button
                type="submit"
                disabled={isLoading}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
              </Button>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✉️</div>
            <h3 style={{ marginBottom: '1rem', color: '#f8f9fa' }}>Email enviado!</h3>
            <p style={{ marginBottom: '2rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              Verifique sua caixa de entrada em <strong>{email}</strong>. Enviamos um link para você redefinir sua senha.
            </p>
            <Button
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Voltar para o login
            </Button>
          </motion.div>
        )}
        
        <TextLink to="/login">Voltar para o login</TextLink>
      </GlassMorphism>
    </ForgotContainer>
  );
};

export default ForgotPasswordPage;
