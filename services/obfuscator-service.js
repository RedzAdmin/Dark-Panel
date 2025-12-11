// Obfuscator Service
const OBFUSCATION_PREFIX = '素晴座素晴難';
const OBFUSCATION_SUFFIX = '素晴座素晴難';

function handleObfuscate() {
    const code = document.getElementById('code-input').value;
    const resultBox = document.getElementById('code-result');
    
    if (!code.trim()) {
        alert('Please enter code to obfuscate!');
        return;
    }
    
    // Simple obfuscation (customize this for your needs)
    const obfuscated = obfuscateCode(code);
    
    resultBox.textContent = obfuscated;
    resultBox.classList.remove('hidden');
}

function handleDeobfuscate() {
    const code = document.getElementById('code-input').value;
    const resultBox = document.getElementById('code-result');
    
    if (!code.trim()) {
        alert('Please enter code to deobfuscate!');
        return;
    }
    
    // Try to deobfuscate
    try {
        const deobfuscated = deobfuscateCode(code);
        resultBox.textContent = deobfuscated;
    } catch (error) {
        resultBox.textContent = 'Error: Could not deobfuscate code. Make sure it was obfuscated with this tool.';
    }
    
    resultBox.classList.remove('hidden');
}

function obfuscateCode(code) {
    // Custom obfuscation algorithm
    let obfuscated = '';
    
    // Add prefix
    obfuscated += OBFUSCATION_PREFIX + '\n';
    
    // Simple character shifting (you can make this more complex)
    for (let i = 0; i < code.length; i++) {
        let char = code.charCodeAt(i);
        // Shift characters by pattern
        char = char + (i % 10) + 5;
        obfuscated += String.fromCharCode(char);
    }
    
    // Add suffix
    obfuscated += '\n' + OBFUSCATION_SUFFIX;
    
    // Add watermark
    obfuscated += '\n// Obfuscated by DARK EMPIRE PANEL - BY CODEBREAKER';
    
    return obfuscated;
}

function deobfuscateCode(code) {
    // Remove prefix and suffix
    if (code.includes(OBFUSCATION_PREFIX)) {
        code = code.split(OBFUSCATION_PREFIX)[1];
    }
    if (code.includes(OBFUSCATION_SUFFIX)) {
        code = code.split(OBFUSCATION_SUFFIX)[0];
    }
    
    // Remove watermark
    code = code.replace('// Obfuscated by DARK EMPIRE PANEL - BY CODEBREAKER', '');
    
    // Reverse character shifting
    let deobfuscated = '';
    for (let i = 0; i < code.length; i++) {
        let char = code.charCodeAt(i);
        // Reverse the shift
        char = char - (i % 10) - 5;
        deobfuscated += String.fromCharCode(char);
    }
    
    return deobfuscated.trim();
}

function copyResult() {
    const resultBox = document.getElementById('code-result');
    if (resultBox.classList.contains('hidden')) {
        alert('No result to copy!');
        return;
    }
    
    navigator.clipboard.writeText(resultBox.textContent)
        .then(() => {
            alert('Code copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
}