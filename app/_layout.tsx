import { Stack } from "expo-router";
import "./global.css";
import {useFonts} from "expo-font";
import {useEffect} from "react";
import * as SplashScreen from "expo-splash-screen";



export default function RootLayout() {  
  const [fontsLoaded] = useFonts( {  
      "Rubik-Bold": require('../assets/fonts/Rubik-Bold.ttf'),  
      "Rubik-ExtraBold": require('../assets/fonts/Rubik-ExtraBold.ttf'),  
      "Rubik-Light": require('../assets/fonts/Rubik-Light.ttf'),  
      "Rubik-Medium": require('../assets/fonts/Rubik-Medium.ttf'),  
      "Rubik-Regular": require('../assets/fonts/Rubik-Regular.ttf'),  
      "Rubik-SemiBold": require('../assets/fonts/Rubik-SemiBold.ttf'),  
      "Bebas-Neue": require('../assets/fonts/BebasNeue-Regular.ttf'),
      "Oswald": require('../assets/fonts/Oswald-VariableFont_wght.ttf'),
      "Helvetica-Light": require('../assets/fonts/helvetica-light-587ebe5a59211.ttf'),
  
     
      "Helvetica-Bold": require('../assets/fonts/Helvetica-Bold.ttf'),
      "Helvetica": require('../assets/fonts/Helvetica.ttf')
            
            
  });

  useEffect(() => {  
      if (fontsLoaded) {  
          SplashScreen.hideAsync();  
      }   
  }, [fontsLoaded]);  

  if (!fontsLoaded) return null;  
  return <Stack screenOptions={{ headerShown: false }} />;  

  
}
