import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';

const PRIMARY_COLOR = '#12bab4';

const CalendarSelection = ({ selectedDate, onDateSelect }) => {
    const today = new Date().toISOString().split('T')[0];

    const handleDayPress = (day) => {
        onDateSelect(day.dateString);
    };

    const markedDates = {
        [today]: { 
            dotColor: PRIMARY_COLOR,
            marked: true, 
        },
        [selectedDate]: {
            selected: true,
            selectedColor: PRIMARY_COLOR,
            selectedTextColor: '#fff',
            ...(selectedDate === today && { selectedColor: PRIMARY_COLOR, selectedTextColor: '#fff' })
        },
    };

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
                    View All Tasks
                </Text>
            </TouchableOpacity>

            <View style={styles.calendarWrapper}>
                <Calendar
                    current={today}
                    onDayPress={handleDayPress}
                    markedDates={markedDates}
                    enableSwipeMonths={true}
                    theme={{
                        backgroundColor: '#fff',
                        calendarBackground: '#fff',
                        textSectionTitleColor: '#b6c1cd',
                        selectedDayBackgroundColor: PRIMARY_COLOR,
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: PRIMARY_COLOR,
                        dayTextColor: '#2d4150',
                        textDisabledColor: '#d9e1e8',
                        dotColor: PRIMARY_COLOR,
                        selectedDotColor: '#ffffff',
                        arrowColor: PRIMARY_COLOR,
                        monthTextColor: '#1f2937',
                        textMonthFontWeight: '800',
                        textDayHeaderFontWeight: '600',
                    }}
                />
            </View>
        </View>
    );
};

export default CalendarSelection;

const styles = StyleSheet.create({
    container: { 
        marginBottom: 20 
    },
    calendarWrapper: {
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { 
            width: 0, 
            height: 1 
            
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    allButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#e5e7eb',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 25,
        marginBottom: 15,
    },
    allButtonSelected: {
        backgroundColor: PRIMARY_COLOR,
    },
    allButtonText: {
        color: '#374151',
        fontWeight: '700',
        fontSize: 14,
    },
    allButtonTextSelected: {
        color: '#fff',
    },
});
