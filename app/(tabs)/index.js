import React, { useState, useEffect, useCallback } from 'react';
import { View, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Header from '@/src/components/home/Header';
import CalendarSelection from '@/src/components/home/CalendarSelection';
import TaskItems from '@/src/components/home/TaskItems';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_TASKS } from '@/src/data/mockData';

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState("all");

    // Initial load
    useEffect(() => {
        const loadTasks = async () => {
            const saved = await AsyncStorage.getItem('TASKS');
            if (saved) setTasks(JSON.parse(saved));
            else {
                setTasks(MOCK_TASKS);
                await AsyncStorage.setItem('TASKS', JSON.stringify(MOCK_TASKS));
            }
        };
        loadTasks();
    }, []);

    // Reload tasks whenever screen is focused
    useFocusEffect(
        useCallback(() => {
            const reloadTasks = async () => {
                const saved = await AsyncStorage.getItem('TASKS');
                if (saved) setTasks(JSON.parse(saved));
            };
            reloadTasks();
        }, [])
    );

    const filteredTasks = selectedDate === "all" ? tasks : tasks.filter(task => task.deadline === selectedDate);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <ScrollView style={{ padding: 30 }}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <Header />
                <CalendarSelection selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                <TaskItems tasks={filteredTasks} setTasks={setTasks} />
            </ScrollView>
        </SafeAreaView>
    );

};

export default Home;
