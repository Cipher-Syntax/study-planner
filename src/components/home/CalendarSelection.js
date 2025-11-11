import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarSelection = ({ selectedDate, onDateSelect }) => {
    const today = new Date().toISOString().split('T')[0];

    const handleDayPress = (day) => {
        onDateSelect(day.dateString);
    };

    const markedDate = selectedDate === "all" ? today : selectedDate;

    return (
        <View style={styles.container}>
            <TouchableOpacity style={[
                    styles.allButton,
                    selectedDate === "all" && styles.allButtonSelected
                ]}
                onPress={() => onDateSelect("all")}
            >
                <Text style={[
                    styles.allButtonText,
                    selectedDate === "all" && styles.allButtonTextSelected
                ]}>
                    All Tasks
                </Text>
            </TouchableOpacity>

            <Calendar
                current={today}
                onDayPress={handleDayPress}
                markedDates={{
                    [markedDate]: {
                        selected: true,
                        selectedColor: '#12bab4',
                        selectedTextColor: '#fff',
                    }
                }}
                theme={{
                    todayTextColor: '#12bab4',
                    arrowColor: '#12bab4',
                    selectedDayBackgroundColor: '#12bab4',
                    selectedDayTextColor: '#fff',
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        marginTop: 10 
    },
    allButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#e5e7eb',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 10,
    },
    allButtonSelected: {
        backgroundColor: '#12bab4',
    },
    allButtonText: {
        color: '#374151',
        fontWeight: '600',
    },
    allButtonTextSelected: {
        color: '#fff',
    },
});

export default CalendarSelection;
