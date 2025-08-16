import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ActivityIndicator, SafeAreaView } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from './theme';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

export default function AdviceScreen() {
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const runAI = async (prompt: string) => {
    if (!prompt.trim()) return;
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
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>{"\n          🐷 Travel Advice"}

        </ThemedText>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
