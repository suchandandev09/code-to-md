import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

type Priority = "low" | "medium" | "high";
type Status = "todo" | "in_progress" | "done";

interface Task {
  id: string;
  title: string;
  owner: string;
  priority: Priority;
  status: Status;
  estimateHours: number;
  tags: string[];
}

interface BoardState {
  tasks: Task[];
  selectedTaskId: string | null;
  search: string;
  showCompleted: boolean;
}

type BoardAction =
  | { type: "set_tasks"; payload: Task[] }
  | { type: "toggle_completed" }
  | { type: "set_search"; payload: string }
  | { type: "select_task"; payload: string | null }
  | { type: "move_status"; payload: { id: string; status: Status } };

interface ThemeContextValue {
  accentColor: string;
  denseMode: boolean;
  toggleDenseMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "set_tasks":
      return { ...state, tasks: action.payload };
    case "toggle_completed":
      return { ...state, showCompleted: !state.showCompleted };
    case "set_search":
      return { ...state, search: action.payload };
    case "select_task":
      return { ...state, selectedTaskId: action.payload };
    case "move_status":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, status: action.payload.status }
            : task,
        ),
      };
    default:
      return state;
  }
}

const formatPriority = (priority: Priority): string => {
  if (priority === "high") return "High";
  if (priority === "medium") return "Medium";
  return "Low";
};

const priorityWeight: Record<Priority, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

const statusLabel: Record<Status, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

const TaskListItem = memo(function TaskListItem({
  task,
  isSelected,
  onSelect,
}: {
  task: Task;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const theme = useContext(ThemeContext);

  return (
    <button
      type="button"
      onClick={() => onSelect(task.id)}
      style={{
        width: "100%",
        textAlign: "left",
        border: isSelected ? `2px solid ${theme?.accentColor ?? "#2563eb"}` : "1px solid #d4d4d8",
        borderRadius: 12,
        padding: theme?.denseMode ? "8px 10px" : "12px 14px",
        marginBottom: 10,
        backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <strong>{task.title}</strong>
        <span>{statusLabel[task.status]}</span>
      </div>
      <div style={{ marginTop: 6, color: "#52525b" }}>
        Owner: {task.owner} | Priority: {formatPriority(task.priority)} | ETA: {task.estimateHours}h
      </div>
      <div style={{ marginTop: 6, fontSize: 12, color: "#71717a" }}>
        Tags: {task.tags.join(", ")}
      </div>
    </button>
  );
});

export default function ComplexProjectBoard(): JSX.Element {
  const [denseMode, setDenseMode] = useState(false);
  const [state, dispatch] = useReducer(boardReducer, {
    tasks: [],
    selectedTaskId: null,
    search: "",
    showCompleted: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({
        type: "set_tasks",
        payload: [
          {
            id: "T-101",
            title: "Design release checklist",
            owner: "Anika",
            priority: "high",
            status: "in_progress",
            estimateHours: 6,
            tags: ["planning", "release"],
          },
          {
            id: "T-102",
            title: "Refactor file parser pipeline",
            owner: "Kiran",
            priority: "high",
            status: "todo",
            estimateHours: 14,
            tags: ["backend", "parser", "tech-debt"],
          },
          {
            id: "T-103",
            title: "Write conversion smoke tests",
            owner: "Mira",
            priority: "medium",
            status: "done",
            estimateHours: 4,
            tags: ["testing", "qa"],
          },
          {
            id: "T-104",
            title: "Document CLI usage examples",
            owner: "Ravi",
            priority: "low",
            status: "in_progress",
            estimateHours: 3,
            tags: ["docs", "cli"],
          },
        ],
      });
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  const selectedTask = useMemo(
    () => state.tasks.find((task) => task.id === state.selectedTaskId) ?? null,
    [state.tasks, state.selectedTaskId],
  );

  const filteredTasks = useMemo(() => {
    const needle = state.search.trim().toLowerCase();

    return state.tasks
      .filter((task) => (state.showCompleted ? true : task.status !== "done"))
      .filter((task) => {
        if (!needle) return true;

        return (
          task.title.toLowerCase().includes(needle) ||
          task.owner.toLowerCase().includes(needle) ||
          task.tags.some((tag) => tag.toLowerCase().includes(needle))
        );
      })
      .sort((a, b) => {
        if (a.status !== b.status) return a.status.localeCompare(b.status);
        if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        return a.title.localeCompare(b.title);
      });
  }, [state.tasks, state.search, state.showCompleted]);

  const totalEstimate = useMemo(
    () => filteredTasks.reduce((sum, task) => sum + task.estimateHours, 0),
    [filteredTasks],
  );

  const moveSelectedTaskToDone = useCallback(() => {
    if (!selectedTask) return;
    dispatch({ type: "move_status", payload: { id: selectedTask.id, status: "done" } });
  }, [selectedTask]);

  const themeValue = useMemo<ThemeContextValue>(
    () => ({
      accentColor: "#0f766e",
      denseMode,
      toggleDenseMode: () => setDenseMode((prev) => !prev),
    }),
    [denseMode],
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <section style={{ fontFamily: "ui-sans-serif, system-ui", padding: 20, maxWidth: 980, margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <h1 style={{ marginBottom: 4 }}>Project Board</h1>
            <p style={{ color: "#52525b", margin: 0 }}>
              Complex sample component for testing code-to-markdown conversion.
            </p>
          </div>
          <button type="button" onClick={themeValue.toggleDenseMode}>
            {denseMode ? "Disable dense mode" : "Enable dense mode"}
          </button>
        </header>

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
          <main>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <input
                value={state.search}
                onChange={(event) => dispatch({ type: "set_search", payload: event.target.value })}
                placeholder="Search by title, owner, or tag"
                style={{ flex: 1, padding: "10px 12px" }}
              />
              <button type="button" onClick={() => dispatch({ type: "toggle_completed" })}>
                {state.showCompleted ? "Hide done" : "Show done"}
              </button>
            </div>

            <div style={{ marginBottom: 10, color: "#3f3f46" }}>
              Showing {filteredTasks.length} task(s), total estimate {totalEstimate}h
            </div>

            {filteredTasks.length === 0 ? (
              <div style={{ color: "#a1a1aa" }}>No tasks matched your filters.</div>
            ) : (
              filteredTasks.map((task) => (
                <TaskListItem
                  key={task.id}
                  task={task}
                  isSelected={task.id === state.selectedTaskId}
                  onSelect={(id) => dispatch({ type: "select_task", payload: id })}
                />
              ))
            )}
          </main>

          <aside style={{ border: "1px solid #e4e4e7", borderRadius: 12, padding: 14, height: "fit-content" }}>
            <h2 style={{ marginTop: 0 }}>Task Detail</h2>
            {!selectedTask ? (
              <p style={{ color: "#71717a" }}>Select a task to view details.</p>
            ) : (
              <>
                <h3>{selectedTask.title}</h3>
                <p>
                  <strong>Owner:</strong> {selectedTask.owner}
                </p>
                <p>
                  <strong>Status:</strong> {statusLabel[selectedTask.status]}
                </p>
                <p>
                  <strong>Priority:</strong> {formatPriority(selectedTask.priority)}
                </p>
                <p>
                  <strong>Estimated:</strong> {selectedTask.estimateHours}h
                </p>
                <p>
                  <strong>Tags:</strong> {selectedTask.tags.join(", ")}
                </p>
                <button type="button" onClick={moveSelectedTaskToDone} disabled={selectedTask.status === "done"}>
                  Mark as done
                </button>
              </>
            )}
          </aside>
        </div>
      </section>
    </ThemeContext.Provider>
  );
}
