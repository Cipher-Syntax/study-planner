import React from 'react';
import { View, Text, Button, StatusBar, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/src/components/home/Header';
import DashboardGrids from '@/src/components/home/DashboardGrids';
import TaskItems from '@/src/components/home/TaskItems';

const Home = () => {
    const router = useRouter();
    return (
        <SafeAreaView style={{backgroundColor: "#fff", flex: 1}}>
            <ScrollView style={{padding: 30}}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff"/>
                <Header />
                {/* <DashboardGrids /> */}
                <TaskItems />
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home