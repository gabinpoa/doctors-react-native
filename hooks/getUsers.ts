import { pb } from "../lib/pocketbase";

export default async function getUsers() {
  try {
    const users = await pb.collection("users").getFullList();
    return users;
  } catch (err) {
    console.log(err);
  }
}
