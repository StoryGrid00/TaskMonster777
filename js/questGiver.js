// ===================================
// QUEST GIVER SYSTEM
// NPC Bird that gives quests and quizzes
// ===================================

class QuestGiver {
    constructor() {
        this.questDatabase = this.initializeQuests();
        this.quizDatabase = this.initializeQuizzes();
        this.activeQuest = null;
        this.lastQuestTime = null;
        this.questCooldown = 3600000; // 1 hour in milliseconds
        this.questHeroAnimationInterval = null;
        this.questCrowAnimationInterval = null;
    }

    // Initialize quest database
    initializeQuests() {
        return [
            // Physical/Exercise Quests
            { id: 'q1', text: 'Do 10 jumping jacks', category: 'Exercise', difficulty: 'Easy', xp: 15, duration: 24 },
            { id: 'q2', text: 'Take a 10-minute walk outside', category: 'Exercise', difficulty: 'Easy', xp: 20, duration: 24 },
            { id: 'q3', text: 'Stretch for 5 minutes', category: 'Exercise', difficulty: 'Easy', xp: 10, duration: 24 },
            { id: 'q4', text: 'Do 15 push-ups (or modified push-ups)', category: 'Exercise', difficulty: 'Medium', xp: 25, duration: 24 },
            { id: 'q5', text: 'Hold a plank for 30 seconds', category: 'Exercise', difficulty: 'Medium', xp: 20, duration: 24 },
            
            // Creative Quests
            { id: 'q6', text: 'Draw or doodle for 10 minutes', category: 'Creative', difficulty: 'Easy', xp: 15, duration: 48 },
            { id: 'q7', text: 'Write a short poem or haiku', category: 'Creative', difficulty: 'Medium', xp: 25, duration: 48 },
            { id: 'q8', text: 'Take 5 creative photos', category: 'Creative', difficulty: 'Easy', xp: 20, duration: 48 },
            { id: 'q9', text: 'Create a playlist of 10 songs', category: 'Creative', difficulty: 'Easy', xp: 15, duration: 48 },
            { id: 'q10', text: 'Build something with household items', category: 'Creative', difficulty: 'Medium', xp: 30, duration: 48 },
            
            // Learning Quests
            { id: 'q11', text: 'Learn 5 new words in another language', category: 'Learning', difficulty: 'Medium', xp: 25, duration: 48 },
            { id: 'q12', text: 'Read for 20 minutes', category: 'Learning', difficulty: 'Easy', xp: 20, duration: 24 },
            { id: 'q13', text: 'Watch an educational video', category: 'Learning', difficulty: 'Easy', xp: 15, duration: 24 },
            { id: 'q14', text: 'Practice a musical instrument for 15 minutes', category: 'Learning', difficulty: 'Medium', xp: 25, duration: 24 },
            { id: 'q15', text: 'Solve 5 math or logic puzzles', category: 'Learning', difficulty: 'Medium', xp: 30, duration: 48 },
            
            // Social/Kindness Quests
            { id: 'q16', text: 'Call or message a friend you haven\'t talked to in a while', category: 'Social', difficulty: 'Easy', xp: 20, duration: 48 },
            { id: 'q17', text: 'Give someone a genuine compliment', category: 'Social', difficulty: 'Easy', xp: 15, duration: 24 },
            { id: 'q18', text: 'Help someone with a task', category: 'Social', difficulty: 'Medium', xp: 25, duration: 48 },
            { id: 'q19', text: 'Write a thank you note to someone', category: 'Social', difficulty: 'Medium', xp: 25, duration: 48 },
            { id: 'q20', text: 'Share something you learned today', category: 'Social', difficulty: 'Easy', xp: 15, duration: 24 },
            
            // Self-Care Quests
            { id: 'q21', text: 'Drink 8 glasses of water today', category: 'Self-Care', difficulty: 'Easy', xp: 15, duration: 24 },
            { id: 'q22', text: 'Meditate or practice deep breathing for 5 minutes', category: 'Self-Care', difficulty: 'Easy', xp: 20, duration: 24 },
            { id: 'q23', text: 'Organize one small area of your space', category: 'Self-Care', difficulty: 'Medium', xp: 25, duration: 48 },
            { id: 'q24', text: 'Go to bed 30 minutes earlier tonight', category: 'Self-Care', difficulty: 'Medium', xp: 20, duration: 24 },
            { id: 'q25', text: 'Spend 10 minutes in nature', category: 'Self-Care', difficulty: 'Easy', xp: 20, duration: 24 },
            
            // Fun/Adventure Quests
            { id: 'q26', text: 'Try a new recipe or food', category: 'Adventure', difficulty: 'Medium', xp: 25, duration: 48 },
            { id: 'q27', text: 'Explore a new place in your neighborhood', category: 'Adventure', difficulty: 'Medium', xp: 30, duration: 48 },
            { id: 'q28', text: 'Learn a new skill from a YouTube tutorial', category: 'Adventure', difficulty: 'Medium', xp: 30, duration: 72 },
            { id: 'q29', text: 'Play a board game or card game', category: 'Adventure', difficulty: 'Easy', xp: 15, duration: 24 },
            { id: 'q30', text: 'Start a new hobby project', category: 'Adventure', difficulty: 'Hard', xp: 40, duration: 72 },
            
            // Productivity Quests
            { id: 'q31', text: 'Make a to-do list for tomorrow', category: 'Productivity', difficulty: 'Easy', xp: 10, duration: 24 },
            { id: 'q32', text: 'Complete one task you\'ve been putting off', category: 'Productivity', difficulty: 'Medium', xp: 30, duration: 48 },
            { id: 'q33', text: 'Spend 15 minutes decluttering', category: 'Productivity', difficulty: 'Easy', xp: 20, duration: 24 },
            { id: 'q34', text: 'Review and update your goals', category: 'Productivity', difficulty: 'Medium', xp: 25, duration: 48 },
            { id: 'q35', text: 'Plan your meals for the next 3 days', category: 'Productivity', difficulty: 'Medium', xp: 25, duration: 48 }
        ];
    }

    // Initialize quiz database
    initializeQuizzes() {
        return [
            // Science Facts
            { id: 'quiz1', question: 'What is the largest planet in our solar system?', options: ['Earth', 'Jupiter', 'Saturn', 'Mars'], correct: 1, xpReward: 15, xpPenalty: 10 },
            { id: 'quiz2', question: 'How many bones does an adult human have?', options: ['186', '206', '226', '246'], correct: 1, xpReward: 15, xpPenalty: 10 },
            { id: 'quiz3', question: 'What is the speed of light?', options: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '600,000 km/s'], correct: 0, xpReward: 20, xpPenalty: 10 },
            { id: 'quiz4', question: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correct: 2, xpReward: 15, xpPenalty: 10 },
            { id: 'quiz5', question: 'How long does it take for light from the Sun to reach Earth?', options: ['8 seconds', '8 minutes', '8 hours', '8 days'], correct: 1, xpReward: 20, xpPenalty: 10 },
            
            // Geography Facts
            { id: 'quiz6', question: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], correct: 2, xpReward: 15, xpPenalty: 10 },
            { id: 'quiz7', question: 'Which ocean is the largest?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correct: 3, xpReward: 10, xpPenalty: 5 },
            { id: 'quiz8', question: 'How many continents are there?', options: ['5', '6', '7', '8'], correct: 2, xpReward: 10, xpPenalty: 5 },
            { id: 'quiz9', question: 'What is the longest river in the world?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], correct: 1, xpReward: 15, xpPenalty: 10 },
            { id: 'quiz10', question: 'Which country has the most time zones?', options: ['USA', 'Russia', 'China', 'France'], correct: 3, xpReward: 20, xpPenalty: 10 },
            
            // History Facts
            { id: 'quiz11', question: 'In what year did World War II end?', options: ['1943', '1944', '1945', '1946'], correct: 2, xpReward: 15, xpPenalty: 10 },
            { id: 'quiz12', question: 'Who painted the Mona Lisa?', options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'], correct: 1, xpReward: 10, xpPenalty: 5 },
            { id: 'quiz13', question: 'What year did the first iPhone release?', options: ['2005', '2006', '2007', '2008'], correct: 2, xpReward: 15, xpPenalty: 10 },
            { id: 'quiz14', question: 'Who was the first person to walk on the moon?', options: ['Buzz Aldrin', 'Neil Armstrong', 'Yuri Gagarin', 'John Glenn'], correct: 1, xpReward: 10, xpPenalty: 5 },
            { id: 'quiz15', question: 'In what year did the Berlin Wall fall?', options: ['1987', '1988', '1989', '1990'], correct: 2, xpReward: 15, xpPenalty: 10 },
            
            // Animal Facts
            { id: 'quiz16', question: 'What is the fastest land animal?', options: ['Lion', 'Cheetah', 'Leopard', 'Gazelle'], correct: 1, xpReward: 10, xpPenalty: 5 },
            { id: 'quiz17', question: 'How many hearts does an octopus have?', options: ['1', '2', '3', '4'], correct: 2, xpReward: 20, xpPenalty: 10 },
            { id: 'quiz18', question: 'What is the largest mammal?', options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'], correct: 1, xpReward: 10, xpPenalty: 5 },
            { id: 'quiz19', question: 'How long can a snail sleep?', options: ['1 week', '1 month', '3 months', '3 years'], correct: 3, xpReward: 25, xpPenalty: 15 },
            { id: 'quiz20', question: 'What animal can hold its breath the longest?', options: ['Whale', 'Dolphin', 'Sea Turtle', 'Cuvier\'s Beaked Whale'], correct: 3, xpReward: 25, xpPenalty: 15 },
            
            // General Knowledge
            { id: 'quiz21', question: 'How many days are in a leap year?', options: ['364', '365', '366', '367'], correct: 2, xpReward: 10, xpPenalty: 5 },
            { id: 'quiz22', question: 'What is the smallest country in the world?', options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'], correct: 1, xpReward: 15, xpPenalty: 10 },
            { id: 'quiz23', question: 'How many strings does a standard guitar have?', options: ['4', '5', '6', '7'], correct: 2, xpReward: 10, xpPenalty: 5 },
            { id: 'quiz24', question: 'What is the hardest natural substance on Earth?', options: ['Gold', 'Iron', 'Diamond', 'Titanium'], correct: 2, xpReward: 15, xpPenalty: 10 },
            { id: 'quiz25', question: 'How many colors are in a rainbow?', options: ['5', '6', '7', '8'], correct: 2, xpReward: 10, xpPenalty: 5 }
        ];
    }

    // Check if quest giver should appear
    shouldAppear() {
        if (!this.lastQuestTime) {
            return true; // First time
        }
        const timeSinceLastQuest = Date.now() - this.lastQuestTime;
        return timeSinceLastQuest >= this.questCooldown;
    }

    // Get random quest
    getRandomQuest() {
        const randomIndex = Math.floor(Math.random() * this.questDatabase.length);
        const quest = { ...this.questDatabase[randomIndex] };
        quest.deadline = Date.now() + (quest.duration * 3600000); // Convert hours to milliseconds
        quest.type = 'quest';
        return quest;
    }

    // Get random quiz
    getRandomQuiz() {
        const randomIndex = Math.floor(Math.random() * this.quizDatabase.length);
        return { ...this.quizDatabase[randomIndex], type: 'quiz' };
    }

    // Randomly choose between quest or quiz
    getRandomEncounter() {
        const isQuiz = Math.random() < 0.3; // 30% chance of quiz, 70% chance of quest
        return isQuiz ? this.getRandomQuiz() : this.getRandomQuest();
    }

    // Show quest giver UI
    show() {
        this.lastQuestTime = Date.now();
        const encounter = this.getRandomEncounter();
        this.activeQuest = encounter;
        
        const questGiverUI = document.getElementById('questGiverUI');
        if (!questGiverUI) {
            console.error('Quest Giver UI not found');
            return;
        }

        // Update UI based on type
        if (encounter.type === 'quest') {
            this.showQuestUI(encounter);
        } else {
            this.showQuizUI(encounter);
        }

        // Initialize sprite animations
        this.initCrowSprite();

        questGiverUI.classList.remove('hidden');
    }

    // Show quest UI
    showQuestUI(quest) {
        const dialogueText = document.getElementById('questDialogue');
        const questActions = document.getElementById('questActions');
        const quizActions = document.getElementById('quizActions');

        // Wise, sage-like introductions
        const wiseSayings = [
            "Greetings, young traveler. I bring you a challenge worthy of your spirit.",
            "Ah, I see potential in you. Perhaps you are ready for this task.",
            "The forest whispers of your deeds. Will you accept another?",
            "Time flows like a river, and I have a quest that calls to you.",
            "Wisdom comes through action. I offer you this opportunity.",
            "The path to growth is paved with challenges. Here is yours."
        ];
        const randomSaying = wiseSayings[Math.floor(Math.random() * wiseSayings.length)];

        dialogueText.innerHTML = `
            <p class="quest-dialogue-text">"${randomSaying}"</p>
            <p class="quest-title">📜 Quest</p>
            <p class="quest-description">${quest.text}</p>
            <p class="quest-details">
                <span class="quest-category">${quest.category}</span>
                <span class="quest-difficulty">${quest.difficulty}</span>
            </p>
            <p class="quest-reward">⭐ Reward: ${quest.xp} XP</p>
            <p class="quest-deadline">⏰ Complete within ${quest.duration} hours</p>
        `;

        questActions.classList.remove('hidden');
        quizActions.classList.add('hidden');
    }

    // Show quiz UI
    showQuizUI(quiz) {
        const dialogueText = document.getElementById('questDialogue');
        const questActions = document.getElementById('questActions');
        const quizActions = document.getElementById('quizActions');

        // Wise quiz introductions
        const quizIntros = [
            "Test your knowledge, young one. Wisdom is earned through learning.",
            "The mind must be sharp as well as the spirit. Answer this riddle.",
            "Knowledge is power, they say. Let us see what you know.",
            "I have traveled far and learned much. Can you answer this?",
            "A curious mind is a growing mind. Ponder this question."
        ];
        const randomIntro = quizIntros[Math.floor(Math.random() * quizIntros.length)];

        dialogueText.innerHTML = `
            <p class="quest-dialogue-text">"${randomIntro}"</p>
            <p class="quest-title">🧠 Trivia Challenge</p>
            <p class="quiz-question">${quiz.question}</p>
        `;

        // Create quiz options
        const quizOptions = document.getElementById('quizOptions');
        quizOptions.innerHTML = '';
        quiz.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.textContent = option;
            button.onclick = () => this.answerQuiz(index);
            quizOptions.appendChild(button);
        });
        
        // Add pass button
        const passButton = document.createElement('button');
        passButton.className = 'quiz-pass-btn';
        passButton.textContent = 'Pass';
        passButton.onclick = () => this.passQuiz();
        quizOptions.appendChild(passButton);

        questActions.classList.add('hidden');
        quizActions.classList.remove('hidden');
    }

    // Accept quest
    acceptQuest() {
        if (!this.activeQuest || this.activeQuest.type !== 'quest') return;

        // Add quest to quest task manager (separate from regular tasks)
        if (window.questTaskManager) {
            window.questTaskManager.addQuestTask(this.activeQuest);
        } else {
            console.error('Quest Task Manager not found');
        }
        
        // Show confirmation
        const questName = this.activeQuest.text;
        const hours = this.activeQuest.duration;
        if (typeof showMessage === 'function') {
            showMessage(`✅ Quest accepted! "${questName}" - Complete within ${hours} hours for ${this.activeQuest.xp} XP!`);
        } else {
            alert(`✅ Quest accepted! "${questName}" - Complete within ${hours} hours for ${this.activeQuest.xp} XP!`);
        }

        this.close();
    }

    // Decline quest
    declineQuest() {
        this.close();
        alert('Quest declined. The crow flies away...');
    }

    // Answer quiz
    answerQuiz(selectedIndex) {
        if (!this.activeQuest || this.activeQuest.type !== 'quiz') return;

        const isCorrect = selectedIndex === this.activeQuest.correct;
        
        if (isCorrect) {
            // Award XP using the proper function
            if (!window.gameState) {
                console.error('window.gameState not found!');
                alert('⚠️ Error: Game not fully loaded. Please try again.');
                this.close();
                return;
            }
            
            if (typeof window.addJerryXP === 'function') {
                window.addJerryXP(this.activeQuest.xpReward);
                console.log(`Quiz correct! Added ${this.activeQuest.xpReward} XP. Total: ${window.gameState.jerryXP}`);
                
                if (typeof window.saveGameState === 'function') {
                    window.saveGameState();
                }
                
                if (typeof window.updateUI === 'function') {
                    window.updateUI();
                }
            } else {
                console.error('addJerryXP function not found');
            }
            alert(`✅ Correct! +${this.activeQuest.xpReward} XP`);
        } else {
            // Deduct XP
            if (!window.gameState) {
                console.error('window.gameState not found!');
                alert('⚠️ Error: Game not fully loaded. Please try again.');
                this.close();
                return;
            }
            
            const oldXP = window.gameState.jerryXP || 0;
            window.gameState.jerryXP = Math.max(0, oldXP - this.activeQuest.xpPenalty);
            console.log(`Quiz wrong! Deducted ${this.activeQuest.xpPenalty} XP. Total: ${window.gameState.jerryXP}`);
            
            if (typeof window.saveGameState === 'function') {
                window.saveGameState();
            }
            
            if (typeof window.updateUI === 'function') {
                window.updateUI();
            }
            
            const correctAnswer = this.activeQuest.options[this.activeQuest.correct];
            alert(`❌ Wrong! The correct answer was: ${correctAnswer}. -${this.activeQuest.xpPenalty} XP`);
        }

        this.close();
    }

    // Pass quiz (decline to answer)
    passQuiz() {
        this.close();
        if (typeof showMessage === 'function') {
            showMessage('Quiz declined. The crow flies away...');
        } else {
            alert('Quiz declined. The crow flies away...');
        }
    }

    // Update hero sprite to use selected monster with animation
    updateHeroSprite() {
        const heroSprite = document.getElementById('questHeroSprite');
        const heroSpritePrefix = localStorage.getItem('heroSpritePrefix') || 'Pink_Monster';
        
        if (heroSprite) {
            // Use 4-frame idle animation sprite sheet
            const spriteSheetPath = `assets/heroes/${heroSpritePrefix}_Idle_4.png`;
            heroSprite.style.backgroundImage = `url('${spriteSheetPath}')`;
            heroSprite.style.backgroundSize = '128px 32px'; // 4 frames × 32px = 128px width
            
            // Animate through 4 frames
            let currentFrame = 0;
            const frameWidth = 32;
            const totalFrames = 4;
            
            // Clear any existing animation interval
            if (this.questHeroAnimationInterval) {
                clearInterval(this.questHeroAnimationInterval);
            }
            
            // Start frame animation
            this.questHeroAnimationInterval = setInterval(() => {
                currentFrame = (currentFrame + 1) % totalFrames;
                const xPos = -(currentFrame * frameWidth);
                heroSprite.style.backgroundPosition = `${xPos}px 0`;
            }, 200); // 200ms per frame = 5 FPS
        }
    }

    // Initialize crow sprite animation
    initCrowSprite() {
        const crowSprite = document.getElementById('questCrowSprite');
        
        if (crowSprite) {
            // Use 3-frame idle animation sprite sheet
            const spriteSheetPath = 'assets/quest-giver/crow-idle.png';
            crowSprite.style.backgroundImage = `url('${spriteSheetPath}')`;
            crowSprite.style.backgroundSize = '144px 48px'; // 3 frames × 48px = 144px width
            
            // Animate through 3 frames
            let currentFrame = 0;
            const frameWidth = 48;
            const totalFrames = 3;
            
            // Clear any existing animation interval
            if (this.questCrowAnimationInterval) {
                clearInterval(this.questCrowAnimationInterval);
            }
            
            // Start frame animation
            this.questCrowAnimationInterval = setInterval(() => {
                currentFrame = (currentFrame + 1) % totalFrames;
                const xPos = -(currentFrame * frameWidth);
                crowSprite.style.backgroundPosition = `${xPos}px 0`;
            }, 250); // 250ms per frame
        }
    }

    // Close quest giver UI
    close() {
        // Clear animation intervals
        if (this.questHeroAnimationInterval) {
            clearInterval(this.questHeroAnimationInterval);
            this.questHeroAnimationInterval = null;
        }
        if (this.questCrowAnimationInterval) {
            clearInterval(this.questCrowAnimationInterval);
            this.questCrowAnimationInterval = null;
        }
        
        const questGiverUI = document.getElementById('questGiverUI');
        if (questGiverUI) {
            questGiverUI.classList.add('hidden');
        }
        this.activeQuest = null;
    }
}

// Initialize quest giver
window.questGiver = new QuestGiver();

// Check for expired quests
function checkExpiredQuests() {
    if (!window.gameState || !window.gameState.tasks) return;

    const now = Date.now();
    const expiredQuests = window.gameState.tasks.filter(task => 
        task.isQuest && task.questDeadline && task.questDeadline < now && !task.completed
    );

    expiredQuests.forEach(quest => {
        // Deduct XP penalty
        if (window.gameState) {
            window.gameState.jerryXP = Math.max(0, (window.gameState.jerryXP || 0) - quest.questPenalty);
            console.log(`Quest expired! Deducted ${quest.questPenalty} XP`);
        }
        
        // Remove quest from tasks
        const index = window.gameState.tasks.indexOf(quest);
        if (index > -1) {
            window.gameState.tasks.splice(index, 1);
        }

        showMessage(`⏰ Quest expired: "${quest.text}". -${quest.questPenalty} XP`);
    });

    if (expiredQuests.length > 0) {
        saveGameState();
        updateTaskDisplay();
        updateUI();
    }
}

// Check for expired quests every minute
setInterval(checkExpiredQuests, 60000);

// Trigger quest giver twice daily
function triggerQuestGiver() {
    if (window.questGiver && window.questGiver.shouldAppear()) {
        window.questGiver.show();
    }
}

// Check every 30 minutes to see if it's time
setInterval(triggerQuestGiver, 1800000);

// Also check on page load (after a delay)
setTimeout(() => {
    if (window.questGiver && window.questGiver.shouldAppear()) {
        window.questGiver.show();
    }
}, 5000);

