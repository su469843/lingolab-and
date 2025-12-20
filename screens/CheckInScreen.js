import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { saveCheckIn, getCheckInRecords, getConsecutiveDays } from '../services/storage';
import { generateCalendarData, getMonthName, isToday } from '../utils/dateHelper';
import { useApp } from '../context/AppContext';

export default function CheckInScreen() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarData, setCalendarData] = useState([]);
    const { isCheckedIn, setIsCheckedIn, consecutiveDays, setConsecutiveDays, refreshCheckInStatus } = useApp();

    useEffect(() => {
        loadCalendarData();
    }, [currentDate]);

    const loadCalendarData = async () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const checkedInDates = await getCheckInRecords();
        const calendar = generateCalendarData(year, month, checkedInDates);
        setCalendarData(calendar);
    };

    const handleCheckIn = async () => {
        if (isCheckedIn) {
            Alert.alert('提示', '今天已经打卡了！');
            return;
        }

        const success = await saveCheckIn(new Date());
        if (success) {
            setIsCheckedIn(true);
            const days = await getConsecutiveDays();
            setConsecutiveDays(days);
            loadCalendarData();
            Alert.alert('成功', `打卡成功！已连续打卡 ${days} 天 🎉`);
        } else {
            Alert.alert('错误', '打卡失败，请重试');
        }
    };

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    const renderCalendar = () => {
        const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

        return (
            <View style={styles.calendarContainer}>
                {/* 星期标题 */}
                <View style={styles.weekRow}>
                    {weekDays.map((day, index) => (
                        <Text key={index} style={styles.weekDay}>
                            {day}
                        </Text>
                    ))}
                </View>

                {/* 日期网格 */}
                <View style={styles.daysGrid}>
                    {calendarData.map((item, index) => (
                        <View key={index} style={styles.dayCell}>
                            {item.day && (
                                <View
                                    style={[
                                        styles.dayCircle,
                                        item.isCheckedIn && styles.checkedDay,
                                        isToday(item.date) && styles.today,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.dayText,
                                            item.isCheckedIn && styles.checkedDayText,
                                            isToday(item.date) && styles.todayText,
                                        ]}
                                    >
                                        {item.day}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* 打卡统计 */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{consecutiveDays}</Text>
                    <Text style={styles.statLabel}>连续打卡天数</Text>
                </View>
            </View>

            {/* 打卡按钮 */}
            <TouchableOpacity
                style={[styles.checkInButton, isCheckedIn && styles.checkedInButton]}
                onPress={handleCheckIn}
                disabled={isCheckedIn}
            >
                <Text style={styles.checkInButtonText}>
                    {isCheckedIn ? '✓ 今日已打卡' : '点击打卡'}
                </Text>
            </TouchableOpacity>

            {/* 月份切换 */}
            <View style={styles.monthHeader}>
                <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.monthButton}>
                    <Text style={styles.monthButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.monthTitle}>
                    {currentDate.getFullYear()}年 {getMonthName(currentDate.getMonth())}
                </Text>
                <TouchableOpacity onPress={() => changeMonth(1)} style={styles.monthButton}>
                    <Text style={styles.monthButtonText}>→</Text>
                </TouchableOpacity>
            </View>

            {/* 日历 */}
            {renderCalendar()}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    statsContainer: {
        padding: 20,
        alignItems: 'center',
    },
    statCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        minWidth: 200,
    },
    statNumber: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#4A90E2',
    },
    statLabel: {
        fontSize: 16,
        color: '#7F8C8D',
        marginTop: 8,
    },
    checkInButton: {
        backgroundColor: '#4A90E2',
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#4A90E2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    checkedInButton: {
        backgroundColor: '#27AE60',
    },
    checkInButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    monthButton: {
        padding: 8,
    },
    monthButtonText: {
        fontSize: 24,
        color: '#4A90E2',
    },
    monthTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    calendarContainer: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    weekRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    weekDay: {
        flex: 1,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#7F8C8D',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%',
        aspectRatio: 1,
        padding: 2,
    },
    dayCircle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    checkedDay: {
        backgroundColor: '#4A90E2',
    },
    today: {
        borderWidth: 2,
        borderColor: '#E74C3C',
    },
    dayText: {
        fontSize: 14,
        color: '#2C3E50',
    },
    checkedDayText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    todayText: {
        fontWeight: 'bold',
    },
});
