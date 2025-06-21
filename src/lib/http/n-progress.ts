import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure progress bar
NProgress.configure({
  easing: 'ease', // Animation style
  speed: 500, // Progress increment speed (ms)
  showSpinner: false, // Hide spinner
  trickleSpeed: 200, // Auto-increment interval (ms)
  minimum: 0.2, // Start at 20%
});

export default NProgress;
