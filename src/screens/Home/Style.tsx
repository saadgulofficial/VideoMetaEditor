import { Dimensions, StyleSheet } from 'react-native'
import { wp, hp } from '../../global'
import { Colors } from '../../res'

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
        borderWidth: 0
    },
    videoThumbnailCon: {
        paddingBottom: hp(1),
        marginBottom: hp(1),
        borderRadius: 20
    },
    videoThumbnail: {
        width: '100%',
        height: hp(30),
        borderRadius: 20,
    },
    shadow: {
        shadowColor: Colors.grey0,
        shadowOffset: {
            width: 10,
            height: 10,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 5,
    }
})