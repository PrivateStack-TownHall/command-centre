export interface Service {
  name: string;
  status: "online" | "offline" | "warning" | "maintenance";
  uptime: string;
  responseTime: string;
}

export interface AuditLog {
  app: string;
  action: string;
  user: string;
  time: string;
  status: "success" | "warning" | "error";
}
