/* ==========================================
   PROMPTVERSE AI
   COMPLETE SCRIPT.JS - PART 1
   CORE ENGINE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================
       DOM ELEMENTS
    ========================== */

    const body = document.body;

    const themeToggle =
        document.getElementById("themeToggle");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const navLinks =
        document.querySelector(".nav-links");

    const taskType =
        document.getElementById("taskType");

    const toneSelect =
        document.getElementById("toneSelect");

    const topicInput =
        document.getElementById("topicInput");

    const promptTechnique =
        document.getElementById("promptTechnique");

    const creativitySlider =
        document.getElementById("creativitySlider");

    const detailSlider =
        document.getElementById("detailSlider");

    const lengthSlider =
        document.getElementById("lengthSlider");

    const creativityValue =
        document.getElementById("creativityValue");

    const detailValue =
        document.getElementById("detailValue");

    const lengthValue =
        document.getElementById("lengthValue");

    const livePromptPreview =
        document.getElementById("livePromptPreview");

    const addExampleBtn =
        document.getElementById("addExampleBtn");

    const examplesContainer =
        document.getElementById("examplesContainer");

    const copyPrompt =
        document.getElementById("copyPrompt");

    const clearPrompt =
        document.getElementById("clearPrompt");

    const personaCards =
        document.querySelectorAll(".persona-card");

    /* ==========================
       APP STATE
    ========================== */

    let selectedPersona = "Founder";

    let typingInterval = null;

    /* ==========================
       THEME SYSTEM
    ========================== */

    function loadTheme() {

        const savedTheme =
            localStorage.getItem("pv-theme");

        if (savedTheme === "light") {

            body.classList.add("light-mode");

        }

    }

    function toggleTheme() {

        body.classList.toggle("light-mode");

        localStorage.setItem(
            "pv-theme",
            body.classList.contains("light-mode")
                ? "light"
                : "dark"
        );

    }

    themeToggle?.addEventListener(
        "click",
        toggleTheme
    );

    loadTheme();

    /* ==========================
       MOBILE MENU
    ========================== */

    mobileMenuBtn?.addEventListener(
        "click",
        () => {

            navLinks?.classList.toggle(
                "show"
            );

        }
    );

    /* ==========================
       PERSONA ENGINE
    ========================== */

    personaCards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                personaCards.forEach(item => {

                    item.classList.remove(
                        "active-persona"
                    );

                });

                card.classList.add(
                    "active-persona"
                );

                selectedPersona =
                    card.dataset.persona;

                generatePrompt();

                if (
                    typeof updatePromptScore ===
                    "function"
                ) {

                    updatePromptScore();

                }

            }
        );

    });

    /* ==========================
       SLIDER SYSTEM
    ========================== */

    function updateSliderLabels() {

        creativityValue.textContent =
            creativitySlider.value;

        detailValue.textContent =
            detailSlider.value;

        lengthValue.textContent =
            lengthSlider.value;

    }

    [
        creativitySlider,
        detailSlider,
        lengthSlider
    ].forEach(slider => {

        slider?.addEventListener(
            "input",
            () => {

                updateSliderLabels();

                generatePrompt();

            }
        );

    });

    updateSliderLabels();

    /* ==========================
       FEW SHOT EXAMPLES
    ========================== */

    function collectExamples() {

        let output = "";

        const cards =
            document.querySelectorAll(
                ".example-card"
            );

        cards.forEach((card, index) => {

            const input =
                card.querySelector("input");

            const response =
                card.querySelector(
                    "textarea"
                );

            if (
                input?.value.trim() ||
                response?.value.trim()
            ) {

                output += `

Example ${index + 1}

Input:
${input.value}

Output:
${response.value}

`;

            }

        });

        return output;

    }

    function attachRemoveEvents() {

        document
            .querySelectorAll(
                ".remove-example"
            )
            .forEach(button => {

                button.onclick = () => {

                    const cards =
                        document.querySelectorAll(
                            ".example-card"
                        );

                    if (
                        cards.length === 1
                    ) return;

                    button
                        .closest(
                            ".example-card"
                        )
                        ?.remove();

                    generatePrompt();

                };

            });

    }

    addExampleBtn?.addEventListener(
        "click",
        () => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "example-card";

            card.innerHTML = `

<div class="example-header">

<span>
Example
</span>

<button
type="button"
class="remove-example">

<i class="ri-delete-bin-line"></i>

</button>

</div>

<input
type="text"
placeholder="Input Example">

<textarea
placeholder="Output Example"></textarea>

`;

            examplesContainer.appendChild(
                card
            );

            attachRemoveEvents();

        }
    );

    attachRemoveEvents();

    examplesContainer?.addEventListener(
        "input",
        generatePrompt
    );

    /* ==========================
       PROMPT GENERATOR
    ========================== */

    function buildPrompt() {

        return `

SYSTEM:
You are an expert AI assistant.

PERSONA:
${selectedPersona}

TASK:
${taskType.value}

TOPIC:
${topicInput.value || "No topic provided"}

TONE:
${toneSelect.value}

TECHNIQUE:
${promptTechnique.value}

CREATIVITY:
${creativitySlider.value}/100

DETAIL:
${detailSlider.value}/100

OUTPUT LENGTH:
${lengthSlider.value}/100

${collectExamples()}

INSTRUCTIONS:

1. Follow the persona.
2. Match the selected tone.
3. Generate a creative response.
4. Provide detailed reasoning.
5. Structure the answer clearly.

`;

    }

    function typePrompt(text) {

        clearInterval(
            typingInterval
        );

        livePromptPreview.textContent =
            "";

        let i = 0;

        typingInterval =
            setInterval(() => {

                if (i < text.length) {

                    livePromptPreview
                        .textContent +=
                        text.charAt(i);

                    i++;

                } else {

                    clearInterval(
                        typingInterval
                    );

                }

            }, 5);

    }

    function generatePrompt() {

        if (!livePromptPreview) return;

        const prompt =
            buildPrompt();

        typePrompt(prompt);

    }

    [
        taskType,
        toneSelect,
        topicInput,
        promptTechnique
    ].forEach(element => {

        element?.addEventListener(
            "input",
            generatePrompt
        );

    });

    /* ==========================
       COPY PROMPT
    ========================== */

    copyPrompt?.addEventListener(
        "click",
        async () => {

            try {

                await navigator.clipboard.writeText(
                    livePromptPreview.textContent
                );

                copyPrompt.innerHTML =
                    "✓ Copied";

                setTimeout(() => {

                    copyPrompt.innerHTML = `
<i class="ri-file-copy-line"></i>
Copy
`;

                }, 1500);

            } catch (error) {

                console.error(error);

            }

        }
    );

    /* ==========================
       CLEAR PROMPT
    ========================== */

    clearPrompt?.addEventListener(
        "click",
        () => {

            topicInput.value = "";

            document
                .querySelectorAll(
                    ".example-card input"
                )
                .forEach(input => {

                    input.value = "";

                });

            document
                .querySelectorAll(
                    ".example-card textarea"
                )
                .forEach(area => {

                    area.value = "";

                });

            generatePrompt();

        }
    );

    /* ==========================
       INITIAL GENERATION
    ========================== */

    generatePrompt();

    /* ==========================================
   PROMPTVERSE AI
   COMPLETE SCRIPT.JS - PART 2
   SCORE ENGINE + BATTLE ARENA +
   PARTICLE SYSTEM
========================================== */

    /* ==========================
       PROMPT SCORE ENGINE
    ========================== */

    const promptScore =
        document.getElementById(
            "promptScore"
        );

    const scoreProgress =
        document.getElementById(
            "scoreProgress"
        );

    const scoreRecommendation =
        document.getElementById(
            "scoreRecommendation"
        );

    function updatePromptScore() {

        if (
            !promptScore ||
            !scoreProgress
        ) return;

        let score = 40;

        score +=
            Number(
                creativitySlider.value
            ) * 0.15;

        score +=
            Number(
                detailSlider.value
            ) * 0.15;

        score +=
            Number(
                lengthSlider.value
            ) * 0.05;

        score += 10;

        const exampleCount =
            document.querySelectorAll(
                ".example-card"
            ).length;

        score +=
            exampleCount * 4;

        score =
            Math.min(
                100,
                Math.round(score)
            );

        promptScore.textContent =
            score;

        /* SVG Ring */

        const radius = 70;

        const circumference =
            2 *
            Math.PI *
            radius;

        scoreProgress.style
            .strokeDasharray =
            circumference;

        scoreProgress.style
            .strokeDashoffset =
            circumference -
            (
                score / 100
            ) *
            circumference;

        /* Recommendation */

        if (score < 60) {

            scoreRecommendation.textContent =
                "Add examples and stronger constraints.";

        }

        else if (
            score < 80
        ) {

            scoreRecommendation.textContent =
                "Good prompt. More examples may improve consistency.";

        }

        else {

            scoreRecommendation.textContent =
                "Excellent prompt quality with strong context and structure.";

        }

    }

    /* Auto Update Score */

    [
        creativitySlider,
        detailSlider,
        lengthSlider,
        taskType,
        toneSelect,
        topicInput,
        promptTechnique
    ].forEach(item => {

        item?.addEventListener(
            "input",
            updatePromptScore
        );

    });

    /* ==========================
       AI BATTLE ARENA
    ========================== */

    const outputA =
        document.getElementById(
            "outputA"
        );

    const outputB =
        document.getElementById(
            "outputB"
        );

    const outputC =
        document.getElementById(
            "outputC"
        );

    const outputD =
        document.getElementById(
            "outputD"
        );

    function generateBattleOutputs() {

        const topic =
            topicInput.value.trim() ||
            "AI Startup";

        if (outputA) {

            outputA.innerHTML = `
<strong>Zero-Shot Result</strong>

<br><br>

Create an innovative
${topic}
solution using direct prompting.

Focus on uniqueness and speed.
`;

        }

        if (outputB) {

            outputB.innerHTML = `
<strong>Few-Shot Result</strong>

<br><br>

Generate a structured
${topic}
idea using examples and references.

Higher consistency.
`;

        }

        if (outputC) {

            outputC.innerHTML = `
<strong>Persona Result</strong>

<br><br>

Analyze
${topic}

from the perspective of a

${selectedPersona}.

Specialized perspective.
`;

        }

        if (outputD) {

            outputD.innerHTML = `
<strong>Chain of Thought</strong>

<br><br>

Problem →
Analysis →
Reasoning →
Solution →
Implementation

Highest reasoning depth.
`;

        }

    }

    [
        taskType,
        toneSelect,
        topicInput,
        promptTechnique
    ].forEach(element => {

        element?.addEventListener(
            "input",
            generateBattleOutputs
        );

    });

    /* ==========================
       VOTING SYSTEM
    ========================== */

    const voteButtons =
        document.querySelectorAll(
            ".vote-btn"
        );

    voteButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                voteButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "winner"
                        );

                        btn.innerHTML =
                            "Vote Winner";

                    }
                );

                button.classList.add(
                    "winner"
                );

                button.innerHTML =
                    "🏆 Winner";

            }
        );

    });

    /* ==========================
       PARTICLE BACKGROUND
    ========================== */

    const canvas =
        document.getElementById(
            "particlesCanvas"
        );

    if (canvas) {

        const ctx =
            canvas.getContext(
                "2d"
            );

        let particles =
            [];

        function resizeCanvas() {

            canvas.width =
                window.innerWidth;

            canvas.height =
                window.innerHeight;

        }

        resizeCanvas();

        window.addEventListener(
            "resize",
            resizeCanvas
        );

        class Particle {

            constructor() {

                this.x =
                    Math.random() *
                    canvas.width;

                this.y =
                    Math.random() *
                    canvas.height;

                this.radius =
                    Math.random() *
                    2 +
                    1;

                this.speed =
                    Math.random() *
                    0.7 +
                    0.2;

            }

            update() {

                this.y -=
                    this.speed;

                if (
                    this.y < 0
                ) {

                    this.y =
                        canvas.height;

                    this.x =
                        Math.random() *
                        canvas.width;

                }

            }

            draw() {

                ctx.beginPath();

                ctx.arc(

                    this.x,
                    this.y,
                    this.radius,
                    0,
                    Math.PI * 2

                );

                ctx.fillStyle =
                    "rgba(0,229,255,.7)";

                ctx.fill();

            }

        }

        function createParticles() {

            particles = [];

            for (
                let i = 0;
                i < 120;
                i++
            ) {

                particles.push(
                    new Particle()
                );

            }

        }

        createParticles();

        function animateParticles() {

            ctx.clearRect(

                0,
                0,
                canvas.width,
                canvas.height

            );

            particles.forEach(
                particle => {

                    particle.update();

                    particle.draw();

                }
            );

            requestAnimationFrame(
                animateParticles
            );

        }

        animateParticles();

    }

    /* ==========================
       ANALYTICS DATA ENGINE
    ========================== */

    function getAnalyticsData() {

        return {

            creativity:
                Number(
                    creativitySlider.value
                ),

            detail:
                Number(
                    detailSlider.value
                ),

            originality:
                85,

            clarity:
                82,

            tone:
                90

        };

    }

    /* ==========================
       REFRESH SYSTEM
    ========================== */

    function refreshPromptSystems() {

        generatePrompt();

        updatePromptScore();

        generateBattleOutputs();

    }

    [
        taskType,
        toneSelect,
        topicInput,
        promptTechnique,
        creativitySlider,
        detailSlider,
        lengthSlider
    ].forEach(element => {

        element?.addEventListener(
            "input",
            refreshPromptSystems
        );

    });

    personaCards.forEach(card => {

        card.addEventListener(
            "click",
            refreshPromptSystems
        );

    });

    /* ==========================
       INITIALIZATION
    ========================== */

    updatePromptScore();

    generateBattleOutputs();

    /* ==========================================
   PROMPTVERSE AI
   COMPLETE SCRIPT.JS - PART 3
   ANALYTICS + HISTORY + GAMIFICATION
========================================== */

    /* ==========================
       CHART HELPERS
    ========================== */

    function chartTextColor() {

        return body.classList.contains(
            "light-mode"
        )
            ? "#111827"
            : "#ffffff";

    }

    let radarChart = null;
    let barChart = null;
    let lineChart = null;

    /* ==========================
       RADAR CHART
    ========================== */

    function initializeRadarChart() {

        const canvas =
            document.getElementById(
                "radarChart"
            );

        if (!canvas) return;

        const ctx =
            canvas.getContext("2d");

        radarChart =
            new Chart(ctx, {

                type: "radar",

                data: {

                    labels: [

                        "Creativity",
                        "Detail",
                        "Originality",
                        "Clarity",
                        "Tone Match"

                    ],

                    datasets: [{

                        label:
                            "Prompt Quality",

                        data: [

                            85,
                            80,
                            90,
                            82,
                            88

                        ],

                        borderColor:
                            "#00e5ff",

                        backgroundColor:
                            "rgba(0,229,255,.15)",

                        borderWidth: 2

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            labels: {

                                color:
                                    chartTextColor()

                            }

                        }

                    },

                    scales: {

                        r: {

                            pointLabels: {

                                color:
                                    chartTextColor()

                            },

                            ticks: {

                                color:
                                    chartTextColor()

                            }

                        }

                    }

                }

            });

    }

    /* ==========================
       BAR CHART
    ========================== */

    function initializeBarChart() {

        const canvas =
            document.getElementById(
                "barChart"
            );

        if (!canvas) return;

        const ctx =
            canvas.getContext("2d");

        barChart =
            new Chart(ctx, {

                type: "bar",

                data: {

                    labels: [

                        "Zero-Shot",
                        "Few-Shot",
                        "Persona",
                        "CoT"

                    ],

                    datasets: [{

                        label:
                            "Effectiveness",

                        data: [

                            72,
                            86,
                            91,
                            95

                        ],

                        backgroundColor: [

                            "#00e5ff",
                            "#8b5cf6",
                            "#00ff9d",
                            "#ff4ecd"

                        ]

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            labels: {

                                color:
                                    chartTextColor()

                            }

                        }

                    },

                    scales: {

                        x: {

                            ticks: {

                                color:
                                    chartTextColor()

                            }

                        },

                        y: {

                            ticks: {

                                color:
                                    chartTextColor()

                            }

                        }

                    }

                }

            });

    }

    /* ==========================
       LINE CHART
    ========================== */

    function initializeLineChart() {

        const canvas =
            document.getElementById(
                "lineChart"
            );

        if (!canvas) return;

        const ctx =
            canvas.getContext("2d");

        lineChart =
            new Chart(ctx, {

                type: "line",

                data: {

                    labels: [

                        "Experiment 1",
                        "Experiment 2",
                        "Experiment 3",
                        "Experiment 4",
                        "Experiment 5"

                    ],

                    datasets: [{

                        label:
                            "Prompt Improvement",

                        data: [

                            50,
                            65,
                            78,
                            89,
                            97

                        ],

                        borderColor:
                            "#00e5ff",

                        backgroundColor:
                            "rgba(0,229,255,.15)",

                        fill: true,

                        tension: .4

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            labels: {

                                color:
                                    chartTextColor()

                            }

                        }

                    },

                    scales: {

                        x: {

                            ticks: {

                                color:
                                    chartTextColor()

                            }

                        },

                        y: {

                            ticks: {

                                color:
                                    chartTextColor()

                            }

                        }

                    }

                }

            });

    }

    /* ==========================
       AI INSIGHTS
    ========================== */

    const insightsList =
        document.getElementById(
            "insightsList"
        );

    function generateInsights() {

        if (!insightsList) return;

        insightsList.innerHTML = "";

        const insights = [

            "Few-shot prompting improves consistency by 32%.",

            "Persona prompting increases tone alignment.",

            "Chain-of-Thought improves reasoning quality.",

            "Higher detail levels improve output structure.",

            "Combining persona + few-shot often produces the best results."

        ];

        insights.forEach(item => {

            const li =
                document.createElement(
                    "li"
                );

            li.textContent = item;

            insightsList.appendChild(li);

        });

    }

    /* ==========================
       XP SYSTEM
    ========================== */

    let userXP =
        Number(
            localStorage.getItem(
                "pv-xp"
            )
        ) || 250;

    const xpValue =
        document.getElementById(
            "xpValue"
        );

    const xpFill =
        document.getElementById(
            "xpFill"
        );

    const userRank =
        document.getElementById(
            "userRank"
        );

    function updateXP() {

        const progress =

            Math.min(
                100,
                (userXP % 1000) / 10
            );

        xpFill.style.width =
            `${progress}%`;

        xpValue.textContent =
            `${userXP} XP`;

        let rank =
            "Prompt Apprentice";

        if (userXP > 500)
            rank =
            "Prompt Engineer";

        if (userXP > 1000)
            rank =
            "Prompt Architect";

        if (userXP > 2500)
            rank =
            "Prompt Scientist";

        if (userXP > 5000)
            rank =
            "Prompt Master";

        userRank.textContent =
            rank;

        localStorage.setItem(
            "pv-xp",
            userXP
        );

    }

    function awardXP(points) {

        userXP += points;

        updateXP();

    }

    /* ==========================
       DAILY CHALLENGES
    ========================== */

    const challengeElement =
        document.getElementById(
            "dailyChallenge"
        );

    const challenges = [

        "Create an AI startup that reduces food waste.",

        "Design a futuristic healthcare platform.",

        "Generate a climate-tech innovation.",

        "Build an AI-powered smart city solution.",

        "Create a viral campaign for an AI product."

    ];

    if (challengeElement) {

        challengeElement.textContent =

            challenges[
                Math.floor(
                    Math.random() *
                    challenges.length
                )
            ];

    }

    /* ==========================
       HISTORY SYSTEM
    ========================== */

    const historyContainer =
        document.querySelector(
            ".history-container"
        );

    function getHistory() {

        return JSON.parse(

            localStorage.getItem(
                "pv-history"
            )

        ) || [];

    }

    function saveHistory() {

        const history =
            getHistory();

        history.unshift({

            topic:
                topicInput.value,

            technique:
                promptTechnique.value,

            date:
                new Date()
                    .toLocaleString()

        });

        localStorage.setItem(

            "pv-history",

            JSON.stringify(
                history.slice(0, 20)
            )

        );

    }

    function renderHistory() {

        if (!historyContainer) return;

        const history =
            getHistory();

        historyContainer.innerHTML =
            "";

        history.forEach(
            (item, index) => {

                const div =
                    document.createElement(
                        "div"
                    );

                div.className =
                    "history-item";

                div.innerHTML = `

<div>

<h4>
${item.topic || "Untitled Prompt"}
</h4>

<small>
${item.technique}
•
${item.date}
</small>

</div>

<div class="history-actions">

<button
data-load="${index}">
Reload
</button>

<button
data-delete="${index}">
Delete
</button>

</div>

`;

                historyContainer.appendChild(
                    div
                );

            });

    }

    document.addEventListener(
        "click",
        (event) => {

            const load =
                event.target.dataset.load;

            const del =
                event.target.dataset.delete;

            if (
                load !== undefined
            ) {

                const history =
                    getHistory();

                const item =
                    history[load];

                if (item) {

                    topicInput.value =
                        item.topic;

                    promptTechnique.value =
                        item.technique;

                    refreshPromptSystems();

                }

            }

            if (
                del !== undefined
            ) {

                const history =
                    getHistory();

                history.splice(
                    del,
                    1
                );

                localStorage.setItem(

                    "pv-history",

                    JSON.stringify(
                        history
                    )

                );

                renderHistory();

            }

        }
    );

    /* ==========================
       EXPORT REPORT
    ========================== */

    function exportReport() {

        const report = `

PROMPTVERSE AI REPORT

================================

Topic:
${topicInput.value}

Persona:
${selectedPersona}

Technique:
${promptTechnique.value}

Prompt Score:
${promptScore.textContent}

================================

PROMPT

${livePromptPreview.textContent}

`;

        const blob =
            new Blob(
                [report],
                {
                    type:
                        "text/plain"
                }
            );

        const url =
            URL.createObjectURL(
                blob
            );

        const a =
            document.createElement(
                "a"
            );

        a.href = url;

        a.download =
            "PromptVerse_Report.txt";

        a.click();

        URL.revokeObjectURL(
            url
        );

    }

    document
        .querySelector(
            ".cta-card .primary-btn"
        )
        ?.addEventListener(
            "click",
            exportReport
        );

    /* ==========================
       SCROLL REVEAL
    ========================== */

    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "active"
                            );

                        }

                    }
                );

            },

            {
                threshold: .15
            }

        );

    document
        .querySelectorAll(
            ".glass-card"
        )
        .forEach(card => {

            observer.observe(
                card
            );

        });

    /* ==========================
       AUTO SAVE
    ========================== */

    topicInput?.addEventListener(
        "change",
        () => {

            saveHistory();

            renderHistory();

            awardXP(10);

        }
    );

    /* ==========================
       INITIALIZE
    ========================== */

    initializeRadarChart();
    initializeBarChart();
    initializeLineChart();

    generateInsights();

    renderHistory();

    updateXP();

    console.log(
        "PromptVerse AI Loaded Successfully 🚀"
    );

}); /* END DOMContentLoaded */