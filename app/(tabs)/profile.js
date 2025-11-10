import React from 'react';
import { View, Text } from 'react-native';

const Profile = () => {
    return (
        <View style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff"
        }}>
            <Text className='text-3xl'>Profile</Text>
        </View>
    )
}

export default Profile