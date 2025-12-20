import React, { createContext, useState, useContext, useEffect } from 'react';
import { isCheckedInToday, getConsecutiveDays } from '../services/storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [consecutiveDays, setConsecutiveDays] = useState(0);
    const [userId] = useState('user_001'); // 临时用户ID，后续可以添加登录功能

    // 检查打卡状态
    const checkTodayStatus = async () => {
        const checkedIn = await isCheckedInToday();
        setIsCheckedIn(checkedIn);

        const days = await getConsecutiveDays();
        setConsecutiveDays(days);
    };

    useEffect(() => {
        checkTodayStatus();
    }, []);

    const value = {
        isCheckedIn,
        setIsCheckedIn,
        consecutiveDays,
        setConsecutiveDays,
        userId,
        refreshCheckInStatus: checkTodayStatus,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp 必须在 AppProvider 内部使用');
    }
    return context;
};
