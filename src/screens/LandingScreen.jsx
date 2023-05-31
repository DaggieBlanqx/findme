import React from "react";
import {StyleSheet, View, Alert} from "react-native";
import {Button, Card, Layout, Text, Input} from "@ui-kitten/components";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import {Spinner} from "@ui-kitten/components";

const LOCATION_TRACKING = "location-tracking";

var l1;
var l2;
var phoneNumber;
const url =
    "https://findme.loisekimwe.repl.co" ||
    "https://agitatedripeparallelprocessing.daggieblanqx.repl.co/findme";

const sendLocation = (outboundData) => {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(outboundData),
        })
            .then((response) => response.json())
            .then((inboundData) => {
                resolve({
                    status: "success",
                    data: inboundData,
                });
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const AddPhone = () => {
    const [value, setValue] = React.useState("");
    const [showInput, setShowInput] = React.useState(true);
    const [showAcceptBtn, setShowAcceptBtn] = React.useState(true);

    const [locationStarted, setLocationStarted] = React.useState(false);

    const startLocationTracking = async () => {
        await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 10000,
            distanceInterval: 0,
        });
        const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING);
        setLocationStarted(hasStarted);
        console.log("tracking started?", hasStarted);
    };

    React.useEffect(() => {
        const config = async () => {
            let resf = await Location.requestForegroundPermissionsAsync();
            let resb = await Location.requestBackgroundPermissionsAsync();
            if (resf.status != "granted" && resb.status !== "granted") {
                console.log("Permission to access location was denied");
                Alert.alert(`Permission to access location was denied`);
            } else {
                console.log("Permission to access location granted");
            }
        };

        config();
    }, []);

    const startLocation = () => {
        if (!value) {
            console.log(`No phone number entered`);
            Alert.alert(`No phone number entered`);
        } else {
            phoneNumber = value;
            startLocationTracking();
            setShowInput(false);
            setShowAcceptBtn(false);
        }
    };

    const stopLocation = () => {
        setShowInput(true);
        setShowAcceptBtn(true);
        setLocationStarted(false);
        TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING).then((tracking) => {
            if (tracking) {
                Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
            }
        });
    };

    //UI

    const Header = (props) => (
        <View {...props}>
            <Text category="h6">FindMe</Text>
            <Text category="s1">A safer world for every lady</Text>
        </View>
    );

    const Footer = (props) => (
        <View {...props} style={[props.style, styles.footerContainer]}>
            <Button style={styles.footerControl} size="small" status="basic" onPress={stopLocation}>
                CANCEL
            </Button>
            {showAcceptBtn && (
                <Button style={styles.footerControl} size="small" onPress={startLocation}>
                    ACCEPT
                </Button>
            )}
        </View>
    );

    return (
        <Layout style={styles.body}>
            <Card style={styles.card} header={Header} footer={Footer}>
                {showInput && (
                    <Input
                        placeholder="(+254) Enter your trusted person's phone number"
                        value={value}
                        onChangeText={(nextValue) => setValue(nextValue)}
                    />
                )}
                {locationStarted && (
                    <>
                        <Text>Tracking in progress</Text>
                        <Spinner />
                    </>
                )}
            </Card>
        </Layout>
    );
};

TaskManager.defineTask(LOCATION_TRACKING, async ({data, error}) => {
    if (error) {
        console.log("LOCATION_TRACKING task ERROR:", error);
        Alert.alert(`LOCATION_TRACKING task ERROR`);
        return;
    }
    if (data) {
        const {locations} = data;
        let lat = locations[0].coords.latitude;
        let long = locations[0].coords.longitude;

        l1 = lat;
        l2 = long;
        const timeNow = new Date(Date.now()).toLocaleString();
        console.info(`Location: ${lat}, ${long} at ${timeNow}`);
        try {
            const out = await sendLocation({location: {lat, long}, timeNow, phoneNumber});

            console.info(out);
        } catch (e) {
            console.log(e);
            Alert.alert(`Error in sending location`);
        }
    }
});

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    topContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    card: {
        flex: 1,
        margin: 2,
    },
    footerContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    footerControl: {
        marginHorizontal: 2,
    },
});

export default AddPhone;
