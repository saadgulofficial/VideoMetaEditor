import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import Style from './Style'
import { Header, LoaderModal, MessageAlert } from '../../components'
import { GSQLite } from '../../services'
import { Animation } from '../../animations'
import { hp, Typography, wp } from '../../global'
import moment from 'moment'
import { useFocusEffect } from '@react-navigation/native';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import Entypo from 'react-native-vector-icons/Entypo'
import { Colors } from 'react-native/Libraries/NewAppScreen'

const ViewClips = ({ route, navigation }) => {
    const { videoDetail } = route.params

    const [loader, setLoader] = useState(true)
    const [loaderMessage, setLoaderMessage] = useState('Loading please wait')
    const [clipsList, setClipsList] = useState([])

    const [visibleMenu, setVisibleMenu] = useState(false);
    const [visibleMenuId, setVisibleMenuId] = useState('')


    const getData = () => {
        const { image } = videoDetail
        const { filename } = image
        var videoId = filename.replace(/\s/g, '');
        const { dbData } = videoDetail
        if(dbData) {
            videoId = dbData.id
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
    const showMenu = (id) => {
        setVisibleMenu(true)
        setVisibleMenuId(id)
    }

    const hideMenu = () => {
        setVisibleMenu(false)
        setVisibleMenuId('')
    }

    const onDeletePress = (id) => {
        setLoader(true)
        setLoaderMessage('Deleting please wait...')
        const deleteQuery = {
            query: 'DELETE FROM  ClipsData where Id=?',
            params: [id]
        }
        GSQLite.delete(deleteQuery).then(() => {
            MessageAlert('Deleted', 'success')
            getData()
        })
            .catch(() => {
                setLoader(false)
            })
    }

    const onUpdatePress = (item) => navigation.navigate('ClipDetail', { clipDetail: item })

    const renderClips = ({ item }) => {
        const { uri, startTime, endTime, name, date, id } = item
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
                <View style={Style.fieldContainer}>
                    <View>
                        <Text style={{ ...Typography.desTwo, ...Style.videoName }}
                            numberOfLines={1}
                        >
                            {name.charAt(0).toUpperCase() + name.slice(1)}
                        </Text>
                        <Text style={{ ...Typography.reg, ...Style.videoDate }}>
                            {moment.unix(date).format('MMMM-DD-YYYY')}
                        </Text>
                    </View>
                    <Menu
                        visible={visibleMenu && visibleMenuId === id}
                        anchor={
                            <TouchableOpacity style={Style.threeDotCon}
                                onPress={showMenu.bind(null, id)}
                                activeOpacity={0.8}
                            >
                                <Entypo name='dots-three-vertical' size={wp(5)} color={Colors.black} />
                            </TouchableOpacity>
                        }
                        onRequestClose={hideMenu}
                    >
                        <MenuItem onPress={onDeletePress.bind(null, id)}>Delete</MenuItem>
                        <MenuItem onPress={onUpdatePress.bind(null, item)}>Update</MenuItem>
                    </Menu>
                </View>
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