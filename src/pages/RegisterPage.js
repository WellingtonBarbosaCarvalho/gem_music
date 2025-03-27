import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/AuthService';
import api from '../utils/api';

const API_BASE_URL = "http://localhost:3001/api";

// Componentes estilizados - reutilizando alguns da página de login
const RegisterContainer = styled.div`
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

const SocialLogin = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SocialButton = styled(motion.button)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f8f9fa;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-5px);
  }
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

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 550px) {
    flex-direction: column;
    gap: 0;
  }
`;

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Verificar se o usuário já está autenticado
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      navigate('/home');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post(`/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      const token = response.token;
      localStorage.setItem('token', JSON.stringify(token));

      setIsLoading(false);
      navigate('/home');
    } catch(error){
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
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
        
        <h2 style={{ textAlign: 'center', margin: '0 0 2rem 0', color: '#f8f9fa' }}>Crie sua conta</h2>
        
        <form onSubmit={handleRegister}>
          <FormRow>
            <FormGroup>
              <Label htmlFor="firstName">Nome</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Seu nome"
                required
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Seu sobrenome"
                required
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              />
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="seu@email.com"
              required
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Crie uma senha forte"
              required
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="confirmPassword">Confirme a senha</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirme sua senha"
              required
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            />
          </FormGroup>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <input 
              type="checkbox" 
              id="terms" 
              required 
              style={{ marginRight: '0.5rem' }}
            />
            <label htmlFor="terms" style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              Eu concordo com os <a href="#" style={{ color: '#00D9F5' }}>Termos</a> e <a href="#" style={{ color: '#00D9F5' }}>Política de Privacidade</a>
            </label>
          </div>
          
          {error && (
            <div 
              style={{ 
                color: '#ff4757', 
                marginBottom: '1rem', 
                textAlign: 'center',
                padding: '0.5rem',
                background: 'rgba(255, 71, 87, 0.1)',
                borderRadius: '5px'
              }}
            >
              {error}
            </div>
          )}
          
          <Button
            type="submit"
            disabled={isLoading}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isLoading ? 'Registrando...' : 'Criar Conta'}
          </Button>
        </form>
        
        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
          <span style={{ color: '#f8f9fa', fontSize: '0.9rem' }}>ou registre-se com</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
        </div>
        
        <SocialLogin>
          <SocialButton
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            G
          </SocialButton>
          <SocialButton
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            f
          </SocialButton>
          <SocialButton
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            a
          </SocialButton>
        </SocialLogin>
        
        <TextLink to="/login">Já tem uma conta? Faça login</TextLink>
      </GlassMorphism>
    </RegisterContainer>
  );
};

export default RegisterPage;
