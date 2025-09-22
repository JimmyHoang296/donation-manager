export const toDateInputValue = (isoString) => {
  if (!isoString) return ""; // return empty string if null/blank
  const date = new Date(isoString);
  if (isNaN(date)) return ""; // handle invalid date
  return date.toISOString().split("T")[0];
};

export function getTodayDateString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function downloadFile(url) {
  const link = document.createElement("a");
  link.href = url;
  // KHÔNG đặt link.download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
export function mapServices(data) {
  const projects = data.projects.map((p) => ({
    ...p,
    services: p.services || [], // ensure services array exists
  }));

  const services = (data.services || []).map((s) => ({
    ...s,
    startDate: toDateInputValue(s.startDate),
    endDate: toDateInputValue(s.endDate),
  }));

  services.forEach((s) => {
    const index = projects.findIndex((p) => p.pId === s.pId);
    if (index !== -1) {
      projects[index].services.push(s);
    }
  });

  return { ...data, projects, services };
}
