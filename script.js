// DOM Elements
const navHome = document.getElementById('nav-home');
const navTools = document.getElementById('nav-tools');
const navBots = document.getElementById('nav-bots');
const navContact = document.getElementById('nav-contact');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const botSection = document.getElementById('bot-section');
const contactSection = document.getElementById('contact-section');
const toolsContainer = document.getElementById('tools-container');
const toolsDashboard = document.getElementById('tools-dashboard');

// Tool Cards Data
const tools = [
    {
        id: 'ai-tool',
        icon: 'fas fa-robot',
        title: 'AI Assistant',
        desc: 'Powerful AI chatbot powered by OpenRouter',
        color: '#00d4ff'
    },
    {
        id: 'obfuscator-tool',
        icon: 'fas fa-code',
        title: 'Code Obfuscator',
        desc: 'Obfuscate JavaScript code with custom pattern',
        color: '#9d4edd'
    },
    {
        id: 'image-tool',
        icon: 'fas fa-image',
        title: 'Image Tools',
        desc: 'Remove backgrounds and generate images using AI',
        color: '#ff6b6b'
    },
    {
        id: 'download-tool',
        icon: 'fas fa-download',
        title: 'Download Tools',
        desc: 'Download videos from TikTok and YouTube',
        color: '#1dd1a1'
    },
    {
        id: 'analyzer-tool',
        icon: 'fas fa-search',
        title: 'Code Analyzer',
        desc: 'AI-powered code analysis to find errors',
        color: '#feca57'
    }
];

// Initialize Dashboard
function initDashboard() {
    toolsDashboard.innerHTML = '';
    
    tools.forEach(tool => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-icon">
                <i class="${tool.icon}"></i>
            </div>
            <h3 class="card-title">${tool.title}</h3>
            <p class="card-desc">${tool.desc}</p>
            <a href="#" class="card-btn" data-tool="${tool.id}">
                <i class="fas fa-external-link-alt"></i> Open Tool
            </a>
        `;
        
        // Add click event
        const openBtn = card.querySelector('.card-btn');
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openTool(tool.id);
        });
        
        toolsDashboard.appendChild(card);
    });
}

// Navigation Functions
function showSection(section) {
    // Hide all sections
    [dashboardSection, authSection, botSection, contactSection, toolsContainer].forEach(sec => {
        if (sec) sec.classList.add('hidden');
    });
    
    // Reset nav links
    [navHome, navTools, navBots, navContact].forEach(nav => {
        if (nav) nav.classList.remove('active');
    });
    
    // Show selected section
    switch(section) {
        case 'home':
            dashboardSection.classList.remove('hidden');
            navHome.classList.add('active');
            break;
        case 'tools':
            toolsContainer.classList.remove('hidden');
            navTools.classList.add('active');
            break;
        case 'bots':
            botSection.classList.remove('hidden');
            navBots.classList.add('active');
            break;
        case 'contact':
            contactSection.classList.remove('hidden');
            navContact.classList.add('active');
            break;
    }
}

// Open Tool Function
function openTool(toolId) {
    showSection('tools');
    
    // Clear tools container
    toolsContainer.innerHTML = '';
    
    // Load specific tool
    switch(toolId) {
        case 'ai-tool':
            loadAITool();
            break;
        case 'obfuscator-tool':
            loadObfuscatorTool();
            break;
        case 'image-tool':
            loadImageTool();
            break;
        case 'download-tool':
            loadDownloadTool();
            break;
        case 'analyzer-tool':
            loadAnalyzerTool();
            break;
    }
}

// Load AI Tool
function loadAITool() {
    toolsContainer.innerHTML = `
        <div class="tool-section" id="ai-tool">
            <h2 class="section-title">AI Assistant</h2>
            <div class="tool-container">
                <div class="form-group">
                    <label class="form-label" for="ai-prompt">Enter your prompt:</label>
                    <textarea id="ai-prompt" class="textarea-large" placeholder="Ask me anything..."></textarea>
                </div>
                <div class="tool-buttons">
                    <button class="btn btn-primary" id="ai-submit">
                        <i class="fas fa-paper-plane"></i> Send to AI
                    </button>
                    <button class="btn btn-outline" id="ai-clear">
                        <i class="fas fa-trash"></i> Clear
                    </button>
                </div>
                <div class="result-box hidden" id="ai-result">
                    <div class="watermark">BY CODEBREAKER</div>
                </div>
            </div>
        </div>
    `;
    
    // Initialize AI tool events
    document.getElementById('ai-submit').addEventListener('click', handleAISubmit);
    document.getElementById('ai-clear').addEventListener('click', () => {
        document.getElementById('ai-prompt').value = '';
        document.getElementById('ai-result').classList.add('hidden');
    });
}

// Load Obfuscator Tool
function loadObfuscatorTool() {
    toolsContainer.innerHTML = `
        <div class="tool-section" id="obfuscator-tool">
            <h2 class="section-title">Code Obfuscator</h2>
            <div class="tool-container">
                <div class="form-group">
                    <label class="form-label" for="code-input">Enter JavaScript code:</label>
                    <textarea id="code-input" class="textarea-large" placeholder="// Paste your JavaScript code here
function example() {
    console.log('Hello World');
    return true;
}"></textarea>
                </div>
                <div class="tool-buttons">
                    <button class="btn btn-primary" id="obfuscate-btn">
                        <i class="fas fa-lock"></i> Obfuscate Code
                    </button>
                    <button class="btn btn-outline" id="deobfuscate-btn">
                        <i class="fas fa-unlock"></i> Deobfuscate Code
                    </button>
                    <button class="btn btn-outline" id="copy-code-btn">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div class="result-box hidden" id="code-result">
                    <div class="watermark">BY CODEBREAKER</div>
                </div>
            </div>
        </div>
    `;
    
    // Initialize obfuscator events
    document.getElementById('obfuscate-btn').addEventListener('click', handleObfuscate);
    document.getElementById('deobfuscate-btn').addEventListener('click', handleDeobfuscate);
    document.getElementById('copy-code-btn').addEventListener('click', copyResult);
}

// Load Image Tool
function loadImageTool() {
    toolsContainer.innerHTML = `
        <div class="tool-section" id="image-tool">
            <h2 class="section-title">Image Tools</h2>
            <div class="tool-container">
                <div class="form-group">
                    <label class="form-label">Select Image Tool:</label>
                    <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                        <button class="btn btn-primary" id="bg-remove-btn">
                            <i class="fas fa-eraser"></i> Remove Background
                        </button>
                        <button class="btn btn-outline" id="image-generate-btn">
                            <i class="fas fa-plus"></i> Generate Image
                        </button>
                    </div>
                </div>
                
                <!-- Background Remove Section -->
                <div id="bg-remove-section" style="display: none;">
                    <div class="form-group">
                        <label class="form-label" for="image-upload">Upload Image:</label>
                        <input type="file" id="image-upload" class="form-input" accept="image/*">
                    </div>
                    <div class="tool-buttons">
                        <button class="btn btn-primary" id="remove-bg-btn">
                            <i class="fas fa-magic"></i> Remove Background
                        </button>
                    </div>
                    <div id="image-result" style="margin-top: 1.5rem;"></div>
                </div>
                
                <!-- Image Generate Section -->
                <div id="image-generate-section" style="display: none;">
                    <div class="form-group">
                        <label class="form-label" for="image-prompt">Image Prompt:</label>
                        <textarea id="image-prompt" class="textarea-large" placeholder="Describe the image you want to generate..."></textarea>
                    </div>
                    <div class="tool-buttons">
                        <button class="btn btn-primary" id="generate-image-btn">
                            <i class="fas fa-wand-magic-sparkles"></i> Generate Image
                        </button>
                    </div>
                    <div id="generated-image" style="margin-top: 1.5rem;"></div>
                </div>
            </div>
        </div>
    `;
    
    // Initialize image tool events
    document.getElementById('bg-remove-btn').addEventListener('click', () => {
        document.getElementById('bg-remove-section').style.display = 'block';
        document.getElementById('image-generate-section').style.display = 'none';
    });
    
    document.getElementById('image-generate-btn').addEventListener('click', () => {
        document.getElementById('image-generate-section').style.display = 'block';
        document.getElementById('bg-remove-section').style.display = 'none';
    });
    
    document.getElementById('remove-bg-btn').addEventListener('click', handleRemoveBackground);
    document.getElementById('generate-image-btn').addEventListener('click', handleGenerateImage);
}

// Load Download Tool
function loadDownloadTool() {
    toolsContainer.innerHTML = `
        <div class="tool-section" id="download-tool">
            <h2 class="section-title">Download Tools</h2>
            <div class="tool-container">
                <div class="form-group">
                    <label class="form-label">Select Platform:</label>
                    <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                        <button class="btn btn-primary" id="tiktok-btn">
                            <i class="fab fa-tiktok"></i> TikTok Downloader
                        </button>
                        <button class="btn btn-outline" id="youtube-btn">
                            <i class="fab fa-youtube"></i> YouTube Downloader
                        </button>
                    </div>
                </div>
                
                <!-- TikTok Downloader -->
                <div id="tiktok-section" style="display: none;">
                    <div class="form-group">
                        <label class="form-label" for="tiktok-url">TikTok Video URL:</label>
                        <input type="text" id="tiktok-url" class="form-input" placeholder="https://www.tiktok.com/@username/video/123456789">
                    </div>
                    <div class="tool-buttons">
                        <button class="btn btn-primary" id="tiktok-mp4-btn">
                            <i class="fas fa-video"></i> Download MP4
                        </button>
                        <button class="btn btn-outline" id="tiktok-mp3-btn">
                            <i class="fas fa-music"></i> Download MP3
                        </button>
                    </div>
                </div>
                
                <!-- YouTube Downloader -->
                <div id="youtube-section" style="display: none;">
                    <div class="form-group">
                        <label class="form-label" for="youtube-url">YouTube Video URL:</label>
                        <input type="text" id="youtube-url" class="form-input" placeholder="https://www.youtube.com/watch?v=xxxxxxxxxxx">
                    </div>
                    <div class="tool-buttons">
                        <button class="btn btn-primary" id="youtube-mp4-btn">
                            <i class="fas fa-video"></i> Download MP4
                        </button>
                        <button class="btn btn-outline" id="youtube-mp3-btn">
                            <i class="fas fa-music"></i> Download MP3
                        </button>
                    </div>
                </div>
                
                <div class="result-box hidden" id="download-result">
                    <div class="watermark">BY CODEBREAKER</div>
                </div>
            </div>
        </div>
    `;
    
    // Initialize download tool events
    document.getElementById('tiktok-btn').addEventListener('click', () => {
        document.getElementById('tiktok-section').style.display = 'block';
        document.getElementById('youtube-section').style.display = 'none';
    });
    
    document.getElementById('youtube-btn').addEventListener('click', () => {
        document.getElementById('youtube-section').style.display = 'block';
        document.getElementById('tiktok-section').style.display = 'none';
    });
    
    document.getElementById('tiktok-mp4-btn').addEventListener('click', () => handleDownload('tiktok', 'mp4'));
    document.getElementById('tiktok-mp3-btn').addEventListener('click', () => handleDownload('tiktok', 'mp3'));
    document.getElementById('youtube-mp4-btn').addEventListener('click', () => handleDownload('youtube', 'mp4'));
    document.getElementById('youtube-mp3-btn').addEventListener('click', () => handleDownload('youtube', 'mp3'));
}

// Load Analyzer Tool
function loadAnalyzerTool() {
    toolsContainer.innerHTML = `
        <div class="tool-section" id="analyzer-tool">
            <h2 class="section-title">Code Analyzer</h2>
            <div class="tool-container">
                <div class="form-group">
                    <label class="form-label" for="analyzer-code">Enter code to analyze:</label>
                    <textarea id="analyzer-code" class="textarea-large" placeholder="// Paste your code here for AI analysis
function example() {
    let x = 10;
    console.log(x);
    return x;
}"></textarea>
                </div>
                <div class="tool-buttons">
                    <button class="btn btn-primary" id="analyze-btn">
                        <i class="fas fa-search"></i> Analyze Code
                    </button>
                    <button class="btn btn-outline" id="clear-analyzer-btn">
                        <i class="fas fa-trash"></i> Clear
                    </button>
                </div>
                <div class="result-box hidden" id="analyzer-result">
                    <div class="watermark">BY CODEBREAKER</div>
                </div>
            </div>
        </div>
    `;
    
    // Initialize analyzer events
    document.getElementById('analyze-btn').addEventListener('click', handleAnalyzeCode);
    document.getElementById('clear-analyzer-btn').addEventListener('click', () => {
        document.getElementById('analyzer-code').value = '';
        document.getElementById('analyzer-result').classList.add('hidden');
    });
}

// Bot Launch Functions
document.getElementById('launch-md-bot').addEventListener('click', () => {
    window.open('https://your-md-bot-url.com', '_blank');
});

document.getElementById('launch-bug-bot').addEventListener('click', () => {
    window.open('https://your-bug-bot-url.com', '_blank');
});

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    
    // Navigation events
    navHome.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('home');
    });
    
    navTools.addEventListener('click', (e) => {
        e.preventDefault();
        openTool('ai-tool'); // Default to AI tool
    });
    
    navBots.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('bots');
    });
    
    navContact.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('contact');
    });
    
    // Auth events
    loginBtn.addEventListener('click', () => {
        authSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
        initAuth();
    });
    
    logoutBtn.addEventListener('click', () => {
        auth.signOut().then(() => {
            alert('Logged out successfully!');
        });
    });
});

// Initialize Auth System
function initAuth() {
    const authForm = document.getElementById('auth-form');
    const authTitle = document.getElementById('auth-title');
    const authSubmitText = document.getElementById('auth-submit-text');
    const authSwitchText = document.getElementById('auth-switch-text');
    const authSwitchLink = document.getElementById('auth-switch-link');
    const nameGroup = document.getElementById('name-group');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');
    
    let isLogin = true;
    
    function switchAuthMode() {
        isLogin = !isLogin;
        
        if (isLogin) {
            authTitle.textContent = 'Login to Dark Empire';
            authSubmitText.textContent = 'Login';
            authSwitchText.textContent = "Don't have an account? ";
            authSwitchLink.textContent = 'Sign Up';
            nameGroup.style.display = 'none';
            confirmPasswordGroup.style.display = 'none';
        } else {
            authTitle.textContent = 'Sign Up for Dark Empire';
            authSubmitText.textContent = 'Sign Up';
            authSwitchText.textContent = 'Already have an account? ';
            authSwitchLink.textContent = 'Login';
            nameGroup.style.display = 'block';
            confirmPasswordGroup.style.display = 'block';
        }
    }
    
    authSwitchLink.addEventListener('click', switchAuthMode);
    
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (isLogin) {
            // Login
            auth.signInWithEmailAndPassword(email, password)
                .then(() => {
                    alert('Login successful!');
                    authSection.classList.add('hidden');
                })
                .catch(error => {
                    alert('Login failed: ' + error.message);
                });
        } else {
            // Sign Up
            const name = document.getElementById('name').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Update profile
                    return userCredential.user.updateProfile({
                        displayName: name
                    });
                })
                .then(() => {
                    alert('Sign up successful!');
                    authSection.classList.add('hidden');
                })
                .catch(error => {
                    alert('Sign up failed: ' + error.message);
                });
        }
    });
}