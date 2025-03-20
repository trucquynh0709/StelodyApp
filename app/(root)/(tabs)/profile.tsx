import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as Font from "expo-font";
import React, { useEffect, useState } from "react";
import { Audio } from "expo-av";

export default function ProfileScreen() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [currentSong, setCurrentSong] = useState<{ title: string; url: string } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        "Helvetica-Light": require("@/assets/fonts/helvetica-light-587ebe5a59211.ttf"),
        "Helvetica-Bold": require("@/assets/fonts/Helvetica-Bold.ttf"),
        "Helvetica": require("@/assets/fonts/Helvetica.ttf"),
      });
      setFontLoaded(true);
    }
    loadFont();
  }, []);

  useEffect(() => {
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Ionicons name="settings-outline" size={24} color="#FED2EB" />
      </View>

      {/* Avatar + Edit Button */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.avatar} />
        <TouchableOpacity style={styles.editButton}>
          <Feather name="edit" size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.infoCard}>
        <Text style={styles.name}>Trúc Quỳnh</Text>
        <Text style={styles.email}>quynh@gmail.com</Text>
      </View>

      {/* Options */}
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
      </View>

      {/* Mini Player */}
      {currentSong && (
        <View style={styles.miniPlayer}>
          <Image source={{ uri: "https://example.com/song-thumbnail.jpg" }} style={styles.miniPlayerImage} />
          <Text style={styles.miniPlayerText}>{currentSong.title}</Text>
          <TouchableOpacity onPress={togglePlayback}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={28} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FED2EB",
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A4A4A",
    fontFamily: "Helvetica",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: "#C2185B",
  },
  editButton: {
    backgroundColor: "#C2185B",
    padding: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A4A4A",
    fontFamily: "Helvetica-Bold",
  },
  email: {
    color: "#555",
    fontFamily: "Helvetica-Light",
  },
  optionsContainer: {
    marginTop: 24,
  },
  optionButton: {
    backgroundColor: "#F8BBD0",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#4A4A4A",
    fontFamily: "Helvetica-Bold",
  },
  miniPlayer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#C2185B",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  miniPlayerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  miniPlayerText: {
    flex: 1,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
