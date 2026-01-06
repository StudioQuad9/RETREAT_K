// @/lib/server/stripe.js

import "server-only";
import { Stripe } from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}
// apiVersion は固定しておくと将来の破壊的変更に強い
export const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });