import { Tabs } from "expo-router";
import { BookOpen, Calendar, Info, User } from "lucide-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TabLayout = () => {
    return (
        <SafeAreaView style={{
            flex: 1,
            justifyContent: "space-between"
        }}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: true,
                    tabBarStyle: {
                        backgroundColor: "#fff",
                        borderTopWidth: 0,
                        height: 80,
                        elevation: 0,
                    },
                    tabBarActiveTintColor: "#fff",
                    tabBarInactiveTintColor: "#9CA3AF",
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Home",
                        tabBarIcon: ({ color, focused }) => (
                            <View
                                style={{
                                    backgroundColor: focused ? "#12bab4" : "transparent",
                                    borderWidth: focused ? 1 : 0,
                                    borderColor: focused ? "#fff" : "transparent",
                                    borderRadius: 9999,
                                    padding: focused ? 20 : 8,
                                    transform: [{ scale: focused ? 1.15 : 1 }],
                                }}
                            >
                                <BookOpen color={color} size={22} />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="schedule"
                    options={{
                        title: "Schedule",
                        tabBarIcon: ({ color, focused }) => (
                            <View
                                style={{
                                    backgroundColor: focused ? "#12bab4" : "#fff",
                                    borderWidth: focused ? 1 : 0,
                                    borderColor: focused ? "#fff" : "transparent",
                                    borderRadius: 9999,
                                    padding: focused ? 20 : 0,
                                    transform: [{ scale: focused ? 1.15 : 1 }],
                                }}
                            >
                                <Calendar color={color} size={22} />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profile",
                        tabBarIcon: ({ color, focused }) => (
                            <View
                                style={{
                                    backgroundColor: focused ? "#12bab4" : "transparent",
                                    borderWidth: focused ? 1 : 0,
                                    borderColor: focused ? "#fff" : "transparent",
                                    borderRadius: 9999,
                                    padding: focused ? 20 : 8,
                                    transform: [{ scale: focused ? 1.15 : 1 }],
                                }}
                            >
                                <User color={color} size={22} />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="about"
                    options={{
                        title: "About",
                        tabBarIcon: ({ color, focused }) => (
                            <View
                                style={{
                                    backgroundColor: focused ? "#12bab4" : "transparent",
                                    borderWidth: focused ? 1 : 0,
                                    borderColor: focused ? "#fff" : "transparent",
                                    borderRadius: 9999,
                                    padding: focused ? 20 : 8,
                                    transform: [{ scale: focused ? 1.15 : 1 }],
                                }}
                            >
                                <Info color={color} size={22} />
                            </View>
                        ),
                    }}
                />
            </Tabs>
        </SafeAreaView>
    );
}

export default TabLayout
