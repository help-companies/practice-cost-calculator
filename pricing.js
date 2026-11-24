// Pure pricing logic. No dependencies, no DOM, no network.
// Every number lives in PRICES with value / source / as_of / confidence.
// Independent estimate, not an offer from TaxDome or any vendor.

const MARKT = 'https://www.cpapracticeadvisor.com/2026/11/12/taxdomes-switch-to-per-client-pricing-what-to-work-out-before-your-2027-renewal/193753/';
const CARD = 'https://reddit.com/r/taxpros/comments/1xlynzl/_/19s1dv3450x0i';
const TRACKER = 'https://pricingsaas.com/companies/taxdome';
const RESEARCH_DATE = '2026-11-24';

export const PRICES = {
  // ---- TaxDome, per-active-client-account model (from first renewal on/after 2027-01-01) ----
  td_base_annual: { value: 1500, source: MARKT, as_of: '2026-11-12', confidence: 'medium',
    note: 'USD per year for the first 150 active accounts and up to 20 team members. Trade-press report; taxdome.com itself was not readable. A Reddit user-posted price card agrees.' },
  td_included_accounts: { value: 150, source: MARKT, as_of: '2026-11-12', confidence: 'medium', note: 'Active accounts covered by the base price.' },
  td_included_seats: { value: 20, source: MARKT, as_of: '2026-11-12', confidence: 'medium', note: 'Team members covered by the base price. Above this: custom pricing, no number published.' },
  td_custom_above_accounts: { value: 3000, source: MARKT, as_of: '2026-11-12', confidence: 'medium', note: 'Above 3,000 accounts: custom pricing, no number published.' },
  td_extra_prepaid_floor: { value: 6, source: MARKT, as_of: '2026-11-12', confidence: 'low',
    note: 'USD per extra account, lowest end of "$12 to $6 depending on pack size". The Reddit price card shows no price below $7.50, so this lower end is unconfirmed. Used as the low bound for prepaid extras.' },
  td_extra_prepaid_small: { value: 12, source: CARD, as_of: '2026-11-02', confidence: 'medium',
    note: 'USD per extra account, prepaid, 50-pack, used for total accounts below 500. Also the top of the range in the trade-press report.' },
  td_extra_prepaid_500: { value: 9, source: CARD, as_of: '2026-11-02', confidence: 'low', note: 'Prepaid, 500 tier. Single user-posted copy of the price card.' },
  td_extra_prepaid_1000: { value: 7.5, source: CARD, as_of: '2026-11-02', confidence: 'low', note: 'Prepaid, 1,000 tier. Single user-posted copy of the price card.' },
  td_extra_ondemand_small: { value: 13.5, source: CARD, as_of: '2026-11-02', confidence: 'low', note: 'USD per extra account bought mid-term, 50-pack tier (total accounts below 500).' },
  td_extra_ondemand_500: { value: 10.5, source: CARD, as_of: '2026-11-02', confidence: 'low', note: 'Mid-term, 500 tier. Matches one user who reported $7,575 for 500 accounts incl. AI add-on.' },
  td_extra_ondemand_1000: { value: 9, source: CARD, as_of: '2026-11-02', confidence: 'low', note: 'Mid-term, 1,000 tier.' },
  td_extra_ondemand_single: { value: 15, source: MARKT, as_of: '2026-11-12', confidence: 'medium', note: 'USD per single extra account bought on demand (below a 50-pack). Also the high bound for on-demand extras. Price card agrees.' },
  td_single_below_extras: { value: 50, source: CARD, as_of: '2026-11-02', confidence: 'low', note: 'Fewer extra accounts than this are treated as singles at the on-demand single price.' },
  td_tier_500_from_total: { value: 500, source: CARD, as_of: '2026-11-02', confidence: 'low',
    note: 'ASSUMPTION inferred from one data point: the tier is chosen by total accounts, not by extra accounts. Not stated by any source.' },
  td_tier_1000_from_total: { value: 1000, source: CARD, as_of: '2026-11-02', confidence: 'low', note: 'Same assumption as above.' },
  td_ai_monthly: { value: 200, source: MARKT, as_of: '2026-11-12', confidence: 'high', note: 'USD per month, flat, AI/MCP/API add-on. Reddit comments say the same.' },
  td_discount_existing_pct: { value: 50, source: MARKT, as_of: '2026-11-12', confidence: 'low',
    note: 'Percent off extra accounts for smaller existing customers, according to a statement by the TaxDome president quoted by CPA Practice Advisor. Not on the pricing page; terms unknown. Never applied unless you tick it.' },
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
const usd = (n) => '$' + (Number.isInteger(n) ? n : n.toFixed(2));

export function validateInputs(input) {
  const errors = [];
  const add = (field, message) => errors.push({ field, message });
  if (input === null || typeof input !== 'object') return [{ field: 'input', message: 'Input must be an object.' }];
  const { accounts, seats, previousAnnual, aiAddon, extraMode, extraDiscountPct } = input;
  if (typeof accounts !== 'number' || !Number.isInteger(accounts) || accounts < 1 || accounts > 1_000_000)
    add('accounts', 'Active client accounts must be a whole number between 1 and 1,000,000.');
  if (typeof seats !== 'number' || !Number.isInteger(seats) || seats < 1 || seats > 10_000)
    add('seats', 'Users/seats must be a whole number of at least 1.');
  if (previousAnnual !== undefined && previousAnnual !== null && previousAnnual !== '' &&
      (typeof previousAnnual !== 'number' || !Number.isFinite(previousAnnual) || previousAnnual < 0))
    add('previousAnnual', 'Previous yearly price must be a number of 0 or more, or left empty.');
  if (aiAddon !== undefined && typeof aiAddon !== 'boolean') add('aiAddon', 'AI add-on must be true or false.');
  if (extraMode !== undefined && extraMode !== 'prepaid' && extraMode !== 'on_demand')
    add('extraMode', 'Extra accounts must be "prepaid" or "on_demand".');
  if (extraDiscountPct !== undefined &&
      (typeof extraDiscountPct !== 'number' || !Number.isFinite(extraDiscountPct) || extraDiscountPct < 0 || extraDiscountPct > 100))
    add('extraDiscountPct', 'Discount must be between 0 and 100 percent.');
  return errors;
}

// Per-extra-account USD range for the given total accounts and mode.
function extraRate(accounts, extras, mode) {
  const t500 = accounts >= v('td_tier_500_from_total');
  const t1000 = accounts >= v('td_tier_1000_from_total');
  if (mode === 'prepaid') {
    const top = t1000 ? v('td_extra_prepaid_1000') : t500 ? v('td_extra_prepaid_500') : v('td_extra_prepaid_small');
    return { low: v('td_extra_prepaid_floor'), high: top };
  }
  const single = v('td_extra_ondemand_single');
  if (extras < v('td_single_below_extras')) return { low: single, high: single };
  const tier = t1000 ? v('td_extra_ondemand_1000') : t500 ? v('td_extra_ondemand_500') : v('td_extra_ondemand_small');
  return { low: tier, high: single };
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

  const { accounts, seats, aiAddon = false, extraMode = 'prepaid', extraDiscountPct = 0 } = input;
  const previousAnnual = (input.previousAnnual === undefined || input.previousAnnual === null || input.previousAnnual === '')
    ? null : input.previousAnnual;
  const alternatives = compareAlternatives(seats);
  const legacyListEstimate = seats * v('td_legacy_seat_list');

  const custom = accounts > v('td_custom_above_accounts') || seats > v('td_included_seats');
  if (custom) {
    return { valid: true, custom: true, reason: accounts > v('td_custom_above_accounts')
        ? `Above ${v('td_custom_above_accounts')} accounts TaxDome quotes custom pricing; no figure is published.`
        : `Above ${v('td_included_seats')} team members TaxDome quotes custom pricing; no figure is published.`,
      low: null, high: null, diffLow: null, diffHigh: null, perAccountLow: null, perAccountHigh: null,
      legacyListEstimate, alternatives };
  }

  const extras = Math.max(0, accounts - v('td_included_accounts'));
  const rate = extraRate(accounts, extras, extraMode);
  const keep = (100 - extraDiscountPct) / 100;
  const extraLowC = Math.round(extras * cents(rate.low) * keep);
  const extraHighC = Math.round(extras * cents(rate.high) * keep);
  const baseC = cents(v('td_base_annual'));
  const aiC = aiAddon ? cents(v('td_ai_monthly')) * 12 : 0;
  const low = Math.round((baseC + extraLowC + aiC) / 100);
  const high = Math.round((baseC + extraHighC + aiC) / 100);
  const per = (n) => Math.round((n / accounts) * 100) / 100;

  return {
    valid: true, custom: false, low, high,
    base: v('td_base_annual'), extraAccounts: extras,
    extraRateLow: rate.low, extraRateHigh: rate.high,
    extraLow: extraLowC / 100, extraHigh: extraHighC / 100,
    ai: aiC / 100, discountPct: extraDiscountPct, mode: extraMode,
    perAccountLow: per(low), perAccountHigh: per(high),
    previousAnnual,
    diffLow: previousAnnual === null ? null : low - previousAnnual,
    diffHigh: previousAnnual === null ? null : high - previousAnnual,
    legacyListEstimate, alternatives,
  };
}
