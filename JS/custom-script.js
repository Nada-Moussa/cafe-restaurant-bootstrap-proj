// Run everything after the DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  // ---------------------------
  // Reservation Submittion Alert
  // ---------------------------

  const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
  const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
  }

  // const alertTrigger = document.getElementById('liveAlertBtn')
  // if (alertTrigger) {
  //   alertTrigger.addEventListener('click', () => {
  //     appendAlert('Reservation Confirmed. Thank you!', 'success')
  //   })
  // }
  // ---------------------------
  // Feedback Form & Modal (only if present on this page)
  // ---------------------------
  const form = document.querySelector('.needs-validation');
  if (form) {
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        // If not valid, prevent default submission and stop propagation
        event.preventDefault();
        event.stopPropagation();
      } else {
        // If form is valid, prevent default submission and show modal
        event.preventDefault();
        // Reservation page alert (only if alertPlaceholder exists)
        if (alertPlaceholder) {
          appendAlert('Reservation Confirmed. Thank you!', 'success');
        }
        // Get the modal element by its ID
        const feedbackModal = document.getElementById('feedbackModal');
        if (feedbackModal && typeof bootstrap !== 'undefined') {
          const modal = new bootstrap.Modal(feedbackModal);
          modal.show();
        }
        // Reset form after successful submission
        form.classList.remove('was-validated');
        form.reset();
        // Add the validation class to trigger the visual feedback
        form.classList.add('was-validated')

        // Reset progress bar if present
        if (typeof updateProgressBar === 'function') {
        updateProgressBar();
        }
        
      }

      form.classList.add('was-validated');
    }, false);
  }

  // ---------------------------
  // Progress Bar (only if feedback form exists)
  // ---------------------------
  const feedbackForm = document.getElementById('feedbackForm');
  const progressBar = document.getElementById('formProgress');
  const progressPercentage = document.getElementById('progressPercentage');

  if (feedbackForm && progressBar && progressPercentage) {
    const requiredFields = feedbackForm.querySelectorAll('[required]');
    const totalFields = requiredFields.length;

    function isFieldFilled(field) {
      return field.value.trim() !== '';
    }

    function updateProgressBar() {
      let filledCount = 0;
      requiredFields.forEach(field => {
        if (isFieldFilled(field)) filledCount++;
      });
      const percentage = Math.ceil((filledCount / totalFields) * 100) || 0;
      progressBar.style.width = percentage + '%';
      progressBar.setAttribute('aria-valuenow', percentage);
      progressPercentage.textContent = percentage + '%';
    }

    requiredFields.forEach(field => {
      field.addEventListener('input', updateProgressBar);
    });

    updateProgressBar();
  }

// ---------------------------
// Pagination 
// ---------------------------
const tabPanes = document.querySelectorAll('.tab-pane'); // all tab sections

tabPanes.forEach(pane => {
  const pageContents = pane.querySelectorAll('.page-content');
  const pageBtns = pane.querySelectorAll('.page-btn');
  const prevBtn = pane.querySelector('.prev-btn');
  const nextBtn = pane.querySelector('.next-btn');

  if (pageContents.length === 0) return; // skip tabs without pagination

  let currentPage = 1;
  const totalPages = pageContents.length;

  function showPage(n) {
    n = Math.max(1, Math.min(n, totalPages));

    // hide all pages in this tab
    pageContents.forEach(p => p.classList.add('d-none'));

    // show selected page
    const selected = pane.querySelector(`#${pageContents[n - 1].id}`);
    if (selected) selected.classList.remove('d-none');

    // update active state
    pageBtns.forEach(btn => {
      const p = Number(btn.dataset.page);
      btn.parentElement.classList.toggle('active', p === n);
    });

    // disable prev/next appropriately
    if (prevBtn?.parentElement) {
      prevBtn.parentElement.classList.toggle('disabled', n === 1);
    }
    if (nextBtn?.parentElement) {
      nextBtn.parentElement.classList.toggle('disabled', n === totalPages);
    }

    currentPage = n;
  }

  // page number clicks
  pageBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      showPage(Number(btn.dataset.page));
    });
  });

  // prev/next
  prevBtn?.addEventListener('click', e => {
    e.preventDefault();
    showPage(currentPage - 1);
  });
  nextBtn?.addEventListener('click', e => {
    e.preventDefault();
    showPage(currentPage + 1);
  });

  // init this tab
  showPage(1);
});

  // ---------------------------
  // Best seller toast 
  // ---------------------------
  // Run everything after the DOM is ready
  const toastEl = document.getElementById("liveToast");
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl, {
        delay: 3000 // Auto-hide after 3 seconds
      });
      toast.show();
    }

  // ---------------------------
  // Accordion Spinner Handling
  // ---------------------------
  const accordion = document.getElementById('accordionFlushExample');

  if (accordion) {
    accordion.querySelectorAll('.accordion-collapse').forEach(collapseEl => {
      collapseEl.addEventListener('show.bs.collapse', function () {
        const body = collapseEl.querySelector('.accordion-body');
        if (!body) return;

        const spinner = body.querySelector('.spinner-wrapper');
        const content = body.querySelector('.accordion-content');

        if (spinner && content) {
          // Show spinner, hide content
          spinner.classList.remove('d-none');
          content.classList.add('d-none');

          // After delay, hide spinner & show content
          setTimeout(() => {
            spinner.classList.add('d-none');
            content.classList.remove('d-none');
          }, 500); // adjust duration as needed
        }
      });
    });
  }


});
