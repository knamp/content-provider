import { Request, Response, Router } from "express";

export default () => {
  const healthRoutes: Router = Router();

  healthRoutes.get("/alive", (req: Request, res: Response): void => {
    res.status(200).end();
  });

  healthRoutes.get("/admin/health", (req: Request, res: Response): void => {
    res.status(200).json({
      status: "UP",
    });
  });

  healthRoutes.get("/admin/healthcheck", (req: Request, res: Response): void => {
    res.status(200).end();
  });

  return healthRoutes;
};
