import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { BookOpen, User, Lock, Mail } from 'lucide-react-native';

const PRIMARY_COLOR = '#14b8a6';
const FOCUS_COLOR = '#3b82f6';
const ERROR_COLOR = '#ef4444';

const AuthForm = () => {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    
    useEffect(() => {
        const checkLogin = async () => {
            const loggedInUser = await AsyncStorage.getItem('loggedInUser');
            if (loggedInUser) {
                router.replace('/(tabs)');
            }
        };
        checkLogin();
    }, []);
    
    useEffect(() => {
        setErrorMessage('');
    }, [isLogin]);

    const handleSubmit = async () => {
        setErrorMessage('');

        if (!username || !password || (!isLogin && (!email || !confirmPassword))) {
            setErrorMessage('Please fill all required fields.');
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        try {
            if (isLogin) {
                const storedUserJson = await AsyncStorage.getItem(username);
                if (!storedUserJson) {
                    setErrorMessage('User not found. Please register.');
                    return;
                }
                const parsedUser = JSON.parse(storedUserJson);

                if (parsedUser.password !== password) {
                    setErrorMessage('Incorrect password.');
                    return;
                }
                
                await AsyncStorage.setItem('loggedInUser', username);
                router.replace('/(tabs)');
            } 
            else {
                const existingUser = await AsyncStorage.getItem(username);
                if(existingUser){
                    setErrorMessage('Username already taken.');
                    return;
                }

                const userData = { username, email, password };
                await AsyncStorage.setItem(username, JSON.stringify(userData));
                
                Alert.alert('Success', 'Account created! Please log in.');
                
                setUsername('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setIsLogin(true);
            }
        } 
        catch (error) {
            setErrorMessage('An unexpected error occurred during authentication.');
            console.log("Auth Error:", error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.logoSection}>
                <View style={styles.logoContainer}>
                    <BookOpen size={60} color={PRIMARY_COLOR} />
                </View>
                <Text style={styles.appTitle}>Study Planner</Text>
                <Text style={styles.appSubtitle}>Master your academic schedule</Text>
            </View>

            <Text style={styles.formTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
            
            {errorMessage ? (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
            ) : null}
            
            <View style={styles.staticInputContainer}>
                <User size={20} color={'#6b7280'} style={styles.inputIcon} />
                <TextInput
                    placeholder="Username"
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="words"
                />
            </View>

            {!isLogin && (
                <View style={styles.staticInputContainer}>
                    <Mail size={20} color={'#6b7280'} style={styles.inputIcon} />
                    <TextInput
                        placeholder="Email"
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
            )}

            <View style={styles.staticInputContainer}>
                <Lock size={20} color={'#6b7280'} style={styles.inputIcon} />
                <TextInput
                    placeholder="Password"
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            {!isLogin && (
                <View style={styles.staticInputContainer}>
                    <Lock size={20} color={'#6b7280'} style={styles.inputIcon} />
                    <TextInput
                        placeholder="Confirm Password"
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                </View>
            )}

            {isLogin && (
                <View style={styles.rememberRow}>
                    <Switch 
                        value={remember} 
                        onValueChange={setRemember} 
                        trackColor={{ false: "#e5e7eb", true: PRIMARY_COLOR }}
                        thumbColor={remember ? "#fff" : "#fff"}
                    />
                    <Text style={styles.rememberText}>Keep me signed in</Text>
                </View>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>{isLogin ? 'LOGIN' : 'REGISTER'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.toggleButton}>
                <Text style={styles.toggleText}>
                    {isLogin ? 'Need an account? Register Here' : 'Already registered? Login'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default AuthForm;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 30,
        backgroundColor: '#fff',
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 100,
        height: 100,
        backgroundColor: '#e0f2f1',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: PRIMARY_COLOR,
    },
    appTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: PRIMARY_COLOR,
    },
    appSubtitle: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        marginTop: 4,
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#1f2937',
    },
    errorBox: {
        backgroundColor: '#fee2e2',
        borderWidth: 1,
        borderColor: ERROR_COLOR,
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
    },
    errorText: {
        color: ERROR_COLOR,
        fontWeight: '600',
        fontSize: 14,
    },
    staticInputContainer: { 
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        marginVertical: 8,
        paddingHorizontal: 15,
        height: 55,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1f2937',
    },
    button: {
        backgroundColor: PRIMARY_COLOR,
        padding: 16,
        borderRadius: 12,
        marginTop: 20,
        alignItems: 'center',
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 18,
        letterSpacing: 0.5,
    },
    toggleButton: {
        marginTop: 20,
        padding: 10,
    },
    toggleText: {
        textAlign: 'center',
        color: PRIMARY_COLOR,
        fontWeight: '700',
        fontSize: 15,
    },
    rememberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 10,
    },
    rememberText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#4b5563',
        fontWeight: '500',
    },
});
