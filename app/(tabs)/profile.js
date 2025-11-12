import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const Profile = () => {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [tasksCompleted, setTasksCompleted] = useState(0);
    const [overdueTasks, setOverdueTasks] = useState(0);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoading(true);
                try {
                    const loggedInUsername = await AsyncStorage.getItem('loggedInUser');
                    if (loggedInUsername) {
                        const savedUser = await AsyncStorage.getItem(loggedInUsername);

                        // console.log(savedUser);
                        if (savedUser) setUser(JSON.parse(savedUser));
                    }

                    const savedTasks = await AsyncStorage.getItem('TASKS');
                    if (savedTasks) {
                        const allTasks = JSON.parse(savedTasks);
                        const today = new Date().toISOString().split('T')[0];
                        const completed = allTasks.filter(task => task.isCompleted).length;
                        const overdue = allTasks.filter(task => !task.isCompleted && task.deadline < today).length;

                        setTasksCompleted(completed);
                        setOverdueTasks(overdue);
                    } else {
                        setTasksCompleted(0);
                        setOverdueTasks(0);
                    }
                } catch (err) {
                    console.log('Error loading profile data:', err);
                } finally {
                    setLoading(false);
                }
            };

            loadData();
        }, [])
    );

    const handleEdit = () => {
        Alert.alert("Edit Profile", "Edit functionality coming soon!");
    };

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", style: "destructive", onPress: async () => {
                    router.replace('auth/login');
                }}
            ]
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#12bab4" />
                <Text style={{ marginTop: 10 }}>Loading profile...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <User size={80} color="#3b82f6" />
            </View>

            <Text style={styles.name}>{user?.username || "No Name"}</Text>
            <Text style={styles.email}>{user?.email || "No Email"}</Text>

            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>

            <View style={styles.infoContainer}>
                <View style={styles.infoCard}>
                    <Text style={styles.infoNumber}>{tasksCompleted}</Text>
                    <Text style={styles.infoLabel}>Tasks Completed</Text>
                </View>
                <View style={styles.infoCard}>
                    <Text style={styles.infoNumber}>{overdueTasks}</Text>
                    <Text style={styles.infoLabel}>Overdue Tasks</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        paddingTop: 50,
        paddingHorizontal: 20
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#e5e7eb",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20
    },
    name: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 4
    },
    email: {
        fontSize: 16,
        color: "#6b7280",
        marginBottom: 20
    },
    editButton: {
        backgroundColor: "#3b82f6",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 30
    },
    editButtonText: {
        color: "#fff",
        fontWeight: "bold"
    },
    infoContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginBottom: 40
    },
    infoCard: {
        alignItems: "center",
        backgroundColor: "#f3f4f6",
        padding: 20,
        borderRadius: 12,
        width: "45%"
    },
    infoNumber: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 4
    },
    infoLabel: {
        fontSize: 14,
        color: "#6b7280"
    },
    logoutButton: {
        backgroundColor: "#ef4444",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8
    },
    logoutButtonText: {
        color: "#fff",
        fontWeight: "bold"
    }
});


export default Profile;
