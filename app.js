document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('resellerForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.querySelector('.loader');
    const resultSection = document.getElementById('resultSection');
    const affiliateLinkInput = document.getElementById('affiliateLink');
    const copyBtn = document.getElementById('copyBtn');

    // GANTI URL INI DENGAN URL WEB APP GOOGLE SCRIPT ANDA NANTINYA
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzdLmmXnkcim76HnHVrON8rzCD28lb2lfC4h2LVKJC62g93OJkO5NDVOL78SluIGdVM/exec';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Ambil data dari form
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            bank: formData.get('bank')
        };

        // 2. Ubah tampilan tombol jadi loading
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        submitBtn.disabled = true;

        try {
            // Karena ini adalah contoh simulasi, kita pakai URL dummy atau mode simulasi
            // Jika GOOGLE_SCRIPT_URL belum diganti, kita simulasi saja dulu:
            let refCode = "";

            if (GOOGLE_SCRIPT_URL.includes('AKfycb...')) {
                // SIMULASI LOKAL (Jika belum di-deploy ke Apps Script)
                await new Promise(r => setTimeout(r, 1500)); // pura-pura loading

                // Buat kode unik dari nama
                const cleanName = data.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 5);
                const randomNum = Math.floor(100 + Math.random() * 900);
                refCode = cleanName + randomNum;
            } else {
                // KODE ASLI UNTUK PRODUCTION (Kirim ke Google Sheets)
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (result.status === 'success') {
                    refCode = result.refCode;
                } else {
                    throw new Error('Gagal mendaftar');
                }
            }

            // 3. Tampilkan hasil
            form.classList.add('hidden');
            resultSection.classList.remove('hidden');

            // Generate link afiliasi
            // Asumsi domain utama adalah www.anyarmart.com
            const baseUrl = 'https://www.anyarmart.com/p/buku-diabetes.html';
            affiliateLinkInput.value = `${baseUrl}?ref=${refCode}`;

        } catch (error) {
            alert("Terjadi kesalahan saat mendaftar. Pastikan koneksi internet Anda stabil.");
            console.error(error);

            // Kembalikan tombol
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });

    // Fitur Copy Link
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
