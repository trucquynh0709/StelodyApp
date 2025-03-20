import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false, // Ẩn chữ dưới icon
        tabBarStyle: styles.tabBar, // Thiết kế tab bar
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "musical-notes" : "musical-notes-outline"} 
              size={30} 
              color={focused ? "#D63384" : "#CCCCCC"} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="todo"
        options={{
          title: "TODO List",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "book" : "book-outline"} 
              size={30} 
              color={focused ? "#D63384" : "#CCCCCC"} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="play"
        options={{
          title: "Playing",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "headset" : "headset-outline"} 
              size={30} 
              color={focused ? "#D63384" : "#CCCCCC"} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="clock"
        options={{
          title: "Pomodoro",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "alarm" : "alarm-outline"} 
              size={32} 
              color={focused ? "#D63384" : "#CCCCCC"} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={30} 
              color={focused ? "#D63384" : "#CCCCCC"} 
            />
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Hiệu ứng kính mờ
    borderRadius: 30,  // Bo tròn nhiều hơn
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    backdropFilter: "blur(15px)"
  }
});

export default TabsLayout;
