import { ReactNode, useEffect, useState } from "react";
import "./App.css";

import {
  FramerPlugin,
  useSelection,
  useStore,
  Button,
} from "@triozer/framer-toolbox";

export function App() {
  const selection = useSelection();
  const [store, _, setStoreValue] = useStore("store", {
    lastVisit: -1,
  });
  const { lastVisit } = store;

  const [els, setEls] = useState<ReactNode[]>([]);

  useEffect(() => {
    setStoreValue("lastVisit", Date.now());
  }, []);

  const addElement = () => {
    setEls((prev) => [
      ...prev,
      <p key={new Date().toLocaleTimeString() + Math.random()}>
        {Math.random()}
        {Math.random()}
        {Math.random()}
        {Math.random()}
        {Math.random()}
        {Math.random()}
      </p>,
    ]);
  };

  return (
    <FramerPlugin autoResize={true}>
      <span>
        Welcome{" "}
        {lastVisit !== -1
          ? `back (${new Date(lastVisit).toLocaleDateString()})`
          : "to my plugin"}
        !
      </span>
      <p>You have {selection.length} layers selected.</p>
      <p>You have {selection.length} layers selected.</p>
      <p>You have {selection.length} layers selected.</p>
      <p>You have {selection.length} layers selected.</p>
      <p>You have {selection.length} layers selected.</p>
      <p>You have {selection.length} layers selected.</p>
      <Button onClick={addElement}>Add Element</Button>
      {els}
    </FramerPlugin>
  );
}
