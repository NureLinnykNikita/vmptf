export const mockFetch = (data) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(JSON.stringify(data)), 800);
  });
