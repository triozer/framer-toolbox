import { framer } from "framer-plugin";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

/**
 * Represents a set of dimensions (width and height) for an element.
 */
type Dimensions = { width: number; height: number };

/**
 * Options for the responsive sizer.
 */
type Options = {
  /**
   * Whether to enable UI resizing.
   */
  enableUIResizing: boolean;
  /**
   * The default size of the element.
   */
  defaultSize: Dimensions;
};

/**
 * A hook that enables responsive sizing for an element.
 *
 * @param {Options} options - The options for the responsive sizer.
 * @returns An object containing the element reference and the element size.
 */
export function useAutoSizer(
  options: Options = {
    enableUIResizing: true,
    defaultSize: { width: 240, height: 95 },
  }
) {
  const ref = useRef<HTMLDivElement>(null);
  const [pluginDimensions, setPluginDimensions] = useState(options.defaultSize);

  const updatePluginDimensions = useCallback(
    async (dimensions: Dimensions, type: "auto" | "manual" = "manual") => {
      setPluginDimensions(dimensions);

      if (type === "manual" || (type === "auto" && options.enableUIResizing)) {
        await framer.showUI({
          width: dimensions.width,
          height: dimensions.height,
        });
      }
    },
    [options.enableUIResizing]
  );

  useLayoutEffect(() => {
    if (!ref.current) return;

    ref.current.style.width = "fit-content";
    ref.current.style.height = "fit-content";

    const resizeObserver = new ResizeObserver(async () => {
      if (!ref.current) return;

      const { width, height } = ref.current.getBoundingClientRect();

      const newDimensions = {
        width: Math.max(options.defaultSize.width, width),
        height: Math.max(options.defaultSize.height, height),
      };

      updatePluginDimensions(newDimensions, "auto");
    });

    resizeObserver.observe(ref.current, {
      box: "content-box",
    });

    return () => resizeObserver.disconnect();
  }, [ref]);

  return { ref, pluginDimensions, updatePluginDimensions };
}
