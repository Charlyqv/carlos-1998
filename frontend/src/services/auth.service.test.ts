import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from './auth.service';
import SHA256 from 'crypto-js/sha256';

describe('Auth Service - Seguridad', () => {
  
  beforeEach(() => {
    localStorage.clear();
  });

  it('Debe guardar la contraseña encriptada (Hash SHA-256) en localStorage', () => {
    const plainPassword = 'MiPasswordSeguro123';
    const expectedHash = SHA256(plainPassword).toString();

    authService.register('Carlos', 'carlos@test.com', plainPassword);

    const usersJson = localStorage.getItem('app_users');
    expect(usersJson).not.toBeNull();
    
    const users = JSON.parse(usersJson as string);
    const savedUser = users[0];

    expect(savedUser.email).toBe('carlos@test.com');

    expect(savedUser.password).not.toBe(plainPassword);
    expect(savedUser.password).toBe(expectedHash);
  });
});