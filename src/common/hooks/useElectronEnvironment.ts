export const useElectronEnvironment = () => {
  const isMac =
    typeof navigator !== "undefined" && /Mac/.test(navigator.platform);
  const isWindows =
    typeof navigator !== "undefined" && /Win/.test(navigator.platform);

  return {
    isMac,
    isWindows,
  };
};
