import { View, Text, FlatList, StatusBar, PermissionsAndroid, Image } from 'react-native'
import React, { useEffect, useState, useReducer } from 'react'
import Style from './Style'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { hp, Typography, wp } from '../../global'
import { Colors } from '../../res'
import CameraRoll from "@react-native-community/cameraroll";
import { CommonServices } from '../../services'

const Home = () => {
    const [videos, setVideos] = useState([
        {
            group_name: "DCIM",
            image: {
                fileSize: 543879,
                filename: "sample-mp4-file-small.mp4",
                height: 240,
                playableDuration: 30,
                uri: "file:///storage/emulated/0/DCIM/sample-mp4-file-small.mp4",
                width: 320,
                location: null,
                modified: 1650208929,
                timestamp: 1650208929,
                type: "video/mp4",
            }
        }
    ])
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [loader, setLoader] = useState(false)
    const [hasPermission, setHasPermission] = useState(false)


    const getPhotos = () => {
        const fetchParams: any = {
            first: 1,
            assetType: 'Videos',
            include: ['filename', 'fileSize', 'imageSize', 'playableDuration']
        };
        CameraRoll.getPhotos(fetchParams).then((data) => {
            data.edges.forEach((element: any) => {

            })
        }).catch((e) => {
            setVideos(videos)
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
        hasAndroidPermission().then((permission) => {
            if(permission) {
                setLoader(true)
                setHasPermission(true)
                getPhotos()
            }
            else {
                setLoader(false)
            }
        }).catch(() => setLoader(false))
    }

    useEffect(() => {
        // const cleanup = givePermission()
        // return () => cleanup
    }, [])

    const renderVideos = ({ item }) => {
        return (
            <View style={Style.videoItemContainer}>
                <View style={{ ...Style.shadow, ...Style.videoThumbnailCon }}>
                    <Image
                        source={{ uri: item.image.uri }}
                        resizeMode='cover'
                        style={Style.videoThumbnail}
                    />
                </View>

            </View>
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
            <FlatList
                data={videos}
                renderItem={renderVideos}
                contentContainerStyle={Style.videoListContainer}
            />
        </View>
    )
}

export default Home