import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Trash2, CheckCircle2, Circle } from 'lucide-react-native';

const Schedule = () => {
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [tag, setTag] = useState('');
    const [deadline, setDeadline] = useState('');
    const [tasks, setTasks] = useState([]);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const loadTasks = async () => {
            const saved = await AsyncStorage.getItem('TASKS');
            if (saved) setTasks(JSON.parse(saved));
        };
        loadTasks();
    }, []);

    const onChangeDate = (event, date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (date) {
            setSelectedDate(date);
            setDeadline(date.toISOString().split('T')[0]);
        }
    };

    const addTask = async () => {
        if (!title || !tag || !deadline) {
            Alert.alert('Error', 'Please fill in title, tag, and deadline');
            return;
        }

        const newTask = {
            id: Date.now().toString(),
            title,
            notes,
            tag,
            deadline,
            isCompleted: false
        };

        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        await AsyncStorage.setItem('TASKS', JSON.stringify(updatedTasks));

        setTitle('');
        setNotes('');
        setTag('');
        setDeadline('');
    };

    const toggleComplete = async (id) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
        );
        setTasks(updatedTasks);
        await AsyncStorage.setItem('TASKS', JSON.stringify(updatedTasks));
    };

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

    const getTagColor = (tag) => {
        switch(tag) {
            case 'Homework': return { bg: '#dbeafe', text: '#1e40af' };
            case 'Exam': return { bg: '#fee2e2', text: '#b91c1c' };
            case 'Project': return { bg: '#f3e8ff', text: '#6b21a8' };
            default: return { bg: '#f3f4f6', text: '#374151' };
        }
    };

    const getDeadlineColor = (taskDate) => {
        const today = new Date().toISOString().split('T')[0];
        if (taskDate === today) return { bg: '#f97316', text: '#fff' }; // Orange for today
        if (taskDate > today) return { bg: '#16a34a', text: '#fff' };   // Green for upcoming
        if (taskDate < today) return { bg: '#ef4444', text: '#fff' };   // Red for overdue
    };

    // Separate tasks by category
    const today = new Date().toISOString().split('T')[0];
    const todaysTasks = tasks.filter(task => task.deadline === today);
    const upcomingTasks = tasks.filter(task => task.deadline > today);
    const overdueTasks = tasks.filter(task => task.deadline < today);

    const renderTasks = (taskArray) => {
        return taskArray.map(task => {
            const tagColor = getTagColor(task.tag);
            const deadlineColor = getDeadlineColor(task.deadline);
            return (
                <View key={task.id} style={styles.taskCard}>
                    <TouchableOpacity onPress={() => toggleComplete(task.id)} style={styles.checkbox}>
                        {task.isCompleted ? (
                            <CheckCircle2 size={24} color="#14b8a6" strokeWidth={1.5} />
                        ) : (
                            <Circle size={24} color="#14b8a6" strokeWidth={1.5} />
                        )}
                    </TouchableOpacity>

                    <View style={styles.taskDetails}>
                        <Text style={[styles.taskTitle, task.isCompleted && styles.completedTitle]}>
                            {task.title}
                        </Text>
                        <Text style={styles.taskNotes}>{task.notes}</Text>
                        <View style={styles.tagDeadlineRow}>
                            <View style={[styles.tag, { backgroundColor: tagColor.bg }]}>
                                <Text style={[styles.tagText, { color: tagColor.text }]}>{task.tag}</Text>
                            </View>
                            <View style={[styles.tag, { backgroundColor: deadlineColor.bg }]}>
                                <Text style={[styles.tagText, { color: deadlineColor.text }]}>{task.deadline}</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => deleteTask(task.id)} style={styles.deleteButton}>
                        <Trash2 size={18} color="#ef4444" strokeWidth={1.5} />
                    </TouchableOpacity>
                </View>
            );
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>Add New Task</Text>

            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Notes"
                value={notes}
                onChangeText={setNotes}
                multiline
            />
            <TextInput
                style={styles.input}
                placeholder="Tag (Homework, Exam, Project)"
                value={tag}
                onChangeText={setTag}
            />

            <TouchableOpacity
                style={[styles.input, { justifyContent: 'center' }]}
                onPress={() => setShowDatePicker(true)}
            >
                <Text style={{ color: deadline ? '#000' : '#9ca3af' }}>
                    {deadline || 'Select Deadline'}
                </Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                />
            )}

            <TouchableOpacity style={styles.button} onPress={addTask}>
                <Text style={styles.buttonText}>Add Task</Text>
            </TouchableOpacity>

            {/* Schedule Overview */}
            {todaysTasks.length > 0 && (
                <>
                    <Text style={styles.sectionHeader}>Today's Tasks</Text>
                    {renderTasks(todaysTasks)}
                </>
            )}
            {upcomingTasks.length > 0 && (
                <>
                    <Text style={styles.sectionHeader}>Upcoming Tasks</Text>
                    {renderTasks(upcomingTasks)}
                </>
            )}
            {overdueTasks.length > 0 && (
                <>
                    <Text style={styles.sectionHeader}>Overdue Tasks</Text>
                    {renderTasks(overdueTasks)}
                </>
            )}
            {tasks.length === 0 && <Text style={{ textAlign: 'center', color: '#9ca3af', marginTop: 20 }}>No tasks yet.</Text>}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#fff', paddingBottom: 50 },
    heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    sectionHeader: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 12, color: '#1f2937' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
    button: { backgroundColor: '#3b82f6', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    taskCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', padding: 16, marginBottom: 12 },
    checkbox: { marginRight: 12 },
    taskDetails: { flex: 1, marginRight: 12 },
    taskTitle: { fontWeight: '600', fontSize: 14, color: '#111827' },
    completedTitle: { textDecorationLine: 'line-through', color: '#9ca3af' },
    taskNotes: { fontSize: 12, color: '#4b5563', marginTop: 4 },
    tagDeadlineRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
    tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    tagText: { fontSize: 11, fontWeight: '600' },
    deleteButton: { padding: 8 }
});

export default Schedule;
