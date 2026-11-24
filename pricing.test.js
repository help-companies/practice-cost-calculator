import test from 'node:test';
import assert from 'node:assert/strict';
import { PRICES, estimate, compareAlternatives, validateInputs } from './pricing.js';

const base = { accounts: 100, seats: 1 };

test('PRICES: every entry has value, source, as_of (ISO date), confidence', () => {
  for (const [key, p] of Object.entries(PRICES)) {
    assert.ok('value' in p, `${key}: value`);
    assert.ok(typeof p.source === 'string' && p.source.length > 0, `${key}: source`);
    assert.match(p.as_of, /^\d{4}-\d{2}-\d{2}$/, `${key}: as_of`);
    assert.ok(['high', 'medium', 'low'].includes(p.confidence), `${key}: confidence`);
  }
});

test('minimum price: 1 account and 150 accounts both cost the $1,500 base', () => {
  for (const accounts of [1, 100, 150]) {
    const r = estimate({ accounts, seats: 1 });
    assert.equal(r.valid, true);
    assert.equal(r.low, 1500);
    assert.equal(r.high, 1500);
    assert.equal(r.extraAccounts, 0);
  }
  assert.equal(estimate({ accounts: 1, seats: 1 }).perAccountLow, 1500);
});

test('tier boundary: 151st account is the first extra (prepaid $6-$12)', () => {
  const r = estimate({ accounts: 151, seats: 1 });
  assert.equal(r.extraAccounts, 1);
  assert.equal(r.low, 1506);
  assert.equal(r.high, 1512);
});

test('extra accounts, prepaid, 235 accounts: 85 extras x $6..$12', () => {
  const r = estimate({ accounts: 235, seats: 1 });
  assert.equal(r.low, 2010);
  assert.equal(r.high, 2520);
  assert.equal(r.perAccountLow, 8.55);
  assert.equal(r.perAccountHigh, 10.72);
});

test('extra accounts, on demand: singles under a 50-pack cost $15', () => {
  const r = estimate({ accounts: 151, seats: 1, extraMode: 'on_demand' });
  assert.equal(r.low, 1515);
  assert.equal(r.high, 1515);
});

test('extra accounts, on demand, 500 total: 350 extras x $10.50..$15', () => {
  const r = estimate({ accounts: 500, seats: 6, extraMode: 'on_demand' });
  assert.equal(r.low, 5175);
  assert.equal(r.high, 6750);
});

test('price tier follows total accounts (1,000 accounts prepaid: $6..$7.50 x 850)', () => {
  const r = estimate({ accounts: 1000, seats: 1 });
  assert.equal(r.low, 6600);
  assert.equal(r.high, 7875);
});

test('custom pricing above 3,000 accounts or 20 seats, no number invented', () => {
  assert.equal(estimate({ accounts: 3000, seats: 1 }).custom, false);
  const a = estimate({ accounts: 3001, seats: 1 });
  assert.equal(a.valid, true); assert.equal(a.custom, true); assert.equal(a.low, null);
  assert.equal(estimate({ accounts: 100, seats: 20 }).custom, false);
  const s = estimate({ accounts: 100, seats: 21 });
  assert.equal(s.custom, true); assert.equal(s.high, null);
});

test('AI add-on adds a flat $2,400 per year regardless of size', () => {
  assert.equal(estimate({ ...base, aiAddon: true }).low, 1500 + 2400);
  const r = estimate({ accounts: 500, seats: 6, extraMode: 'on_demand', aiAddon: true });
  assert.equal(r.low, 7575);
  assert.equal(r.high, 9150);
  assert.equal(r.ai, 2400);
});

test('discount applies to extra accounts only, not to base or AI', () => {
  const r = estimate({ accounts: 235, seats: 1, extraDiscountPct: 50 });
  assert.equal(r.low, 1755);
  assert.equal(r.high, 2010);
  const withAi = estimate({ accounts: 235, seats: 1, extraDiscountPct: 50, aiAddon: true });
  assert.equal(withAi.low, 1755 + 2400);
  assert.equal(estimate({ ...base, extraDiscountPct: 50 }).low, 1500);
  assert.equal(estimate({ accounts: 235, seats: 1, extraDiscountPct: 0 }).low, 2010);
  assert.equal(estimate({ accounts: 235, seats: 1, extraDiscountPct: 100 }).high, 1500);
});

test('rounding: totals to whole dollars, per-account to cents', () => {
  const r = estimate({ accounts: 235, seats: 1, extraDiscountPct: 33 });
  assert.equal(r.low, 1842);   // 1500 + 341.70
  assert.equal(r.high, 2183);  // 1500 + 683.40
  assert.equal(r.perAccountLow, 7.84); // 1842 / 235
  assert.ok(Number.isInteger(r.low) && Number.isInteger(r.high));
});

test('difference to previous annual price', () => {
  const r = estimate({ accounts: 235, seats: 1, previousAnnual: 700 });
  assert.equal(r.diffLow, 1310);
  assert.equal(r.diffHigh, 1820);
  assert.equal(estimate({ accounts: 235, seats: 1 }).diffLow, null);
  assert.equal(estimate({ accounts: 235, seats: 1, previousAnnual: null }).diffHigh, null);
  assert.equal(estimate({ accounts: 235, seats: 1, previousAnnual: '' }).diffHigh, null);
  assert.equal(estimate({ ...base, previousAnnual: 2000 }).diffLow, -500);
});

test('legacy list estimate is seats x $1,000 and labelled as list price', () => {
  const r = estimate({ accounts: 100, seats: 3 });
  assert.equal(r.legacyListEstimate, 3000);
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
    [{ accounts: 10, seats: 1, extraMode: 'monthly' }, 'extraMode'],
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
