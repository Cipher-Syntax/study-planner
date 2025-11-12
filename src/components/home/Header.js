import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar, Bell } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';

const PRIMARY_COLOR = "#12bab4";

const Header = ({ hasOverdue }) => { 
    const router = useRouter();
    const [user, setUser] = useState(null);

    const loadUserData = async () => {
        try {
            const loggedInUsername = await AsyncStorage.getItem('loggedInUser');
            if (loggedInUsername) {
                const savedUser = await AsyncStorage.getItem(loggedInUsername);
                if (savedUser) setUser(JSON.parse(savedUser));
            }
        }
        catch (error) {
            console.log('Error fetching user: ', error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadUserData();
        }, [])
    );

    const today = new Date();
    const dateOptions = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = today.toLocaleDateString("en-US", dateOptions);

    return (
        <View style={styles.container}>
            <View style={styles.dateContainer}>
                <Calendar color={PRIMARY_COLOR} size={18} />
                <Text style={styles.dateText}>{formattedDate}</Text>
            </View>

            <View style={styles.bottomRow}>
                <View style={styles.greetingContainer}>
                    <Text style={styles.greetingText} numberOfLines={1}>
                        Hey, {user?.username || "Student"} 👋
                    </Text>
                    <Text style={styles.subtitle}>Organize your tasks, boost your productivity.</Text>
                </View>

                <TouchableOpacity 
                    onPress={() => router.push('notification')} 
                    style={styles.notificationButton}
                >
                    <Bell size={28} color={PRIMARY_COLOR} />
                    {hasOverdue && (
                        <View style={styles.badge} />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    container: { 
        width: "100%", 
        marginBottom: 20,
        marginTop: 20
    },
    dateContainer: { 
        flexDirection: "row", 
        gap: 8, 
        alignItems: "center",
        marginBottom: 5,
    },
    dateText: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '500'
    },
    bottomRow: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: 'flex-start',
    },
    greetingContainer: {
        flex: 1,
        marginRight: 10,
    },
    greetingText: { 
        fontSize: 28, 
        fontWeight: '900', 
        letterSpacing: 0.5,
        color: '#1f2937',
    },
    subtitle: {
        fontSize: 14,
        color: '#4b5563',
        marginTop: 2,
    },
    notificationButton: { 
        position: 'relative', 
        padding: 5,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ef4444',
        borderWidth: 2,
        borderColor: '#f9fafb',
    }
});
