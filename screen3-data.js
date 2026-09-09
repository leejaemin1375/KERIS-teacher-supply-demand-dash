

var PROVINCES = ["서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시", "대전광역시", "울산광역시", "세종특별자치시", "경기도", "강원특별자치도", "충청북도", "충청남도", "전북특별자치도", "전라남도", "경상북도", "경상남도", "제주특별자치도"];
var POP_SHARE = {"경기도": 0.263749, "서울특별시": 0.157127, "부산광역시": 0.061728, "경상남도": 0.058361, "인천광역시": 0.058361, "경상북도": 0.051627, "대구광역시": 0.047138, "충청남도": 0.047138, "전라남도": 0.038159, "전북특별자치도": 0.038159, "강원특별자치도": 0.03367, "충청북도": 0.034792, "대전광역시": 0.031425, "광주광역시": 0.031425, "울산광역시": 0.023569, "제주특별자치도": 0.013468, "세종특별자치시": 0.010101};
var REMOTE_BIAS = {"서울특별시": -35, "부산광역시": -20, "대구광역시": -15, "인천광역시": -20, "광주광역시": -15, "대전광역시": -15, "울산광역시": -15, "세종특별자치시": -10, "경기도": -25, "강원특별자치도": 25, "충청북도": 5, "충청남도": 5, "전북특별자치도": 15, "전라남도": 30, "경상북도": 25, "경상남도": 10, "제주특별자치도": 20};
var LEVEL_FACTOR = {"전체": 1.0, "초등학교": 0.46, "중학교": 0.27, "고등학교": 0.27};
var LEVELS = ["전체", "초등학교", "중학교", "고등학교"];

var LATEST_YEAR = '2026';
var LATEST_MONTH = '07';
var DATA_ASOF = LATEST_YEAR + '.' + LATEST_MONTH;

var LEVEL_BIAS = { '전체': 0, '초등학교': 4, '중학교': -2, '고등학교': -6 };
var SIZES3 = ['대규모', '중규모', '소규모'];
var SIZE_ADJ = { '대규모': -8, '중규모': 0, '소규모': 10 };
var SCALE = { total: 80, new: 22, early: 24, contract: 34 };
var ORANGE_SEQ = ['#e2e9f1','#c0d0e2','#93aecb','#5d84b0','#1c589c','#063a74'];
var BUCKET_EDGES = [0, 10, 20, 30, 40, 50, 60, 101];
var BUCKET_LABELS = ['0-10%', '10-20%', '20-30%', '30-40%', '40-50%', '50-60%', '60%+'];

var PROV_SHORT = {
  '서울특별시': '서울', '부산광역시': '부산', '대구광역시': '대구', '인천광역시': '인천', '광주광역시': '광주',
  '대전광역시': '대전', '울산광역시': '울산', '세종특별자치시': '세종', '경기도': '경기', '강원특별자치도': '강원',
  '충청북도': '충북', '충청남도': '충남', '전북특별자치도': '전북', '전라남도': '전남', '경상북도': '경북',
  '경상남도': '경남', '제주특별자치도': '제주'
};
function provShort(name){ return PROV_SHORT[name] || name; }
function officeShortName(name){
  return name.replace(/특별자치시$|특별자치도$|광역시$|특별시$/, '').replace(/교육지원청.*$/, '').trim() || name;
}

function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function seedRand(str){ var h = 0; for (var i = 0; i < str.length; i++){ h = (h * 31 + str.charCodeAt(i)) >>> 0; } return (h % 1000) / 1000; }
// better-mixed hash (murmur3 fmix32) — used only for the per-school simulation noise below, where
// consecutive school indices need to be decorrelated; seedRand's simple multiply-hash gives a
// near-monotonic sequence for consecutive numeric suffixes, which would bias whole regions' schools
// toward all-over or all-under instead of a realistic spread.
function mixRand(str){
  var h = 0; for (var i = 0; i < str.length; i++){ h = (h * 131 + str.charCodeAt(i)) >>> 0; }
  h = (h ^ (h >>> 15)) >>> 0; h = (h * 2246822519) >>> 0;
  h = (h ^ (h >>> 13)) >>> 0; h = (h * 3266489917) >>> 0;
  h = (h ^ (h >>> 16)) >>> 0;
  return (h >>> 0) / 4294967295;
}
function fmt0(n){ return Math.round(n).toLocaleString(); }
function fmt1(n){ return n.toFixed(1); }
function officesOf(prov){ var o = GEO.offices[prov]; return o ? o.map(function(x){ return x.office; }) : []; }
function orangeColorOf(pct){
  var p = clamp(pct, 0, 100);
  var idx = Math.min(ORANGE_SEQ.length - 1, Math.floor((p / 100) * ORANGE_SEQ.length));
  return ORANGE_SEQ[idx];
}
function orangeTextOf(pct){ return pct >= 62 ? '#ffffff' : '#1e2124'; }


window.__DCDATA_READY = true;
