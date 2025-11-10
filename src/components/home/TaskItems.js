import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Trash2, Edit2, CheckCircle2, Circle } from 'lucide-react-native';
import { MOCK_TASKS } from '@/src/data/mockData';
import CalendarSelection from './CalendarSelection';
import { useRouter } from 'expo-router';

const TaskItems = () => {
    const [tasks, setTasks] = useState(MOCK_TASKS);
    const router = useRouter();

    const toggleComplete = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
        ));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const getTagColor = (tag) => {
        switch(tag) {
            case 'Homework': return { bg: '#dbeafe', text: '#1e40af' };
            case 'Exam': return { bg: '#fee2e2', text: '#b91c1c' };
            case 'Project': return { bg: '#f3e8ff', text: '#6b21a8' };
            default: return { bg: '#f3f4f6', text: '#374151' };
        }
    };

    return (
        <View style={styles.container}>
            <CalendarSelection />
            <View style={styles.header}>
                <Text style={styles.title}>Tasks</Text>
                <TouchableOpacity style={styles.viewAllButton}>
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.tasksList} showsVerticalScrollIndicator={false}>
                {tasks.slice(0, 4).map((task) => {
                    const tagColor = getTagColor(task.tag);

                    return (
                        /**
                         * TODO:
                         * navigate to tasks details
                         * pass paramenters to use
                         */
                        <TouchableOpacity key={task.id} style={styles.taskCard} onPress={() => router.push({pathname: "/taskDetails",})}>
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

                            <View style={styles.taskDetails}>
                                <Text
                                    style={[
                                        styles.taskTitle,
                                        task.isCompleted && styles.completedTitle
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
                            </View>

                            <View style={styles.actionsContainer}>
                                <TouchableOpacity style={styles.editButton}>
                                    <Edit2 size={18} color="#3b82f6" strokeWidth={1.5} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => deleteTask(task.id)}
                                    style={styles.deleteButton}
                                >
                                    <Trash2 size={18} color="#ef4444" strokeWidth={1.5} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        marginTop: 15
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 15,
        // paddingHorizontal: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: 3,
    },
    viewAllButton: {
        backgroundColor: '#14b8a6',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 100,
    },
    viewAllText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: '900',
        letterSpacing: 1,
        fontSize: 12,
    },
    tasksList: {
        flex: 1,
        // paddingHorizontal: 16,
        marginBottom: 50
    },
    taskCard: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkbox: {
        flexShrink: 0,
        marginRight: 12,
    },
    taskDetails: {
        flex: 1,
        marginRight: 12,
    },
    taskTitle: {
        fontWeight: '600',
        fontSize: 14,
        color: '#111827',
    },
    completedTitle: {
        textDecorationLine: 'line-through',
        color: '#9ca3af',
    },
    taskNotes: {
        fontSize: 12,
        color: '#4b5563',
        marginTop: 4,
    },
    tagDeadlineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 8,
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    tagText: {
        fontSize: 11,
        fontWeight: '600',
    },
    deadline: {
        fontSize: 11,
        color: '#6b7280',
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 8,
        flexShrink: 0,
    },
    editButton: {
        padding: 8,
    },
    deleteButton: {
        padding: 8,
    },
});

export default TaskItems;