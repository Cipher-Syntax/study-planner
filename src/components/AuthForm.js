import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { BookOpen } from 'lucide-react-native';

const AuthForm = () => {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const handleSubmit = async () => {
        // if (!username || !password || (!isLogin && (!email || !confirmPassword))) {
        //     Alert.alert('Error', 'Please fill all fields');
        //     return;
        // }

        // if (!isLogin && password !== confirmPassword) {
        //     Alert.alert('Error', 'Passwords do not match');
        //     return;
        // }

        // try {
        //     if (isLogin) {
        //         const storedUser = await AsyncStorage.getItem(username);
        //         if (!storedUser) {
        //             Alert.alert('Error', 'User not found');
        //             return;
        //         }
        //         const parsedUser = JSON.parse(storedUser);

        //         if (parsedUser.password !== password) {
        //             Alert.alert('Error', 'Incorrect password');
        //             return;
        //         }
        //         await AsyncStorage.setItem('loggedInUser', JSON.stringify(parsedUser));
        //         if (remember) await AsyncStorage.setItem('loggedInUser', username);

        //         router.replace('/(tabs)');
        //     } 
        //     else {
        //         const userData = { username, email, password };
        //         await AsyncStorage.setItem(username, JSON.stringify(userData));
        //         Alert.alert('Success', 'Account created! You can now log in.');
        //         setIsLogin(true);
        //     }
        // } 
        // catch (error) {
        //     Alert.alert('Error', 'Something went wrong');
        //     console.log(error);
        // }
        router.replace('/(tabs)');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.logoSection}>
                <View style={styles.logoContainer}>
                    <BookOpen size={100} color="#12bab4" />
                </View>
                <Text style={styles.appTitle}>Study Planner</Text>
                <Text style={styles.appSubtitle}>Organize your tasks, boost your productivity</Text>
            </View>

            <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>

            <TextInput
                placeholder="Username"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
            />

            {!isLogin && (
                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            )}

            <TextInput
                placeholder="Password"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {!isLogin && (
                <TextInput
                    placeholder="Confirm Password"
                    style={styles.input}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
            )}

            {isLogin && (
                <View style={styles.rememberRow}>
                    <Switch value={remember} onValueChange={setRemember} />
                    <Text style={styles.rememberText}>Keep me signed in</Text>
                </View>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={styles.toggleText}>
                    {isLogin ? 'No account? Register here' : 'Already have an account? Login'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f0f4f8',
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoContainer: {
        width: 100,
        height: 100,
        backgroundColor: '#eff6ff',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    appTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    appSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#12bab4',
        padding: 15,
        borderRadius: 8,
        marginTop: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    toggleText: {
        marginTop: 15,
        textAlign: 'center',
        color: '#12bab4',
        fontWeight: '600',
    },
    rememberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    rememberText: {
        marginLeft: 8,
        fontSize: 14,
    },
});

export default AuthForm;
