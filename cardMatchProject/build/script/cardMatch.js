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
            this.nowStage.gameControl();
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
            this.randomCardOrder = [];
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
                        this.gameStateArray[i].push(1);
                        this.correctAnswer[i].push(0);
                    }
                }
            }
            //
            // 랜덤으로 게임에 사용할 카드 리스트 만들기
            const makeRandomCardList = () => {
                // tempArray에 랜덤카드 4장을 뽑아준다. 
                let tempArray = [];
                let tempOrder = [];
                while (tempArray.length < this.amountCard / 2) {
                    let randomNumber = Math.floor(Math.random() * findCardFriend.cardList.length);
                    if (!tempArray.includes(findCardFriend.cardList[randomNumber])) {
                        tempArray.push(findCardFriend.cardList[randomNumber]);
                    }
                }
                console.log("tempArray", tempArray);
                // tempOrder에 랜덤숫자 8개를 뽑아준다.
                while (tempOrder.length < this.amountCard) {
                    let randomNumber = Math.floor(Math.random() * this.amountCard);
                    if (!tempOrder.includes(randomNumber)) {
                        tempOrder.push(randomNumber);
                    }
                }
                console.log("tempOrder", tempOrder);
                // this.randomCardOrder에 tempOrder를 가져와서 tempArray에 있는 카드를 넣어준다. 한 번의 두 개씩.
                for (let i = 0; i < this.amountCard / 2; i++) {
                    this.randomCardOrder[tempOrder[i]] = tempArray[i].name;
                    this.randomCardOrder[tempOrder[i + (this.amountCard / 2)]] = tempArray[i].name;
                }
                console.log("randomCardOrder", this.randomCardOrder);
                // this.correctAnswer 만들기(정복 X)
                for (let i = 0; i < this.randomCardOrder.length; i++) {
                    let rowValue = Math.floor(i / this.gameStateArray[0].length);
                    let colValue = i % this.gameStateArray[0].length;
                    this.correctAnswer[rowValue][colValue] = this.randomCardOrder[i];
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
        // 게임 컨트롤 관련 함수들
        gameControl = () => {
            const startReadyTime = () => {
                const nowTimeInfo = new Date();
                const endTimeInfo = nowTimeInfo.getTime() + (this.remainTime * 1000);
                const checkEndReadyTime = () => {
                    console.log("dajlfdkijflkj");
                    if (nowTimeInfo.getTime() > endTimeInfo) {
                        for (let i = 0; i < this.gameStateArray.length; i++) {
                            for (j = 0; i < this.gameStateArray[0].length; j++) {
                                this.gameStateArray[i][j] = 0;
                                // this.gameControl();
                                // this.remainTime = findCardFriend.timeLimit;
                                // document.getElementById("currentRemainTime").innerHTML = cardMatchGame.formatTime(this.remainTime);
                                // clearInterval(checkEndReadyTime);
                            }
                        }
                    }
                    this.remainTime--;
                    document.getElementById('currentRemainTime').innerHTML = findCardFriend.formatTime(this.remainTime);
                }
                setInterval(checkEndReadyTime(), 1000);
            }
            const resetGameCard = () => {
                while (findCardFriend.cardDisplayDom.firstChild) {
                    findCardFriend.cardDisplayDom.removeChild(findCardFriend.cardDisplayDom.firstChild);
                }
            }
            const visualizeCardList = () => {
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
            }
            const giveRandomUrl = () => {
                const cardNodeList = document.querySelectorAll('.cardElementCol');
                for (let i = 0; i < this.amountCard; i++) {
                    if (cardNodeList[i].classList.contains("nowChoicedCard")) {
                        cardNodeList[i].style.backgroundImage = `url('../res/cardImage/${this.randomCardOrder[i]}.png')`;
                    }
                }
            }
            const giveCardClickEvent = () => {
                const cardNodeList = document.querySelectorAll('.cardElementCol');
                cardNodeList.forEach(v => {
                    v.addEventListener("click", e => {
                        const [rowIndex, colIndex] = e.target.id.split('_');
                        this.gameStateArray[Number(rowIndex)][Number(colIndex)] = 1;
                        this.gameControl();
                    });
                })
            }
            const changeClickFlag = () => {
                const cardNodeList = document.querySelectorAll('.cardElementCol');
                cardNodeList.forEach(v => {
                    v.addEventListener("click", e => {
                        this.clickFlag = !this.clickFlag;
                        console.log(this.clickFlag)
                    });
                });
            }
            resetGameCard();
            visualizeCardList();
            giveRandomUrl();
            giveCardClickEvent();
            changeClickFlag();
            startReadyTime();
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
