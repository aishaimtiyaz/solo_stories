type StoredTask = {
  dateId: number;
  title: string;
  emoji?: string;
  stepsChecked: boolean[];
  appearedAt: number;
};

type Contact = { name?: string; phone?: string } | undefined;

type SoloState = {
  tasks: StoredTask[];
  contact?: Contact;
};

const STORAGE_KEY = 'soloStoriesState';

function isClient() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadState(): SoloState {
  if (!isClient()) return { tasks: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    console.debug('[localStorage] loadState raw:', raw);
    if (!raw) return { tasks: [] };
    return JSON.parse(raw) as SoloState;
  } catch (err) {
    console.warn('Failed to parse storage', err);
    return { tasks: [] };
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
  const existing = state.tasks.find((t) => t.dateId === date.id);
  if (existing) return existing;

  const newTask: StoredTask = {
    dateId: date.id,
    title: date.title,
    emoji: date.emoji,
    stepsChecked: new Array(date.steps?.length || 0).fill(false),
    appearedAt: Date.now(),
  };
  state.tasks.push(newTask);
  saveState(state);
  return newTask;
}

export function getTask(dateId: number): StoredTask | undefined {
  const state = loadState();
  return state.tasks.find((t) => t.dateId === dateId);
}

export function toggleStep(dateId: number, stepIndex: number): StoredTask | undefined {
  const state = loadState();
  const t = state.tasks.find((x) => x.dateId === dateId);
  if (!t) return undefined;
  if (stepIndex < 0 || stepIndex >= t.stepsChecked.length) return t;
  t.stepsChecked[stepIndex] = !t.stepsChecked[stepIndex];
  saveState(state);
  return t;
}

export function saveContact(contact: Contact) {
  const state = loadState();
  state.contact = contact;
  saveState(state);
}

export { StoredTask };
