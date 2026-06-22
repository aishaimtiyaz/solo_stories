'use client';

import { useEffect, useState, useCallback } from 'react';
import { addTask as storageAddTask, getTask as storageGetTask, toggleStep as storageToggleStep, StoredTask } from '@/utils/localStorage';

type TasksMap = Record<number, StoredTask>;

export default function useTasks() {
  const [tasksMap, setTasksMap] = useState<TasksMap>({});

  useEffect(() => {
    // hydrate initial tasks from storage
    try {
      // storageGetTask called per id; we don't have all ids up front so keep lazy access in getTask below
      // but try to capture any known tasks by reading the full state via storageGetTask for common ids is not possible here
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const addTask = useCallback((date: any) => {
    const t = storageAddTask(date);
    setTasksMap((prev) => ({ ...prev, [t.dateId]: t }));
    return t;
  }, []);

  const toggleStep = useCallback((dateId: number, index: number) => {
    const t = storageToggleStep(dateId, index);
    if (t) setTasksMap((prev) => ({ ...prev, [t.dateId]: t }));
    return t?.stepsChecked;
  }, []);

  const getTask = useCallback((dateId: number) => {
    if (tasksMap[dateId]) return tasksMap[dateId];
    const t = storageGetTask(dateId);
    if (t) setTasksMap((prev) => ({ ...prev, [t.dateId]: t }));
    return t;
  }, [tasksMap]);

  return { tasksMap, addTask, toggleStep, getTask } as const;
}
