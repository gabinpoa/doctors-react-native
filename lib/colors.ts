const colors = [
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
];

export function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}
