import { View, Text } from 'react-native'
import React from 'react'
import Style from './Style'
import { Header, VideoPlayer } from '../../components'

const VideoDetail = ({ route, navigation }) => {
    const { videoDetail } = route.params
    const { image } = videoDetail
    const { filename, uri } = image
    return (
        <View style={Style.container}>
            <Header
                back
                navigation={navigation}
            />
            <VideoPlayer
                uri={uri}
            />
        </View>
    )
}

export default VideoDetail