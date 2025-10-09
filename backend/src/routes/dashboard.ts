import { Router, Request, Response } from "express";
import { promises as fs } from "fs";
import yaml from "yaml";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await fs.readFile("./dashboard.yaml", "utf8");
    const config = yaml.parse(data);
    res.json(config);
  } catch (error) {
    console.error("Error reading dashboard.yaml:", error);
    res
      .status(500)
      .json({
        error:
          "Failed to read dashboard configuration. Could not find the dashboard.yaml file.",
      });
    return;
  }
});

export default router;
