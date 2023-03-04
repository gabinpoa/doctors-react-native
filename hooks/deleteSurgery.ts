import { pb } from "../lib/pocketbase";

export default async function deleteSurgery(surgeryId: string) {
  try {
    await pb.collection("surgeries").delete(surgeryId);
  } catch (err) {
    console.log(err);
  }
}
