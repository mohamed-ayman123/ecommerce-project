import { useEffect, useMemo, useState } from "react";
import {
  FaArrowTrendUp,
  FaBoxOpen,
  FaBoxesStacked,
  FaEye,
  FaMagnifyingGlass,
  FaPen,
  FaPlus,
  FaSliders,
  FaStar,
  FaTrash,
  FaXmark,
} from "react-icons/fa6";

import ProductCard from "@/Components/products/ProductCard";

const initialProducts = [
  {
    id: 1,
    name: "apple 17 Pro Max",
    category: "apple",
    brand: "Apple",
    description:
      "applewith advanced performance, camera system and beautiful display.",
    price: 1499,
    discountPrice: 1399,
    stock: 24,
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    ],
    tags: ["iPhone", "Apple", "Premium"],
    featured: true,
  },
  {
    id: 2,
    name: "Samsung Galaxy S25 Ultra",
    category: "lab",
    brand: "labtop",
    description:
      "Powerful Android smartphone with a large display and professional camera system.",
    price: 1199,
    discountPrice: null,
    stock: 18,
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
    ],
    tags: ["Samsung", "Android", "Galaxy"],
    featured: true,
  },
  {
    id: 3,
    name: "MacBook Pro M4",
    category: "Laptops",
    brand: "Apple",
    description:
      "High-performance laptop designed for professional work, development and creative tasks.",
    price: 1999,
    discountPrice: 1849,
    stock: 8,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    ],
    tags: ["MacBook", "Apple", "Laptop"],
    featured: false,
  },
  {
    id: 4,
    name: "Sony WH-1000XM5",
    category: "Headphones",
    brand: "Sony",
    description:
      "Premium wireless headphones with active noise cancellation and high-quality sound.",
    price: 399,
    discountPrice: 349,
    stock: 0,
    images: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800",
    ],
    tags: ["Sony", "Wireless", "Audio"],
    featured: false,
  },
  {
    id: 5,
    name: "Dell XPS 15",
    category: "Laptops",
    brand: "Dell",
    description:
      "Premium Windows laptop with powerful hardware and a high-quality display.",
    price: 1799,
    discountPrice: 1649,
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800",
    ],
    tags: ["Dell", "XPS", "Laptop"],
    featured: true,
  },
  {
    id: 6,
    name: "Logitech MX Master 3S",
    category: "Accessories",
    brand: "Logitech",
    description:
      "Advanced wireless mouse designed for productivity and comfortable everyday use.",
    price: 129,
    discountPrice: 109,
    stock: 35,
    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",
    ],
    tags: ["Logitech", "Mouse", "Wireless"],
    featured: false,
  },
  {
    id: 7,
    name: "ASUS ROG Strix G16",
    category: "Laptops",
    brand: "ASUS",
    description:
      "Gaming laptop with powerful performance, high refresh rate display and premium cooling.",
    price: 1899,
    discountPrice: 1749,
    stock: 10,
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
    ],
    tags: ["ASUS", "ROG", "Gaming"],
    featured: true,
  },
  {
    id: 8,
    name: "Apple Magic Keyboard",
    category: "Accessories",
    brand: "Apple",
    description:
      "Slim wireless keyboard with a comfortable typing experience and premium design.",
    price: 129,
    discountPrice: 99,
    stock: 20,
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
    ],
    tags: ["Apple", "Keyboard", "Wireless"],
    featured: false,
  },
];

const emptyProduct = {
  name: "",
  category: "Laptops",
  brand: "",
  description: "",
  price: "",
  discountPrice: "",
  stock: "",
  image: "",
  tags: "",
  featured: false,
};

function Products() {
  const [products, setProducts] = useState(initialProducts);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQuickEditModalOpen, setIsQuickEditModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [newProduct, setNewProduct] = useState(emptyProduct);

  const [editProduct, setEditProduct] = useState(null);

  const [quickEdit, setQuickEdit] = useState({
    price: "",
    discountPrice: "",
    stock: "",
    featured: false,
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const filteredProducts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        searchValue === "" ||
        product.name.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue) ||
        product.brand.toLowerCase().includes(searchValue);

      let matchesFilter = true;

      if (filter === "featured") {
        matchesFilter = product.featured;
      }

      if (filter === "inStock") {
        matchesFilter = product.stock > 0;
      }

      if (filter === "outOfStock") {
        matchesFilter = product.stock === 0;
      }

      return matchesSearch && matchesFilter;
    });
  }, [products, search, filter]);

  const totalProducts = products.length;

  const featuredProducts = products.filter(
    (product) => product.featured
  ).length;

  const inStockProducts = products.filter(
    (product) => product.stock > 0
  ).length;

  const outOfStockProducts = products.filter(
    (product) => product.stock === 0
  ).length;

  const handleOpenAddModal = () => {
    setNewProduct(emptyProduct);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setNewProduct(emptyProduct);
  };

  const handleNewProductChange = (event) => {
    const { name, value, type, checked } = event.target;

    setNewProduct((currentProduct) => ({
      ...currentProduct,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmitProduct = (event) => {
    event.preventDefault();

    if (
      !newProduct.name.trim() ||
      !newProduct.brand.trim() ||
      newProduct.price === "" ||
      newProduct.stock === ""
    ) {
      window.alert("Please fill in all required fields.");
      return;
    }

    const product = {
      id: Date.now(),
      name: newProduct.name.trim(),
      category: newProduct.category,
      brand: newProduct.brand.trim(),
      description:
        newProduct.description.trim() ||
        "No description available for this product.",
      price: Number(newProduct.price),
      discountPrice:
        newProduct.discountPrice === ""
          ? null
          : Number(newProduct.discountPrice),
      stock: Number(newProduct.stock),
      images: [
        newProduct.image.trim() ||
          "https://via.placeholder.com/600x400?text=Product",
      ],
      tags: newProduct.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      featured: newProduct.featured,
    };

    setProducts((currentProducts) => [
      product,
      ...currentProducts,
    ]);

    handleCloseAddModal();
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedProduct(null);
  };

  const handleEdit = (product) => {
    setEditProduct({
      ...product,
      image: product.images?.[0] || "",
      tags: product.tags?.join(", ") || "",
      price: String(product.price),
      discountPrice:
        product.discountPrice === null ||
        product.discountPrice === undefined
          ? ""
          : String(product.discountPrice),
      stock: String(product.stock),
    });

    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditProduct(null);
  };

  const handleEditChange = (event) => {
    const { name, value, type, checked } = event.target;

    setEditProduct((currentProduct) => ({
      ...currentProduct,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveEdit = (event) => {
    event.preventDefault();

    if (
      !editProduct.name.trim() ||
      !editProduct.brand.trim() ||
      editProduct.price === "" ||
      editProduct.stock === ""
    ) {
      window.alert("Please fill in all required fields.");
      return;
    }

    const updatedProduct = {
      ...editProduct,
      name: editProduct.name.trim(),
      brand: editProduct.brand.trim(),
      description:
        editProduct.description.trim() ||
        "No description available for this product.",
      price: Number(editProduct.price),
      discountPrice:
        editProduct.discountPrice === ""
          ? null
          : Number(editProduct.discountPrice),
      stock: Number(editProduct.stock),
      images: [
        editProduct.image?.trim() ||
          "https://via.placeholder.com/600x400?text=Product",
      ],
      tags: editProduct.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === updatedProduct.id
          ? updatedProduct
          : product
      )
    );

    handleCloseEditModal();
  };

  const handleQuickEdit = (product) => {
    setSelectedProduct(product);

    setQuickEdit({
      price: String(product.price),
      discountPrice:
        product.discountPrice === null ||
        product.discountPrice === undefined
          ? ""
          : String(product.discountPrice),
      stock: String(product.stock),
      featured: product.featured,
    });

    setIsQuickEditModalOpen(true);
  };

  const handleCloseQuickEditModal = () => {
    setIsQuickEditModalOpen(false);
    setSelectedProduct(null);

    setQuickEdit({
      price: "",
      discountPrice: "",
      stock: "",
      featured: false,
    });
  };

  const handleQuickEditChange = (event) => {
    const { name, value, type, checked } = event.target;

    setQuickEdit((currentValues) => ({
      ...currentValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveQuickEdit = (event) => {
    event.preventDefault();

    if (
      !selectedProduct ||
      quickEdit.price === "" ||
      quickEdit.stock === ""
    ) {
      window.alert("Please enter price and stock.");
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.map((product) => {
        if (product.id !== selectedProduct.id) {
          return product;
        }

        return {
          ...product,
          price: Number(quickEdit.price),
          discountPrice:
            quickEdit.discountPrice === ""
              ? null
              : Number(quickEdit.discountPrice),
          stock: Number(quickEdit.stock),
          featured: quickEdit.featured,
        };
      })
    );

    handleCloseQuickEditModal();
  };

  const handleDelete = (productId) => {
    const product = products.find(
      (item) => item.id === productId
    );

    if (!product) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.filter((item) => item.id !== productId)
    );
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        isDarkMode
          ? "bg-slate-950 text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div
          className={`mb-6 rounded-2xl border p-5 shadow-sm transition-colors duration-300 sm:p-6 ${
            isDarkMode
              ? "border-slate-800 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
                Commerce
              </p>

              <h1
                className={`mt-1 text-2xl font-bold sm:text-3xl ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Products
              </h1>

              <p
                className={`mt-2 text-sm ${
                  isDarkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Manage your products and inventory.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setIsDarkMode((currentMode) => !currentMode)
                }
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                  isDarkMode
                    ? "border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>{isDarkMode ? "☀️" : "🌙"}</span>

                {isDarkMode
                  ? "White Mode"
                  : "Dark Mode"}
              </button>

              <button
                type="button"
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                <FaPlus />
                Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={<FaBoxesStacked />}
            isDarkMode={isDarkMode}
          />

          <StatCard
            title="Featured"
            value={featuredProducts}
            icon={<FaStar />}
            isDarkMode={isDarkMode}
          />

          <StatCard
            title="In Stock"
            value={inStockProducts}
            icon={<FaBoxOpen />}
            isDarkMode={isDarkMode}
          />

          <StatCard
            title="Out of Stock"
            value={outOfStockProducts}
            icon={<FaArrowTrendUp />}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Search and Filter */}
        <div
          className={`mb-6 rounded-2xl border p-4 shadow-sm transition-colors duration-300 ${
            isDarkMode
              ? "border-slate-800 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <FaMagnifyingGlass
                className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                  isDarkMode
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search products..."
                className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition-colors ${
                  isDarkMode
                    ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-green-600"
                    : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-green-600"
                }`}
              />
            </div>

            <div className="relative">
              <FaSliders
                className={`pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-xs ${
                  isDarkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              />

              <select
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value)
                }
                className={`w-full appearance-none rounded-xl border py-3 pl-10 pr-10 text-sm outline-none transition-colors lg:w-56 ${
                  isDarkMode
                    ? "border-slate-700 bg-slate-800 text-white focus:border-green-600"
                    : "border-slate-200 bg-white text-slate-900 focus:border-green-600"
                }`}
              >
                <option value="all">All Products</option>
                <option value="featured">Featured</option>
                <option value="inStock">In Stock</option>
                <option value="outOfStock">
                  Out of Stock
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Products */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView={handleView}
                onEdit={handleEdit}
                onQuickEdit={handleQuickEdit}
                onDelete={handleDelete}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        ) : (
          <div
            className={`rounded-2xl border p-12 text-center transition-colors duration-300 ${
              isDarkMode
                ? "border-slate-800 bg-slate-900"
                : "border-slate-200 bg-white"
            }`}
          >
            <FaBoxOpen
              className={`mx-auto text-5xl ${
                isDarkMode
                  ? "text-slate-600"
                  : "text-slate-300"
              }`}
            />

            <h2
              className={`mt-4 text-xl font-bold ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              No products found
            </h2>

            <p
              className={`mt-2 text-sm ${
                isDarkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              Try changing your search or filter.
            </p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <ModalOverlay>
          <form
            onSubmit={handleSubmitProduct}
            className={`w-full max-w-3xl overflow-hidden rounded-2xl border shadow-2xl ${
              isDarkMode
                ? "border-slate-700 bg-slate-900"
                : "border-slate-200 bg-white"
            }`}
          >
            <ModalHeader
              title="Add Product"
              onClose={handleCloseAddModal}
              isDarkMode={isDarkMode}
            />

            <div className="grid max-h-[70vh] gap-5 overflow-y-auto p-6 md:grid-cols-2">
              <InputField
                label="Product Name *"
                name="name"
                value={newProduct.name}
                onChange={handleNewProductChange}
                placeholder="Enter product name"
                isDarkMode={isDarkMode}
              />

              <InputField
                label="Brand *"
                name="brand"
                value={newProduct.brand}
                onChange={handleNewProductChange}
                placeholder="Enter brand"
                isDarkMode={isDarkMode}
              />

              <SelectField
                label="Category"
                name="category"
                value={newProduct.category}
                onChange={handleNewProductChange}
                isDarkMode={isDarkMode}
                options={[
                  "Laptops",
                  "Phones",
                  "Headphones",
                  "Accessories",
                  "Monitors",
                  "Keyboards",
                ]}
              />

              <InputField
                label="Price *"
                name="price"
                type="number"
                min="0"
                value={newProduct.price}
                onChange={handleNewProductChange}
                placeholder="0"
                isDarkMode={isDarkMode}
              />

              <InputField
                label="Discount Price"
                name="discountPrice"
                type="number"
                min="0"
                value={newProduct.discountPrice}
                onChange={handleNewProductChange}
                placeholder="Optional"
                isDarkMode={isDarkMode}
              />

              <InputField
                label="Stock *"
                name="stock"
                type="number"
                min="0"
                value={newProduct.stock}
                onChange={handleNewProductChange}
                placeholder="0"
                isDarkMode={isDarkMode}
              />

              <InputField
                label="Image URL"
                name="image"
                value={newProduct.image}
                onChange={handleNewProductChange}
                placeholder="https://..."
                isDarkMode={isDarkMode}
              />

              <InputField
                label="Tags"
                name="tags"
                value={newProduct.tags}
                onChange={handleNewProductChange}
                placeholder="Laptop, Gaming, ASUS"
                isDarkMode={isDarkMode}
              />

              <div className="md:col-span-2">
                <TextAreaField
                  label="Description"
                  name="description"
                  value={newProduct.description}
                  onChange={handleNewProductChange}
                  placeholder="Enter product description"
                  isDarkMode={isDarkMode}
                />
              </div>

              <div className="md:col-span-2">
                <CheckboxField
                  label="Featured Product"
                  name="featured"
                  checked={newProduct.featured}
                  onChange={handleNewProductChange}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>

            <ModalFooter
              onCancel={handleCloseAddModal}
              submitText="Add Product"
              isDarkMode={isDarkMode}
            />
          </form>
        </ModalOverlay>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedProduct && (
        <ModalOverlay>
          <div
            className={`w-full max-w-3xl overflow-hidden rounded-2xl border shadow-2xl ${
              isDarkMode
                ? "border-slate-700 bg-slate-900"
                : "border-slate-200 bg-white"
            }`}
          >
            <ModalHeader
              title="Product Details"
              onClose={handleCloseViewModal}
              isDarkMode={isDarkMode}
            />

            <div className="grid gap-6 p-6 md:grid-cols-2">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={
                    selectedProduct.images?.[0] ||
                    "https://via.placeholder.com/600x400?text=Product"
                  }
                  alt={selectedProduct.name}
                  className="h-72 w-full object-cover"
                />
              </div>

              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {selectedProduct.category}
                  </span>

                  {selectedProduct.featured && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      Featured
                    </span>
                  )}
                </div>

                <h2
                  className={`text-2xl font-bold ${
                    isDarkMode
                      ? "text-white"
                      : "text-slate-900"
                  }`}
                >
                  {selectedProduct.name}
                </h2>

                <p
                  className={`mt-2 text-sm font-medium ${
                    isDarkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Brand: {selectedProduct.brand}
                </p>

                <p
                  className={`mt-5 text-sm leading-6 ${
                    isDarkMode
                      ? "text-slate-300"
                      : "text-slate-600"
                  }`}
                >
                  {selectedProduct.description}
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${selectedProduct.discountPrice ?? selectedProduct.price}
                  </span>

                  {selectedProduct.discountPrice !== null &&
                    selectedProduct.discountPrice !==
                      undefined &&
                    selectedProduct.discountPrice <
                      selectedProduct.price && (
                      <span className="text-sm text-slate-400 line-through">
                        ${selectedProduct.price}
                      </span>
                    )}
                </div>

                <p
                  className={`mt-4 text-sm ${
                    selectedProduct.stock > 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-500"
                  }`}
                >
                  {selectedProduct.stock > 0
                    ? `${selectedProduct.stock} items in stock`
                    : "Out of stock"}
                </p>

                {selectedProduct.tags?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {selectedProduct.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-lg px-3 py-1 text-xs ${
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
              </div>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editProduct && (
        <ModalOverlay>
          <form
            onSubmit={handleSaveEdit}
            className={`w-full max-w-3xl overflow-hidden rounded-2xl border shadow-2xl ${
              isDarkMode
                ? "border-slate-700 bg-slate-900"
                : "border-slate-200 bg-white"
            }`}
          >
            <ModalHeader
              title="Edit Product"
              onClose={handleCloseEditModal}
              isDarkMode={isDarkMode}
            />

            <div className="grid max-h-[70vh] gap-5 overflow-y-auto p-6 md:grid-cols-2">
              <InputField
                label="Product Name *"
                name="name"
                value={editProduct.name}
                onChange={handleEditChange}
                placeholder="Enter product name"
                isDarkMode={isDarkMode}
              />

              <InputField
                label="Brand *"
                name="brand"
                value={editProduct.brand}
                onChange={handleEditChange}
                placeholder="Enter brand"
                isDarkMode={isDarkMode}
              />

              <SelectField
                label="Category"
                name="category"
                value={editProduct.category}
                onChange={handleEditChange}
                isDarkMode={isDarkMode}
                options={[
                  "Laptops",
                  "Phones",
                  "Headphones",
                  "Accessories",
                  "Monitors",
                  "Keyboards",
                ]}
              />

              <InputField
                label="Price *"
                name="price"
                type="number"
                min="0"
                value={editProduct.price}
                onChange={handleEditChange}
                placeholder="0"
                isDarkMode={isDarkMode}
              />

              <InputField
                label="Discount Price"
                name="discountPrice"
                type="number"
                min="0"
                value={editProduct.discountPrice}
                onChange={handleEditChange}
                placeholder="Optional"
                isDarkMode={isDarkMode}
              />

              <InputField
                label="Stock *"
                name="stock"
                type="number"
                min="0"
                value={editProduct.stock}
                onChange={handleEditChange}
                placeholder="0"
                isDarkMode={isDarkMode}
              />

              <InputField
                label="Image URL"
                name="image"
                value={editProduct.image}
                onChange={handleEditChange}
                placeholder="https://..."
                isDarkMode={isDarkMode}
              />

              <InputField
                label="Tags"
                name="tags"
                value={editProduct.tags}
                onChange={handleEditChange}
                placeholder="Laptop, Gaming, ASUS"
                isDarkMode={isDarkMode}
              />

              <div className="md:col-span-2">
                <TextAreaField
                  label="Description"
                  name="description"
                  value={editProduct.description}
                  onChange={handleEditChange}
                  placeholder="Enter product description"
                  isDarkMode={isDarkMode}
                />
              </div>

              <div className="md:col-span-2">
                <CheckboxField
                  label="Featured Product"
                  name="featured"
                  checked={editProduct.featured}
                  onChange={handleEditChange}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>

            <ModalFooter
              onCancel={handleCloseEditModal}
              submitText="Save Changes"
              isDarkMode={isDarkMode}
            />
          </form>
        </ModalOverlay>
      )}

      {/* Quick Edit Modal */}
      {isQuickEditModalOpen && selectedProduct && (
        <ModalOverlay>
          <form
            onSubmit={handleSaveQuickEdit}
            className={`w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl ${
              isDarkMode
                ? "border-slate-700 bg-slate-900"
                : "border-slate-200 bg-white"
            }`}
          >
            <ModalHeader
              title="Quick Edit"
              onClose={handleCloseQuickEditModal}
              isDarkMode={isDarkMode}
            />

            <div className="space-y-5 p-6">
              <div>
                <p
                  className={`mb-1 text-sm ${
                    isDarkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Product
                </p>

                <p
                  className={`font-bold ${
                    isDarkMode
                      ? "text-white"
                      : "text-slate-900"
                  }`}
                >
                  {selectedProduct.name}
                </p>
              </div>

              <InputField
                label="Price *"
                name="price"
                type="number"
                min="0"
                value={quickEdit.price}
                onChange={handleQuickEditChange}
                placeholder="0"
                isDarkMode={isDarkMode}
              />

              <InputField
                label="Discount Price"
                name="discountPrice"
                type="number"
                min="0"
                value={quickEdit.discountPrice}
                onChange={handleQuickEditChange}
                placeholder="Optional"
                isDarkMode={isDarkMode}
              />

              <InputField
                label="Stock *"
                name="stock"
                type="number"
                min="0"
                value={quickEdit.stock}
                onChange={handleQuickEditChange}
                placeholder="0"
                isDarkMode={isDarkMode}
              />

              <CheckboxField
                label="Featured Product"
                name="featured"
                checked={quickEdit.featured}
                onChange={handleQuickEditChange}
                isDarkMode={isDarkMode}
              />
            </div>

            <ModalFooter
              onCancel={handleCloseQuickEditModal}
              submitText="Save Changes"
              isDarkMode={isDarkMode}
            />
          </form>
        </ModalOverlay>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  isDarkMode,
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition-colors duration-300 ${
        isDarkMode
          ? "border-slate-800 bg-slate-900"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={`text-sm ${
              isDarkMode
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            {title}
          </p>

          <p
            className={`mt-2 text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          {icon}
        </div>
      </div>
    </div>
  );
}

function ModalOverlay({ children }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      {children}
    </div>
  );
}

function ModalHeader({
  title,
  onClose,
  isDarkMode,
}) {
  return (
    <div
      className={`flex items-center justify-between border-b px-6 py-5 ${
        isDarkMode
          ? "border-slate-700"
          : "border-slate-200"
      }`}
    >
      <h2
        className={`text-xl font-bold ${
          isDarkMode ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close modal"
        className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
          isDarkMode
            ? "text-slate-400 hover:bg-slate-800 hover:text-white"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        <FaXmark />
      </button>
    </div>
  );
}

function ModalFooter({
  onCancel,
  submitText,
  isDarkMode,
}) {
  return (
    <div
      className={`flex justify-end gap-3 border-t px-6 py-4 ${
        isDarkMode
          ? "border-slate-700"
          : "border-slate-200"
      }`}
    >
      <button
        type="button"
        onClick={onCancel}
        className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition ${
          isDarkMode
            ? "border-slate-700 text-slate-300 hover:bg-slate-800"
            : "border-slate-200 text-slate-700 hover:bg-slate-100"
        }`}
      >
        Cancel
      </button>

      <button
        type="submit"
        className="rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
      >
        {submitText}
      </button>
    </div>
  );
}

function InputField({
  label,
  name,
  type = "text",
  min,
  value,
  onChange,
  placeholder,
  isDarkMode,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className={`mb-2 block text-sm font-semibold ${
          isDarkMode ? "text-slate-300" : "text-slate-700"
        }`}
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        min={min}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${
          isDarkMode
            ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-green-600"
            : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-green-600"
        }`}
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  isDarkMode,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className={`mb-2 block text-sm font-semibold ${
          isDarkMode ? "text-slate-300" : "text-slate-700"
        }`}
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${
          isDarkMode
            ? "border-slate-700 bg-slate-800 text-white focus:border-green-600"
            : "border-slate-200 bg-white text-slate-900 focus:border-green-600"
        }`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  isDarkMode,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className={`mb-2 block text-sm font-semibold ${
          isDarkMode ? "text-slate-300" : "text-slate-700"
        }`}
      >
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        rows="4"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${
          isDarkMode
            ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-green-600"
            : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-green-600"
        }`}
      />
    </div>
  );
}

function CheckboxField({
  label,
  name,
  checked,
  onChange,
  isDarkMode,
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
        isDarkMode
          ? "border-slate-700 bg-slate-800"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-green-700"
      />

      <span
        className={`text-sm font-semibold ${
          isDarkMode ? "text-slate-200" : "text-slate-700"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

export default Products;