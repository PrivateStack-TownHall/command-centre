## Isi repository

| Folder       | Isi                                                                     |
| ------------ | ----------------------------------------------------------------------- |
| `front-end/` | Aplikasi dashboard (React, TypeScript, Vite)                            |
| `bff/`       | Backend for Frontend: agregasi 12 backend dengan snapshot di PostgreSQL |

## Menjalankan

Butuh dua terminal:

```bash
# 1. BFF
cd bff && npm install && npm run migrate:dev && npm run start:dev

# 2. Front-end
cd front-end && npm install && npm run dev
```
