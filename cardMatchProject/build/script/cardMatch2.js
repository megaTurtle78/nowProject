(function main() {
    class GameSupporter {
        static formatTime(timeParam) {
            const minutesValue = String(Math.floor(timeParam / 60));
            const secondsValue = String(timeParam % 60).padStart(2, '0');
            return `${minutesValue}:${secondsValue}`;
        }
    }
    class CardMatchGameMaker {
        constructor(identifier) {
            this.id = identifier;
            this.startLevel = 1;
            this.endLevel = 20;
            this.timeLimit = 300;
            this.readyTime = 10;
            this.penaltyTime = 5;
            this.currentScore = 0;
            this.cardList = [];
        }
        run() {
            console.log('merong~');
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

        // cardList.json 불러오기
        let responseObject = "";
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '../script/cardList.json');
        xhr.send();
        xhr.onreadystatechange = function () {
            if(xhr.readyState !== XMLHttpRequest.DONE) return;
            if(xhr.status === 200 ) {
                responseObject = JSON.parse(xhr.responseText);
                console.log(responseObject);
            } else {
                console.log("error!!");
            }
        }
        //

        findCardFriend.run();
        document.querySelector(".gameStartBox").style.display = "none";
    });
    const findCardFriend = new CardMatchGameMaker('findCardFriend');
})();