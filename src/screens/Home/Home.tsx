import { View, Text, FlatList, StatusBar, PermissionsAndroid, Image, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useEffect, useState, useReducer } from 'react'
import Style from './Style'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { hp, Typography, wp } from '../../global'
import { Colors } from '../../res'
import CameraRoll from "@react-native-community/cameraroll";
import { useFocusEffect } from '@react-navigation/native';
import { CommonServices, GFileManager, GSQLite } from '../../services'
import moment from 'moment'
import { Loader, LoaderModal, MessageAlert } from '../../components'
import _ from 'lodash'
import { Animation } from '../../animations'
import Entypo from 'react-native-vector-icons/Entypo'
import { Menu, MenuItem } from 'react-native-material-menu';


const Home = ({ navigation }) => {
    const [search, setSearch] = useState('')
    const [videos, setVideos] = useState([])
    const [videosTemp, setVideosTemp] = useState([])
    const [loader, setLoader] = useState(false)
    const [checkPermission, setCheckPermission] = useState<any>('')
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [showSearchBar, setShowSearchBar] = useState(false)
    const [searchLoader, setSearchLoader] = useState(false)
    const [loaderMessage, setLoaderMessage] = useState(' ')

    const [visibleMenu, setVisibleMenu] = useState(false);
    const [visibleMenuId, setVisibleMenuId] = useState('')


    const onPressSearchIcon = () => setShowSearchBar(true)

    const showMenu = (id) => {
        setVisibleMenu(true)
        setVisibleMenuId(id)
    }
    const hideMenu = () => {
        setVisibleMenu(false)
        setVisibleMenuId('')
    }

    const onCancelPress = () => {
        setShowSearchBar(false)
        setSearch('')
        setVideos(videosTemp)
    }

    const saveInFileManager = (data, PATH) => {
        return new Promise((resolve, reject) => {
            const EXT = GFileManager.EXT.ext1
            const { id } = data
            GFileManager.makeDirectory(PATH).then(() => {
                GFileManager.fileExits(`${PATH}/${id}${EXT}`).then((res) => {
                    if(res) {
                        GFileManager.deleteFile(`${PATH}/${id}${EXT}`).then(() => {
                            GFileManager.writeFile(`${PATH}/${id}${EXT}`, data).then(() => {
                                resolve('')
                            }).catch((error) => {
                                resolve('')
                            })
                        }).catch(() => {
                            resolve('')
                        })
                    }
                    else {
                        GFileManager.writeFile(`${PATH}/${id}${EXT}`, data).then(() => {
                            resolve('')
                        }).catch(() => {
                            resolve('')
                        })
                    }
                }).catch(() => {
                    resolve('')
                })
            })
                .catch(() => {
                    resolve('')
                })
        })
    }

    const restoreClips = () => {
        const { EXT, PATHS } = GFileManager
        var tableName = 'ClipsData'
        var getQuery = {
            query: "SELECT * FROM ClipsData",
            params: []
        }
        GSQLite.getData(tableName, getQuery).then((clipsList: any) => {
            clipsList.forEach(element => {
                if(element.id) {
                    GFileManager.readFile(`${PATHS.clipsPathTwo}/${element.id}${EXT.ext1}`)
                        .then(async (fileData: any) => {
                            if(fileData) {
                                await saveInFileManager(fileData, PATHS.clipsPath)
                                setLoaderMessage('Clip Restored')
                            }
                        })
                }
            });
        })
    }

    const mergeFileManagerData = (data, from) => {
        const { EXT, PATHS } = GFileManager
        var videosArray: any = []
        const path = from === 'getData' ? PATHS.videosPath : PATHS.videosPathTwo
        CommonServices.asyncLoop(
            data.length, (loop) => {
                var index = loop.iteration();
                var element = data[index].node
                const { image } = element
                const { filename } = image
                GFileManager.readFile(`${path}/${filename.replace(/\s/g, '')}${EXT.ext1}`)
                    .then(async (fileData: any) => {
                        if(fileData) {
                            if(from === 'restoreAll') {
                                const PATH = GFileManager.PATHS.videosPath
                                await saveInFileManager(fileData, PATH)
                                await restoreClips()
                                Alert.alert('clip Restored')
                            }
                            var { date, name, clipNames } = fileData
                            if(clipNames.length !== 0) {
                                var clipNameArray: any = []
                                clipNames.split('$').forEach(clipNameElement => {
                                    const clipNameData = clipNameElement.split('-id-')
                                    var clipName: any = {
                                        name: clipNameData[0],
                                        id: clipNameData[1]
                                    }
                                    clipNameArray.push(clipName)
                                });
                            }
                            element.clipNames = clipNameArray
                            if(date.length !== 0) {
                                element.timestamp = date
                            }
                            if(name.length !== 0) {
                                element.image.filename = name
                            }
                            element.dbData = fileData
                            element = { node: element }
                            videosArray.push(element)
                            loop.next()
                        }
                        else {
                            element = { node: element }
                            videosArray.push(element)
                            loop.next()
                        }
                    })
                    .catch(() => {
                        setLoader(false)
                    })

            }, () => {
                setVideos(videosArray)
                setVideosTemp(videosArray)
                forceUpdate()
                setLoader(false)
            })
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
                    var from = 'getData'
                    mergeFileManagerData(data, from)
                }
                else {
                    var videosArray: any = []
                    CommonServices.asyncLoop(
                        data.length, (loop) => {
                            var index = loop.iteration();
                            var element = data[index].node
                            // videosListFromDb.every(dbElement => {
                            for(let dbElement of videosListFromDb) {
                                if(dbElement.id === element.image.filename.replace(/\s/g, '')) {
                                    var { date, name, clipNames } = dbElement
                                    if(clipNames.length !== 0) {
                                        var clipNameArray: any = []
                                        clipNames.split('$').forEach(clipNameElement => {
                                            const clipNameData = clipNameElement.split('-id-')
                                            var clipName: any = {
                                                name: clipNameData[0],
                                                id: clipNameData[1]
                                            }
                                            clipNameArray.push(clipName)
                                        });
                                        element.clipNames = clipNameArray
                                    }
                                    if(date.length !== 0) {
                                        element.timestamp = date
                                    }
                                    if(name.length !== 0) {
                                        element.image.filename = name
                                    }
                                    element.dbData = dbElement
                                    element = { node: element }
                                    videosArray.push(element)
                                    loop.next()
                                    break
                                }
                                else {
                                    const { EXT, PATHS } = GFileManager
                                    GFileManager.readFile(`${PATHS.videosPath}/${element.image.filename.replace(/\s/g, '')}${EXT.ext1}`)
                                        .then((fileData: any) => {
                                            if(fileData) {
                                                var { date, name, clipNames } = fileData
                                                if(clipNames.length !== 0) {
                                                    var clipNameArray: any = []
                                                    clipNames.split('$').forEach(clipNameElement => {
                                                        const clipNameData = clipNameElement.split('-id-')
                                                        var clipName: any = {
                                                            name: clipNameData[0],
                                                            id: clipNameData[1]
                                                        }
                                                        clipNameArray.push(clipName)
                                                    });
                                                }
                                                element.clipNames = clipNameArray
                                                if(date.length !== 0) {
                                                    element.timestamp = date
                                                }
                                                if(name.length !== 0) {
                                                    element.image.filename = name
                                                }
                                                element.dbData = fileData

                                                element = { node: element }
                                                videosArray.push(element)
                                                loop.next()
                                            }
                                            else {
                                                if(element.node) {
                                                    loop.next()
                                                }
                                                else {
                                                    element = { node: element }
                                                    videosArray.push(element)
                                                    loop.next()
                                                }
                                            }
                                        })
                                }
                            }
                            // );

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
                setLoaderMessage('Loading please wait...')
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
        setSearchLoader(true)
        if(searchTxt.length === 0) {
            setVideos(videosTemp)
            setSearchLoader(false)
        }
        else {
            const videosTemp2: any = videosTemp.filter(function (element: any) {
                const text = searchTxt.toUpperCase().replace(/\s/g, '')
                element = element.node
                if(element.clipNames && element.clipNames.length !== 0) {
                    var found = false
                    element.clipNames.forEach(clipNameElement => {
                        if(clipNameElement.name.toUpperCase().includes(text)) {
                            element.clipFound = clipNameElement
                            found = true
                        }
                        else {
                            element.clipFound = null
                        }
                    });
                    if(found) {
                        return element
                    }
                    else if(element.dbData) {
                        const dbData = element.dbData
                        const { name, events, location, description, people } = dbData
                        if(
                            name.toUpperCase().replace(/\s/g, '').includes(text)
                            || moment.unix(dbData.date).format('MMMM-DD-YYYY').toUpperCase().replace(/\s/g, '').includes(text)
                            || events.toUpperCase().replace(/\s/g, '').includes(text)
                            || location.toUpperCase().replace(/\s/g, '').includes(text)
                            || description.toUpperCase().replace(/\s/g, '').includes(text)
                            || people.toUpperCase().replace(/\s/g, '').includes(text)
                        ) {
                            return name
                        }
                    }
                    else {
                        const name = element.image.filename.toUpperCase().replace(/\s/g, '')
                        if(name.includes(text) || moment.unix(element.timestamp).format('MMMM-DD-YYYY').toUpperCase().replace(/\s/g, '').includes(text)) {
                            return name
                        }
                    }
                }
                else if(element.dbData) {
                    const dbData = element.dbData
                    const { name, events, location, description, people } = dbData
                    if(
                        name.toUpperCase().replace(/\s/g, '').includes(text)
                        || moment.unix(dbData.date).format('MMMM-DD-YYYY').toUpperCase().replace(/\s/g, '').includes(text)
                        || events.toUpperCase().replace(/\s/g, '').includes(text)
                        || location.toUpperCase().replace(/\s/g, '').includes(text)
                        || description.toUpperCase().replace(/\s/g, '').includes(text)
                        || people.toUpperCase().replace(/\s/g, '').includes(text)
                    ) {
                        return name
                    }
                }
                else {
                    const name = element.image.filename.toUpperCase()
                    if(name.includes(text) || moment.unix(element.timestamp).format('MMMM-DD-YYYY').toUpperCase().replace(/\s/g, '').includes(text)) {
                        return name
                    }
                }

            }).map(function (item: any) {
                return item
            })
            setVideos(videosTemp2)
            setSearchLoader(false)
        }

    }
    useFocusEffect(
        React.useCallback(() => {
            var unsubscribe: any = null
            if(videos.length === 0) {
                unsubscribe = givePermission()
            }
            else {
                setLoader(true)
                setLoaderMessage('Loading please wait...')
                forceUpdate()
                unsubscribe = getPhotos()
            }
            return () => unsubscribe
        }, [])
    );

    const onVideoPress = (item) => {
        hideMenu()
        if(search.length === 0) {
            item.clipFound = null
            navigation.navigate('VideoDetail', { videoDetail: item })
        }
        else {
            navigation.navigate('VideoDetail', { videoDetail: item })
        }
    }

    const onClearMetaDataPress = (item) => {
        hideMenu()
        const id = item.node.dbData.id
        setLoaderMessage('Clearing please wait...')
        setLoader(true)
        const deleteQuery = {
            query: 'DELETE FROM  MetaData where Id=?',
            params: [id]
        }
        GSQLite.delete(deleteQuery).then(() => {
            const PATH = GFileManager.PATHS.videosPath
            const EXT = GFileManager.EXT.ext1
            GFileManager.deleteFile(`${PATH}/${id}${EXT}`).then(async () => {
                await getPhotos()
                MessageAlert('MetaData Cleared', 'success')
            })
                .catch(async () => {
                    await getPhotos()
                    MessageAlert('MetaData Cleared', 'success')
                })
        })
            .catch(() => {
                setLoader(false)
            })
    }

    // const onClearAllMetaDataPress = () => {
    //     setLoader(true)
    //     setLoaderMessage('Clearing All Metadata')

    //     const clearAllMetaDataQuery = {
    //         query: `DELETE FROM MetaData`,
    //         params: []
    //     }
    //     GSQLite.clearAllMetaData(clearAllMetaDataQuery).then(() => {
    //         const clearAllClipsDataQuery = {
    //             query: `DELETE FROM ClipsData`,
    //             params: []
    //         }
    //         GSQLite.clearAllMetaData(clearAllClipsDataQuery).then(() => {
    //             const PATH = GFileManager.PATHS.videosPath
    //             GFileManager.deleteFile(`${PATH}`).then(async () => {
    //                 await getPhotos()
    //                 MessageAlert('All MetaData Cleared', 'success')
    //             })
    //                 .catch(async () => {
    //                     await getPhotos()
    //                     MessageAlert('All MetaData Cleared', 'success')
    //                 })
    //         })
    //             .catch(() => {
    //                 setLoader(false)
    //             })
    //     })
    //         .catch(() => {
    //             setLoader(false)
    //         })
    // }


    const onClearAllMetaDataPress = () => {
        setLoader(true)
        setLoaderMessage('Clearing All Metadata')

        const clearAllMetaDataQuery = {
            query: `DELETE FROM MetaData`,
            params: []
        }
        GSQLite.clearAllMetaData(clearAllMetaDataQuery).then(() => {
            const PATH = GFileManager.PATHS.videosPath
            const CLIPSPATH = GFileManager.PATHS.clipsPath
            GFileManager.deleteFile(`${PATH}`).then(async () => {
                GFileManager.deleteFile(`${CLIPSPATH}`).then(async () => {

                    var tableName = 'ClipsData'
                    var getQuery = {
                        query: "SELECT * FROM ClipsData",
                        params: []
                    }
                    GSQLite.getData(tableName, getQuery).then(async (clipsList: any) => {
                        if(clipsList.length !== 0) {
                            CommonServices.asyncLoop(
                                clipsList.length, (loop) => {
                                    var index = loop.iteration();
                                    var element = clipsList[index]
                                    var updateQuery = {
                                        query: `UPDATE ClipsData SET startTime = ?,endTime = ? ,name = ?,
                                                               people = ?, events = ?, location = ?, date = ?,description = ? WHERE id = ?`,
                                        values: [element.startTime, element.endTime, element.name, '', '', '', element.date, '', element.id]
                                    }
                                    GSQLite.update(updateQuery).then(async () => {
                                        loop.next()
                                    })
                                        .catch(() => setLoader(false))
                                }, async () => {
                                    await getPhotos()
                                    MessageAlert('All MetaData Cleared', 'success')
                                })
                        }
                        else {
                            await getPhotos()
                            MessageAlert('All MetaData Cleared', 'success')
                        }
                    })
                        .catch(() => setLoader(false))


                }).catch(() => setLoader(false))
            })
                .catch(() => setLoader(false))
        })
            .catch(() => {
                setLoader(false)
            })
    }


    const onRestoreAllMetaDataPress = () => {
        setLoader(true)
        setLoaderMessage('Restoring AllMetaData')
        var from = 'restoreAll'
        const fetchParams: any = {
            first: 30,
            assetType: 'Videos',
            include: ['filename', 'fileSize', 'imageSize', 'playableDuration']
        };
        CameraRoll.getPhotos(fetchParams).then((data: any) => {
            mergeFileManagerData(data.edges, from)
            setLoaderMessage('Clip Restored')
        }).catch((e) => {
            setVideos(videos)
            setVideosTemp(videos)
            setLoader(false)
            console.log('error while fetching videos from gallery =>', e);
        });
    }

    const showRestoreMetaDataAlert = () => {
        Alert.alert(
            "Restore All MetaData",
            "Are you sure you want to restore all Metadata ?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => onRestoreAllMetaDataPress() }
            ]
        );
    }


    const showClearAllMetaDataAlert = () => {
        Alert.alert(
            "Clear All MetaData",
            "Are you sure you want to clear all Metadata ?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => onClearAllMetaDataPress() }
            ]
        );
    }


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
                    {
                        item.node.dbData &&
                        <View style={Style.optionContainer}>
                            <Menu

                                visible={visibleMenu && visibleMenuId === item.node.dbData.id}
                                anchor={
                                    <TouchableOpacity style={Style.optionInnerContainer}
                                        onPress={showMenu.bind(null, item.node.dbData.id)}
                                        activeOpacity={0.5}
                                    >
                                        <Entypo name="dots-three-vertical" color={Colors.white} size={wp(5)} />
                                    </TouchableOpacity>
                                }
                                onRequestClose={hideMenu}
                            >
                                <MenuItem onPress={onClearMetaDataPress.bind(null, item)} textStyle={{ color: Colors.black }}>Clear MetaData</MenuItem>
                                <MenuItem onPress={onVideoPress.bind(null, item.node)} textStyle={{ color: Colors.black }}>Edit</MenuItem>
                            </Menu>
                        </View>
                    }


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
                        <Text style={{ ...Typography.headingTwo, ...Style.heading, alignSelf: videos.length === 0 ? 'center' : 'auto' }}>
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
                                placeholder='Search By Name, Event, People, Date, Location or Description'
                                placeholderTextColor={Colors.grey3}
                                onChangeText={onChangeSearch}
                                style={{ ...Typography.des, ...Style.searchInput }}
                                autoFocus
                                multiline
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
            <View style={Style.clearRestoreCon}>
                <TouchableOpacity style={Style.clearAllMetaDataBtn}
                    onPress={showClearAllMetaDataAlert}
                >
                    <Text style={Style.clearAllMetaDataTxt}>Clear All MetaData</Text>
                </TouchableOpacity>

                <TouchableOpacity style={Style.clearAllMetaDataBtn}
                    onPress={showRestoreMetaDataAlert}
                >
                    <Text style={Style.clearAllMetaDataTxt}>Restore All MetaData</Text>
                </TouchableOpacity>
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
                        message={loaderMessage}
                    />
                    :
                    searchLoader ?
                        <Loader />
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