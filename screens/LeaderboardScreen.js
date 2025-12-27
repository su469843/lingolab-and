
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { getLeaderboard } from '../services/api';

export default function LeaderboardScreen() {
    const [leaderboardData, setLeaderboardData] = useState({ wordLeaderboard: [], phoneticLeaderboard: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('word'); // 'word' 或 'phonetic'

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            setLoading(true);
            const data = await getLeaderboard();
            // 如果接口返回的是正确格式的对象
            if (data && (data.wordLeaderboard || data.phoneticLeaderboard)) {
                setLeaderboardData({
                    wordLeaderboard: data.wordLeaderboard || [],
                    phoneticLeaderboard: data.phoneticLeaderboard || []
                });
            } else if (Array.isArray(data)) {
                // 如果是旧的数组格式，则放入 wordLeaderboard
                setLeaderboardData(prev => ({ ...prev, wordLeaderboard: data }));
            }
        } catch (error) {
            console.error('加载排行榜失败:', error);
            // 这里就不强制使用模拟数据了，保持空列表或显示错误
        } finally {
            setLoading(false);
        }
    };

    const currentList = activeTab === 'word' ? leaderboardData.wordLeaderboard : leaderboardData.phoneticLeaderboard;

    const renderItem = ({ item, index }) => {
        const rank = index + 1;
        const getRankColor = () => {
            if (rank === 1) return '#FFD700';
            if (rank === 2) return '#C0C0C0';
            if (rank === 3) return '#CD7F32';
            return '#4A90E2';
        };

        return (
            <View style={styles.rankCard}>
                <View style={[styles.rankBadge, { backgroundColor: getRankColor() }]}>
                    <Text style={styles.rankNumber}>{rank}</Text>
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.username}>{item.display_name || item.username || '匿名用户'}</Text>
                    <Text style={styles.score}>{item.count || item.score || 0} {activeTab === 'word' ? '词' : '关'}</Text>
                </View>
            </View>
        );
    };

    const emptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无排行数据</Text>
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
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'word' && styles.activeTab]}
                        onPress={() => setActiveTab('word')}
                    >
                        <Text style={[styles.tabText, activeTab === 'word' && styles.activeTabText]}>单词排行</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'phonetic' && styles.activeTab]}
                        onPress={() => setActiveTab('phonetic')}
                    >
                        <Text style={[styles.tabText, activeTab === 'phonetic' && styles.activeTabText]}>音标排行</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={currentList}
                renderItem={renderItem}
                keyExtractor={(item, index) => (item.id || index).toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={emptyComponent}
                refreshing={loading}
                onRefresh={loadLeaderboard}
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
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        fontSize: 16,
    },
    header: {
        backgroundColor: '#4A90E2',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 15,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        padding: 4,
    },
    tabButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 16,
    },
    activeTab: {
        backgroundColor: '#FFFFFF',
    },
    tabText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    activeTabText: {
        color: '#4A90E2',
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
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    rankBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    rankNumber: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
    },
    score: {
        fontSize: 14,
        color: '#7F8C8D',
        fontWeight: 'bold',
    },
});
