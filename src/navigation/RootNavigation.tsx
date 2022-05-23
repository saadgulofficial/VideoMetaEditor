import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    Home, VideoDetail, AddClip
} from '../screens'
import { Platform } from 'react-native';


const Stack = createNativeStackNavigator();
const RootNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='Home'
            >
                <Stack.Group
                    screenOptions={() => ({
                        presentation: Platform.OS === 'android' ? 'modal' : 'card',
                        headerShown: false,
                        gestureEnabled: true,
                    })}
                >
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="VideoDetail" component={VideoDetail} />
                    <Stack.Screen name="AddClip" component={AddClip} />
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default RootNavigation