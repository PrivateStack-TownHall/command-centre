import axios from "axios";

const AUDIT_LOG_URL = import.meta.env.VITE_AUDIT_LOG_URL;

export async function getAuditLogs() {
  if (!AUDIT_LOG_URL) {
    return [];
  }

  const response = await axios.get(`${AUDIT_LOG_URL}`);

  return response.data;
}
