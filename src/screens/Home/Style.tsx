import { Dimensions, StyleSheet } from 'react-native'
import { wp, hp } from '../../global'
import { Colors, Fonts } from '../../res'

const { width } = Dimensions.get('window')
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    headerContainer: {
        paddingVertical: hp(2),
        paddingHorizontal: wp(3),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    heading: {
        color: Colors.grey0
    },
    videoListContainer: {
        paddingHorizontal: wp(3),
        paddingTop: hp(2)
    },
    videoItemContainer: {
        marginBottom: hp(5)
    },
    videoThumbnailCon: {
        paddingBottom: hp(1),
        borderRadius: 20
    },
    videoThumbnail: {
        width: '100%',
        height: hp(30),
        borderRadius: 20,
    },
    videoName: {
        marginHorizontal: wp(1),
        width: wp(90),
    },
    videoDate: {
        marginHorizontal: wp(1),
        color: Colors.grey0,
        fontFamily: Fonts.APPFONT_R
    },
    durationContainer: {
        borderWidth: 0,
        position: 'absolute',
        paddingHorizontal: wp(2),
        paddingVertical: hp(0.5),
        bottom: hp(1.8),
        right: wp(2),
        borderRadius: 20,
        backgroundColor: Colors.blackRGBA20
    },
    durationTxt: {
        color: Colors.white,
        fontFamily: Fonts.APPFONT_M
    }
})