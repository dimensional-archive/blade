/**
 * @file modified https://github.com/Naval-Base/ms
 */

import { Store } from "@kyudiscord/neo";

export enum Unit {
  SECOND = 1000,
  MINUTE = SECOND * 60,
  HOUR = MINUTE * 60,
  DAY = HOUR * 24,
  WEEK = DAY * 7,
  YEAR = DAY * 365.25,
}

const separators = [ " ", ".", ",", "-" ];
const regex = /^(-?(?:\d+)?\.?\d+)\s*([a-z]+)?$/;

export class Duration {
  private static conversions = new Store<string[], number>([
    [ [ "years", "year", "yrs", "yr", "y" ], Unit.YEAR ],
    [ [ "weeks", "week", "w" ], Unit.WEEK ],
    [ [ "days", "day", "d" ], Unit.DAY ],
    [ [ "hours", "hour", "hrs", "hr", "h" ], Unit.HOUR ],
    [ [ "minutes", "minute", "mins", "min", "m" ], Unit.MINUTE ],
    [ [ "seconds", "second", "secs", "sec", "s" ], Unit.SECOND ],
  ]);

  /**
   * Parses a number into a string.
   * @param val The number to parse.
   * @param long Whether or not to return the long version.
   * @since 1.0.0
   */
  public static parse(val: number, long?: boolean): string;
  /**
   * Parses a string into milliseconds.
   * @param val The string to parse.
   * @since 1.0.0
   */
  public static parse(val: string): number;
  public static parse(val: string | number, long = false): number | string {
    let abs, ms = 0;
    if (typeof val === "string" && val.length) {
      if (val.length < 101) {
        const units = Duration._tokenize(val.toLowerCase());
        for (const unit of units) {
          const fmt = regex.exec(unit);
          if (fmt) {
            abs = parseFloat(fmt[1]);
            ms += this._convert(abs, fmt[2]);
          }
        }

        return ms;
      }
    }

    if (typeof val === "number" && isFinite(val)) {
      abs = Math.abs(val);
      if (abs >= Unit.DAY) return Duration._pluralize(val, Unit.DAY, [ "d", "day" ], long);
      if (abs >= Unit.HOUR) return Duration._pluralize(val, Unit.HOUR, [ "h", "hour" ], long);
      if (abs >= Unit.MINUTE) return Duration._pluralize(val, Unit.MINUTE, [ "m", "minute" ], long);
      if (abs >= Unit.SECOND) return Duration._pluralize(val, Unit.SECOND, [ "s", "second" ], long);
      return `${val}${long ? " milliseconds" : "ms"}`;
    }

    throw new Error("Value is an empty string or an invalid number");
  }

  /**
   * @private
   */
  private static _tokenize(str: string): string[] {
    const units = [];

    let buf = "", letter = false;
    for (const char of str) {
      if (separators.includes(char)) buf += char;
      else if (isNaN(parseInt(char, 10))) {
        buf += char;
        letter = true;
      } else {
        if (letter) {
          units.push(buf.trim());
          buf = "";
        }

        letter = false;
        buf += char;
      }
    }

    if (buf.length) {
      units.push(buf.trim());
    }

    return units;
  }

  /**
   * @private
   */
  private static _convert(num: number, unit: string): number {
    return Duration.conversions.find((_v, k) => k.includes(unit))! * num;
  }

  /**
   * @private
   */
  private static _pluralize(ms: number, base: number, types: Tuple<string, string>, long = false): string {
    const plural = Math.abs(ms) >= base * 1.5;
    return `${Math.round(ms / base)}${long ? ` ${types[1]}${plural ? "s" : ""}` : types[0]}`;
  }
}
