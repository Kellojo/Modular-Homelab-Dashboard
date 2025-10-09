import express, { Request, Response } from "express";
const packageJson = require("../package.json");
import dashboardRoutes from "./routes/dashboard";
import systemRoutes from "./routes/system";
import uptimeKumaRoutes from "./routes/plugins/uptimekuma/uptimekuma";

const app = express();
const port = process.env.PORT || 3000;

app.use("/dashboard", dashboardRoutes);
app.use("/system", systemRoutes);
app.use("/plugins/uptimekuma", uptimeKumaRoutes);

app.get("/", (req: Request, res: Response) => {
  const systemInfo = {
    uptime: process.uptime(),
    name: packageJson.name,
    version: packageJson.version,
  };
  res.json(systemInfo);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
