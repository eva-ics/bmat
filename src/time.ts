const f = (n: number) => {
  return n < 10 ? "0" + n : n;
};

/**
 * Converts Date to RFC3339 string
 *
 * @param {Date} d - Date object to convert
 * @param {boolean} [millis] - with milliseconds
 *
 * @returns {string}
 */
export const dateRFC3339 = (d: Date, millis?: boolean): string => {
  let result =
    d.getFullYear() +
    "-" +
    f(d.getMonth() + 1) +
    "-" +
    f(d.getDate()) +
    "T" +
    f(d.getHours()) +
    ":" +
    f(d.getMinutes()) +
    ":" +
    f(d.getSeconds());
  if (millis) {
    result += "." + f(d.getMilliseconds());
  }
  return result;
};

/**
 * Converts a UNIX timestamp number to RFC3339 string
 *
 * @param {number} [ts] - timestamp to convert
 * @param {boolean} [millis] - with milliseconds
 *
 * @returns {string|undefined}
 */
export const timestampRFC3339 = (
  ts?: number,
  millis?: boolean
): string | undefined => {
  if (ts) {
    return dateRFC3339(new Date(ts * 1000), millis);
  }
};

/**
 * Converts an uptime seconds to a pretty string
 *
 * @param {number} [uptime] - uptime to convert
 *
 * @returns {string|undefined}
 */
export const formatUptime = (uptime?: number): string | undefined => {
  if (uptime) {
    if (isNaN(uptime) || uptime < 0) {
      return "Invalid uptime";
    }
    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const days = Math.floor(uptime / secondsInDay);
    let hours = Math.floor((uptime % secondsInDay) / secondsInHour);
    let minutes = Math.floor((uptime % secondsInHour) / secondsInMinute);
    let seconds = uptime % secondsInMinute;
    let formattedUptime = "";
    if (days > 0) {
      formattedUptime += days + "d ";
    }
    if (hours > 0) {
      if (hours == 24) {
        hours = 0;
      }
      formattedUptime += ("0" + hours).slice(-2) + "h ";
    }
    if (minutes > 0) {
      if (minutes == 60) {
        minutes = 0;
      }
      formattedUptime += ("0" + minutes).slice(-2) + "m ";
    }
    if (seconds > 0) {
      if (seconds == 60) {
        seconds = 0;
      }
      formattedUptime += ("0" + seconds.toFixed(0)).slice(-2) + "s";
    }
    return formattedUptime.trim();
  }
};

/**
 * Timestamp class to work with UNIX timestamps
 */
export class Timestamp {
  t: number;
  /**
   * @param {Date|number} src - source (number = UNIX timestamp)
   */
  constructor(src?: Date | number) {
    if (src === null || src === undefined) {
      this.t = Date.now() / 1000;
    } else if (typeof src === "number") {
      this.t = src;
    } else {
      this.t = src.getTime() / 1000;
    }
  }
  /**
   * Adds seconds
   *
   * @returns {Timestamp}
   */
  addSec(sec: number): Timestamp {
    this.t += sec;
    return this;
  }
  /**
   * Substracts seconds
   *
   * @returns {Timestamp}
   */
  subSec(sec: number): Timestamp {
    this.t -= sec;
    return this;
  }
  /**
   * Converts to JS Date
   *
   * @returns {Date}
   */
  toDate(): Date {
    return new Date(this.t * 1000);
  }
  /**
   * Converts to number
   *
   * @returns {number}
   */
  toNumber(): number {
    return this.t;
  }
  /**
   * Converts to RFC3339 string
   *
   * @param {boolean} [millis] - with milliseconds
   *
   * @returns {string}
   */
  toRFC3339(millis?: boolean): string {
    return timestampRFC3339(this.t, millis) as string;
  }
}
