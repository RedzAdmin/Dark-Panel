// Hard Obfuscator Service
const OBFUSCATION_PATTERN = '素晴座素晴難CODEBREAKER素晴座素晴難';

class HardObfuscator {
    constructor() {
        this.pattern = OBFUSCATION_PATTERN;
        this.patternChars = this.pattern.split('');
    }
    
    // Main obfuscation function
    obfuscate(code) {
        if (!code || code.trim() === '') return '';
        
        // Step 1: Minify the code
        let minified = this.minify(code);
        
        // Step 2: Convert to base64
        let base64 = btoa(unescape(encodeURIComponent(minified)));
        
        // Step 3: Split and inject pattern
        let chunks = [];
        for (let i = 0; i < base64.length; i += 3) {
            let chunk = base64.substr(i, 3);
            
            // Inject pattern characters randomly
            if (Math.random() > 0.7) {
                let patternChar = this.patternChars[Math.floor(Math.random() * this.patternChars.length)];
                chunk = patternChar + chunk;
            }
            
            // Randomly add pattern as whole
            if (Math.random() > 0.9) {
                chunk = this.pattern.substr(0, Math.floor(Math.random() * this.pattern.length)) + chunk;
            }
            
            chunks.push(chunk);
        }
        
        // Step 4: Create scrambled result
        let scrambled = chunks.join('');
        
        // Step 5: Add watermark multiple times
        let result = '';
        let lines = scrambled.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            result += lines[i];
            
            // Add pattern every few lines
            if (i % 2 === 0 && i > 0) {
                let randomPart = this.pattern.substr(
                    Math.floor(Math.random() * (this.pattern.length - 5)), 
                    3 + Math.floor(Math.random() * 3)
                );
                result += randomPart;
            }
            
            // Add full pattern every 5 lines
            if (i % 5 === 0 && i > 0) {
                result += this.pattern;
            }
            
            // Add watermark comment
            if (i % 3 === 0) {
                result += '/*' + this.getRandomWatermark() + '*/';
            }
            
            result += '\n';
        }
        
        // Step 6: Final encoding
        result = this.encodeString(result);
        
        // Add header and footer
        return `/* DARK EMPIRE PANEL OBFUSCATION */\n` +
               `/* PATTERN: ${this.pattern} */\n` +
               `/* OBFUSCATED ${new Date().toISOString()} */\n\n` +
               result + 
               `\n\n/* BY CODEBREAKER */\n` +
               `/* END OBFUSCATION */`;
    }
    
    // Deobfuscation function
    deobfuscate(obfuscated) {
        try {
            // Remove header and footer
            let clean = obfuscated
                .replace(/\/\* DARK EMPIRE PANEL OBFUSCATION \*\//g, '')
                .replace(/\/\* PATTERN: .*? \*\//g, '')
                .replace(/\/\* OBFUSCATED .*? \*\//g, '')
                .replace(/\/\* BY CODEBREAKER \*\//g, '')
                .replace(/\/\* END OBFUSCATION \*\//g, '')
                .replace(/\/\*素晴座素晴難CODEBREAKER素晴座素晴難\*\//g, '');
            
            // Remove all instances of the pattern
            let patternRegex = new RegExp(this.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            clean = clean.replace(patternRegex, '');
            
            // Remove partial patterns
            let partialPattern = /素晴座|素晴難|CODEBREAKER/g;
            clean = clean.replace(partialPattern, '');
            
            // Decode the string
            clean = this.decodeString(clean);
            
            // Extract base64 (remove comments and random chars)
            let base64Match = clean.match(/[A-Za-z0-9+/]+={0,2}/);
            if (!base64Match) throw new Error('Invalid obfuscated code');
            
            let base64 = base64Match[0];
            
            // Convert from base64
            try {
                let decoded = decodeURIComponent(escape(atob(base64)));
                return this.formatCode(decoded);
            } catch (e) {
                // Try alternative decoding
                return this.alternativeDecode(clean);
            }
            
        } catch (error) {
            return `/* Deobfuscation Failed */\n/* Error: ${error.message} */\n\n` + 
                   `/* This code was obfuscated with DARK EMPIRE PATTERN */\n` +
                   `/* Pattern: ${this.pattern} */`;
        }
    }
    
    // Helper functions
    minify(code) {
        // Simple minification
        return code
            .replace(/\/\/.*$/gm, '') // Remove single line comments
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\s*([=+\-*\/%&|^!><?:{},;()])\s*/g, '$1') // Remove spaces around operators
            .trim();
    }
    
    encodeString(str) {
        // Simple encoding - you can make this more complex
        let encoded = '';
        for (let i = 0; i < str.length; i++) {
            let charCode = str.charCodeAt(i);
            
            // Mix with pattern character codes
            if (i < this.pattern.length) {
                let patternCode = this.pattern.charCodeAt(i % this.pattern.length);
                charCode = charCode ^ (patternCode % 256);
            }
            
            // Add random offset
            charCode = (charCode + 13) % 65536;
            
            // Convert to hex with pattern mixed in
            let hex = charCode.toString(16).padStart(4, '0');
            
            // Occasionally insert pattern characters
            if (Math.random() > 0.8) {
                let patternIndex = Math.floor(Math.random() * this.pattern.length);
                hex = hex.substr(0, 2) + this.pattern[patternIndex] + hex.substr(2);
            }
            
            encoded += hex + ' ';
        }
        return encoded;
    }
    
    decodeString(encoded) {
        // Simple decoding
        let decoded = '';
        let hexValues = encoded.match(/.{1,6}/g) || [];
        
        for (let hex of hexValues) {
            // Remove pattern characters from hex
            let cleanHex = hex.replace(/[^0-9a-f]/gi, '');
            if (cleanHex.length === 4) {
                let charCode = parseInt(cleanHex, 16);
                charCode = (charCode - 13 + 65536) % 65536;
                
                // Reverse XOR with pattern
                if (decoded.length < this.pattern.length) {
                    let patternCode = this.pattern.charCodeAt(decoded.length % this.pattern.length);
                    charCode = charCode ^ (patternCode % 256);
                }
                
                decoded += String.fromCharCode(charCode);
            }
        }
        
        return decoded;
    }
    
    getRandomWatermark() {
        const watermarks = [
            'BY CODEBREAKER',
            'DARK EMPIRE TECH',
            '素晴座CODEBREAKER素晴座',
            'ENCRYPTED BY DARK EMPIRE',
            '素晴難PROTECTED素晴難',
            'SECURED WITH CODEBREAKER TECH',
            '素晴座素晴難ENCRYPTED素晴座素晴難'
        ];
        return watermarks[Math.floor(Math.random() * watermarks.length)];
    }
    
    alternativeDecode(str) {
        // Alternative decoding method
        try {
            // Extract all hex values
            let hexMatches = str.match(/[0-9a-f]{4}/gi) || [];
            let decoded = '';
            
            for (let hex of hexMatches) {
                let charCode = parseInt(hex, 16);
                if (charCode >= 32 && charCode <= 126) {
                    decoded += String.fromCharCode(charCode);
                }
            }
            
            return decoded;
        } catch (e) {
            return `/* Unable to fully deobfuscate */\n/* Pattern detected: ${this.pattern} */`;
        }
    }
    
    formatCode(code) {
        // Basic formatting
        return code
            .replace(/\{/g, '{\n  ')
            .replace(/\}/g, '\n}\n')
            .replace(/;/g, ';\n  ')
            .replace(/\n\s*\n/g, '\n');
    }
}

// Create instance
const obfuscator = new HardObfuscator();

// Handle Obfuscate button click
function handleObfuscate() {
    const code = document.getElementById('code-input').value;
    const resultBox = document.getElementById('code-result');
    
    if (!code.trim()) {
        alert('Please enter code to obfuscate!');
        return;
    }
    
    resultBox.innerHTML = '<div style="color: var(--accent);">🔐 OBFUSCATING WITH DARK EMPIRE TECH...</div>';
    resultBox.classList.remove('hidden');
    
    // Process
    setTimeout(() => {
        try {
            const obfuscated = obfuscator.obfuscate(code);
            resultBox.textContent = obfuscated;
            
            // Add copy button
            addCopyButton(resultBox, obfuscated);
            
        } catch (error) {
            resultBox.textContent = `Error: ${error.message}`;
        }
    }, 500);
}

// Handle Deobfuscate button click
function handleDeobfuscate() {
    const code = document.getElementById('code-input').value;
    const resultBox = document.getElementById('code-result');
    
    if (!code.trim()) {
        alert('Please enter code to deobfuscate!');
        return;
    }
    
    resultBox.innerHTML = '<div style="color: var(--accent);">🔓 DE-OBFUSCATING...</div>';
    resultBox.classList.remove('hidden');
    
    setTimeout(() => {
        try {
            const deobfuscated = obfuscator.deobfuscate(code);
            resultBox.textContent = deobfuscated;
            
            // Add copy button
            addCopyButton(resultBox, deobfuscated);
            
        } catch (error) {
            resultBox.textContent = `Error: ${error.message}\n\nThis code may not be obfuscated with DARK EMPIRE pattern.`;
        }
    }, 500);
}

// Add copy button to result
function addCopyButton(container, text) {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn btn-primary';
    copyBtn.style.marginTop = '10px';
    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Result';
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(text)
            .then(() => alert('Copied to clipboard!'))
            .catch(err => console.error('Copy failed:', err));
    };
    
    container.appendChild(copyBtn);
}

// Copy function for the main copy button
function copyResult() {
    const resultBox = document.getElementById('code-result');
    if (resultBox.classList.contains('hidden')) {
        alert('No result to copy!');
        return;
    }
    
    // Extract text without the copy button text
    const text = resultBox.textContent.replace('Copy Result', '').trim();
    
    navigator.clipboard.writeText(text)
        .then(() => {
            alert('Code copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy:', err);
        });
}