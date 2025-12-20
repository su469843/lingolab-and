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
import { getSentences, getTTSAudio } from '../services/api';
import { useApp } from '../context/AppContext';

export default function SentencesScreen() {
    const [sentences, setSentences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playingId, setPlayingId] = useState(null);
    const { userId } = useApp();

    useEffect(() => {
        loadSentences();
    }, []);

    const loadSentences = async () => {
        try {
            setLoading(true);
            const data = await getSentences(userId);
            setSentences(data);
        } catch (error) {
            console.error('加载句子失败:', error);
            // 使用模拟数据
            setSentences([
                {
                    id: 1,
                    text: 'Practice makes perfect.',
                    translation: '熟学生巧。',
                    source: 'Idiom',
                },
                {
                    id: 2,
                    text: 'Where there is a will, there is a way.',
                    translation: '有志者，事竟成。',
                    source: 'Proverb',
                },
                {
                    id: 3,
                    text: 'The early bird catches the worm.',
                    translation: '早起的鸟儿有虫吃。',
                    source: 'Proverb',
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const playTTS = async (text, id) => {
        try {
            setPlayingId(id);
            const audioUrl = await getTTSAudio(text);

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

    const renderSentence = ({ item }) => (
        <View style={styles.sentenceCard}>
            <Text style={styles.sentenceText}>{item.text}</Text>
            <Text style={styles.translationText}>{item.translation}</Text>
            <View style={styles.cardFooter}>
                <Text style={styles.sourceText}>{item.source}</Text>
                <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => playTTS(item.text, item.id)}
                    disabled={playingId === item.id}
                >
                    <Text style={styles.playButtonText}>
                        {playingId === item.id ? '🔊 播放中' : '🔈 朗读'}
                    </Text>
                </TouchableOpacity>
            </View>
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
                data={sentences}
                renderItem={renderSentence}
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
    sentenceCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sentenceText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
        lineHeight: 26,
        marginBottom: 10,
    },
    translationText: {
        fontSize: 16,
        color: '#7F8C8D',
        marginBottom: 15,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ECF0F1',
        paddingTop: 12,
    },
    sourceText: {
        fontSize: 12,
        color: '#BDC3C7',
        fontStyle: 'italic',
    },
    playButton: {
        backgroundColor: '#E8F4FD',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    playButtonText: {
        fontSize: 14,
        color: '#4A90E2',
        fontWeight: '500',
    },
});
