import React, { useContext, useRef, useState, useEffect } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [project, setProject] = useState([]);

  const navigate = useNavigate();
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsModalOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen]);
 
  // function createProject(e) {
  //   e.preventDefault();
  //   console.log({ projectName });

  //   axios
  //     .post("/projects/create", {
  //       name: projectName,
  //     })
  //     .then((res) => {
  //       console.log(res);
  //       setIsModalOpen(false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  // useEffect(() => {
  //   axios
  //     .get("/projects/all")
  //     .then((res) => {
  //       setProject(res.data.projects);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  // Function to fetch projects
  const fetchProjects = () => {
    axios
      .get("/projects/all")
      .then((res) => {
        setProject(res.data.projects);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
      });
  };

  // Fetch projects once on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Function to create a project
  const createProject = (e) => {
    e.preventDefault();

    axios
      .post("/projects/create", { name: projectName })
      .then(() => {
        setIsModalOpen(false);
        setProjectName(""); // Clear input
        fetchProjects(); // Fetch updated projects immediately
      })
      .catch((error) => {
        console.error("Error creating project:", error);
      });
  };
  return (
    <main className="p-4">
      <div className="projects flex flex-wrap gap-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="project p-4 border border-slate-300 rounded-md cursor-pointer"
        >
          New Project
          <i className="ri-link ml-2"></i>
        </button>

        {project.map((project) => (
          <div
            key={project._id}
            onClick={() =>
              navigate(`/project`, {
                state: { project },
              })
            }
            className="flex flex-col justify-between bg-white shadow-sm border border-slate-300 rounded-lg p-4 min-w-[200px] max-w-[240px] hover:bg-slate-100 cursor-pointer transition"
          >
            <h2 className="text-base font-semibold text-slate-800">
              {project.name}
            </h2>

            <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
              <i className="ri-user-line text-base"></i>
              <span>
                Collaborator
                {project.users.length !== 1 ? "s : " : " : "}
                {project.users.length || 0}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-md shadow-md w-1/3"
          >
            <h2 className="text-xl mb-4">Create New Project</h2>
            <form onSubmit={createProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 cursor-pointer  bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 cursor-pointer hover:bg-blue-700 bg-blue-600 text-white rounded-md"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
