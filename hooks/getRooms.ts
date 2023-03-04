import { pb } from "../lib/pocketbase";
import { RoomsRecord } from "../types";

async function getRooms() {
  try {
    const rooms = await pb.collection("rooms").getFullList();
    return rooms;
  } catch (err) {
    console.error(err);
  }
}

export default getRooms;
