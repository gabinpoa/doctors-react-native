import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { pb } from "../lib/pocketbase";
import { TSurgeriesNames } from "../types";

function getSurgeriesNames() {
  const [surgeriesNames, setSurgeriesNames] = useState<TSurgeriesNames>([]);
  useEffect(() => {
    pb.collection("surgeries_names")
      .getFullList()
      .then((res) => {
        const surgeriesNames = res.map((record) => {
          return { name: record.name };
        });
        setSurgeriesNames(surgeriesNames);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return { surgeriesNames, setSurgeriesNames };
}

export default getSurgeriesNames;
