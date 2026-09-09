

var PROVINCES = ["서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시", "대전광역시", "울산광역시", "세종특별자치시", "경기도", "강원특별자치도", "충청북도", "충청남도", "전북특별자치도", "전라남도", "경상북도", "경상남도", "제주특별자치도"];
var SUBJECTS = ["국어", "도덕·윤리", "일반사회", "역사", "지리", "수학", "물리", "화학", "생물", "지구과학", "기술", "가정", "정보·컴퓨터", "체육", "음악", "미술", "영어", "한문", "기타"];
var POP_SHARE = {"경기도": 0.263749, "서울특별시": 0.157127, "부산광역시": 0.061728, "경상남도": 0.058361, "인천광역시": 0.058361, "경상북도": 0.051627, "대구광역시": 0.047138, "충청남도": 0.047138, "전라남도": 0.038159, "전북특별자치도": 0.038159, "강원특별자치도": 0.03367, "충청북도": 0.034792, "대전광역시": 0.031425, "광주광역시": 0.031425, "울산광역시": 0.023569, "제주특별자치도": 0.013468, "세종특별자치시": 0.010101};
var REMOTE_BIAS = {"서울특별시": -35, "부산광역시": -20, "대구광역시": -15, "인천광역시": -20, "광주광역시": -15, "대전광역시": -15, "울산광역시": -15, "세종특별자치시": -10, "경기도": -25, "강원특별자치도": 25, "충청북도": 5, "충청남도": 5, "전북특별자치도": 15, "전라남도": 30, "경상북도": 25, "경상남도": 10, "제주특별자치도": 20};
var SUBJECT_SHARE = {"국어": 0.102, "수학": 0.1, "영어": 0.092, "일반사회": 0.044, "역사": 0.036, "지리": 0.034, "도덕·윤리": 0.03, "물리": 0.034, "화학": 0.034, "생물": 0.035, "지구과학": 0.029, "기술": 0.034, "가정": 0.034, "정보·컴퓨터": 0.04, "체육": 0.072, "음악": 0.046, "미술": 0.046, "한문": 0.018, "기타": 0.14};
var LEVEL_FACTOR = {"전체": 1.0, "초등학교": 0.46, "중학교": 0.27, "고등학교": 0.27};
var LEVELS = ["전체", "초등학교", "중학교", "고등학교"];
var SUBJECT_BIAS = {"정보·컴퓨터": 34, "기술": 29, "가정": 26, "물리": 18, "화학": 12, "지구과학": 9, "생물": 6, "수학": 2, "일반사회": 3, "지리": 0, "역사": -2, "도덕·윤리": -4, "기타": -2, "국어": -6, "한문": -8, "음악": -6, "미술": -6, "체육": -8, "영어": -10};

var NATIONAL_STUDENTS_2026 = 4980000;
var STUDENT_TEACHER_RATIO = 13.2;
var CLASS_SIZE = 22.5;

var LATEST_YEAR = '2026';
var LATEST_MONTH = '07';
var DATA_ASOF = LATEST_YEAR + '.' + LATEST_MONTH;
var BASE_YEAR = 2026;
var FORECAST_YEARS = [2027, 2028, 2029, 2030, 2031];
var CHART_YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031];

var PROV_SHORT = {
  '서울특별시':'서울','부산광역시':'부산','대구광역시':'대구','인천광역시':'인천','광주광역시':'광주',
  '대전광역시':'대전','울산광역시':'울산','세종특별자치시':'세종','경기도':'경기','강원특별자치도':'강원',
  '충청북도':'충북','충청남도':'충남','전북특별자치도':'전북','전라남도':'전남','경상북도':'경북',
  '경상남도':'경남','제주특별자치도':'제주'
};
function provShort(name){ return PROV_SHORT[name] || name; }

function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function seedRand(str){ var h = 0; for (var i = 0; i < str.length; i++){ h = (h * 31 + str.charCodeAt(i)) >>> 0; } return (h % 1000) / 1000; }
function fmt0(n){ return Math.round(n).toLocaleString(); }
function fmt1(n){ return n.toFixed(1); }
function officesOf(prov){ var o = GEO.offices[prov]; return o ? o.map(function(x){ return x.office; }) : []; }
function officeShortName(name){
  return name.replace(/특별자치시$|특별자치도$|광역시$|특별시$/,'').replace(/교육지원청.*$/, '').trim() || name;
}

// diverging color ramp for 수급 차이율 (부족 red .. 균형 neutral .. 과잉 blue)
var DIV_SEQ = ['#de3412','#e97a5f','#f4b7a6','#e9ebec','#aac2da','#5d8bb8','#063a74'];
function divColorOf(ratePct){
  // clamp to [-10, 10], map to 7-step ramp
  var p = clamp(ratePct, -10, 10);
  var idx = Math.round(((p + 10) / 20) * (DIV_SEQ.length - 1));
  return DIV_SEQ[clamp(idx, 0, DIV_SEQ.length - 1)];
}
function divTextOf(ratePct){ var p = clamp(ratePct, -10, 10); return (p <= -6 || p >= 6) ? '#ffffff' : '#1e2124'; }
function gapStatus(ratePct){ return ratePct <= -1.5 ? 'shortage' : ratePct >= 1.5 ? 'surplus' : 'balanced'; }
function gapStatusLabel(status){ return status === 'shortage' ? '부족' : status === 'surplus' ? '과잉' : '균형'; }


window.__DCDATA_READY = true;
