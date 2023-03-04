function formatName(name: string) {
  const formattedName = name
    .trim()
    .split(" ")
    .map((subStr) => subStr[0].toUpperCase() + subStr.slice(1).toLowerCase())
    .join(" ");

  return formattedName;
}

export default formatName;
