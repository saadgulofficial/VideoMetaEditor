import { View, Text, TextInput, ScrollView, Alert, TouchableOpacity, PermissionsAndroid } from 'react-native'
import React, { useState, useEffect, useReducer } from 'react'
import Style from './Style'
import { GButton, MessageAlert, Header, VideoPlayer, LoaderModal, Loader } from '../../components'
import { hp, Typography, wp } from '../../global'
import moment from 'moment'
import { GFileManager, GSQLite } from '../../services'
import DatePicker from 'react-native-date-picker'
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'



const VideoDetail = ({ route, navigation }) => {
    const { videoDetail } = route.params
    const { image, timestamp } = videoDetail
    const { filename, uri, playableDuration } = image

    const [startTime, setStartTime] = useState('00:00')
    const [endTime, setEndTime] = useState('')
    const [videoName, setVideoName] = useState('')
    const [people, setPeople] = useState('')
    const [events, setEvents] = useState('')
    const [location, setLocation] = useState('')
    const [date, setDate] = useState<any>(timestamp)
    const [description, setDescription] = useState('')
    const [loader, setLoader] = useState(true)
    const [loaderMessage, setLoaderMessage] = useState('Loading please wait')
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [clipNames, setClipNames] = useState([])

    const onChangeStartTime = (text) => setStartTime(text)
    const onChangeEndTime = (text) => setEndTime(text)
    const onChangeVideoName = (text) => setVideoName(text)
    const onChangePeople = (text) => setPeople(text)
    const onChangeEvents = (text) => setEvents(text)
    const onChangeLocation = (text) => setLocation(text)

    const onCancelDate = () => {
        setDate(timestamp)
        setShowDatePicker(false)
    }
    const onChangeDate = (text) => {
        const date = new Date(text);
        const unixTimestamp: any = Math.floor(date.getTime() / 1000)
        setDate(unixTimestamp)
        setShowDatePicker(false);
    }
    const onChangeDescription = (text) => setDescription(text)
    const onPressDate = () => setShowDatePicker(true)

    const setData = () => {
        const { videoDetail } = route.params
        const { dbData } = videoDetail
        setEndTime(moment.utc(moment.duration(playableDuration, "minutes").asMilliseconds()).format("HH:mm"))
        setVideoName(filename.charAt(0).toUpperCase() + filename.slice(1))
        setDate(timestamp)
        if(dbData) {
            const { people, events, location, description, clipNames } = dbData
            setPeople(people)
            setEvents(events)
            setLocation(location)
            setDescription(description)
            setClipNames(clipNames)
        }
        setLoader(false)
    }
    useEffect(() => {
        const clean = setData()
        return () => clean
    }, [])




    const saveInFileManager = (id) => {
        const data = {
            startTime: startTime,
            endTime: endTime,
            name: videoName,
            people: people,
            events: events,
            location: location,
            date: date,
            description: description,
            id: id,
            clipNames: clipNames
        }
        const PATH = GFileManager.PATHS.videosPath
        const EXT = GFileManager.EXT.ext1
        GFileManager.makeDirectory(PATH).then(() => {
            GFileManager.fileExits(`${PATH}/${id}${EXT}`).then((res) => {
                if(res) {
                    GFileManager.deleteFile(`${PATH}/${id}${EXT}`).then(() => {
                        GFileManager.writeFile(`${PATH}/${id}${EXT}`, data).then(() => {
                            MessageAlert(videoDetail.dbData ? 'MetaData Updated' : 'MetaData Saved', 'success')
                            setLoader(false)
                        }).catch(() => {
                            MessageAlert(videoDetail.dbData ? 'MetaData Updated' : 'MetaData Saved', 'success')
                            setLoader(false)
                        })
                    }).catch(() => setLoader(false))
                }
                else {
                    GFileManager.writeFile(`${PATH}/${id}${EXT}`, data).then(() => {
                        MessageAlert(videoDetail.dbData ? 'MetaData Updated' : 'MetaData Saved', 'success')
                        setLoader(false)
                    }).catch(() => {
                        MessageAlert(videoDetail.dbData ? 'MetaData Updated' : 'MetaData Saved', 'success')
                        setLoader(false)
                    })
                }
            }).catch(() => setLoader(false))
        })
            .catch(() => setLoader(false))
    }

    const onSavePress = async () => {
        setLoader(true)
        setLoaderMessage(videoDetail.dbData ? "Updating please wait" : "Saving please wait...")
        const { dbData } = videoDetail
        var id = filename.replace(/\s/g, '');
        if(dbData) {
            id = dbData.id
        }
        var tableName = 'MetaData'
        var getQuery = {
            query: "SELECT * FROM MetaData WHERE id = ?",
            params: [id]
        }
        GSQLite.getData(tableName, getQuery).then((data: any) => {
            if(data.length !== 0) {
                var updateQuery = {
                    query: `UPDATE MetaData SET startTime = ?,endTime = ? ,name = ?,
                               people = ?,events = ?, location = ?, date = ?,description = ?, clipNames = ? WHERE id = ?`,
                    values: [startTime, endTime, videoName, people, events, location, date, description, clipNames, id]
                }
                GSQLite.update(updateQuery).then(() => {
                    saveInFileManager(id)
                }).catch(() => setLoader(false))
            }
            else {
                var insertQuery = {
                    query: 'INSERT INTO MetaData(startTime,endTime,name,people,events,location,date,description, id, clipNames) VALUES (?,?,?,?,?,?,?,?,?,?)',
                    values: [startTime, endTime, videoName, people, events, location, date, description, id, clipNames]
                }
                GSQLite.insertIntoTable(insertQuery).then(() => {
                    saveInFileManager(id)
                }).catch(() => setLoader(false))
            }
        }).catch(() => setLoader(false))
    }

    const onAddClipPress = () => navigation.navigate('AddClip', { videoDetail: videoDetail })
    const onViewClipsPress = () => navigation.navigate('ViewClips', { videoDetail: videoDetail })

    return (
        <View style={Style.container}>
            <Header
                back
                navigation={navigation}
            />
            <LoaderModal
                visible={loader}
                message={loaderMessage}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: hp(5) }}
            >
                <VideoPlayer
                    uri={uri}
                />
                <View style={Style.videoMetaDataCon}>
                    <Text style={{ ...Typography.heading, ...Style.heading }}>Video Meta Deta</Text>
                    <View style={Style.addViewClipCon}>
                        <TouchableOpacity onPress={onAddClipPress}>
                            <Text style={{ ...Typography.desTwo, ...Style.addClip }}>Add Clip</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onViewClipsPress}>
                            <Text style={{ ...Typography.desTwo, ...Style.addClip, marginLeft: wp(10) }}>View Clips</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={Style.fieldContainer}>
                        <Text style={{ ...Typography.des, ...Style.fieldLabel }}
                            numberOfLines={1}
                        >
                            Start time
                        </Text>
                        <TextInput
                            value={startTime}
                            style={{ ...Typography.des, ...Style.fieldInput }}
                            onChangeText={onChangeStartTime}
                        />
                    </View>

                    <View style={Style.fieldContainer}>
                        <Text style={{ ...Typography.des, ...Style.fieldLabel }}
                            numberOfLines={1}
                        >
                            End time
                        </Text>
                        <TextInput
                            value={endTime}
                            style={{ ...Typography.des, ...Style.fieldInput }}
                            onChangeText={onChangeEndTime}
                        />
                    </View>

                    <View style={Style.fieldContainer}>
                        <Text style={{ ...Typography.des, ...Style.fieldLabel }}
                            numberOfLines={1}
                        >
                            Name
                        </Text>
                        <TextInput
                            value={videoName}
                            style={{ ...Typography.des, ...Style.fieldInput }}
                            onChangeText={onChangeVideoName}
                        />
                    </View>

                    <View style={Style.fieldContainer}>
                        <Text style={{ ...Typography.des, ...Style.fieldLabel }}
                            numberOfLines={1}
                        >
                            People
                        </Text>
                        <TextInput
                            value={people}
                            style={{ ...Typography.des, ...Style.fieldInput }}
                            onChangeText={onChangePeople}
                        />
                    </View>

                    <View style={Style.fieldContainer}>
                        <Text style={{ ...Typography.des, ...Style.fieldLabel }}
                            numberOfLines={1}
                        >
                            Events
                        </Text>
                        <TextInput
                            value={events}
                            style={{ ...Typography.des, ...Style.fieldInput }}
                            onChangeText={onChangeEvents}
                        />
                    </View>

                    <View style={Style.fieldContainer}>
                        <Text style={{ ...Typography.des, ...Style.fieldLabel }}
                            numberOfLines={1}
                        >
                            Location
                        </Text>
                        <TextInput
                            value={location}
                            style={{ ...Typography.des, ...Style.fieldInput }}
                            onChangeText={onChangeLocation}
                        />
                    </View>

                    <View style={Style.fieldContainer}>
                        <Text style={{ ...Typography.des, ...Style.fieldLabel }}
                            numberOfLines={1}
                        >
                            Date
                        </Text>
                        <TouchableOpacity style={Style.dateBtn}
                            activeOpacity={0.5}
                            onPress={onPressDate}
                        >
                            <Text style={{ ...Typography.des, ...Style.dateTxt }}>
                                {moment.unix(date).format('MMMM-DD-YYYY')}
                            </Text>
                        </TouchableOpacity>
                        <DatePicker
                            modal
                            mode="date"
                            open={showDatePicker}
                            date={new Date(JSON.parse(date))}
                            onConfirm={onChangeDate}
                            onCancel={onCancelDate}
                        />
                    </View>

                    <View style={{ ...Style.fieldContainer, alignItems: 'flex-start' }}>
                        <Text style={{ ...Typography.des, ...Style.fieldLabel, marginTop: hp(0.5) }}
                            numberOfLines={1}
                        >
                            Description
                        </Text>
                        <TextInput
                            value={description}
                            style={{ ...Typography.des, ...Style.fieldInput, textAlignVertical: 'top', height: hp(20) }}
                            onChangeText={onChangeDescription}
                            multiline
                        />
                    </View>
                </View>

                <GButton
                    text={videoDetail.dbData ? "Update" : "Save"}
                    onPress={onSavePress}
                />
            </ScrollView>
        </View>
    )
}

export default VideoDetail