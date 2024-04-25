import { framer, CanvasNode } from "framer-plugin";
import { useState, useEffect, ReactNode } from "react";
import "./App.css";
import { useAutoSizer } from "./hooks/auto-sizer";
import FramerPlugin from "./components/framer-plugin";
import SegmentedControls, {
  SegmentedControlItem,
} from "./components/segmented-controls";
import Button from "./components/button";
import InputGroup from "./components/input-group";
import NumberControls from "./components/number-controls";
import TextControls from "./components/text-controls";

framer.showUI({
  title: "My Plugin",
  position: "top right",
  width: 240,
  height: 95,
});

const ITEMS: SegmentedControlItem[] = [
  { value: "one", label: "A" },
  { value: "two", label: "B" },
  { value: "three", label: "C" },
];

function useSelection() {
  const [selection, setSelection] = useState<CanvasNode[]>([]);

  useEffect(() => {
    return framer.subscribeToSelection(setSelection);
  }, []);

  return selection;
}

export function App() {
  const selection = useSelection();
  const layer = selection.length === 1 ? "layer" : "layers";

  const { ref } = useAutoSizer();

  const [elements, setElements] = useState<ReactNode[]>([]);

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
    <FramerPlugin ref={ref}>
      <p>
        Welcome! Check out the{" "}
        <a href="https://developers.framer.wiki/">Docs</a> to start. You have{" "}
        {selection.length} {layer} selected.
      </p>
      <hr />
      <Button>Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="destructive">Destructive Button</Button>
      <hr />
      <Button disabled>Primary Button</Button>
      <Button variant="secondary" disabled>
        Secondary Button
      </Button>
      <Button variant="destructive" disabled>
        Destructive Button
      </Button>
      <hr />
      <TextControls icon="search" placeholder="Search" />
      <InputGroup>
        <input
          type="text"
          onChange={(e) => console.log(e.target.value)}
          placeholder="Tracking Code"
        />
      </InputGroup>
      <hr />
      <SegmentedControls
        title="Segmented Controls"
        items={ITEMS}
        defaultValue="one"
        onChange={(value) => console.log(value)}
      />
      <SegmentedControls
        title="Distribute"
        items={[
          { value: "one", label: "A" },
          { value: "two", label: "B" },
          { value: "three", label: "C" },
          { value: "four", label: "D" },
          { value: "five", label: "E" },
        ]}
        defaultValue="one"
        onChange={(value) => console.log(value)}
      />
      <hr />
      <InputGroup title="Select">
        <select onChange={(e) => console.log(e.target.value)}>
          <option value="one">One</option>
          <option value="two">Two</option>
          <option value="three">Three</option>
        </select>
      </InputGroup>
      <InputGroup title="Input">
        <input
          type="text"
          onChange={(e) => console.log(e.target.value)}
          placeholder="Text..."
        />
      </InputGroup>
      <NumberControls title="Number" defaultValue={10} />
      <NumberControls
        title="Stepper"
        defaultValue={2}
        min={0}
        max={10}
        stepper
      />
      <NumberControls title="Gap" defaultValue={10} min={0} slider />
    </FramerPlugin>
  );
}
