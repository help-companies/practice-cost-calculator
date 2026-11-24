// Switching Kit placeholder. While `available` is false the page shows "Coming soon" only.
// No checkout, no email capture. Set checkoutUrl and available: true only once a real product exists.
export const KIT = {
  title: 'TaxDome Switching Kit',
  bullets: [
    'Step-by-step export order: what the CSV export covers (accounts, contacts, jobs, invoices, payments) and what it does not (documents, chats).',
    'A spreadsheet that splits your client list into active and inactive, using TaxDome\'s own definition of an active account.',
    'Side-by-side cost sheet for alternatives, with a source and date next to every price.',
    'Three plain-language letters telling clients about a portal change.',
    'A checklist for updating your written information security plan (points to IRS Pub. 5708; not legal advice).',
  ],
  price: null,        // undecided; the market report suggested testing around $39
  checkoutUrl: '',
  available: false,
};
