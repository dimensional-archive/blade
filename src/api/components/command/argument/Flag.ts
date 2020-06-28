import { Message } from "@kyu/eris";

export class Flag {
  command?: string;
  ignore?: boolean;
  rest?: string;
  message?: Message;
  value?: any;

  public constructor(public type: string, data: Record<string, any> = {}) {
    Object.assign(this, data);
  }

  public static cancel() {
    return new Flag("cancel");
  }

  public static retry(message: Message) {
    return new Flag("retry", { message });
  }

  public static fail(value: any): Flag {
    return new Flag("fail", { value });
  }

  public static continue(
    command: string,
    ignore = false,
    rest = null
  ) {
    return new Flag("continue", { command, ignore, rest });
  }

  public static is(value: any, type: string): boolean {
    return value instanceof Flag && value.type === type;
  }
}