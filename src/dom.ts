export interface Coords {
  x: number;
  y: number;
}

/**
 * Gets mouse/touch (single touch) coordinates from an event
 *
 * @param {MouseEvent|TouchEvent} e - event
 *
 * @returns {Coords}
 */
export const getMouseEventCoords = (e: MouseEvent | TouchEvent): Coords => {
  if ((e as TouchEvent).touches) {
    return {
      x: Math.round((e as TouchEvent).touches[0].pageX),
      y: Math.round((e as TouchEvent).touches[0].pageY)
    };
  }
  return { x: (e as MouseEvent).pageX, y: (e as MouseEvent).pageY };
};

/**
 * Clears DOM selection
 *
 * @returns {void}
 */
export const clearSelection = (): void => {
  if (window && window.getSelection) {
    window?.getSelection()?.removeAllRanges();
  }
};

/**
 * Copies a text to clipboard
 *
 * @param {any} text - text to copy
 *
 * @returns {Promise<void>}
 */
export const copyTextClipboard = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.clipboard !== "undefined" &&
      navigator.permissions !== undefined
    ) {
      const type = "text/plain";
      const blob = new Blob([text], { type });
      const data = [new ClipboardItem({ [type]: blob })];
      navigator.permissions
        .query({ name: "clipboard-write" } as any)
        .then((permission) => {
          if (permission.state === "granted" || permission.state === "prompt") {
            navigator.clipboard
              .write(data)
              .then(() => resolve(), reject)
              .catch(reject);
          } else {
            reject(new Error("Cliboard permission not granted"));
          }
        });
    } else if (
      document.queryCommandSupported &&
      document.queryCommandSupported("copy")
    ) {
      var textarea = document.createElement("textarea");
      textarea.textContent = text;
      textarea.style.position = "fixed";
      textarea.style.width = "2em";
      textarea.style.height = "2em";
      textarea.style.padding = "0";
      textarea.style.border = "none";
      textarea.style.outline = "none";
      textarea.style.boxShadow = "none";
      textarea.style.background = "transparent";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand("copy");
        document.body.removeChild(textarea);
        resolve();
      } catch (e) {
        document.body.removeChild(textarea);
        reject(e);
      }
    } else {
      reject(new Error("Clipboard API is unavailable"));
    }
  });
};

/*
 * DOM cookie handler
 */
export namespace cookies {
  /**
   * Creates a cookie
   *
   * @param {string} name - cookie name
   * @param {any} value - cookie value
   * @param {number} [days] - set expiration in days
   * @param {string} [path] - URI path
   * @param {string} [samesite] - CSRF policy (default: Lax)
   *
   * @returns {void}
   */
  export const create = (
    name: string,
    value: any,
    days?: number,
    path?: string,
    samesite = "Lax"
  ): void => {
    if (typeof document === "undefined") return;
    const p = path !== undefined ? path : "";
    let expires;
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = date.toUTCString();
    } else {
      expires = "";
    }
    document.cookie = `${name}=${value}; Expires=${expires}; Path=${p}; SameSite=${samesite}`;
  };
  /**
   * Reads a cookie
   *
   * @param {string} name - cookie name
   *
   * @returns {string|undefined}
   */
  export const read = (name: string): string | undefined => {
    if (typeof document === "undefined") return;
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
  };
  /**
   * Erases a cookie
   *
   * @param {string} name - cookie name
   * @param {string} [path] - URI path
   *
   * @returns {void}
   */
  export const erase = (name: string, path?: string): void => {
    create(name, "", -1, path);
  };
}
