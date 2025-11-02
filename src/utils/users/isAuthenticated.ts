import { pb } from "src/connections/pocketbase";

export default function isAuthenticated() {
  const isAuthenticated = pb.authStore?.isValid; // currently valid for 2 weeks

  if (!isAuthenticated) {
    pb.authStore.clear();
  }

  return isAuthenticated;
}
