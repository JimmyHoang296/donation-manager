import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

// Dữ liệu mẫu cho biểu đồ Gantt với 14 nhân viên và công việc ngắn
const generateRandomTasks = (numPeople, numTasks) => {
  const tasks = [];
  const baseDate = new Date("2025-08-01");
  const allPics = Array.from({ length: numPeople }, (_, i) => `Minh ${i + 1}`);

  for (let i = 0; i < numTasks; i++) {
    const pic = allPics[Math.floor(Math.random() * allPics.length)];
    const startDay = Math.floor(Math.random() * 25) + 1;
    const duration = Math.floor(Math.random() * 3) + 1;
    const startDate = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      startDay
    );
    const endDate = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      startDay + duration - 1
    );

    tasks.push({
      id: i + 1,
      name: `Công việc ${i + 1}`,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      pic: pic,
    });
  }
  return tasks;
};

const initialTasks = generateRandomTasks(14, 25);

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [filterText, setFilterText] = useState("");
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editedTask, setEditedTask] = useState(null);

  const allPics = Array.from({ length: 14 }, (_, i) => `Minh ${i + 1}`);

  const filteredPics = allPics.filter((pic) =>
    pic.toLowerCase().includes(filterText.toLowerCase())
  );

  const getDaysAndWeekdaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

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

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  const handleThisMonth = () => {
    setCurrentMonth(today);
  };

  const formattedMonth = currentMonth.toLocaleString("vi-VN", {
    month: "long",
    year: "numeric",
  });

  const tasksInCurrentMonth = tasks.filter((task) => {
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.endDate);
    const startMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    return startDate <= endMonth && endDate >= startMonth;
  });

  const tasksWithPicIndex = tasksInCurrentMonth.map((task) => ({
    ...task,
    picIndex: allPics.findIndex((pic) => pic === task.pic),
  }));

  const gridTemplateColumns = `minmax(12rem, auto) repeat(${daysInMonth.length}, minmax(3rem, 1fr))`;

  const getTaskGridStyle = (task) => {
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.endDate);

    const taskStartDay = Math.max(1, startDate.getDate());
    const taskEndDay = Math.min(daysInMonth.length, endDate.getDate());

    const startColumn = taskStartDay + 1; // +1 vì cột đầu tiên là tên nhân viên
    const endColumn = taskEndDay + 2;

    const colors = ["bg-indigo-500", "bg-teal-500", "bg-green-500", "bg-orange-500", "bg-red-500"];
    const colorClass = colors[task.id % colors.length];

    return { gridColumnStart: startColumn, gridColumnEnd: endColumn, colorClass };
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setEditedTask({ ...task });
    setIsModalOpen(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!editedTask) return;
    setTasks(tasks.map((t) => (t.id === editedTask.id ? editedTask : t)));
    setIsModalOpen(false);
    setSelectedTask(null);
    setEditedTask(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setEditedTask(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 font-sans antialiased">
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md">
        {/* Header */}
        <div className="mb-6 border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-2xl font-bold text-gray-800">Biểu đồ Gantt Dự án</h2>
          <div className="flex items-center gap-2">
            <button onClick={handlePrevMonth} className="bg-gray-200 text-gray-800 p-2 rounded-lg hover:bg-gray-300">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xl font-bold text-gray-800">{formattedMonth}</span>
            <button onClick={handleNextMonth} className="bg-gray-200 text-gray-800 p-2 rounded-lg hover:bg-gray-300">
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleThisMonth}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
            >
              Tháng này
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Gantt Chart */}
        <div className="pt-4 overflow-x-auto overflow-y-auto max-h-[500px]">
          <div
            className="grid gap-px border border-gray-200"
            style={{ gridTemplateColumns }}
          >
            {/* Header rows */}
            <div className="p-3 border-r border-gray-200 bg-gray-50 font-semibold text-center sticky top-0 left-0 z-20">
              Nhân viên
            </div>
            {daysInMonth.map((d, i) => (
              <div key={`wd-${i}`} className="p-3 border-r border-gray-200 bg-gray-50 font-semibold text-center sticky top-0 z-20">
                {d.weekday}
              </div>
            ))}
            <div className="p-3 border-r border-gray-200 bg-gray-50 font-semibold text-center sticky top-0 left-0 z-20"></div>
            {daysInMonth.map((d, i) => (
              <div key={`d-${i}`} className="p-3 border-r border-gray-200 bg-gray-50 font-semibold text-center sticky top-0 z-20">
                {d.day}
              </div>
            ))}

            {/* Task rows */}
            {filteredPics.map((pic, picIndex) => {
              const row = picIndex + 3;
              const picTasks = tasksWithPicIndex.filter((t) => t.pic === pic);

              return (
                <React.Fragment key={pic}>
                  {/* Name cell */}
                  <div
                    className="bg-white  border-b border-gray-200 px-4 py-2 font-semibold sticky left-0 z-10"
                    style={{ gridRowStart: row, gridColumnStart: 1 }}
                  >
                    {pic}
                  </div>

                  {/* Background cells */}
                  {daysInMonth.map((d, i) => (
                    <div
                      key={`bg-${pic}-${i}`}
                      className={`border-b border-gray-200 ${d.day % 2 !== 0 ? "bg-gray-100" : ""}`}
                      style={{ gridRowStart: row, gridColumnStart: i + 2 }}
                    />
                  ))}

                  {/* Task bars */}
                  {picTasks.map((task) => {
                    const { colorClass, gridColumnStart, gridColumnEnd } = getTaskGridStyle(task);
                    return (
                      <div
                        key={task.id}
                        className={`rounded-md shadow-md text-white text-xs font-bold flex items-center justify-center cursor-pointer ${colorClass}`}
                        style={{
                          gridRowStart: row,
                          gridColumnStart,
                          gridColumnEnd,
                          minHeight: "2rem",
                        }}
                        title={`${task.name} (${task.pic}) - ${task.startDate} → ${task.endDate}`}
                        onClick={() => handleTaskClick(task)}
                      >
                        <span className="truncate px-2">{task.name}</span>
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && editedTask && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Chỉnh sửa công việc</h3>
              <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên công việc</label>
                <input
                  type="text"
                  name="name"
                  value={editedTask.name}
                  onChange={handleModalChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
                <input
                  type="date"
                  name="startDate"
                  value={editedTask.startDate}
                  onChange={handleModalChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
                <input
                  type="date"
                  name="endDate"
                  value={editedTask.endDate}
                  onChange={handleModalChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Người phụ trách</label>
                <select
                  name="pic"
                  value={editedTask.pic}
                  onChange={handleModalChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {allPics.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={handleCancel} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                Hủy
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
