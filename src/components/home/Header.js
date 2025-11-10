import React from 'react';
import { View, Text, Dimensions} from 'react-native';
import { Calendar, Bell } from 'lucide-react-native';
const width = Dimensions.get('window')

const Header = () => {
    const today = new Date();

    const day = today.getDate().toString().padStart(2, "0");
    const month = today.toLocaleString("en-US", { month: "long" });
    const year = today.getFullYear();

    return (
        <View style={{
            width: "100%",
            marginHorizontal: "auto",
            // borderWidth: 2,
            // padding: 20,
        }}>
            <View style={{flexDirection: "row", gap: 10, alignItems: "center"}}>
                <Calendar color="#12bab4" />
                <Text>{`${day}, ${month} ${year}`}</Text>
            </View>

            <View style={{
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
                <View>
                    <Text style={{fontSize: 30, marginTop: 10, fontWeight: 900, letterSpacing: 3}}>Hey, Cipher 👋</Text>
                    <Text>Organizer your tasks, boost your productivity</Text>
                </View>

                <Bell size={30} color="#12bab4"/>
                
            </View>
        </View>
    )
}

export default Header