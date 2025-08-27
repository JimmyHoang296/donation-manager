import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { mockdata } from "../../assets/mockData";

const Calendar = ({ data }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [filterText, setFilterText] = useState("");
  const [filterTaskText, setFilterTaskText] = useState(""); // 🔹 search task by name
  const [tasks, setTasks] = useState(
    data.services.map((s) => ({
      id: s.id,
      name: s.name,
      pic: s.pic,
      startDate: s.startDate,
      endDate: s.endDate,
    }))
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editedTask, setEditedTask] = useState(null);

  const allPics = data.emps;
  // Lọc PIC theo filterText
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
      days.push({ day: i, weekday: weekdays[day.getDay()] });
    }
    return days;
  };

  const daysInMonth = getDaysAndWeekdaysInMonth(currentMonth);

  const handlePrevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };
  const handleNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };
  const handleThisMonth = () => {
    setCurrentMonth(today);
  };

  const formattedMonth = currentMonth.toLocaleString("vi-VN", {
    month: "long",
    year: "numeric",
  });

  // Lọc task theo tháng hiện tại
  const tasksInCurrentMonth = tasks.filter((task) => {
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.endDate);
    const startMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const endMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );
    return startDate <= endMonth && endDate >= startMonth;
  });

  // 🔹 Lọc thêm theo tên task
  const tasksFilteredByName = tasksInCurrentMonth.filter((t) =>
    t.name.toLowerCase().includes(filterTaskText.toLowerCase())
  );

  const tasksWithPicIndex = tasksFilteredByName.map((task) => ({
    ...task,
    picIndex: allPics.findIndex((pic) => pic === task.pic),
  }));

  const gridTemplateColumns = `12rem repeat(${daysInMonth.length}, 5rem)`;

  const getTaskGridStyle = (task) => {
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.endDate);

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day & last day of the current month
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month, daysInMonth.length);

    // Clamp task to the visible month
    const visibleStart = startDate < monthStart ? monthStart : startDate;
    const visibleEnd = endDate > monthEnd ? monthEnd : endDate;

    // Convert to day-of-month
    const taskStartDay = visibleStart.getDate();
    const taskEndDay = visibleEnd.getDate();

    const startColumn = taskStartDay + 1; // +1 for grid offset
    const endColumn = taskEndDay + 2; // +2 to include end cell

    const colors = [
      "bg-indigo-500",
      "bg-teal-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-red-500",
    ];
    const colorClass = colors[Math.floor(Math.random() * colors.length)];

    return {
      gridColumnStart: startColumn,
      gridColumnEnd: endColumn,
      colorClass,
    };
  };
  // const getTaskGridStyle = (task) => {
  //   const startDate = new Date(task.startDate);
  //   const endDate = new Date(task.endDate);
  //   const taskStartDay = Math.max(1, startDate.getDate());
  //   const taskEndDay = Math.min(daysInMonth.length, endDate.getDate());
  //   const startColumn = taskStartDay + 1;
  //   const endColumn = taskEndDay + 2;
  //   const colors = [
  //     "bg-indigo-500",
  //     "bg-teal-500",
  //     "bg-green-500",
  //     "bg-orange-500",
  //     "bg-red-500",
  //   ];
  //   const colorClass = colors[Math.floor(Math.random() * colors.length)];
  //   return {
  //     gridColumnStart: startColumn,
  //     gridColumnEnd: endColumn,
  //     colorClass,
  //   };
  // };

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

  // 🔹 Tách riêng task không có PIC
  console.log(tasksFilteredByName)
  const noPicTasks = tasksFilteredByName.filter((t) => !t.pic);

  console.log(noPicTasks);

  return (
    <div className="bg-gray-100 min-h-screen font-sans antialiased">
      <div className="w-100% mx-auto p-6 bg-white rounded-xl shadow-md">
        {/* Header */}
        <div className="mb-6 border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 overflow-x-auto overflow-y-auto min-w-max">
          <h2 className="text-2xl font-bold text-gray-800">
            Phân công lịch dự án
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="bg-gray-200 text-gray-800 p-2 rounded-lg hover:bg-gray-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xl font-bold text-gray-800">
              {formattedMonth}
            </span>
            <button
              onClick={handleNextMonth}
              className="bg-gray-200 text-gray-800 p-2 rounded-lg hover:bg-gray-300"
            >
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

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm công việc..."
              value={filterTaskText}
              onChange={(e) => setFilterTaskText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Gantt Chart */}
        <div className="relative h-[calc(100vh-16rem)] overflow-scroll">
          <div
            className="grid border gap-y-1 border-gray-200 min-w-max min-h-max"
            style={{ gridTemplateColumns }}
          >
            {/* Header row */}
            <div className="p-3 border-r border-gray-200 bg-gray-50 font-semibold text-center sticky top-0 left-0 z-40">
              Nhân viên
            </div>

            {daysInMonth.map((d, i) => (
              <div
                key={`wd-${i}`}
                className={`p-0 border-r border-gray-200 ${
                  d.weekday === "T7" || d.weekday === "CN"
                    ? "bg-red-200"
                    : "bg-gray-50"
                } font-semibold text-center sticky top-0 z-30 shadow-md`}
              >
                <p>{d.weekday}</p>
                <p>{d.day}</p>
              </div>
            ))}

            {/* 🔹 Row for tasks without PIC */}
            { (
              <>
                <div
                  className="bg-yellow-100 border-b border-gray-300 px-4 py-2 font-semibold sticky left-0 top-[3rem] z-41"
                  style={{ gridRowStart: 3, gridColumnStart: 1 }}
                >
                  Chưa có PIC
                </div>
                {daysInMonth.map((d, i) => (
                  <div
                    key={`bg-nopic-${i}`}
                    className={`border-b border-gray-200 sticky top-[3rem] z-40 ${
                      d.weekday === "T7" || d.weekday === "CN"
                        ? "bg-red-100"
                        : d.day % 2 !== 0
                        ? "bg-gray-50"
                        : "bg-white"
                    }`}
                    style={{ gridRowStart: 3, gridColumnStart: i + 2 }}
                  />
                ))}
                {noPicTasks.map((task) => {
                  const { colorClass, gridColumnStart, gridColumnEnd } =
                    getTaskGridStyle(task);
                  return (
                    <div
                      key={task.id}
                      className={`rounded-md shadow-md sticky text-white text-xs font-bold flex items-center justify-center cursor-pointer top-[3rem] z-40 ${colorClass}`}
                      style={{
                        gridRowStart: 3,
                        gridColumnStart,
                        gridColumnEnd,
                        minHeight: "2rem",
                      }}
                      title={`${task.name} - ${task.startDate} → ${task.endDate}`}
                      onClick={() => handleTaskClick(task)}
                    >
                      <span className="truncate px-2">{task.name}</span>
                    </div>
                  );
                })}
              </>
            )}

            {/* Normal PIC rows */}
            {filteredPics.map((pic, picIndex) => {
              // const row = noPicTasks.length > 0 ? picIndex + 4 : picIndex + 3;
              const row = picIndex + 4
              const picTasks = tasksWithPicIndex.filter((t) => t.pic === pic);
              // if (picTasks.length === 0) return null;

              return (
                <React.Fragment key={pic}>
                  <div
                    className="bg-white border-b border-gray-200 px-4 py-2 font-semibold sticky left-0 z-20"
                    style={{ gridRowStart: row, gridColumnStart: 1 }}
                  >
                    {pic}
                  </div>

                  {daysInMonth.map((d, i) => (
                    <div
                      key={`bg-${pic}-${i}`}
                      className={`border-b border-gray-200 ${
                        d.weekday === "T7" || d.weekday === "CN"
                          ? "bg-red-100"
                          : d.day % 2 !== 0
                          ? "bg-gray-50"
                          : "bg-white"
                      }`}
                      style={{ gridRowStart: row, gridColumnStart: i + 2 }}
                    />
                  ))}

                  {picTasks.map((task) => {
                    const { colorClass, gridColumnStart, gridColumnEnd } =
                      getTaskGridStyle(task);
                    return (
                      <div
                        key={task.id}
                        className={`rounded-md ml-1 mr-1 shadow-md text-white text-xs font-bold flex items-center justify-center cursor-pointer ${colorClass}`}
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
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tên công việc
                </label>
                <input
                  type="text"
                  name="name"
                  value={editedTask.name}
                  onChange={handleModalChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={editedTask.startDate}
                  onChange={handleModalChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={editedTask.endDate}
                  onChange={handleModalChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Người phụ trách
                </label>
                <select
                  name="pic"
                  value={editedTask.pic}
                  onChange={handleModalChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">(Chưa có PIC)</option>
                  {allPics.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
              >
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
