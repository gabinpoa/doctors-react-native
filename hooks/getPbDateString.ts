function getPbDateString(date: Date) {
  return date
    .toISOString()
    .replace(".", "T")
    .split("T")
    .filter((str, i) => i !== 2)
    .join(" ");
}
export default getPbDateString;
