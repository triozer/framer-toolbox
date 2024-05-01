import { useState, useEffect, ReactNode } from "react";
import "./App.css";

import {
  Button,
  FramerPlugin,
  InputGroup,
  NumberControls,
  SegmentedControlItem,
  SegmentedControls,
  TextControls,
  useAutoSizer,
  useSelection,
  useStore,
} from "@triozer/framer-toolbox";

const ITEMS: SegmentedControlItem[] = [
  { value: "one", label: "A" },
  { value: "two", label: "B" },
  { value: "three", label: "C" },
];

export function App() {
  const selection = useSelection();
  const layer = selection.length === 1 ? "layer" : "layers";

  const { ref } = useAutoSizer();

  const [_, setElements] = useState<ReactNode[]>([]);

  const [store, setStore, setStoreValue] = useStore("store", {
    count: 0,
  });

  useEffect(() => {
    const x = setInterval(() => {
      setElements((prev) => [
        ...prev,
        <p key={new Date().toLocaleTimeString()}>{Math.random()}</p>,
      ]);
    }, 1000);

    return () => clearInterval(x);
  }, []);

  return (
    <FramerPlugin ref={ref} autoResize={true}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        Welcome to my plugin! You have {selection.length} {layer} selected.
      </div>
    </FramerPlugin>
  );
}
