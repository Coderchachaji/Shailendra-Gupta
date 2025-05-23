document.addEventListener('DOMContentLoaded', function () {
    const svgElement = document.getElementById('grid-svg');
    const introContent = document.querySelector('.intro-content');
    const profilePhoto = document.querySelector('.profile-photo-container');
    const mainContent = document.getElementById('main-content');
    const skipIntro = document.getElementById('skip-intro');
    const introAnimation = document.getElementById('intro-animation');

    const gridSpacing = 40;
    const gridDelay = 0.03;

    function createSVGGrid() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const horizontalLines = Math.floor(height / gridSpacing);
        const verticalLines = Math.floor(width / gridSpacing);

        svgElement.innerHTML = ''; // Clear old lines before redrawing

        for (let i = 0; i <= horizontalLines; i++) {
            const y = i * gridSpacing;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', '0');
            line.setAttribute('y1', y);
            line.setAttribute('x2', width);
            line.setAttribute('y2', y);
            line.setAttribute('class', 'grid-line horizontal-line');
            line.style.opacity = '0';
            svgElement.appendChild(line);
        }

        for (let i = 0; i <= verticalLines; i++) {
            const x = i * gridSpacing;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x);
            line.setAttribute('y1', '0');
            line.setAttribute('x2', x);
            line.setAttribute('y2', height);
            line.setAttribute('class', 'grid-line vertical-line');
            line.style.opacity = '0';
            svgElement.appendChild(line);
        }
    }

    function createDataPoints() {
        const dataPoints = [
            { cx: '30%', cy: '40%', r: 5, fill: '#38BDF8', delay: 1.5 },
            { cx: '70%', cy: '30%', r: 8, fill: '#FB7185', delay: 1.7 },
            { cx: '40%', cy: '70%', r: 6, fill: '#34D399', delay: 1.9 },
            { cx: '65%', cy: '65%', r: 4, fill: '#A78BFA', delay: 2.1 },
            { cx: '20%', cy: '25%', r: 7, fill: '#F472B6', delay: 2.3 }
        ];

        dataPoints.forEach(point => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', point.cx);
            circle.setAttribute('cy', point.cy);
            circle.setAttribute('r', point.r);
            circle.setAttribute('fill', point.fill);
            circle.setAttribute('class', 'data-point');
            circle.style.opacity = '0';
            svgElement.appendChild(circle);

            gsap.to(circle, {
                opacity: 0.8,
                scale: 1,
                duration: 0.6,
                delay: point.delay,
                ease: "back.out(1.7)"
            });
        });

        const connections = [
            { x1: '30%', y1: '40%', x2: '70%', y2: '30%', delay: 2.5 },
            { x1: '40%', y1: '70%', x2: '65%', y2: '65%', delay: 2.7 },
            { x1: '20%', y1: '25%', x2: '30%', y2: '40%', delay: 2.9 }
        ];

        connections.forEach(conn => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', conn.x1);
            line.setAttribute('y1', conn.y1);
            line.setAttribute('x2', conn.x2);
            line.setAttribute('y2', conn.y2);
            line.setAttribute('stroke', 'rgba(255, 255, 255, 0.2)');
            line.setAttribute('stroke-width', '1');
            line.setAttribute('stroke-dasharray', '5,5');
            line.style.opacity = '0';
            svgElement.appendChild(line);

            gsap.to(line, {
                opacity: 0.6,
                duration: 0.8,
                delay: conn.delay,
                ease: "power2.inOut"
            });
        });
    }

    function animateGrid() {
        const horizontalLines = document.querySelectorAll('.horizontal-line');
        horizontalLines.forEach((line, index) => {
            gsap.to(line, {
                opacity: 1,
                duration: 0.8,
                delay: index * gridDelay,
                ease: "power1.inOut"
            });
        });

        const verticalLines = document.querySelectorAll('.vertical-line');
        verticalLines.forEach((line, index) => {
            gsap.to(line, {
                opacity: 1,
                duration: 0.8,
                delay: 0.5 + index * gridDelay,
                ease: "power1.inOut"
            });
        });

        gsap.to(profilePhoto, {
            opacity: 1,
            scale: 1,
            duration: 1,
            delay: 1.2,
            ease: "back.out(1.7)"
        });

        gsap.to(introContent, {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 1.5,
            ease: "power2.out"
        });

        setTimeout(createDataPoints, 1000);

        setTimeout(transitionToMain, 5000);
    }

    function transitionToMain() {
        gsap.to('.grid-line', {
            opacity: 0,
            duration: 0.8,
            stagger: 0.01,
            ease: "power1.inOut"
        });

        gsap.to('.data-point', {
            opacity: 0,
            scale: 1.5,
            duration: 0.5,
            stagger: 0.05,
            ease: "power1.in"
        });

        gsap.to(introContent, {
            opacity: 0,
            y: -20,
            duration: 0.8,
            delay: 0.2
        });

        gsap.to(profilePhoto, {
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            delay: 0.3
        });

        setTimeout(() => {
            gsap.to(introAnimation, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    introAnimation.style.display = 'none';
                    mainContent.style.display = 'block';

                    gsap.to(mainContent, {
                        opacity: 1,
                        duration: 1
                    });
                }
            });
        }, 1000);
    }

    if (skipIntro) {
        skipIntro.addEventListener('click', () => {
            gsap.killTweensOf(introAnimation);
            gsap.killTweensOf('.grid-line');
            gsap.killTweensOf('.data-point');

            introAnimation.style.opacity = '0';
            introAnimation.style.display = 'none';
            mainContent.style.display = 'block';
            mainContent.style.opacity = '1';
        });
    }

    window.addEventListener('resize', () => {
        createSVGGrid();
        animateGrid();
    });

    createSVGGrid();
    setTimeout(animateGrid, 500);
});
