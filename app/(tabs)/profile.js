import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, StatusBar, TextInput } from 'react-native';
import { User, CheckCircle, Clock, LogOut, Settings, Mail, Lock, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const BRAND_COLOR = "#3b82f6";
const DANGER_COLOR = "#ef4444";
const SUCCESS_COLOR = "#10b981"; 

const ProgressBar = ({ completed, total }) => {
    const progress = total > 0 ? (completed / total) * 100 : 0;
    
    return (
        <View style={styles.progressBarContainer}>
            <Text style={styles.progressBarText}>
                {completed} / {total} Tasks Done
            </Text>
            <View style={styles.progressBarBackground}>
                <View style={[
                    styles.progressBarFill, 
                    { width: `${progress > 100 ? 100 : progress}%` }
                ]} />
            </View>
        </View>
    );
};

const Profile = () => {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [tasksCompleted, setTasksCompleted] = useState(0);
    const [overdueTasks, setOverdueTasks] = useState(0);
    const [totalTasks, setTotalTasks] = useState(0);
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');


    const loadData = async () => {
        setLoading(true);
        try {
            const loggedInUsername = await AsyncStorage.getItem('loggedInUser');

            if (!loggedInUsername) {
                router.replace('auth/login'); 
                return;
            }

            const savedUserJson = await AsyncStorage.getItem(loggedInUsername);
            if (savedUserJson) {
                const parsedUser = JSON.parse(savedUserJson);
                setUser(parsedUser);
                setNewEmail(parsedUser.email || ''); 
                setNewUsername(parsedUser.username || '');
            }
            
            const savedTasks = await AsyncStorage.getItem('TASKS');
            if (savedTasks) {
                const allTasks = JSON.parse(savedTasks);
                const today = new Date().toISOString().split('T')[0];
                
                const completed = allTasks.filter(task => task.isCompleted).length;
                const overdue = allTasks.filter(task => !task.isCompleted && task.deadline < today).length;
                const total = allTasks.length;

                setTasksCompleted(completed);
                setOverdueTasks(overdue);
                setTotalTasks(total);
            } else {
                setTasksCompleted(0);
                setOverdueTasks(0);
                setTotalTasks(0);
            }
        } catch (err) {
            console.log('Error loading profile data:', err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(() => {
        loadData();
    }, []));

    const handleEdit = () => {
        setNewEmail(user?.email || '');
        setNewUsername(user?.username || '');
        setNewPassword('');
        setIsEditing(true);
    };

    const handleSaveProfile = async () => {
        if (!user || !newUsername) {
            Alert.alert("Error", "Username cannot be empty.");
            return;
        }

        const isUsernameChanged = newUsername !== user.username;
        const isEmailChanged = newEmail !== user.email;
        const isPasswordChanged = newPassword.length > 0;

        if (!isEmailChanged && !isPasswordChanged && !isUsernameChanged) {
            Alert.alert("No Changes", "No modifications detected. Cannot save.");
            return;
        }

        if (isUsernameChanged) {
            const existingUser = await AsyncStorage.getItem(newUsername);
            if (existingUser) {
                 Alert.alert("Error", "The new username is already taken.");
                 return;
            }
        }
        
        const updatedUser = { 
            ...user, 
            username: newUsername,
            email: newEmail,
            password: isPasswordChanged ? newPassword : user.password 
        };

        try {
            if (isUsernameChanged) {
                await AsyncStorage.setItem(newUsername, JSON.stringify(updatedUser));
                await AsyncStorage.removeItem(user.username);
                await AsyncStorage.setItem('loggedInUser', newUsername);
            } else {
                await AsyncStorage.setItem(user.username, JSON.stringify(updatedUser));
            }
            
            setUser(updatedUser);
            setIsEditing(false);
            setNewPassword(''); 
            
            Alert.alert("Success", "Profile updated successfully!");

        } catch (err) {
            console.log('Error saving profile data:', err);
            Alert.alert("Error", "Could not save profile changes.");
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out? You will need to sign in again.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", style: "destructive", onPress: async () => {
                    await AsyncStorage.removeItem('loggedInUser');
                    router.replace('auth/login');
                }}
            ]
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={BRAND_COLOR} />
                <Text style={{ marginTop: 10, color: '#6b7280' }}>Fetching your progress...</Text>
            </View>
        );
    }
    
    const totalPending = totalTasks - tasksCompleted;

    return (
        <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
                
                <View style={styles.headerCard}>
                    <View style={styles.avatarContainer}>
                        <User size={60} color={BRAND_COLOR} />
                    </View>
                    <View style={styles.headerText}>
                        <Text style={styles.name}>Hello, {user?.username || "Student"}</Text>
                        <Text style={styles.email}>{user?.email || "No Email Provided"}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Your Study Progress</Text>
                <ProgressBar 
                    completed={tasksCompleted} 
                    total={totalTasks} 
                />
                
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { backgroundColor: '#e0f2f1' }]}>
                        <CheckCircle size={24} color={SUCCESS_COLOR} />
                        <Text style={[styles.statNumber, { color: SUCCESS_COLOR }]}>{tasksCompleted}</Text>
                        <Text style={styles.statLabel}>Completed</Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: '#fee2e2' }]}>
                        <Clock size={24} color={DANGER_COLOR} />
                        <Text style={[styles.statNumber, { color: DANGER_COLOR }]}>{overdueTasks}</Text>
                        <Text style={styles.statLabel}>Overdue</Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: '#eff6ff' }]}>
                        <Settings size={24} color={BRAND_COLOR} />
                        <Text style={[styles.statNumber, { color: BRAND_COLOR }]}>{totalPending}</Text>
                        <Text style={styles.statLabel}>Pending</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Account Actions</Text>
                <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
                    <Settings size={20} color={BRAND_COLOR} />
                    <Text style={styles.actionButtonText}>Edit Profile Details</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, { marginTop: 15 }]} onPress={handleLogout}>
                    <LogOut size={20} color={DANGER_COLOR} />
                    <Text style={[styles.actionButtonText, { color: DANGER_COLOR }]}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>

            {isEditing && (
                <View style={styles.editFormOverlay}>
                    <ScrollView style={styles.editForm} contentContainerStyle={{ paddingBottom: 20 }}>
                        <View style={styles.editFormHeader}>
                            <Text style={styles.editFormTitle}>Edit Profile</Text>
                            <TouchableOpacity onPress={() => setIsEditing(false)}>
                                <X size={24} color="#4b5563" />
                            </TouchableOpacity>
                        </View>
                        
                        <Text style={styles.label}>Username</Text>
                        <View style={styles.inputContainer}>
                            <User size={20} color="#6b7280" />
                            <TextInput 
                                style={styles.inputField}
                                value={newUsername}
                                onChangeText={setNewUsername}
                                placeholder="Enter new username"
                            />
                        </View>

                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputContainer}>
                            <Mail size={20} color="#6b7280" />
                            <TextInput 
                                style={styles.inputField}
                                value={newEmail}
                                onChangeText={setNewEmail}
                                keyboardType="email-address"
                                placeholder="Enter new email"
                            />
                        </View>

                        <Text style={styles.label}>New Password (Leave blank to keep current)</Text>
                        <View style={styles.inputContainer}>
                            <Lock size={20} color="#6b7280" />
                            <TextInput 
                                style={styles.inputField}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry
                                placeholder="Enter new password"
                            />
                        </View>

                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                            <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    contentContainer: {
        paddingTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    headerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#e0f2f1",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15
    },
    headerText: {
        justifyContent: 'center',
    },
    name: {
        fontSize: 26,
        fontWeight: "800",
        color: "#1f2937",
        marginBottom: 2
    },
    email: {
        fontSize: 14,
        color: "#6b7280",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
        marginTop: 15,
        marginBottom: 10,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: 'wrap',
        marginTop: 5,
        gap: 10
    },
    statCard: {
        alignItems: "center",
        padding: 15,
        borderRadius: 12,
        width: "30%",
        minHeight: 110,
        justifyContent: 'space-between'
    },
    statNumber: {
        fontSize: 22,
        fontWeight: "800",
        marginTop: 8,
        marginBottom: 2
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: "#4b5563"
    },
    progressBarContainer: {
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    progressBarText: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#4b5563',
        textAlign: 'center'
    },
    progressBarBackground: {
        height: 10,
        backgroundColor: '#e5e7eb',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: SUCCESS_COLOR,
        borderRadius: 5,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#fff",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    actionButtonText: {
        color: "#1f2937",
        fontWeight: "bold",
        fontSize: 16,
        marginLeft: 15
    },
    editFormOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    editForm: {
        backgroundColor: '#f9fafb',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '70%',
    },
    editFormHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingBottom: 10,
    },
    editFormTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: BRAND_COLOR,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4b5563',
        marginTop: 15,
        marginBottom: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
        marginBottom: 10,
    },
    inputField: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#1f2937',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        color: '#1f2937',
    },
    saveButton: {
        backgroundColor: BRAND_COLOR,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 30,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 16,
    }
});