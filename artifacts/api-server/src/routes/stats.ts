import { Router, type IRouter } from "express";

const router: IRouter = Router();

const ONLINE_MIN = 1100;
const ONLINE_MAX = 1400;
const DRIFT_INTERVAL_MS = 3000;

let simulatedOnline = 1247;
let lastDrift = Date.now();

function driftOnline() {
  const now = Date.now();
  if (now - lastDrift > DRIFT_INTERVAL_MS) {
    simulatedOnline = Math.min(
      ONLINE_MAX,
      Math.max(ONLINE_MIN, simulatedOnline + Math.floor(Math.random() * 11) - 5),
    );
    lastDrift = now;
  }
}

router.get("/online", (_req, res) => {
  driftOnline();
  res.json({ count: simulatedOnline, simulated: true });
});

export default router;
