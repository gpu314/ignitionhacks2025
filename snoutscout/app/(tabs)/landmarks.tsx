import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, SafeAreaView, ActivityIndicator, Linking, StyleSheet, Dimensions } from "react-native";
import { MapView, Marker } from "./Map";
import { theme } from "./theme"
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
});

type LandmarkItem = {
    name: string;
    lat: number;
    lon: number;
    description: string
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
    const runAI = async (placeName: string): Promise<string> => {
        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: `Write a short description (1 sentence) about the Toronto landmark: ${placeName}`,
                    },
                ],
                model: "llama3-8b-8192",
            });
            return chatCompletion.choices[0].message.content || "🐷 Oink! Couldn't fetch description.";
        } catch (err) {
            console.error(err);
            return "🐷 Oink! Error fetching description.";
        }
    };

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
                headers: { "Content-Type": "text/plain" },
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

            const recs: LandmarkItem[] = await Promise.all(
                elements.slice(0, 8).map(async (x: any) => {
                    const name = x.tags?.name ?? "Unnamed";
                    const lat = x.lat;
                    const lon = x.lon;
                    const description = await runAI(name);
                    return { name, lat, lon, description };
                })
            );

            setLandmarks(recs);
            setLandmarks(recs);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLandmarkRecs();
    }, []);


    return (
        <SafeAreaView style={{ flex: 1 }}>

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
                        style={styles.list}
                        data={landmarks}
                        keyExtractor={(item, index) => item.name + index}
                        renderItem={({ item }) => (
                            <View style={styles.listItem}>
                                <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.name}</Text>
                                <Text style={{ fontSize: 14 }}>{item.description}</Text>
                            </View>
                        )}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffe6f0",
    },
    loader: {
        marginTop: 16,
    },
    content: {
        flex: 1,
    },
    map: {
        width: Dimensions.get("window").width,
        height: 400,
    },
    list: {
        flex: 1,
        padding: 16,
    },
    listItem: {
        marginBottom: 12,
        padding: 14,
        borderRadius: 12,
        backgroundColor: theme.white,
        shadowColor: "#ff69b4",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    itemTitle: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 4,
        color: "#800040",
    },
    itemText: {
        fontSize: 14,
        marginBottom: 2,
        color: "#4d004d",
    },
});
