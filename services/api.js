import axios from 'axios';

// API 基础配置
const API_BASE_URL = 'https://em.20204.xyz/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 获取单词列表
export const getWords = async (userId) => {
    try {
        const response = await api.get('/words', {
            params: { userId },
        });
        return response.data;
    } catch (error) {
        console.error('获取单词列表失败:', error);
        throw error;
    }
};

// 获取句子列表
export const getSentences = async (userId) => {
    try {
        const response = await api.get('/sentences', {
            params: { userId },
        });
        return response.data;
    } catch (error) {
        console.error('获取句子列表失败:', error);
        throw error;
    }
};

// 获取排行榜
export const getLeaderboard = async () => {
    try {
        const response = await api.get('/stats/leaderboard');
        return response.data;
    } catch (error) {
        console.error('获取排行榜失败:', error);
        throw error;
    }
};

// 获取 TTS 音频 URL
export const getTTSAudio = async (text, language = 'en') => {
    try {
        const response = await api.post('/tts', {
            text,
            language,
        });
        return response.data.audioUrl;
    } catch (error) {
        console.error('获取 TTS 音频失败:', error);
        throw error;
    }
};

export default api;
