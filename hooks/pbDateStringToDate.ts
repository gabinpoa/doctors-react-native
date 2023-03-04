function pbDateStringToDate(pbDateString: string) {
  const date = new Date(pbDateString.split(" ").join("T"));

  return date;
}

export default pbDateStringToDate;
