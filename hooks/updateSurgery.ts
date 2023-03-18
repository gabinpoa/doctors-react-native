import { ReactHookFormData } from "../components/CreateSurgeryModal";
import { pb } from "../lib/pocketbase";
import { IUpdateSurgeryData } from "../types";
import { CreateSurgeryProps } from "./createSurgery";

interface UpdateSurgeryProps extends ReactHookFormData {
  name: string;
  endDate: string;
  hospitalization: string;
}

async function updateSurgery(id: string, newData: UpdateSurgeryProps) {
  try {
    await pb.collection("surgeries").update(id, {
      ...newData,
    });
  } catch (err) {
    console.log(err);
  }
}
export default updateSurgery;
