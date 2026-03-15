const packageSelect = document.getElementById("package");
const boatLengthInput = document.getElementById("boatLength");
const paymentTypeSelect = document.getElementById("paymentType");
const calculatedPrice = document.getElementById("calculatedPrice");
const paymentSummary = document.getElementById("paymentSummary");
const bookingForm = document.getElementById("bookingForm");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

let currentOrderAmount = 0;

function calculatePrice() {
  const rate = Number(packageSelect.value) || 0;
  const length = Number(boatLengthInput.value) || 0;
  const total = rate * length;
  const paymentType = paymentTypeSelect.value;
  const payable = paymentType === "deposit" ? total * 0.5 : total;

  currentOrderAmount = payable;
  calculatedPrice.textContent = `$${total.toFixed(2)}`;
  paymentSummary.textContent =
    paymentType === "deposit"
      ? `Deposit (50%): $${payable.toFixed(2)}`
      : `Full payment: $${payable.toFixed(2)}`;
}

[packageSelect, boatLengthInput, paymentTypeSelect].forEach((field) => {
  field.addEventListener("input", calculatePrice);
  field.addEventListener("change", calculatePrice);
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  calculatePrice();
  alert(
    "Booking details captured. Please complete PayPal payment below to finalize your reservation."
  );
});

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  navLinks.classList.toggle("open");
});

calculatePrice();

if (window.paypal) {
  paypal
    .Buttons({
      createOrder(data, actions) {
        const amount = currentOrderAmount > 0 ? currentOrderAmount : 50;
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: amount.toFixed(2),
              },
              description: "LBCS Boat Cleaning Booking",
            },
          ],
        });
      },
      onApprove(data, actions) {
        return actions.order.capture().then(() => {
          alert("Payment successful! Thank you for booking with LBCS.");
        });
      },
    })
    .render("#paypal-button-container");
}
