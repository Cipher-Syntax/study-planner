import React from 'react';
import { View, Text } from 'react-native';

const About = () => {
    return (
        <View style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff"
        }}>
            <Text className='text-3xl'>About</Text>
        </View>
    )
}

export default About