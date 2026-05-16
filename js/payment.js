// ===== PAYMENT LOGIC =====
const btcAddress = 'bc1q02ulpmjxwyadyd675mp3je65ymjnymhkdt2n9v';

// Get Plan from URL
const params = new URLSearchParams(window.location.search);
const planType = params.get('plan') || 'health';

// Plan Data
const plans = {
    health: { name: 'Health Insurance', price: 250, btc: 0.00285 },
    life: { name: 'Life Insurance', price: 150, btc: 0.00171 },
    travel: { name: 'Travel Insurance', price: 75, btc: 0.00085 },
    critical: { name: 'Critical Illness', price: 200, btc: 0.00228 },
    business: { name: 'Business Insurance', price: 500, btc: 0.00570 },
    hantavirus: { name: 'Hantavirus Protection', price: 350, btc: 0.00399 }
};

const selectedPlan = plans[planType] || plans.health;

// Update UI
document.getElementById('selectedPlanName').textContent = selectedPlan.name;
document.getElementById('summaryPlan').textContent = selectedPlan.name;
document.getElementById('summaryCad').textContent = `$${selectedPlan.price}.00`;
document.getElementById('btcAmount').textContent = `${selectedPlan.btc} BTC`;
document.getElementById('btcAddress').textContent = btcAddress;

// Generate QR Code (Simple Canvas Simulation)
const qrCanvas = document.getElementById('qrCode');
if (qrCanvas) {
    const ctx = qrCanvas.getContext('2d');
    const size = 200;
    const modules = 25;
    const moduleSize = size / modules;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#000000';
    
    // Draw pattern
    for (let i = 0; i < modules; i++) {
        for (let j = 0; j < modules; j++) {
            if ((i < 7 && j < 7) || (i < 7 && j > modules - 8) || (i > modules - 8 && j < 7)) {
                if (!((i > 2 && i < 5 && j > 2 && j < 5))) {
                    ctx.fillRect(j * moduleSize, i * moduleSize, moduleSize, moduleSize);
                }
            } else {
                if (Math.random() > 0.5) ctx.fillRect(j * moduleSize, i * moduleSize, moduleSize, moduleSize);
            }
        }
    }
    
    // BTC Logo
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, moduleSize * 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#f7931a';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('₿', size / 2, size / 2);
}

// Copy Address
const copyButton = document.getElementById('copyAddress');
copyButton?.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(btcAddress);
        const originalText = copyButton.innerHTML;
        copyButton.innerHTML = '<span class="copy-icon">✓</span><span class="copy-text">Copied!</span>';
        copyButton.classList.add('copied');
        setTimeout(() => {
            copyButton.innerHTML = originalText;
            copyButton.classList.remove('copied');
        }, 2000);
        showNotification('Address copied!', 'success');
    } catch (err) {
        showNotification('Failed to copy', 'error');
    }
});

// Countdown
let timeRemaining = 15 * 60;
function updateCountdown() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const minEl = document.getElementById('minutes');
    const secEl = document.getElementById('seconds');
    if (minEl) minEl.textContent = minutes.toString().padStart(2, '0');
    if (secEl) secEl.textContent = seconds.toString().padStart(2, '0');
    if (timeRemaining > 0) {
        timeRemaining--;
        setTimeout(updateCountdown, 1000);
    }
}
updateCountdown();

// Confirm Button
document.getElementById('confirmPayment')?.addEventListener('click', () => {
    showNotification('Payment verification in progress...', 'success');
    setTimeout(() => {
        alert('Thank you! Your policy will be activated once the blockchain confirms the transaction.');
        window.location.href = 'index.html';
    }, 2000);
});
