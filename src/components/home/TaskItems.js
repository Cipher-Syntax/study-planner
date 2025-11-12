import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Trash2, Edit2, CheckCircle2, Circle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRIMARY_COLOR = '#14b8a6';
const DANGER_COLOR = '#ef4444';

const TaskItems = ({ tasks, setTasks }) => {
    const router = useRouter();

    const getTaskStatusColor = (deadline, isCompleted) => {
        if (isCompleted) return { color: '#9ca3af', border: '#e5e7eb' };

        const today = new Date().toISOString().split('T')[0];
        
        if (deadline < today) return { color: DANGER_COLOR, border: DANGER_COLOR };
        if (deadline === today) return { color: PRIMARY_COLOR, border: PRIMARY_COLOR };
        
        return { color: '#3b82f6', border: '#3b82f6' };
    };

    const toggleComplete = async (id) => {
        const allTasksJson = await AsyncStorage.getItem('TASKS');
        const allTasks = allTasksJson ? JSON.parse(allTasksJson) : [];

        const updatedTasks = allTasks.map(task =>
            task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
        );
        
       
        const sortedTasks = updatedTasks.sort((a, b) => {
            if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
            return new Date(a.deadline) - new Date(b.deadline);
        });

        await AsyncStorage.setItem('TASKS', JSON.stringify(sortedTasks));
        setTasks(sortedTasks);
    };

    const deleteTask = (id) => {
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: async () => {

                    const allTasks = JSON.parse(await AsyncStorage.getItem('TASKS'));
                    const updatedTasks = allTasks.filter(task => task.id !== id);
                    
                    setTasks(tasks.filter(task => task.id !== id));
                    await AsyncStorage.setItem('TASKS', JSON.stringify(updatedTasks));
                }}
            ]
        );
    };

    const getTagColor = (tag) => {
        switch (tag) {
            case 'Homework': return { bg: '#dbeafe', text: '#1e40af' };
            case 'Exam': return { bg: '#fee2e2', text: '#b91c1c' };
            case 'Project': return { bg: '#f3e8ff', text: '#6b21a8' };
            default: return { bg: '#f3f4f6', text: '#374151' };
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.listTitle}>
                {tasks.length > 0 ? "Filtered Tasks" : "Nothing Scheduled"}
            </Text>
            
            {tasks.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>
                        No tasks found for the selected date. Add a new task in the Schedule tab!
                    </Text>
                </View>
            ) : (
                tasks.map((task) => {
                    const tagColor = getTagColor(task.tag);
                    const status = getTaskStatusColor(task.deadline, task.isCompleted);
                    
                    return (
                        <View 
                            key={task.id} 
                            style={[
                                styles.taskCard, 
                                { borderLeftColor: status.border, opacity: task.isCompleted ? 0.7 : 1 }
                            ]}
                        >
                            <TouchableOpacity
                                onPress={() => toggleComplete(task.id)}
                                style={styles.checkbox}
                            >
                                {task.isCompleted ? (
                                    <CheckCircle2 size={24} color={PRIMARY_COLOR} fill={PRIMARY_COLOR} strokeWidth={0} />
                                ) : (
                                    <Circle size={24} color={PRIMARY_COLOR} strokeWidth={1.5} />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.taskDetails}
                                onPress={() =>
                                    router.push({
                                        pathname: "/taskDetails",
                                        params: { task: JSON.stringify(task) },
                                    })
                                }
                            >
                                <Text
                                    style={[
                                        styles.taskTitle,
                                        task.isCompleted && styles.completedTitle,
                                    ]}
                                >
                                    {task.title}
                                </Text>
                                {task.notes ? (
                                    <Text style={styles.taskNotes} numberOfLines={1}>{task.notes}</Text>
                                ) : null}
                                
                                <View style={styles.tagDeadlineRow}>
                                    <View style={[styles.tag, { backgroundColor: tagColor.bg }]}>
                                        <Text style={[styles.tagText, { color: tagColor.text }]}>
                                            {task.tag}
                                        </Text>
                                    </View>
                                    <Text style={[styles.deadline, { color: status.color }]}>
                                        {task.deadline}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <View style={styles.actionsContainer}>
                                <TouchableOpacity
                                    onPress={() => router.push({
                                        pathname: "/taskDetails",
                                        params: { task: JSON.stringify(task) },
                                    })}
                                    style={styles.actionButton}
                                >
                                    <Edit2 size={18} color="#3b82f6" strokeWidth={1.5} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => deleteTask(task.id)}
                                    style={styles.actionButton}
                                >
                                    <Trash2 size={18} color={DANGER_COLOR} strokeWidth={1.5} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })
            )}
        </View>
    );
};

export default TaskItems;

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        marginTop: 15,
        marginBottom: 30,
    },
    listTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1f2937',
        marginBottom: 15,
    },
    emptyState: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    emptyText: {
        textAlign: "center", 
        color: "#6b7280", 
        fontSize: 14,
    },
    taskCard: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        borderRadius: 12, 
        borderWidth: 1, 
        borderColor: '#e5e7eb', 
        padding: 16, 
        marginBottom: 10,
        borderLeftWidth: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    checkbox: { 
        marginRight: 15,
        padding: 5,
    },
    taskDetails: { 
        flex: 1, 
        marginRight: 15,
    },
    taskTitle: { 
        fontWeight: '700', 
        fontSize: 15, 
        color: '#111827' 
    },
    completedTitle: { 
        textDecorationLine: 'line-through', 
        color: '#9ca3af' 
    },
    taskNotes: { 
        fontSize: 12, 
        color: '#4b5563', 
        marginTop: 4 
    },
    tagDeadlineRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 8, 
        gap: 8 
    },
    tag: { 
        paddingHorizontal: 8, 
        paddingVertical: 4, 
        borderRadius: 6,
    },
    tagText: { 
        fontSize: 11, 
        fontWeight: '700' 
    },
    deadline: { 
        fontSize: 12, 
        fontWeight: '600',
        marginLeft: 4, 
    },
    actionsContainer: { 
        flexDirection: 'row', 
        gap: 0,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
    },
    actionButton: { 
        padding: 10, 
    }
});
