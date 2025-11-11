import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Trash2, Edit2, CheckCircle2, Circle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TaskItems = ({ tasks, setTasks }) => {
    const router = useRouter();

    // Toggle completion status
    const toggleComplete = async (id) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
        );
        setTasks(updatedTasks);
        await AsyncStorage.setItem('TASKS', JSON.stringify(updatedTasks));
    };

    // Delete a task with confirmation
    const deleteTask = (id) => {
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: async () => {
                    const updatedTasks = tasks.filter(task => task.id !== id);
                    setTasks(updatedTasks);
                    await AsyncStorage.setItem('TASKS', JSON.stringify(updatedTasks));
                }}
            ]
        );
    };

    // Tag colors
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
            <ScrollView style={styles.tasksList} showsVerticalScrollIndicator={false}>
                {tasks.length === 0 ? (
                    <Text style={{ textAlign: "center", color: "#9ca3af", marginTop: 20 }}>
                        No tasks for this date.
                    </Text>
                ) : (
                    tasks.map((task) => {
                        const tagColor = getTagColor(task.tag);
                        return (
                            <View key={task.id} style={styles.taskCard}>
                                {/* Checkbox */}
                                <TouchableOpacity
                                    onPress={() => toggleComplete(task.id)}
                                    style={styles.checkbox}
                                >
                                    {task.isCompleted ? (
                                        <CheckCircle2 size={24} color="#14b8a6" strokeWidth={1.5} />
                                    ) : (
                                        <Circle size={24} color="#14b8a6" strokeWidth={1.5} />
                                    )}
                                </TouchableOpacity>

                                {/* Task details */}
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
                                    <Text style={styles.taskNotes}>{task.notes}</Text>
                                    <View style={styles.tagDeadlineRow}>
                                        <View style={[styles.tag, { backgroundColor: tagColor.bg }]}>
                                            <Text style={[styles.tagText, { color: tagColor.text }]}>
                                                {task.tag}
                                            </Text>
                                        </View>
                                        <Text style={styles.deadline}>{task.deadline}</Text>
                                    </View>
                                </TouchableOpacity>

                                {/* Actions */}
                                <View style={styles.actionsContainer}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            router.push({
                                                pathname: "/taskDetails",
                                                params: { task: JSON.stringify(task) },
                                            })
                                        }
                                        style={styles.editButton}
                                    >
                                        <Edit2 size={18} color="#3b82f6" strokeWidth={1.5} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => deleteTask(task.id)}
                                        style={styles.deleteButton}
                                    >
                                        <Trash2 size={18} color="#ef4444" strokeWidth={1.5} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    tasksList: { flex: 1, marginBottom: 50 },
    taskCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', padding: 16, marginBottom: 12 },
    checkbox: { marginRight: 12 },
    taskDetails: { flex: 1, marginRight: 12 },
    taskTitle: { fontWeight: '600', fontSize: 14, color: '#111827' },
    completedTitle: { textDecorationLine: 'line-through', color: '#9ca3af' },
    taskNotes: { fontSize: 12, color: '#4b5563', marginTop: 4 },
    tagDeadlineRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
    tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    tagText: { fontSize: 11, fontWeight: '600' },
    deadline: { fontSize: 11, color: '#6b7280' },
    actionsContainer: { flexDirection: 'row', gap: 8 },
    editButton: { padding: 8 },
    deleteButton: { padding: 8 }
});

export default TaskItems;
