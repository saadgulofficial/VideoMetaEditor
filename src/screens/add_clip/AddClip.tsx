import { View, Text, TextInput, ScrollView, Alert, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useReducer } from 'react'
import Style from './Style'
import { GButton, MessageAlert, Header, VideoPlayer, LoaderModal, Loader } from '../../components'
import { hp, Typography, wp } from '../../global'
import moment from 'moment'
import { CommonServices, GSQLite } from '../../services'
import DatePicker from 'react-native-date-picker'
import { Trimmer, ProcessingManager } from 'react-native-video-processing';
// import {VideoTrimmer}
import CameraRoll from "@react-native-community/cameraroll";

const AddClip = ({ route, navigation }) => {
    const { videoDetail } = route.params
    const { image, timestamp } = videoDetail
    const { filename, uri, playableDuration } = image

    const [startTime, setStartTime] = useState('00')
    const [endTime, setEndTime] = useState('')
    const [startTimeRaw, setStartTimeRaw] = useState('')
    const [endTimeRaw, setEndTimeRaw] = useState('')
    const [clipName, setClipName] = useState('')
    const [people, setPeople] = useState('')
    const [events, setEvents] = useState('')
    const [location, setLocation] = useState('')
    const [date, setDate] = useState<any>(timestamp)
    const [description, setDescription] = useState('')
    const [loader, setLoader] = useState(true)
    const [loaderMessage, setLoaderMessage] = useState('Loading please wait')
    const [showDatePicker, setShowDatePicker] = useState(false)

    const onChangeStartTime = (text) => setStartTime(text)
    const onChangeEndTime = (text) => setEndTime(text)
    const onChangeClipName = (text) => setClipName(text)
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
        setEndTime(moment.utc(moment.duration(playableDuration, "minutes").asMilliseconds()).format("HH:mm"))
        setDate(timestamp)
        setLoader(false)
    }
    useEffect(() => {
        const clean = setData()
        return () => clean
    }, [])





    const onChangeTrim = (startTime, endTime) => {
        if(startTime || endTime) {
            const startString = JSON.stringify(startTime)
            const endString = JSON.stringify(endTime)

            if(startString.startsWith("0.") || endString.startsWith("0.")) {
                setStartTimeRaw(moment.utc(moment.duration(startTime * 1000, "minutes").asMilliseconds()).format("mm"))
                setEndTimeRaw(moment.utc(moment.duration(endTime * 1000, "minutes").asMilliseconds()).format("mm"))
                setStartTime(moment.utc(moment.duration(startTime * 1000, "minutes").asMilliseconds()).format("HH:mm"))
                setEndTime(moment.utc(moment.duration(endTime * 1000, "minutes").asMilliseconds()).format("HH:mm"))
            }
            else {
                setStartTimeRaw(moment.utc(moment.duration(startTime * 60, "minutes").asMilliseconds()).format("mm"))
                setEndTimeRaw((moment.utc(moment.duration(endTime * 60, "minutes").asMilliseconds()).format("mm")))
                setStartTime(moment.utc(moment.duration(startTime * 60, "minutes").asMilliseconds()).format("HH:mm"))
                setEndTime((moment.utc(moment.duration(endTime * 60, "minutes").asMilliseconds()).format("HH:mm")))
            }
        }
    }


    const onSavePress = () => {
        setLoader(true)
        setLoaderMessage("Saving please wait...")
        if(startTimeRaw.length === 0) {
            MessageAlert('Please Select Start of trimmer', 'danger')
            setLoader(false)
        }
        else if(endTimeRaw.length === 0) {
            MessageAlert('Please Select end of trimmer', 'danger')
            setLoader(false)
        }
        else if(clipName.trim().length === 0) {
            MessageAlert('Please Enter clip Name', 'danger')
            setLoader(false)
        }
        else {
            const options = {
                startTime: startTimeRaw,
                endTime: endTimeRaw,
                saveToCameraRoll: true
            };
            ProcessingManager.trim(uri, options)
                .then(async (data) => {
                    if(data) {
                        await CameraRoll.save(data, { type: 'video', album: 'Clips' }).then(() => {

                            setLoader(false)
                        })
                        //     .catch((error) => {
                        //         console.log('error while saving video to camera Roll =>', error)
                        //         CommonServices.commonError()
                        //     })
                        // var id = CommonServices.getTimeStamp()
                        // var insertQuery = {
                        //     query: 'INSERT INTO MetaData(startTime,endTime,name,people,events,location,date,description, id, clipUri) VALUES (?,?,?,?,?,?,?,?,?,?)',
                        //     values: [startTime, endTime, clipName, people, events, location, date, description, id, data]
                        // }
                        // GSQLite.insertIntoTable(insertQuery).then(() => {
                        //     MessageAlert('Saved in Database', 'success')
                        //     setLoader(false)
                        // }).catch(() => setLoader(false))
                    }
                })
                .catch((err) => {
                    console.log('error while trimmig =>', err)
                    setLoader(false)
                })
        }
    }


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
                <View style={Style.trimmerCon}>
                    <Trimmer
                        source={uri}
                        height={100}
                        width={300}
                        onChange={(e) => onChangeTrim(e.startTime, e.endTime)}
                    />
                </View>

                <View style={Style.videoMetaDataCon}>
                    <Text style={{ ...Typography.heading, ...Style.heading }}>Clip Meta Deta</Text>

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
                            Clip Name
                        </Text>
                        <TextInput
                            value={clipName}
                            style={{ ...Typography.des, ...Style.fieldInput }}
                            onChangeText={onChangeClipName}
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
                    text="Save"
                    onPress={onSavePress}
                />
            </ScrollView>
        </View>
    )
}

export default AddClip