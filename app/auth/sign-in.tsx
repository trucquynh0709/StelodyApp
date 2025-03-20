import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";
import * as Font from "expo-font";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function SignInScreen() {
  const router = useRouter();
  const [fontLoaded, setFontLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        "Helvetica-Light": require("@/assets/fonts/helvetica-light-587ebe5a59211.ttf"),
        "Helvetica-Bold": require("@/assets/fonts/Helvetica-Bold.ttf"),
        "Helvetica": require("@/assets/fonts/Helvetica.ttf"),
        "BebasNeue-Regular": require("@/assets/fonts/BebasNeue-Regular.ttf"),
        "Oswald-Regular": require("@/assets/fonts/Oswald-VariableFont_wght.ttf"),
        "PoppinsBold": require("@/assets/fonts/Poppins-Bold.ttf"),
        "PoppinsRegular": require("@/assets/fonts/Poppins-Regular.ttf"),
        "Montse": require("@/assets/fonts/Montserrat-VariableFont_wght.ttf"),
      });
      setFontLoaded(true);
    }
    loadFont();
  }, []);

  const handleSignIn = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }
    router.push("/(root)/(tabs)/explore")
   
    
  };

  return (
    <View style={styles.container}>
      {/* Background Design */}
      {/* <Svg height="500%" width="120%" style={styles.backgroundSvg} preserveAspectRatio="none">
        <Path d="M0,300 Q250,350 450,130 T800,10 V0 H0 Z" fill="#9CD08F" />
      </Svg>

      <Svg height="500%" width="120%" style={styles.backgroundSvg} preserveAspectRatio="none">
        <Path d="M1000,100 Q20,350 450,130 T800,10 V0 H0 Z" fill="#824A78F" />
      </Svg>
       */}
       {/* Hình tròn trắng ở góc */}
       <View style={styles.circle3} />
      <View style={styles.circle2} />
      
      <View style={styles.circle1} />
     

       
      <Text style={styles.title}>Welcome{"\n"}Back</Text>

      <TextInput
        placeholder="Your Email"
        placeholderTextColor="#3E2723"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#3E2723"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {/* <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="#fff"
        style={styles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      /> */}

      
      {/* Chữ Sign In + nút mũi tên */}
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Sign In</Text>
        <TouchableOpacity style={styles.arrowButton} onPress={handleSignIn}>
          <Ionicons name="arrow-forward" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Sign Up với gạch highlight */}
      <TouchableOpacity style={styles.signUpButton} onPress={() => router.push("/auth/sign-up")}> 
        <View style={styles.signUpHighlight}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.ForgetPassButton} onPress={() => router.push("/auth/sign-up")}> 
        <View style={styles.ForgetPassHighlight}>
          <Text style={styles.ForgetPassText}>Forget Password</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backgroundSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  title: {
    fontSize: 48,
   // fontWeight: 'bold',
    color: '#3E2723',
    textAlign: 'left',
    width: '100%',
    fontFamily: "PoppinsBold",
    marginBottom: 135,
    left: 10,
  },
  input: {
    width: '80%',
    backgroundColor: '#F8C8DC',
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    fontFamily: "PoppinsBold",
    color: '#000000',
  },
  signInContainer: {
    flexDirection: "row", // Hiển thị chữ và mũi tên cùng hàng
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 30,
    marginBottom:30
  },
  signInText: {
    color: "#3E2723",
    fontSize: 32,
    fontFamily: "PoppinsBold",
    
  },
  arrowButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#8B5E83", // Màu tím
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 3, height: 5 },
    elevation: 5, // Bóng đổ Android
  },
  signUpButton: {
    position: 'absolute',
    bottom: 50,
    left: 40
  },
  signUpHighlight: {
    backgroundColor: "#F7E6A6", // Màu highlight vàng
    paddingHorizontal: 4, // Tạo khoảng cách hai bên chữ
    paddingBottom: 0, // Điều chỉnh vị trí gạch dưới
    alignSelf: "flex-start", // Giữ độ rộng đúng với chữ
  },
  signUpText: {
    color: '#3E2723',
    
    fontFamily: "PoppinsBold",
    fontSize: 15,
  },
  ForgetPassButton: {
    position: 'absolute',
    bottom: 50,
    right: 40
  },
  ForgetPassHighlight: {
    backgroundColor: "#E58AAE", // Màu highlight vàng
    paddingHorizontal: 4, // Tạo khoảng cách hai bên chữ
    paddingBottom: 0, // Điều chỉnh vị trí gạch dưới
    alignSelf: "flex-start", // Giữ độ rộng đúng với chữ
  },
  ForgetPassText: {
    color: '#3E2723',
    
    fontFamily: "PoppinsBold",
    fontSize: 15,
  },
  circle1: {
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: "#FED2EB",
    position: "absolute",
    top: -250, // Điều chỉnh vị trí
    left: -150,
    shadowColor: "#D8BFD8",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  circle2: {
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: "#A6D785",
    position: "absolute",
    top: -300, // Điều chỉnh vị trí
    right: -50,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  circle3: {
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: "#F7E6A6",
    position: "absolute",
    top: 0, // Điều chỉnh vị trí
    right: -200,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});
