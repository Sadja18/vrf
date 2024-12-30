import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'assignment',
  webDir: 'www',
  server: {
    url: 'http://192.168.204.188:8100', // Replace with your host machine IP
    cleartext: true
  }
};

export default config;
