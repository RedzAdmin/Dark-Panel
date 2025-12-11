// STRONG RUNNABLE OBFUSCATOR SERVICE
const OBFUSCATION_PATTERN = '素晴座素晴難CODEBREAKER素晴座素晴難';

class StrongRunnableObfuscator {
    constructor() {
        this.pattern = OBFUSCATION_PATTERN;
        this.patternParts = ['素晴座', '素晴難', 'CODEBREAKER'];
        this.variableNames = this.generateVariableNames();
    }
    
    generateVariableNames() {
        // Generate confusing variable names using your pattern
        return [
            '素晴座_1', '素晴難_2', 'CODEBREAKER_3', '素晴座_4', '素晴難_5',
            '_素晴座', '_素晴難', '_CODEBREAKER', '素晴座素晴難', 'CODEBREAKER素晴座'
        ];
    }
    
    obfuscate(code) {
        if (!code.trim()) return '';
        
        // Step 1: Parse and transform
        let transformed = this.transformCode(code);
        
        // Step 2: Add multiple protection layers
        let protected = this.addProtectionLayers(transformed);
        
        // Step 3: Wrap in executor
        let final = this.wrapInExecutor(protected);
        
        // Step 4: Add headers/footers
        return this.addMetadata(final);
    }
    
    transformCode(code) {
        // Transform variable names
        let vars = this.extractVariables(code);
        let varMap = this.createVariableMap(vars);
        
        // Replace variables with confusing names
        let transformed = code;
        Object.keys(varMap).forEach((varName, index) => {
            let newName = this.variableNames[index % this.variableNames.length];
            let regex = new RegExp(`\\b${varName}\\b`, 'g');
            transformed = transformed.replace(regex, newName);
        });
        
        // Add dead code with pattern
        transformed = this.addDeadCode(transformed);
        
        // String encryption
        transformed = this.encryptStrings(transformed);
        
        // Control flow obfuscation
        transformed = this.obfuscateControlFlow(transformed);
        
        return transformed;
    }
    
    extractVariables(code) {
        // Extract variable names from code
        let varRegex = /\b(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
        let funcRegex = /\bfunction\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
        let paramRegex = /function[^(]*\(([^)]*)\)/g;
        
        let variables = new Set();
        let match;
        
        while ((match = varRegex.exec(code)) !== null) {
            variables.add(match[2]);
        }
        
        while ((match = funcRegex.exec(code)) !== null) {
            variables.add(match[1]);
        }
        
        while ((match = paramRegex.exec(code)) !== null) {
            match[1].split(',').forEach(param => {
                let trimmed = param.trim().split('=')[0].trim();
                if (trimmed) variables.add(trimmed);
            });
        }
        
        return Array.from(variables);
    }
    
    createVariableMap(variables) {
        let map = {};
        variables.forEach((v, i) => {
            map[v] = this.variableNames[i % this.variableNames.length];
        });
        return map;
    }
    
    addDeadCode(code) {
        let deadCode = `
            /* 素晴座 DEAD CODE START 素晴座 */
            var ${this.variableNames[0]} = "${this.pattern}";
            var ${this.variableNames[1]} = function() {
                return "${this.pattern}".split('').reverse().join('');
            };
            try {
                ${this.variableNames[2]} = (function() {
                    var ${this.variableNames[3]} = "${this.pattern.substr(0, 5)}";
                    var ${this.variableNames[4]} = "${this.pattern.substr(5, 5)}";
                    return ${this.variableNames[3]} + ${this.variableNames[4]};
                })();
            } catch(${this.variableNames[5]}) {
                // 素晴難 IGNORE 素晴難
            }
            /* CODEBREAKER DEAD CODE END CODEBREAKER */
        `;
        
        return deadCode + '\n\n' + code;
    }
    
    encryptStrings(code) {
        // Find all strings in code
        let stringRegex = /(["'`])(?:(?=(\\?))\2.)*?\1/g;
        let strings = code.match(stringRegex) || [];
        
        strings.forEach(str => {
            if (str.length < 3) return; // Skip very short strings
            
            let cleanStr = str.substring(1, str.length - 1);
            let encrypted = this.encryptString(cleanStr);
            let replacement = `((function(){${encrypted}})())`;
            
            code = code.replace(str, replacement);
        });
        
        return code;
    }
    
    encryptString(str) {
        // Encrypt string using pattern
        let chars = str.split('');
        let encrypted = chars.map((char, i) => {
            let patternChar = this.pattern.charCodeAt(i % this.pattern.length);
            let charCode = char.charCodeAt(0);
            let encryptedCode = charCode ^ (patternChar % 256);
            return `String.fromCharCode(${encryptedCode}^${patternChar % 256})`;
        }).join('+');
        
        return `return ${encrypted}`;
    }
    
    obfuscateControlFlow(code) {
        // Convert if/else to ternary and other obfuscations
        code = code.replace(/if\s*\(([^)]+)\)\s*{([^}]+)}/g, 
            (match, condition, body) => {
                return `(${condition.trim()})?${this.obfuscateControlFlow(body)}:null`;
            });
        
        // Add fake switches
        let lines = code.split('\n');
        let result = [];
        
        for (let i = 0; i < lines.length; i++) {
            result.push(lines[i]);
            
            // Randomly insert pattern checks
            if (Math.random() > 0.7) {
                result.push(`/*${this.pattern.substr(Math.floor(Math.random() * 5), 3)}*/`);
            }
        }
        
        return result.join('\n');
    }
    
    addProtectionLayers(code) {
        // Add multiple protective layers
        let protectedCode = `
        /* 素晴座 PROTECTION LAYER 1 素晴座 */
        (function() {
            var 素晴座_guard = "${this.pattern}";
            if (typeof 素晴座_guard !== "string") return;
            
            /* 素晴難 PROTECTION LAYER 2 素晴難 */
            var CODEBREAKER_check = function() {
                return 素晴座_guard.length === ${this.pattern.length};
            };
            if (!CODEBREAKER_check()) return;
            
            /* DARK EMPIRE EXECUTION WRAPPER */
            try {
                ${code}
            } catch(素晴座_error) {
                console.error("素晴座素晴難ERROR素晴座素晴難", 素晴座_error);
            }
        })();
        `;
        
        return protectedCode;
    }
    
    wrapInExecutor(code) {
        // Wrap in self-executing function with anti-debug
        return `
        /* 素晴座 ANTI-DEBUG START 素晴座 */
        (function() {
            var ${this.variableNames[6]} = "${this.pattern}";
            var ${this.variableNames[7]} = new Date().getTime();
            
            // Anti-tampering check
            if (${this.variableNames[6]}.split('素晴座').length !== 3) {
                throw new Error("素晴座 TAMPER DETECTED 素晴座");
            }
            
            // Debugger protection
            var ${this.variableNames[8]} = function() {
                var ${this.variableNames[9]} = 0;
                while(${this.variableNames[9]} < 1000000) {
                    ${this.variableNames[9]}++;
                    if (${this.variableNames[9]} % 100000 === 0) {
                        if (${this.variableNames[6]}[${this.variableNames[9]} % ${this.variableNames[6]}.length] !== "${this.pattern[0]}") {
                            return false;
                        }
                    }
                }
                return true;
            };
            
            // Main execution
            ${code}
            
            /* 素晴難 EXECUTION COMPLETE 素晴難 */
        })();
        `;
    }
    
    addMetadata(code) {
        let header = `/*\n`;
        header += ` * DARK EMPIRE PANEL - STRONG OBFUSCATION\n`;
        header += ` * OBFUSCATED: ${new Date().toISOString()}\n`;
        header += ` * PATTERN: ${this.pattern}\n`;
        header += ` * PROTECTION: MULTI-LAYER RUNTIME\n`;
        header += ` */\n\n`;
        
        let footer = `\n\n/*\n`;
        footer += ` * BY CODEBREAKER\n`;
        footer += ` * 素晴座素晴難CODEBREAKER素晴座素晴難\n`;
        footer += ` * DO NOT DECOMPILE\n`;
        footer += ` */`;
        
        return header + code + footer;
    }
    
    minify(code) {
        return code
            .replace(/\/\/.*$/gm, '')
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\s+/g, ' ')
            .replace(/\s*([=+\-*\/%&|^!><?:{},;()])\s*/g, '$1')
            .trim();
    }
    
    // Deobfuscation (simplified)
    deobfuscate(obfuscated) {
        try {
            // Remove metadata
            let clean = obfuscated
                .replace(/\/\*[\s\S]*?\*\//g, '')
                .replace(new RegExp(this.pattern, 'g'), '')
                .replace(/素晴座|素晴難|CODEBREAKER/g, '');
            
            // Basic cleanup
            clean = clean
                .replace(/\s+/g, ' ')
                .replace(/;+/g, ';')
                .trim();
            
            return clean;
        } catch (error) {
            return `/* Deobfuscation failed: ${error.message} */`;
        }
    }
}

// Create instance
const obfuscator = new StrongRunnableObfuscator();

// Handle Obfuscate
function handleObfuscate() {
    const code = document.getElementById('code-input').value;
    const resultBox = document.getElementById('code-result');
    
    if (!code.trim()) {
        alert('Enter code to obfuscate!');
        return;
    }
    
    resultBox.innerHTML = '<div style="color: var(--accent);">🔐 APPLYING STRONG OBFUSCATION...</div>';
    resultBox.classList.remove('hidden');
    
    setTimeout(() => {
        try {
            const obfuscated = obfuscator.obfuscate(code);
            resultBox.textContent = obfuscated;
            
            // Test if it runs
            try {
                eval(obfuscated);
                resultBox.innerHTML += '\n\n<div style="color: var(--success); margin-top: 10px;">✅ OBFUSCATED CODE IS RUNNABLE</div>';
            } catch (e) {
                resultBox.innerHTML += `\n\n<div style="color: var(--danger); margin-top: 10px;">⚠️ Execution test failed: ${e.message}</div>`;
            }
            
        } catch (error) {
            resultBox.textContent = `Error: ${error.message}`;
        }
    }, 1000);
}

// Handle Deobfuscate
function handleDeobfuscate() {
    const code = document.getElementById('code-input').value;
    const resultBox = document.getElementById('code-result');
    
    if (!code.trim()) {
        alert('Enter code to deobfuscate!');
        return;
    }
    
    resultBox.innerHTML = '<div style="color: var(--accent);">🔓 DE-OBFUSCATING...</div>';
    resultBox.classList.remove('hidden');
    
    setTimeout(() => {
        try {
            const deobfuscated = obfuscator.deobfuscate(code);
            resultBox.textContent = deobfuscated;
        } catch (error) {
            resultBox.textContent = `Error: ${error.message}`;
        }
    }, 500);
}

// Copy function
function copyResult() {
    const resultBox = document.getElementById('code-result');
    if (resultBox.classList.contains('hidden')) {
        alert('No result to copy!');
        return;
    }
    
    const text = resultBox.textContent;
    navigator.clipboard.writeText(text)
        .then(() => alert('Copied to clipboard!'))
        .catch(err => console.error('Copy failed:', err));
}