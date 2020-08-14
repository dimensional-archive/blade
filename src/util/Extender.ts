import { Extender } from "@kyudiscord/neo";
import { Context } from "../components/command/context/Context";
import { CommandDispatcher } from "../components/command/Dispatcher";
import { Module } from "../components/base/Module";
import { Handler } from "../components/base/Handler";

const structures = {
  Context,
  CommandDispatcher,
  Module,
  Handler,
};

export const blade = new Extender<unknown, typeof structures>(structures);
