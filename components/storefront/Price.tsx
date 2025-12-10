interface PriceProps {
  amount: number;
  currency?: string;
  className?: string;
}

const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export default function Price({ amount, currency = "USD", className }: PriceProps) {
  return <span className={className}>{formatCurrency(amount, currency)}</span>;
}
