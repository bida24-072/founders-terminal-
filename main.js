/* ============================================
   THEO BIDA PORTFOLIO — Interactions
============================================ */

/* ============================================
   TYPEWRITER EFFECT
============================================ */
const typewriterEl = document.getElementById('typewriter');
const outputEl = document.getElementById('terminal-output');

const commands = [
    {
        cmd: 'whoami',
        output: `> theo bida\n> business analysis & computing student @ BAC\n> front-end developer · gaborone, botswana`
    },
    {
        cmd: 'cat mission.txt',
        output: `> "Build digital products that prove\n>  Botswana can compete globally."`
    },
    {
        cmd: 'ls ./projects',
        output: `> maatla-boutique/\n> phakalane-restaurant/\n> tsholofelo-lodge/\n> kasi-collective/`
    }
];

let cmdIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
    const current = commands[cmdIndex];

    if (!isDeleting) {
        typewriterEl.textContent = current.cmd.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === current.cmd.length) {
            // Pause, then show output
            setTimeout(() => {
                outputEl.textContent = current.output;
                setTimeout(() => {
                    isDeleting = true;
                    typeLoop();
                }, 2500);
            }, 300);
            return;
        }
        setTimeout(typeLoop, 90);
    } else {
        // Deleting
        typewriterEl.textContent = current.cmd.substring(0, charIndex - 1);
        charIndex--;
        outputEl.textContent = '';

        if (charIndex === 0) {
            isDeleting = false;
            cmdIndex = (cmdIndex + 1) % commands.length;
            setTimeout(typeLoop, 500);
            return;
        }
        setTimeout(typeLoop, 40);
    }
}

/* ============================================
   HORIZONTAL SCROLL — Convert vertical wheel to horizontal
============================================ */
const scrollContainer = document.querySelector('.scroll-container');

if (scrollContainer) {
    // Desktop: convert vertical wheel → horizontal scroll
    window.addEventListener('wheel', (e) => {
        if (window.innerWidth <= 900) return; // Don't interfere on mobile
        if (e.deltaY !== 0) {
            e.preventDefault();
            scrollContainer.scrollLeft += e.deltaY;
        }
    }, { passive: false });

    // Keyboard arrow keys
    window.addEventListener('keydown', (e) => {
        if (window.innerWidth <= 900) return;
        if (e.key === 'ArrowRight') {
            scrollContainer.scrollLeft += window.innerWidth * 0.8;
        } else if (e.key === 'ArrowLeft') {
            scrollContainer.scrollLeft -= window.innerWidth * 0.8;
        }
    });
}

/* ============================================
   CHAPTER TRACKING (Side rail active state)
============================================ */
const chapters = document.querySelectorAll('.chapter');
const railLinks = document.querySelectorAll('.rail-link');

function updateActiveChapter() {
    if (!scrollContainer || window.innerWidth <= 900) return;

    const scrollLeft = scrollContainer.scrollLeft;
    const viewportCenter = scrollLeft + window.innerWidth / 2;

    chapters.forEach((chapter, index) => {
        const chapterStart = chapter.offsetLeft;
        const chapterEnd = chapterStart + chapter.offsetWidth;

        if (viewportCenter >= chapterStart && viewportCenter < chapterEnd) {
            railLinks.forEach((link, i) => {
                link.classList.toggle('active', i === index);
            });
        }
    });
}

if (scrollContainer) {
    scrollContainer.addEventListener('scroll', updateActiveChapter);
}

/* ============================================
   RAIL LINK CLICK — Smooth scroll to chapter
============================================ */
railLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-chapter');
        const targetChapter = document.getElementById(`ch-${targetId}`);
        if (targetChapter && scrollContainer) {
            scrollContainer.scrollTo({
                left: targetChapter.offsetLeft,
                behavior: 'smooth'
            });
        } else if (targetChapter) {
            // Mobile fallback
            targetChapter.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* ============================================
   INITIALIZATION
============================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Start typewriter
    setTimeout(typeLoop, 800);

    // Initial chapter state
    updateActiveChapter();

    // Handle resize
    window.addEventListener('resize', () => {
        updateActiveChapter();
    });
});
