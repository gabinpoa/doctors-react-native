function getSurgeryHeight(start: Date, end: Date) {
  let height = 0;
  for (
    let counter = new Date(start);
    counter < end;
    counter.setMinutes(counter.getMinutes() + 30)
  ) {
    height += 1;
  }
  return height;
}

export default getSurgeryHeight;
