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
          return { name: record.name, id: record.id };
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
