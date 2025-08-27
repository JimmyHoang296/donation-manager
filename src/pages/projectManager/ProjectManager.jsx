import React, { useEffect, useMemo, useState } from "react";
import { Eye, Plus } from "lucide-react";
import { URL } from "../../assets/variables";
import ProjectDetailModal from "./ProjectDetailModal";
import Pagination from "../../components/Pagination";
import LoadingModal from "../../components/LoadingModal";

export default function ProjectManager({ data, setData }) {
  const [projects, setProjects] = useState(data.projects || []);
  const [searchQuery, setSearchQuery] = useState({
    customerName: "",
    type: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 20;

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery({ ...searchQuery, [name]: value });
    setCurrentPage(1);
  };

  useEffect(() => {
    setFilteredProjects(
      projects.filter(
        (b) =>
          (!searchQuery.customerName ||
            b.customerName
              .toLowerCase()
              .includes(searchQuery.customerName.toLowerCase())) &&
          (!searchQuery.type ||
            b.type.toLowerCase().includes(searchQuery.type.toLowerCase()))&&
          (!searchQuery.status ||
            b.status.toLowerCase().includes(searchQuery.status.toLowerCase()))
      )
    );
  }, [searchQuery, projects]);

  useEffect(() => {
    setData((prev) => ({ ...prev, projects }));
  }, [projects]);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  async function handleUpdate(updatedProject) {
    const submitData = { type: "updateProject", data: updatedProject };
    try {
      setLoading(true);
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(submitData),
      });
      const result = await response.json();
      if (result.success) {
        setProjects(
          projects.map((b) => (b.id === updatedProject.id ? updatedProject : b))
        );
        handleCloseModal();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(projectId) {
    if (!confirm("Bạn muốn xóa project này?")) return;
    const submitData = { type: "deleteProject", data: projectId };
    try {
      setLoading(true);
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(submitData),
      });
      const result = await response.json();
      if (result.success) {
        setProjects((prev) => prev.filter((b) => b.id !== projectId));
        handleCloseModal();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddNewProject = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  async function handleSaveNewProject(Project) {
    const submitData = { type: "newProject", data: Project };
    try {
      setLoading(true);
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(submitData),
      });
      const result = await response.json();
      if (result.success) {
        Project.id = result.data;
        setProjects([...projects, Project]);
        handleCloseModal();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * projectsPerPage;
    return filteredProjects
      .slice()
      .reverse()
      .slice(startIndex, startIndex + projectsPerPage);
  }, [filteredProjects, currentPage]);

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="mb-6 border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý dự án</h2>
        <button
          onClick={handleAddNewProject}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors flex items-center"
        >
          <Plus className="mr-2" /> Tạo dự án mới
        </button>
      </div>

      {/* Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-gray-700 text-sm mb-1">Khách hàng</label>
          <input
            type="text"
            name="client"
            value={searchQuery.client}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1">Loại dự án</label>
          <select
            name="type"
            value={searchQuery.type}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-md"
          >
            <option value=""></option>
            {[
              "vFEM",
              "vSLCP",
              "vZIV",
              "vSTZ",
              "vFDM",
              "vCOC",
              "t-FEM",
              "t-ZDHC",
              "t-CleanChain",
              "t-STZ",
              "Other",
            ].map((v, i) => (
              <option key={i} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1">Trạng thái</label>
          <select
            name="status"
            value={searchQuery.status}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-md"
          >
            <option value=""></option>
            {[
              "Quoting",
              "Ongoing",
              "Done"
            ].map((v, i) => (
              <option key={i} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Khách hàng</th>
              <th className="px-4 py-3 text-left">Loại dự án</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-4 py-3 text-left">Deadline</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paginatedProjects.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3 max-w-50">{b.customerName}</td>
                <td className="px-4 py-3">{b.type}</td>
                <td className="px-4 py-3">{b.status}</td>
                <td className="px-4 py-3">{b.deadline}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleOpenModal(b)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Eye className="w-5 h-5 mx-auto" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {isModalOpen && (
        <ProjectDetailModal
          data={data}
          project={selectedProject}
          onClose={handleCloseModal}
          onSave={handleSaveNewProject}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
      {loading && <LoadingModal message="Loading..." />}
    </div>
  );
}
