import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { hp, wp } from '../global'
import { Colors } from '../res'
import AntDesign from 'react-native-vector-icons/AntDesign'
const Header = (props) => {
    const {
        back,
        backText,
        left,
        center,
        title,
        right,
        navigation,
        containerStyle,
    } = props
    const onBackPress = () => navigation.goBack()
    return (
        <View style={
            containerStyle ?
                { ...containerStyle, ...Style.headerContainer }
                : Style.headerContainer}
        >
            <View style={Style.leftContainer}>
                {
                    back ?
                        <TouchableOpacity style={Style.backContainer} activeOpacity={0.5}
                            onPress={onBackPress}
                        >
                            <AntDesign name='left' size={wp(5.5)} color={Colors.black} />
                            <Text style={Style.backText}>{backText ? backText : 'Back'}</Text>
                        </TouchableOpacity>
                        :
                        left
                }
            </View>
            <View style={Style.centerContainer}>
                {
                    title ?
                        <Text style={Style.backText}>{title}</Text>
                        :
                        center
                }
            </View>
            <View style={Style.rightContainer}>
                {right}
            </View>
        </View>
    )
}

export default Header

const Style = StyleSheet.create({
    headerContainer: {
        paddingTop: hp(2),
        paddingBottom: hp(1),
        width: wp(100),
        backgroundColor: Colors.backgroundColor,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0,
        borderBottomColor: Colors.grey4
    },
    leftContainer: {
        paddingHorizontal: wp(2),
        minWidth: wp(30),
        justifyContent: 'center'
    },
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: wp(40)
    },
    rightContainer: {
        paddingHorizontal: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: wp(30)
    },
    backContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    backText: {
        marginTop: hp(-0.2),
        fontSize: wp(5),
        color: Colors.black,
    },
    titleText: {
        fontSize: wp(5.5),
        color: Colors.black
    }
})
