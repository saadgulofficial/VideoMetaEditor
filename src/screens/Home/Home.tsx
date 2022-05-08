import { View, Text, FlatList, StatusBar, PermissionsAndroid, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState, useReducer } from 'react'
import Style from './Style'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { hp, Typography, wp } from '../../global'
import { Colors } from '../../res'
import CameraRoll from "@react-native-community/cameraroll";
import { useFocusEffect } from '@react-navigation/native';
import { CommonServices, GSQLite } from '../../services'
import moment from 'moment'
import { Loader, LoaderModal } from '../../components'
import _ from 'lodash'
import { Animation } from '../../animations'


const Home = ({ navigation }) => {
    const [search, setSearch] = useState('')
    const [videos, setVideos] = useState([])
    const [videosTemp, setVideosTemp] = useState([])
    const [loader, setLoader] = useState(false)
    const [checkPermission, setCheckPermission] = useState<any>('')
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [showSearchBar, setShowSearchBar] = useState(false)

    const onPressSearchIcon = () => setShowSearchBar(true)
    const onCancelPress = () => {
        setShowSearchBar(false)
        setSearch('')
        setVideos(videosTemp)
    }

    const getData = async (data) => {
        await GSQLite.openDataBase().then(() => {
            var tableName = 'MetaData'
            var getQuery = {
                query: "SELECT * FROM MetaData",
                params: []
            }
            GSQLite.getData(tableName, getQuery).then((videosListFromDb: any) => {
                if(videosListFromDb.length === 0) {
                    setVideos(data)
                    setVideosTemp(data)
                    setLoader(false)
                }
                else {
                    var videosArray = []
                    CommonServices.asyncLoop(
                        data.length, (loop) => {
                            var index = loop.iteration();
                            var element = data[index].node
                            videosListFromDb.forEach(dbElement => {
                                if(dbElement.id === element.image.filename.trim()) {
                                    var { date, name } = dbElement
                                    if(data.length !== 0) {
                                        element.timestamp = date
                                    }
                                    if(name.length !== 0) {
                                        element.image.filename = name
                                    }
                                    element.dbData = dbElement
                                }
                            });
                            element = { node: element }
                            videosArray.push(element)
                            loop.next()
                        }, () => {
                            setVideos(videosArray)
                            setVideosTemp(videosArray)
                            forceUpdate()
                            setLoader(false)
                        })
                }
            })
                .catch(() => { setLoader(false) })
        })
    }
    const getPhotos = () => {
        const fetchParams: any = {
            first: 30,
            assetType: 'Videos',
            include: ['filename', 'fileSize', 'imageSize', 'playableDuration']
        };
        CameraRoll.getPhotos(fetchParams).then((data: any) => {
            getData(data.edges)
        }).catch((e) => {
            setVideos(videos)
            setVideosTemp(videos)
            setLoader(false)
            console.log('error while fetching videos from gallery =>', e);
        });
    }

    async function hasAndroidPermission() {
        return new Promise(async (resolve, reject) => {
            const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
            const hasPermission = await PermissionsAndroid.check(permission);
            if(hasPermission) {
                resolve(true)
            }
            const status = await PermissionsAndroid.request(permission);
            resolve(status === 'granted')
        })
    }

    const givePermission = () => {
        hasAndroidPermission().then((permission: any) => {
            if(permission) {
                setCheckPermission(permission)
                setLoader(true)
                getPhotos()
            }
            else {
                setCheckPermission(false)
                setLoader(false)
            }
        }).catch(() => setLoader(false))
    }

    const onChangeSearch = (searchTxt) => {
        setSearch(searchTxt)
        if(searchTxt.length === 0) {
            setVideos(videosTemp)
        }
        const videosTemp2 = videosTemp.filter(function (element: any) {
            const text = searchTxt.toUpperCase()
            const name = element.node.image.filename.toUpperCase()
            return name.includes(text)
        }).map(function (item: any) {
            return item
        })
        setVideos(videosTemp2)
    }
    useFocusEffect(
        React.useCallback(() => {
            var unsubscribe = null
            if(videos.length === 0) {
                unsubscribe = givePermission()
            }
            else {
                setLoader(true)
                forceUpdate()
                unsubscribe = getData(videos)
            }
            return () => unsubscribe
        }, [])
    );

    const onVideoPress = (item) => navigation.navigate('VideoDetail', { videoDetail: item })
    const renderVideos = ({ item }) => {
        const { timestamp, image } = item.node
        const { uri, filename, playableDuration } = image
        return (
            <TouchableOpacity style={Style.videoItemContainer}
                activeOpacity={0.8}
                onPress={onVideoPress.bind(null, item.node)}
            >
                <View style={Style.videoThumbnailCon}>
                    <Image
                        source={{ uri }}
                        resizeMode='cover'
                        style={Style.videoThumbnail}
                    />
                    <View style={Style.durationContainer}>
                        <Text style={{ ...Typography.reg, ...Style.durationTxt }}>
                            {moment.utc(moment.duration(playableDuration, "minutes").asMilliseconds()).format("HH:mm")} Min
                        </Text>
                    </View>
                </View>
                <Text style={{ ...Typography.desTwo, ...Style.videoName }}
                    numberOfLines={1}
                >
                    {filename.charAt(0).toUpperCase() + filename.slice(1)}
                </Text>
                <Text style={{ ...Typography.reg, ...Style.videoDate }}>
                    {moment.unix(timestamp).format('MMMM-DD-YYYY')}
                </Text>
            </TouchableOpacity>
        )
    }

    const renderEmptyList = () => {
        return (
            <View style={Style.emptyListContainer}>
                <Text style={{ ...Typography.des, ...Style.emptyListText }}>
                    No videos found please add videos to your device first
                </Text>
            </View>
        )
    }
    return (
        <View style={Style.container}>
            <StatusBar backgroundColor={Colors.white} barStyle='dark-content' />
            {
                !showSearchBar ?
                    <View style={{ ...Style.headerContainer, flexDirection: videos.length !== 0 ? 'row' : 'column' }}>
                        <Text style={{ ...Typography.headingTwo, ...Style.heading, alignSelf: videos.length === 0 ? 'center' : null }}>
                            VIDEO META EDITOR
                        </Text>
                        {
                            videos.length !== 0 &&
                            <AntDesign name='search1' size={wp(7)} color={Colors.black} onPress={onPressSearchIcon} />
                        }
                    </View>
                    :
                    <Animation
                        animation="slideInRight"
                        style={{ paddingBottom: hp(2) }}
                    >
                        <View style={Style.searchBarContainer}>
                            <TextInput
                                value={search}
                                placeholder='Search By name'
                                placeholderTextColor={Colors.grey3}
                                onChangeText={onChangeSearch}
                                style={{ ...Typography.des, ...Style.searchInput }}
                                autoFocus
                            />
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={onCancelPress}
                            >
                                <Text style={{ ...Typography.des, ...Style.cancelTxt }}>Cancel</Text>
                            </TouchableOpacity>

                        </View>
                    </Animation>
            }

            {
                checkPermission === false &&
                <View style={Style.permissionBtnCon}>
                    <TouchableOpacity style={Style.givePermissionBtn}
                        activeOpacity={0.6}
                        onPress={givePermission}
                    >
                        <Text style={{ ...Typography.des }}>
                            Give Permission
                        </Text>
                    </TouchableOpacity>
                    <Text style={{ ...Typography.des, ...Style.givePermissionDes }}>
                        Give permission to access videos from your device
                    </Text>
                </View>
            }
            {
                loader ?
                    <LoaderModal
                        visible={loader}
                    />
                    :
                    <Animation
                        animation='fadeInDown'
                        style={{ paddingBottom: hp(5) }}
                    >
                        <FlatList
                            data={videos}
                            renderItem={renderVideos}
                            contentContainerStyle={Style.videoListContainer}
                            ListEmptyComponent={renderEmptyList}
                        />
                    </Animation>


            }
        </View>
    )
}

export default Home