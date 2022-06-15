import { StyleSheet } from 'react-native'
import { hp, wp } from '../../global'
import { Colors, Fonts } from '../../res'

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    videoListContainer: {
        paddingHorizontal: wp(3),
    },
    emptyListContainer: {
        height: hp(50),
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyListText: {
        color: Colors.grey3,
        alignSelf: 'center',
        textAlign: 'center',
        width: wp(70)
    },
    videoItemContainer: {
        marginBottom: hp(5),
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
    fieldContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: wp(2)
    },
    videoName: {
        marginHorizontal: wp(1),
        width: wp(80),
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
        backgroundColor: Colors.blackRGBA50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    durationTxt: {
        color: Colors.white,
        fontFamily: Fonts.APPFONT_M
    },
    threeDotCon: {
        paddingHorizontal: wp(3),
        paddingVertical: hp(1)
    }
})