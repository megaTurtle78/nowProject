(function main() {
    class CardMatchGameMaker {
        constructor() {
            this.startLevel = 1;
            this.endLevel = 20;
            this.timeLimit = 301;   // +1초 기입
            this.readyTime = 10;
            this.penaltyTime = 5;
            this.currentScore = 0;
            this.cardList = [
                { id: 1, name: 'apple' },
                { id: 2, name: 'avocado' },
                { id: 3, name: 'baguette' },
                { id: 4, name: 'banana' },
                { id: 5, name: 'beer' },
                { id: 6, name: 'book' },
                { id: 7, name: 'bread' },
                { id: 8, name: 'cat' },
                { id: 9, name: 'cherryBlossom' },
                { id: 10, name: 'crown' },
                { id: 11, name: 'devil' },
                { id: 12, name: 'diamondRing' },
                { id: 13, name: 'dog' },
                { id: 14, name: 'earth' },
                { id: 15, name: 'fire' },
                { id: 16, name: 'garlic' },
                { id: 17, name: 'ghost' },
                { id: 18, name: 'grapes' },
                { id: 19, name: 'hamburger' },
                { id: 20, name: 'heart' },
                { id: 21, name: 'key' },
                { id: 22, name: 'koala' },
                { id: 23, name: 'medal' },
                { id: 24, name: 'money' },
                { id: 25, name: 'monkey' },
                { id: 26, name: 'moon' },
                { id: 27, name: 'mushroom' },
                { id: 28, name: 'palmTree' },
                { id: 29, name: 'pearls' },
                { id: 30, name: 'rabbit' },
                { id: 31, name: 'rocket' },
                { id: 32, name: 'sheep' },
                { id: 33, name: 'shell' },
                { id: 34, name: 'skeleton' },
                { id: 35, name: 'snail' },
                { id: 36, name: 'star' },
                { id: 37, name: 'sun' },
                { id: 38, name: 'thunderbolt' },
                { id: 39, name: 'treasure' },
                { id: 40, name: 'tree' },
                { id: 41, name: 'ufo' },
                { id: 42, name: 'unicorn' },
            ]
        }
        run = () => {
            // 각 레벨마다 새로운 클래스 생성
            const myCardMatch = new CardMatchGame();
            myCardMatch.init();
            myCardMatch.visualizeCardList();
            myCardMatch.updateRemainCardAndScore();
            myCardMatch.updateReadyTime();
        }
        formatTime = timeParam => {
            const minutesValue = String(Math.floor(timeParam / 60));
            const secondsValue = String(timeParam % 60).padStart(2, '0');
            return `${minutesValue}:${secondsValue}`;
        }
    }
    class CardMatchGame {
        constructor() {
            this.level = 1;
            this.amountCard = 8;
            this.remainTime = cardMatchGame.readyTime;
            this.remainCard = this.amountCard;
            this.currentCardList = [];
            this.arrangeCardList = [];
            this.cardRow = 0;
            this.cardCol = 0;
            this.currentGameStateArray = [];
        }
        init = () => {
            // 카드배치 크기를 결정
            const setCardRowCol = () => {
                for (let i = 1; i <= this.amountCard; i++) {
                    if (this.amountCard % i === 0) {
                        if (i > this.amountCard / i) {
                            break;
                        }
                        this.cardRow = i;
                        this.cardCol = this.amountCard / i;
                    }
                }
            }
            // 게임 상태를 관리할 배열 만들기 => 초기값 : 1(nowChoicedCard)
            const initGameStateArray = () => {
                for (let i = 0; i < this.cardRow; i++) {
                    this.currentGameStateArray.push([]);
                    for (let j = 0; j < this.cardCol; j++) {
                        this.currentGameStateArray[i].push(1);
                    }
                }
            }
            // 중복 없는 카드리스트 만들기
            const makeCardList = () => {
                for (let i = 0; i < this.amountCard / 2; i++) {
                    let randomNumber = 0;
                    do {
                        randomNumber = Math.floor(Math.random() * cardMatchGame.cardList.length) + 1;
                    } while (this.currentCardList.includes(cardMatchGame.cardList[randomNumber - 1]))
                    this.currentCardList[i] = cardMatchGame.cardList[randomNumber - 1];
                }
            }
            // 실제로 화면에 뿌릴 배치리스트 만들기
            const makeCardArrangement = () => {
                let randomOrder = [];
                for (let i = 0; i < this.amountCard; i++) {
                    let randomNumber = 0;
                    do {
                        randomNumber = Math.floor(Math.random() * this.amountCard);
                    } while (randomOrder.includes(randomNumber))
                    randomOrder[i] = randomNumber;
                }
                for (let i = 0; i < this.amountCard / 2; i++) {
                    this.arrangeCardList[randomOrder[i]] = { id: i, name: this.currentCardList[i].name };
                    this.arrangeCardList[randomOrder[i + (this.amountCard / 2)]] = { id: i + (this.amountCard / 2), name: this.currentCardList[i].name };
                }
            }
            setCardRowCol();
            initGameStateArray();
            makeCardList();
            makeCardArrangement();
            document.getElementById("currentLevel").innerHTML = this.level;
            document.getElementById("currentRemainTime").innerHTML = cardMatchGame.formatTime(this.remainTime);
        }
        // 게임 인포메이션 갱신(남은 카드, 점수)
        updateRemainCardAndScore = () => {
            document.getElementById("currentRemainCard").innerHTML = this.remainCard;
            document.getElementById("currentScore").innerHTML = cardMatchGame.currentScore;
        }
        // 게임 인포메이션 갱신(미리보기 시간)
        updateReadyTime = () => {
            const checkEndTime = () => {
                const nowTimeInfo = new Date();
                if (nowTimeInfo.getTime() > endTimeInfo) {
                    for (let i = 0; i < this.cardRow; i++) {
                        for (let j = 0; j < this.cardCol; j++) {
                            this.currentGameStateArray[i][j] = 0;
                        }
                    }
                    clearInterval(checkEndTimeHandler);
                    this.visualizeCardList();
                    this.remainTime = cardMatchGame.timeLimit;
                    document.getElementById("currentRemainTime").innerHTML = cardMatchGame.formatTime(this.remainTime);
                    this.updateRemainTime();
                }
                this.remainTime--;
                document.getElementById("currentRemainTime").innerHTML = cardMatchGame.formatTime(this.remainTime);
            }
            const nowTimeInfo = new Date();
            const endTimeInfo = nowTimeInfo.getTime() + (this.remainTime * 1000);
            const checkEndTimeHandler = setInterval(checkEndTime, 1000);
        }
        // 게임 인포메이션 갱신(게임 시간)
        updateRemainTime = () => {
            const checkEndTime = () => {
                const nowTimeInfo = new Date();
                if (nowTimeInfo.getTime() > endTimeInfo) {
                    clearInterval(checkEndTimeHandler);
                    console.log("you died");
                }
                this.remainTime--;
                document.getElementById("currentRemainTime").innerHTML = cardMatchGame.formatTime(this.remainTime);
            }
            const nowTimeInfo = new Date();
            const endTimeInfo = nowTimeInfo.getTime() + (this.remainTime * 1000);
            const checkEndTimeHandler = setInterval(checkEndTime, 1000);
        }
        // 카드리스트 시각화
        visualizeCardList = () => {
            const giveRandomUrl = () => {
                const nodeListArray = document.querySelectorAll(`.cardElementCol`);
                for (let i = 0; i < this.amountCard; i++) {
                    if (nodeListArray[i].classList.contains("nowChoicedCard")) {
                        nodeListArray[i].style.backgroundImage = `url('../res/cardImage/${this.arrangeCardList[i].name}.png')`;
                    }
                }
            }
            let tempString = "";
            for (let i = 0; i < this.cardRow; i++) {
                tempString += `<div class="cardElementRow">`;
                for (let j = 0; j < this.cardCol; j++) {
                    switch (this.currentGameStateArray[i][j]) {
                        case 0:
                            tempString += `<div id="${i}_${j}" class="cardElementCol misteryCard"></div>`;
                            break;
                        case 1:
                            tempString += `<div id="${i}_${j}" class="cardElementCol nowChoicedCard"></div>`;
                            break;
                        case 2:
                            tempString += `<div id="${i}_${j}" class="cardElementCol foundCard"></div>`;
                            break;
                    }
                }
                tempString += `</div>`;
            }
            document.getElementById("cardElementsBox").innerHTML = tempString;
            giveRandomUrl();
        }
        // 카드 클릭 이벤트
    }

    // 박쥐 눈 깜빡깜빡
    const batEyesBlink = () => {
        const flyingBatObj = document.querySelector(`.flyingBatObj`);
        const hangingBatObj = document.querySelectorAll(`.hangingBatObj`);
        const [hangingBatObj1, hangingBatObj2] = hangingBatObj;
        const batBlinkInterval = (batObj, normalImage, blinkImage) => {
            if (batObj.style.backgroundImage === `url("../res/designImage/${blinkImage}")`) {
                batObj.style.backgroundImage = `url("../res/designImage/${normalImage}")`;
            } else {
                batObj.style.backgroundImage = `url("../res/designImage/${blinkImage}")`;
            }
        }
        const flyingBatBlink = () => batBlinkInterval(flyingBatObj, 'batTwins.png', 'batTwinsYellow.png');
        const hangingBat1Blink = () => batBlinkInterval(hangingBatObj1, 'bat.png', 'batYellow.png');
        const hangingBat2Blink = () => batBlinkInterval(hangingBatObj2, 'bat.png', 'batYellow.png');
        setInterval(flyingBatBlink, 1000);
        setInterval(hangingBat1Blink, 1500);
        setInterval(hangingBat2Blink, 800);
    }
    batEyesBlink();

    document.getElementById("gameStartBtn").addEventListener("click", () => {
        document.querySelector(".gameStartBox").style.display = "none";
        cardMatchGame.run();
    });
    const cardMatchGame = new CardMatchGameMaker();

})();
