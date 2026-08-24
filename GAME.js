(function () {

    const stage = document.getElementById('burgerStage');
    const basket = document.getElementById('burgerBasket');
    const overlay = document.getElementById('burgerOverlay');
    const startBtn = document.getElementById('burgerStartBtn');
    const scoreEl = document.getElementById('burgerScore');
    const livesEl = document.getElementById('burgerLives');

    if (!stage || !basket || !startBtn) return;

    let score = 0;
    let lives = 3;
    let running = false;
    let spawnTimer = null;
    let fallers = [];
    let basketX = 0;

    function resetBasketPosition() {
        basketX = stage.clientWidth / 2;
        basket.style.left = basketX + 'px';
    }


    function moveBasketTo(clientX) {

        const rect = stage.getBoundingClientRect();

        let x = clientX - rect.left;

        const half = basket.offsetWidth / 2 || 24;

        x = Math.max(
            half,
            Math.min(rect.width - half, x)
        );

        basketX = x;

        basket.style.left = x + 'px';
    }

    stage.addEventListener('mousemove', (e) => {

        if (!running) return;

        moveBasketTo(e.clientX);

    });


    stage.addEventListener('touchmove', (e) => {

        if (!running) return;

        if (e.touches[0]) {
            moveBasketTo(e.touches[0].clientX);
        }

        e.preventDefault();

    }, { passive: false });

    function spawnBurger() {

        const burger = document.createElement('div');

        burger.className = 'falling-burger';

        burger.textContent = '🍔';

        const stageWidth = stage.clientWidth;

        const startX =
            Math.random() * (stageWidth - 30);

        burger.style.left = startX + 'px';

        stage.appendChild(burger);

        fallers.push({
            el: burger,
            y: -40,
            speed: 2 + Math.random() * 2,
            x: startX
        });
    }


    function endGame() {

        running = false;

        clearInterval(spawnTimer);

        fallers.forEach((burger) => {
            burger.el.remove();
        });

        fallers = [];

        overlay.classList.remove('hidden');

        overlay.innerHTML =
            '<p>Game over! Skor akhir kamu: <strong>' +
            score +
            '</strong><br>Tekan Start Game buat main lagi.</p>';
    }

    function loop() {

        if (!running) return;

        const stageHeight = stage.clientHeight;

        const basketRect = {

            x: basketX -
                (basket.offsetWidth / 2 || 24),

            width:
                basket.offsetWidth || 48,

            y:
                stageHeight - 50,

            height: 50
        };


        for (
            let i = fallers.length - 1;
            i >= 0;
            i--
        ) {

            const burger = fallers[i];

            burger.y += burger.speed;

            burger.el.style.top =
                burger.y + 'px';


            const caught =
                burger.y + 30 >= basketRect.y &&
                burger.x + 15 >= basketRect.x &&
                burger.x <=
                basketRect.x + basketRect.width;


            if (caught) {

                score++;

                scoreEl.textContent = score;

                burger.el.remove();

                fallers.splice(i, 1);

            }


            else if (burger.y > stageHeight) {

                lives--;

                livesEl.textContent = lives;

                burger.el.remove();

                fallers.splice(i, 1);


                if (lives <= 0) {

                    endGame();

                    return;
                }
            }
        }

        requestAnimationFrame(loop);
    }


    startBtn.addEventListener('click', () => {


        score = 0;

        lives = 3;

        scoreEl.textContent = score;

        livesEl.textContent = lives;



        overlay.classList.add('hidden');


        resetBasketPosition();



        fallers.forEach((burger) => {
            burger.el.remove();
        });

        fallers = [];



        running = true;


        clearInterval(spawnTimer);


        spawnTimer =
            setInterval(spawnBurger, 700);

        requestAnimationFrame(loop);
    });

    window.addEventListener('resize', () => {

        if (!running) {
            resetBasketPosition();
        }

    });

    resetBasketPosition();

})();