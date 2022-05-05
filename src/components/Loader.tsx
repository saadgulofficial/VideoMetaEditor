import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { Colors } from '../res'

const Loader = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color={Colors.theme} />
        </View>
    )
}

export default Loader