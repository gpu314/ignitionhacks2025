import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Text } from 'react-native';
import { theme } from './theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.piggyTextDark,
        tabBarInactiveTintColor: theme.piggyText,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.pinkLight,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 70,
        },
        tabBarLabelStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🐷</Text>,
        }}
      />
      <Tabs.Screen
        name="food"
        options={{
          title: "Food",
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🥓</Text>,
        }}
      />
      <Tabs.Screen
        name="Advice"
        options={{
          title: "Advice",
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🐖</Text>,
        }}
      />
      <Tabs.Screen
        name="SafetyCamera"
        options={{
          title: "Safety Camera",
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🐽</Text>,
        }}
      />
      <Tabs.Screen
        name="landmarks"
        options={{
          title: "Land Marks",
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>⛰</Text>,
        }}
      />

    </Tabs>
  );
}
