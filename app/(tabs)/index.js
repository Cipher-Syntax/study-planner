import React, { useState, useEffect, useCallback } from 'react';
import { View, StatusBar, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Clock, CheckCircle } from 'lucide-react-native';
import Header from '@/src/components/home/Header';
import CalendarSelection from '@/src/components/home/CalendarSelection';
import TaskItems from '@/src/components/home/TaskItems';
import { MOCK_TASKS } from '@/src/data/mockData'; 

const PRIMARY_COLOR = '#14b8a6';
const DANGER_COLOR = '#ef4444';

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState("all");
    const [stats, setStats] = useState({ totalPending: 0, overdue: 0 });

    const calculateStats = useCallback((taskList) => {
        const today = getTodayDateString();
        const pendingTasks = taskList.filter(t => !t.isCompleted);
        const overdueTasks = pendingTasks.filter(t => t.deadline < today);

        setStats({
            totalPending: pendingTasks.length,
            overdue: overdueTasks.length,
        });
    }, []);

    const loadTasksFromStorage = useCallback(async () => {
        const saved = await AsyncStorage.getItem('TASKS');
        let currentTasks = [];
        
        if (saved) {
            currentTasks = JSON.parse(saved);
        } else {
            currentTasks = MOCK_TASKS;
            await AsyncStorage.setItem('TASKS', JSON.stringify(MOCK_TASKS));
        }

        const sortedTasks = currentTasks.sort((a, b) => {
            if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
            return new Date(a.deadline) - new Date(b.deadline);
        });
        
        setTasks(sortedTasks);
    }, [calculateStats]);

    useFocusEffect(
        useCallback(() => {
            loadTasksFromStorage();
        }, [loadTasksFromStorage])
    );

    useEffect(() => {
        if (tasks) { 
            calculateStats(tasks);
        }
    }, [tasks, calculateStats]);


    const filteredTasks = selectedDate === "all"  ? tasks  : tasks.filter(task => task.deadline === selectedDate);
    
    const isEmptyFilteredList = filteredTasks.length === 0 && selectedDate !== "all";


    const QuickStatusBar = () => (
        <View style={styles.statusBarContainer}>
            <View style={[styles.statCard, { borderLeftColor: stats.overdue > 0 ? DANGER_COLOR : PRIMARY_COLOR }]}>
                <Clock size={20} color={stats.overdue > 0 ? DANGER_COLOR : '#6b7280'} />
                <View style={styles.statTextGroup}>
                    <Text style={[styles.statNumber, { color: stats.overdue > 0 ? DANGER_COLOR : '#1f2937' }]}>
                        {stats.overdue}
                    </Text>
                    <Text style={styles.statLabel}>Overdue Task{stats.overdue !== 1 ? 's' : ''}</Text>
                </View>
            </View>

            <View style={[styles.statCard, { borderLeftColor: PRIMARY_COLOR }]}>
                <CheckCircle size={20} color={PRIMARY_COLOR} />
                <View style={styles.statTextGroup}>
                    <Text style={styles.statNumber}>{stats.totalPending}</Text>
                    <Text style={styles.statLabel}>Total Pending</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
                
                <Header hasOverdue={stats.overdue > 0} /> 
                <QuickStatusBar />
                <CalendarSelection selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                
                {isEmptyFilteredList ? (
                    <View style={styles.emptyMessageContainer}>
                        <Text style={styles.emptyMessageText}>
                            No tasks found for **{selectedDate}**.
                        </Text>
                        <Text style={styles.emptyMessageSubText}>
                            Try selecting "View All Tasks" or adding a new one in the Schedule tab.
                        </Text>
                    </View>
                ) : (
                    <TaskItems tasks={filteredTasks} setTasks={setTasks} />
                )}

            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;


const styles = StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor: "#f9fafb" 
    },
    scrollView: {
        paddingHorizontal: 20, 
        paddingTop: 10,
    },
    
    statusBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginTop: 10,
    },
    statCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        width: '48%',
        borderLeftWidth: 5,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    statTextGroup: {
        marginLeft: 10,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1f2937',
    },
    statLabel: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
    },
    emptyMessageContainer: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        alignItems: 'center',
        marginTop: 15,
    },
    emptyMessageText: {
        fontSize: 16,
        fontWeight: '700',
        color: PRIMARY_COLOR,
        marginBottom: 8,
    },
    emptyMessageSubText: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
    }
});
