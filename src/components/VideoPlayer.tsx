import React, { Component } from "react";
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    Dimensions,
    ActivityIndicator,
    Platform
} from "react-native";

import Video from "react-native-video";
import ProgressBar from "react-native-progress/Bar";

import Icon from "react-native-vector-icons/FontAwesome";
import { wp, hp, Typography } from "../global";
import { Colors, Fonts } from "../res";

function secondsToTime(time) {
    return ~~(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + time % 60;
}

export default class CustomVideoPlayer extends Component<any> {
    state = {
        paused: true,
        progress: 0,
        duration: 0,
        opacity: 0
    };

    handleMainButtonTouch = () => {
        if(this.state.progress >= 1) {
            //@ts-ignore
            this.player.seek(0);
        }

        this.setState(state => {
            return {
                //@ts-ignore
                paused: !state.paused,
            };
        });
    };

    handleProgressPress = e => {
        const position = e.nativeEvent.locationX;
        const progress = (position / 250) * this.state.duration;
        const isPlaying = !this.state.paused;
        //@ts-ignore
        this.player.seek(progress);
    };

    handleProgress = progress => {
        this.setState({
            progress: progress.currentTime / this.state.duration,
        });
    };

    handleEnd = () => {
        this.setState({ paused: true });
    };

    handleLoad = meta => {
        this.setState({
            duration: meta.duration,
            opacity: 0
        });
    };

    onLoadStart = () => {
        this.setState({ opacity: 1 });
    }
    onBuffer = ({ isBuffering }) => {
        this.setState({ opacity: isBuffering ? 1 : 0 });
    }

    render() {

        return (
            <View style={styles.container}>
                <View >
                    <Video
                        paused={this.state.paused}
                        //@ts-ignore
                        source={{ uri: this.props.uri }}
                        style={{ width: "100%", height: hp(30), borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, borderColor: Colors.grey3 }}
                        poster={"https://i.ibb.co/XtrVN0p/download.png"}
                        posterResizeMode='cover'
                        resizeMode="contain"
                        onVideo
                        onLoad={this.handleLoad}
                        onProgress={this.handleProgress}
                        onEnd={this.handleEnd}
                        onLoadStart={this.onLoadStart}
                        onBuffer={this.onBuffer}
                        ref={ref => {
                            //@ts-ignore
                            this.player = ref;
                        }}
                    />
                    {
                        this.state.opacity !== 0 ?
                            <ActivityIndicator
                                animating
                                size="large"
                                color={'#fff'}
                                style={{ width: "100%", height: hp(30), opacity: this.state.opacity, position: 'absolute', marginTop: hp(1) }}
                            /> : null
                    }
                    <View style={styles.controls}>
                        <TouchableWithoutFeedback onPress={this.handleMainButtonTouch}>
                            <Icon name={!this.state.paused ? "pause" : "play"} size={wp(6)} color="#FFF" />
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.handleProgressPress}>
                            <View>
                                <ProgressBar
                                    progress={this.state.progress}
                                    color={Colors.theme}
                                    unfilledColor="rgba(255,255,255,.5)"
                                    borderWidth={0}
                                    width={wp(65)}
                                    height={hp(1)}
                                />
                            </View>
                        </TouchableWithoutFeedback>

                        <Text style={styles.duration}>
                            {secondsToTime(Math.floor(this.state.progress * this.state.duration))}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: hp(37),
        paddingHorizontal: wp(3),
    },
    controls: {
        backgroundColor: "rgba(0, 0, 0, 1)",
        height: hp(6),
        left: 0,
        bottom: hp(-6),
        right: 0,
        position: "absolute",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        paddingHorizontal: wp(4),
        borderBottomLeftRadius: wp(4),
        borderBottomRightRadius: wp(4)
    },
    duration: {
        color: Colors.white,
        fontSize: wp(4),
        fontFamily: Fonts.APPFONT_R
    },
});
