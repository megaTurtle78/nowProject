(function main() {
    class CardMatchGameMaker {
        constructor(identifier) {
            this.id = identifier;
            this.startLevel = 1;
            this.endLevel = 20;
            this.timeLimit = 300;   // 초
            this.readyTime = 10;   // 초
            this.penaltyTime = 5;   // 초
            this.defaultCardAmount = 8; // 장
            this.cardIncrease = 4;  // 쌍
            this.scoreAmount = 0;   // 점
            this.cardList = [];
            this.stageItor = null;
            this.nowStage = null;
        }
        async run() {
            // cardList.json 가져오기
            try {
                const cardListResponse = await this.loadCardList();
                this.cardList = cardListResponse;
            } catch (error) {
                console.error('Error!!', error);
            }
            //
            // 각 레벨 객체 만들고 iterator로 만들기
            let levelObjArray = [];
            for (let i = this.startLevel - 1; i < this.endLevel; i++) {
                levelObjArray[i] = new CardMatchGameStage(i + 1);
            }
            this.stageItor = levelObjArray[Symbol.iterator]();
            this.nowStage = this.stageItor.next().value;
            //
            // 카드 게임 로직 시작
            this.nowStage.init();
            this.nowStage.gameControll();
            //
        }
        loadCardList() {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', '../script/cardList.json');
                xhr.send();

                xhr.onreadystatechange = function () {
                    if (xhr.readyState !== XMLHttpRequest.DONE) return;

                    if (xhr.status === 200) {
                        const responseObject = JSON.parse(xhr.responseText);
                        resolve(responseObject);
                    } else {
                        reject(new Error('Failed!!'));
                    }
                };
            });
        }
        formatTime(timeParam) {
            const minutesValue = String(Math.floor(timeParam / 60));

            const secondsValue = String(timeParam % 60).padStart(2, '0');
            return `${minutesValue}:${secondsValue}`;
        }
    }
    class CardMatchGameStage {
        constructor(level) {
            this.level = level;
            this.remainCard = findCardFriend.defaultCardAmount + ((this.level - 1) * findCardFriend.cardIncrease);
            this.remainTime = findCardFriend.readyTime;
            this.cardArrangeArray = [];
            this.gameStateArray = [];
        }
        init() {
            // 게임 상태 배열 초기화 => 초기값 : 1(nowChoicedCard)
            const initGameStateArray = () => {
                let rowValue = 0;
                let colValue = 0;
                for (let i = 1; i <= this.remainCard; i++) {
                    if (this.remainCard % i === 0) {
                        if (i > this.remainCard / i) {
                            break;
                        }
                        rowValue = i;
                        colValue = this.remainCard / i;
                    }
                }
                for (let i = 0; i < rowValue; i++) {
                    this.gameStateArray.push([]);
                    for (let j = 0; j < colValue; j++) {
                        this.gameStateArray[i].push(1);
                    }
                }
            }
            //
            // 랜덤으로 게임에 사용할 카드 리스트 만들기
            const makeRandomCardList = () => {
                let randomNumber = 0;
                let tempArray = [];
                let randomOrder = [];
                for (let i = 0; i < this.remainCard / 2; i++) {
                    do {
                        randomNumber = Math.floor(Math.random() * findCardFriend.cardList.length);
                    } while (tempArray.includes(findCardFriend.cardList[randomNumber]))
                    tempArray[i] = findCardFriend.cardList[randomNumber];
                }
                for (let i = 0; i < this.remainCard; i++) {
                    do {
                        randomNumber = Math.floor(Math.random() * this.remainCard);
                    } while (randomOrder.includes(randomNumber))
                    randomOrder[i] = randomNumber;
                }
                for (let i = 0; i < this.remainCard / 2; i++) {
                    this.cardArrangeArray[randomOrder[i]] = tempArray[i].name;
                    this.cardArrangeArray[randomOrder[i + (this.remainCard/ 2)]] = tempArray[i].name;
                }
                console.log(this.cardArrangeArray)
            }
            //
            initGameStateArray();
            makeRandomCardList();
            document.getElementById("currentLevel").innerHTML = this.level;
            document.getElementById("currentRemainCard").innerHTML = this.remainCard;
            document.getElementById("currentScore").innerHTML = findCardFriend.scoreAmount;
            document.getElementById("currentRemainTime").innerHTML = findCardFriend.formatTime(this.remainTime);
        }
        gameControll() {
            // 클릭 이벤트
            console.log('merong merong')
        }
    }

    // 박쥐 눈 깜빡깜빡
    const batEyesBlink = () => {
        const flyingBatObj = document.querySelector(`.flyingBatObj`);
        const hangingBatObj = document.querySelectorAll(`.hangingBatObj`);
        const [hangingBatObj1, hangingBatObj2] = hangingBatObj;
        const batBlinkInterval = (batObj, normalImage, blinkImage) => {
            let urlInfo = batObj.style.backgroundImage === `url("../res/designImage/${blinkImage}")` ? `url("../res/designImage/${normalImage}")` : `url("../res/designImage/${blinkImage}")`;
            batObj.style.backgroundImage = urlInfo;
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
        findCardFriend.run();
        document.querySelector(".gameStartBox").style.display = "none";
    });
    const findCardFriend = new CardMatchGameMaker('findCardFriend');
})();