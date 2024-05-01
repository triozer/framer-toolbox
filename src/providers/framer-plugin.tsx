import { createContext, useContext } from "react";

const config = await fetch("/framer.json").then((res) => res.json());

type FramerPluginContextProps = {
  id: string;
  name: string;
};

const FramerPluginContext = createContext<FramerPluginContextProps>({
  id: config.id,
  name: config.name,
});

export const FramerPluginProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { id, name } = config;

  return (
    <FramerPluginContext.Provider value={{ id, name }}>
      {children}
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
