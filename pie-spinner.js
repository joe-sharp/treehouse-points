// pie-spinner.js
// Spinner logic for the pie chart area

function showSpinner() {
  removeSpinner();
  const spinner = document.createElement('div');
  spinner.className = 'pie-spinner';
  const colors = [
    '#3659A2', // Frontend
    '#008297', // Backend
    '#4A4290', // Design
    '#9F4B84', // Data
    '#9B3B5A', // Fundamentals
    '#733A88', // Experimental
    '#30826C', // Mobile
  ];
  const numSlices = colors.length;
  for (let i = 0; i < numSlices; i++) {
    const slice = document.createElement('div');
    slice.className = 'spinner-slice';
    slice.style.background = colors[i];
    slice.style.transform = `rotate(${(360 / numSlices) * i}deg) skewY(-60deg)`;
    spinner.appendChild(slice);
  }
  const pieElem = document.querySelector('.pie');
  if (pieElem) {
    pieElem.innerHTML = '';
    pieElem.appendChild(spinner);
  }
}

function removeSpinner() {
  const pieElem = document.querySelector('.pie');
  if (!pieElem) return;
  const spinner = pieElem.querySelector('.pie-spinner');
  if (spinner) pieElem.removeChild(spinner);
}

function injectSpinnerStyles() {
  if (document.getElementById('pie-spinner-style')) return;
  const style = document.createElement('style');
  style.id = 'pie-spinner-style';
  style.textContent = `
    .pie-spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 80px;
      height: 80px;
      margin-left: -40px;
      margin-top: -40px;
      border-radius: 50%;
      overflow: hidden;
      z-index: 10;
      animation: pie-spin 1s linear infinite;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .spinner-slice {
      position: absolute;
      width: 50%;
      height: 50%;
      left: 50%;
      top: 0;
      transform-origin: left bottom;
      border-radius: 0 100% 100% 0 / 0 100% 100% 0;
    }
    @keyframes pie-spin {
      100% { transform: rotate(360deg); }
    }
    .pie {
      position: relative;
    }
  `;
  document.head.appendChild(style);
}

// Export for global use
window.showSpinner = showSpinner;
window.removeSpinner = removeSpinner;
window.injectSpinnerStyles = injectSpinnerStyles;
