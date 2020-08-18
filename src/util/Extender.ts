import { Extender } from "@kyudiscord/neo";
import { Context } from "../components/command/context/Context";
import { CommandDispatcher } from "../components/command/CommandDispatcher";
import { Handler } from "../components/base/Handler";

const structures = {
  Context,
  CommandDispatcher,
  Handler,
};

export const blade = new Extender<unknown, typeof structures>(structures);
