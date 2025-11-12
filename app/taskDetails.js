import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { Trash2, Save, X, CheckCircle, Clock, Calendar } from 'lucide-react-native'; 
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY_COLOR = '#14b8a6';
const DANGER_COLOR = '#ef4444';
const UPCOMING_COLOR = '#3b82f6';

const DEFAULT_TAGS = [
    { name: 'Homework', bg: '#dbeafe', text: '#1e40af' },
    { name: 'Exam', bg: '#fee2e2', text: '#b91c1c' },
    { name: 'Project', bg: '#f3e8ff', text: '#6b21a8' },
];

const formatDateString = (date) => date.toISOString().split('T')[0];

const formatDisplayDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const TagSelector = ({ currentTag, setTag }) => (
    <View style={styles.tagSelectorContainer}>
        {DEFAULT_TAGS.map(t => (
            <TouchableOpacity
                key={t.name}
                style={[
                    styles.tagPill,
                    { backgroundColor: t.bg },
                    currentTag === t.name && styles.tagPillSelected 
                ]}
                onPress={() => setTag(t.name)}
            >
                <Text style={[styles.tagPillText, { color: t.text }]}>
                    {t.name}
                </Text>
            </TouchableOpacity>
        ))}
    </View>
);


const TaskDetails = () => {
    const params = useLocalSearchParams();
    const router = useRouter();
    const initialTask = params.task ? JSON.parse(params.task) : null;

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState(initialTask?.title || '');
    const [notes, setNotes] = useState(initialTask?.notes || '');
    const [tag, setTag] = useState(initialTask?.tag || '');
    const [deadline, setDeadline] = useState(initialTask?.deadline || '');
    const [isCompleted, setIsCompleted] = useState(initialTask?.isCompleted || false);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date(initialTask?.deadline) || new Date());


    useEffect(() => {
        const loadTasks = async () => {
            const saved = await AsyncStorage.getItem('TASKS');
            if (saved) setTasks(JSON.parse(saved));
        };
        loadTasks();
    }, []);

    const saveToStorage = async (updatedTasks) => {
        const sortedTasks = updatedTasks.sort((a, b) => {
            if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
            return new Date(a.deadline) - new Date(b.deadline);
        });

        await AsyncStorage.setItem('TASKS', JSON.stringify(sortedTasks));
        setTasks(sortedTasks);
    };

    const getStatusDetails = () => {
        const today = formatDateString(new Date());
        
        if (isCompleted) {
            return { icon: <CheckCircle size={20} color={PRIMARY_COLOR} fill={PRIMARY_COLOR} />, text: 'Completed', color: PRIMARY_COLOR };
        }
        if (deadline < today) {
            return { icon: <Clock size={20} color={DANGER_COLOR} />, text: 'Overdue', color: DANGER_COLOR };
        }
        if (deadline === today) {
            return { icon: <Clock size={20} color={PRIMARY_COLOR} />, text: 'Due Today', color: PRIMARY_COLOR };
        }
        return { icon: <Clock size={20} color={UPCOMING_COLOR} />, text: 'Upcoming', color: UPCOMING_COLOR };
    };

    const onChangeDate = (event, date) => {
        setShowDatePicker(Platform.OS === 'ios' ? true : false);
        if (date) {
            setSelectedDate(date);
            setDeadline(formatDateString(date));
        }
    };

    const handleSave = async () => {
        if (!title || !tag || !deadline) {
            Alert.alert('Error', 'Title, Tag, and Deadline are required.');
            return;
        }

        const updatedTasks = tasks.map(t =>
            t.id === initialTask.id ? { ...t, title, notes, tag, deadline, isCompleted } : t
        );
        await saveToStorage(updatedTasks);
        Alert.alert('Success', 'Task updated!');
        router.back();
    };

    const handleToggleComplete = async () => {
        const newStatus = !isCompleted;
        setIsCompleted(newStatus);
        
        const updatedTasks = tasks.map(t =>
            t.id === initialTask.id ? { ...t, isCompleted: newStatus, title, notes, tag, deadline } : t
        );
        await saveToStorage(updatedTasks);
    };

    const handleDelete = () => {
        Alert.alert(
            'Confirm Delete',
            `Are you sure you want to permanently delete "${initialTask.title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: async () => {
                    const updatedTasks = tasks.filter(t => t.id !== initialTask.id);
                    await saveToStorage(updatedTasks);
                    Alert.alert('Deleted', 'Task has been deleted!');
                    router.back();
                }}
            ]
        );
    };

    if (!initialTask) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Task data is missing.</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const statusDetails = getStatusDetails();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
                        <X size={28} color="#4b5563" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Task Details</Text>
                    <View style={styles.statusPill}>
                        {statusDetails.icon}
                        <Text style={[styles.statusText, { color: statusDetails.color }]}>
                            {statusDetails.text}
                        </Text>
                    </View>
                </View>

                <View style={styles.detailsCard}>
                    <Text style={styles.label}>TITLE</Text>
                    <TextInput 
                        style={styles.titleInput} 
                        value={title} 
                        onChangeText={setTitle} 
                        placeholder="Task Title"
                    />
                </View>
                
                <View style={[styles.detailsCard, { marginTop: 15 }]}>
                    
                    <Text style={styles.label}>NOTES</Text>
                    <TextInput 
                        style={[styles.valueInput, styles.notesInput]} 
                        value={notes} 
                        onChangeText={setNotes} 
                        multiline 
                        placeholder="Detailed description or steps"
                    />

                    <Text style={styles.label}>TAG / CATEGORY</Text>
                    <TagSelector currentTag={tag} setTag={setTag} />

                    <Text style={styles.label}>DEADLINE</Text>
                    <TouchableOpacity 
                        style={styles.datePickerButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Calendar size={20} color={PRIMARY_COLOR} />
                        <Text style={styles.dateButtonText}>
                            {deadline ? formatDisplayDate(deadline) : 'Select Deadline'}
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

                    <Text style={styles.label}>STATUS</Text>
                    <TouchableOpacity 
                        style={[
                            styles.completionToggle,
                            { 
                                backgroundColor: isCompleted ? PRIMARY_COLOR : '#f3f4f6', 
                                borderColor: isCompleted ? PRIMARY_COLOR : '#e5e7eb'
                            }
                        ]} 
                        onPress={handleToggleComplete}
                    >
                        <CheckCircle size={20} color={isCompleted ? '#fff' : '#6b7280'} />
                        <Text style={[styles.completionText, { color: isCompleted ? '#fff' : '#6b7280' }]}>
                            {isCompleted ? 'Marked as Completed' : 'Mark as Complete'}
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>

            <View style={styles.fabContainer}>
                <TouchableOpacity 
                    style={[styles.fabButton, { backgroundColor: DANGER_COLOR }]} 
                    onPress={handleDelete}
                >
                    <Trash2 size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.fabButton, { backgroundColor: UPCOMING_COLOR, flex: 1, marginLeft: 10 }]} 
                    onPress={handleSave}
                >
                    <Save size={24} color="#fff" />
                    <Text style={styles.fabText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default TaskDetails;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb'
    },
    emptyText: {
        color: '#9ca3af',
        fontSize: 16,
        marginBottom: 20,
    },
    backButton: {
        padding: 10,
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingTop: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1f2937',
        flex: 1,
        marginLeft: 10,
    },
    backIcon: {
        padding: 5,
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0f2f1',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    statusText: {
        fontSize: 13,
        fontWeight: '700',
        marginLeft: 5,
    },
    detailsCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6b7280',
        marginTop: 15,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    titleInput: {
        fontSize: 24,
        fontWeight: '900',
        color: '#111827',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginBottom: 10,
    },
    valueInput: {
        fontSize: 14,
        color: '#111827',
        padding: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
    },
    notesInput: {
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: 10,
    },
    tagSelectorContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 10,
    },
    tagPill: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    tagPillSelected: {
        borderColor: PRIMARY_COLOR,
    },
    tagPillText: {
        fontWeight: '700',
        fontSize: 13,
    },
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    dateButtonText: {
        color: '#1f2937',
        marginLeft: 10,
        fontWeight: '600',
        fontSize: 15,
    },
    completionToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        borderWidth: 2,
        marginTop: 5,
    },
    completionText: {
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 10,
    },
    fabContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    fabButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 50,
    },
    fabText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 16,
        marginLeft: 10,
    }
});
