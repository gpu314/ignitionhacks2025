import React, { useState } from "react";
import { View, Text, Button, FlatList, SafeAreaView, ActivityIndicator, Linking, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";

type FoodItem = {
    name: string;
    cuisine: string;
    website: string;
    lat: number;
    lon: number;
    map_link: string;
}

export default function FoodScreen() {
    const [loading, setLoading] = useState(false);
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [region, setRegion] = useState({
        latitude: 43.655863594186755,
        longitude: -79.38249460259485,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    });

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
                headers: {"Content-Type": "text/plain"},
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
                return {name, cuisine, website, lat, lon, map_link};
            });

            setFoods(recs);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Button title="Generate Food Recommendations" onPress={fetchFoodRecs} />

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
                        style={{ flex: 1, padding: 16 }}
                        data={foods}
                        keyExtractor={(item, index) => item.name + index}
                        renderItem={({ item }) => (
                            <View style={styles.listItem}>
                                <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.name}</Text>
                                <Text>Cuisine: {item.cuisine}</Text>
                                <Text>Website: {item.website}</Text>
                                <Text
                                    style={{ color: "blue" }}
                                    onPress={() => Linking.openURL(item.map_link)}
                                >
                                    View on Google Maps
                                </Text>
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
