import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import { getWords, getTTSAudio } from '../services/api';
import { useApp } from '../context/AppContext';

export default function WordsScreen() {
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playingId, setPlayingId] = useState(null);
    const { userId } = useApp();

    useEffect(() => {
        loadWords();
    }, []);

    const loadWords = async () => {
        try {
            setLoading(true);
            const data = await getWords(userId);
            setWords(data);
        } catch (error) {
            console.error('加载单词失败:', error);
            // 使用模拟数据
            setWords([
                {
                    id: 1,
                    word: 'hello',
                    phonetic: '/həˈloʊ/',
                    meaning: '你好；问候',
                    example: 'Hello, how are you?',
                },
                {
                    id: 2,
                    word: 'world',
                    phonetic: '/wɜːrld/',
                    meaning: '世界；地球',
                    example: 'Welcome to the world.',
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const playTTS = async (word, id) => {
        try {
            setPlayingId(id);
            const audioUrl = await getTTSAudio(word);

            const { sound } = await Audio.Sound.createAsync(
                { uri: audioUrl },
                { shouldPlay: true }
            );

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    setPlayingId(null);
                    sound.unloadAsync();
                }
            });
        } catch (error) {
            console.error('播放 TTS 失败:', error);
            setPlayingId(null);
        }
    };

    const renderWord = ({ item }) => (
        <View style={styles.wordCard}>
            <View style={styles.wordHeader}>
                <Text style={styles.word}>{item.word}</Text>
                <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => playTTS(item.word, item.id)}
                    disabled={playingId === item.id}
                >
                    <Text style={styles.playButtonText}>
                        {playingId === item.id ? '🔊' : '🔈'}
                    </Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.phonetic}>{item.phonetic}</Text>
            <Text style={styles.meaning}>{item.meaning}</Text>
            {item.example && (
                <Text style={styles.example}>例句: {item.example}</Text>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text style={styles.loadingText}>加载中...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={words}
                renderItem={renderWord}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    listContainer: {
        padding: 16,
    },
    wordCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    wordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    word: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    playButton: {
        padding: 8,
    },
    playButtonText: {
        fontSize: 24,
    },
    phonetic: {
        fontSize: 16,
        color: '#7F8C8D',
        marginBottom: 8,
    },
    meaning: {
        fontSize: 16,
        color: '#34495E',
        marginBottom: 8,
    },
    example: {
        fontSize: 14,
        color: '#95A5A6',
        fontStyle: 'italic',
    },
});
