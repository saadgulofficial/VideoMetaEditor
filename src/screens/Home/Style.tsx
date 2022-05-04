import { StyleSheet } from 'react-native'
import { wp, hp } from '../../global'
import { Colors } from '../../res'

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
    }
})