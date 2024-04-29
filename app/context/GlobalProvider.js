import React, { createContext, useState, useContext } from "react";
import themes from "./themes";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useQuery, useMutation } from "react-query";
export const GlobalContext = createContext();
export const GlobalUpdateContext = createContext();
export const GlobalProvider = ({ children }) => {
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [modal, setModal] = useState(false);
  const [tasksData, setTasksData] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const theme = themes[selectedTheme];

  // React Query: Fetch all tasks
  const {
    data: tasks,
    isLoading,
    refetch,
  } = useQuery("tasks", async () => {
    const res = await axios.get("/api/tasks");
    return res.data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  });

  // React Query: Mutation to delete a task
  const deleteTaskMutation = useMutation(
    (id) => axios.delete(`/api/tasks/${id}`),
    {
      onSuccess: async () => {
        try {
          await refetch();
          toast.success("Task deleted");
        } catch (error) {
          toast.error(
            "Failed to refetch tasks after deletion: " + error.message
          );
        }
      },
      onError: (error) => {
        toast.error("Failed to delete task: " + error.message);
      },
    }
  );

  // React Query: Mutation to update a task
  const updateIsCompletedMutation = useMutation(
    (task) => axios.put(`/api/tasks`, task),
    {
      onSuccess: async () => {
        try {
          await refetch();
          toast.success("Task updated");
        } catch (error) {
          toast.error("Failed to refetch tasks after update: " + error.message);
        }
      },
      onError: (error) => {
        toast.error("Failed to update task: " + error.message);
      },
    }
  );

  // React Query: Mutation to edit a task
  const editTaskMutation = useMutation(
    (editedTask) => axios.patch(`/api/tasks/${editedTask.id}`, editedTask),
    {
      onSuccess: async () => {
        try {
          await refetch();
          toast.success("Task updated");
        } catch (error) {
          toast.error("Failed to refetch tasks after edit: " + error.message);
        }
      },
      onError: (error) => {
        toast.error("Failed to edit task: " + error.message);
      },
    }
  );

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const collapseMenu = () => {
    setCollapsed(!collapsed);
  };

  // Filtering tasks
  const completedTasks = tasksData.filter((task) => task.isCompleted === true);
  const importantTasks = tasksData.filter((task) => task.isImportant === true);
  const incompleteTasks = tasksData.filter(
    (task) => task.isCompleted === false
  );

  React.useEffect(() => {
    if (tasks) setTasksData(tasks);
  }, [tasks]);

  return (
    <GlobalContext.Provider
      value={{
        theme,
        tasks: tasksData,
        deleteTask: deleteTaskMutation.mutate,
        isLoading,
        completedTasks,
        importantTasks,
        incompleteTasks,
        updateIsComplete: updateIsCompletedMutation.mutate,
        modal,
        openModal,
        closeModal,
        collapsed,
        collapseMenu,
        editTask: editTaskMutation.mutate,
      }}
    >
      <GlobalUpdateContext.Provider
        value={{ editTask: editTaskMutation.mutate }}
      >
        {children}
      </GlobalUpdateContext.Provider>
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);
export const useGlobalUpdate = () => useContext(GlobalUpdateContext);
