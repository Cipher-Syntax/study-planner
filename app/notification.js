import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AlertCircle, Trash2 } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';

const Notification = () => {
    const [overdueTasks, setOverdueTasks] = useState([]);

    const fetchOverdueTasks = async () => {
        const saved = await AsyncStorage.getItem('TASKS');
        if (saved) {
            const allTasks = JSON.parse(saved);
            const today = new Date().toISOString().split('T')[0];
            const overdue = allTasks.filter(t => t.deadline < today && !t.isCompleted);
            setOverdueTasks(overdue);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchOverdueTasks();
        }, [])
    );

    const handleDelete = async (id) => {
        const saved = await AsyncStorage.getItem('TASKS');
        if (saved) {
            const allTasks = JSON.parse(saved);
            const updated = allTasks.filter(t => t.id !== id);
            await AsyncStorage.setItem('TASKS', JSON.stringify(updated));
            await fetchOverdueTasks(); // refresh list after delete
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>Overdue Tasks</Text>

            {overdueTasks.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <AlertCircle size={50} color="#9ca3af" />
                    <Text style={styles.emptyText}>No overdue tasks 🎉</Text>
                </View>
            ) : (
                overdueTasks.map(task => (
                    <View key={task.id} style={styles.taskCard}>
                        <View style={styles.taskHeader}>
                            <Text style={styles.taskTitle}>{task.title}</Text>
                            <TouchableOpacity onPress={() => handleDelete(task.id)}>
                                <Trash2 size={18} color="#dc2626" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.taskTag}>Tag: {task.tag}</Text>
                        <Text style={styles.taskDeadline}>Deadline: {task.deadline}</Text>
                        {task.notes ? <Text style={styles.taskNotes}>{task.notes}</Text> : null}
                    </View>
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
        paddingBottom: 50
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center'
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40
    },
    emptyText: {
        color: '#9ca3af',
        marginTop: 10,
        fontSize: 16,
        textAlign: 'center'
    },
    taskCard: {
        backgroundColor: '#fee2e2',
        borderWidth: 1,
        borderColor: '#fca5a5',
        padding: 14,
        borderRadius: 8,
        marginBottom: 12
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    taskTitle: {
        fontWeight: '700',
        fontSize: 16,
        color: '#991b1b'
    },
    taskTag: {
        fontSize: 13,
        color: '#7f1d1d',
        marginTop: 4
    },
    taskDeadline: {
        fontSize: 13,
        color: '#7f1d1d',
        marginTop: 2
    },
    taskNotes: {
        fontSize: 12,
        color: '#4b5563',
        marginTop: 4
    }
});


export default Notification;
