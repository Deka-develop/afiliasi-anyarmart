document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('resellerForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.querySelector('.loader');
    const resultSection = document.getElementById('resultSection');
    const affiliateLinkInput = document.getElementById('affiliateLink');
    const copyBtn = document.getElementById('copyBtn');

    // URL Web App Google Script Anda
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzdLmmXnkcim76HnHVrON8rzCD28lb2lfC4h2LVKJC62g93OJkO5NDVOL78SluIGdVM/exec';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Ambil data dari form
        const formData = new FormData(form);
        const nameVal = formData.get('name');
        
        // 2. Generate refCode di Frontend (Bypass CORS blocker)
        const cleanName = nameVal.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 4).padEnd(4, 'X');
        const randomNum = Math.floor(100 + Math.random() * 900);
        const refCode = cleanName + randomNum;

        const data = {
            name: nameVal,
            phone: formData.get('phone'),
            bank: formData.get('bank'),
            refCode: refCode
        };

        // 3. Ubah tampilan tombol jadi loading
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        submitBtn.disabled = true;

        try {
            // Gunakan mode no-cors agar browser tidak memblokir redirect 302 dari Google Apps Script
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(data)
            });

            // Karena no-cors tidak bisa membaca respon, kita asumsikan sukses jika tidak ada error jaringan
            form.classList.add('hidden');
            resultSection.classList.remove('hidden');

            const baseUrl = 'https://www.anyarmart.com/p/buku-diabetes.html';
            affiliateLinkInput.value = baseUrl + '?ref=' + refCode;

        } catch (error) {
            alert('Terjadi kesalahan koneksi internet. Silakan coba lagi.');
            console.error(error);
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });

    copyBtn.addEventListener('click', () => {
        affiliateLinkInput.select();
        document.execCommand('copy');
        const originalText = copyBtn.innerText;
        copyBtn.innerText = 'Tersalin!';
        copyBtn.style.backgroundColor = 'var(--success)';
        setTimeout(() => {
            copyBtn.innerText = originalText;
            copyBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }, 2000);
    });
});
