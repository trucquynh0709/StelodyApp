import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import images from "@/assets/constants/images";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

export default function DiscoverScreen() {
  const [profile, setProfile] = useState("");
  const router = useRouter();
  
  const [fontLoaded, setFontLoaded] = useState(false); 
  
  async function fetchAudioUrl() {
    if (!profile.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên bài hát!");
      return;
    }

    try {
      const response = await fetch(`http://10.0.2.2:8080/api/search/${profile}`);
      const data = await response.json();

      if (!data.url) {
        throw new Error("Không tìm thấy bài hát!");
      }

      await AsyncStorage.setItem("audioUrl", data.url);
      router.push({ pathname: "/profile", params: { profileName: data.title } });

    } catch (error) {
      Alert.alert("Lỗi", "Không thể tìm thấy bài hát!");
      console.error("Lỗi khi fetch URL:", error);
    }
  }
  
  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        "BebasNeue-Regular": require("@/assets/fonts/BebasNeue-Regular.ttf"),
        "Oswald-Regular": require("@/assets/fonts/Oswald-VariableFont_wght.ttf"),
      });
      setFontLoaded(true);
      await SplashScreen.hideAsync(); // Ẩn SplashScreen sau khi load font
    }
    loadFont();
  }, []);

  if (!fontLoaded) {
    return null; // Đợi load font xong rồi render
  }
  
  return (
    <ImageBackground 
      source={images.explore}
      style={styles.explore}
    >
      <View style={styles.overlay}>
        
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="white" />
          <TextInput
            placeholder="Search music"
            style={styles.searchInput}
            placeholderTextColor="white"
            value={profile}
            onChangeText={setProfile}
          />
          <TouchableOpacity onPress={fetchAudioUrl}>
            <Ionicons name="arrow-forward-circle" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  explore: { 
    flex: 1, 
    resizeMode: "cover",  // Căn chỉnh hình nền
    justifyContent: "center",
    alignItems: "center"
  },
  overlay: { 
    flex: 1, 
    width: "100%", 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)"  // Hiệu ứng mờ
  },
  
  searchBar: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Màu trong suốt kiểu glassmorphism
    borderRadius: 25,  // Bo tròn nhiều hơn
    paddingHorizontal: 15, 
    width: "90%", 
    marginBottom: 20,
    paddingVertical: 10,
    backdropFilter: "blur(10px)", // Hiệu ứng mờ nền
    shadowColor: "rgba(255, 255, 255, 0.5)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  searchInput: { 
    flex: 1, 
    padding: 10, 
    color: "white"  // Màu chữ trắng để nổi bật
  },
});
