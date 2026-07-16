export type StoredTask = {
  dateId: number;
  title: string;
  emoji?: string;
  stepsChecked: boolean[];
  appearedAt: number;
};

type Contact = { name?: string; phone?: string } | undefined;

type SoloState = {
  // single active task (no array) to keep the app simple
  task?: StoredTask;
  contact?: Contact;
};

type userState = {
  contact?: Contact;
};

const STORAGE_KEY = 'soloStoriesState';
const user_exist = 'user_exist';

function isClient() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadState(): SoloState {
  if (!isClient()) return {} as SoloState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // console.debug('[localStorage] loadState raw:', raw);
    if (!raw) return {} as SoloState;
    return JSON.parse(raw) as SoloState;
  } catch (err) {
    console.warn('Failed to parse storage', err);
    return {} as SoloState;
  }
}

export function is_user_exist(): boolean {
  if (!isClient()) return false;
  try {
    const raw = localStorage.getItem(user_exist);
    // console.debug('[localStorage] is_user_exist raw:', raw);
    if (!raw) return false;
    return JSON.parse(raw) as boolean;
  } catch (err) {
    console.warn('Failed to parse storage', err);
    return false;
  }
}

export function saveUser(state: userState) {
  if (!isClient()) return;
  try {
    console.debug('[localStorage] saveState', state);
    localStorage.setItem(user_exist, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save state', err);
  }
}
  

export function saveState(state: SoloState) {
  if (!isClient()) return;
  try {
    console.debug('[localStorage] saveState', state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save state', err);
  }
}

// date shape expected here: { id:number, title:string, emoji?:string, steps: string[] }
export function addTask(date: any): StoredTask {
  console.debug('[localStorage] addTask', date && date.id);
  const state = loadState();
  if (state.task && state.task.dateId === date.id) return state.task;

  const newTask: StoredTask = {
    dateId: date.id,
    title: date.title,
    emoji: date.emoji,
    stepsChecked: new Array(date.steps?.length || 0).fill(false),
    appearedAt: Date.now(),
  };
  state.task = newTask;
  saveState(state);
  return newTask;
}

export function getTask(dateId: number): StoredTask | undefined {
  const state = loadState();
  if (!state.task) return undefined;
  return state.task.dateId === dateId ? state.task : undefined;
}

export function toggleStep(dateId: number, stepIndex: number): StoredTask | undefined {
  const state = loadState();
  const t = state.task;
  if (!t || t.dateId !== dateId) return undefined;
  if (stepIndex < 0 || stepIndex >= t.stepsChecked.length) return t;
  t.stepsChecked[stepIndex] = !t.stepsChecked[stepIndex];
  state.task = t;
  saveState(state);
  return t;
}

export function saveContact(contact: Contact) {
  const state = loadState();
  state.contact = contact;
  saveState(state);
}

// remove task by numeric dateId or by title string (for older entries)
export function removeTask(identifier?: number | string) {
  console.log("identifier",identifier)
  const state = loadState();
  if (!state) return;
  localStorage.removeItem(STORAGE_KEY)
  
}