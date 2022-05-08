import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import React from 'react'

import { hp, wp } from '../global'
import { Colors, Fonts } from '../res';

const GButton = (props) => {
    const {
        text = "",
        containerStyle = null,
        onPress = null
    } = props
    return (
        <TouchableOpacity style={{ ...Style.btnContainer }}
            activeOpacity={0.6}
            onPress={onPress}
        >
            <LinearGradient colors={[Colors.theme, Colors.theme1]}
                style={{ ...Style.btnLinear, ...containerStyle }}
            >
                <Text style={Style.btnTxt}>{text}</Text>
            </LinearGradient>
        </TouchableOpacity>
    )
}

export { GButton }

const Style = StyleSheet.create({
    btnContainer: {
        marginVertical: hp(1),
        marginHorizontal: wp(3)
    },
    btnLinear: {
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: hp(6)
    },
    btnTxt: {
        fontSize: wp(5),
        fontFamily: Fonts.APPFONT_B,
        color: Colors.white
    }
})