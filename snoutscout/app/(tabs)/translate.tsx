import { Image } from 'expo-image';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ActivityIndicator, Dimensions, Animated, Easing } from 'react-native';
import Markdown from 'react-native-markdown-display';
import Groq from 'groq-sdk';
import ConfettiCannon from 'react-native-confetti-cannon';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from './theme';

const groq = new Groq({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
});

const { width, height } = Dimensions.get('window');

 const FloatingBalloon = ({ emoji, startX, duration }: { emoji: string; startX: number; duration: number }) => {
    const anim = useRef(new Animated.Value(height)).current;

    useEffect(() => {
        Animated.timing(anim, {
            toValue: -50,
            duration,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    }, [anim, duration]);

    return (
        <Animated.Text
            style={{
                position: 'absolute',
                left: startX,
                transform: [{ translateY: anim }],
                fontSize: 32,
                zIndex: 999,
            }}
        >
            {emoji}
        </Animated.Text>
    );
};

export default function TranslateScreen() {
    const [text, setText] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [balloons, setBalloons] = useState<{ id: number; emoji: string; startX: number; duration: number }[]>([]);
    const balloonCounter = useRef(0);
    const confettiRef = useRef<ConfettiCannon | null>(null);

     useEffect(() => {
        const interval = setInterval(() => {
            const emojis = ['🎈', '🎉', '🎈', '🎉'];
            const newBalloon = {
                id: balloonCounter.current++,
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
                startX: Math.random() * (width - 50),
                duration: 6000 + Math.random() * 4000,
            };
            setBalloons((prev) => [...prev, newBalloon]);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    const runAI = async (prompt: string) => {
        if (!prompt.trim()) return;

         confettiRef.current?.start();

        setLoading(true);
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a skilled italian to english translator. Explain the meaning of italian phrases and idioms in clear natural English. For example in bocca al lupo means good luck.' },
                { role: 'user', content: "Translate and explain this Italian expression in one sentence: " + text }
            ],
            model: 'llama3-8b-8192',
        });
        setResponse(chatCompletion.choices[0].message.content || "🐷 Oink! Couldn't answer your question.");
        setLoading(false);
    };

    return (
        <View style={{ flex: 1 }}>
            <ParallaxScrollView
                headerBackgroundColor={{ light: theme.pinkLight, dark: theme.pinkDark }}
                headerImage={
                    <Image
                        source={require('@/assets/images/pig.png')}
                        style={styles.reactLogo}
                    />
                }>
                <ThemedView style={styles.header}>
                    <ThemedText type="title" style={styles.title}>Translate</ThemedText>
                </ThemedView>

                <View style={{ marginVertical: 10, paddingHorizontal: 16 }}>
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
                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        disabled={loading}
                        onPress={() => runAI(text)}
                    >
                        {loading ? (
                            <ActivityIndicator color={theme.white} />
                        ) : (
                            <ThemedText style={styles.buttonText}>Translate!</ThemedText>
                        )}
                    </TouchableOpacity>
                </View>

                {response ? (
                    <View style={styles.responseBox}>
                        <Markdown style={{ body: { color: theme.piggyText, fontSize: 16 } }}>
                            {`🐷: ${response}`}
                        </Markdown>
                    </View>
                ) : null}
            </ParallaxScrollView>

             <ConfettiCannon
                count={150}
                origin={{ x: -10, y: 0 }}
                autoStart={false}
                fadeOut={true}
                colors={['#FF69B4', '#FFD700', '#FF1493', '#FF6347', '#ADFF2F']}
                ref={confettiRef}
            />

             {balloons.map((b) => (
                <FloatingBalloon
                    key={b.id}
                    emoji={b.emoji}
                    startX={b.startX}
                    duration={b.duration}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        color: theme.piggyText,
        fontSize: 28,
        fontWeight: 'bold',
    },
    inputBox: {
        marginBottom: 20,
    },
    button: {
        backgroundColor: theme.piggyText,
        paddingVertical: 14,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: theme.hotPink,
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 3,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: theme.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    responseBox: {
        backgroundColor: theme.pinkLight,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.hotPink,
        marginHorizontal: 16,
        marginBottom: 20,
    },
});
