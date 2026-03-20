import { describe, it, expect, vi } from 'vitest';
import { encrypt, decrypt } from './encryption.util.js';

vi.mock('../config/env.js', () => ({
  env: {
    ENCRYPTION_KEY: '0000000000000000000000000000000000000000000000000000000000000000', // 64 char string
  },
}));

describe('Encryption Utility Unit Tests', () => {
  it('should encrypt and decrypt a string successfully', () => {
    const originalText = 'Hello, VaultBridge!';

    // Encrypt
    const encryptedText = encrypt(originalText);
    expect(encryptedText).not.toBe(originalText);
    expect(encryptedText.split(':').length).toBe(3); // format: iv:tag:encrypted

    // Decrypt
    const decryptedText = decrypt(encryptedText);
    expect(decryptedText).toBe(originalText);
  });

  it('should throw an error if the format is invalid', () => {
    expect(() => decrypt('invalid:crypted:format:extra')).toThrow('Invalid encrypted text format');
  });
});
