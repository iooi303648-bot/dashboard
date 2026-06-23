// CUTE CARD NEWS SLIDER & EXPORT SYSTEM

document.addEventListener('DOMContentLoaded', () => {
    // === 1. SLIDER & NAVIGATION LOGIC ===
    const track = document.getElementById('slider-track');
    const cards = document.querySelectorAll('.card-slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotsContainer = document.getElementById('slider-dots');
    
    if (track && cards.length > 0 && prevBtn && nextBtn && dotsContainer) {
        let currentIndex = 0;
        const totalCards = cards.length;
        
        // Create Dots Dynamically
        cards.forEach((card, index) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            dotsContainer.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.slider-dot');
        
        function updateControls() {
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === totalCards - 1;
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        function goToSlide(index) {
            if (index < 0 || index >= totalCards) return;
            currentIndex = index;
            
            // Slide transition by moving the track horizontally (by 100% of container width per card)
            const offset = -currentIndex * 100;
            track.style.transform = `translateX(${offset}%)`;
            
            updateControls();
        }
        
        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
        });
        
        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
        });
        
        // Touch Swipe Support for Mobile Devices
        let startX = 0;
        let endX = 0;
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const diffX = startX - endX;
            // Swipe threshold of 50px
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left -> Next slide
                    goToSlide(currentIndex + 1);
                } else {
                    // Swipe right -> Prev slide
                    goToSlide(currentIndex - 1);
                }
            }
        }
        
        // Initialize controls state
        updateControls();
    }

    // === 2. IMAGE EXPORT / DOWNLOAD LOGIC ===
    const downloadAllBtn = document.getElementById('download-all-btn');

    if (downloadAllBtn) {
        downloadAllBtn.addEventListener('click', async () => {
            // Disable button during export to prevent double clicks
            downloadAllBtn.disabled = true;
            const originalText = downloadAllBtn.innerHTML;
            
            const exportCards = document.querySelectorAll('.card-slide');
            
            for (let i = 0; i < exportCards.length; i++) {
                const card = exportCards[i];
                
                // Show progress on button
                downloadAllBtn.innerHTML = `<span class="btn-icon">⏳</span> 저장 중 (${i + 1}/${exportCards.length})`;
                
                try {
                    // Render the card (using its base size, scale:2 ensures high quality 1080x1080px export)
                    const canvas = await html2canvas(card, {
                        scale: 2,
                        useCORS: true,
                        allowTaint: true,
                        backgroundColor: null,
                        logging: false
                    });
                    
                    // Convert canvas to image URL
                    const dataUrl = canvas.toDataURL('image/png');
                    
                    // Create temporary link and click it to download
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = `대시보드_안내_카드_${String(i + 1).padStart(2, '0')}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    // Delay between downloads to prevent browser blocking multi-downloads
                    await new Promise(resolve => setTimeout(resolve, 800));
                    
                } catch (err) {
                    console.error(`카드 ${i + 1} 렌더링 중 에러 발생:`, err);
                }
            }
            
            // Download completed state
            downloadAllBtn.innerHTML = '<span class="btn-icon">🎉</span> 다운로드 완료!';
            downloadAllBtn.disabled = false;
            
            setTimeout(() => {
                downloadAllBtn.innerHTML = originalText;
            }, 3000);
        });
    }
});
