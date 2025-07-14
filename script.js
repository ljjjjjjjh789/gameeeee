// 게임 데이터: 질문과 해당 버튼 텍스트
const questions = [
  {
     id: 0,
     buttonImage: "003.png", // 버튼 텍스트 변경
     question: "홈코의 서비스에 전반적으로 만족하시나요?", // 질문 변경
     answered: false,
     answers: ["매우 만족", "만족", "보통", "불만족", "매우 불만족"] // 새로운 답변 목록 추가
 },
 {
    id: 1,
    buttonImage: "005.png", // 버튼 텍스트 변경
    question: "홈코의 전화 상담은 얼마나 만족하시나요?", // 질문 변경
    answered: false,
    answers: ["매우 만족", "만족", "보통", "불만족", "매우 불만족"] // 새로운 답변 목록 추가
},
{
   id: 2,
   buttonImage: "007.png", // 버튼 텍스트 변경
   question: "홈코의 견적 및 일정 조율은 얼마나 만족하시나요?", // 질문 변경
   answered: false,
   answers: ["매우 만족", "만족", "보통", "불만족", "매우 불만족"] // 새로운 답변 목록 추가
},
{
   id: 3,
   buttonImage: "009.png", // 버튼 텍스트 변경
   question: "홈코의 현장 시공 서비스는 얼마나 만족하시나요?", // 질문 변경
   answered: false,
   answers: ["매우 만족", "만족", "보통", "불만족", "매우 불만족"] // 새로운 답변 목록 추가
},
{
   id: 4,
   buttonImage: "011.png", // 버튼 텍스트 변경
   question: "홈코를 어떻게 알고 찾아주셨나요?", // 질문 변경
   answered: false,
   answers: ["네이버 검색", "구글 검색", "지인 추천", "관리 사무소 추천", "부동산 추천", "기타"] // 새로운 답변 목록 추가
},
{
   id: 5,
   buttonImage: "013.png", // 버튼 텍스트 변경
   question: "홈코 서비스 과정에서 조금 더 개선되었으면 하는 점은 무엇인가요?", // 질문 변경
   answered: false,
   answers: ["상담 과정", "견적 정확성", "시공 품질", "일정 조율", "사후 서비스", "없음", "기타"] // 새로운 답변 목록 추가
}
];

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz61uAJN-i37keDTpAcGlcnAfugJSM_hjOIoUdivj_jEZK3FAXt5FLkCVeKbkFXui4z/exec";

// HTML 요소 가져오기 (새로운 answer-buttons-container 추가)
const buttonContainer = document.getElementById('button-container');
const questionArea = document.getElementById('question-area');
const questionText = document.getElementById('question-text');
const answerButtonsContainer = document.getElementById('answer-buttons-container'); // 새로 추가
const gameEndMessage = document.getElementById('game-end-message');

// 기존의 answerYesBtn, answerNoBtn 변수는 이제 사용하지 않으므로 제거하거나 주석 처리하세요.
// const answerYesBtn = document.getElementById('answer-yes');
// const answerNoBtn = document.getElementById('answer-no');

let currentQuestionId = null; // 현재 활성화된 질문의 ID

// --- 함수 정의 ---

// 1. 초기 게임 버튼 생성
// 1. 초기 게임 버튼 생성
function createGameButtons() {
    buttonContainer.innerHTML = ''; // 기존 버튼 모두 제거
    questions.forEach(q => {
        if (!q.answered) { // 아직 답변하지 않은 질문만 버튼으로 만듦
            const button = document.createElement('button');
            button.className = 'game-button';

            // 이미지 버튼인지 텍스트 버튼인지 확인
            if (q.buttonImage) {
                const img = document.createElement('img');
                img.src = q.buttonImage;
                img.alt = q.buttonText || "버튼 이미지"; // alt 텍스트 추가 (선택 사항)
                img.style.width = '80px'; // 이미지 크기 조절 (원하는 크기로 조절하세요)
                img.style.height = '80px'; // 이미지 크기 조절
                img.style.display = 'block'; // 이미지를 블록 요소로 만들어 중앙 정렬하기 쉽게
                img.style.margin = '0 auto'; // 이미지를 가로 중앙 정렬

                // 텍스트가 필요하다면 이미지 아래에 추가할 수 있습니다.
                // const textSpan = document.createElement('span');
                // textSpan.textContent = q.buttonText || '';
                // button.appendChild(img);
                // if (textSpan.textContent) {
                //     button.appendChild(document.createElement('br')); // 줄 바꿈
                //     button.appendChild(textSpan);
                // }

                // 현재는 이미지만 표시하도록
                button.appendChild(img);


            } else {
                button.textContent = q.buttonText;
            }

            button.dataset.questionId = q.id; // 어떤 질문과 연결된 버튼인지 저장
            button.addEventListener('click', () => handleButtonClick(q.id));
            buttonContainer.appendChild(button);
        }
    });
    // 모든 질문에 답했는지 확인
    checkGameEnd();
}

// 2. 버튼 클릭 시 질문 표시
function handleButtonClick(id) {
    currentQuestionId = id;
    const questionData = questions.find(q => q.id === id);

    if (questionData) {
        questionText.textContent = questionData.question;

        // 이전 답변 버튼들을 모두 지웁니다 (중요!)
        answerButtonsContainer.innerHTML = '';

        // 현재 질문에 맞는 답변 버튼들을 동적으로 생성합니다.
        questionData.answers.forEach(answerText => {
            const button = document.createElement('button');
            button.textContent = answerText;
            button.className = 'answer-button'; // CSS 스타일링을 위한 클래스 추가
            button.addEventListener('click', () => handleAnswer(answerText));
            answerButtonsContainer.appendChild(button);
        });

        buttonContainer.style.display = 'none'; // 질문 버튼 숨김
        questionArea.style.display = 'block';   // 질문 영역 표시
    }
}

// 3. 답변 버튼 클릭 처리 ('예' 또는 '아니오')
// 3. 답변 버튼 클릭 처리 ('예' 또는 '아니오')
function handleAnswer(answer) {
    console.log(`Question ID: ${currentQuestionId}, Answer: ${answer}`);

    const dataToSend = {
        question_id: currentQuestionId,
        user_answer: answer
    };

    // 데이터를 URL-encoded 문자열 형식으로 변환합니다.
    const urlEncodedData = new URLSearchParams(dataToSend).toString();

    fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        // mode: 'cors'를 명시하지 않아도 기본값이 'cors'이지만, 명시해도 됩니다.
        // 이 모드에서는 서버로부터의 응답을 받을 수 있으며, CORS 정책을 따릅니다.
        // 따라서 Apps Script에서 'Access-Control-Allow-Origin' 헤더를 보내줘야 합니다.
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // <-- 이 부분을 이렇게 변경!
        },
        body: urlEncodedData // <-- 데이터를 URL-encoded 형식으로 전송!
    })
    .then(response => {
        // 네트워크 응답이 성공적인지 확인 (HTTP 상태 코드 200번대)
        if (!response.ok) {
            throw new Error(`HTTP 오류! 상태: ${response.status}`);
        }
        // Apps Script가 JSON 응답을 보낼 것이므로 JSON으로 파싱합니다.
        return response.json();
    })
    .then(data => {
        console.log('데이터 전송 성공:', data);
        // Apps Script에서 'result: "success"'와 같은 응답을 보냈을 때 여기서 확인할 수 있습니다.
        // 필요하다면 성공 메시지를 사용자에게 보여줄 수 있습니다.
    })
    .catch(error => {
        console.error('데이터 전송 중 오류 발생:', error);
        // 오류 메시지를 사용자에게 보여줄 수 있습니다.
    });

    // 답변 완료 상태로 변경 및 UI 업데이트 (기존 코드 유지)
    const questionIndex = questions.findIndex(q => q.id === currentQuestionId);
    if (questionIndex !== -1) {
        questions[questionIndex].answered = true;
    }

    questionArea.style.display = 'none';
    buttonContainer.style.display = 'grid';
    createGameButtons();
}
// 4. 게임 종료 조건 확인
function checkGameEnd() {
    const allAnswered = questions.every(q => q.answered);
    if (allAnswered) {
        buttonContainer.style.display = 'none'; // 남은 버튼이 있다면 숨김
        gameEndMessage.style.display = 'block'; // 종료 메시지 표시
    }
}

// --- 이벤트 리스너 연결 ---
//answerYesBtn.addEventListener('click', () => handleAnswer('예'));
//answerNoBtn.addEventListener('click', () => handleAnswer('아니오'));

// --- 게임 초기화 ---
document.addEventListener('DOMContentLoaded', createGameButtons); // 페이지 로드 시 버튼 생성
