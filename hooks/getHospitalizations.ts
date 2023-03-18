import { useEffect, useState } from "react";
import { IHospitalization } from "../components/CreateSurgeryModal";
import { pb } from "../lib/pocketbase";

export default function getHospitalizations() {
  const [hospitalizations, setHospitalizations] = useState<IHospitalization[]>(
    []
  );

  useEffect(() => {
    pb.collection("hospitalization_types")
      .getFullList()
      .then((res) =>
        setHospitalizations(
          res.map((hospitalization) => {
            return { name: hospitalization.name, id: hospitalization.id };
          })
        )
      )
      .catch((e) => console.log(e + " getHospitalizations"));
  }, []);

  return { hospitalizations, setHospitalizations };
}
