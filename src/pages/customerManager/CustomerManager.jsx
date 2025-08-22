import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Dữ liệu mẫu cho biểu đồ Gantt với 14 nhân viên và công việc ngắn
const generateRandomTasks = (numPeople, numTasks) => {
  const tasks = [];
  const baseDate = new Date('2025-08-01');
  const pics = Array.from({ length: numPeople }, (_, i) => `Minh ${i + 1}`);

  for (let i = 0; i < numTasks; i++) {
    const pic = pics[Math.floor(Math.random() * pics.length)];
    const startDay = Math.floor(Math.random() * 25) + 1;
    const duration = Math.floor(Math.random() * 2) + 1;
    const startDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), startDay);
    const endDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), startDay + duration - 1);
    
    tasks.push({
      id: i + 1,
      name: `Công việc ${i + 1}`,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      pic: pic,
    });
  }
  return tasks;
};

const initialTasks = generateRandomTasks(14, 25);

const App = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);

  // Lấy các ngày trong tháng và thứ trong tuần
  const getDaysAndWeekdaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      days.push({
        day: i,
        weekday: weekdays[day.getDay()],
      });
    }
    return days;
  };

  const daysInMonth = getDaysAndWeekdaysInMonth(currentMonth);

  // Chuyển đổi tháng
  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1);
      return newMonth;
    });
  };

  const handleThisMonth = () => {
    setCurrentMonth(today);
  };

  // Định dạng tên tháng và năm
  const formattedMonth = currentMonth.toLocaleString('vi-VN', { month: 'long', year: 'numeric' });

  // Lọc các công việc của tháng hiện tại và nhóm theo PIC
  const tasksInCurrentMonth = initialTasks.filter(task => {
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.endDate);
    const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const currentMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    return (
      (startDate <= currentMonthEnd && endDate >= currentMonthStart)
    );
  });

  const groupedTasks = tasksInCurrentMonth.reduce((acc, task) => {
    (acc[task.pic] = acc[task.pic] || []).push(task);
    return acc;
  }, {});

  const pics = Object.keys(groupedTasks);

  const getTaskStyle = (task, daysInMonth) => {
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.endDate);
    const currentMonthYear = currentMonth.getFullYear();
    const currentMonthIndex = currentMonth.getMonth();

    const startOfMonth = new Date(currentMonthYear, currentMonthIndex, 1);
    const endOfMonth = new Date(currentMonthYear, currentMonthIndex + 1, 0);

    const taskStart = startDate.getTime() < startOfMonth.getTime() ? startOfMonth : startDate;
    const taskEnd = endDate.getTime() > endOfMonth.getTime() ? endOfMonth : endDate;

    const totalDaysInMonth = daysInMonth.length;
    const offsetDays = Math.max(0, (taskStart.getTime() - startOfMonth.getTime()) / (1000 * 3600 * 24));
    const durationInDays = Math.max(0, (taskEnd.getTime() - taskStart.getTime()) / (1000 * 3600 * 24) + 1);

    const leftPercentage = (offsetDays / totalDaysInMonth) * 100;
    const widthPercentage = (durationInDays / totalDaysInMonth) * 100;
    
    // Màu sắc ngẫu nhiên
    const colors = ['bg-indigo-500', 'bg-teal-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500'];
    const randomColor = colors[task.id % colors.length];

    return {
      left: `${leftPercentage}%`,
      width: `${widthPercentage}%`,
      backgroundColor: randomColor.replace('bg-', ''), // Lấy màu từ tên lớp Tailwind
    };
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 font-sans antialiased">
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md">

        {/* Header */}
        <div className="mb-6 border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-2xl font-bold text-gray-800">Biểu đồ Gantt Dự án</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="bg-gray-200 text-gray-800 p-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xl font-bold text-gray-800">{formattedMonth}</span>
            <button
              onClick={handleNextMonth}
              className="bg-gray-200 text-gray-800 p-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleThisMonth}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Tháng này
            </button>
          </div>
        </div>

        {/* Biểu đồ Gantt chính */}
        <div className="pt-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-20 w-48 min-w-[12rem]">
                    Nhân viên
                  </th>
                  {daysInMonth.map((day, index) => (
                    <th
                      key={index}
                      className={`px-2 py-3 text-center font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 w-12 min-w-[3rem] ${day.day % 2 !== 0 ? 'bg-gray-100' : ''}`}
                    >
                      {day.weekday}
                    </th>
                  ))}
                </tr>
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-20 w-48 min-w-[12rem]"></th>
                  {daysInMonth.map((day, index) => (
                    <th
                      key={index}
                      className={`px-2 py-3 text-center font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 w-12 min-w-[3rem] ${day.day % 2 !== 0 ? 'bg-gray-100' : ''}`}
                    >
                      {day.day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pics.map((pic, picIndex) => (
                  <tr key={pic}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-800 border-r border-gray-200 sticky left-0 bg-white z-10 w-48 min-w-[12rem]">
                      {pic}
                    </td>
                    <td colSpan={daysInMonth.length} className="relative p-0">
                      {groupedTasks[pic].map((task, taskIndex) => {
                        const style = getTaskStyle(task, daysInMonth);
                        const topOffset = taskIndex * 20 + 5;
                        return (
                          <div
                            key={task.id}
                            className={`rounded-full shadow-lg h-5 text-white text-xs font-bold flex items-center justify-center absolute inset-y-0 p-1 transition-all duration-300`}
                            style={{
                              ...style,
                              top: `${topOffset}px`,
                            }}
                            title={`${task.name} (${task.pic}) - ${task.startDate} đến ${task.endDate}`}
                          >
                            <span className="truncate">{task.name}</span>
                          </div>
                        );
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
