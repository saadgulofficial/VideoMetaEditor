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
        paddingBottom: hp(10)
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
    videoName: {
        marginHorizontal: wp(1),
        width: wp(90),
    },
    videoDate: {
        marginHorizontal: wp(1),
        color: Colors.grey0,
        fontFamily: Fonts.APPFONT_R
    },
    optionContainer: {
        position: 'absolute',
        top: hp(1),
        right: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionInnerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.1,
        height: width * 0.1 * 1,
        borderRadius: width * 0.1 * 1 / 2,
        backgroundColor: Colors.blackRGBA50
    },
    durationContainer: {
        borderWidth: 0,
        position: 'absolute',
        paddingHorizontal: wp(2),
        paddingVertical: hp(0.5),
        bottom: hp(1.8),
        right: wp(2),
        borderRadius: 20,
        backgroundColor: Colors.blackRGBA50
    },
    durationTxt: {
        color: Colors.white,
        fontFamily: Fonts.APPFONT_M
    },
    permissionBtnCon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: hp(15)
    },
    givePermissionBtn: {
        borderWidth: 1,
        borderColor: Colors.grey4,
        paddingHorizontal: wp(8),
        paddingVertical: hp(1),
        borderRadius: 8
    },
    givePermissionDes: {
        marginTop: hp(2),
        fontFamily: Fonts.APPFONT_R,
        color: Colors.grey2,
        textAlign: 'center',
        alignSelf: 'center',
        width: wp(60)
    },
    searchBarContainer: {
        marginTop: hp(2),
        borderWidth: 0.8,
        borderColor: Colors.color2,
        width: wp(93),
        alignSelf: 'center',
        borderRadius: 20,
        paddingHorizontal: wp(2),
        backgroundColor: Colors.color1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    searchInput: {
        paddingVertical: hp(1),
        fontFamily: Fonts.APPFONT_R,
        color: Colors.black,
        width: wp(73),
    },
    cancelTxt: {
        color: Colors.color3,
        fontFamily: Fonts.APPFONT_R,
        marginRight: wp(1)
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
    clearAllMetaDataBtn: {
        alignSelf: 'flex-start',
        marginLeft: wp(4),
        marginTop: hp(-1),
        marginBottom: hp(2),
        paddingRight: wp(2),
        paddingVertical: hp(1)
    },
    clearAllMetaDataTxt: {
        fontSize: wp(4),
        color: Colors.color3,
    },
    clearRestoreCon: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        paddingRight: hp(4)
    }
})