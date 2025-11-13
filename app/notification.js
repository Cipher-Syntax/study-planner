import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AlertTriangle, Trash2, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const DANGER_COLOR = '#ef4444';
const WARNING_BG = '#fee2e2';
const BORDER_COLOR = '#fca5a5';
const TEXT_COLOR = '#991b1b';
const PRIMARY_COLOR = '#14b8a6';

const Notification = () => {
    const router = useRouter();
    const [overdueTasks, setOverdueTasks] = useState([]);

    const fetchOverdueTasks = async () => {
        const saved = await AsyncStorage.getItem('TASKS');
        if (saved) {
            const allTasks = JSON.parse(saved);
            const today = new Date().toISOString().split('T')[0];
            const overdue = allTasks.filter(t => t.deadline < today && !t.isCompleted);
            setOverdueTasks(overdue);
        } else {
            setOverdueTasks([]);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchOverdueTasks();
        }, [])
    );

    const handleComplete = async (id) => {
        const saved = await AsyncStorage.getItem('TASKS');
        if (saved) {
            const allTasks = JSON.parse(saved);
            const updated = allTasks.map(t =>
                t.id === id ? { ...t, isCompleted: true } : t
            );
            await AsyncStorage.setItem('TASKS', JSON.stringify(updated));
            Alert.alert("Task Completed", "Great job clearing that task!");
            await fetchOverdueTasks();
        }
    };
    
    const handleDelete = (task) => {
        Alert.alert(
            "Delete Task",
            `Are you sure you want to delete "${task.title}"?`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: async () => {
                        const saved = await AsyncStorage.getItem('TASKS');
                        if (saved) {
                            const allTasks = JSON.parse(saved);
                            const updated = allTasks.filter(t => t.id !== task.id);
                            await AsyncStorage.setItem('TASKS', JSON.stringify(updated));
                            await fetchOverdueTasks();
                        }
                    }
                }
            ]
        );
    };

    const getTagColor = (tag) => {
        switch (tag) {
            case 'Homework': return { bg: '#dbeafe', text: '#1e40af' };
            case 'Exam': return { bg: '#f3e8ff', text: '#6b21a8' };
            case 'Project': return { bg: '#fee2e2', text: '#b91c1c' };
            default: return { bg: '#f3f4f6', text: '#374151' };
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            <ScrollView contentContainerStyle={styles.container}>
                
                <Text style={styles.pageTitle}>🚨 Action Required</Text>
                
                <Text style={styles.subHeading}>
                    {overdueTasks.length} task{overdueTasks.length !== 1 ? 's' : ''} {overdueTasks.length > 0 ? 'are' : 'is'} past the deadline. Please review and prioritize.
                </Text>

                {overdueTasks.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <AlertTriangle size={60} color="#9ca3af" />
                        <Text style={styles.emptyText}>All clear! No overdue tasks.</Text>
                        <Text style={styles.emptySubtext}>Keep up the great work on your schedule.</Text>
                    </View>
                ) : (
                    overdueTasks.map(task => {
                        const tagDetails = getTagColor(task.tag);
                        return (
                            <View key={task.id} style={styles.taskCard}>
                                
                                <View style={styles.taskHeader}>
                                    <Text style={styles.taskTitle}>{task.title}</Text>
                                    <TouchableOpacity 
                                        style={styles.viewButton}
                                        onPress={() => router.push({
                                            pathname: "/taskDetails", 
                                            params: { task: JSON.stringify(task) }
                                        })}
                                    >
                                        <Text style={styles.viewText}>View</Text>
                                        <ChevronRight size={16} color={TEXT_COLOR} />
                                    </TouchableOpacity>
                                </View>
                                
                                <View style={styles.detailRow}>
                                    <View style={[styles.tag, { backgroundColor: tagDetails.bg }]}>
                                        <Text style={[styles.tagText, { color: tagDetails.text }]}>{task.tag}</Text>
                                    </View>
                                    <Text style={styles.taskDeadline}>
                                        Deadline: {task.deadline}
                                    </Text>
                                </View>
                                
                                {task.notes ? <Text style={styles.taskNotes} numberOfLines={2}>{task.notes}</Text> : null}
                                

                                <View style={styles.actionRow}>
                                    <TouchableOpacity 
                                        style={styles.completeButton}
                                        onPress={() => handleComplete(task.id)}
                                    >
                                        <CheckCircle2 size={18} color={PRIMARY_COLOR} />
                                        <Text style={styles.completeButtonText}>Mark Complete</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.deleteButton}
                                        onPress={() => handleDelete(task)}
                                    >
                                        <Trash2 size={18} color={TEXT_COLOR} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Notification;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f9fafb',
        paddingBottom: 50
    },
    pageTitle: {
        fontSize: 30,
        fontWeight: '900',
        color: DANGER_COLOR,
        marginBottom: 10,
        textAlign: 'center',
    },
    subHeading: {
        fontSize: 16,
        color: '#4b5563',
        textAlign: 'center',
        marginBottom: 25,
        paddingHorizontal: 10,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    emptyText: {
        color: '#1f2937',
        marginTop: 15,
        fontSize: 18,
        fontWeight: '700',
    },
    emptySubtext: {
        color: '#6b7280',
        marginTop: 5,
        fontSize: 14,
    },
    taskCard: {
        backgroundColor: WARNING_BG,
        borderWidth: 2,
        borderColor: BORDER_COLOR,
        padding: 16,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: DANGER_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    taskTitle: {
        fontWeight: '800',
        fontSize: 18,
        color: TEXT_COLOR,
        flex: 1,
        marginRight: 10,
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: '#fef3c7',
    },
    viewText: {
        fontSize: 12,
        fontWeight: '700',
        color: TEXT_COLOR,
        marginRight: 4,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    tagText: {
        fontSize: 11,
        fontWeight: '700',
    },
    taskDeadline: {
        fontSize: 13,
        color: TEXT_COLOR,
    },
    taskNotes: {
        fontSize: 13,
        color: '#4b5563',
        marginBottom: 15,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: BORDER_COLOR,
        marginTop: 5,
    },
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PRIMARY_COLOR,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
    },
    completeButtonText: {
        color: '#fff',
        fontWeight: '700',
        marginLeft: 8,
        fontSize: 14,
    },
    deleteButton: {
        padding: 8,
        backgroundColor: '#fef3f2',
        borderRadius: 8,
    }
});
