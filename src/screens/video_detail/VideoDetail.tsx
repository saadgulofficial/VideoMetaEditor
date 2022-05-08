import { View, Text, TextInput, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import Style from './Style'
import { Header, VideoPlayer } from '../../components'
import { Typography } from '../../global'
import moment from 'moment'

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

    const onChangeStartTime = (text) => setStartTime(text)
    const onChangeEndTime = (text) => setEndTime(text)
    const onChangeVideoName = (text) => setVideoName(text)
    const onChangePeople = (text) => setPeople(text)
    const onChangeEvents = (text) => setEvents(text)
    const onChangeLocation = (text) => setLocation(text)
    const onChangeDate = (text) => setDate(text)
    const onChangeDescription = (text) => setDescription(text)

    const setData = () => {
        setEndTime(moment.utc(moment.duration(playableDuration, "minutes").asMilliseconds()).format("HH:mm"))
        setVideoName(filename.charAt(0).toUpperCase() + filename.slice(1))
        setDate(moment.unix(timestamp).format('MMM-D-YYYY'))
    }
    useEffect(() => {
        const clean = setData()
        return () => clean
    }, [])

    return (
        <View style={Style.container}>
            <Header
                back
                navigation={navigation}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <VideoPlayer
                    uri={uri}
                />
                <View style={Style.videoMetaDataCon}>
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
                        <TextInput
                            value={date}
                            style={{ ...Typography.des, ...Style.fieldInput }}
                            onChangeText={onChangeDate}
                        />
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
            </ScrollView>
        </View>
    )
}

export default VideoDetail