import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, ImageBackground, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import Animated, { 
  Easing, 
  useSharedValue, 
  useAnimatedProps, 
  withRepeat, 
  withTiming,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import images from "@/assets/constants/images";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useRouter } from "expo-router";
import * as Haptics from 'expo-haptics';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const AnimatedCircleEffect = () => {
  const radius = 80;
  const strokeWidth = 2;
  const circleRadius = radius - strokeWidth / 2;
  const containerSize = radius * 3;

  // Chỉ dùng một shared value cho tất cả các vòng
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    // Tạo một animation duy nhất
    animationProgress.value = withRepeat(
      withTiming(1, {
        duration: 4000,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
      -1,
      false
    );
  }, []);

  const centerPoint = containerSize / 2;

  // Tạo mảng các delay để tạo hiệu ứng sóng
  const delays = [0, 0.33, 0.66];

  return (
    <Svg width={containerSize} height={containerSize} style={styles.svgContainer}>
      {delays.map((delay, index) => {
        const animatedProps = useAnimatedProps(() => {
          // Tính toán progress dựa trên delay
          const progress = (animationProgress.value + delay) % 1;
          
          return {
            r: circleRadius + progress * 35,
            opacity: 0.5 - progress * 0.3,
            strokeWidth: strokeWidth + Math.sin(progress * Math.PI) * 1.5,
          };
        });

        return (
          <AnimatedCircle
            key={index}
            cx={centerPoint}
            cy={centerPoint}
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth={strokeWidth}
            fill="none"
            animatedProps={animatedProps}
          />
        );
      })}
      <Circle
        cx={centerPoint}
        cy={centerPoint}
        r={circleRadius}
        stroke="rgba(255, 255, 255, 0.9)"
        strokeWidth={strokeWidth}
        fill="none"
      />
    </Svg>
  );
};

const PlayButton = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songTitle, setSongTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();
  const starScale = useSharedValue(1);

  useEffect(() => {
    let isMounted = true;

    async function initAudio() {
      try {
        console.log("Đang khởi tạo audio...");
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
        });
        
        if (isMounted) {
          console.log("Audio đã sẵn sàng");
          setIsAudioReady(true);
        }
      } catch (error) {
        console.error("Lỗi khởi tạo audio:", error);
        if (isMounted) {
          setIsAudioReady(false);
        }
      }
    }

    initAudio();

    return () => {
      isMounted = false;
      if (sound) {
        console.log("Cleanup audio...");
        const cleanup = async () => {
          try {
            const status = await sound.getStatusAsync();
            if (status.isLoaded) {
              await sound.stopAsync();
              await sound.unloadAsync();
            }
          } catch (error) {
            console.error("Lỗi khi cleanup audio:", error);
          }
        };
        cleanup();
      }
    };
  }, []);

  // Hàm để load bài hát mới
  const loadNewSong = async (url: string, title: string) => {
    if (!isAudioReady) {
      console.log("Đang đợi audio khởi tạo...");
      try {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
        });
        setIsAudioReady(true);
      } catch (error) {
        console.error("Không thể khởi tạo audio:", error);
        return;
      }
    }

    try {
      console.log("Bắt đầu load bài hát mới:", title);
      setIsLoading(true);
      
      // Dừng và xóa bài cũ một cách an toàn
      if (sound) {
        try {
          console.log("Dừng bài hát cũ...");
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            await sound.stopAsync();
            await sound.unloadAsync();
            // Đợi thêm một chút để đảm bảo unload hoàn tất
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (error) {
          console.error("Lỗi khi unload bài cũ:", error);
        }
        setSound(null);
      }

      // Tạm dừng ngắn để đảm bảo cleanup hoàn tất
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log("Tạo sound object mới...");
      // Tạo và phát bài mới
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { 
          shouldPlay: true,
          volume: 1.0,
          isLooping: isLooping,
          progressUpdateIntervalMillis: 100,
        },
        (status) => {
          if (status.isLoaded) {
            if (status.didJustFinish) {
              if (isLooping) {
                newSound.replayAsync();
              } else {
                setIsPlaying(false);
              }
            } else {
              setIsPlaying(status.isPlaying);
            }
          }
        }
      );

      console.log("Bài hát đã được load thành công");
      setSound(newSound);
      setSongTitle(title);
      setAudioUrl(url);
      setIsPlaying(true);
    } catch (error) {
      console.error("Lỗi khi tạo sound object:", error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        "BebasNeue-Regular": require("@/assets/fonts/BebasNeue-Regular.ttf"),
         "Oswald-Regular": require("@/assets/fonts/Oswald-VariableFont_wght.ttf"),
        "PoppinsBold": require("@/assets/fonts/Poppins-Bold.ttf"),
         "PoppinsRegular": require("@/assets/fonts/Poppins-Regular.ttf"),
        // "Montse": require("@/assets/fonts/Montserrat-VariableFont_wght.ttf"),
         "Raleway": require("@/assets/fonts/Raleway-VariableFont_wght.ttf"),
        // "RalewayItalic": require("@/assets/fonts/Raleway-Italic-VariableFont_wght.ttf"),
         "Lora": require("@/assets/fonts/Lora-VariableFont_wght.ttf"),
        // "LoraItalic": require("@/assets/fonts/Lora-Italic-VariableFont_wght.ttf"),
      });
      setFontLoaded(true);
      await SplashScreen.hideAsync();
    }
    loadFont();
  }, []);

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout;
    let lastCheckedUrl: string | null = null;

    async function checkNewSong() {
      try {
        const title = await AsyncStorage.getItem("songTitle");
        const newAudioUrl = await AsyncStorage.getItem("audioUrl");
        
        if (!isMounted) return;

        // Chỉ load bài mới nếu URL khác với bài hiện tại và khác với URL đã kiểm tra lần trước
        if (newAudioUrl && newAudioUrl !== audioUrl && newAudioUrl !== lastCheckedUrl) {
          lastCheckedUrl = newAudioUrl;
          await loadNewSong(newAudioUrl, title || "");
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra bài hát mới:", error);
      }
    }

    // Kiểm tra bài mới mỗi 1 giây thay vì 100ms
    intervalId = setInterval(checkNewSong, 1000);

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [audioUrl]); // Chạy lại khi audioUrl thay đổi

  const handlePlayPause = async () => {
    if (!sound) {
      console.log("No sound object available");
      return;
    }

    try {
      if (isPlaying) {
        console.log("Pausing sound...");
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.pauseAsync();
          setIsPlaying(false);
        }
      } else {
        console.log("Playing sound...");
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          if (status.didJustFinish) {
            await sound.setPositionAsync(0);
          }
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error("Lỗi khi phát/dừng nhạc:", error);
    }
  };

  const toggleLoop = async () => {
    if (!sound) {
      console.log("Không có sound object");
      return;
    }

    try {
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) {
        console.log("Sound chưa được load");
        return;
      }

      const newLoopValue = !isLooping;
      await sound.setIsLoopingAsync(newLoopValue);
      setIsLooping(newLoopValue);
      console.log(`Đã ${newLoopValue ? 'bật' : 'tắt'} chế độ lặp`);
    } catch (error) {
      console.error("Lỗi khi thay đổi chế độ lặp:", error);
      // Đồng bộ lại trạng thái UI với trạng thái thực tế

      //fix her
      try {
        if (sound) {
          const status = await sound.getStatusAsync();
          if (status.isLoaded && typeof status.isLooping === 'boolean') {
            setIsLooping(status.isLooping);
          }
        }
      } catch (innerError) {
        console.error("Lỗi khi kiểm tra trạng thái lặp:", innerError);
      }
      
    }
  };

  const handleFavorite = async () => {
    // Haptic feedback
    if (!isFavorite) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Animation
    starScale.value = withSpring(0.8, { damping: 2 });
    setTimeout(() => {
      starScale.value = withSpring(1);
    }, 100);

    // Update state
    const newValue = !isFavorite;
    setIsFavorite(newValue);

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('isFavorite', newValue.toString());
    } catch (error) {
      console.error('Lỗi khi lưu trạng thái yêu thích:', error);
    }
  };

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/explore");
  };

  const animatedStarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: starScale.value }],
    };
  });

  if (!fontLoaded) {
    return null;
  }

  return (
    <ImageBackground source={images.explore} style={styles.explore}>
      <View style={styles.container}>
        {/* Header buttons */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFavorite}>
            <Animated.View style={animatedStarStyle}>
              <Ionicons 
                name={isFavorite ? "star" : "star-outline"} 
                size={24} 
                color={isFavorite ? "#D63384" : "white"} 
              />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Main player section */}
        <View style={styles.playerSection}>
          <View style={styles.playerContainer}>
            <View style={styles.circleContainer}>
              <AnimatedCircleEffect />
              <TouchableOpacity 
                style={[styles.playButton, isLoading && styles.disabledButton]} 
                onPress={handlePlayPause}
                disabled={isLoading}
              >
                <Ionicons 
                  name={isLoading ? "hourglass-outline" : (isPlaying ? "pause" : "play")} 
                  size={30} 
                  color="white" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Song title */}
          <View style={styles.titleContainer}>
            <Ionicons name="musical-note" size={20} color="white" style={styles.musicIcon} />
            <Text style={styles.songTitle}>{songTitle || "The Fox"}</Text>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity 
              style={[styles.controlButton, isLooping && styles.activeControlButton]} 
              onPress={toggleLoop}
            >
              <Ionicons 
                name={isLooping ? "repeat" : "repeat-outline"} 
                size={24} 
                color={isLooping ? "#D63384" : "white"} 
                style={{ opacity: isLooping ? 1 : 0.5 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  explore: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  playerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  playerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContainer: {
    position: 'relative',
    width: 240,  // Tăng kích thước container
    height: 240, // Tăng kích thước container
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  songTitle: {
    color: "white",
    fontSize: 17,
    fontFamily: "PoppinsRegular",
    marginTop: 20,
    textAlign: "center",
    opacity: 1,
    paddingHorizontal: 20,
    maxWidth: '90%',
  },
  disabledButton: {
    opacity: 0.5,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  activeControlButton: {
    backgroundColor: "rgba(214, 51, 132, 0.3)",
  },
  svgContainer: {
    position: 'absolute',
    transform: [{scale: 1}],
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  musicIcon: {
    marginRight: 4,
    opacity: 1,
    marginTop: -2,
  },
});

export default PlayButton;
