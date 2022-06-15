import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import Style from './Style'
import { Header, LoaderModal } from '../../components'
import { GSQLite } from '../../services'
import { Animation } from '../../animations'
import { hp, Typography } from '../../global'
import moment from 'moment'
import { useFocusEffect } from '@react-navigation/native';

const ViewClips = ({ route, navigation }) => {
    const { videoDetail } = route.params

    const [loader, setLoader] = useState(true)
    const [loaderMessage, setLoaderMessage] = useState('Loading please wait')
    const [clipsList, setClipsList] = useState([])

    const getData = () => {
        const { image } = videoDetail
        const { filename } = image
        var videoId = filename.trim()
        if(videoDetail.id && videoDetail.id.length !== 0) {
            videoId = videoDetail.id
        }
        var tableName = 'ClipsData'
        var getQuery = {
            query: "SELECT * FROM ClipsData WHERE videoId = ?",
            params: [videoId]
        }
        GSQLite.getData(tableName, getQuery).then((clipsList: any) => {
            setClipsList(clipsList)
            setLoader(false)
        })
            .catch(() => {
                setLoader(false)
            })
    }

    useFocusEffect(
        React.useCallback(() => {
            const clean = getData()
            return () => clean
        }, [])
    );


    const renderEmptyList = () => {
        return (
            <View style={Style.emptyListContainer}>
                <Text style={{ ...Typography.des, ...Style.emptyListText }}>
                    No clips found please add clips to your video first
                </Text>
            </View>
        )
    }

    const onClipPress = (item) => navigation.navigate('ClipDetail', { clipDetail: item })

    const renderClips = ({ item }) => {
        const { uri, startTime, endTime, name, date } = item
        return (
            <TouchableOpacity style={Style.videoItemContainer}
                activeOpacity={0.8}
                onPress={onClipPress.bind(null, item)}
            >
                <View style={Style.videoThumbnailCon}>
                    <Image
                        source={{ uri }}
                        resizeMode='cover'
                        style={Style.videoThumbnail}
                    />
                    <View style={Style.durationContainer}>
                        <Text style={{ ...Typography.reg, ...Style.durationTxt }}>
                            {startTime}  to  {endTime}  Min
                        </Text>
                    </View>
                </View>
                <Text style={{ ...Typography.desTwo, ...Style.videoName }}
                    numberOfLines={1}
                >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                </Text>
                <Text style={{ ...Typography.reg, ...Style.videoDate }}>
                    {moment.unix(date).format('MMMM-DD-YYYY')}
                </Text>

            </TouchableOpacity>
        )
    }
    return (
        <View style={Style.container}>
            <Header
                title="Video Clips"
                back
                navigation={navigation}
            />
            <LoaderModal
                visible={loader}
                message={loaderMessage}
            />
            {!loader &&
                <Animation
                    animation='fadeInDown'
                    style={{ paddingBottom: hp(5) }}
                >
                    <FlatList
                        data={clipsList}
                        renderItem={renderClips}
                        contentContainerStyle={Style.videoListContainer}
                        ListEmptyComponent={renderEmptyList}
                    />
                </Animation>
            }
        </View>
    )
}

export default ViewClips