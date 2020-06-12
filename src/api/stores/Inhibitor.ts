import { ComponentStore, ComponentStoreOptions } from "./Base";
import { Inhibitor } from "../components/Inhibitor";

import type { BladeClient } from "../Client";

export class InhibitorStore extends ComponentStore<Inhibitor> {
  constructor(client: BladeClient, options: ComponentStoreOptions = {}) {
    super(client, "events", {
      classToHandle: Inhibitor,
      ...options
    });
  }
}