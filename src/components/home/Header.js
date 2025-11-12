import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar, Bell } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router'; // ✅ import useFocusEffect

const Header = () => {
    const router = useRouter();
    const [hasOverdue, setHasOverdue] = useState(false);
    const [user, setUser] = useState(null);

    const checkOverdue = async () => {
        const saved = await AsyncStorage.getItem('TASKS');
        if (saved) {
            const allTasks = JSON.parse(saved);
            const today = new Date().toISOString().split('T')[0];
            const overdue = allTasks.filter(t => t.deadline < today && !t.isCompleted);
            setHasOverdue(overdue.length > 0);
        } else {
            setHasOverdue(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                try{
                    const loggedInUsername = await AsyncStorage.getItem('loggedInUser');
                    if(loggedInUsername){
                        const saveUser = await AsyncStorage.getItem(loggedInUsername)

                        if(saveUser) setUser(JSON.parse(saveUser));
                    }
                }
                catch(error){
                    console.log('Error fetching user: ', error);
                }
            }

            loadData();
        }, [])
    )

    useFocusEffect(
        useCallback(() => {
            checkOverdue();
        }, [])
    );

    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0");
    const month = today.toLocaleString("en-US", { month: "long" });
    const year = today.getFullYear();

    return (
        <View style={{ width: "100%", marginHorizontal: "auto" }}>
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                <Calendar color="#12bab4" />
                <Text>{`${day}, ${month} ${year}`}</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View>
                    <Text style={{ fontSize: 30, marginTop: 10, fontWeight: 900, letterSpacing: 3 }}>
                        Hey, {user?.username || "No Name"} 👋
                    </Text>
                    <Text>Organize your tasks, boost your productivity</Text>
                </View>

                <TouchableOpacity onPress={() => router.push('notification')} style={{ position: 'relative' }}>
                    <Bell size={30} color="#12bab4" />
                    {hasOverdue && (
                        <View
                            style={{
                                position: 'absolute',
                                top: 2,
                                right: 2,
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: 'red',
                            }}
                        />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Header;
