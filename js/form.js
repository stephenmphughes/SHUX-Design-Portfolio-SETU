document.addEventListener("DOMContentLoaded", () => {
    const steps = document.querySelectorAll(".form-step");
    const nextBtns = document.querySelectorAll(".next-btn");
    const prevBtns = document.querySelectorAll(".prev-btn");
    const form = document.getElementById("multiStepForm");
  
    let currentStep = 0;
  
    // Show the current step
    function updateFormSteps() {
      steps.forEach((step, index) => {
        step.classList.toggle("active", index === currentStep);
      });
    }
  
    // Go to the next step
    nextBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (currentStep < steps.length - 1) {
          currentStep++;
          updateFormSteps();
        }
      });
    });
  
    // Go to the previous step
    prevBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (currentStep > 0) {
          currentStep--;
          updateFormSteps();
        }
      });
    });
  
    // Handle form submission
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Form submitted!");
    });
  
    updateFormSteps();
  });
  const progressBar = document.getElementById("progressBar");
progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;

