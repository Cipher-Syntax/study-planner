import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarSelection = () => {
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
        Alert.alert('Selected Date', day.dateString);
    };

    return (
        <View style={styles.container}>
            <Calendar
                current={today}
                onDayPress={handleDayPress}
                markedDates={{
                    [selectedDate]: {
                        selected: true,
                        selectedColor: '#12bab4',
                    },
                    // '2025-11-10': { marked: true, dotColor: '#E74C3C' },
                }}
                theme={{
                    todayTextColor: '#12bab4',
                    arrowColor: '#12bab4',
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
    },
});

export default CalendarSelection;
