// CUTE CARD NEWS EXPORT SYSTEM

document.addEventListener('DOMContentLoaded', () => {
    const downloadAllBtn = document.getElementById('download-all-btn');

    if (!downloadAllBtn) return;

    downloadAllBtn.addEventListener('click', async () => {
        // Disable button during export
        downloadAllBtn.disabled = true;
        const originalText = downloadAllBtn.innerHTML;
        
        const cards = document.querySelectorAll('.card-slide');
        
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            
            // Highlight progress on button
            downloadAllBtn.innerHTML = `<span class="btn-icon">⏳</span> 저장 중 (${i + 1}/${cards.length})`;
            
            try {
                // Render the card (540x540) to high quality 1080x1080 image using scale: 2
                const canvas = await html2canvas(card, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: null,
                    logging: false
                });
                
                // Convert canvas to image url
                const dataUrl = canvas.toDataURL('image/png');
                
                // Create download link and trigger click
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `대시보드_안내_카드_${String(i + 1).padStart(2, '0')}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Delay to prevent browser blocking multiple downloads
                await new Promise(resolve => setTimeout(resolve, 800));
                
            } catch (err) {
                console.error(`카드 ${i + 1} 렌더링 중 에러 발생:`, err);
            }
        }
        
        // Restore button state
        downloadAllBtn.innerHTML = '<span class="btn-icon">🎉</span> 다운로드 완료!';
        downloadAllBtn.disabled = false;
        
        setTimeout(() => {
            downloadAllBtn.innerHTML = originalText;
        }, 3000);
    });
});
