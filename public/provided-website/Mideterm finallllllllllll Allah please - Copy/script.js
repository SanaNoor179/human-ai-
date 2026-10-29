const TEST_DATA = [
    {
        "round": 1,
        "difficulty": "BEGINNER",
        "category": "WILDLIFE PHOTOGRAPHY \u2014 FOX",
        "image": "images/fox.jpg",
        "actualOrigin": "HUMAN",
        "actualLabel": "HUMAN MADE",
        "explanation": "Natural depth of field separates the fox from the dark woodland background. The fur, ground texture, and movement are captured with realistic photographic detail.",
        "pending": false
    },
    {
        "round": 2,
        "difficulty": "BEGINNER",
        "category": "WILDLIFE PHOTOGRAPHY \u2014 PANDA",
        "image": "images/panda.jpg",
        "actualOrigin": "AI",
        "actualLabel": "AI GENERATED",
        "explanation": "This AI-generated panda uses detailed black-and-white fur, soft daylight, a believable raised paw, and a dense bamboo background to resemble wildlife photography.",
        "pending": false
    },
    {
        "round": 3,
        "difficulty": "BEGINNER",
        "category": "PORTRAIT \u2014 AI",
        "image": "images/ai-portrait.jpg",
        "actualOrigin": "AI",
        "actualLabel": "AI GENERATED",
        "explanation": "The portrait uses smooth studio-style illumination and highly consistent facial texture, with polished transitions across the skin and background.",
        "pending": false
    },
    {
        "round": 4,
        "difficulty": "BEGINNER",
        "category": "PORTRAIT \u2014 PHOTOGRAPH",
        "image": "images/human-portrait.jpg",
        "actualOrigin": "HUMAN",
        "actualLabel": "HUMAN MADE",
        "explanation": "Natural skin pores, freckles, flyaway hairs, and subtle asymmetry are visible under soft, directional portrait lighting.",
        "pending": false
    },
    {
        "round": 5,
        "difficulty": "BEGINNER",
        "category": "FINE ART \u2014 AI STILL LIFE",
        "image": "images/ai-oil-painting.jpg",
        "actualOrigin": "AI",
        "actualLabel": "AI GENERATED",
        "explanation": "The fruit and leaves have glossy, highly controlled highlights, and the painterly texture appears unusually even across the composition.",
        "pending": false
    },
    {
        "round": 6,
        "difficulty": "INTERMEDIATE",
        "category": "FINE ART \u2014 OIL PAINTING",
        "image": "images/human-oil-painting.jpg",
        "actualOrigin": "HUMAN",
        "actualLabel": "HUMAN MADE",
        "explanation": "The fruit still life features varied brushwork, softly blended pigments, and small irregularities in the painted edges and cloth folds.",
        "pending": false
    },
    {
        "round": 7,
        "difficulty": "INTERMEDIATE",
        "category": "LANDSCAPE \u2014 FLORIDA LAKE",
        "image": "images/florida-lake.jpg",
        "actualOrigin": "HUMAN",
        "actualLabel": "HUMAN MADE",
        "explanation": "The sunset photograph shows atmospheric cloud layers, natural warm-to-cool color transitions, and reflections across the calm lake surface.",
        "pending": false
    },
    {
        "round": 8,
        "difficulty": "INTERMEDIATE",
        "category": "LANDSCAPE \u2014 AI MOUNTAIN LAKE",
        "image": "images/ai-lake.jpg",
        "actualOrigin": "AI",
        "actualLabel": "AI GENERATED",
        "explanation": "The mountain lake scene has exceptionally crisp details, even illumination, and a highly polished mirror-like reflection.",
        "pending": false
    },
    {
        "round": 9,
        "difficulty": "INTERMEDIATE",
        "category": "WILDLIFE \u2014 LIONS",
        "image": "images/lions.jpg",
        "actualOrigin": "HUMAN",
        "actualLabel": "HUMAN MADE",
        "explanation": "The two lions are captured with shallow depth of field, irregular fur detail, and soft natural light across the grass and rocks.",
        "pending": false
    },
    {
        "round": 10,
        "difficulty": "INTERMEDIATE",
        "category": "ARCHITECTURE \u2014 MODERN HOUSE",
        "image": "images/building-real.jpg",
        "actualOrigin": "HUMAN",
        "actualLabel": "HUMAN MADE",
        "explanation": "The photograph shows consistent building geometry, realistic glazing reflections, and natural daylight across the facade and landscaped garden.",
        "pending": false
    },
    {
        "round": 11,
        "difficulty": "ADVANCED",
        "category": "PRODUCT \u2014 PERFUME PHOTOGRAPHY",
        "image": "images/product-real.jpg",
        "actualOrigin": "HUMAN",
        "actualLabel": "HUMAN MADE",
        "explanation": "The perfume bottle is photographed with strong directional light, realistic refraction through the glass, and a defined shadow on the surface.",
        "pending": false
    },
    {
        "round": 12,
        "difficulty": "ADVANCED",
        "category": "PRODUCT \u2014 AI PERFUME",
        "image": "images/product-ai.jpg",
        "actualOrigin": "AI",
        "actualLabel": "AI GENERATED",
        "explanation": "The perfume composition has softly idealized lighting, smoothly arranged fabric, and polished reflections around the bottle and flowers.",
        "pending": false
    },
    {
        "round": 13,
        "difficulty": "ADVANCED",
        "category": "AUTOMOTIVE \u2014 VINTAGE CAR",
        "image": "images/car-ai.png",
        "actualOrigin": "AI",
        "actualLabel": "AI GENERATED",
        "explanation": "The image combines bright outdoor light with a cinematic crop, detailed paintwork, and dramatic water spray around the rear wheel. The reflections and suspended droplets give the AI-generated scene a convincing sense of motion.",
        "pending": false
    },
    {
        "round": 14,
        "difficulty": "ADVANCED",
        "category": "FASHION \u2014 DENIM PORTRAIT",
        "image": "images/man-ai.jpg",
        "actualOrigin": "AI",
        "actualLabel": "AI GENERATED",
        "explanation": "Strong direct sunlight creates deep shadows in the denim folds, while the low camera angle and open blue sky produce a candid editorial look. The AI-generated image has lifelike fabric texture and dynamic movement.",
        "pending": false
    },
    {
        "round": 15,
        "difficulty": "ADVANCED",
        "category": "WILDLIFE — CAT PORTRAIT",
        "image": "images/cat-ai.webp",
        "actualOrigin": "AI",
        "actualLabel": "AI GENERATED",
        "explanation": "Soft daylight streams through the window, creating believable highlights on the cat’s fur and subtle shadows across the cushion. The detailed calico markings, warm indoor textures, and softly focused garden give this AI-generated image a natural, candid photographic feel.",
        "pending": false
    }
];

        const FACTORS = ["Visual Quality", "Originality", "Authenticity", "Effort", "Style", "Micro-Details", "Texture/Grain", "Lighting"];

        let currentRoundIndex = 0;
        let userResponses = [];

        function handleImageError(img) {
            img.onerror = null; // Prevent infinite loop
            img.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><rect width='800' height='600' fill='%23E2E8F0'/><text x='50%' y='48%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%2364748B'>[ VISUAL ARTWORK ]</text><text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2394A3B8'>Inspect details to evaluate human vs AI origin</text></svg>";
        }

        function navigateTo(screenId) {
            document.querySelectorAll('main > section').forEach(sec => sec.classList.add('hidden'));
            const target = document.getElementById(`screen-${screenId}`);
            if (target) {
                target.classList.remove('hidden');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }

        function scrollToAbout() {
            navigateTo('about');
        }

        function startTest() {
            currentRoundIndex = 0;
            userResponses = [];
            loadGuessRound();
            navigateTo('guess');
        }

        function restartTest() {
            startTest();
        }

        function loadGuessRound() {
            const data = TEST_DATA[currentRoundIndex];
            const roundNum = String(data.round).padStart(2, '0');

            document.getElementById('guess-round-label').innerText = `ROUND ${roundNum} / ${TEST_DATA.length}`;
            document.getElementById('guess-difficulty-badge').innerText = `DIFFICULTY: ${data.difficulty}`;
            document.getElementById('pending-round-notice').classList.toggle('hidden', !data.pending);
            document.getElementById('provisional-round-notice').classList.toggle('hidden', !data.provisional);
const imgEl = document.getElementById('guess-image');
            imgEl.onerror = function() { handleImageError(this); };
            imgEl.src = data.image;

            const progressPct = Math.round(((currentRoundIndex + 1) / TEST_DATA.length) * 100);
            document.getElementById('progress-percent-text').innerText = `${progressPct}%`;
            document.getElementById('progress-bar-fill').style.width = `${progressPct}%`;
        }

        function submitGuess(userChoice) {
            const data = TEST_DATA[currentRoundIndex];
            if (data.pending) { alert("This image has not been uploaded yet. Please add the image to continue this round."); return; }
            const isCorrect = (userChoice === data.actualOrigin);

            userResponses[currentRoundIndex] = {
                round: data.round,
                difficulty: data.difficulty,
                guess: userChoice,
                actual: data.actualOrigin,
                isCorrect: isCorrect,
                factors: []
            };

            loadRevealScreen(userChoice, isCorrect);
            navigateTo('reveal');
        }

        function loadRevealScreen(userChoice, isCorrect) {
            const data = TEST_DATA[currentRoundIndex];
            const roundNum = String(data.round).padStart(2, '0');

            document.getElementById('reveal-round-label').innerText = `ROUND ${roundNum} REVEAL (${data.difficulty})`;
            
            const imgEl = document.getElementById('reveal-image');
            imgEl.onerror = function() { handleImageError(this); };
            imgEl.src = data.image;

            document.getElementById('reveal-actual-type').innerText = data.actualLabel;
            document.getElementById('reveal-user-guess').innerText = userChoice === 'HUMAN' ? 'HUMAN MADE' : 'AI GENERATED';
            document.getElementById('reveal-explanation').innerText = data.explanation;

            const badge = document.getElementById('reveal-status-badge');
            if (isCorrect) {
                badge.innerText = "YOUR GUESS: CORRECT";
                badge.className = "px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-correctBg text-correctText border border-correctText/20";
            } else {
                badge.innerText = "YOUR GUESS: INCORRECT";
                badge.className = "px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-incorrectBg text-incorrectText border border-incorrectText/20";
            }

            const nextBtnText = document.getElementById('next-button-text');
            nextBtnText.innerText = (currentRoundIndex === TEST_DATA.length - 1) ? "View Final Results →" : "Next Round →";

            const tagsContainer = document.getElementById('factor-tags-container');
            tagsContainer.innerHTML = '';

            FACTORS.forEach(factor => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = "px-3 py-1.5 rounded-lg border border-line bg-white text-xs text-dark hover:border-dark smooth-transition cursor-pointer";
                btn.innerText = factor;
                btn.onclick = () => toggleFactorTag(btn, factor);
                tagsContainer.appendChild(btn);
            });
        }

        function toggleFactorTag(btnElement, factorName) {
            const currentFactors = userResponses[currentRoundIndex].factors;
            const index = currentFactors.indexOf(factorName);

            if (index > -1) {
                currentFactors.splice(index, 1);
                btnElement.classList.remove('bg-dark', 'text-white', 'border-dark');
                btnElement.classList.add('bg-white', 'text-dark', 'border-line');
            } else {
                currentFactors.push(factorName);
                btnElement.classList.add('bg-dark', 'text-white', 'border-dark');
                btnElement.classList.remove('bg-white', 'text-dark', 'border-line');
            }
        }

        function nextRound() {
            if (currentRoundIndex < TEST_DATA.length - 1) {
                currentRoundIndex++;
                loadGuessRound();
                navigateTo('guess');
            } else {
                calculateAndShowResults();
                navigateTo('results');
            }
        }

        function calculateAndShowResults() {
            const total = userResponses.length;
            const correctCount = userResponses.filter(r => r.isCorrect).length;
            const answeredCount = userResponses.filter(r => !r.skipped).length;

            document.getElementById('results-score-number').innerText = `${correctCount} / ${answeredCount}`;
            document.getElementById('results-score-text').innerText = `You correctly identified ${correctCount} out of ${total} creative pieces.`;

            const tiers = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT / MASTER"];
            const tierListContainer = document.getElementById('tier-breakdown-list');
            tierListContainer.innerHTML = '';

            tiers.forEach(tier => {
                const tierItems = userResponses.filter(r => !r.skipped && r.difficulty === tier);
                const tierCorrect = tierItems.filter(r => r.isCorrect).length;
                const tierPct = tierItems.length ? Math.round((tierCorrect / tierItems.length) * 100) : 0;

                const item = document.createElement('div');
                item.className = "space-y-1";
                item.innerHTML = `
                    <div class="flex justify-between text-xs font-medium">
                        <span>${tier}</span>
                        <span>${tierPct}% (${tierCorrect}/${tierItems.length})</span>
                    </div>
                    <div class="w-full bg-offwhite h-2.5 rounded-full overflow-hidden border border-line">
                        <div class="bg-dark h-full smooth-transition" style="width: ${tierPct}%"></div>
                    </div>
                `;
                tierListContainer.appendChild(item);
            });

            const humanItems = userResponses.filter(r => !r.skipped && r.actual === 'HUMAN');
            const humanCorrect = humanItems.filter(r => r.isCorrect).length;
            const humanPct = humanItems.length ? Math.round((humanCorrect / humanItems.length) * 100) : 0;

            const aiItems = userResponses.filter(r => !r.skipped && r.actual === 'AI');
            const aiCorrect = aiItems.filter(r => r.isCorrect).length;
            const aiPct = aiItems.length ? Math.round((aiCorrect / aiItems.length) * 100) : 0;

            document.getElementById('human-acc-text').innerText = `${humanPct}% (${humanCorrect}/${humanItems.length})`;
            document.getElementById('human-acc-bar').style.width = `${humanPct}%`;

            document.getElementById('ai-acc-text').innerText = `${aiPct}% (${aiCorrect}/${aiItems.length})`;
            document.getElementById('ai-acc-bar').style.width = `${aiPct}%`;

            const factorCounts = {};
            FACTORS.forEach(f => factorCounts[f] = 0);

            userResponses.forEach(r => {
                r.factors.forEach(f => {
                    if (factorCounts[f] !== undefined) factorCounts[f]++;
                });
            });

            const factorsList = document.getElementById('factors-breakdown-list');
            factorsList.innerHTML = '';

            FACTORS.forEach(factor => {
                const count = factorCounts[factor];
                const pct = answeredCount ? Math.round((count / answeredCount) * 100) : 0;

                const item = document.createElement('div');
                item.className = "space-y-1";
                item.innerHTML = `
                    <div class="flex justify-between text-xs font-medium">
                        <span>${factor}</span>
                        <span class="text-muted">${pct}%</span>
                    </div>
                    <div class="w-full bg-offwhite h-2 rounded-full overflow-hidden border border-line">
                        <div class="bg-accent h-full smooth-transition" style="width: ${pct}%"></div>
                    </div>
                `;
                factorsList.appendChild(item);
            });
        }

        function handleContactSubmit(event) {
            event.preventDefault();
            const successMsg = document.getElementById('contact-success');
            successMsg.classList.remove('hidden');
            event.target.reset();
            setTimeout(() => {
                successMsg.classList.add('hidden');
            }, 4000);
        }

        window.navigateTo = navigateTo;
        window.scrollToAbout = scrollToAbout;
        window.startTest = startTest;
        window.restartTest = restartTest;
        window.submitGuess = submitGuess;
        window.nextRound = nextRound;
        window.handleContactSubmit = handleContactSubmit;

        window.onload = function() {
            navigateTo('home');
        };

function skipPendingRound() {
    const data = TEST_DATA[currentRoundIndex];
    if (!data.pending) return;
    userResponses[currentRoundIndex] = { round: data.round, difficulty: data.difficulty, guess: null, actual: data.actualOrigin, isCorrect: false, factors: [], skipped: true };
    if (currentRoundIndex < TEST_DATA.length - 1) { currentRoundIndex++; loadGuessRound(); navigateTo('guess'); }
    else { calculateAndShowResults(); navigateTo('results'); }
}

function openImageFullscreen(imageId) {
    const image = document.getElementById(imageId);
    if (!image || !image.src) return;
    const viewer = document.getElementById('image-fullscreen-viewer');
    const full = document.getElementById('fullscreen-image');
    full.src = image.src; full.alt = image.alt || 'Quiz image';
    viewer.classList.remove('hidden'); viewer.classList.add('flex');
    document.body.style.overflow = 'hidden';
    document.getElementById('close-fullscreen').focus();
}
function closeImageFullscreen() {
    const viewer = document.getElementById('image-fullscreen-viewer');
    viewer.classList.add('hidden'); viewer.classList.remove('flex');
    document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeImageFullscreen(); });
