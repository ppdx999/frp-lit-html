import { html, render } from "lit-html";
import { IO, next } from "./lib/ReactiveMonad";
import { allNoResetIO } from "./lib/AllNoResetIO";

const countIO = IO(0);
const decrement = () => countIO[">"](next(countIO.lastVal - 1));
const increment = () => countIO[">"](next(countIO.lastVal + 1));

const Counter = () => html`
  <div>
    <h2>
      You clicked ${countIO.lastVal} ${console.log("Counter is rendered")}
      times!
    </h2>
    <button @click="${decrement}">Decrement</button>
    <button @click="${increment}">Increment</button>
  </div>
`;

const start = Date.now();
const getSecond = () => Math.floor((Date.now() - start) / 1000);
const timerIO = IO(0);
const f = () => timerIO[">"](next(getSecond()));
setInterval(f, 1000);

const Timer = () =>
  html`<h2>${timerIO.lastVal} ${console.log("Timer is rendered")}</h2>`;

const App = () => html`
  <div>
    <h1>Lit-html + FRP</h1>
    ${Counter()} ${Timer()}
  </div>
`;

const allIO = allNoResetIO([countIO, timerIO]);

const litIO = allIO[">="](() => render(App(), document.body));
