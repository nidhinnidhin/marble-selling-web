let currentView = "categories";
let currentItemId = null;
let currentItemType = null;

function switchView(view) {
  currentView = view;
  document.getElementById("categoriesContent").classList.add("hidden");
  document.getElementById("productsContent").classList.add("hidden");
  document.getElementById(`${view}Content`).classList.remove("hidden");

  document.querySelectorAll("nav a").forEach((link) => {
    link.classList.remove("bg-gray-800");
    if (link.getAttribute("data-view") === view) {
      link.classList.add("bg-gray-800");
    }
  });
}

function openAddCategoryModal() {
  document.getElementById("addCategoryModal").classList.remove("hidden");
  document.getElementById("addCategoryModal").classList.add("flex");
}

function closeAddCategoryModal() {
  document.getElementById("addCategoryModal").classList.add("hidden");
  document.getElementById("addCategoryModal").classList.remove("flex");
}

function openAddProductModal() {
  document.getElementById("addProductModal").classList.remove("hidden");
  document.getElementById("addProductModal").classList.add("flex");
}

function closeAddProductModal() {
  document.getElementById("addProductModal").classList.add("hidden");
  document.getElementById("addProductModal").classList.remove("flex");
}

function openEditProductModal(id) {
  document.getElementById("editProductModal").classList.remove("hidden");
  document.getElementById("editProductModal").classList.add("flex");
}

function closeEditProductModal() {
  document.getElementById("editProductModal").classList.add("hidden");
  document.getElementById("editProductModal").classList.remove("flex");
}

function showLoading() {
  document.getElementById("loadingOverlay").classList.remove("hidden");
  document.getElementById("loadingOverlay").classList.add("flex");
}

function hideLoading() {
  document.getElementById("loadingOverlay").classList.add("hidden");
  document.getElementById("loadingOverlay").classList.remove("flex");
}

function showNotification(message, type = "success") {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: type === "success" ? "#4CAF50" : "#F44336",
  }).showToast();
}

function openDeleteModal(id, type) {
  currentItemId = id;
  currentItemType = type;
  document.getElementById("deleteConfirmModal").classList.remove("hidden");
  document.getElementById("deleteConfirmModal").classList.add("flex");
}

function closeDeleteModal() {
  document.getElementById("deleteConfirmModal").classList.add("hidden");
  document.getElementById("deleteConfirmModal").classList.remove("flex");
  currentItemId = null;
  currentItemType = null;
}

async function confirmDelete() {
  try {
    document.getElementById("deleteButtonText").textContent = "Deleting...";
    document.getElementById("deleteSpinner").classList.remove("hidden");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (currentItemType === "category") {
      showNotification("Category deleted successfully");
    } else {
      showNotification("Product deleted successfully");
    }

    closeDeleteModal();
  } catch (error) {
    showNotification("Error deleting item", "error");
  } finally {
    document.getElementById("deleteButtonText").textContent = "Delete";
    document.getElementById("deleteSpinner").classList.add("hidden");
  }
}

async function openEditCategoryModal(id) {
  try {
    showLoading();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const category = {
      id: 1,
      name: "Marble",
      description: "Premium quality marble stones",
    };
    document.getElementById("editCategoryName").value = category.name;
    document.getElementById("editCategoryDescription").value =
      category.description;
    document.getElementById("editCategoryModal").classList.remove("hidden");
    document.getElementById("editCategoryModal").classList.add("flex");
  } catch (error) {
    showNotification("Error fetching category details", "error");
  } finally {
    hideLoading();
  }
}

async function openEditProductModal(id) {
  try {
    showLoading();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const product = {
      id: 1,
      name: "Premium Marble",
      category: "Marble",
      description: "High-quality marble",
      price: 599.99,
      stock: 50,
    };
    document.getElementById("editProductName").value = product.name;
    document.getElementById("editProductCategory").value = product.category;
    document.getElementById("editProductDescription").value =
      product.description;
    document.getElementById("editProductPrice").value = product.price;
    document.getElementById("editProductStock").value = product.stock;
    document.getElementById("editProductModal").classList.remove("hidden");
    document.getElementById("editProductModal").classList.add("flex");
  } catch (error) {
    showNotification("Error fetching product details", "error");
  } finally {
    hideLoading();
  }
}

async function handleCategorySubmit(event, isEdit = false) {
  event.preventDefault();
  try {
    showLoading();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    showNotification(`Category ${isEdit ? "updated" : "added"} successfully`);
    closeAddCategoryModal();
  } catch (error) {
    showNotification("Error submitting category", "error");
  } finally {
    hideLoading();
  }
}

async function handleProductSubmit(event, isEdit = false) {
  event.preventDefault();
  try {
    showLoading();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    showNotification(`Product ${isEdit ? "updated" : "added"} successfully`);
    closeAddProductModal();
  } catch (error) {
    showNotification("Error submitting product", "error");
  } finally {
    hideLoading();
  }
}
