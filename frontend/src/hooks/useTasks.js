import { useState, useCallback } from 'react';
import { tasksApi } from '../services/api';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { tasks } = await tasksApi.list(params);
      setTasks(tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (title, description) => {
    const { task } = await tasksApi.create(title, description);
    setTasks((prev) => [task, ...prev]);
    return task;
  }, []);

  const updateTask = useCallback(async (id, fields) => {
    const { task } = await tasksApi.update(id, fields);
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    return task;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await tasksApi.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleStatus = useCallback(
    (task) => updateTask(task.id, { status: task.status === 'Pending' ? 'Completed' : 'Pending' }),
    [updateTask]
  );

  return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, toggleStatus };
}
