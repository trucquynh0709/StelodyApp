import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import images from "@/assets/constants/images";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { FontAwesome5 } from "@expo/vector-icons";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import { FontAwesome} from "@expo/vector-icons";
import Bird from '@/assets/icons/bird.png';
const sounds = [
    { id: "1", name: "Rain", icon: "rainy-outline", library: "Ionicons" },
    { id: "2", name: "Thunder", icon: "thunderstorm-outline", library: "Ionicons" },
    { id: "3", name: "Snow", icon: "snow-outline", library: "Ionicons" },
    { id: "4", name: "Rustle", icon: "leaf-outline", library: "Ionicons" },
    { id: "5", name: "Drop", icon: "water-outline", library: "Ionicons" },
    { id: "6", name: "Wind", icon: "cloud-outline", library: "Ionicons" },
    { id: "7", name: "Sea", icon: "fish-outline", library: "Ionicons" },
    { id: "8", name: "Waterfall", icon: "terrain", library: "MaterialCommunityIcons" },
    { id: "9", name: "River", icon: "earth-outline", library: "Ionicons" },
    { id: "10", name: "Forest", icon: "tree-outline", library: "FontAwesome5" },
    { id: "11", name: "Fire", icon: "flame-outline", library: "Ionicons" },
    { id: "12", name: "Morning", icon: "sunny-outline", library: "Ionicons"},
];
  
  
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
      await AsyncStorage.setItem("songTitle", data.title);
      router.push("/play");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tìm thấy bài hát!");
      console.error("Lỗi khi fetch URL:", error);
    }
  }
  
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
        <View style={styles.searchBarContainer}>
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
        {/* Grid các ô âm thanh */}
        <View style={styles.gridContainer}>
  {sounds.map((item) => (
    <TouchableOpacity key={item.id} style={styles.soundCard}>
      {item.library === "Ionicons" ? (
        <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={40} color="white" />
      ) : (
        <MaterialCommunityIcons name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={40} color="white" />
      )}
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  ))}
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
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)"  // Hiệu ứng mờ
  },
  searchBarContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 30, // Đưa search bar lên đầu trang
    position: "absolute",
    top: 20,
  },
  searchBar: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Màu trong suốt kiểu glassmorphism
    borderRadius: 25,  // Bo tròn nhiều hơn
    paddingHorizontal: 15, 
    width: "90%", 
    paddingVertical: 10,
    shadowColor: "rgba(255, 255, 255, 0.5)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    flex: 1,
          justifyContent: 'flex-end', // Đẩy nội dung xuống dưới
          marginBottom: 40            // Khoảng trống phía dưới (tùy chỉnh)
  },
  searchInput: { 
    flex: 1, 
    padding: 10, 
    color: "white" ,
    fontFamily: "Oswald",
    fontSize:18,
    
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 130,
  },
  soundCard: {
    width: 100,
    height: 120,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    margin: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(255, 255, 255, 0.5)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginTop: 20,
  },
  cardText: {
    color: "white",
    fontSize: 14,
    marginTop: 5,
    fontFamily: "PoppinsRegular",
  },
});

