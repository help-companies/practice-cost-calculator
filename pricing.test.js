import test from 'node:test';
import assert from 'node:assert/strict';
import { PRICES, OFFICIAL_CHECKPOINTS, estimate, compareAlternatives, validateInputs } from './pricing.js';

const base = { accounts: 100, seats: 1 };

test('PRICES: every entry has value, source, as_of (ISO date), confidence', () => {
  for (const [key, p] of Object.entries(PRICES)) {
    assert.ok('value' in p, `${key}: value`);
    assert.ok(typeof p.source === 'string' && p.source.length > 0, `${key}: source`);
    assert.match(p.as_of, /^\d{4}-\d{2}-\d{2}$/, `${key}: as_of`);
    assert.ok(['high', 'medium', 'low'].includes(p.confidence), `${key}: confidence`);
  }
});

test('PRICES: TaxDome list-price entries come from the pricing page, high confidence, no leftover range assumptions', () => {
  for (const k of ['td_base_annual', 'td_included_accounts', 'td_included_seats', 'td_custom_above_accounts', 'td_extra_tiers', 'td_overage_from', 'td_ai_monthly']) {
    assert.equal(PRICES[k].source, 'https://taxdome.com/pricing', k);
    assert.equal(PRICES[k].as_of, '2026-11-24', k);
    assert.equal(PRICES[k].confidence, 'high', k);
  }
  assert.deepEqual(PRICES.td_extra_tiers.value, [[1, 15], [50, 12], [200, 10.5], [500, 9], [1000, 7.5], [2000, 6], [3000, 5]]);
  assert.match(PRICES.td_extra_tiers.note, /50/);
  assert.match(PRICES.td_extra_tiers.note, /200/);
  assert.equal(PRICES.td_discount_existing_pct.confidence, 'low');
  for (const gone of ['td_extra_prepaid_floor', 'td_tier_500_from_total', 'td_extra_ondemand_small']) assert.equal(gone in PRICES, false, gone);
});

// Primary source: taxdome.com/pricing, official calculator, read 2026-11-24 (taxdome-pricing-page-2026-11-24.md).
const OFFICIAL = [
  [150, 1500], [151, 1515], [200, 2100], [235, 2520], [250, 2700], [300, 3300],
  [400, 4125], [499, 5165], [500, 5175], [650, 6000], [750, 6900], [900, 8250],
  [1000, 9000], [1500, 11625], [2000, 13500], [2500, 15600], [3000, 16500],
];

test('all 17 official calculator values match the list price exactly (no add-ons)', () => {
  assert.equal(OFFICIAL.length, 17);
  for (const [accounts, annual] of OFFICIAL) {
    const r = estimate({ accounts, seats: 1 });
    assert.equal(r.valid, true, String(accounts));
    assert.equal(r.price, annual, `${accounts} active clients`);
  }
  // the exported checkpoint list is the same table
  assert.deepEqual(OFFICIAL_CHECKPOINTS, OFFICIAL);
});

test('list price is a single number, not a range', () => {
  const r = estimate({ accounts: 235, seats: 1 });
  assert.equal(typeof r.price, 'number');
  assert.equal('low' in r, false);
  assert.equal('high' in r, false);
});

test('minimum price: 1 to 150 active clients all cost the $1,500 base', () => {
  for (const accounts of [1, 100, 150]) {
    const r = estimate({ accounts, seats: 1 });
    assert.equal(r.price, 1500);
    assert.equal(r.extraAccounts, 0);
    assert.equal(r.extraTotal, 0);
  }
  assert.equal(estimate({ accounts: 1, seats: 1 }).perAccount, 1500);
});

test('first extra client costs $15; tier rate is reported', () => {
  const r = estimate({ accounts: 151, seats: 1 });
  assert.equal(r.extraAccounts, 1);
  assert.equal(r.extraRate, 15);
  assert.equal(r.price, 1515);
  assert.equal(estimate({ accounts: 235, seats: 1 }).extraRate, 12);   // 85 extras: 50+ tier
  assert.equal(estimate({ accounts: 400, seats: 1 }).extraRate, 10.5); // 250 extras: 200+ tier
  assert.equal(estimate({ accounts: 3000, seats: 1 }).extraRate, 6);   // own tier; the 5.00 tier is cheaper in total
});

test('lowest-total rule: price is the minimum of own tier and next tier minimum', () => {
  // 40..49 extras: 15/each would exceed the 50-extras price of $600, so $600
  assert.equal(estimate({ accounts: 190, seats: 1 }).price, 2100);
  assert.equal(estimate({ accounts: 199, seats: 1 }).price, 2100);
  assert.equal(estimate({ accounts: 189, seats: 1 }).price, 1500 + 39 * 15);
  // 850 extras (1,000 clients): 850 x 9 = 7,650 > 1,000 x 7.50 = 7,500
  assert.equal(estimate({ accounts: 1000, seats: 1 }).price, 9000);
  assert.equal(estimate({ accounts: 1150, seats: 1 }).price, 9000);
  assert.equal(estimate({ accounts: 1151, seats: 1 }).price, 9000 + 8); // 1,001 x 7.50 = 7,507.50 -> 7,508
});

test('price rounds up to whole dollars (499 clients: 3,664.50 -> 3,665)', () => {
  const r = estimate({ accounts: 499, seats: 1 });
  assert.equal(r.extraTotal, 3665);
  assert.equal(r.price, 5165);
  assert.ok(Number.isInteger(r.price));
});

test('price never goes down when you add clients (1 to 3,000)', () => {
  let prev = 0;
  for (let a = 1; a <= 3000; a++) {
    const p = estimate({ accounts: a, seats: 1 }).price;
    assert.ok(p >= prev, `${a}: ${p} < ${prev}`);
    assert.ok(Number.isInteger(p));
    prev = p;
  }
});

test('custom pricing above 3,000 active clients or 20 seats, no number invented', () => {
  assert.equal(estimate({ accounts: 3000, seats: 1 }).custom, false);
  const a = estimate({ accounts: 3001, seats: 1 });
  assert.equal(a.valid, true); assert.equal(a.custom, true); assert.equal(a.price, null);
  assert.equal(estimate({ accounts: 100, seats: 20 }).custom, false);
  const s = estimate({ accounts: 100, seats: 21 });
  assert.equal(s.custom, true); assert.equal(s.price, null);
});

test('AI add-on adds a flat $2,400 per year regardless of size', () => {
  assert.equal(estimate({ ...base, aiAddon: true }).price, 1500 + 2400);
  const r = estimate({ accounts: 500, seats: 6, aiAddon: true });
  assert.equal(r.price, 7575);   // 5,175 + 2,400
  assert.equal(r.ai, 2400);
});

test('reported 50% discount: separate scenario on extra clients only, list price unchanged', () => {
  const r = estimate({ accounts: 235, seats: 1, extraDiscountPct: 50 });
  assert.equal(r.price, 2520);            // list price is never replaced
  assert.equal(r.discounted, 2010);       // 1,500 + 85 x 12 x 0.5
  assert.equal(r.discountPct, 50);
  const withAi = estimate({ accounts: 235, seats: 1, extraDiscountPct: 50, aiAddon: true });
  assert.equal(withAi.price, 2520 + 2400);
  assert.equal(withAi.discounted, 2010 + 2400);
  assert.equal(estimate({ ...base, extraDiscountPct: 50 }).discounted, 1500);
  assert.equal(estimate({ accounts: 235, seats: 1 }).discounted, null);
  assert.equal(estimate({ accounts: 235, seats: 1, extraDiscountPct: 0 }).discounted, null);
  assert.equal(estimate({ accounts: 235, seats: 1, extraDiscountPct: 100 }).discounted, 1500);
});

test('discount rounding: extras rounded up to whole dollars, per-client to cents', () => {
  const r = estimate({ accounts: 235, seats: 1, extraDiscountPct: 33 });
  assert.equal(r.discounted, 2184);   // 1,020 x 0.67 = 683.40 -> 684
  assert.equal(r.perAccountDiscounted, 9.29); // 2184 / 235
  assert.equal(r.perAccount, 10.72);          // 2520 / 235
});

test('difference to previous annual price (list and discount scenario)', () => {
  const r = estimate({ accounts: 235, seats: 1, previousAnnual: 700, extraDiscountPct: 50 });
  assert.equal(r.diff, 1820);
  assert.equal(r.diffDiscounted, 1310);
  assert.equal(estimate({ accounts: 235, seats: 1 }).diff, null);
  assert.equal(estimate({ accounts: 235, seats: 1, previousAnnual: null }).diff, null);
  assert.equal(estimate({ accounts: 235, seats: 1, previousAnnual: '' }).diff, null);
  assert.equal(estimate({ ...base, previousAnnual: 2000 }).diff, -500);
});

test('overage hint: clients added mid-year without a pack cost up to $15 each (upper bound)', () => {
  const r = estimate({ accounts: 235, seats: 1, addedDuringYear: 40 });
  assert.equal(r.overage.added, 40);
  assert.equal(r.overage.upperBound, 600);
  // buying room for 275 instead of 235, computed from the same model
  assert.equal(r.overage.buyAheadPrice, estimate({ accounts: 275, seats: 1 }).price);
  assert.equal(r.overage.buyAheadExtra, estimate({ accounts: 275, seats: 1 }).price - 2520);
  assert.ok(r.overage.buyAheadExtra <= r.overage.upperBound);
  assert.equal(estimate({ accounts: 235, seats: 1 }).overage, null);
  assert.equal(estimate({ accounts: 235, seats: 1, addedDuringYear: 0 }).overage, null);
  // growth past 3,000 has no published price
  const big = estimate({ accounts: 2990, seats: 1, addedDuringYear: 50 });
  assert.equal(big.overage.upperBound, 750);
  assert.equal(big.overage.buyAheadPrice, null);
});

test('buying a bit too large is cheaper than overage: 190 clients cost the same as 200', () => {
  assert.equal(estimate({ accounts: 190, seats: 1 }).price, estimate({ accounts: 200, seats: 1 }).price);
});

test('invalid inputs are rejected with field-level errors', () => {
  const bad = [
    [{ accounts: 0, seats: 1 }, 'accounts'],
    [{ accounts: -5, seats: 1 }, 'accounts'],
    [{ accounts: 1.5, seats: 1 }, 'accounts'],
    [{ accounts: NaN, seats: 1 }, 'accounts'],
    [{ accounts: '12', seats: 1 }, 'accounts'],
    [{ accounts: undefined, seats: 1 }, 'accounts'],
    [{ accounts: 10_000_000, seats: 1 }, 'accounts'],
    [{ accounts: 10, seats: 0 }, 'seats'],
    [{ accounts: 10, seats: 2.5 }, 'seats'],
    [{ accounts: 10, seats: 1, previousAnnual: -1 }, 'previousAnnual'],
    [{ accounts: 10, seats: 1, previousAnnual: Infinity }, 'previousAnnual'],
    [{ accounts: 10, seats: 1, extraDiscountPct: -1 }, 'extraDiscountPct'],
    [{ accounts: 10, seats: 1, extraDiscountPct: 101 }, 'extraDiscountPct'],
    [{ accounts: 10, seats: 1, addedDuringYear: -1 }, 'addedDuringYear'],
    [{ accounts: 10, seats: 1, addedDuringYear: 1.5 }, 'addedDuringYear'],
    [{ accounts: 10, seats: 1, aiAddon: 'yes' }, 'aiAddon'],
  ];
  for (const [input, field] of bad) {
    const r = estimate(input);
    assert.equal(r.valid, false, JSON.stringify(input));
    assert.ok(r.errors.some((e) => e.field === field), `${JSON.stringify(input)} -> ${field}`);
  }
  assert.equal(estimate(null).valid, false);
  assert.equal(validateInputs(base).length, 0);
});

test('alternatives, solo: only vendors with documented prices, each with source and date', () => {
  const alts = compareAlternatives(1);
  const byId = Object.fromEntries(alts.map((a) => [a.id, a]));
  assert.equal(byId.financial_cents.low, 228);
  assert.equal(byId.financial_cents.high, 228);
  assert.equal(byId.myfirm360.low, 588);
  assert.equal(byId.liscio.low, 588);
  assert.equal(byId.liscio.high, 828);
  assert.equal(byId.karbon.low, 708);
  assert.equal(byId.karbon.high, 1068);
  assert.equal(byId.smartvault.low, 1560); // 2-user minimum
  assert.equal(byId.smartvault.high, 2040);
  assert.equal(byId.canopy.low, 888);
  assert.equal(byId.truss.low, 3000);
  assert.equal(byId.soraban, undefined);
  assert.equal(byId.safesend, undefined);
  for (const a of alts) {
    assert.ok(a.name && a.gaps.length > 0, a.id);
    assert.ok(a.sources.length > 0 && a.sources.every((s) => s.source && s.as_of), a.id);
  }
});

test('alternatives, 3 seats: per-seat vendors scale, Financial Cents switches to team basis', () => {
  const byId = Object.fromEntries(compareAlternatives(3).map((a) => [a.id, a]));
  assert.equal(byId.canopy.low, 2664);
  assert.equal(byId.financial_cents.low, 1764);
  assert.equal(byId.myfirm360.low, 588);
  assert.equal(byId.myfirm360.high, 1764);
  assert.equal(byId.karbon.low, 2124);
});

test('estimate() includes alternatives for the same seat count', () => {
  const r = estimate({ accounts: 235, seats: 1 });
  assert.equal(r.alternatives.length, compareAlternatives(1).length);
});
