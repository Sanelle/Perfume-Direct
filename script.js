// Wait for DOM content to load
document.addEventListener("DOMContentLoaded", () => {
  // VARIABLES AND SELECTORS
  const hamburger = document.querySelector(".hamburger");
  const navActions = document.querySelector(".nav-actions");
  const formSteps = document.querySelectorAll(".form-step");
  const nextBtns = document.querySelectorAll(".btn-next");
  const prevBtns = document.querySelectorAll(".btn-prev");
  const progressSteps = document.querySelectorAll(".progress-step");
  const progressBar = document.querySelector(".progress-bar");
  const bookingForm = document.getElementById("bookingForm");
  const perfumeCards = document.querySelectorAll(".perfume-card");
  const qtyButtons = document.querySelectorAll(".qty-btn");
  const addonCheckboxes = document.querySelectorAll(".accessory-option input[type='checkbox']");
  const summaryItemsContainer = document.querySelector(".summary-items");
  const subtotalEl = document.getElementById("subtotal");
  const deliveryFeeEl = document.getElementById("delivery-fee");
  const grandTotalEl = document.getElementById("grand-total");
  const confirmationModal = document.getElementById("confirmationModal");
  const orderDetailsEl = document.getElementById("orderDetails");
  const closeModalBtn = document.querySelector(".btn-close-modal");

  // Fixed delivery fee from HTML (R99)
  const deliveryFee = 99;

  let currentStep = 1;

  // HAMBURGER MENU TOGGLE
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navActions.classList.toggle("active");
  });

  // NEXT STEP BUTTON HANDLER
  nextBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentStep < formSteps.length) {
        // Optionally, add form validation for the current step before proceeding

        // Hide current step and update active classes
        formSteps[currentStep - 1].classList.remove("active");
        currentStep++;
        formSteps[currentStep - 1].classList.add("active");
        updateProgressBar();

        // When moving to step 3 (payment/summary), build the order summary.
        if (currentStep === 3) {
          buildOrderSummary();
        }
      }
    });
  });

  // PREVIOUS STEP BUTTON HANDLER
  prevBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentStep > 1) {
        // Hide current step and move to previous step
        formSteps[currentStep - 1].classList.remove("active");
        currentStep--;
        formSteps[currentStep - 1].classList.add("active");
        updateProgressBar();
      }
    });
  });

  // UPDATE PROGRESS BAR STATUS
  function updateProgressBar() {
    // Update progress step visual indications
    progressSteps.forEach((step, idx) => {
      if (idx < currentStep) {
        step.classList.add("active");
      } else {
        step.classList.remove("active");
      }
    });
    // Update the progress bar width (percentage)
    const progressPercentage = ((currentStep - 1) / (progressSteps.length - 1)) * 100;
    progressBar.style.width = `${progressPercentage}%`;
  }

  // QUANTITY BUTTON HANDLER FOR PERFUME CARDS
  qtyButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Identify whether we are increasing or decreasing
      const button = e.currentTarget;
      const selector = button.parentElement;
      const input = selector.querySelector("input[type='number']");
      let value = parseInt(input.value);

      if (button.classList.contains("plus")) {
        // Increment value up to the max
        if (value < parseInt(input.max)) {
          value++;
        }
      } else if (button.classList.contains("minus")) {
        // Decrement value down to 0 minimum
        if (value > parseInt(input.min)) {
          value--;
        }
      }
      input.value = value;
    });
  });

  // ORDER SUMMARY CALCULATION
  function buildOrderSummary() {
    summaryItemsContainer.innerHTML = ""; // clear previous items
    let subtotal = 0;

    // 1. Process perfume selections
    perfumeCards.forEach((card) => {
      const input = card.querySelector("input[type='number']");
      let quantity = parseInt(input.value);
      if (quantity > 0) {
        let price = parseFloat(card.getAttribute("data-price")); // price as number
        let totalPrice = price * quantity;
        subtotal += totalPrice;

        // Get perfume title
        let title = card.querySelector("h3").textContent;

        // Append item to summary list
        const itemRow = document.createElement("div");
        itemRow.className = "summary-item";
        itemRow.innerHTML = `<span>${title} x ${quantity}</span><span>R${totalPrice}</span>`;
        summaryItemsContainer.appendChild(itemRow);
      }
    });

    // 2. Process add-on selections
    addonCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        let addonPrice = parseFloat(checkbox.getAttribute("data-price"));
        subtotal += addonPrice;
        let labelEl = checkbox.parentElement.querySelector("label").textContent;
        // Append accessory to summary list
        const addonRow = document.createElement("div");
        addonRow.className = "summary-item";
        addonRow.innerHTML = `<span>${labelEl.trim()}</span><span>R${addonPrice}</span>`;
        summaryItemsContainer.appendChild(addonRow);
      }
    });

    // 3. Add delivery fee (always included)
    subtotalEl.textContent = `R${subtotal}`;
    deliveryFeeEl.textContent = `R${deliveryFee}`;

    let grandTotal = subtotal + deliveryFee;
    grandTotalEl.textContent = `R${grandTotal}`;

    // Also, update order details in confirmation modal
    orderDetailsEl.innerHTML = "";
    const orderSummary = summaryItemsContainer.innerHTML;
    // Build a summary HTML with all details
    orderDetailsEl.innerHTML = `
      <div class="modal-summary">
        ${orderSummary}
        <div class="summary-total">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>R${subtotal}</span>
          </div>
          <div class="total-row">
            <span>Delivery:</span>
            <span>R${deliveryFee}</span>
          </div>
          <div class="total-row grand-total">
            <span>Total:</span>
            <span>R${grandTotal}</span>
          </div>
        </div>
      </div>
    `;
  }

  // HANDLE FORM SUBMISSION
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Optionally, you can process or validate all the form data here

    // Show confirmation modal
    confirmationModal.classList.add("active");

    // Optionally, clear the form or reset the progress for a new order
  });

  // CLOSE MODAL HANDLER
  closeModalBtn.addEventListener("click", () => {
    confirmationModal.classList.remove("active");
    // Reset form steps (if desired)
    // For example, set back to first step:
    formSteps[currentStep - 1].classList.remove("active");
    currentStep = 1;
    formSteps[currentStep - 1].classList.add("active");
    updateProgressBar();
  });
});
