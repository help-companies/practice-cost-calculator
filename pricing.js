// Pure pricing logic. No dependencies, no DOM, no network.
// Every number lives in PRICES with value / source / as_of / confidence.
// TaxDome list prices: taxdome.com/pricing (primary source, 2026-11-24).
// Independent estimate, not an offer from TaxDome or any vendor.

const MARKT = 'https://www.cpapracticeadvisor.com/2026/11/12/taxdomes-switch-to-per-client-pricing-what-to-work-out-before-your-2027-renewal/193753/';
const TD = 'https://taxdome.com/pricing';
const RESEARCH_DATE = '2026-11-24';

export const PRICES = {
  // ---- TaxDome list price. Primary source: TaxDome's own pricing page and calculator, read 2026-11-24. ----
  // Applies from the first renewal on or after 2027-01-01; current customers keep plan and price until then.
  td_base_annual: { value: 1500, source: TD, as_of: '2026-11-24', confidence: 'high',
    note: 'USD per year for the first 150 active clients. The minimum applies even with fewer than 150 active clients.' },
  td_included_accounts: { value: 150, source: TD, as_of: '2026-11-24', confidence: 'high', note: 'Active clients covered by the base price.' },
  td_included_seats: { value: 20, source: TD, as_of: '2026-11-24', confidence: 'high', note: 'Seats included, no per-seat charge. Above 20 seats: custom pricing, no number published.' },
  td_custom_above_accounts: { value: 3000, source: TD, as_of: '2026-11-24', confidence: 'high', note: 'Above 3,000 active clients: custom pricing, no number published.' },
  td_extra_tiers: { value: [[1, 15], [50, 12], [200, 10.5], [500, 9], [1000, 7.5], [2000, 6], [3000, 5]],
    source: TD, as_of: '2026-11-24', confidence: 'high',
    note: 'Pairs of [first extra client in the band, USD per extra client]. Extra clients = active clients minus 150. Total for extras = the lower of (extras x own band rate) and (start of next band x its rate), rounded up to whole dollars; TaxDome says it applies the lowest total. Modeled from 17 values of the official calculator, all reproduced exactly. Only bracketed, not read directly: the band starts at 50 (between 1 and 50 extras) and 200 (between 150 and 250 extras), and the bands between 2,350 and 2,850 extras were not checked individually.' },
  td_overage_from: { value: 15, source: TD, as_of: '2026-11-24', confidence: 'high',
    note: 'USD per client, "starting at". At the end of each month TaxDome counts active clients above your plan and invoices the overage. A volume pack bought at any time lowers the rate. Shown only as a rough upper bound; the page says "starting at", so the real rate may differ.' },
  td_carryover_cap_pct: { value: 20, source: TD, as_of: '2026-11-24', confidence: 'high',
    note: 'Paid but unused clients roll into the next plan year in full as bonus clients. Bonus clients still unused after that year roll over again, up to 20% of the next year purchase. Carried-over clients cannot be refunded. Not modeled in the price.' },
  td_ai_monthly: { value: 200, source: TD, as_of: '2026-11-24', confidence: 'high', note: 'USD per month, AI add-on.' },
  td_client_care_monthly: { value: 100, source: TD, as_of: '2026-11-24', confidence: 'high', note: 'USD per month, Managed Client Care add-on. Listed for reference, not added to the estimate.' },
  td_premium_support_monthly: { value: 249, source: TD, as_of: '2026-11-24', confidence: 'high', note: 'USD per month, Premium support add-on. Listed for reference, not added to the estimate. White-labeled client app and Extended API: price on request.' },
  td_discount_existing_pct: { value: 50, source: MARKT, as_of: '2026-11-12', confidence: 'low',
    note: 'Percent off extra clients for smaller existing customers, according to a statement by the TaxDome president quoted by CPA Practice Advisor. NOT on the pricing page; terms unknown. Never applied unless you tick it, and then shown as a separate scenario.' },
  td_legacy_seat_list: { value: 1000, source: MARKT, as_of: '2026-11-12', confidence: 'medium',
    note: 'Old list price per seat per year (1-year term). Real contracts differed: users report $600 to $800 per seat and multi-year plans.' },

  // ---- Alternatives: monthly price per user unless noted. Annual = monthly x 12, annual billing, USD. ----
  alt_fc_solo_month: { value: 19, source: 'https://www.financial-cents.com/pricing/', as_of: RESEARCH_DATE, confidence: 'medium', note: 'Financial Cents Solo, single user only. A Reddit user says $20.' },
  alt_fc_team_seat_month: { value: 49, source: 'https://www.financial-cents.com/pricing/', as_of: RESEARCH_DATE, confidence: 'medium', note: 'Team plan, per seat per month, billed annually (vendor pricing page). One Reddit user reported $50.' },
  alt_fc_kba_fee: { value: [1, 2], source: 'https://www.financial-cents.com/pricing/', as_of: RESEARCH_DATE, confidence: 'medium', note: 'USD per identity verification (KBA).' },
  alt_myfirm360_basic_month: { value: 49, source: 'https://www.myfirm360.com/pricing', as_of: RESEARCH_DATE, confidence: 'medium', note: 'Basic, "no user minimum". Whether this is per firm or per user is not clear in the source, so seats are shown as a range.' },
  alt_liscio_user_month_low: { value: 49, source: 'https://liscio.me/pricing', as_of: RESEARCH_DATE, confidence: 'medium', note: 'Per user per month (vendor pricing page).' },
  alt_liscio_user_month_high: { value: 69, source: 'Third-party listings (see market report)', as_of: RESEARCH_DATE, confidence: 'low', note: 'Per user per month, third-party figure.' },
  alt_karbon_user_month_low: { value: 59, source: MARKT, as_of: '2026-11-12', confidence: 'medium', note: 'Per user per month. Financial Cents article also says $59.' },
  alt_karbon_user_month_high: { value: 89, source: 'https://karbonhq.com/pricing/', as_of: RESEARCH_DATE, confidence: 'medium', note: 'Per user per month, billed annually (vendor pricing page). Monthly billing is higher; one Reddit user reported $99.' },
  alt_smartvault_user_month_low: { value: 65, source: 'https://www.smartvault.com/pricing/', as_of: RESEARCH_DATE, confidence: 'medium', note: 'Accounting Pro, per user per month; the vendor page shows a 2-user minimum.' },
  alt_smartvault_user_month_high: { value: 85, source: 'https://www.smartvault.com/pricing/', as_of: RESEARCH_DATE, confidence: 'medium', note: 'Accounting Unlimited, per user per month; the vendor page shows a 2-user minimum.' },
  alt_canopy_user_month: { value: 74, source: 'https://www.getcanopy.com/pricing', as_of: RESEARCH_DATE, confidence: 'medium', note: 'Standard plan, annual billing. Plus and Premium cost more.' },
  alt_canopy_kba_credit: { value: 1.25, source: 'https://www.getcanopy.com/pricing', as_of: RESEARCH_DATE, confidence: 'medium', note: 'USD per KBA credit.' },
  alt_truss_seat_year: { value: 3000, source: 'https://reddit.com/r/taxpros/comments/1xmmn6d/', as_of: '2026-11-03', confidence: 'low', note: 'One user: "1 seat for $3k/year". Single self-reported figure; scaled per seat as an assumption.' },
};

const v = (k) => PRICES[k].value;
const src = (...keys) => keys.map((k) => ({ key: k, source: PRICES[k].source, as_of: PRICES[k].as_of, confidence: PRICES[k].confidence }));
const cents = (usd) => Math.round(usd * 100);

// Points read from the official calculator on taxdome.com/pricing on 2026-11-24: [active clients, USD per year].
export const OFFICIAL_CHECKPOINTS = [
  [150, 1500], [151, 1515], [200, 2100], [235, 2520], [250, 2700], [300, 3300],
  [400, 4125], [499, 5165], [500, 5175], [650, 6000], [750, 6900], [900, 8250],
  [1000, 9000], [1500, 11625], [2000, 13500], [2500, 15600], [3000, 16500],
];
const usd = (n) => '$' + (Number.isInteger(n) ? n : n.toFixed(2));

export function validateInputs(input) {
  const errors = [];
  const add = (field, message) => errors.push({ field, message });
  if (input === null || typeof input !== 'object') return [{ field: 'input', message: 'Input must be an object.' }];
  const { accounts, seats, previousAnnual, aiAddon, addedDuringYear, extraDiscountPct } = input;
  if (typeof accounts !== 'number' || !Number.isInteger(accounts) || accounts < 1 || accounts > 1_000_000)
    add('accounts', 'Active clients must be a whole number between 1 and 1,000,000.');
  if (typeof seats !== 'number' || !Number.isInteger(seats) || seats < 1 || seats > 10_000)
    add('seats', 'Users/seats must be a whole number of at least 1.');
  if (previousAnnual !== undefined && previousAnnual !== null && previousAnnual !== '' &&
      (typeof previousAnnual !== 'number' || !Number.isFinite(previousAnnual) || previousAnnual < 0))
    add('previousAnnual', 'Previous yearly price must be a number of 0 or more, or left empty.');
  if (aiAddon !== undefined && typeof aiAddon !== 'boolean') add('aiAddon', 'AI add-on must be true or false.');
  if (addedDuringYear !== undefined && addedDuringYear !== null &&
      (typeof addedDuringYear !== 'number' || !Number.isInteger(addedDuringYear) || addedDuringYear < 0 || addedDuringYear > 1_000_000))
    add('addedDuringYear', 'Clients you may add during the year must be a whole number of 0 or more, or left empty.');
  if (extraDiscountPct !== undefined &&
      (typeof extraDiscountPct !== 'number' || !Number.isFinite(extraDiscountPct) || extraDiscountPct < 0 || extraDiscountPct > 100))
    add('extraDiscountPct', 'Discount must be between 0 and 100 percent.');
  return errors;
}

// Extras (active clients above 150), in cents: lower of own band and the next band's starting price.
function extrasCents(extras) {
  if (extras <= 0) return { cents: 0, rate: 0 };
  const tiers = v('td_extra_tiers');
  let i = 0;
  while (i + 1 < tiers.length && extras >= tiers[i + 1][0]) i++;
  const own = extras * cents(tiers[i][1]);
  const next = i + 1 < tiers.length ? tiers[i + 1][0] * cents(tiers[i + 1][1]) : Infinity;
  return { cents: Math.min(own, next), rate: tiers[i][1] };
}

// List price in USD per year (no add-ons) for a number of active clients; null above the custom threshold.
function listPrice(accounts) {
  if (accounts > v('td_custom_above_accounts')) return null;
  const e = extrasCents(Math.max(0, accounts - v('td_included_accounts')));
  return v('td_base_annual') + Math.ceil(e.cents / 100);
}

export function compareAlternatives(seats) {
  const y = (m) => m * 12;
  const s = seats;
  const kba = v('alt_fc_kba_fee');
  const fcSolo = s === 1;
  return [
    { id: 'financial_cents', name: 'Financial Cents',
      low: fcSolo ? y(v('alt_fc_solo_month')) : y(v('alt_fc_team_seat_month')) * s,
      high: fcSolo ? y(v('alt_fc_solo_month')) : y(v('alt_fc_team_seat_month')) * s,
      basis: fcSolo ? 'Solo plan, one user' : 'Team plan, per seat, billed annually',
      gaps: [`Identity verification (KBA) costs ${usd(kba[0])} to ${usd(kba[1])} per check extra.`,
        'Firm-branded portal only on a higher plan. Users report it is a downgrade from TaxDome (checklists, file transfer).'],
      sources: src(fcSolo ? 'alt_fc_solo_month' : 'alt_fc_team_seat_month', 'alt_fc_kba_fee') },
    { id: 'myfirm360', name: 'My Firm 360 (Basic)',
      low: y(v('alt_myfirm360_basic_month')), high: y(v('alt_myfirm360_basic_month')) * s,
      basis: s === 1 ? 'Basic plan' : 'Basic plan; flat per firm (low) or per user (high), source unclear',
      gaps: ['E-signature is an extra on Basic.', 'Form 8879 support is not confirmed on the pricing page.'],
      sources: src('alt_myfirm360_basic_month') },
    { id: 'liscio', name: 'Liscio',
      low: y(v('alt_liscio_user_month_low')) * s, high: y(v('alt_liscio_user_month_high')) * s,
      basis: 'Per user; low = vendor figure, high = third-party figure',
      gaps: ['E-signature and payments details were not verified.', 'File-intelligence add-on costs extra.'],
      sources: src('alt_liscio_user_month_low', 'alt_liscio_user_month_high') },
    { id: 'karbon', name: 'Karbon',
      low: y(v('alt_karbon_user_month_low')) * s, high: y(v('alt_karbon_user_month_high')) * s,
      basis: 'Per user; sources disagree on the plan price',
      gaps: ['Users report the client-facing side is less mature and signatures are a headache.',
        'Users report extra per-return costs for return delivery tools. A 3-license minimum was mentioned by one user and is not confirmed.'],
      sources: src('alt_karbon_user_month_low', 'alt_karbon_user_month_high') },
    { id: 'smartvault', name: 'SmartVault',
      low: y(v('alt_smartvault_user_month_low')) * Math.max(s, 2), high: y(v('alt_smartvault_user_month_high')) * Math.max(s, 2),
      basis: 'Per user',
      gaps: ['2-user minimum, so a solo practice pays for two users.', 'Branded portal only from the Business Pro plan.', 'Workflow and e-signature details were not verified.'],
      sources: src('alt_smartvault_user_month_low', 'alt_smartvault_user_month_high') },
    { id: 'canopy', name: 'Canopy (Standard)',
      low: y(v('alt_canopy_user_month')) * s, high: y(v('alt_canopy_user_month')) * s,
      basis: 'Per user, annual billing',
      gaps: [`KBA costs ${usd(v('alt_canopy_kba_credit'))} per credit.`,
        'Card processing 3.3% + $0.20, ACH 1% (max $10). Users report AI workflow and automation add-ons are priced per client.'],
      sources: src('alt_canopy_user_month', 'alt_canopy_kba_credit') },
    { id: 'truss', name: 'Truss',
      low: v('alt_truss_seat_year') * s, high: v('alt_truss_seat_year') * s,
      basis: 'One user-reported price, scaled per seat',
      gaps: ['Only one self-reported price. No pipeline overview yet, according to the same user.'],
      sources: src('alt_truss_seat_year') },
  ];
}

export function estimate(input) {
  const errors = validateInputs(input);
  if (errors.length) return { valid: false, errors };

  const { accounts, seats, aiAddon = false, extraDiscountPct = 0 } = input;
  const previousAnnual = (input.previousAnnual === undefined || input.previousAnnual === null || input.previousAnnual === '')
    ? null : input.previousAnnual;
  const added = input.addedDuringYear || 0;
  const alternatives = compareAlternatives(seats);
  const legacyListEstimate = seats * v('td_legacy_seat_list');

  const custom = accounts > v('td_custom_above_accounts') || seats > v('td_included_seats');
  if (custom) {
    return { valid: true, custom: true, reason: accounts > v('td_custom_above_accounts')
        ? `Above ${v('td_custom_above_accounts').toLocaleString('en-US')} active clients TaxDome quotes custom pricing; no figure is published.`
        : `Above ${v('td_included_seats')} seats TaxDome quotes custom pricing; no figure is published.`,
      price: null, discounted: null, diff: null, diffDiscounted: null, perAccount: null, overage: null,
      legacyListEstimate, alternatives };
  }

  const extras = Math.max(0, accounts - v('td_included_accounts'));
  const e = extrasCents(extras);
  const extraTotal = Math.ceil(e.cents / 100);
  const aiYear = aiAddon ? v('td_ai_monthly') * 12 : 0;
  const price = v('td_base_annual') + extraTotal + aiYear;
  const per = (n) => Math.round((n / accounts) * 100) / 100;

  // Reported discount (trade press only): separate scenario, extras only, never replaces the list price.
  let discounted = null;
  if (extraDiscountPct > 0) {
    const dc = Math.round(e.cents * (100 - extraDiscountPct) / 100);
    discounted = v('td_base_annual') + Math.ceil(dc / 100) + aiYear;
  }

  // Upper bound if the user adds clients mid-year without buying a pack; compared with buying room up front.
  let overage = null;
  if (added > 0) {
    const bigger = listPrice(accounts + added);
    overage = {
      added, upperBound: added * v('td_overage_from'),
      buyAheadPrice: bigger === null ? null : bigger + aiYear,
      buyAheadExtra: bigger === null ? null : bigger - (v('td_base_annual') + extraTotal),
    };
  }

  return {
    valid: true, custom: false, price,
    base: v('td_base_annual'), extraAccounts: extras, extraRate: e.rate, extraTotal,
    ai: aiYear, discountPct: extraDiscountPct, discounted,
    perAccount: per(price), perAccountDiscounted: discounted === null ? null : per(discounted),
    previousAnnual,
    diff: previousAnnual === null ? null : price - previousAnnual,
    diffDiscounted: previousAnnual === null || discounted === null ? null : discounted - previousAnnual,
    overage, legacyListEstimate, alternatives,
  };
}
