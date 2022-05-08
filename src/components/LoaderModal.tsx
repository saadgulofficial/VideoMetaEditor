import React from 'react'
import { Text, ActivityIndicator, TouchableOpacity, Modal, StyleSheet } from 'react-native'
import { Animation } from '../animations'
import { hp, wp } from '../global'
import { Colors, Fonts } from '../res'

const LoaderModal = (props) => {
    const {
        visible = false,
        dimLights = 0.5,
        message = 'Loading Please wait...',
        onClose,
    } = props
    return (
        <Modal
            transparent={true}
            animationType='fade'
            visible={visible}
            onDismiss={onClose}
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <TouchableOpacity style={{
                ...Style.container,
                backgroundColor: `rgba(0,0,0,${dimLights})`
            }}
                activeOpacity={1}
            >
                <Animation
                    animation='zoomIn'
                    style={Style.subContainer}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={Style.loaderContentContainer}
                    >
                        <Text style={Style.text}>{message}</Text>
                        <ActivityIndicator color={Colors.theme} size='large' />
                    </TouchableOpacity>
                </Animation>
            </TouchableOpacity>
        </Modal>
    )
}

export default LoaderModal


const Style = StyleSheet.create({

    container: {
        flex: 1
    },
    subContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    loaderContentContainer: {
        width: wp(85),
        alignSelf: 'center',
        backgroundColor: Colors.white,
        paddingVertical: hp(2),
        paddingHorizontal: wp(3),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        borderWidth: 0,
        width: wp(65),
        fontSize: wp(5),
        color: Colors.black,
        fontFamily: Fonts.APPFONT_M,
        marginRight: wp(3),
    }
})
