import { createContext, useContext, useEffect, useState } from "react";

type FramerPluginContextType = {
  id: string;
  name: string;
  isLoaded: boolean;
};

const FramerPluginContext = createContext<FramerPluginContextType>({
  id: "00000",
  name: "A Framer Plugin",
  isLoaded: false,
});

export const FramerPluginProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const [id, setId] = useState<string>();
  const [name, setName] = useState<string>();

  useEffect(() => {
    (async () => {
      const config = await fetch("/framer.json").then((res) => res.json());

      setId(config.id);
      setName(config.name);

      setIsLoaded(true);
    })();
  }, []);

  return (
    <FramerPluginContext.Provider value={{ id: id!, name: name!, isLoaded }}>
      {isLoaded && children}
    </FramerPluginContext.Provider>
  );
};

export const useFramerPlugin = () => {
  const context = useContext(FramerPluginContext);

  if (!context) {
    throw new Error(
      "useFramerPlugin must be used within a FramerPluginProvider"
    );
  }

  return context;
};
