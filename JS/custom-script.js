// Run everything after the DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  
  // Alert 
  const alertPlaceholder = document.getElementById(
    "liveAlertPlaceholder"
  );

  // Function to insert the alert into the reservations page 
  const appendAlert = (message, alertTarget) => {
    if (!alertTarget) return;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <div class="alert alert-success alert-dismissible" role="alert">
        <div>${message}</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
    alertTarget.append(wrapper);
  };

  // Form Submission Handler - Feedback & Reservations 
  function handleFormSubmit(
    form,
    modalId = null,
    showAlertMessage = null,
    progressFunc = null,
    alertTarget = null
  ) {
    form.addEventListener(
      "submit",
      function (event) {
        event.preventDefault(); // prevent default submission

        if (!form.checkValidity()) {
          // Invalid form: show validation styles
          form.classList.add("was-validated");
          return;
        }

        // Valid form: show modal if provided
        if (modalId) {
          const modalEl = document.getElementById(modalId);
          if (modalEl && typeof bootstrap !== "undefined") {
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
          }
        }

        // Show alert if message provided
        if (showAlertMessage) {
          appendAlert(showAlertMessage, alertTarget || alertPlaceholder);
        }

        // Reset form and validation state
        form.reset();
        form.classList.remove("was-validated");

        // Reset progress bar if function provided
        if (progressFunc && typeof progressFunc === "function") {
          progressFunc();
        }
      },
      false
    );
  }

  // Progress bar for Feedback form
  const feedbackForm = document.getElementById("feedbackForm");
  const progressBar = document.getElementById("formProgress");
  const progressPercentage = document.getElementById("progressPercentage");

  let updateProgressBar = null;

  if (feedbackForm && progressBar && progressPercentage) {
    const requiredFields = feedbackForm.querySelectorAll("[required]");
    const totalFields = requiredFields.length;

    function isFieldFilled(field) {
      return field.value.trim() !== "";
    }

    updateProgressBar = function () {
      let filledCount = 0;
      requiredFields.forEach((field) => {
        if (isFieldFilled(field)) filledCount++;
      });
      const percentage = Math.ceil((filledCount / totalFields) * 100) || 0;
      progressBar.style.width = percentage + "%";
      progressBar.setAttribute("aria-valuenow", percentage);
      progressPercentage.textContent = percentage + "%";
    };

    requiredFields.forEach((field) => {
      field.addEventListener("input", updateProgressBar);
    });

    // Initialize progress bar
    updateProgressBar();
  }

  if (feedbackForm) {
    handleFormSubmit(
      feedbackForm,
      "feedbackModal",
      null,
      updateProgressBar,
      alertPlaceholder
    );
  }

  // Reservation Form
  const reservationForm = document.getElementById("reservationForm");
  const reservationAlertPlaceholder = document.getElementById(
    "reservationAlertPlaceholder"
  );
  if (reservationForm) {
    handleFormSubmit(
      reservationForm,
      null,
      "Reservation Confirmed. Thank you!",
      null,
      reservationAlertPlaceholder
    );
  }

  // Pagination for Menu Tabs
  const tabPanes = document.querySelectorAll(".tab-pane"); // all tab sections

  tabPanes.forEach((pane) => {
    const pageContents = pane.querySelectorAll(".page-content");
    const prevBtn = pane.querySelector(".prev-btn");
    const nextBtn = pane.querySelector(".next-btn");
    const pageBtns = pane.querySelectorAll(".page-btn");
    if (pageContents.length === 0) return; // skip tabs without pagination

    let currentPage = 1;
    const totalPages = pageContents.length;

    function showPage(n) {
      n = Math.max(1, Math.min(n, totalPages));

      // hide all pages in this tab
      pageContents.forEach((p) => p.classList.add("d-none"));

      // show selected page
      const selected = pane.querySelector(`#${pageContents[n - 1].id}`);
      if (selected) selected.classList.remove("d-none");

      // update active state
      pageBtns.forEach((btn) => {
        const p = Number(btn.dataset.page);
        btn.parentElement.classList.toggle("active", p === n);
      });

      // disable prev/next appropriately
      if (prevBtn?.parentElement) {
        prevBtn.parentElement.classList.toggle("disabled", n === 1);
      }
      if (nextBtn?.parentElement) {
        nextBtn.parentElement.classList.toggle("disabled", n === totalPages);
      }

      currentPage = n;
    }

    // page number clicks
    pageBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        showPage(Number(btn.dataset.page));
      });
    });

    // prev/next
    prevBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      showPage(currentPage - 1);
    });
    nextBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      showPage(currentPage + 1);
    });

    // init this tab
    showPage(1);
  });


  // Best seller Toast notification
  const toastEl = document.getElementById("liveToast");
  if (toastEl) {
    const toast = new bootstrap.Toast(toastEl, {
      delay: 3000, // Auto-hide after 3 seconds
    });
    toast.show();
  }

  // Accordion Spinner 
  const accordion = document.getElementById("accordionFlushExample");

  if (accordion) {
    accordion.querySelectorAll(".accordion-collapse").forEach((collapseEl) => {
      collapseEl.addEventListener("show.bs.collapse", function () {
        const body = collapseEl.querySelector(".accordion-body");
        if (!body) return;

        const spinner = body.querySelector(".spinner-wrapper");
        const content = body.querySelector(".accordion-content");

        if (spinner && content) {
          // Show spinner, hide content
          spinner.classList.remove("d-none");
          content.classList.add("d-none");

          // After delay, hide spinner & show content
          setTimeout(() => {
            spinner.classList.add("d-none");
            content.classList.remove("d-none");
          }, 500); // adjust duration as needed
        }
      });
    });
  }
});
