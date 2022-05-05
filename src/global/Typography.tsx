import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '../res'
import { wp } from './Scalling'
export default StyleSheet.create({
    heading: {
        fontSize: wp(5),
        color: Colors.black,
        fontFamily: Fonts.APPFONT_B
    },
    headingTwo: {
        fontSize: wp(5.5),
        color: Colors.black,
        fontFamily: Fonts.APPFONT_B
    },
    extraSmall: {
        fontSize: wp(2.5),
        color: Colors.black,
        fontFamily: Fonts.APPFONT_R
    },
    small: {
        fontSize: wp(3),
        color: Colors.black,
        fontFamily: Fonts.APPFONT_R
    },
    reg: {
        fontSize: wp(3.5),
        color: Colors.black,
        fontFamily: Fonts.APPFONT_R
    },
    des: {
        fontSize: wp(4),
        color: Colors.black,
        fontFamily: Fonts.APPFONT_M
    },
    desTwo: {
        fontSize: wp(4.5),
        color: Colors.black,
        fontFamily: Fonts.APPFONT_M
    }
})