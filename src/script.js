console.log("✅ Script loaded!");
class TerminalPortfolio {
    constructor() {
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentCommand = '';
        this.isProcessing = false;
        
        // Portfolio data
        this.portfolioData = {
            name: "Sukrit",
            title: "AI/ML Engineer",
            bio: "An explorer who loves to push the boundaries of AI and machine learning. With a passion for innovation, I specialize in building intelligent systems that learn and adapt. My journey is driven by curiosity and a commitment to making technology accessible and impactful.",
            
            tools: {
                "Programming Languages": ["Python", "JavaScript", "C", "SQL", "C++"],
                "AI/ML Frameworks": ["TensorFlow", "PyTorch", "Scikit-learn", "Keras", "OpenAI API"],
                "Cloud & Tools": ["AWS", "Docker", "Git", "Jupyter", "MongoDB", "PostgreSQL", "SQLite", "Kubernetes"],
                "Specializations": ["Natural Language Processing", "Computer Vision", "Deep Learning", "MLOps"]
            },
            
            experience: [
                {
                    title: "Tech Associate",
                    community: "SC CSE AOT",
                    duration: "2023 - Present",
                    description: "Leading AI initiatives and navigating the team through complex technical challenges. Mentoring peers in AI/ML technologies and fostering a culture of innovation."
                },
                {
                    title: "Design Lead",
                    community: "MLSA Nexus",
                    duration: "2024 - Present",
                    description: "Designed community projects. Leading the team in creating impactful solutions and enhancing user experience through design thinking."
                },
                {
                    title: "Designer",
                    community: "GDG on campus AOT",
                    duration: "2024 - Present",
                    description: "Designed posts and website for the community. Collaborating with developers to create visually appealing and user-friendly interfaces."
                }
            ],
            
            projects: [
                {
                    title: "Email spam classifier",
                    description: "An email spam detection system with 85% accuracy using python.",
                    tech: "Python, NumPy, Pandas, Sklearn",
                    link: "https://github.com/SukritDeb/spamClassifier"
                },
                {
                    title: "Pain-O-Relief",
                    description: "Exercise suggestor for specific pain relief and real time consultation with doctors.",
                    tech: "Agora, Node.js, MongoDB, HTML, CSS, JavaScript",
                    link: "https://github.com/SukritDeb/Pain-O-Relief"
                },
                {
                    title: "My Terminal Portfolio",
                    description: "My interactive terminal portfolio showcasing my skills and projects.",
                    tech: "HTML, CSS, JavaScript, Node.js",
                    link: "https://github.com/SukritDeb/cmd_portfolio"
                },
                {
                    title: "Nubfolio",
                    description: "My canother clean and minimal portfolio website.",
                    tech: "HTML, CSS, JavaScript, Node.js",
                    link: "https://github.com/SukritDeb/nubfolio"
                }
            ],
            
            contact: {
                email: "debsukrit00@gmail.com",
                github: "https://github.com/SukritDeb",
                linkedin: "https://www.linkedin.com/in/sukritdeb/",
                website: "https://sukrit-beta.vercel.app"
            }
        };
        
        this.commands = {
            help: this.showHelp.bind(this),
            about: this.showAbout.bind(this),
            tools: this.showTools.bind(this),
            experience: this.showExperience.bind(this),
            projects: this.showProjects.bind(this),
            contact: this.showContact.bind(this),
            clear: this.clearTerminal.bind(this),
            whoami: this.whoAmI.bind(this),
            ls: this.listCommands.bind(this),
            resume: this.showResume.bind(this),
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateCursor();
     
        this.focusInput();
        
        // Play startup sound
        this.playSound();
    }
    
    setupEventListeners() {
        const input = document.getElementById('command-input');
        const terminal = document.getElementById('terminal');
        
        // Handle command input
        input.addEventListener('keydown', (e) => this.handleKeyDown(e));
        input.addEventListener('input', (e) => this.handleInput(e));
        
        // Focus input when clicking anywhere in terminal
        terminal.addEventListener('click', () => this.focusInput());
        
        // Prevent losing focus
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.terminal-container')) {
                this.focusInput();
            }
        });
    }
    
    handleKeyDown(e) {
        if (this.isProcessing) {
            e.preventDefault();
            return;
        }
        
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                this.executeCommand();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateHistory('up');
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.navigateHistory('down');
                break;
            case 'Tab':
                e.preventDefault();
                this.autoComplete();
                break;
            case 'c':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.cancelCommand();
                }
                break;
        }
    }
    
    handleInput(e) {
        this.currentCommand = e.target.value;
        this.updateCursor();
        this.playKeySound();
    }
    
    updateCursor() {
        const input = document.getElementById('command-input');
        const cursor = document.getElementById('cursor');
        const inputRect = input.getBoundingClientRect();
        const textWidth = this.getTextWidth(input.value, input);
        
        cursor.style.left = `${textWidth}px`;
    }
    
    getTextWidth(text, element) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const style = window.getComputedStyle(element);
        context.font = `${style.fontSize} ${style.fontFamily}`;
        return context.measureText(text).width;
    }
    
    executeCommand() {
        const input = document.getElementById('command-input');
        const command = input.value.trim().toLowerCase();
        
        if (!command) return;
        
        // Add command to history
        this.addToHistory(command);
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
        
        // Clear input
        input.value = '';
        this.currentCommand = '';
        this.updateCursor();
        
        // Execute command
        this.processCommand(command);
    }
    
    addToHistory(command) {
        const historyContainer = document.getElementById('command-history');
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line new';
        commandLine.innerHTML = `
            <span class="prompt">sukrit@portfolio:~$</span>
            <span class="command">${command}</span>
        `;
        historyContainer.appendChild(commandLine);
        this.scrollToBottom();
    }
    
    addOutput(content, className = 'output') {
        const historyContainer = document.getElementById('command-history');
        const outputLine = document.createElement('div');
        outputLine.className = 'terminal-line new';
        outputLine.innerHTML = `<span class="${className}">${content}</span>`;
        historyContainer.appendChild(outputLine);
        this.scrollToBottom();
    }
    
    processCommand(command) {
        this.isProcessing = true;
        
        // Simulate processing delay
        setTimeout(() => {
            const parts = command.split(' ');
            const cmd = parts[0];
            const args = parts.slice(1);
            
            if (this.commands[cmd]) {
                this.commands[cmd](args);
            } else {
                this.addOutput(`Command not found: ${cmd}. Type "help" for available commands.`, 'error');
            }
            
            this.isProcessing = false;
            this.focusInput();
        }, 100);
    }
    
    showHelp() {
        const helpText = `
Available commands:\n
  help:       Show this help message \n
  about:      Display information about me \n
  tools:      List my technical skills and tools \n
  experience: Show my work and educational experience \n
  projects:   Display my featured projects \n
  contact:    Show my contact information\n
  clear:      Clear the terminal screen\n
  whoami:     Display current user\n
  ls:         List available commands\n
  resume:        Downloads my resume\n

Navigation:\n
  ↑/↓:        Navigate command history\n
  Tab:        Auto-complete commands\n
  Ctrl+C:     Cancel current command\n
  
Type any command to get started!`;
        this.addOutput(helpText.replace(/\n/g, '<br>'), 'success');
    }
    
    showAbout() {
        const asciiArt = `
    ███████╗██╗   ██╗██╗  ██╗██████╗ ██╗████████╗
    ██╔════╝██║   ██║██║ ██╔╝██╔══██╗██║╚══██╔══╝
    ███████╗██║   ██║█████╔╝ ██████╔╝██║   ██║   
    ╚════██║██║   ██║██╔═██╗ ██╔══██╗██║   ██║   
    ███████║╚██████╔╝██║  ██╗██║  ██║██║   ██║   
    ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝   ╚═╝   
        `;
        
        this.addOutput(asciiArt, 'ascii-art');
        this.addOutput(`Name: ${this.portfolioData.name}`, 'info');
        this.addOutput(`Title: ${this.portfolioData.title}`, 'info');
        this.addOutput('', 'output');
        this.addOutput(this.portfolioData.bio, 'output');
    }
    
    showTools() {
        this.addOutput('=== TECHNICAL ARSENAL ===', 'section-header');
        
        Object.entries(this.portfolioData.tools).forEach(([category, tools]) => {
            this.addOutput('', 'output');
            this.addOutput(`${category}:`, 'skill-category-title');
            this.addOutput(`  ${tools.join(', ')}`, 'skill-list');
        });
    }
    
    showExperience() {
        this.addOutput('=== PROFESSIONAL JOURNEY ===', 'section-header');
        
        this.portfolioData.experience.forEach((exp, index) => {
            this.addOutput('', 'output');
            this.addOutput(`${index + 1}. ${exp.title}`, 'experience-title');
            this.addOutput(`   Community: ${exp.community}`, 'experience-community');
            this.addOutput(`   Duration: ${exp.duration}`, 'experience-duration');
            this.addOutput(`   ${exp.description}`, 'experience-description');
        });
    }
    
    showProjects() {
        this.addOutput('=== FEATURED PROJECTS ===', 'section-header');
        
        this.portfolioData.projects.forEach((project, index) => {
            this.addOutput('', 'output');
            this.addOutput(`${index + 1}. ${project.title}`, 'project-title');
            this.addOutput(`   ${project.description}`, 'project-description');
            this.addOutput(`   Tech Stack: ${project.tech}`, 'project-tech');
            this.addOutput(`   Link: <span class="project-link" onclick="window.open('${project.link}', '_blank')">${project.link}</span>`, 'output');
        });
    }
    
    showContact() {
        this.addOutput('=== GET IN TOUCH ===', 'section-header');
        this.addOutput('', 'output');
        
        Object.entries(this.portfolioData.contact).forEach(([key, value]) => {
            const label = key.charAt(0).toUpperCase() + key.slice(1);
            if (value.startsWith('http')) {
                this.addOutput(`${label.padEnd(10)}: <span class="contact-link" onclick="window.open('${value}', '_blank')">${value}</span>`, 'output');
            } else if (key === 'email') {
                this.addOutput(`${label.padEnd(10)}: <span class="contact-link" onclick="window.location.href='mailto:${value}'">${value}</span>`, 'output');
            } else {
                this.addOutput(`${label.padEnd(10)}: ${value}`, 'output');
            }
        });
        
        this.addOutput('', 'output');
        this.addOutput('Feel free to reach out for collaborations or opportunities!', 'success');
    }
    
    clearTerminal() {
        document.getElementById('command-history').innerHTML = '';
    }
    
    whoAmI() {
        this.addOutput('sukrit', 'output');
    }
    
    /*showDate() {
        this.addOutput(new Date().toString(), 'output');
    }*/
    
    listCommands() {
        const commands = Object.keys(this.commands).join('  ');
        this.addOutput(commands, 'output');
    }
    
    showResume() {
        const resumePath = '/resume.pdf'; // Update with the correct relative path
        const link = document.createElement('a');
        link.href = resumePath;
        link.download = 'Sukrit_Deb_Resume.pdf'; // Desired filename on download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.addOutput('Downloading resume...', 'success');
    }
    
    
    
    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        if (direction === 'up') {
            if (this.historyIndex > 0) {
                this.historyIndex--;
            }
        } else {
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
            } else {
                this.historyIndex = this.commandHistory.length;
                document.getElementById('command-input').value = '';
                this.updateCursor();
                return;
            }
        }
        
        const input = document.getElementById('command-input');
        input.value = this.commandHistory[this.historyIndex];
        this.currentCommand = input.value;
        this.updateCursor();
    }
    
    autoComplete() {
        const input = document.getElementById('command-input');
        const partial = input.value.toLowerCase();
        
        if (!partial) return;
        
        const matches = Object.keys(this.commands).filter(cmd => 
            cmd.startsWith(partial)
        );
        
        if (matches.length === 1) {
            input.value = matches[0];
            this.currentCommand = input.value;
            this.updateCursor();
        } else if (matches.length > 1) {
            this.addOutput(`Possible completions: ${matches.join(', ')}`, 'info');
        }
    }
    
    cancelCommand() {
        const input = document.getElementById('command-input');
        input.value = '';
        this.currentCommand = '';
        this.updateCursor();
        this.addOutput('^C', 'error');
    }
    
    focusInput() {
        setTimeout(() => {
            document.getElementById('command-input').focus();
        }, 10);
    }
    
    scrollToBottom() {
        const terminal = document.getElementById('terminal');
        terminal.scrollTop = terminal.scrollHeight;
    }
    
    /*setCurrentDate() {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('current-date').textContent = dateStr;
    }*/
    
    playSound() {
        // Simple beep sound for startup
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    
    playKeySound() {
        // Subtle key press sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 1000;
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.05);
        } catch (e) {
            // Ignore audio errors
        }
    }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TerminalPortfolio();
});
//for debugging enable the inspect
// Prevent context menu on right click for more authentic terminal feel
/*document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});*/

// Handle window focus to keep input focused
window.addEventListener('focus', () => {
    document.getElementById('command-input').focus();
});