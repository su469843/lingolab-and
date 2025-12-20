// 格式化日期为 YYYY-MM-DD
export const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

// 获取月份的天数
export const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
};

// 获取月份的第一天是星期几（0-6，0是周日）
export const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
};

// 生成日历数据
export const generateCalendarData = (year, month, checkedInDates) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const calendar = [];

    // 添加空白天数（月初）
    for (let i = 0; i < firstDay; i++) {
        calendar.push({ day: null, isCheckedIn: false });
    }

    // 添加实际日期
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = formatDate(new Date(year, month, day));
        calendar.push({
            day,
            date: dateStr,
            isCheckedIn: checkedInDates.includes(dateStr),
        });
    }

    return calendar;
};

// 获取月份名称
export const getMonthName = (month) => {
    const months = [
        '一月', '二月', '三月', '四月', '五月', '六月',
        '七月', '八月', '九月', '十月', '十一月', '十二月'
    ];
    return months[month];
};

// 检查是否是今天
export const isToday = (dateStr) => {
    const today = formatDate(new Date());
    return dateStr === today;
};
