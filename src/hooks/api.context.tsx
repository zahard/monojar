/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from "react";

export interface ApiTimerSettings {
  secondsLeft: number;
  lastRequestTime: number;
  apiIsReady: boolean;
}

export const ApiContext = createContext<ApiTimerSettings>({
  apiIsReady: true,
  secondsLeft: 0,
  lastRequestTime: 0,
});

export const useApiIsReady = () => {
  return useContext(ApiContext).apiIsReady;
};

export const useApiSecondsLeft = () => {
  return useContext(ApiContext).secondsLeft;
};

export function ApiContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApiContext.Provider
      value={{
        apiIsReady: true,
        secondsLeft: 0,
        lastRequestTime: 0,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}
