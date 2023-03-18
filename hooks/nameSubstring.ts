export default function nameSubstring(
  name: string,
  roomsLength: number
): string {
  const minimalStrLength = 16;
  const newNameLength =
    roomsLength >= 3 ? minimalStrLength : minimalStrLength / (roomsLength / 3);

  const newName = name.substring(0, newNameLength);

  return newNameLength >= name.length ? newName : newName + ".";
}
