import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Trash2, Save } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TaskDetails = () => {
    const params = useLocalSearchParams();
    const router = useRouter();
    const task = params.task ? JSON.parse(params.task) : null;

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState(task?.title || '');
    const [notes, setNotes] = useState(task?.notes || '');
    const [tag, setTag] = useState(task?.tag || '');
    const [deadline, setDeadline] = useState(task?.deadline || '');

    // Load tasks from AsyncStorage
    useEffect(() => {
        const loadTasks = async () => {
            const saved = await AsyncStorage.getItem('TASKS');
            if (saved) setTasks(JSON.parse(saved));
        };
        loadTasks();
    }, []);

    const saveToStorage = async (updatedTasks) => {
        await AsyncStorage.setItem('TASKS', JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
    };

    if (!task) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No task selected</Text>
            </View>
        );
    }

    const handleSave = async () => {
        const updatedTasks = tasks.map(t =>
            t.id === task.id ? { ...t, title, notes, tag, deadline } : t
        );
        await saveToStorage(updatedTasks);
        Alert.alert('Success', 'Task updated!');
        router.back();
    };

    const handleDelete = async () => {
        const updatedTasks = tasks.filter(t => t.id !== task.id);
        await saveToStorage(updatedTasks);
        Alert.alert('Deleted', 'Task has been deleted!');
        router.back();
    };

    const getTagColor = (tag) => {
        switch (tag) {
            case 'Homework': return { bg: '#dbeafe', text: '#1e40af' };
            case 'Exam': return { bg: '#fee2e2', text: '#b91c1c' };
            case 'Project': return { bg: '#f3e8ff', text: '#6b21a8' };
            default: return { bg: '#f3f4f6', text: '#374151' };
        }
    };

    const tagColor = getTagColor(tag);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
            <View style={styles.header}>
                <TextInput style={styles.title} value={title} onChangeText={setTitle} />
                <View style={styles.actions}>
                    <TouchableOpacity onPress={handleSave} style={styles.editButton}>
                        <Save size={20} color="#3b82f6" strokeWidth={1.5} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                        <Trash2 size={20} color="#ef4444" strokeWidth={1.5} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.detailsCard}>
                <Text style={styles.label}>Notes</Text>
                <TextInput style={styles.value} value={notes} onChangeText={setNotes} multiline />

                <Text style={styles.label}>Tag</Text>
                <TextInput style={[styles.value, { backgroundColor: tagColor.bg, color: tagColor.text }]} value={tag} onChangeText={setTag} />

                <Text style={styles.label}>Deadline</Text>
                <TextInput style={styles.value} value={deadline} onChangeText={setDeadline} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: '#9ca3af', fontSize: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 24, fontWeight: '900', color: '#111827', flex: 1, borderBottomWidth: 1, borderColor: '#e5e7eb', paddingVertical: 4 },
    actions: { flexDirection: 'row', gap: 10 },
    editButton: { padding: 8, borderRadius: 8, backgroundColor: '#e0f2fe' },
    deleteButton: { padding: 8, borderRadius: 8, backgroundColor: '#fee2e2' },
    detailsCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
    label: { fontSize: 12, fontWeight: '700', color: '#6b7280', marginTop: 12 },
    value: { fontSize: 14, color: '#111827', marginTop: 4, padding: 8, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8 }
});

export default TaskDetails;
