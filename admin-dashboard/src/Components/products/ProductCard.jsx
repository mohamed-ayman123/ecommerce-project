import {
  FaBoxOpen,
  FaEye,
  FaPen,
  FaSliders,
  FaStar,
  FaTrash,
} from "react-icons/fa6";

function ProductCard({
  product,
  onView,
  onEdit,
  onQuickEdit,
  onDelete,
  isDarkMode,
}) {
  const {
    id,
    name,
    category,
    brand,
    description,
    price,
    discountPrice,
    stock,
    images = [],
    tags = [],
    featured,
  } = product;

  const image =
    images.length > 0
      ? images[0]
      : "https://via.placeholder.com/600x400?text=Product";

  const hasDiscount =
    discountPrice !== null &&
    discountPrice !== undefined &&
    Number(discountPrice) < Number(price);

  const discountPercentage = hasDiscount
    ? Math.round(
        ((Number(price) - Number(discountPrice)) /
          Number(price)) *
          100
      )
    : 0;

  const displayPrice = hasDiscount
    ? discountPrice
    : price;

  return (
    <div
      className={`group overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isDarkMode
          ? "border-slate-800 bg-slate-900"
          : "border-slate-200 bg-white"
      }`}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.src =
              "https://via.placeholder.com/600x400?text=Product";
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Featured */}
        {featured && (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-lg">
            <FaStar />
            Featured
          </div>
        )}

        {/* Discount */}
        {hasDiscount && (
          <div className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
            -{discountPercentage}%
          </div>
        )}

        {/* Stock */}
        <div className="absolute bottom-3 left-3">
          {stock > 0 ? (
            <span className="rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
              {stock} in stock
            </span>
          ) : (
            <span className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
              Out of stock
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category + Brand */}
        <div className="mb-2 flex items-center justify-between gap-3">
          <span
            className={`text-xs font-semibold uppercase tracking-wide ${
              isDarkMode
                ? "text-green-400"
                : "text-green-700"
            }`}
          >
            {category}
          </span>

          <span
            className={`text-xs ${
              isDarkMode
                ? "text-slate-500"
                : "text-slate-400"
            }`}
          >
            {brand}
          </span>
        </div>

        {/* Name */}
        <h3
          className={`line-clamp-1 text-lg font-bold ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}
        >
          {name}
        </h3>

        {/* Description */}
        <p
          className={`mt-2 line-clamp-2 min-h-10 text-sm leading-5 ${
            isDarkMode
              ? "text-slate-400"
              : "text-slate-500"
          }`}
        >
          {description}
        </p>

        {/* Price */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-xl font-bold text-green-600 dark:text-green-400">
            ${displayPrice}
          </span>

          {hasDiscount && (
            <span className="text-sm text-slate-400 line-through">
              ${price}
            </span>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={`${id}-${tag}`}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                  isDarkMode
                    ? "bg-slate-800 text-slate-300"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div
          className={`mt-5 grid grid-cols-4 gap-2 border-t pt-4 ${
            isDarkMode
              ? "border-slate-800"
              : "border-slate-100"
          }`}
        >
          <ActionButton
            label="View"
            icon={<FaEye />}
            onClick={() => onView(product)}
            isDarkMode={isDarkMode}
          />

          <ActionButton
            label="Edit"
            icon={<FaPen />}
            onClick={() => onEdit(product)}
            variant="primary"
            isDarkMode={isDarkMode}
          />

          <ActionButton
            label="Quick"
            icon={<FaSliders />}
            onClick={() => onQuickEdit(product)}
            isDarkMode={isDarkMode}
          />

          <ActionButton
            label="Delete"
            icon={<FaTrash />}
            onClick={() => onDelete(id)}
            variant="danger"
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  icon,
  onClick,
  variant = "default",
  isDarkMode,
}) {
  let className = "";

  if (variant === "primary") {
    className =
      "border-green-700 bg-green-700 text-white hover:bg-green-800";
  } else if (variant === "danger") {
    className =
      "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50";
  } else if (isDarkMode) {
    className =
      "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white";
  } else {
    className =
      "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`flex min-w-0 items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-semibold transition-all ${className}`}
    >
      {icon}
      <span className="hidden xl:inline">
        {label}
      </span>
    </button>
  );
}

export default ProductCard;