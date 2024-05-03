import { framer } from "framer-plugin";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

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
export function useAutoSizer(options: Options) {
  const ref = useRef<HTMLDivElement>(null);
  const isCurrentlyResizing = useRef(false);

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

  const handleResize = useCallback(() => {
    if (!ref.current) return;
    if (isCurrentlyResizing.current) {
      console.debug("Currently resizing, skipping resize");
      return;
    }

    isCurrentlyResizing.current = true;

    const { width, height } = ref.current.getBoundingClientRect();

    const newDimensions = {
      width: Math.max(pluginDimensions.width, width),
      height: Math.max(pluginDimensions.height, height),
    };

    updatePluginDimensions(newDimensions, "auto");
    isCurrentlyResizing.current = false;
  }, [pluginDimensions, updatePluginDimensions]);

  useLayoutEffect(() => {
    if (!ref.current) return;

    ref.current.style.width = "fit-content";
    ref.current.style.height = "fit-content";

    const resizeObserver = new ResizeObserver(handleResize);
    const mutationObserver = new MutationObserver(handleResize);

    mutationObserver.observe(ref.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style"],
    });

    resizeObserver.observe(ref.current, {
      box: "content-box",
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [ref]);

  return { ref, pluginDimensions, updatePluginDimensions };
}
