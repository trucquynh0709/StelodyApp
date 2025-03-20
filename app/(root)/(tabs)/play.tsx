// import React, { useState, useEffect } from "react";
// import { View, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import Svg, { Circle } from "react-native-svg";
// import Animated, { Easing, useSharedValue, useAnimatedProps, withRepeat, withTiming } from "react-native-reanimated";
// import images from "@/assets/constants/images";
// import * as Font from "expo-font";
// import * as SplashScreen from "expo-splash-screen";
// import "react-native-reanimated"; // Đảm bảo import dòng này

// const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// const AnimatedCircleEffect = () => {
//   const radius = 60;
//   const strokeWidth = 3;
//   const circleRadius = radius - strokeWidth / 2;

//   const animatedValue = useSharedValue(0);

//   useEffect(() => {
//     animatedValue.value = withRepeat(
//       withTiming(1, { duration: 2000, easing: Easing.linear }),
//       -1,
//       true
//     );
//   }, []);

//   const animatedProps = useAnimatedProps(() => ({
//     r: circleRadius + animatedValue.value * 5,
//     opacity: 1 - animatedValue.value * 0.5,
//   }));

//   return (
//     <Svg width={radius * 2} height={radius * 2}>
//       <AnimatedCircle
//         cx={radius}
//         cy={radius}
//         stroke="rgba(255, 255, 255, 0.5)"
//         strokeWidth={strokeWidth}
//         fill="none"
//         animatedProps={animatedProps}
//       />
//       <Circle
//         cx={radius}
//         cy={radius}
//         r={circleRadius}
//         stroke="rgba(255, 255, 255, 0.8)"
//         strokeWidth={strokeWidth}
//         fill="none"
//       />
//     </Svg>
//   );
// };

// const PlayButton = () => {
//   const [fontLoaded, setFontLoaded] = useState(false);

//   useEffect(() => {
//     async function loadFont() {
//       await Font.loadAsync({
       
//         "BebasNeue-Regular": require("@/assets/fonts/BebasNeue-Regular.ttf"),
//         "Oswald-Regular": require("@/assets/fonts/Oswald-VariableFont_wght.ttf"),
//         "PoppinsBold": require("@/assets/fonts/Poppins-Bold.ttf"),
//         "PoppinsRegular": require("@/assets/fonts/Poppins-Regular.ttf"),
//         "Montse": require("@/assets/fonts/Montserrat-VariableFont_wght.ttf"),
//       });
//       setFontLoaded(true);
//       await SplashScreen.hideAsync();
//     }
//     loadFont();
//   }, []);

//   if (!fontLoaded) {
//     return null;
//   }

//   return (
//     <ImageBackground source={images.explore} style={styles.explore}>
//       <View style={styles.container}>
//         <AnimatedCircleEffect />
//         <TouchableOpacity style={styles.playButton}>
//           <Ionicons name="play" size={30} color="white" />
//         </TouchableOpacity>
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   explore: {
//     flex: 1,
//     resizeMode: "cover",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   container: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   playButton: {
//     position: "absolute",
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: "rgba(255, 255, 255, 0.2)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

// export default PlayButton;
