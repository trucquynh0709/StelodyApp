import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as Font from "expo-font";
import React, { useEffect, useState } from "react";
import { Audio } from "expo-av";
import images from "@/assets/constants/images";
import * as Haptics from 'expo-haptics';
import * as SplashScreen from "expo-splash-screen";
import { ImageBackground } from "react-native";
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";  // Import useRouter
import avatarImage from "@/assets/images/avatar.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const sounds = [
//   { id: "1", name: "Favourite", icon: "heart-outline", library: "Ionicons" },
//   { id: "2", name: "Recently", icon: "time-outline", library: "Ionicons" },
//   { id: "3", name: "Log out", icon: "log-out-outline", library: "Ionicons" },
  
// ]

export default function ProfileScreen() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [currentSong, setCurrentSong] = useState<{ title: string; url: string } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const router = useRouter(); 

  //
  const [storedEmail, setStoredEmail] = useState<string | null>(null); // state cho email
  const [name, setName] = useState<string | null>(null); // state cho name

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
      });
      setFontLoaded(true);
      await SplashScreen.hideAsync();
    }
    loadFont();
  }, []);

  useEffect(() => {
    const fetchEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('userEmail');
      if (storedEmail) {
        const name = storedEmail.split('@')[0];
        setStoredEmail(storedEmail); // Cập nhật state storedEmail
        setName(name); // Cập nhật state name
      }
    };
    fetchEmail();
    return sound
      ? () => {
          sound.unloadAsync(); // Giải phóng tài nguyên khi component bị unmount
        }
      : undefined;
  }, [sound]);

  if (!fontLoaded) {
    return null;
  }

  const playSound = async (url: string) => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      

    }
    
    const { sound: newSound } = await Audio.Sound.createAsync({ uri: url });
    setSound(newSound);
    await newSound.playAsync();
    setIsPlaying(true);
  };

  const togglePlayback = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <ImageBackground source={images.explore} style={styles.explore}>
        <View style={styles.overlay}>
    <View style={styles.container}>
     
      

      {/* Avatar + Edit Button */}
      <View style={styles.avatarContainer}>
        {/* <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.avatar} /> */}
        <Image source={avatarImage} style={styles.avatar} />

        <TouchableOpacity style={styles.editButton}>
          <Feather name="edit" size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.nameCard}>
      <BlurView intensity={30} tint="light" style={styles.blurContainer}>
     
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{storedEmail}</Text>
        </BlurView>
      </View>
{/* 
      <View style={styles.gridContainer}>
  {sounds.map((item) => (
    <TouchableOpacity key={item.id} style={styles.infoCard}
       onPress={() => {
            if (item.name === "Favourite") {
              router.push("/favourite"); // Điều hướng đến FavouriteScreen
            }
       } */}
      {/* }> */}
      {/* {item.library === "Ionicons" ? (
        <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={40} color="white" />
      ) : (
        <MaterialCommunityIcons name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={40} color="white" />
      )}
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  ))} */}
</View>

      {/* Options
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => {
            setCurrentSong({ title: "At My Worst", url: "https://test.com/audio.mp3" });
            playSound("https://test.com/audio.mp3");
          }}
        >
          <Ionicons name="heart" size={32} color="#F6E9F3FF" />
          <Text style={styles.optionText}>My Favourite</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Ionicons name="time-outline" size={32} color="#F6E9F3FF" />
          <Text style={styles.optionText}>Recently</Text>
        </TouchableOpacity>
      </View> */}

      
    </View>
    
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  explore: { 
    flex: 1, 
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center"
  },
  overlay: { 
    flex: 1, 
    width: "100%", 
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
  },
  container: {
    flex: 1,
  },
 
  avatarContainer: {
    alignItems: "center",
    marginBottom: 50,
    marginTop:80,
  },
  avatar: {
    width: 156,
    height: 156,
    borderRadius: 78,
    borderWidth: 9,
    backgroundColor: "rgba(255, 255, 255, 0)", // Lớp phủ trong suốt
    //borderWidth: 9,
    marginBottom: 2,
   borderColor: "rgba(255, 255, 255, 0.2)",
   shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginTop: 100,
  },
  editButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    padding: 8,
    borderRadius: 20,
    marginTop: 0,
  },
  nameCard: {
 //   backgroundColor: "#C294B7",
 borderRadius: 30,
 //overflow: "hidden", 
    // padding: 16,
    // borderRadius: 12,
     shadowColor: "#000",
     shadowOpacity: 0.1,
    // shadowRadius: 6,
    // elevation: 4,
    marginLeft:40,
    marginTop: 0,
  },
  blurContainer: {
    padding: 16,
    borderRadius: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 330, // Điều chỉnh theo ý thích
    height: 100,
    backgroundColor: "rgba(255, 255, 255, 0)", // Lớp phủ trong suốt
    borderWidth: 9,
   borderColor: "rgba(255, 255, 255, 0.2)", // Viền nhẹ
  },
  name: {
    fontSize: 25,
    color: "#FFFFFFFA",
    fontFamily: "PoppinsBold",
  },
  email: {
    color: "#FFFFFFFF",
    fontFamily: "PoppinsRegular",
  },
  
  // optionButton: {
  //   backgroundColor: "#F8BBD0",
  //   padding: 16,
  //   borderRadius: 12,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   marginBottom: 12,
  // },
  // optionText: {
  //   marginLeft: 12,
  //   fontSize: 16,
  //   color: "#4A4A4A",
  //   fontFamily: "Helvetica-Bold",
  // },
  // gridContainer: {
  //   flexDirection: "row",
  //   flexWrap: "wrap",
  //   justifyContent: "center",
  //   marginTop: 25,
  // },
  // infoCard: {
  //   width: 330,
  //   height: 100,
  //   backgroundColor: "rgba(255, 255, 255, 0.2)",
  //   margin: 25,
  //   borderRadius: 20,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   shadowColor: "rgba(255, 255, 255, 0.5)",
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 10,
  //   marginTop:0,
    
  // },
  // cardText: {
  //   color: "white",
  //   fontSize: 18,
  //   marginTop: 5,
  //   fontFamily: "PoppinsRegular",
  // },
});
