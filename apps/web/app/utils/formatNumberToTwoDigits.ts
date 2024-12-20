export function formatNumberToTwoDigits(number: number) {
  return number < 10 ? `0${number}` : `${number}`;
}
