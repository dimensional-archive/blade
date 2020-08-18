import "./util/Extender";
import type { Context } from "./components/command/context/Context";

export * from "./components/base/Module";
export * from "./components/base/Handler";
export * from "./components/command/context/Context";
export * from "./components/command/context/Flags";
export * from "./components/command/context/Params";
export * from "./components/command/parameter/parser/ContentParser";
export * from "./components/command/parameter/parser/Parser";
export * from "./components/command/parameter/parser/Tokenizer";
export * from "./components/command/parameter/TypeResolver";
export * from "./components/command/parameter/TypeBuilder";
export * from "./components/command/Command";
export * from "./components/command/CommandDispatcher";
export * from "./components/command/CommandHandler";
export * from "./components/listener/Listener";
export * from "./components/listener/ListenerHandler";
export * from "./components/monitor/Monitor";
export * from "./components/monitor/MonitorHandler";
export * from "./components/Decorators";
export * from "./components/Provider";

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
    ctx?: Context;
  }
}
