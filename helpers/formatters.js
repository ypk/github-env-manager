const epochs = [
  ["year", 31536000],
  ["month", 2592000],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1],
];

function calculateDuration(timeAgoInSeconds) {
  for (let [name, seconds] of epochs) {
    const calculatedInterval = Math.floor(timeAgoInSeconds / seconds);
    if (calculatedInterval >= 1) {
      return {
        interval: calculatedInterval,
        epoch: name,
      };
    }
  }
};

function timeAgo(date) {
  const dateObject = new Date(date);
  const timeAgoInSeconds = Math.floor(
    (new Date() - new Date(dateObject)) / 1000
  );
  const { interval, epoch } = calculateDuration(timeAgoInSeconds);
  const suffix = interval === 1 ? "" : "s";
  return `${interval} ${epoch}${suffix} ago`;
};

function humanReadable (date) {
  const dateObject = new Date(date);
  return dateObject.toString();
};

module.exports = {
  timeAgo,
  humanReadable
};
