const mockUsers = [
  {
    id: 1,
    firstName: 'João',
    lastName: 'Discípulo',
    email: 'joao@example.com',
    password: 'senha123',
    profilePicture: null,
    playlists: 42,
    favorites: 156,
    following: 28
  },
  {
    id: 2,
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria@example.com',
    password: 'senha123',
    profilePicture: null,
    playlists: 15,
    favorites: 98,
    following: 12
  }
];

// Token mock
const generateToken = (userId) => {
  return `mock-jwt-token-${userId}-${Date.now()}`;
};

// Armazenar token e usuário no localStorage
const setAuthData = (token, user) => {
  localStorage.setItem('gem_user_token', token);
  localStorage.setItem('gem_user', JSON.stringify(user));
};

// Remover dados de autenticação do localStorage
const clearAuthData = () => {
  localStorage.removeItem('gem_user_token');
  localStorage.removeItem('gem_user');
};

// Verificar se o usuário está autenticado
const isAuthenticated = () => {
  return localStorage.getItem('gem_user_token') !== null;
};

// Obter dados do usuário atual
const getCurrentUser = () => {
  const userJson = localStorage.getItem('gem_user');
  return userJson ? JSON.parse(userJson) : null;
};

// Serviço de Login
const login = (email, password) => {
  return new Promise((resolve, reject) => {
    // Simular atraso da rede
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Remover a senha antes de armazenar os dados do usuário
        const { password, ...userWithoutPassword } = user;
        const token = generateToken(user.id);
        
        setAuthData(token, userWithoutPassword);
        resolve({ user: userWithoutPassword, token });
      } else {
        reject({ message: 'Email ou senha inválidos' });
      }
    }, 1000); // Atraso de 1 segundo para simular a rede
  });
};

// Serviço de Registro
const register = (userData) => {
  return new Promise((resolve, reject) => {
    // Simular atraso da rede
    setTimeout(() => {
      // Verificar se o email já existe
      const existingUser = mockUsers.find(u => u.email === userData.email);
      
      if (existingUser) {
        reject({ message: 'Este email já está em uso' });
        return;
      }
      
      // Criar novo usuário
      const newUser = {
        id: mockUsers.length + 1,
        ...userData,
        profilePicture: null,
        playlists: 0,
        favorites: 0,
        following: 0
      };
      
      // Adicionar à lista de usuários mock
      mockUsers.push(newUser);
      
      // Remover a senha antes de armazenar os dados do usuário
      const { password, ...userWithoutPassword } = newUser;
      const token = generateToken(newUser.id);
      
      setAuthData(token, userWithoutPassword);
      resolve({ user: userWithoutPassword, token });
    }, 1000); // Atraso de 1 segundo para simular a rede
  });
};

// Serviço de Logout
const logout = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      clearAuthData();
      resolve(true);
    }, 300);
  });
};

// Atualizar dados do usuário
const updateUserProfile = (userData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        reject({ message: 'Usuário não autenticado' });
        return;
      }
      
      // Atualizar os dados
      const updatedUser = {
        ...currentUser,
        ...userData
      };
      
      // Atualizar no localStorage
      localStorage.setItem('gem_user', JSON.stringify(updatedUser));
      
      resolve(updatedUser);
    }, 800);
  });
};

// Exportar as funções do serviço
const AuthService = {
  login,
  register,
  logout,
  isAuthenticated,
  getCurrentUser,
  updateUserProfile
};

export default AuthService;