import { useEffect } from "react";
import { motion } from "framer-motion";
import { framer, withBackgroundColor } from "framer-plugin";
import {
  COLOR_SCHEMES,
  COLOR_VARIATIONS,
  ColorData,
  ColorSchemeType,
  ColorVariationType,
  generateColorSet,
} from "./utils/color";
import "./App.css";
import {
  FramerPlugin,
  InputGroup,
  NumberControls,
  SegmentedControls,
  useSelection,
  useStore,
  capitalizeWords,
  Button,
} from "@triozer/framer-toolbox";
import * as htmlToImage from "html-to-image";

export function App() {
  const [store, _, setStoreValue, isStoreLoaded] = useStore<{
    count: number;
    scheme: ColorSchemeType;
    variation: ColorVariationType;
    colors: ColorData[];
    mode: "hues" | "gradient";
    showColorDetails: boolean;
    detailsOpen: boolean;
  }>("store", {
    count: 2,
    scheme: "mono",
    variation: "hard",
    colors: [],
    mode: "hues",
    showColorDetails: true,
    detailsOpen: false,
  });

  const { count, scheme, variation, colors, mode, showColorDetails } = store;

  const selection = useSelection();

  useEffect(() => {
    if (scheme === "mono") {
      setStoreValue("count", 2);
      return;
    }

    if (scheme === "tetrade") {
      setStoreValue("count", 4);
      return;
    }

    if (scheme === "triade") {
      setStoreValue("count", 3);
      return;
    }
  }, [scheme]);

  useEffect(() => {
    if (scheme === "mono" && count !== 2) {
      setStoreValue("count", 2);
      return;
    }

    setStoreValue("colors", generateColorSet({ count, scheme, variation }));
  }, [count, scheme, variation]);

  useEffect(() => {
    if (isStoreLoaded && colors.length === 0) {
      setStoreValue("colors", generateColorSet({ count, scheme, variation }));
    }
  }, [colors]);

  useEffect(() => {
    if (mode === "gradient") {
      if (count < 2) {
        setStoreValue("count", 2);
      }
    }
  }, [mode]);

  const updateSelectionColor = (color: ColorData) => {
    selection.forEach((node) => {
      if (withBackgroundColor(node)) {
        node.setAttributes({
          backgroundColor: color.hex,
        });
        return;
      }
    });
  };

  return (
    <FramerPlugin autoResize={true}>
      <div
        id="colors"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${colors.length}, minmax(100px, 1fr))`,
          // width: "100%",
          minWidth: "300px",
          borderRadius: "8px",
          overflow: "hidden",
          background:
            mode === "gradient"
              ? `linear-gradient(to right, ${colors
                  .map((color) => color.hex)
                  .join(", ")})`
              : "transparent",
          backgroundBlendMode: "soft-light",
          backdropFilter: mode === "gradient" ? "blur(10px)" : "none",
        }}
      >
        {colors.map((color, index) => (
          <motion.div
            key={index}
            style={{
              height: "200px",
              backgroundColor: mode === "hues" ? color.hex : "transparent",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              color: color.luminance > 0.5 ? "black" : "white",
              width: "100%",
              cursor: "pointer",
              padding: "16px",
              fontWeight: 600,
              textAlign:
                index === 0
                  ? "left"
                  : index === colors.length - 1
                  ? "right"
                  : "center",
            }}
            onClick={() => {
              updateSelectionColor(color);
            }}
          >
            {showColorDetails && (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    alignSelf:
                      index === 0
                        ? "flex-start"
                        : index === colors.length - 1
                        ? "flex-end"
                        : "center",
                    gap: "4px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    height="1em"
                    width="1em"
                    version="1.1"
                    viewBox="0 0 512 512"
                  >
                    <g>
                      <g>
                        <path d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M256,457.143V54.857    c111.088,0,201.143,90.054,201.143,201.143S367.088,457.143,256,457.143z" />
                      </g>
                    </g>
                  </svg>
                  <span>{color.ratio}:1</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span>{color.name}</span>
                  <span>{color.hex}</span>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>

      <SegmentedControls
        title="Mode"
        value={mode}
        items={[
          {
            value: "hues",
            label: "Hues",
          },
          {
            value: "gradient",
            label: "Gradient",
          },
        ]}
        onChange={(value: "hues" | "gradient") => setStoreValue("mode", value)}
      />

      <NumberControls
        title="Count"
        value={count}
        onChange={(e) => {
          setStoreValue("count", parseInt(e));
        }}
        min={mode === "hues" ? 1 : 2}
        max={6}
        disabled={scheme === "mono"}
        stepper={true}
      />

      <InputGroup title="Scheme">
        <select
          value={scheme}
          onChange={(e) => {
            setStoreValue("scheme", e.target.value as ColorSchemeType);
          }}
        >
          {COLOR_SCHEMES.toSorted().map((scheme) => (
            <option key={scheme} value={scheme}>
              {capitalizeWords(scheme)}
            </option>
          ))}
        </select>
      </InputGroup>

      <InputGroup title="Variation">
        <select
          value={variation}
          onChange={(e) => {
            setStoreValue("variation", e.target.value as ColorVariationType);
          }}
        >
          {COLOR_VARIATIONS.toSorted().map((variation) => (
            <option key={variation} value={variation}>
              {capitalizeWords(variation)}
            </option>
          ))}
        </select>
      </InputGroup>

      <SegmentedControls
        title="Show Details"
        value={showColorDetails}
        items={[
          {
            value: true,
            label: "Yes",
          },
          {
            value: false,
            label: "No",
          },
        ]}
        onChange={(value: boolean) => setStoreValue("showColorDetails", value)}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          width: "100%",
        }}
      >
        <Button
          variant="secondary"
          onClick={async () => {
            const node = document.getElementById("colors");
            if (!node) return;

            const image = await htmlToImage.toPng(node);

            framer.addImage({
              name: "Palette",
              image,
            });
          }}
        >
          Export
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            setStoreValue(
              "colors",
              generateColorSet({ count, scheme, variation })
            );
          }}
        >
          Generate
        </Button>
      </div>
    </FramerPlugin>
  );
}
