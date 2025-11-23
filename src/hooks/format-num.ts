export function formatCurrency(amount: number, withCents = false) {
  if (!amount) return 0;
  amount = amount / 100;
  if (!withCents) {
    amount = Math.floor(amount);
  }
  return new Intl.NumberFormat("en-US").format(amount);
}

export function formatCurrencyCents(amount: number) {
  if (!amount) return "";

  const formatted = new Intl.NumberFormat("en-US").format(amount / 100);
  const parts = formatted.split(".");
  if (parts.length < 2) {
    return "";
  } else {
    return "." + parts[1];
  }
}
