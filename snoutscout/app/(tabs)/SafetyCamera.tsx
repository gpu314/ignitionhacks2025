import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from './theme';


export default function SafetyCamera() {

	const [facing, setFacing] = useState<CameraType>('back');
	const [permission, requestPermission] = useCameraPermissions();

	if (!permission) return <View />;
	if (!permission.granted) {
		return (
			<View style={styles.container}>
				<Text style={styles.message}>🐷 We need your permission to snout around!</Text>
				<Button onPress={requestPermission} title="Grant Piggy Permission" color={theme.hotPink} />
			</View>
		);
	}

	function toggleCameraFacing() {
		setFacing(current => (current === 'back' ? 'front' : 'back'));
	}

	return (
		<View style={styles.container}>
			<CameraView style={styles.camera} facing={facing}>
				<View style={styles.overlay}>
					<Text style={styles.safeText}> Snout Safe Mode</Text>
					<Text style={styles.detectText}> [ No Weapons Detected ] </Text>
				</View>

				<View style={styles.buttonContainer}>
					<TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
						<Text style={[styles.text, { color: theme.hotPink }]}>Flip Camera</Text>
					</TouchableOpacity>
				</View>
			</CameraView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: 'center' },
	message: { textAlign: 'center', paddingBottom: 10 },
	camera: { flex: 1 },
	overlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(255,182,193,0.15)",
	},
	safeText: { fontSize: 28, fontWeight: "bold", color: theme.hotPink, backgroundColor: theme.white },
	detectText: { marginTop: 10, fontWeight: "bold", color: theme.piggyText, backgroundColor: theme.pinkLight },
	buttonContainer: { flex: 1, flexDirection: 'row', backgroundColor: 'transparent', margin: 64 },
	button: { flex: 1, alignSelf: 'flex-end', alignItems: 'center' },
	text: { fontSize: 24, fontWeight: 'bold' },
});