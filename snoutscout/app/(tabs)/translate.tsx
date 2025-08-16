import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, View, Text } from 'react-native';
import Groq from 'groq-sdk';
import Markdown from 'react-native-markdown-display';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

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
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={
                <IconSymbol
                    size={310}
                    color="#808080"
                    name="chevron.left.forwardslash.chevron.right"
                />
            }
        >
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