import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.civilworld.app",
  appName: "Civil World",
  webDir: "out",
  server: {
    androidScheme: "https",
    allowNavigation: ["*.civilworld.app", "civilworld://*"],
  },
  ios: {
    contentInset: "always",
    preferredContentMode: "mobile",
    limitsNavigationsToAppBoundDomains: true,
    scheme: "civilworld",
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
  },
  plugins: {
    Camera: {
      saveToGallery: true,
      quality: 90,
      resultType: "uri",
      promptLabelHeader: "Capture progress photo",
      promptLabelPhoto: "Choose from gallery",
      promptLabelPicture: "Take photo",
      promptLabelCancel: "Cancel",
    },
    Geolocation: {
      permissions: ["location"],
    },
    AppLauncher: {},
    Network: {},
    Preferences: {
      group: "civilworld_secure_store",
    },
  },
};

export default config;
