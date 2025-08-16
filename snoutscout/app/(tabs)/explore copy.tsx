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

export default function TabTwoScreen() {
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const runAI = async (prompt: string) => {
    setLoading(true);
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: "The user is someone who is travelling. You are to give advice to regarding their destination in regards to safety, scams and any other general tips (feel free to add appropriate pig puns): " + prompt }],
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
        <ThemedText type="title">Advice</ThemedText>
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
          placeholder="🐷: Tell me where you're travelling to for some advice!"
        />
        <Button title="Submit" onPress={() => runAI(text)} />
      </View>
 
      {response ? (
        <Markdown>{`🐷: ${response}`}</Markdown>
      ) : null}
    </ParallaxScrollView>
  );
}