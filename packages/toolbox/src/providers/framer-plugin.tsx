import { createContext, useContext, useEffect, useRef, useState } from "react";

type FramerPluginContextType = {
  id: string;
  name: string;
};

const FramerPluginContext = createContext<FramerPluginContextType>({
  id: "00000",
  name: "A Framer Plugin",
});

export const FramerPluginProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const isLoaded = useRef(false);

  const [id, setId] = useState<string>();
  const [name, setName] = useState<string>();

  useEffect(() => {
    (async () => {
      const config = await fetch("/framer.json").then((res) => res.json());

      setId(config.id);
      setName(config.name);

      isLoaded.current = true;
    })();
  }, []);

  if (!isLoaded.current) {
    return null;
  }

  return (
    <FramerPluginContext.Provider value={{ id: id!, name: name! }}>
      {children}
    </FramerPluginContext.Provider>
  );
};

export const useFramerPlugin = () => {
  const context = useContext(FramerPluginContext);

  if (!context || !context.id || !context.name) {
    throw new Error(
      "useFramerPlugin must be used within a FramerPluginProvider"
    );
  }

  return context;
};
