import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, Alert, Dimensions, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Trash2, CheckCircle2, Circle, Calendar, ChevronDown, Plus } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const PRIMARY_COLOR = '#14b8a6';
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

const Schedule = () => {
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [tag, setTag] = useState('');
    const [deadline, setDeadline] = useState('');
    const [tasks, setTasks] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [isAddingTask, setIsAddingTask] = useState(false);
    const [filterDate, setFilterDate] = useState('');
    const [showFilterDatePicker, setShowFilterDatePicker] = useState(false);

    const loadTasks = async () => {
        const saved = await AsyncStorage.getItem('TASKS');
        if (saved) {
            const loadedTasks = JSON.parse(saved).sort((a, b) => {
                if (a.isCompleted !== b.isCompleted) {
                    return a.isCompleted ? 1 : -1; 
                }
                return new Date(a.deadline) - new Date(b.deadline);
            });
            setTasks(loadedTasks);
        } else {
            setTasks([]);
        }
    };

    useFocusEffect(useCallback(() => {
        loadTasks();
    }, []));

    const onChangeDate = (event, date) => {
        setShowDatePicker(Platform.OS === 'ios' ? true : false);
        if (date) {
            setSelectedDate(date);
            setDeadline(formatDateString(date));
        }
    };

    const addTask = async () => {
        if (!title || !tag || !deadline) {
            Alert.alert('Error', 'Please ensure Title, Tag, and Deadline are set.');
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

        const updatedTasks = [newTask, ...tasks];
        setTasks(updatedTasks);
        await AsyncStorage.setItem('TASKS', JSON.stringify(updatedTasks));

        setTitle('');
        setNotes('');
        setTag('');
        setDeadline('');
        setIsAddingTask(false);
    };

    const toggleComplete = async (id) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
        );
        const sortedTasks = updatedTasks.sort((a, b) => {
            if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
            return new Date(a.deadline) - new Date(b.deadline);
        });

        setTasks(sortedTasks);
        await AsyncStorage.setItem('TASKS', JSON.stringify(sortedTasks));
    };

    const deleteTask = async (id) => {
        Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    const updatedTasks = tasks.filter(task => task.id !== id);
                    setTasks(updatedTasks);
                    await AsyncStorage.setItem('TASKS', JSON.stringify(updatedTasks));
                }
            }
        ]);
    };

    const getTagColor = (tagName) => {
        const tag = DEFAULT_TAGS.find(t => t.name === tagName);
        return tag || { bg: '#f3f4f6', text: '#374151' };
    };

    const getDeadlineStatus = (taskDate) => {
        const today = formatDateString(new Date());
        
        if (taskDate === today) return { label: 'DUE TODAY', bg: '#f97316', text: '#fff' }; // Orange
        if (taskDate > today) return { label: formatDisplayDate(taskDate), bg: '#16a34a', text: '#fff' }; // Green
        if (taskDate < today) return { label: 'OVERDUE', bg: '#ef4444', text: '#fff' }; // Red
        return { label: taskDate, bg: '#f3f4f6', text: '#374151' };
    };

    const onChangeFilterDate = (event, date) => {
        setShowFilterDatePicker(Platform.OS === 'ios' ? true : false);
        if (date) {
            setFilterDate(formatDateString(date));
        }
    };

    const clearFilter = () => {
        setFilterDate('');
    };

    const filteredTasks = tasks.filter(task => 
        !filterDate || task.deadline === filterDate
    );
    
    const todayString = formatDateString(new Date());

    const categorizedTasks = filteredTasks.reduce((acc, task) => {
        if (task.isCompleted) {
            acc.completed.push(task);
        } else if (task.deadline < todayString) {
            acc.overdue.push(task);
        } else if (task.deadline === todayString) {
            acc.today.push(task);
        } else {
            acc.upcoming.push(task);
        }
        return acc;
    }, { overdue: [], today: [], upcoming: [], completed: [] });


    const renderTaskCard = (task) => {
        const tagColor = getTagColor(task.tag);
        const deadlineStatus = getDeadlineStatus(task.deadline);
        
        return (
            <View key={task.id} style={styles.taskCard}>
                <TouchableOpacity onPress={() => toggleComplete(task.id)} style={styles.checkbox}>
                    {task.isCompleted ? (
                        <CheckCircle2 size={24} color={PRIMARY_COLOR} fill={PRIMARY_COLOR} strokeWidth={0} />
                    ) : (
                        <Circle size={24} color={PRIMARY_COLOR} strokeWidth={1.5} />
                    )}
                </TouchableOpacity>

                <View style={styles.taskDetails}>
                    <Text style={[styles.taskTitle, task.isCompleted && styles.completedTitle]}>
                        {task.title}
                    </Text>
                    {task.notes ? (
                         <Text style={styles.taskNotes} numberOfLines={1}>{task.notes}</Text>
                    ) : null}
                    
                    <View style={styles.tagDeadlineRow}>
                        <View style={[styles.tag, { backgroundColor: tagColor.bg }]}>
                            <Text style={[styles.tagText, { color: tagColor.text }]}>{task.tag}</Text>
                        </View>
                        <View style={[styles.tag, { backgroundColor: deadlineStatus.bg }]}>
                            <Text style={[styles.tagText, { color: deadlineStatus.text }]}>{deadlineStatus.label}</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity onPress={() => deleteTask(task.id)} style={styles.deleteButton}>
                    <Trash2 size={18} color="#ef4444" strokeWidth={1.5} />
                </TouchableOpacity>
            </View>
        );
    };

    const renderSection = (title, tasks) => {
        if (tasks.length === 0) return null;
        return (
            <View>
                <Text style={styles.sectionHeader}>{title}</Text>
                {tasks.map(renderTaskCard)}
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            
            <ScrollView contentContainerStyle={styles.container}>
                
                <Text style={styles.pageTitle}>🗓️ Task Schedule</Text>
  
                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setShowFilterDatePicker(true)}
                    >
                        <Calendar size={18} color={PRIMARY_COLOR} />
                        <Text style={styles.filterText}>
                            {filterDate ? formatDisplayDate(filterDate) : 'Filter by Date'}
                        </Text>
                        <ChevronDown size={14} color={PRIMARY_COLOR} />
                    </TouchableOpacity>
                    
                    {filterDate ? (
                        <TouchableOpacity style={styles.clearFilterButton} onPress={clearFilter}>
                            <Text style={styles.clearFilterText}>Clear Filter</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>

                {showFilterDatePicker && (
                    <DateTimePicker
                        value={new Date(filterDate || Date.now())}
                        mode="date"
                        display="default"
                        onChange={onChangeFilterDate}
                    />
                )}
                
                <View style={{ marginTop: 10 }}>
                    {filterDate && filteredTasks.length === 0 ? (
                        <Text style={styles.emptyText}>No tasks found for {formatDisplayDate(filterDate)}.</Text>
                    ) : (
                        <>
                            {renderSection('Overdue', categorizedTasks.overdue)}
                            {renderSection("Today's Focus", categorizedTasks.today)}
                            {renderSection('Upcoming', categorizedTasks.upcoming)}
                            {renderSection('Completed', categorizedTasks.completed)}
                            
                            {tasks.length === 0 && (
                                <Text style={styles.emptyText}>Tap the (+) button to add your first task!</Text>
                            )}
                        </>
                    )}
                </View>

            </ScrollView>

            {isAddingTask && (
                <View style={styles.addTaskForm}>
                    <Text style={styles.formHeader}>Create New Task</Text>
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Task Title (Required)"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={[styles.input, { height: 60 }]}
                        placeholder="Notes (Optional)"
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                    />

                    <Text style={styles.inputLabel}>Task Type (Tag):</Text>
                    <TagSelector currentTag={tag} setTag={setTag} />

                    <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Calendar size={18} color={deadline ? PRIMARY_COLOR : '#9ca3af'} />
                        <Text style={{ color: deadline ? '#1f2937' : '#9ca3af', marginLeft: 10, fontWeight: '500' }}>
                            {deadline ? `Deadline: ${formatDisplayDate(deadline)}` : 'Select Deadline'}
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

                    <TouchableOpacity style={styles.submitButton} onPress={addTask}>
                        <Text style={styles.submitButtonText}>SAVE TASK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 10 }} onPress={() => setIsAddingTask(false)}>
                        <Text style={{ textAlign: 'center', color: '#6b7280' }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}
            {!isAddingTask && (
                <TouchableOpacity 
                    style={styles.fab} 
                    onPress={() => setIsAddingTask(true)}
                >
                    <Plus size={30} color="#fff" />
                </TouchableOpacity>
            )}

        </View>
    );
};

export default Schedule;


const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 100, 
        backgroundColor: '#f9fafb',
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: PRIMARY_COLOR,
        marginBottom: 20,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 25,
        marginBottom: 10,
        color: '#1f2937',
    },
    emptyText: {
        textAlign: 'center',
        color: '#9ca3af',
        marginTop: 30,
        fontSize: 16,
        padding: 20,
    },
    taskCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        borderLeftWidth: 5,
        borderLeftColor: PRIMARY_COLOR,
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
        marginRight: 10,
    },
    taskTitle: {
        fontWeight: '700',
        fontSize: 16,
        color: '#111827',
    },
    completedTitle: {
        textDecorationLine: 'line-through',
        color: '#9ca3af',
    },
    taskNotes: {
        fontSize: 13,
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
        borderRadius: 6,
    },
    tagText: {
        fontSize: 11,
        fontWeight: '700',
    },
    deleteButton: {
        padding: 8,
        marginLeft: 5,
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        gap: 10,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: PRIMARY_COLOR,
        flex: 1,
    },
    filterText: {
        flex: 1,
        textAlign: 'center',
        fontWeight: '600',
        color: PRIMARY_COLOR,
    },
    clearFilterButton: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 8,
    },
    clearFilterText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 30,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    addTaskForm: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 15,
    },
    formHeader: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 20,
        color: PRIMARY_COLOR,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        fontSize: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4b5563',
        marginBottom: 5,
    },
    tagSelectorContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 15,
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
        marginBottom: 15,
    },
    submitButton: {
        backgroundColor: PRIMARY_COLOR,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
