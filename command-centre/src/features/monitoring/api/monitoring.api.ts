import axios from "axios";

export async function getAuditLogs() {
  const response = await axios.get("http://localhost:3000/audit-logs");

  return response.data;
}
