import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const About = () => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
            
            <Text style={styles.title}>📚 Study Planner Mobile</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>🎯 Goal</Text>
                <Text style={styles.cardText}>
                    Organize your study tasks, assignments, and exams efficiently. Track deadlines,
                    mark tasks as completed, and never miss an important assignment again!
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>⚙️ How It Works</Text>
                <Text style={styles.cardText}>
                    <Text style={styles.bold}>Tasks Tab:</Text> Shows all tasks. Tap to view details like deadline, notes, and tag type.
                </Text>
                <Text style={styles.cardText}>
                    <Text style={styles.bold}>Schedule Tab:</Text> Weekly view of your tasks with date filtering to plan effectively.
                </Text>
                <Text style={styles.cardText}>
                    Mark tasks as completed to visually track progress.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>🎨 Color Tags</Text>
                <View style={styles.tagContainer}>
                    <View style={[styles.tag, { backgroundColor: '#dbeafe' }]}>
                        <Text style={styles.tagText}>Homework</Text>
                    </View>
                    <View style={[styles.tag, { backgroundColor: '#fee2e2' }]}>
                        <Text style={styles.tagText}>Exam</Text>
                    </View>
                    <View style={[styles.tag, { backgroundColor: '#f3e8ff' }]}>
                        <Text style={styles.tagText}>Project</Text>
                    </View>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>👥 Team Credits</Text>
                <Text style={styles.cardText}>
                    Developed by Group 5 to help students manage their study tasks efficiently.
                </Text>
            </View>

            <View style={{ height: 30 }} /> {/* extra spacing at the bottom */}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff'  },
    title: { fontSize: 32, fontWeight: '900', marginBottom: 20, textAlign: 'center', color: '#14b8a6', marginTop: 50 },
    card: { 
        backgroundColor: '#fff', 
        borderRadius: 16, 
        padding: 20, 
        marginBottom: 15, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 3 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 8, 
        elevation: 5,
        marginTop: 20
    },
    cardTitle: { fontSize: 20, fontWeight: '700', marginBottom: 10, color: '#111827' },
    cardText: { fontSize: 14, lineHeight: 22, color: '#4b5563', marginBottom: 6 },
    bold: { fontWeight: '700', color: '#111827' },
    tagContainer: { flexDirection: 'row', gap: 10, marginTop: 8 },
    tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    tagText: { fontWeight: '700', color: '#111827' },
});

export default About;
