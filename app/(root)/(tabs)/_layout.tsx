import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
// import MiniPlayer from "../../../components/MiniPlayer";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabsLayout() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState("");

  const handlePlayPause = async () => {
    setIsPlaying(!isPlaying);
    // Thêm logic xử lý play/pause ở đây
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderTopWidth: 0,
            height: 60,
            paddingBottom: 10,
          },
        }}
      >
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "compass" : "compass-outline"}
                size={24}
                color="white"
              />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="clock"
          options={{
            title: "Clock",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "time" : "time-outline"}
                size={24}
                color="white"
              />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color="white"
              />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="play"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
            headerShown: false, // Ẩn thanh điều hướng
          }}
        />
      </Tabs>
      {/* <MiniPlayer
        songTitle={currentSong}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
      /> */}
    </View>
  );
}
