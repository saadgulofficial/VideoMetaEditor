import { View, Text, FlatList, StatusBar, PermissionsAndroid, Image, TouchableOpacity } from 'react-native'
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

const Home = ({ navigation }) => {
    const [videos, setVideos] = useState([])
    const [loader, setLoader] = useState(false)
    const [checkPermission, setCheckPermission] = useState<any>('')
    const [, forceUpdate] = useReducer(x => x + 1, 0);

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

    return (
        <View style={Style.container}>
            <StatusBar backgroundColor={Colors.white} barStyle='dark-content' />
            <View style={Style.headerContainer}>
                <Text style={{ ...Typography.headingTwo, ...Style.heading }}>
                    VIDEO META EDITOR
                </Text>
                <AntDesign name='search1' size={wp(7)} color={Colors.black} />
            </View>
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
                    <FlatList
                        data={videos}
                        renderItem={renderVideos}
                        contentContainerStyle={Style.videoListContainer}
                    />
            }
        </View>
    )
}

export default Home