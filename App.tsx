import React from 'react'
import { RootNavigation } from './src/navigation'
import FlashMessage from "react-native-flash-message";
import { View } from 'react-native'

const App = () => (
  <View style={{ flex: 1 }}>
    <RootNavigation />
    <FlashMessage position="top" />
  </View>
)
export default App
