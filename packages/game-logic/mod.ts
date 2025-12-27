/**
 * @bubble/logic - Core game rules and validation
 *
 * This package contains pure TypeScript game logic that is shared
 * between the client (Phaser) and server (Supabase Edge Functions).
 */

export const VERSION = "0.0.1";

// Game constants
export const BOARD_SIZE = 40;
export const STARTING_CASH = 500_000;
export const STARTING_EQUITY = 100;
export const MIN_EQUITY = 10;
export const UNICORN_VALUATION = 1_000_000_000;
export const IPO_MIN_VALUATION = 500_000_000;
export const DEMO_DAY_BONUS = 200_000;

// TODO: Export game types, rules, and validation functions
