import React, { useState } from "react";
import { View, Text, Button, FlatList, SafeAreaView, ActivityIndicator, Linking, StyleSheet, Dimensions } from "react-native";
import { MapView, Marker } from "./Map";


type LandmarkItem = {
    name: string;
    lat: number;
    lon: number;
}

export default function LandmarksScreen() {
    const [loading, setLoading] = useState(false);
    const [landmarks, setLandmarks] = useState<LandmarkItem[]>([]);
    const [region, setRegion] = useState({
        latitude: 43.655863594186755,
        longitude: -79.38249460259485,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    });

    const fetchLandmarkRecs = async () => {
        setLoading(true);

        const lat = 43.655863594186755;
        const lon = -79.38249460259485;
        const radius = 1000;

        const query = `
            [out:json];
            node
            ["tourism"~"attraction|museum|gallery|zoo|aquarium|theme_park|viewpoint|monument"]
            (around:${radius},${lat},${lon});
            node
            ["historic"]
            (around:${radius},${lat},${lon});
            out;
        `;

        try {
            const resp = await fetch("https://overpass-api.de/api/interpreter", {
                method: "POST", 
                headers: {"Content-Type": "text/plain"},
                body: query,
            });

            if (!resp.ok) {
                console.log("landmark fail");
                return;
            }

            const data = await resp.json();
            const elements = data.elements || [];

            if (elements.length === 0) {
                console.log("no landmarks");
                return;
            }

            const recs: LandmarkItem[] = elements.slice(0, 10).map((x: any) => {
                const name = x.tags?.name ?? "Unnamed";
                const lat = x.lat;
                const lon = x.lon;
                return {name, lat, lon};
            });

            setLandmarks(recs);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Button title="Generate Landmark Recommendations" onPress={fetchLandmarkRecs} />

            {loading && <ActivityIndicator size="large" style={{ marginTop: 16 }} />}

            {!loading && landmarks.length > 0 && (
                <View style={{ flex: 1 }}>
                    <MapView
                        style={{ width: Dimensions.get("window").width, height: 400 }}
                        initialRegion={region}
                    >
                        {landmarks.map((item, index) => (
                            <Marker
                                key={index}
                                coordinate={{ latitude: item.lat, longitude: item.lon }}
                                title={item.name}
                            />
                        ))}
                    </MapView>

                    <FlatList
                        style={{ flex: 1, padding: 16 }}
                        data={landmarks}
                        keyExtractor={(item, index) => item.name + index}
                        renderItem={({ item }) => (
                            <View style={styles.listItem}>
                                <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.name}</Text>
                            </View>
                        )}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    listItem: {
        marginBottom: 12,
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#f0f0f0",
    },
});
