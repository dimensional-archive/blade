import type { Context } from "./components/command/context/Context";

export * from "./components/base/Module";
export * from "./components/base/Handler";
export * from "./components/command/context/Context";
export * from "./components/command/context/Flags";
export * from "./components/command/context/Params";
export * from "./components/command/Command";
export * from "./components/command/Dispatcher";
export * from "./components/command/Handler";
export * from "./components/listeners/Listener";
export * from "./components/listeners/Handler";
export * from "./components/monitor/Monitor";
export * from "./components/monitor/Handler";
export * from "./components/Decorators";

export * from "./util/Extender";
export * from "./util/Duration";
export * from "./util/Files";
export * from "./util/Functions";
export * from "./util/ProjectInfo";
export * from "./util/Category";
export * from "./util/Decorators";

export * from "./Client";

declare global {
  type Tuple<A, B> = [ A, B ];

  interface String {
    capitalize(lowerRest?: boolean): this
  }
}

declare module "@kyudiscord/neo" {

  interface Message {
    ctx: Context
  }
}
