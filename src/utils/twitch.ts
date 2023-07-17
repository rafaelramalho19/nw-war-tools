export const extractVideoId = (url: string) => {
  const match = url.match(/videos\/(\d+)/);
  return match ? match[1] : null;
}