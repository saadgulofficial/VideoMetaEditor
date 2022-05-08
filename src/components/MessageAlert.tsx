import { StatusBar, View } from 'react-native';
import { showMessage } from "react-native-flash-message";
import { Fonts } from '../res'
import { wp } from '../global'

//Types: 'danger','success','info'
const MessageAlert = (message: any, type) => (
    showMessage({
        message: message,
        type: type,
        titleStyle: { fontFamily: Fonts.APPFONT_M, fontSize: wp(4) },
        duration: 1500,
        autoHide: true,
        statusBarHeight: StatusBar.currentHeight,
        floating: true
    })
)

export default MessageAlert
