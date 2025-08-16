import { Image } from 'expo-image';
import { Button, FlatList, Platform, SafeAreaView, StyleSheet, View, Text, ActivityIndicator, Linking } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';

type FoodItem = {
    name: string;
    cuisine: string;
    website: string;
    lat: number;
    long: number;
    map_link: string;
}

export default function FoodScreen() {
    const [loading, setLoading] = useState(false);
    const [foods, setFoods] = useState<FoodItem[]>([]);

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

            const recs: FoodItem[] = elements.slice(0, 5).map((x: any) => {
                const name = x.tags?.name ?? "Unnamed";
                const cuisine = x.tags?.cuisine ?? "unknown cusine";
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
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Button title="get food" onPress={fetchFoodRecs} />
      
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 16 }} />
      ) : foods.length === 0 ? (
        <Text style={{ marginTop: 16 }}>none</Text>
      ) : (
        <FlatList
          data={foods}
          keyExtractor={(item, index) => item.name + index}
          renderItem={({ item }) => (
            <View
              style={{
                marginVertical: 8,
                padding: 12,
                borderRadius: 8,
                backgroundColor: "#f0f0f0",
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.name}</Text>
              <Text>Cuisine: {item.cuisine}</Text>
              <Text>Website: {item.website}</Text>
              <Text
                style={{ color: "blue" }}
                onPress={() => Linking.openURL(item.map_link)}
              >
                View on Map
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}