document.addEventListener('DOMContentLoaded', () => {
    // New level elements
    const fullBtn = document.getElementById('full-btn');
    const levelDisplay = document.getElementById('level-display');
    const progressInfo = document.getElementById('progress-info');
    const nextLevelTime = document.getElementById('next-level-time');
    const levelProgressBar = document.getElementById('level-progress-bar');
    
    let level = 1;
    let levelStartTime = Date.now();
    let levelProgress = 0;
    let levelInterval;

    // Calculate level requirements (10 minutes for level 1, doubles each level)
    function getLevelRequirement(currentLevel) {
        return 10 * 60 * Math.pow(2, currentLevel - 1); // 10 minutes for level 1, doubles each level
    }

    // Update level progress
    function updateLevelProgress() {
        if (!isRunning) return;

        const currentTime = Date.now();
        const timeElapsed = (currentTime - levelStartTime) / 1000; // in seconds
        const levelRequirement = getLevelRequirement(level);

        levelProgress = (timeElapsed / levelRequirement) * 100;
        levelProgressBar.style.width = ${Math.min(levelProgress, 100)}%;

        if (timeElapsed < levelRequirement) {
            const remainingSeconds = levelRequirement - timeElapsed;
            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = Math.floor(remainingSeconds % 60);
            nextLevelTime.textContent = ${minutes}:${seconds.toString().padStart(2, '0')};
        } else {
            nextLevelTime.textContent = 'Ready!';
            levelUp();
        }
    }

    // Toggle progress display
    function toggleProgressDisplay() {
        if (progressInfo.classList.contains('hidden')) {
            progressInfo.classList.remove('hidden');
            levelInterval = setInterval(updateLevelProgress, 1000);
            updateLevelProgress();
        } else {
            progressInfo.classList.add('hidden');
            clearInterval(levelInterval);
        }
    }

    // Level up
    function levelUp() {
        if (levelProgress >= 100) {
            level++; // زيادة مستوى واحد فقط
            levelDisplay.textContent = "LV " + level; // تحديث العرض على الشاشة
            levelStartTime = Date.now(); // إعادة بدء عداد المستوى الجديد
            levelProgress = 0; // إعادة عداد التقدم
            updateLevelProgress(); // تحديث شريط التقدم للـ Level الجديد
        }
    }

    // Timer elements
    const timerDisplay = document.getElementById('timer-display');
    const progressCircle = document.getElementById('progress-circle');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const minutesInput = document.getElementById('minutes-input');
    
    // Notes elements
    const noteInput = document.getElementById('note-input');
    const addNoteBtn = document.getElementById('add-note-btn');
    const notesList = document.getElementById('notes-list');
    
    let timer;
    let totalSeconds = 25 * 60;
    let remainingSeconds = totalSeconds;
    let isRunning = false;
    const circumference = 2 * Math.PI * 45;
    
    // Initialize timer
    function initTimer() {
        totalSeconds = parseInt(minutesInput.value) * 60;
        remainingSeconds = totalSeconds;
        updateDisplay();
        progressCircle.style.strokeDashoffset = 0;
        timerDisplay.classList.remove('timer-complete', 'text-red-500');
    }

    // Update timer display
    function updateDisplay() {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        timerDisplay.textContent = ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')};
        
        // Update progress circle
        const progress = remainingSeconds / totalSeconds;
        const dashOffset = circumference * (1 - progress);
        progressCircle.style.strokeDashoffset = dashOffset;
    }

    // Start timer
    function startTimer() {
        if (isRunning) return;
        
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        
        // Start level progress tracking
        levelStartTime = Date.now();
        if (!levelInterval) {
            levelInterval = setInterval(updateLevelProgress, 1000);
        }
        
        timer = setInterval(() => {
            remainingSeconds--;
            updateDisplay();
            
            if (remainingSeconds <= 0) {
                clearInterval(timer);
                isRunning = false;
                timerDisplay.classList.add('timer-complete', 'text-red-500');
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                
                // Play alert sound
                const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
                audio.play();
            }
        }, 1000);
    }

    // Pause timer
    function pauseTimer() {
        clearInterval(timer);
        clearInterval(levelInterval);
        levelInterval = null;
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }

    // Reset timer
    function resetTimer() {
        pauseTimer();
        initTimer();
        levelProgress = 0;
        levelProgressBar.style.width = '0%';
        nextLevelTime.textContent = '0:00';
    }

    // Add new note
    function addNote() {
        const noteText = noteInput.value.trim();
        const noteTitle = document.getElementById('note-title-input').value.trim();
        if (noteText === '' && noteTitle === '') return;
        const noteItem = document.createElement('li');
        noteItem.className = 'note-item bg-gray-50 p-3 rounded-lg flex flex-col';
        noteItem.innerHTML = `
            ${noteTitle ? <h3 class="note-title">${noteTitle}</h3> : ''}
            <span class="note-text">${noteText}</span>
            <div class="flex justify-end gap-2">
                <div class="flex gap-2">
                    <button class="edit-note text-blue-500 hover:text-blue-700">
                        <i data-feather="edit" class="w-4 h-4"></i>
                    </button>
                    <button class="delete-note text-red-500 hover:text-red-700">
                        <i data-feather="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        `;
        notesList.appendChild(noteItem);
        noteInput.value = '';
        feather.replace();
        noteItem.querySelector('.delete-note').addEventListener('click', () => {
            noteItem.remove();
        });
        noteItem.querySelector('.edit-note').addEventListener('click', () => {
            const noteTitleElement = noteItem.querySelector('.note-title');
            const noteTextElement = noteItem.querySelector('.note-text');
            const currentTitle = noteTitleElement ? noteTitleElement.textContent : '';
            const currentText = noteTextElement.textContent;
            
            const editTitleInput = document.createElement('input');
            editTitleInput.type = 'text';
            editTitleInput.value = currentTitle;
            editTitleInput.placeholder = 'Title (optional)';
            editTitleInput.className = 'mb-2 px-2 py-1 border border-gray-300 rounded-lg w-full';
            
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = currentText;
            editInput.className = 'flex-grow px-2 py-1 border border-gray-300 rounded-lg w-full';

            const saveButton = document.createElement('button');
            saveButton.className = 'px-2 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition';
            saveButton.innerHTML = '<i data-feather="check" class="w-4 h-4"></i>';
            
            const cancelButton = document.createElement('button');
            cancelButton.className = 'px-2 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition';
            cancelButton.innerHTML = '<i data-feather="x" class="w-4 h-4"></i>';
            
            const editControls = document.createElement('div');
            editControls.className = 'flex gap-2';
            editControls.appendChild(saveButton);
            editControls.appendChild(cancelButton);
            const editContainer = document.createElement('div');
            editContainer.className = 'w-full';
            if (currentTitle) {
                editContainer.appendChild(editTitleInput);
            } else {
                editContainer.appendChild(editTitleInput);
            }
            editContainer.appendChild(editInput);
            editContainer.appendChild(editControls);
            
            noteItem.innerHTML = '';
            noteItem.appendChild(editContainer);
            feather.replace();
            
            editInput.focus();
            
            saveButton.addEventListener('click', () => {
                const newText = editInput.value.trim();
                if (newText) {
                    noteItem.innerHTML = `
                    ${editTitleInput.value ? <h3 class="note-title font-semibold text-lg mb-1">${editTitleInput.value}</h3> : ''}
                    <span class="note-text">${newText}</span>
                    <div class="flex justify-end gap-2">
                        <button class="edit-note text-blue-500 hover:text-blue-700">
                            <i data-feather="edit" class="w-4 h-4"></i>
                        </button>
                        <button class="delete-note text-red-500 hover:text-red-700">
                            <i data-feather="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                    `;
                    feather.replace();
                    noteItem.querySelector('.delete-note').addEventListener('click', () => {
                        noteItem.remove();
                    });
                    noteItem.querySelector('.edit-note').addEventListener('click', () => {
                        noteItem.querySelector('.edit-note').click();
                    });
                }
            });
            
            cancelButton.addEventListener('click', () => {
                noteItem.innerHTML = `
                    <span class="note-text">${currentText}</span>
                    <div class="flex justify-end gap-2">
                        <button class="edit-note text-blue-500 hover:text-blue-700">
                            <i data-feather="edit" class="w-4 h-4"></i>
                        </button>
                        <button class="delete-note text-red-500 hover:text-red-700">
                            <i data-feather="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                `;
                feather.replace();
                noteItem.querySelector('.delete-note').addEventListener('click', () => {
                    noteItem.remove();
                });
                noteItem.querySelector('.edit-note').addEventListener('click', () => {
                    noteItem.querySelector('.edit-note').click();
                });
            });
        });
    }

    // Event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    minutesInput.addEventListener('change', resetTimer);
    addNoteBtn.addEventListener('click', () => {
        addNote();
        document.getElementById('note-title-input').value = '';
        noteInput.value = '';
    });
    noteInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNote();
        }
    });

    // Initialize
    initTimer();
    
    // Level event listeners
    fullBtn.addEventListener('click', () => {
        toggleProgressDisplay();
        levelUp();
    });
});
