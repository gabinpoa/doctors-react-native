export default function calendarSubstring(
  originalStr: string,
  roomsLength: number,
  minimalStrLength: number
): string {
  const newLength =
    roomsLength >= 3 ? minimalStrLength : minimalStrLength / (roomsLength / 3);

  const newStr = originalStr.substring(0, newLength);

  return newLength >= originalStr.length ? newStr : newStr + ".";
}
