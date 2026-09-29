export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
}

const USERS_KEY = 'app_users';
const SESSION_KEY = 'app_session';

export const authService = {
  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  register: (name: string, email: string, password: string): void => {

    const existingUsersJson = localStorage.getItem(USERS_KEY);
    const users = existingUsersJson ? JSON.parse(existingUsersJson) : [];

    const userExists = users.some((u: any) => u.email === email);
    if (userExists) {
      throw new Error('Este correo electrónico ya está registrado.');
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      balance: 0
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  login: (email: string, password: string): User => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) throw new Error('Credenciales incorrectas');

    const userData: User = { id: user.id, name: user.name, email: user.email, balance: user.balance };
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    return userData;
  },

  logout: (): void => {
    localStorage.removeItem(SESSION_KEY);
  },
  
  updateBalance: (newBalance: number): void => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      currentUser.balance = newBalance;
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
      
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const userIndex = users.findIndex((u: any) => u.email === currentUser.email);
      if (userIndex !== -1) {
        users[userIndex].balance = newBalance;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    }
  }
};