export const getNavigationDay = (date?: Date): string => {
  const dateObj = date || new Date();

  return dateObj.toISOString().split("T")[0];
};
