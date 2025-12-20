import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './context/AppContext';

import WordsScreen from './screens/WordsScreen';
import SentencesScreen from './screens/SentencesScreen';
import CheckInScreen from './screens/CheckInScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#4A90E2',
            tabBarInactiveTintColor: '#95A5A6',
            tabBarStyle: {
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
            },
            headerStyle: {
              backgroundColor: '#4A90E2',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Tab.Screen
            name="Words"
            component={WordsScreen}
            options={{
              title: '单词学习',
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📚</Text>,
            }}
          />
          <Tab.Screen
            name="Sentences"
            component={SentencesScreen}
            options={{
              title: '精彩句子',
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>✍️</Text>,
            }}
          />
          <Tab.Screen
            name="CheckIn"
            component={CheckInScreen}
            options={{
              title: '每日打卡',
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>✓</Text>,
            }}
          />
          <Tab.Screen
            name="Leaderboard"
            component={LeaderboardScreen}
            options={{
              title: '排行榜',
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏆</Text>,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

