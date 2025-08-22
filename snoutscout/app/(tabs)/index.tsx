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

 const Balloon = ({ emoji, startX }: { emoji: string; startX: number }) => {
	const { height } = Dimensions.get('window');
	const anim = useRef(new Animated.Value(height)).current;

	useEffect(() => {
		const loop = () => {
			anim.setValue(height);
			Animated.timing(anim, {
				toValue: -50,
				duration: 8000 + Math.random() * 4000, 
				
				easing: Easing.linear,
				useNativeDriver: true,
			}).start(() => loop());
		};
		loop();
	}, [anim]);

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

export default function HomeScreen() {
	const [text, setText] = useState('');
	const [response, setResponse] = useState('');
	const [loading, setLoading] = useState(false);

 	const confettiRef = useRef<ConfettiCannon | null>(null);

	const runAI = async (prompt: string) => {
		if (!prompt.trim()) return;

 		confettiRef.current?.start();

		setLoading(true);
		const chatCompletion = await groq.chat.completions.create({
			messages: [{
				role: 'user',
				content: "The user is someone who is travelling. You are to give advice regarding their destination in regards to safety, scams and any other general tips (feel free to add appropriate pig puns): " + prompt
			}],
			model: 'llama3-8b-8192',
		});
		setResponse(chatCompletion.choices[0].message.content || "🐷 Oink! Couldn't fetch advice.");
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
					<ThemedText type="title" style={styles.title}>{"\n          🐷 Travel Advice"}</ThemedText>
					<ThemedText type="default" style={styles.subtitle}>
						Get trip tips!
					</ThemedText>
				</ThemedView>

				<View style={styles.inputBox}>
					<TextInput
						style={styles.input}
						placeholder="Tell me about your destination:"
						placeholderTextColor={theme.piggyText + "99"}
						value={text}
						onChangeText={setText}
					/>
					<TouchableOpacity
						style={[styles.button, loading && styles.buttonDisabled]}
						disabled={loading}
						onPress={() => runAI(text)}
					>
						{loading ? (
							<ActivityIndicator color={theme.white} />
						) : (
							<ThemedText style={styles.buttonText}>Snout it out!</ThemedText>
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

 			<Balloon emoji="🎈" startX={30} />
			<Balloon emoji="🎈" startX={100} />
			<Balloon emoji="🎉" startX={200} />
			<Balloon emoji="🎈" startX={250} />
			<Balloon emoji="🎉" startX={320} />
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
	subtitle: {
		marginTop: 4,
		color: theme.hotPink,
		fontSize: 14,
	},
	inputBox: {
		marginBottom: 20,
	},
	input: {
		borderWidth: 2,
		borderColor: theme.hotPink,
		backgroundColor: theme.pinkLight,
		padding: 14,
		borderRadius: 20,
		fontSize: 16,
		color: theme.piggyText,
		marginBottom: 10,
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
	},
});
