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
            this._scoreAmount = 0;   // 점
            this.cardList = [];
            this.stageItor = null;
            this.nowStage = null;
            this.cardDisplayDom = document.getElementById('cardElementsBox');
        }
        set scoreAmount(score) {
            this._scoreAmount = score;
        }
        get scoreAmount() {
            return this._scoreAmount;
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
            this.nowStage.visualizeCardList();
            //
        }
        loadCardList() {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', '../script/cardList.json');
                xhr.send();

                xhr.onreadystatechange = () => {
                    if (xhr.readyState != XMLHttpRequest.DONE) return;

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
            this.amountCard = findCardFriend.defaultCardAmount + ((this.level - 1) * findCardFriend.cardIncrease);
            this.remainCard = findCardFriend.defaultCardAmount + ((this.level - 1) * findCardFriend.cardIncrease);
            this.remainTime = findCardFriend.readyTime;
            this.randomCardArrangement = [];
            this.correctAnswer = [];
            this.gameStateArray = [];
            this.clickFlag = false;
        }
        init() {
            // 게임 상태 배열과 정답지 배열 초기화
            const initGameStateArray = () => {
                let rowValue = 0;
                let colValue = 0;
                for (let i = 1; i <= this.amountCard; i++) {
                    if (this.remainCard % i === 0) {
                        if (i > this.amountCard / i) {
                            break;
                        }
                        rowValue = i;
                        colValue = this.amountCard / i;
                    }
                }
                for (let i = 0; i < rowValue; i++) {
                    this.gameStateArray.push([]);
                    this.correctAnswer.push([]);
                    for (let j = 0; j < colValue; j++) {
                        this.gameStateArray[i].push(0);
                        this.correctAnswer[i].push(0);
                    }
                }
            }
            //
            // 랜덤으로 게임에 사용할 카드 리스트 만들기
            const makeRandomCardList = () => {
                let randomNumber = 0;
                let tempArray = [];
                let randomOrder = [];
                // 랜덤 숫자 생성햬서 tempArray에 담는다
                for (let i = 0; i < this.amountCard / 2; i++) {
                    do {
                        randomNumber = Math.floor(Math.random() * findCardFriend.cardList.length);
                    } while (tempArray.includes(findCardFriend.cardList[randomNumber]))
                    tempArray[i] = findCardFriend.cardList[randomNumber];
                }
                for (let i = 0; i < this.amountCard; i++) {
                    do {
                        randomNumber = Math.floor(Math.random() * this.amountCard);
                    } while (randomOrder.includes(randomNumber))
                    randomOrder[i] = randomNumber;
                }
                for (let i = 0; i < this.amountCard / 2; i++) {
                    this.randomCardArrangement[randomOrder[i]] = tempArray[i].name;
                    this.randomCardArrangement[randomOrder[i + (this.remainCard / 2)]] = tempArray[i].name;
                }
                for (var i = 0; i < this.randomCardArrangement.length; i++) {
                    let rowValue = Math.floor(i / this.gameStateArray[0].length);
                    let colValue = i % this.gameStateArray[0].length;

                    if (this.gameStateArray.length <= rowValue) {
                        this.gameStateArray.push([]);
                    }
                    this.correctAnswer[rowValue][colValue] = this.randomCardArrangement[i];
                }
                console.log("게임상태", this.gameStateArray);
                console.log("게임정답지", this.correctAnswer);
            }
            //
            initGameStateArray();
            makeRandomCardList();
            document.getElementById("currentLevel").innerHTML = this.level;
            document.getElementById("currentRemainCard").innerHTML = this.remainCard;
            document.getElementById("currentScore").innerHTML = findCardFriend.scoreAmount;
            document.getElementById("currentRemainTime").innerHTML = findCardFriend.formatTime(this.remainTime);
        }
        // 카드 시각화
        visualizeCardList = () => {
            const giveRandomUrl = () => {
                const nodeListArray = document.querySelectorAll(`.cardElementCol`);
                for (let i = 0; i < this.gameStateArray.length; i++) {
                    for (let j = 0; j < this.gameStateArray[0].length; j++) {
                        if (nodeListArray[i].classList.contains("nowChoicedCard")) {
                            nodeListArray[i].style.backgroundImage = `url('../res/cardImage/${this.cardArrangeArray[i][j]}.png')`;
                        }
                    }
                }
            }
            const giveCardClickEvent = () => {
                document.querySelectorAll('.cardElementCol').forEach(v => {
                    v.addEventListener("click", e => {
                        const [rowIndex, colIndex] = e.target.id.split('_');
                        this.gameStateArray[Number(rowIndex)][Number(colIndex)] = 1;
                        // this.clickFlag 변경 필요
                        this.visualizeCardList();
                    });
                });
            }
            while (findCardFriend.cardDisplayDom.firstChild) {
                findCardFriend.cardDisplayDom.removeChild(findCardFriend.cardDisplayDom.firstChild);
            }
            let newRowDiv = null;
            let newColDiv = null;
            for (let i = 0; i < this.gameStateArray.length; i++) {
                newRowDiv = document.createElement('div');
                newRowDiv.classList.add("cardElementRow");
                findCardFriend.cardDisplayDom.appendChild(newRowDiv);
                for (let j = 0; j < this.gameStateArray[0].length; j++) {
                    newColDiv = document.createElement('div');
                    newColDiv.id = `${i}_${j}`;
                    newColDiv.classList.add("cardElementCol");
                    switch (this.gameStateArray[i][j]) {
                        case 0:
                            newColDiv.classList.add("misteryCard");
                            break;
                        case 1:
                            newColDiv.classList.add("nowChoicedCard");
                            break;
                        case 2:
                            newColDiv.classList.add("foundCard");
                            break;
                    }
                    newRowDiv.appendChild(newColDiv);
                }
            }
            giveRandomUrl();
            giveCardClickEvent();
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
