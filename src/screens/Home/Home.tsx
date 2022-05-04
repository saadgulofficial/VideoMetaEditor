import { View, Text, FlatList, StatusBar, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState, useReducer } from 'react'
import Style from './Style'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Typography, wp } from '../../global'
import { Colors } from '../../res'
import CameraRoll from "@react-native-community/cameraroll";
import { CommonServices } from '../../services'

const Home = () => {
    const [allVideos, setAllVideos] = useState([])
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [loader, setLoader] = useState(false)
    const [hasPermission, setHasPermission] = useState(false)


    const getPhotos = () => {
        const fetchParams: any = {
            first: 50,
            assetType: 'Videos',
            include: ['filename', 'fileSize', 'imageSize', 'playableDuration']
        };
        CameraRoll.getPhotos(fetchParams).then((data) => {
            const videos = data.edges
            console.log(videos)
            // if(videos.length !== 0) {
            //     CommonServices.asyncLoop(
            //         videos.length, (loop) => {
            //             var index = loop.iteration();
            //             var element = videos[index]
            //             allVideos.push(element.node)
            //             forceUpdate()
            //             setLoader(false)
            //             loop.next()
            //         }, () => {
            //             setAllVideos(allVideos)
            //             forceUpdate()
            //         })
            // }
            // else {
            //     setLoader(false)
            //     setAllVideos(allVideos)
            // }
        }).catch((e) => {
            setAllVideos(allVideos)
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
        const cleanup = givePermission()
        return () => cleanup
    }, [])

    return (
        <View style={Style.container}>
            <StatusBar backgroundColor={Colors.white} barStyle='dark-content' />
            <View style={Style.headerContainer}>
                <Text style={{ ...Typography.headingTwo, ...Style.heading }}>
                    VIDEO META EDITOR
                </Text>
                <AntDesign name='search1' size={wp(7)} color={Colors.black} />
            </View>
        </View>
    )
}

export default Home