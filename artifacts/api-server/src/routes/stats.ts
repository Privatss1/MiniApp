import { Router, type IRouter } from "express";

const router: IRouter = Router();

const ONLINE_BASE = 1247;
const ONLINE_MIN = 1100;
const ONLINE_MAX = 1400;

let currentOnline = ONLINE_BASE;
let lastUpdate = Date.now();

function refreshOnline() {
  const now = Date.now();
  if (now - lastUpdate > 3000) {
    currentOnline += Math.floor(Math.random() * 11) - 5;
    if (currentOnline < ONLINE_MIN) currentOnline = ONLINE_MIN;
    if (currentOnline > ONLINE_MAX) currentOnline = ONLINE_MAX;
    lastUpdate = now;
  }
}

router.get("/online", (_req, res) => {
  refreshOnline();
  res.json({ count: currentOnline });
});

export default router;
