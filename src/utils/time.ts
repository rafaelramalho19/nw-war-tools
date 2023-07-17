export function convertSecondsToHMS(seconds: number) {
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds % 3600) / 60);
  var remainingSeconds = Math.floor(seconds % 60);

  return {
    hours: hours,
    minutes: minutes,
    seconds: String(remainingSeconds).padStart(2, '0')
  };
}