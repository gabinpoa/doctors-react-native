import pbDateStringToDate from "./pbDateStringToDate";

export default function startAndEndTimeString(
  startPbString: string,
  endPbString: string
): string {
  return `${pbDateStringToDate(startPbString)
    .toTimeString()
    .slice(0, 5)} - ${pbDateStringToDate(endPbString)
    .toTimeString()
    .slice(0, 5)}`;
}
