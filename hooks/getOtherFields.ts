import { Record } from "pocketbase";
import { useEffect, useState } from "react";
import { pb } from "../lib/pocketbase";

export interface OtherFieldsRecord extends Record {
  name: string;
  institution: string;
  type: FieldType;
}

export enum FieldType {
  boolean = "boolean",
  text = "text",
}

export default () => {
  const [otherFields, setOtherFields] = useState<OtherFieldsRecord[]>();

  useEffect(() => {
    pb.collection("other_fields")
      .getFullList()
      .then((res: unknown) => {
        setOtherFields(res as OtherFieldsRecord[]);
      })
      .catch((e) => {
        console.log(JSON.stringify(e));
      });
  }, []);

  return otherFields;
};
