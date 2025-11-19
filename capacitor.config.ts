import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aegis.app',
  appName: 'Aegis',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000, 
      launchAutoHide: true,
      launchFadeOutDuration: 300,
      
      // Tente descobrir a cor EXATA do fundo da sua imagem "splash.png"
      // Se for diferente, vai ficar uma caixa visível. 
      // Vou chutar um Slate-800 baseada na imagem, mas ajuste se precisar:
      backgroundColor: "#264464", 
      
      // Mude para isso. O "CENTER_CROP" corta o texto as vezes. 
      // "FIT_CENTER" garante que a aguia e o texto apareçam inteiros.
      androidScaleType: "FIT_CENTER", 
      
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      overlaysWebView: true, // Melhor para um visual moderno, já que estamos tratando as safe-areas
      // backgroundColor: "#264464", // Alinhado com a nova cor primária
    },
  },
};

export default config;
