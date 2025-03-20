import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, TouchableOpacity, ImageBackground } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useRouter } from "expo-router";
import images from "@/assets/constants/images";

SplashScreen.preventAutoHideAsync(); // Ngăn tự động ẩn SplashScreen

const GetStarted = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const router = useRouter();

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FED2EB" }}>
      <ImageBackground
        source={images.onboarding}
        style={{
          flex: 1,
          width: "100%",
          height: 550,
          marginTop: -20,
          alignItems: "center",
        }}
        resizeMode="contain"
      >
        <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 50,
              textAlign: "center",
              fontFamily: "BebasNeue-Regular",
              color: "#000",
              marginTop: 500,
            }}
          >
            Stelody
          </Text>

          <Text
            style={{
              fontSize: 23,
              textAlign: "center",
              fontFamily: "Oswald-Regular",
              color: "#000",
              marginTop: 10,
            }}
          >
            Focus Better, Study Smarter{"\n"}
            <Text style={{ color: "#000000FF" }}>With Music</Text>
          </Text>

          {/* Nút chuyển sang Sign Up */}
          <TouchableOpacity
            onPress={() => router.push("/auth/sign-up")}
            style={{
              backgroundColor: "#000",
              shadowColor: "#999",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
              elevation: 3,
              borderRadius: 9999,
              width: "80%",
              paddingVertical: 16,
              paddingHorizontal: 30,
              marginTop: 20,
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 36, fontFamily: "BebasNeue-Regular", color: "#FFFFFF" }}>
              Get started!
            </Text>
          </TouchableOpacity>

        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default GetStarted;
