import { View, Text, TextInput, ScrollView, Alert, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import Style from './Style'
import { GButton, MessageAlert, Header, VideoPlayer, LoaderModal, Loader } from '../../components'
import { hp, Typography } from '../../global'
import moment from 'moment'
import { GSQLite } from '../../services'
import DateTimePicker from '@react-native-community/datetimepicker';


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
    const [date, setDate] = useState('')
    const [description, setDescription] = useState('')
    const [loader, setLoader] = useState(true)
    const [loaderMessage, setLoaderMessage] = useState('Loading please wait')
    const [showDatePicker, setShowDatePicker] = useState(false)

    const onChangeStartTime = (text) => setStartTime(text)
    const onChangeEndTime = (text) => setEndTime(text)
    const onChangeVideoName = (text) => setVideoName(text)
    const onChangePeople = (text) => setPeople(text)
    const onChangeEvents = (text) => setEvents(text)
    const onChangeLocation = (text) => setLocation(text)
    const onChangeDate = (text) => setDate(text)
    const onChangeDescription = (text) => setDescription(text)
    const onPressDate = () => setShowDatePicker(true)

    const setData = () => {
        setEndTime(moment.utc(moment.duration(playableDuration, "minutes").asMilliseconds()).format("HH:mm"))
        setVideoName(filename.charAt(0).toUpperCase() + filename.slice(1))
        setDate(moment.unix(timestamp).format('DD-MM-YYYY'))
        setLoader(false)
    }
    useEffect(() => {
        const clean = setData()
        return () => clean
    }, [])

    const onSavePress = () => {
        setLoader(true)
        setLoaderMessage("Saving please wait...")

        var myDate: any = date
        myDate = myDate.split("-");
        var newDate = new Date(myDate[2], myDate[1] - 1, myDate[0]);
        var newDateTimeStamp = newDate.getTime()

        var id = filename.trim()
        if(videoDetail.id) {
            id = videoDetail.id
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
                               people = ?,events = ?, location = ?, date = ?,description = ? WHERE id = ?`,
                    values: [startTime, endTime, videoName, people, events, location, date, description, id]
                }
                GSQLite.update(updateQuery).then(() => {
                    MessageAlert('Saved in Database', 'success')
                    setLoader(false)
                }).catch(() => setLoader(false))
            }
            else {
                var insertQuery = {
                    query: 'INSERT INTO MetaData(startTime,endTime,name,people,events,location,date,description, id) VALUES (?,?,?,?,?,?,?,?,?)',
                    values: [startTime, endTime, videoName, people, events, location, newDateTimeStamp, description, id]
                }
                GSQLite.insertIntoTable(insertQuery).then(() => {
                    MessageAlert('Saved in Database', 'success')
                    setLoader(false)
                }).catch(() => setLoader(false))
            }
        }).catch(() => setLoader(false))
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
                <View style={Style.videoMetaDataCon}>
                    <Text style={{ ...Typography.heading, ...Style.heading }}>Video Meta Deta</Text>
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
                                {date}
                            </Text>
                        </TouchableOpacity>
                        {
                            showDatePicker &&
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={new Date(1598051730000)}
                                mode={'date'}
                            // onChange={onChange}
                            />
                        }
                    </View>

                    <View style={Style.fieldContainer}>
                        <Text style={{ ...Typography.des, ...Style.fieldLabel }}
                            numberOfLines={1}
                        >
                            Description
                        </Text>
                        <TextInput
                            value={description}
                            style={{ ...Typography.des, ...Style.fieldInput }}
                            onChangeText={onChangeDescription}
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

export default VideoDetail