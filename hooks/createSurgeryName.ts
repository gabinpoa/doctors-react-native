import { pb } from "../lib/pocketbase";

async function createSurgeryName(name: string) {
  if (pb.authStore.model) {
    await pb
      .collection("surgeries_names")
      .create({ name: name, institution: pb.authStore.model.institution });
  }
}

export default createSurgeryName;
