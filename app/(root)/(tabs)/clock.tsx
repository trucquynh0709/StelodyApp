import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Vibration } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import images from "@/assets/constants/images";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import Svg, { Circle } from "react-native-svg";
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withRepeat,
} from "react-native-reanimated";
import { PanGestureHandler, GestureHandlerRootView } from "react-native-gesture-handler";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const TimeUnit = ({ 
  value, 
  isActive, 
  isDragging, 
  onPress, 
  onGestureEvent, 
  onGestureStart, 
  onGestureEnd 
}: { 
  value: number;
  isActive: boolean;
  isDragging: boolean;
  onPress: () => void;
  onGestureEvent: (event: any) => void;
  onGestureStart: () => void;
  onGestureEnd: () => void;
}) => {
  const scale = useSharedValue(1);
  
  useEffect(() => {
    if (isDragging) {
      scale.value = withSpring(1.1, { damping: 10 });
    } else {
      scale.value = withSpring(1, { damping: 15 });
    }
  }, [isDragging]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onBegan={onGestureStart}
      onEnded={onGestureEnd}
      onCancelled={onGestureEnd}
      onFailed={onGestureEnd}
      failOffsetX={[-20, 20]}
      activeOffsetY={[-10, 10]}
    >
      <Animated.View style={animatedStyle}>
        <TouchableOpacity 
          onPress={onPress}
          style={[
            styles.timeField,
            isActive && isDragging && styles.activeTimeField
          ]}
        >
          <Text style={[
            styles.timeText,
            isActive && isDragging && styles.activeTimeText
          ]}>
            {value.toString().padStart(2, '0')}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default function ClockScreen() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isDragging, setIsDragging] = useState(false);
  const [activeField, setActiveField] = useState<'minutes' | 'seconds'>('minutes');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const router = useRouter();
  const progress = useSharedValue(0);
  const circleScale = useSharedValue(1);
  const dragProgress = useSharedValue(0);

  // Kích thước và tham số cho vòng tròn
  const CIRCLE_LENGTH = 800;
  const R = CIRCLE_LENGTH / (2 * Math.PI);
  const CIRCLE_STROKE_WIDTH = 2;

  const updateTime = (newMinutes: number, newSeconds: number) => {
    const clampedMinutes = Math.max(0, Math.min(60, newMinutes));
    const clampedSeconds = Math.max(0, Math.min(59, newSeconds));
    setMinutes(clampedMinutes);
    setSeconds(clampedSeconds);
    setTimeLeft(clampedMinutes * 60 + clampedSeconds);
    dragProgress.value = (clampedMinutes * 60 + clampedSeconds) / (60 * 60);
  };

  const handleMinutesGesture = (event: any) => {
    if (isPlaying) return;
    const translationY = event.nativeEvent.translationY;
    const change = Math.round(-translationY / 30);
    if (change !== 0) {
      const newMinutes = Math.max(0, Math.min(60, minutes + change));
      updateTime(newMinutes, seconds);
    }
  };

  const handleSecondsGesture = (event: any) => {
    if (isPlaying) return;
    const translationY = event.nativeEvent.translationY;
    const change = Math.round(-translationY / 30);
    if (change !== 0) {
      let newSeconds = seconds + change;
      let newMinutes = minutes;

      if (newSeconds > 59) {
        newMinutes = Math.min(60, minutes + Math.floor(newSeconds / 60));
        newSeconds = newSeconds % 60;
      } else if (newSeconds < 0) {
        if (minutes > 0) {
          newMinutes = Math.max(0, minutes - 1);
          newSeconds = 60 + (newSeconds % 60);
        } else {
          newSeconds = 0;
        }
      }

      updateTime(newMinutes, newSeconds);
    }
  };

  const onGestureStart = () => {
    setIsDragging(true);
    circleScale.value = withSequence(
      withSpring(1.1, { damping: 10 }),
      withSpring(1.05, { damping: 15 })
    );
  };

  const onGestureEnd = () => {
    setIsDragging(false);
    circleScale.value = withSpring(1, { damping: 15 });
  };

  // Animation cho vòng tròn
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - (isPlaying ? progress.value : dragProgress.value)),
  }));

  const circleContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: circleScale.value }],
    };
  });

  // Tải âm thanh khi component mount
  useEffect(() => {
    loadSound();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundjay.com/button/beep-07.wav' },
        { shouldPlay: false }
      );
      setSound(sound);
    } catch (error) {
      console.log('Lỗi khi tải âm thanh:', error);
    }
  };

  const playAlarm = async () => {
    try {
      // Rung thiết bị
      Vibration.vibrate([500, 500, 500, 500], true);
      
      // Phát âm thanh
      if (sound) {
        await sound.setPositionAsync(0);
        await sound.playAsync();
      }

      // Phản hồi xúc giác
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Animation cho vòng tròn
      circleScale.value = withRepeat(
        withSequence(
          withSpring(1.2),
          withSpring(1)
        ),
        3,
        true
      );
    } catch (error) {
      console.log('Lỗi khi phát âm thanh:', error);
    }
  };

  const stopAlarm = () => {
    // Dừng rung
    Vibration.cancel();
    
    // Dừng âm thanh
    if (sound) {
      sound.stopAsync();
    }
    
    // Reset animation
    circleScale.value = withSpring(1);
  };

  // Xử lý đếm ngược
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            clearInterval(interval!);
            playAlarm(); // Phát âm thanh khi hết giờ
            return 0;
          }
          const newTimeLeft = prev - 1;
          setMinutes(Math.floor(newTimeLeft / 60));
          setSeconds(newTimeLeft % 60);
          return newTimeLeft;
        });
        progress.value = 1 - timeLeft / (minutes * 60 + seconds);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, timeLeft, minutes, seconds]);

  const startTimer = () => {
    stopAlarm(); // Dừng alarm nếu đang phát
    if (timeLeft === 0) {
      setTimeLeft(minutes * 60 + seconds);
      progress.value = 0;
    }
    setIsPlaying(true);
  };

  const pauseTimer = () => {
    setIsPlaying(false);
    stopAlarm(); // Dừng alarm nếu đang phát
  };

  const resetTimer = () => {
    setIsPlaying(false);
    stopAlarm(); // Dừng alarm nếu đang phát
    setTimeLeft(minutes * 60 + seconds);
    progress.value = 0;
    dragProgress.value = (minutes * 60 + seconds) / (60 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
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

  if (!fontLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground source={images.explore} style={styles.explore}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.title}>Study</Text>
              <TouchableOpacity onPress={resetTimer}>
                <Ionicons name="refresh" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.timerContainer}>
              <Animated.View style={[styles.circleContainer, circleContainerStyle]}>
                <Svg style={styles.svg} width={R * 2} height={R * 2}>
                  <Circle
                    cx={R}
                    cy={R}
                    r={R - CIRCLE_STROKE_WIDTH / 2}
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth={CIRCLE_STROKE_WIDTH}
                    fill="none"
                  />
                  <AnimatedCircle
                    cx={R}
                    cy={R}
                    r={R - CIRCLE_STROKE_WIDTH / 2}
                    stroke={isDragging ? "#D63384" : "white"}
                    strokeWidth={CIRCLE_STROKE_WIDTH}
                    strokeDasharray={CIRCLE_LENGTH}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                    fill="none"
                  />
                </Svg>

                <View style={styles.timeDisplayContainer}>
                  <TimeUnit
                    value={minutes}
                    isActive={activeField === 'minutes'}
                    isDragging={isDragging}
                    onPress={() => !isPlaying && setActiveField('minutes')}
                    onGestureEvent={handleMinutesGesture}
                    onGestureStart={onGestureStart}
                    onGestureEnd={onGestureEnd}
                  />
                  <Text style={styles.timeText}>:</Text>
                  <TimeUnit
                    value={seconds}
                    isActive={activeField === 'seconds'}
                    isDragging={isDragging}
                    onPress={() => !isPlaying && setActiveField('seconds')}
                    onGestureEvent={handleSecondsGesture}
                    onGestureStart={onGestureStart}
                    onGestureEnd={onGestureEnd}
                  />
                </View>
                <Text style={[styles.minuteText, isDragging && styles.draggingText]}>
                  {isPlaying ? "remaining" : (isDragging ? `adjusting ${activeField}` : "tap & swipe to adjust")}
                </Text>
              </Animated.View>

              <TouchableOpacity 
                style={[styles.playButton, isDragging && styles.playButtonDragging]}
                onPress={isPlaying ? pauseTimer : startTimer}
              >
                <Ionicons 
                  name={isPlaying ? "pause" : "play"} 
                  size={30} 
                  color="white" 
                />
              </TouchableOpacity>
              
            </View>
          </View>
        </View>
      </ImageBackground>
    </GestureHandlerRootView>
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
    //backdropFilter: "blur(10px)",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    color: "white",
    fontSize: 30,
    fontFamily: "BebasNeue-Regular",
  },
  timerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  circleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:-150,
  },
  svg: {
    position: "absolute",
    transform: [{ rotate: "-90deg" }],
  },
  timeDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    //marginTop:-100,
  },
  timeField: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBlock:10,
   
  },
  activeTimeField: {
    backgroundColor: 'rgba(214, 51, 132, 0.3)',
  },
  timeText: {
    color: "white",
    fontSize: 88,
    fontFamily: "BebasNeue-Regular",
  },
  activeTimeText: {
    color: "#D63384",
  },
  minuteText: {
    color: "white",
    fontSize: 16,
    fontFamily: "PoppinsRegular",
    opacity: 0.8,
  },
  draggingText: {
    color: "#D63384",
    opacity: 1,
  },
  playButton: {
    position: "absolute",
    bottom: "32%",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(255, 255, 255, 0.5)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    
  },
  playButtonDragging: {
    backgroundColor: "rgba(214, 51, 132, 0.2)",
    shadowColor: "rgba(214, 51, 132, 0.5)",
  }
});
