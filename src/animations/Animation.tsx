import React from 'react'
import * as Animatable from 'react-native-animatable';
import { StyleSheet } from 'react-native'

const Animation = (props) => {
    const {
        animation = 'fadeInUpBig',
        duration = 400,
        style = null
    } = props
    return (
        <Animatable.View
            animation={animation}
            useNativeDriver={true}
            duration={duration}
            style={{ ...Style.container, ...style }}
        >
            {props.children}
        </Animatable.View>
    )
}

export default Animation

const Style = StyleSheet.create({
    container: {}
})


