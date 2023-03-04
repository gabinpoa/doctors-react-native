import { pb } from "../lib/pocketbase";
import { ISurgeryData, IUpdateSurgeryData } from "../types";

async function updateSurgery(id: string, newData: IUpdateSurgeryData) {
  try {
    await pb.collection("surgeries").update(id, {
      ...newData,
    });
  } catch (err) {
    console.log(err);
  }
}
export default updateSurgery;
