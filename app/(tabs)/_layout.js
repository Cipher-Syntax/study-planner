import { Tabs } from "expo-router";
import { BookOpen, Calendar, Info, User } from "lucide-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TabLayout = () => {
    const TABS = [
        { name: "index", title: "Home", icon: BookOpen },
        { name: "schedule", title: "Schedule", icon: Calendar },
        { name: "profile", title: "Profile", icon: User },
        { name: "about", title: "About", icon: Info },
    ];

    const FOCUSED_COLOR = "#12bab4"
    
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "space-between" }}>
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
                {
                    TABS.map((tab) => (
                        <Tabs.Screen 
                            key={tab.name}
                            name={tab.name}
                            options={{
                                title: tab.title,
                                tabBarIcon: ({ color, focused }) => {
                                    const Icon = tab.icon;
                                    return (
                                        <View
                                            style={{
                                                backgroundColor: focused ? FOCUSED_COLOR : "transparent",
                                                borderWidth: focused ? 1 : 0,
                                                borderColor: focused ? "#fff" : "transparent",
                                                borderRadius: 9999,
                                                padding: focused ? 20 : 8,
                                                transform: [{ scale: focused ? 1.15 : 1 }],
                                            }}
                                        >
                                            <Icon color={color} size={22} />
                                        </View>
                                    );
                                }
                            }}
                        />
                    ))
                }
            </Tabs>
        </SafeAreaView>
    );
};

export default TabLayout;
