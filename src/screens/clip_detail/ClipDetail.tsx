import { View, Text, TextInput, ScrollView, Alert, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useReducer } from 'react'
import Style from './Style'
import { GButton, MessageAlert, Header, VideoPlayer, LoaderModal, Loader } from '../../components'
import { hp, Typography, wp } from '../../global'
import moment from 'moment'
import { GFileManager, GSQLite } from '../../services'
import DatePicker from 'react-native-date-picker'



const ClipDetail = ({ route, navigation }) => {
    const { clipDetail } = route.params
    const { uri, id } = clipDetail

    // @NewFieldCodeClip nechy wali two line new field k leah yeh already un commit ha
    const [newField, setNewField] = useState('')
    const onChangeNewField = (text) => setNewField(text)


    const [startTime, setStartTime] = useState('00:00')
    const [endTime, setEndTime] = useState('')
    const [videoName, setVideoName] = useState('')
    const [people, setPeople] = useState('')
    const [events, setEvents] = useState('')
    const [location, setLocation] = useState('')
    const [date, setDate] = useState<any>(clipDetail.date)
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

    const onCancelDate = () => {
        setDate(clipDetail.date)
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

    // const setData = () => {
    //     const { clipDetail } = route.params
    //     const { endTime, startTime, name, people, events, location, description } = clipDetail

    //     // @NewFieldCodeClip nechy wali line uncommit kr dena ha or same oper wali line commit kr deni hai or newField ki jagan jo name ha field ka database mein wo lhekna ha
    //     // const { endTime, startTime, name, people, events, location, description, newField} = clipDetail
    //     setEndTime(endTime)
    //     setStartTime(startTime)
    //     setVideoName(name)
    //     setDate(clipDetail.date)
    //     setPeople(people)
    //     setEvents(events)
    //     setLocation(location)
    //     setDescription(description)

    //     // @NewFieldCodeClip  nechy wali line uncommit krni ha or newField mein wo name lhekna ha to database mein ha name
    //     // setNewField(newField)
    //     setLoader(false)
    // }

    const setData = () => {
        const { clipDetail } = route.params
        const { id } = clipDetail
        const path = GFileManager.PATHS.clipsPath
        const EXT = GFileManager.EXT
        GFileManager.readFile(`${path}/${id}${EXT.ext1}`)
            .then(async (fileData: any) => {
                if(fileData) {
                    const { startTime, endTime, clipName, people, events, location, description } = fileData
                    setEndTime(endTime)
                    setStartTime(startTime)
                    setVideoName(clipName)
                    setDate(fileData.date)
                    setPeople(people)
                    setEvents(events)
                    setLocation(location)
                    setDescription(description)
                    setLoader(false)
                }
                else {
                    const { endTime, startTime, name, people, events, location, description } = clipDetail
                    setEndTime(endTime)
                    setStartTime(startTime)
                    setVideoName(name)
                    setDate(clipDetail.date)
                    setPeople(people)
                    setEvents(events)
                    setLocation(location)
                    setDescription(description)
                    setLoader(false)
                }
            })
            .catch((err) => {
                const { endTime, startTime, name, people, events, location, description } = clipDetail
                setEndTime(endTime)
                setStartTime(startTime)
                setVideoName(name)
                setDate(clipDetail.date)
                setPeople(people)
                setEvents(events)
                setLocation(location)
                setDescription(description)
                setLoader(false)
            })
    }



    useEffect(() => {
        const clean = setData()
        return () => clean
    }, [])

    const onUpdatePress = () => {
        setLoader(true)
        setLoaderMessage("Updating please wait...")

        var updateQuery = {
            query: `UPDATE ClipsData SET startTime = ?,endTime = ? ,name = ?,
                               people = ?,events = ?, location = ?, date = ?,description = ? WHERE id = ?`,
            values: [startTime, endTime, videoName, people, events, location, date, description, id]
        }

        //@NewFieldCodeClip nechy wala code uncommit krna ha or same oper wala code commit kr dena ha or 
        // query mein newField ki jagan same name lhekna ha jo data base clip k table mein lkah or values ko nhi cherna ha

        // var updateQuery = {
        //     query: `UPDATE ClipsData SET startTime = ?,endTime = ? ,name = ?,
        //                        people = ?,events = ?, location = ?, date = ?,description = ?, newField =? WHERE id = ?`,
        // values: [startTime, endTime, videoName, people, events, location, date, description, newField,id]
        // }

        GSQLite.update(updateQuery).then(() => {
            MessageAlert('Updated', 'success')
            setLoader(false)
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
                <View style={Style.clipMetaDataCon}>
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

                    { /* //@NewFieldCodeClip nechy wala code uncommit krna ha new field k leah code select kr k ctrl + /  press krna ha uncommit k leah 
                       or new Field ka Name lhekna ha jahan nechy New field Name lkah ha
                     */}

                    {/* <View style={{ ...Style.fieldContainer, alignItems: 'flex-start' }}>
                        <Text style={{ ...Typography.des, ...Style.fieldLabel, marginTop: hp(0.5) }}
                            numberOfLines={1}
                        >
                            New Field Name
                        </Text>
                        <TextInput
                            value={newField}
                            style={{ ...Typography.des, ...Style.fieldInput, textAlignVertical: 'top', height: hp(20) }}
                            onChangeText={onChangeNewField}
                            multiline
                        />
                    </View> */}


                </View>

                <GButton
                    text="Update"
                    onPress={onUpdatePress}
                />
            </ScrollView>
        </View>
    )
}

export default ClipDetail