import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";
import * as Font from "expo-font";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpScreen() {
  const router = useRouter();
  const [fontLoaded, setFontLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  const handleSignUp = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    Alert.alert("Success", "Account created successfully!");
    router.push("/auth/sign-in"); // Redirect to sign-in screen after successful registration
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
       <View style={styles.circletop} />
      <Text style={styles.title}>Create{"\n"}Account</Text>

      <TextInput
        placeholder="Your Email"
        placeholderTextColor="#fff"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#fff"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="#fff"
        style={styles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Hình tròn trắng ở góc */}
      <View style={styles.circle} />

      {/* Chữ Sign Up + nút mũi tên */}
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Sign Up</Text>
        <TouchableOpacity style={styles.arrowButton} onPress={handleSignUp}>
          <Ionicons name="arrow-forward" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Sign In với gạch highlight */}
      <TouchableOpacity style={styles.signInButton} onPress={() => router.push("/auth/sign-in")}> 
        <View style={styles.signInHighlight}>
          <Text style={styles.signInText}>Sign In</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FED2EB',
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
    marginBottom: 80,
    left: 7,
  },
  input: {
    width: '80%',
    backgroundColor: '#B35A64',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    fontFamily: "PoppinsBold",
    color: '#D9D9D9',
  },
  signUpContainer: {
    flexDirection: "row", // Hiển thị chữ và mũi tên cùng hàng
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 30,
  },
  signUpText: {
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
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Bóng đổ Android
  },
  signInButton: {
    position: 'absolute',
    bottom: 40,
    right: 40
  },
  signInHighlight: {
    backgroundColor: "#F7E6A6", // Màu highlight vàng
    paddingHorizontal: 4, // Tạo khoảng cách hai bên chữ
    paddingBottom: 0, // Điều chỉnh vị trí gạch dưới
    alignSelf: "flex-start", // Giữ độ rộng đúng với chữ
  },
  signInText: {
    color: '#3E2723',
    
    fontFamily: "PoppinsBold",
    fontSize: 18,
  },
  circletop: {
    width: 680,
    height: 680,
    borderRadius: 340,
    backgroundColor: "#A6D785",
    position: "absolute",
    top: -370, // Điều chỉnh vị trí
    left: -250,
    shadowColor: "#D8BFD8",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  circle: {
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: "white",
    position: "absolute",
    bottom: -150, // Điều chỉnh vị trí
    right: -150,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});
