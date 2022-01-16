import { html, render } from "lit-html";
import { styleMap } from "lit-html/directives/style-map.js";
import { IO, next } from "./lib/ReactiveMonad";
import { allNoResetIO } from "./lib/AllNoResetIO";

const count = IO(0);
const uid = () => count[">"](next(count.lastVal + 1)).lastVal;

type Task = {
  id: number;
  title: string;
  done: boolean;
};

const taskIO = IO<Task[]>([]);
const addTaskIO = (task: Task) => taskIO[">"](next([...taskIO.lastVal, task]));
const done = (id: number, done: boolean) =>
  taskIO[">"](
    next(taskIO.lastVal.map((t) => (t.id === id ? { ...t, done } : t)))
  );
const rmTaskIO = (id: number) =>
  taskIO[">"](next(taskIO.lastVal.filter((t) => t.id !== id)));

const App = () => html`
  <div>
    <h1>Todo List</h1>
    ${NewTask()} ${TaskList()}
  </div>
`;

const inputTextIO = IO("");
const updateInputTextIO = (text: string) => inputTextIO[">"](next(text));

const onInput = (e: any) => {
  updateInputTextIO(e.currentTarget.value);
};
const onKeyPress = (e: KeyboardEvent) => {
  if (e.key == "Enter") {
    addTaskIO({ id: uid(), title: inputTextIO.lastVal, done: false });
    updateInputTextIO("");
  }
};

const NewTask = () => html`
  <div>
    <input
      type="text"
      .value=${inputTextIO.lastVal}
      @input=${onInput}
      @keypress=${onKeyPress}
      placeholder="whad to do next?"
    />
  </div>
`;

const TaskItem = (task: Task) => html`
  <div style=${styleMap({ display: "flex" })}>
    <input
      type="checkbox"
      @change=${(e: any) => done(task.id, e.currentTarget.checked)}
      .checked=${task.done}
    />
    <div class="title">${task.title}</div>
    <div class="remove" @click=${() => rmTaskIO(task.id)}>×</div>
  </div>
`;

const TaskList = () =>
  html` <div>${taskIO.lastVal.map((task) => TaskItem(task))}</div> `;

const allIO = allNoResetIO([taskIO, inputTextIO]);
const litIO = allIO[">="](() => render(App(), document.body));
