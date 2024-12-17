import { useEffect, useState, Dispatch } from "react";
//import { useNavigate } from "react-router-dom";

/**
 * Encodes a boolean into Y or empty string
 *
 * @param {boolean} v - a boolean to encode
 *
 * @returns {string}
 */
export const encoderBoolean = (v: boolean): string => {
  return v === true ? "Y" : "";
};

/**
 * Decodes a boolean from a string (Y/empty)
 *
 * @param {string} v - a string value
 *
 * @returns {boolean}
 */
export const decoderBoolean = (v: string): boolean => {
  return v === "Y";
};

/**
 * Encodes a float number into a string
 *
 * @param {v} v - a number to encode
 *
 * @returns {string}
 */
export const encoderFloat = (v?: number): string => {
  return v === null || v === undefined ? "" : v.toString();
};

/**
 * Decodes a float number from a string
 *
 * @param {v} v - a string to decode
 *
 * @returns {number | null}
 */
export const decoderFloat = (v: string): number | null => {
  return v === "" ? null : parseFloat(v);
};

/**
 * Encodes an int number into a string
 *
 * @param {v} v - a number to encode
 *
 * @returns {string}
 */
export const encoderInt = encoderFloat;

/**
 * Decodes an int number from a string
 *
 * @param {v} v - a string to decode
 *
 * @returns {number | null}
 */
export const decoderInt = (v: string): number | null => {
  return v === "" ? null : parseInt(v);
};

export interface ComponentData<T> {
  name: string;
  value: T;
  encoder?: (value: T) => any;
  decoder?: (value: any) => T;
  setter: Dispatch<T>;
  pack_json?: boolean;
}

export const useQueryParams = (
  components: Array<ComponentData<any>>,
  dependencies?: any
) => {
  const loaded = useLoadParams(components);
  useStoreParams(loaded, components, dependencies);
  return loaded;
};

/**
 * React Hook that loads/stores parameters via the query string
 *
 * @param {Array<ComponentData<any>>} - component parametes to work with
 * @param {any} dependencies - the dependencies to watch for changes
 *
 * @returns {boolean} hook state (are sub-hooks processed or not)
 */
const useLoadParams = (components: Array<ComponentData<any>>): boolean => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const p = new URLSearchParams(document.location.search);
    for (const component of components) {
      let data = p.get(component.name);
      if (data !== undefined && data !== null) {
        if (component.pack_json) {
          try {
            data = JSON.parse(data);
          } catch (e) {
            console.warn(`unable to decode qs param ${component.name}: ${e}`);
          }
        }
        component.setter(component.decoder ? component.decoder(data) : data);
      }
    }
    setLoaded(true);
  }, []);
  return loaded;
};

const useStoreParams = (
  loaded: boolean,
  components: Array<ComponentData<any>>,
  dependencies?: any
) => {
  //const navigate = useNavigate();
  useEffect(() => {
    if (loaded) {
      const p = new URLSearchParams(document.location.search);
      for (const component of components) {
        let data = component.encoder
          ? component.encoder(component.value)
          : component.value;
        if (component.pack_json) {
          data = JSON.stringify(data);
        }
        p.set(component.name, data);
      }
      ////////work version use useNavigate(///////////
      // const sp = "?" + p.toString();
      // if (sp !== window.location.search) {
      //   const url = `${window.location.pathname}${sp}`;
      //   console.log(`useQueryParams: ${url}`);
      //   navigate(url, { replace: true });
      // }

      ////////error///////////
      // const sp = "?" + p.toString();
      // if (sp !== window.location.search) {
      //   const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}${sp}`;
      //   console.log(`useQueryParams: ${url}`);
      //   window.history.pushState({ path: url }, "", url);
      // }
      //////////test vesion use window.history/////////////
      const sp = "?" + p.toString();
      if (sp !== window.location.search) {
        const url = `${window.location.pathname}${sp}`;
        //console.log(`updateQueryParams: ${url}`);
        window.history.replaceState(null, "", url);
      }
    }
  }, dependencies);
};
