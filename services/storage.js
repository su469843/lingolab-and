import AsyncStorage from '@react-native-async-storage/async-storage';

const CHECKIN_KEY = '@checkin_records';

// 保存打卡记录
export const saveCheckIn = async (date) => {
    try {
        const existingRecords = await getCheckInRecords();
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

        if (!existingRecords.includes(dateStr)) {
            existingRecords.push(dateStr);
            await AsyncStorage.setItem(CHECKIN_KEY, JSON.stringify(existingRecords));
        }

        return true;
    } catch (error) {
        console.error('保存打卡记录失败:', error);
        return false;
    }
};

// 获取所有打卡记录
export const getCheckInRecords = async () => {
    try {
        const records = await AsyncStorage.getItem(CHECKIN_KEY);
        return records ? JSON.parse(records) : [];
    } catch (error) {
        console.error('获取打卡记录失败:', error);
        return [];
    }
};

// 检查今天是否已打卡
export const isCheckedInToday = async () => {
    try {
        const records = await getCheckInRecords();
        const today = new Date().toISOString().split('T')[0];
        return records.includes(today);
    } catch (error) {
        console.error('检查打卡状态失败:', error);
        return false;
    }
};

// 计算连续打卡天数
export const getConsecutiveDays = async () => {
    try {
        const records = await getCheckInRecords();
        if (records.length === 0) return 0;

        // 按日期排序（最新的在前）
        const sortedRecords = records.sort((a, b) => new Date(b) - new Date(a));

        let consecutiveDays = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < sortedRecords.length; i++) {
            const recordDate = new Date(sortedRecords[i]);
            recordDate.setHours(0, 0, 0, 0);

            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - i);
            expectedDate.setHours(0, 0, 0, 0);

            if (recordDate.getTime() === expectedDate.getTime()) {
                consecutiveDays++;
            } else {
                break;
            }
        }

        return consecutiveDays;
    } catch (error) {
        console.error('计算连续打卡天数失败:', error);
        return 0;
    }
};

// 获取本月打卡记录
export const getMonthCheckIns = async (year, month) => {
    try {
        const allRecords = await getCheckInRecords();
        return allRecords.filter(dateStr => {
            const date = new Date(dateStr);
            return date.getFullYear() === year && date.getMonth() === month;
        });
    } catch (error) {
        console.error('获取本月打卡记录失败:', error);
        return [];
    }
};
