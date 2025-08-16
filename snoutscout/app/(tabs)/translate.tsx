import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, View, Text } from 'react-native';
import Groq from 'groq-sdk';
import Markdown from 'react-native-markdown-display';
import { theme } from './theme'
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Image } from 'expo-image';

const groq = new Groq({
    apiKey: "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",
    dangerouslyAllowBrowser: true,

});

export default function TranslateScreen() {
    const [text, setText] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const runAI = async (prompt: string) => {
        setLoading(true);
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a skilled italian to english translator. Explain the meaning of italian phrases and idioms in clear natural English. For example in bocca al lupo means good luck.' },
                { role: 'user', content: "Translate and explain this Italian expression in one sentence: " + text }
            ],
            model: 'llama3-8b-8192',
        });
        setResponse(chatCompletion.choices[0].message.content || "Oink! I see food, gotta run- can't answer your question, sorry.");
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: theme.pinkLight, dark: theme.pinkDark }}
            headerImage={
                <Image
                    source={require('@/assets/images/pig.png')}
                    style={styles.reactLogo}
                />
            }>
            <ThemedView >
                <ThemedText type="title">Translate</ThemedText>
            </ThemedView>


            <View style={{ marginVertical: 10 }}>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 8,
                        borderRadius: 4,
                        marginBottom: 10,
                    }}
                    value={text}
                    onChangeText={setText}
                    placeholder="🐷: Type the text you want me to translate!"
                />
                <Button title="Submit" onPress={() => runAI(text)} />
            </View>

            {response ? (
                <Markdown>{`🐷: ${response}`}</Markdown>
            ) : null}
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
