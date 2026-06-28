import type { Service } from "../types/monitoring.type";

export const services: Service[] = [
  {
    name: "Kings Brew",
    status: "online",
    uptime: "99.99%",
    responseTime: "92ms",
  },
  {
    name: "Castle Kitchen",
    status: "online",
    uptime: "99.95%",
    responseTime: "105ms",
  },
  {
    name: "Trade Hub",
    status: "warning",
    uptime: "98.22%",
    responseTime: "328ms",
  },
  {
    name: "Byte Burger",
    status: "offline",
    uptime: "91.11%",
    responseTime: "-",
  },
  {
    name: "Quantum Mart",
    status: "online",
    uptime: "99.91%",
    responseTime: "84ms",
  },
];
