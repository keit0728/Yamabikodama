// グローバル変数宣言
const REPROMPT = '叫んで下さい！';
const END_SPEAKOUT = '下山してやまびこだまを終了します。お疲れ様でした。';

// SDKライブラリを読み込む
const Alexa = require('ask-sdk-core');

// 開始処理を行う
const LaunchRequestHandler = {
    // このHandlerで処理すべきrequestなのかをチェックする
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    // 処理する内容
    handle(handlerInput) {
        const speakOutput = 'やまびこだまへようこそ。あなたは今山頂にいます。叫んでください！';
        return handlerInput.responseBuilder
            .speak(speakOutput) // Alexaが話す
            .reprompt(REPROMPT) // Alexaがユーザーからの応答を待つ
            .getResponse();     // 現時点までに生成されているレスポンスをjson化
    }
};

// Alexaに復唱させる処理を行う
const YamabikoIntentHandler = {
    // このHandlerで処理すべきrequestなのかをチェックする
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'YamabikoIntent';
    },
    // 処理する内容
    handle(handlerInput) {
        
        const yamabiko = handlerInput.requestEnvelope.request.intent.slots.yamabiko.value;  // Alexaに叫ばれた内容を取得
        
        const speakOutput = yamabiko;
        return handlerInput.responseBuilder
            .speak(speakOutput) // Alexaが話す
            .reprompt(REPROMPT) // Alexaがユーザーからの応答を待つ
            .getResponse();     // 現時点までに生成されているレスポンスをjson化
    }
};

// ヘルプ処理を行う(使い方を教えた後、どうしますか？と聞くこととAmazonのルールで決まっている)
const HelpIntentHandler = {
    // このHandlerで処理すべきrequestなのかをチェックする
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    // 処理する内容
    handle(handlerInput) {
        const speakOutput = 'やまびここだまは、あなたが話しかけたことを私に復唱させるスキルです。スキルを終了したい場合は下山したいと話しかけて下さい。それでは山頂に来た気持ちになって叫んで下さい！';

        return handlerInput.responseBuilder
            .speak(speakOutput) // Alexaが話す
            .reprompt(REPROMPT) // Alexaがユーザーからの応答を待つ
            .getResponse();     // 現時点までに生成されているレスポンスをjson化
    }
};

// キャンセル処理を行う
const CancelAndStopIntentHandler = {
    // このHandlerで処理すべきrequestなのかをチェックする
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    // 処理する内容
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(END_SPEAKOUT) // Alexaが話す
            .getResponse();     // 現時点までに生成されているレスポンスをjson化
    }
};

// 終了処理を行う
const SessionEndedRequestHandler = {
    // このHandlerで処理すべきrequestなのかをチェックする
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    // 処理する内容
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(END_SPEAKOUT) // Alexaが話す
            .getResponse();     // 現時点までに生成されているレスポンスをjson化
    }
};

// 何の処理が呼ばれているのかをAlexaが教えてくれる(デバック用)
const IntentReflectorHandler = {
    // このHandlerで処理すべきrequestなのかをチェックする
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    // 処理する内容
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `${intentName}というインテントが呼ばれました。`;

        return handlerInput.responseBuilder
            .speak(speakOutput) // Alexaが話す
            .getResponse();     // 現時点までに生成されているレスポンスをjson化
    }
};

// エラー処理
const ErrorHandler = {
    // このHandlerで処理すべきrequestなのかをチェックする
    canHandle() {
        return true;
    },
    // 処理する内容
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `すみません、まだ山頂にたどり着いていなかったみたいです。もう一度叫んで下さい！`;

        return handlerInput.responseBuilder
            .speak(speakOutput)     // Alexaが話す
            .reprompt(speakOutput)  // Alexaがユーザーからの応答を待つ
            .getResponse();         // 現時点までに生成されているレスポンスをjson化
    }
};

// スキルビルダーオブジェクトを生成する(おまじない)
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(    // Alexaに話しかけたとき、ここに書かれているHandlerを上から順に処理していく
        LaunchRequestHandler,
        YamabikoIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler,
    )
    .addErrorHandlers(  // エラーのとき
        ErrorHandler,
    )
    .lambda();
