import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const DashboardGrids = () => {  
    const [selectedPeriod, setSelectedPeriod] = useState('day');

    const grid = [
        { items: 4, name: "Lessons" },
        { items: 6, name: "Tasks" },
        { items: 2, name: "Completed" },
    ]

    return (
        <View style={{ marginTop: 60 }}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginHorizontal: 20,
                }}
            >
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
                    {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
                </Text>

                <View
                    style={{
                        borderWidth: 1,
                        borderColor: "#12bab4",
                        borderRadius: 8,
                        overflow: "hidden",
                        width: 140,
                    }}
                >
                    <Picker
                        selectedValue={selectedPeriod}
                        onValueChange={(value) => setSelectedPeriod(value)}
                        mode="dropdown"
                        style={{ height: 40, color: "#12bab4" }}
                    >
                        <Picker.Item label="Day" value="day" />
                        <Picker.Item label="Week" value="week" />
                        <Picker.Item label="Month" value="month" />
                    </Picker>
                </View>
            </View>

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    paddingVertical: 20,
                }}
            >
                {grid.map((item, index) => (
                    <View
                        key={index}
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#fff",
                            padding: 20,
                            borderRadius: 10,
                            width: 120,
                            height: 150,
                            shadowColor: "#000",
                            shadowOpacity: 0.1,
                            shadowOffset: { width: 0, height: 2 },
                            shadowRadius: 3,
                            elevation: 1.5,
                        }}
                    >
                        <Text style={{ fontSize: 40, fontWeight: "900", color: "#12bab4" }}>
                            {item.items}
                        </Text>
                        <Text style={{ color: "#333" }}>{item.name}</Text>
                    </View>
                ))}
            </View>
        </View>
    );

}

export default DashboardGrids