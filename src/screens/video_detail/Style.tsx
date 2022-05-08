import { StyleSheet } from 'react-native'
import { hp, wp } from '../../global'
import { Colors, Fonts } from '../../res'

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    heading: {
        alignSelf: 'center',
        textAlign: 'center',
        color: Colors.theme,
        marginBottom: hp(2),
        marginTop: hp(1)
    },
    videoMetaDataCon: {
        borderWidth: 0.7,
        borderColor: Colors.color2,
        marginHorizontal: wp(3),
        marginVertical: hp(1),
        borderRadius: 20,
        paddingVertical: hp(2),
        backgroundColor: Colors.color1,
    },
    fieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(4),
        paddingVertical: hp(0.5),
        marginBottom: hp(2)
    },
    fieldInput: {
        width: wp(65),
        backgroundColor: Colors.white,
        borderRadius: 20,
        paddingVertical: hp(1),
        paddingHorizontal: wp(4),
        color: Colors.grey0,
        fontFamily: Fonts.APPFONT_R
    },
    fieldLabel: {
        width: wp(19),
    },
    dateBtn: {
        width: wp(65),
        backgroundColor: Colors.white,
        borderRadius: 20,
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(4),
    },
    dateTxt: {
        color: Colors.grey0,
        fontFamily: Fonts.APPFONT_R
    }
})