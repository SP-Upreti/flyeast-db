import { api } from "./api";


  export async function fetchLoginStats() {
    const { data } = await api.get("/stats/logins");
    return {
     data
    };
  }