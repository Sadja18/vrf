import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sadja.newassignment',
  appName: 'newassignment',
  webDir: 'www',
  // server: {
  //   url: 'http://10.0.2.2:8100', // Replace with your host machine IP
  //   cleartext: true
  // },
  plugins: {
    LiveUpdates: {
      appId: 'a3304e8b',
      channel: 'Production',
      autoUpdateMethod: 'background',
      maxVersions: 2
    }
  }
};

export default config;
