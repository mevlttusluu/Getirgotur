export function isProductInStock(product) {
  return Number(product?.stock ?? 0) > 0;
}

const variants = {
  card: {
    active:
      "inline-flex items-center gap-1 rounded-full bg-violet-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md",
    disabled:
      "inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-500 cursor-not-allowed",
  },
  detail: {
    active:
      "inline-flex items-center rounded-full bg-violet-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md",
    disabled:
      "inline-flex items-center rounded-full bg-slate-200 px-8 py-2.5 text-sm font-semibold text-slate-500 cursor-not-allowed",
  },
  favorites: {
    active:
      "inline-flex items-center rounded-full bg-violet-600 px-4 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md",
    disabled:
      "inline-flex items-center rounded-full bg-slate-200 px-4 py-2 text-[11px] font-semibold text-slate-500 cursor-not-allowed",
  },
};

export default function AddToCartButton({
  product,
  onAdd,
  variant = "card",
}) {
  const inStock = isProductInStock(product);
  const styles = variants[variant] ?? variants.card;

  if (!inStock) {
    return (
      <button type="button" disabled className={styles.disabled}>
        Tükendi
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onAdd(product)}
      className={styles.active}
    >
      Sepete Ekle
    </button>
  );
}
