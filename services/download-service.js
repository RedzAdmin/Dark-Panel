// Download Service
function handleDownload(platform, format) {
    let urlInput;
    let url;
    
    if (platform === 'tiktok') {
        urlInput = document.getElementById('tiktok-url');
    } else {
        urlInput = document.getElementById('youtube-url');
    }
    
    url = urlInput.value.trim();
    
    if (!url) {
        alert(`Please enter a ${platform} URL!`);
        return;
    }
    
    // Validate URL
    if (!isValidUrl(url)) {
        alert('Please enter a valid URL!');
        return;
    }
    
    const resultBox = document.getElementById('download-result');
    
    // Show processing
    resultBox.innerHTML = `<div style="text-align: center; padding: 2rem;">
        Processing ${platform} ${format.toUpperCase()} download... 
        <i class="fas fa-spinner fa-spin"></i>
        <div class="watermark">BY CODEBREAKER</div>
    </div>`;
    resultBox.classList.remove('hidden');
    
    // Simulate download processing
    setTimeout(() => {
        const videoId = Math.random().toString(36).substring(7);
        const downloadLink = `https://dark-empire-panel.com/download/${platform}/${videoId}.${format}`;
        
        resultBox.innerHTML = `<div style="padding: 1rem;">
            <h4>${platform.toUpperCase()} ${format.toUpperCase()} Download Ready!</h4>
            <p>Video ID: ${videoId}</p>
            <p>Format: ${format.toUpperCase()}</p>
            <p>Quality: 720p HD</p>
            <div style="margin-top: 1rem;">
                <a href="${downloadLink}" class="btn btn-primary" target="_blank">
                    <i class="fas fa-download"></i> Download ${format.toUpperCase()}
                </a>
            </div>
            <div class="watermark">BY CODEBREAKER</div>
        </div>`;
    }, 3000);
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}