/**
 * Versatile DOM/console logger with custom colors and styling
 */
export class Logger {
  /** @ignore */
  colors: any;
  /** @ignore */
  in_browser: boolean;
  can_colorize: boolean;

  css_debug = "font-size: 12px; color: #999";
  css_info = "font-size: 12px";
  css_warning = "font-size: 14px; color: orange; font-weight: bold";
  css_error = "font-size: 16px; color: red; font-weight: bold";
  css_critical = "font-size: 25px; color: red; font-weight: bold";

  /**
   * For CLI colorizing requires colorts module
   *
   * @param {any} color_ts - colorts.default
   */
  constructor(color_ts?: any) {
    this.colors = color_ts;
    this.in_browser = typeof window !== "undefined";
    this.can_colorize = typeof this.colors !== "undefined" || this.in_browser;
  }

  /** @ignore */
  _log(
    log_fn: (...data: any[]) => void,
    css: string,
    cli_can_colorize_fn: (colors: any, out: string) => string,
    msgs: any[]
  ) {
    if (this.can_colorize) {
      const output = (out: string[]) => {
        if (out.length) {
          if (this.in_browser) {
            log_fn(`%c${out.join(" ")}`, css);
          } else if (this.colors) {
            log_fn(cli_can_colorize_fn(this.colors, out.join(" ")));
          }
          out.splice(0, out.length);
        }
      };
      let out: string[] = [];
      for (const msg of msgs) {
        if (typeof msg === "object") {
          output(out);
          log_fn(msg);
        } else {
          out.push(msg.toString());
        }
      }
      output(out);
    } else {
      log_fn.apply(null, msgs);
    }
  }

  /** @ignore */
  _cli_can_colorize_debug(colors: any, out: string): string {
    return colors(out).gray.toString();
  }

  /**
   * Outputs debug message(s)
   *
   * @param {any[]} msgs - messages/objects to output
   *
   * @returns {void}
   */
  debug(...msgs: any[]): void {
    this._log(
      console.debug,
      this.css_debug,
      this._cli_can_colorize_debug,
      msgs
    );
  }

  /** @ignore */
  _cli_can_colorize_info(_colors: any, out: string): string {
    return out;
  }

  /**
   * Outputs info message(s)
   *
   * @param {any[]} msgs - messages/objects to output
   *
   * @returns {void}
   */
  info(...msgs: any[]): void {
    this._log(console.info, this.css_info, this._cli_can_colorize_info, msgs);
  }

  /** @ignore */
  _cli_can_colorize_warninig(colors: any, out: string): string {
    return colors(out).yellow.bold.toString();
  }

  /**
   * Outputs warning message(s)
   *
   * @param {any[]} msgs - messages/objects to output
   *
   * @returns {void}
   */
  warning(...msgs: any[]): void {
    this._log(
      console.warn,
      this.css_warning,
      this._cli_can_colorize_warninig,
      msgs
    );
  }

  /** @ignore */
  _cli_can_colorize_error(colors: any, out: string): string {
    return colors(out).red.bold.toString();
  }

  /** @ignore */
  _cli_can_colorize_critical(colors: any, out: string): string {
    return colors(out).red.underline.bold.toString();
  }

  /**
   * Outputs error message(s)
   *
   * @param {any[]} msgs - messages/objects to output
   *
   * @returns {void}
   */
  error(...msgs: any[]): void {
    this._log(
      console.error,
      this.css_error,
      this._cli_can_colorize_error,
      msgs
    );
  }

  /**
   * Outputs critical message(s)
   *
   * @param {any[]} msgs - messages/objects to output
   *
   * @returns {void}
   */
  critical(...msgs: any[]): void {
    this._log(
      console.error,
      this.css_critical,
      this._cli_can_colorize_critical,
      msgs
    );
  }

  /**
   * Tests the logger
   *
   * @returns {void}
   */
  test(): void {
    const err = new Error("test error");
    this.debug("this is debug", "test", err, { a: "5" }, 123);
    this.info("this is info", "test", err, { a: "5" }, 123);
    this.warning("this is warning", "test", err, { a: "5" }, 123);
    this.error("this is error", "test", err, { a: "5" }, 123);
    this.critical("this is critical", "test", err, { a: "5" }, 123);
  }
}
