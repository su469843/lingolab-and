import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { getLeaderboard } from '../services/api';

export default function LeaderboardScreen() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            setLoading(true);
            const data = await getLeaderboard();
            setLeaderboard(data);
        } catch (error) {
            console.error('加载排行榜失败:', error);
            // 使用模拟数据
            setLeaderboard([
                { id: 1, rank: 1, username: '学习达人', score: 1250, avatar: '🏆' },
                { id: 2, rank: 2, username: '英语高手', score: 1100, avatar: '🥈' },
                { id: 3, rank: 3, username: '勤奋学生', score: 980, avatar: '🥉' },
                { id: 4, rank: 4, username: '进步之星', score: 850, avatar: '⭐' },
                { id: 5, rank: 5, username: '坚持者', score: 720, avatar: '💪' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.rankCard}>
            <View style={styles.rankBadge}>
                <Text style={styles.rankNumber}>{item.rank}</Text>
            </View>
            <Text style={styles.avatar}>{item.avatar}</Text>
            <View style={styles.userInfo}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.score}>{item.score} 分</Text>
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
            <View style={styles.header}>
                <Text style={styles.title}>🏅 学习排行榜</Text>
                <Text style={styles.subtitle}>看看谁是学习之星</Text>
            </View>
            <FlatList
                data={leaderboard}
                renderItem={renderItem}
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
    header: {
        backgroundColor: '#4A90E2',
        padding: 24,
        paddingTop: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#E8F4FD',
    },
    listContainer: {
        padding: 16,
    },
    rankCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    rankBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4A90E2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rankNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    avatar: {
        fontSize: 32,
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 4,
    },
    score: {
        fontSize: 14,
        color: '#7F8C8D',
    },
});
