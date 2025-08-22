import React, { useState, useEffect } from "react";
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, Linking, StyleSheet, Dimensions } from "react-native";
import { MapView, Marker } from "./Map";
import { theme } from './theme'
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
});

type FoodItem = {
    name: string;
    cuisine: string;
    website: string;
    lat: number;
    lon: number;
    map_link: string;
    description: string;
};

export default function FoodScreen() {
    const [loading, setLoading] = useState(false);
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [region, setRegion] = useState({
        latitude: 43.655864,
        longitude: -79.382495,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    });

    const runAI = async (placeName: string): Promise<string> => {
        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: `Write a short description (1-3 sentences) about the food place: ${placeName}`,
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

    const fetchFoodRecs = async () => {
        setLoading(true);

        const lat = 43.655863594186755;
        const lon = -79.38249460259485;
        const radius = 1000;

        const query = `
            [out:json];
            node["amenity"~"restaurant|fast_food|cafe"]
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
                console.log("food fail");
                return;
            }

            const data = await resp.json();
            const elements = data.elements || [];

            if (elements.length === 0) {
                console.log("no food");
                return;
            }

            const recs: FoodItem[] = elements.slice(0, 10).map((x: any) => {
                const name = x.tags?.name ?? "Unnamed";
                const cuisine = x.tags?.cuisine ?? "unknown cuisine";
                const website = x.tags?.website ?? "unknown website";
                const lat = x.lat;
                const lon = x.lon;
                const map_link = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
                const description = runAI(name);
                return { name, cuisine, website, lat, lon, map_link, description };
            });

            setFoods(recs);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoodRecs();
    }, []);


    return (
        <SafeAreaView style={{ flex: 1 }}>
            {loading && <ActivityIndicator size="large" style={{ marginTop: 16 }} />}

            {!loading && foods.length > 0 && (
                <View style={{ flex: 1 }}>
                    <MapView
                        style={{ width: Dimensions.get("window").width, height: 400 }}
                        initialRegion={region}
                    >
                        {foods.map((item, index) => (
                            <Marker
                                key={index}
                                coordinate={{ latitude: item.lat, longitude: item.lon }}
                                title={item.name}
                                description={item.cuisine}
                                onCalloutPress={() => Linking.openURL(item.map_link)}
                            />
                        ))}
                    </MapView>

                    <FlatList
                        style={styles.list}
                        data={foods}
                        keyExtractor={(item, index) => item.name + index}
                        renderItem={({ item }) => (
                            <View style={styles.listItem}>
                                <Text style={styles.itemTitle}>🐷 {item.name}</Text>
                                <Text style={styles.itemText}>Cuisine: {item.cuisine}</Text>
                                <Text style={styles.itemText}>Website: {item.website}</Text>
                                <Text style={styles.itemText}>Description: {item.description}</Text>
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
