import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rubyheart.bettertaskies',
  appName: 'Better Taskies',
  webDir: 'dist',

  android: {
    zoomEnabled: false,
  },

  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_notification',
      iconColor: '#FFFFFF',
      // sound: 'beep.wav',
    },
  },
};

export default config;