import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const BRAND_COLOR = '#06b6d4';

const About = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

                <Text style={styles.appTitle}>Study Planner Mobile 🚀</Text>

                <View style={styles.heroCard}>
                    <Feather name="target" size={28} color="#fff" style={{ marginBottom: 10 }} />
                    <Text style={styles.heroTitle}>Your Academic Edge</Text>
                    <Text style={styles.heroText}>
                        Organize your study tasks, assignments, and exams efficiently. Track deadlines,
                        and never miss an important submission again!
                    </Text>
                </View>

                <Text style={styles.sectionHeader}>How It Works</Text>
                <View style={styles.infoCard}>
                    <View style={styles.featureItem}>
                        <Feather name="list" size={20} color={BRAND_COLOR} />
                        <View style={styles.featureTextContainer}>
                            <Text style={styles.featureTitle}>Tasks Tab</Text>
                            <Text style={styles.featureDescription}>View all tasks, tap for details, notes, and progress tracking.</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.featureItem}>
                        <Feather name="calendar" size={20} color={BRAND_COLOR} />
                        <View style={styles.featureTextContainer}>
                            <Text style={styles.featureTitle}>Schedule Tab</Text>
                            <Text style={styles.featureDescription}>Weekly overview with date filtering to plan your study load.</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.featureItem}>
                        <Feather name="check-circle" size={20} color={BRAND_COLOR} />
                        <View style={styles.featureTextContainer}>
                            <Text style={styles.featureTitle}>Progress Tracker</Text>
                            <Text style={styles.featureDescription}>Mark tasks as completed to visually monitor your work.</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionHeader}>Task Categories</Text>
                <View style={styles.tagCard}>
                    <Tag name="Homework" color="#dbeafe" />
                    <Tag name="Exam" color="#fecaca" />
                    <Tag name="Project" color="#f3e8ff" />
                </View>

                <Text style={styles.sectionHeader}>Team</Text>
                <View style={[styles.infoCard, { marginBottom: 40 }]}>
                    <View style={styles.featureItem}>
                        <MaterialCommunityIcons name="group" size={20} color={BRAND_COLOR} />
                        <View style={styles.featureTextContainer}>
                            <Text style={styles.featureTitle}>Development Team</Text>
                            <Text style={styles.featureDescription}>Developed by **Group 5** to empower students with efficient planning.</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const Tag = ({ name, color }) => (
    <View style={styles.tagWrapper}>
        <View style={[styles.tagPill, { backgroundColor: color }]}>
            <Text style={styles.tagText}>{name}</Text>
        </View>
    </View>
);

export default About;

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#fff' 
    },
    contentContainer: { 
        paddingHorizontal: 20, 
        paddingTop: 10 
    },
    appTitle: { 
        fontSize: 28, 
        fontWeight: '900', 
        textAlign: 'center', 
        color: BRAND_COLOR, 
        marginTop: 40,
        marginBottom: 20
    },
    heroCard: {
        backgroundColor: BRAND_COLOR,
        borderRadius: 16,
        padding: 25,
        marginBottom: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { 
            width: 0, 
            height: 5 
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    heroTitle: { 
        fontSize: 22, 
        fontWeight: '700', 
        color: '#fff', 
        marginBottom: 5 
    },
    heroText: { 
        fontSize: 14, 
        lineHeight: 22, 
        color: '#e0f2f1', 
        textAlign: 'center' 
    },

    sectionHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
        marginTop: 15,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingBottom: 5,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    featureTextContainer: { 
        marginLeft: 15, 
        flex: 1 
    },
    featureTitle: { 
        fontSize: 16, 
        fontWeight: '700', 
        color: '#1f2937' 
    },
    featureDescription: { 
        fontSize: 13, 
        color: '#4b5563', 
        marginTop: 3 
    },
    divider: { 
        height: 1, 
        backgroundColor: '#f3f4f6', 
        marginVertical: 2 
    },
    tagCard: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 15,
    },
    tagWrapper: { 
        backgroundColor: '#fff', 
        borderRadius: 8, 
        overflow: 'hidden', 
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    tagPill: { 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        alignSelf: 'flex-start',
    },
    tagText: { 
        fontWeight: '600', 
        color: '#1f2937', 
        fontSize: 13 
    },
});
