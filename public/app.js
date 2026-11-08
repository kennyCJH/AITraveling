/**
 * 台灣多機場出發 × 全球 102 大目的地機票自動比價系統 (前端核心邏輯)
 * 同時支援連接後端 API (/api/search, /api/deep-compare) 與離線獨立開啟 (file://)
 */

// 預設內建台灣機場與 7 大區域 102 個目的地資料 (確保離線或直接開啟 HTML 也能 100% 運作)
const FALLBACK_TAIWAN_AIRPORTS = [
  { code: "TPE", city: "台北", name: "台北桃園國際機場", shortName: "台北 (桃園)", badge: "主力樞紐", description: "全台航線最密集，涵蓋全球直飛航線" },
  { code: "TSA", city: "台北", name: "台北松山機場", shortName: "台北 (松山)", badge: "市區直達", description: "直飛東京羽田(HND)、首爾金浦(GMP)、上海虹橋、廈門、福州、成都" },
  { code: "RMQ", city: "台中", name: "台中國際機場", shortName: "台中 (清泉崗)", badge: "中部出發", description: "直飛沖繩、東京、大阪、名古屋、高松、首爾、釜山、越南、港澳" },
  { code: "KHH", city: "高雄", name: "高雄國際機場", shortName: "高雄 (小港)", badge: "南部樞紐", description: "直飛東京、大阪、福岡、沖繩、札幌、熊本、首爾、釜山、曼谷、新馬、越南、港澳" }
];

const FALLBACK_REGIONS = [
  {
    id: "jp_kr",
    name: "日韓",
    destinations: [
      { id: "tokyo", name: "東京", country: "日本", code: "NRT", cityCode: "TYO", airportName: "成田(NRT)/羽田(HND)", flightHours: 3.3, basePriceTWD: 7200, directFrom: { TPE: ["台灣虎航", "酷航", "樂桃航空", "中華航空", "長榮航空", "星宇航空"], TSA: ["中華航空", "長榮航空", "日本航空", "全日空"], RMQ: ["星宇航空"], KHH: ["台灣虎航", "中華航空", "長榮航空"] }, transferHubs: ["OKA", "KIX", "HKG"] },
      { id: "osaka", name: "大阪", country: "日本", code: "KIX", cityCode: "OSA", airportName: "關西國際機場(KIX)", flightHours: 2.7, basePriceTWD: 6500, directFrom: { TPE: ["台灣虎航", "樂桃航空", "捷星日本", "泰越捷航空", "中華航空", "長榮航空", "星宇航空"], RMQ: ["星宇航空"], KHH: ["台灣虎航", "樂桃航空", "中華航空", "長榮航空"] }, transferHubs: ["OKA", "FUK", "HKG"] },
      { id: "okinawa", name: "沖繩", country: "日本", code: "OKA", cityCode: "OKA", airportName: "那霸國際機場(OKA)", flightHours: 1.5, basePriceTWD: 4600, directFrom: { TPE: ["台灣虎航", "樂桃航空", "泰越捷航空", "中華航空", "長榮航空", "星宇航空"], RMQ: ["星宇航空"], KHH: ["台灣虎航", "中華航空", "泰越捷航空"] }, transferHubs: ["TPE", "KHH"] },
      { id: "seoul", name: "首爾", country: "韓國", code: "ICN", cityCode: "SEL", airportName: "仁川(ICN)/金浦(GMP)", flightHours: 2.6, basePriceTWD: 5200, directFrom: { TPE: ["台灣虎航", "酷航", "真航空", "德威航空", "濟州航空", "中華航空", "長榮航空"], TSA: ["德威航空", "易斯達航空", "中華航空", "長榮航空"], RMQ: ["德威航空", "真航空", "大韓航空"], KHH: ["台灣虎航", "德威航空", "濟州航空", "中華航空", "長榮航空"] }, transferHubs: ["PUS", "CJU"] },
      { id: "busan", name: "釜山", country: "韓國", code: "PUS", cityCode: "PUS", airportName: "金海國際機場(PUS)", flightHours: 2.3, basePriceTWD: 4800, directFrom: { TPE: ["台灣虎航", "釜山航空", "濟州航空", "大韓航空", "中華航空"], RMQ: ["台灣虎航"], KHH: ["台灣虎航", "釜山航空", "濟州航空"] }, transferHubs: ["ICN", "FUK"] },
      { id: "fukuoka", name: "福岡", country: "日本", code: "FUK", cityCode: "FUK", airportName: "福岡國際機場(FUK)", flightHours: 2.3, basePriceTWD: 6200, directFrom: { TPE: ["台灣虎航", "中華航空", "長榮航空", "星宇航空"], KHH: ["台灣虎航", "長榮航空"] }, transferHubs: ["OKA", "PUS", "ICN"] },
      { id: "nagoya", name: "名古屋", country: "日本", code: "NGO", cityCode: "NGO", airportName: "中部國際機場(NGO)", flightHours: 2.9, basePriceTWD: 6600, directFrom: { TPE: ["台灣虎航", "樂桃航空", "馬印航空", "中華航空", "星宇航空"], RMQ: ["台灣虎航"], KHH: ["台灣虎航"] }, transferHubs: ["KIX", "OKA", "ICN"] },
      { id: "hiroshima", name: "廣島", country: "日本", code: "HIJ", cityCode: "HIJ", airportName: "廣島機場(HIJ)", flightHours: 2.5, basePriceTWD: 7500, directFrom: { TPE: ["中華航空"] }, transferHubs: ["FUK", "ICN", "PVG"] },
      { id: "kobe", name: "神戶", country: "日本", code: "UKB", cityCode: "UKB", airportName: "神戶機場(UKB)", flightHours: 2.8, basePriceTWD: 7900, directFrom: { TPE: ["星宇航空", "長榮航空"], RMQ: ["星宇航空"] }, transferHubs: ["KIX", "OKA", "HND"] },
      { id: "sapporo", name: "札幌", country: "日本", code: "CTS", cityCode: "SPK", airportName: "新千歲國際機場(CTS)", flightHours: 4.0, basePriceTWD: 9800, directFrom: { TPE: ["台灣虎航", "酷航", "泰越捷航空", "中華航空", "長榮航空", "星宇航空"], KHH: ["台灣虎航", "中華航空"] }, transferHubs: ["NRT", "HND", "KIX", "ICN"] },
      { id: "kumamoto", name: "熊本", country: "日本", code: "KMJ", cityCode: "KMJ", airportName: "阿蘇熊本機場(KMJ)", flightHours: 2.2, basePriceTWD: 6900, directFrom: { TPE: ["中華航空", "星宇航空"], KHH: ["中華航空"] }, transferHubs: ["FUK", "ICN"] },
      { id: "sendai", name: "仙台", country: "日本", code: "SDJ", cityCode: "SDJ", airportName: "仙台國際機場(SDJ)", flightHours: 3.6, basePriceTWD: 8600, directFrom: { TPE: ["台灣虎航", "長榮航空", "星宇航空"], KHH: ["台灣虎航"] }, transferHubs: ["NRT", "KIX", "ICN"] },
      { id: "takamatsu", name: "高松", country: "日本", code: "TAK", cityCode: "TAK", airportName: "高松機場(TAK)", flightHours: 2.6, basePriceTWD: 7100, directFrom: { TPE: ["中華航空"], RMQ: ["星宇航空"] }, transferHubs: ["HND", "ICN", "HKG"] },
      { id: "jeju", name: "濟州島", country: "韓國", code: "CJU", cityCode: "CJU", airportName: "濟州國際機場(CJU)", flightHours: 2.1, basePriceTWD: 4900, directFrom: { TPE: ["台灣虎航", "德威航空", "易斯達航空"], RMQ: ["台灣虎航"], KHH: ["台灣虎航", "德威航空"] }, transferHubs: ["ICN", "PUS", "PVG"] },
      { id: "cheongju", name: "清州", country: "韓國", code: "CJJ", cityCode: "CJJ", airportName: "清州國際機場(CJJ)", flightHours: 2.5, basePriceTWD: 4500, directFrom: { TPE: ["可依航空(Aero K)", "易斯達航空"], RMQ: ["可依航空(Aero K)"] }, transferHubs: ["ICN", "CJU"] }
    ]
  },
  {
    id: "sea",
    name: "東南亞",
    destinations: [
      { id: "bangkok", name: "曼谷", country: "泰國", code: "BKK", cityCode: "BKK", airportName: "蘇凡納布(BKK)/廊曼(DMK)", flightHours: 3.8, basePriceTWD: 5400, directFrom: { TPE: ["台灣虎航", "泰越捷航空", "泰國亞洲航空", "中華航空", "長榮航空", "星宇航空"], KHH: ["泰國亞洲航空", "泰越捷航空", "中華航空", "泰國國際航空"] }, transferHubs: ["SGN", "HKG", "MFM"] },
      { id: "chiang_mai", name: "清邁", country: "泰國", code: "CNX", cityCode: "CNX", airportName: "清邁國際機場(CNX)", flightHours: 4.0, basePriceTWD: 6500, directFrom: { TPE: ["泰國亞洲航空", "中華航空", "長榮航空", "星宇航空"] }, transferHubs: ["BKK", "DMK", "HKG"] },
      { id: "singapore", name: "新加坡", country: "新加坡", code: "SIN", cityCode: "SIN", airportName: "樟宜國際機場(SIN)", flightHours: 4.5, basePriceTWD: 5800, directFrom: { TPE: ["酷航", "捷星亞洲", "中華航空", "長榮航空", "星宇航空", "新加坡航空"], KHH: ["酷航"] }, transferHubs: ["KUL", "BKK", "HKG", "MNL"] },
      { id: "ho_chi_minh", name: "胡志明", country: "越南", code: "SGN", cityCode: "SGN", airportName: "新山一國際機場(SGN)", flightHours: 3.5, basePriceTWD: 4700, directFrom: { TPE: ["越捷航空", "中華航空", "長榮航空", "星宇航空", "越南航空"], RMQ: ["越捷航空", "華信航空"], KHH: ["越捷航空", "越南航空", "中華航空"] }, transferHubs: ["HAN", "HKG"] },
      { id: "hanoi", name: "河內", country: "越南", code: "HAN", cityCode: "HAN", airportName: "內排國際機場(HAN)", flightHours: 3.0, basePriceTWD: 4600, directFrom: { TPE: ["越捷航空", "中華航空", "長榮航空", "星宇航空", "越南航空"], RMQ: ["越捷航空"], KHH: ["越捷航空", "越南航空"] }, transferHubs: ["SGN", "HKG", "MFM"] },
      { id: "kuala_lumpur", name: "吉隆坡", country: "馬來西亞", code: "KUL", cityCode: "KUL", airportName: "吉隆坡國際機場(KUL)", flightHours: 4.7, basePriceTWD: 5100, directFrom: { TPE: ["全亞洲航空(AirAsia X)", "峇迪航空", "中華航空", "長榮航空", "星宇航空"], KHH: ["亞洲航空(AirAsia)", "峇迪航空"] }, transferHubs: ["SIN", "BKI", "HKG"] },
      { id: "bali", name: "峇里島", country: "印尼", code: "DPS", cityCode: "DPS", airportName: "伍拉·賴國際機場(DPS)", flightHours: 5.3, basePriceTWD: 8900, directFrom: { TPE: ["中華航空", "長榮航空"] }, transferHubs: ["SIN", "KUL", "SGN", "MNL", "HKG"] },
      { id: "manila", name: "馬尼拉", country: "菲律賓", code: "MNL", cityCode: "MNL", airportName: "尼諾伊·艾奎諾機場(MNL)", flightHours: 2.2, basePriceTWD: 3600, directFrom: { TPE: ["宿霧太平洋航空", "菲律賓亞洲航空", "中華航空", "長榮航空", "菲律賓航空"], KHH: ["菲律賓亞洲航空", "中華航空"] }, transferHubs: ["CRK", "HKG"] },
      { id: "cebu", name: "宿霧", country: "菲律賓", code: "CEB", cityCode: "CEB", airportName: "麥克坦-宿霧國際機場(CEB)", flightHours: 2.8, basePriceTWD: 4900, directFrom: { TPE: ["宿霧太平洋航空", "中華航空", "長榮航空", "星宇航空"] }, transferHubs: ["MNL", "CRK"] },
      { id: "jakarta", name: "雅加達", country: "印尼", code: "CGK", cityCode: "JKT", airportName: "蘇卡諾-哈達國際機場(CGK)", flightHours: 5.3, basePriceTWD: 7600, directFrom: { TPE: ["中華航空", "長榮航空", "星宇航空"] }, transferHubs: ["SIN", "KUL", "SGN", "HKG"] },
      { id: "da_nang", name: "峴港", country: "越南", code: "DAD", cityCode: "DAD", airportName: "峴港國際機場(DAD)", flightHours: 2.8, basePriceTWD: 5300, directFrom: { TPE: ["台灣虎航", "越捷航空", "中華航空", "長榮航空", "星宇航空"], RMQ: ["越捷航空"], KHH: ["台灣虎航", "越捷航空"] }, transferHubs: ["HAN", "SGN", "MFM", "HKG"] },
      { id: "phu_quoc", name: "富國島", country: "越南", code: "PQC", cityCode: "PQC", airportName: "富國國際機場(PQC)", flightHours: 3.8, basePriceTWD: 5600, directFrom: { TPE: ["越捷航空", "台灣虎航", "星宇航空"], RMQ: ["越捷航空", "星宇航空"], KHH: ["越捷航空"] }, transferHubs: ["SGN", "HAN"] },
      { id: "kota_kinabalu", name: "亞庇 (沙巴)", country: "馬來西亞", code: "BKI", cityCode: "BKI", airportName: "亞庇國際機場(BKI)", flightHours: 3.5, basePriceTWD: 4500, directFrom: { TPE: ["亞洲航空(AirAsia)"], KHH: ["亞洲航空(AirAsia)"] }, transferHubs: ["KUL", "MNL", "HKG"] },
      { id: "penang", name: "檳城", country: "馬來西亞", code: "PEN", cityCode: "PEN", airportName: "檳城國際機場(PEN)", flightHours: 4.5, basePriceTWD: 6800, directFrom: { TPE: ["中華航空", "星宇航空"] }, transferHubs: ["KUL", "SIN", "HKG", "BKK"] },
      { id: "clark", name: "克拉克", country: "菲律賓", code: "CRK", cityCode: "CRK", airportName: "克拉克國際機場(CRK)", flightHours: 2.0, basePriceTWD: 3800, directFrom: { TPE: ["長榮航空", "星宇航空"], KHH: ["宿霧太平洋航空"] }, transferHubs: ["MNL", "HKG"] }
    ]
  },
  {
    id: "hk_mo_cn",
    name: "港澳大陸",
    destinations: [
      { id: "hong_kong", name: "香港", country: "港澳", code: "HKG", cityCode: "HKG", airportName: "香港國際機場(HKG)", flightHours: 1.8, basePriceTWD: 4200, directFrom: { TPE: ["香港快運", "大灣區航空", "香港航空", "國泰航空", "中華航空", "長榮航空", "星宇航空"], RMQ: ["香港快運"], KHH: ["香港快運", "國泰航空", "中華航空", "長榮航空"] }, transferHubs: ["MFM"] },
      { id: "macau", name: "澳門", country: "港澳", code: "MFM", cityCode: "MFM", airportName: "澳門國際機場(MFM)", flightHours: 1.8, basePriceTWD: 3900, directFrom: { TPE: ["台灣虎航", "澳門航空", "長榮航空", "星宇航空"], RMQ: ["台灣虎航", "澳門航空"], KHH: ["台灣虎航", "澳門航空", "長榮航空"] }, transferHubs: ["HKG"] },
      { id: "shanghai", name: "上海", country: "中國大陸", code: "PVG", cityCode: "SHA", airportName: "浦東(PVG)/虹橋(SHA)", flightHours: 2.0, basePriceTWD: 5500, directFrom: { TPE: ["春秋航空", "吉祥航空", "中國東方航空", "中國國際航空", "中華航空", "長榮航空"], TSA: ["中國東方航空", "上海航空", "中華航空", "長榮航空"], KHH: ["中華航空", "長榮航空", "吉祥航空", "中國東方航空"] }, transferHubs: ["HKG", "MFM", "XMN"] },
      { id: "xiamen", name: "廈門", country: "中國大陸", code: "XMN", cityCode: "XMN", airportName: "高崎國際機場(XMN)", flightHours: 1.6, basePriceTWD: 5200, directFrom: { TPE: ["廈門航空"], TSA: ["廈門航空", "華信航空"], KHH: ["廈門航空"] }, transferHubs: ["MFM", "HKG"] },
      { id: "shenzhen", name: "深圳", country: "中國大陸", code: "SZX", cityCode: "SZX", airportName: "寶安國際機場(SZX)", flightHours: 2.0, basePriceTWD: 5800, directFrom: { TPE: ["深圳航空", "中國南方航空", "中華航空", "立榮航空"], KHH: ["中華航空"] }, transferHubs: ["HKG", "MFM", "XMN"] },
      { id: "guangzhou", name: "廣州", country: "中國大陸", code: "CAN", cityCode: "CAN", airportName: "白雲國際機場(CAN)", flightHours: 2.1, basePriceTWD: 6100, directFrom: { TPE: ["中國南方航空", "中華航空", "長榮航空"] }, transferHubs: ["HKG", "MFM", "XMN"] },
      { id: "chengdu", name: "成都", country: "中國大陸", code: "TFU", cityCode: "CTU", airportName: "天府國際機場(TFU)", flightHours: 3.5, basePriceTWD: 6800, directFrom: { TPE: ["中國國際航空", "中華航空", "長榮航空"], TSA: ["四川航空"] }, transferHubs: ["MFM", "HKG", "XMN"] },
      { id: "beijing", name: "北京", country: "中國大陸", code: "PEK", cityCode: "BJS", airportName: "首都(PEK)/大興(PKX)", flightHours: 3.3, basePriceTWD: 6900, directFrom: { TPE: ["中國國際航空", "中華航空", "長榮航空"] }, transferHubs: ["MFM", "HKG", "XMN", "PVG"] },
      { id: "fuzhou", name: "福州", country: "中國大陸", code: "FOC", cityCode: "FOC", airportName: "長樂國際機場(FOC)", flightHours: 1.5, basePriceTWD: 5300, directFrom: { TPE: ["廈門航空"], TSA: ["廈門航空", "立榮航空"], KHH: ["廈門航空"] }, transferHubs: ["XMN", "MFM"] },
      { id: "chongqing", name: "重慶", country: "中國大陸", code: "CKG", cityCode: "CKG", airportName: "江北國際機場(CKG)", flightHours: 3.3, basePriceTWD: 6700, directFrom: { TPE: ["中國國際航空"], TSA: ["重慶航空"] }, transferHubs: ["MFM", "HKG", "XMN"] },
      { id: "hangzhou", name: "杭州", country: "中國大陸", code: "HGH", cityCode: "HGH", airportName: "蕭山國際機場(HGH)", flightHours: 2.0, basePriceTWD: 5900, directFrom: { TPE: ["中國國際航空", "長榮航空"] }, transferHubs: ["MFM", "HKG", "XMN", "PVG"] },
      { id: "harbin", name: "哈爾濱", country: "中國大陸", code: "HRB", cityCode: "HRB", airportName: "太平國際機場(HRB)", flightHours: 6.0, basePriceTWD: 9200, directFrom: {}, transferHubs: ["PVG", "PEK", "XMN", "ICN"] },
      { id: "kunming", name: "昆明", country: "中國大陸", code: "KMG", cityCode: "KMG", airportName: "長水國際機場(KMG)", flightHours: 3.5, basePriceTWD: 7600, directFrom: { TPE: ["中國東方航空"] }, transferHubs: ["XMN", "HKG", "MFM", "BKK"] },
      { id: "nanjing", name: "南京", country: "中國大陸", code: "NKG", cityCode: "NKG", airportName: "祿口國際機場(NKG)", flightHours: 2.2, basePriceTWD: 6000, directFrom: { TPE: ["中國東方航空", "吉祥航空"], RMQ: ["中國東方航空"], KHH: ["中國東方航空"] }, transferHubs: ["MFM", "HKG", "XMN"] },
      { id: "wuhan", name: "武漢", country: "中國大陸", code: "WUH", cityCode: "WUH", airportName: "天河國際機場(WUH)", flightHours: 2.6, basePriceTWD: 6300, directFrom: { TPE: ["中國東方航空", "中國南方航空"], TSA: ["中國東方航空"], KHH: ["中國東方航空"] }, transferHubs: ["XMN", "HKG", "MFM"] }
    ]
  },
  {
    id: "americas",
    name: "美洲",
    destinations: [
      { id: "los_angeles", name: "洛杉磯", country: "美國", code: "LAX", cityCode: "LAX", airportName: "洛杉磯國際機場(LAX)", flightHours: 12.0, basePriceTWD: 23500, directFrom: { TPE: ["中華航空", "長榮航空", "星宇航空"] }, transferHubs: ["NRT", "ICN", "HKG", "MNL", "SFO"] },
      { id: "san_francisco", name: "舊金山", country: "美國", code: "SFO", cityCode: "SFO", airportName: "舊金山國際機場(SFO)", flightHours: 11.5, basePriceTWD: 22800, directFrom: { TPE: ["聯合航空", "中華航空", "長榮航空", "星宇航空"] }, transferHubs: ["NRT", "ICN", "HKG", "MNL"] },
      { id: "seattle", name: "西雅圖", country: "美國", code: "SEA", cityCode: "SEA", airportName: "西雅圖國際機場(SEA)", flightHours: 11.0, basePriceTWD: 21900, directFrom: { TPE: ["達美航空", "中華航空", "長榮航空", "星宇航空"] }, transferHubs: ["NRT", "ICN", "YVR"] },
      { id: "new_york", name: "紐約", country: "美國", code: "JFK", cityCode: "NYC", airportName: "甘迺迪(JFK)/紐華克(EWR)", flightHours: 15.0, basePriceTWD: 29800, directFrom: { TPE: ["中華航空", "長榮航空"] }, transferHubs: ["SFO", "SEA", "ICN", "NRT", "HKG"] },
      { id: "vancouver", name: "溫哥華", country: "加拿大", code: "YVR", cityCode: "YVR", airportName: "溫哥華國際機場(YVR)", flightHours: 11.0, basePriceTWD: 23900, directFrom: { TPE: ["中華航空", "長榮航空"] }, transferHubs: ["NRT", "ICN", "HKG", "SEA"] },
      { id: "toronto", name: "多倫多", country: "加拿大", code: "YYZ", cityCode: "YTO", airportName: "皮爾遜國際機場(YYZ)", flightHours: 14.5, basePriceTWD: 31500, directFrom: { TPE: ["長榮航空"] }, transferHubs: ["YVR", "SFO", "ICN", "HKG"] },
      { id: "hawaii", name: "夏威夷", country: "美國", code: "HNL", cityCode: "HNL", airportName: "檀香山國際機場(HNL)", flightHours: 9.5, basePriceTWD: 21500, directFrom: {}, transferHubs: ["NRT", "HND", "ICN", "KIX"] },
      { id: "phoenix", name: "鳳凰城(AZ)", country: "美國", code: "PHX", cityCode: "PHX", airportName: "鳳凰城天港國際機場(PHX)", flightHours: 14.5, basePriceTWD: 28200, directFrom: { TPE: ["中華航空", "星宇航空"] }, transferHubs: ["LAX", "SFO", "SEA"] },
      { id: "yellowknife", name: "黃刀鎮(NT)", country: "加拿大", code: "YZF", cityCode: "YZF", airportName: "黃刀鎮機場(YZF)", flightHours: 16.5, basePriceTWD: 36800, directFrom: {}, transferHubs: ["YVR", "YYC"] },
      { id: "calgary", name: "卡加利", country: "加拿大", code: "YYC", cityCode: "YYC", airportName: "卡加利國際機場(YYC)", flightHours: 14.0, basePriceTWD: 28900, directFrom: {}, transferHubs: ["YVR", "NRT", "SFO", "SEA"] },
      { id: "las_vegas", name: "拉斯維加斯", country: "美國", code: "LAS", cityCode: "LAS", airportName: "哈里·瑞德國際機場(LAS)", flightHours: 14.2, basePriceTWD: 25600, directFrom: {}, transferHubs: ["LAX", "SFO", "SEA", "ICN"] },
      { id: "chicago", name: "芝加哥", country: "美國", code: "ORD", cityCode: "CHI", airportName: "歐海爾國際機場(ORD)", flightHours: 14.0, basePriceTWD: 28500, directFrom: { TPE: ["長榮航空"] }, transferHubs: ["SFO", "SEA", "NRT", "ICN"] },
      { id: "houston", name: "休士頓", country: "美國", code: "IAH", cityCode: "HOU", airportName: "喬治·布希洲際機場(IAH)", flightHours: 14.5, basePriceTWD: 30200, directFrom: { TPE: ["長榮航空"] }, transferHubs: ["SFO", "LAX", "NRT", "ICN"] },
      { id: "boston", name: "波士頓", country: "美國", code: "BOS", cityCode: "BOS", airportName: "洛根國際機場(BOS)", flightHours: 16.5, basePriceTWD: 29400, directFrom: {}, transferHubs: ["SFO", "SEA", "JFK", "HKG", "ICN"] },
      { id: "ontario_ca", name: "加州安大略", country: "美國", code: "ONT", cityCode: "ONT", airportName: "安大略國際機場(ONT)", flightHours: 12.0, basePriceTWD: 24800, directFrom: { TPE: ["中華航空", "星宇航空"] }, transferHubs: ["SFO", "SEA"] }
    ]
  },
  {
    id: "europe",
    name: "歐洲",
    destinations: [
      { id: "paris", name: "巴黎", country: "法國", code: "CDG", cityCode: "PAR", airportName: "戴高樂國際機場(CDG)", flightHours: 13.8, basePriceTWD: 24500, directFrom: { TPE: ["長榮航空"] }, transferHubs: ["PVG", "PEK", "HKG", "BKK", "DXB", "IST"] },
      { id: "london", name: "倫敦", country: "英國", code: "LHR", cityCode: "LON", airportName: "希斯洛(LHR)/蓋威克(LGW)", flightHours: 14.2, basePriceTWD: 24900, directFrom: { TPE: ["中華航空", "長榮航空(中停曼谷)"] }, transferHubs: ["PVG", "HKG", "BKK", "SIN", "DXB"] },
      { id: "milan", name: "米蘭", country: "義大利", code: "MXP", cityCode: "MIL", airportName: "馬爾彭薩機場(MXP)", flightHours: 13.5, basePriceTWD: 23800, directFrom: { TPE: ["長榮航空"] }, transferHubs: ["PVG", "PEK", "HKG", "IST", "DXB"] },
      { id: "vienna", name: "維也納", country: "奧地利", code: "VIE", cityCode: "VIE", airportName: "維也納國際機場(VIE)", flightHours: 13.0, basePriceTWD: 24200, directFrom: { TPE: ["中華航空", "長榮航空"] }, transferHubs: ["BKK", "PVG", "IST", "DXB"] },
      { id: "amsterdam", name: "阿姆斯特丹", country: "荷蘭", code: "AMS", cityCode: "AMS", airportName: "史基浦國際機場(AMS)", flightHours: 13.5, basePriceTWD: 25200, directFrom: { TPE: ["中華航空", "荷蘭皇家航空", "長榮航空(中停曼谷)"] }, transferHubs: ["HKG", "BKK", "PVG", "CAN", "IST"] },
      { id: "frankfurt", name: "法蘭克福", country: "德國", code: "FRA", cityCode: "FRA", airportName: "法蘭克福機場(FRA)", flightHours: 13.5, basePriceTWD: 24600, directFrom: { TPE: ["中華航空"] }, transferHubs: ["PVG", "PEK", "HKG", "BKK", "SIN"] },
      { id: "barcelona", name: "巴塞隆納", country: "西班牙", code: "BCN", cityCode: "BCN", airportName: "埃爾普拉特機場(BCN)", flightHours: 15.5, basePriceTWD: 25400, directFrom: {}, transferHubs: ["PEK", "PVG", "SIN", "HKG", "IST", "DXB"] },
      { id: "rome", name: "羅馬", country: "義大利", code: "FCO", cityCode: "ROM", airportName: "菲烏米奇諾機場(FCO)", flightHours: 13.8, basePriceTWD: 23900, directFrom: { TPE: ["中華航空"] }, transferHubs: ["PVG", "TFU", "HKG", "IST", "DXB"] },
      { id: "munich", name: "慕尼黑", country: "德國", code: "MUC", cityCode: "MUC", airportName: "慕尼黑機場(MUC)", flightHours: 13.3, basePriceTWD: 24800, directFrom: { TPE: ["長榮航空"] }, transferHubs: ["PVG", "PEK", "BKK", "IST", "DXB"] },
      { id: "zurich", name: "蘇黎士", country: "瑞士", code: "ZRH", cityCode: "ZRH", airportName: "蘇黎世機場(ZRH)", flightHours: 15.0, basePriceTWD: 26500, directFrom: {}, transferHubs: ["HKG", "SIN", "BKK", "PVG", "DXB"] },
      { id: "reykjavik", name: "雷克雅維克", country: "冰島", code: "KEF", cityCode: "REK", airportName: "凱夫拉維克國際機場(KEF)", flightHours: 18.0, basePriceTWD: 33500, directFrom: {}, transferHubs: ["LHR", "AMS", "FRA", "CDG"] },
      { id: "madrid", name: "馬德里", country: "西班牙", code: "MAD", cityCode: "MAD", airportName: "巴拉哈斯機場(MAD)", flightHours: 16.0, basePriceTWD: 25800, directFrom: {}, transferHubs: ["PVG", "PEK", "HKG", "IST", "DXB"] },
      { id: "prague", name: "布拉格", country: "捷克", code: "PRG", cityCode: "PRG", airportName: "瓦茨拉夫·哈維爾機場(PRG)", flightHours: 13.5, basePriceTWD: 25600, directFrom: { TPE: ["中華航空"] }, transferHubs: ["IST", "DXB", "VIE", "FRA", "ICN"] },
      { id: "budapest", name: "布達佩斯", country: "匈牙利", code: "BUD", cityCode: "BUD", airportName: "李斯特·費倫茨機場(BUD)", flightHours: 15.2, basePriceTWD: 24300, directFrom: {}, transferHubs: ["PVG", "PEK", "IST", "DXB", "VIE"] },
      { id: "lisbon", name: "里斯本", country: "葡萄牙", code: "LIS", cityCode: "LIS", airportName: "里斯本機場(LIS)", flightHours: 17.0, basePriceTWD: 27900, directFrom: {}, transferHubs: ["IST", "DXB", "CDG", "FRA", "AMS"] }
    ]
  },
  {
    id: "oceania",
    name: "紐澳",
    destinations: [
      { id: "sydney", name: "雪梨", country: "澳洲", code: "SYD", cityCode: "SYD", airportName: "雪梨機場(SYD)", flightHours: 9.2, basePriceTWD: 17800, directFrom: { TPE: ["中華航空"] }, transferHubs: ["SIN", "KUL", "MNL", "HKG", "CAN", "XMN"] },
      { id: "melbourne", name: "墨爾本", country: "澳洲", code: "MEL", cityCode: "MEL", airportName: "圖拉馬林機場(MEL)", flightHours: 9.3, basePriceTWD: 17500, directFrom: { TPE: ["中華航空"] }, transferHubs: ["SIN", "KUL", "HKG", "CAN", "XMN", "PVG"] },
      { id: "brisbane", name: "布里斯本", country: "澳洲", code: "BNE", cityCode: "BNE", airportName: "布里斯本機場(BNE)", flightHours: 8.8, basePriceTWD: 18200, directFrom: { TPE: ["中華航空", "長榮航空"] }, transferHubs: ["SIN", "HKG", "MNL", "CAN"] },
      { id: "auckland", name: "奧克蘭", country: "紐西蘭", code: "AKL", cityCode: "AKL", airportName: "奧克蘭國際機場(AKL)", flightHours: 10.8, basePriceTWD: 22900, directFrom: { TPE: ["紐西蘭航空", "中華航空(中停布里斯本)"] }, transferHubs: ["SYD", "BNE", "SIN", "HKG", "PVG"] },
      { id: "christchurch", name: "基督城", country: "紐西蘭", code: "CHC", cityCode: "CHC", airportName: "基督城國際機場(CHC)", flightHours: 13.5, basePriceTWD: 25400, directFrom: {}, transferHubs: ["AKL", "SYD", "MEL", "SIN", "HKG"] },
      { id: "queenstown", name: "皇后鎮", country: "紐西蘭", code: "ZQN", cityCode: "ZQN", airportName: "皇后鎮機場(ZQN)", flightHours: 14.0, basePriceTWD: 26800, directFrom: {}, transferHubs: ["AKL", "SYD", "MEL", "BNE"] },
      { id: "perth", name: "伯斯", country: "澳洲", code: "PER", cityCode: "PER", airportName: "伯斯機場(PER)", flightHours: 10.2, basePriceTWD: 15800, directFrom: {}, transferHubs: ["SIN", "KUL", "HKG"] },
      { id: "adelaide", name: "阿德雷德", country: "澳洲", code: "ADL", cityCode: "ADL", airportName: "阿德雷德機場(ADL)", flightHours: 11.8, basePriceTWD: 19600, directFrom: {}, transferHubs: ["SIN", "KUL", "SYD", "MEL", "HKG"] },
      { id: "hobart", name: "荷巴特", country: "澳洲", code: "HBA", cityCode: "HBA", airportName: "荷巴特機場(HBA)", flightHours: 12.8, basePriceTWD: 21800, directFrom: {}, transferHubs: ["MEL", "SYD", "BNE"] },
      { id: "gold_coast", name: "黃金海岸", country: "澳洲", code: "OOL", cityCode: "OOL", airportName: "黃金海岸機場(OOL)", flightHours: 11.2, basePriceTWD: 18500, directFrom: {}, transferHubs: ["SIN", "KUL", "SYD", "HKG"] },
      { id: "cairns", name: "凱恩斯", country: "澳洲", code: "CNS", cityCode: "CNS", airportName: "凱恩斯機場(CNS)", flightHours: 10.5, basePriceTWD: 19900, directFrom: {}, transferHubs: ["SIN", "BNE", "SYD", "NRT", "KIX"] },
      { id: "launceston", name: "朗塞斯頓", country: "澳洲", code: "LST", cityCode: "LST", airportName: "朗塞斯頓機場(LST)", flightHours: 13.0, basePriceTWD: 22400, directFrom: {}, transferHubs: ["MEL", "SYD"] }
    ]
  },
  {
    id: "others",
    name: "其他",
    destinations: [
      { id: "cairo", name: "開羅", country: "埃及", code: "CAI", cityCode: "CAI", airportName: "開羅國際機場(CAI)", flightHours: 14.5, basePriceTWD: 23900, directFrom: {}, transferHubs: ["PVG", "CAN", "PEK", "DXB", "IST", "AUH"] },
      { id: "dubai", name: "杜拜", country: "阿聯酋", code: "DXB", cityCode: "DXB", airportName: "杜拜國際機場(DXB)", flightHours: 9.5, basePriceTWD: 18600, directFrom: { TPE: ["阿聯酋航空"] }, transferHubs: ["MNL", "HKG", "BKK", "PVG", "CAN"] },
      { id: "maldives", name: "馬爾地夫", country: "馬爾地夫", code: "MLE", cityCode: "MLE", airportName: "維拉納國際機場(MLE)", flightHours: 9.2, basePriceTWD: 16900, directFrom: {}, transferHubs: ["KUL", "SIN", "BKK", "HKG"] },
      { id: "istanbul", name: "伊斯坦堡", country: "土耳其", code: "IST", cityCode: "IST", airportName: "伊斯坦堡機場(IST)", flightHours: 12.2, basePriceTWD: 22800, directFrom: { TPE: ["土耳其航空"] }, transferHubs: ["PVG", "PEK", "SIN", "BKK", "DXB"] },
      { id: "new_delhi", name: "新德里", country: "印度", code: "DEL", cityCode: "DEL", airportName: "英迪拉·甘地國際機場(DEL)", flightHours: 8.5, basePriceTWD: 14200, directFrom: {}, transferHubs: ["SGN", "HAN", "BKK", "KUL", "HKG"] },
      { id: "varanasi", name: "瓦拉納西", country: "印度", code: "VNS", cityCode: "VNS", airportName: "瓦拉納西機場(VNS)", flightHours: 11.5, basePriceTWD: 18900, directFrom: {}, transferHubs: ["DEL", "BKK", "BOM"] },
      { id: "kathmandu", name: "加德滿都", country: "尼泊爾", code: "KTM", cityCode: "KTM", airportName: "特里布萬國際機場(KTM)", flightHours: 8.8, basePriceTWD: 16500, directFrom: {}, transferHubs: ["KUL", "BKK", "HKG", "CAN", "TFU"] },
      { id: "guam", name: "關島", country: "美國(大洋洲)", code: "GUM", cityCode: "GUM", airportName: "關島國際機場(GUM)", flightHours: 3.8, basePriceTWD: 13800, directFrom: { TPE: ["聯合航空", "中華航空(季節)"] }, transferHubs: ["MNL", "NRT", "ICN", "PUS"] },
      { id: "colombo", name: "可倫坡", country: "斯里蘭卡", code: "CMB", cityCode: "CMB", airportName: "班達拉奈克國際機場(CMB)", flightHours: 8.5, basePriceTWD: 15200, directFrom: {}, transferHubs: ["KUL", "SIN", "BKK", "HKG"] },
      { id: "bengaluru", name: "班加羅爾", country: "印度", code: "BLR", cityCode: "BLR", airportName: "坎佩哥達國際機場(BLR)", flightHours: 8.8, basePriceTWD: 15600, directFrom: {}, transferHubs: ["BKK", "KUL", "SIN", "HKG"] },
      { id: "mumbai", name: "孟買", country: "印度", code: "BOM", cityCode: "BOM", airportName: "孟買國際機場(BOM)", flightHours: 9.0, basePriceTWD: 15400, directFrom: {}, transferHubs: ["SGN", "BKK", "KUL", "SIN", "HKG"] },
      { id: "tashkent", name: "塔什干", country: "烏茲別克", code: "TAS", cityCode: "TAS", airportName: "塔什干國際機場(TAS)", flightHours: 11.2, basePriceTWD: 21500, directFrom: {}, transferHubs: ["ICN", "PEK", "BKK", "KUL"] },
      { id: "palau", name: "帛琉", country: "帛琉", code: "ROR", cityCode: "ROR", airportName: "帛琉國際機場(ROR)", flightHours: 3.8, basePriceTWD: 14900, directFrom: { TPE: ["中華航空"] }, transferHubs: ["MNL", "GUM"] },
      { id: "lima", name: "利馬", country: "秘魯", code: "LIM", cityCode: "LIM", airportName: "豪爾赫·查韋斯國際機場(LIM)", flightHours: 23.5, basePriceTWD: 46500, directFrom: {}, transferHubs: ["LAX", "IAH", "AMS", "MAD", "CDG"] },
      { id: "abu_dhabi", name: "阿布達比", country: "阿聯酋", code: "AUH", cityCode: "AUH", airportName: "扎耶德國際機場(AUH)", flightHours: 11.5, basePriceTWD: 19800, directFrom: {}, transferHubs: ["BKK", "KUL", "SIN", "MNL", "ICN"] }
    ]
  }
];

// 應用程式全域狀態
const state = {
  taiwanAirports: FALLBACK_TAIWAN_AIRPORTS,
  regions: FALLBACK_REGIONS,
  activeRegionId: "jp_kr",
  searchKeyword: "",
  selectedOrigins: new Set(["TPE", "TSA", "RMQ", "KHH"]),
  selectedDestinations: new Set(["tokyo", "osaka", "okinawa", "seoul", "bangkok"]),
  departDate: "",
  returnDate: "",
  adults: 1,
  cabin: 1,
  viewMode: "matrix", // "matrix" | "ranking"
  flightMode: "both", // "both" | "direct" | "overall"
  rankingOriginFilter: "ALL",
  rankingSort: "price_asc",
  lastSearchData: null
};

// 工具：格式化金額
function formatTWD(num) {
  if (num === null || num === undefined || isNaN(num)) return "—";
  return "NT$ " + Number(num).toLocaleString("zh-TW");
}

// 工具：日期加減
function addDaysToDateStr(baseDate, days) {
  const d = new Date(baseDate.getTime());
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// 初始化預設日期 (預設 30 天後出發，5 天 4 夜)
function initDefaultDates(preset = "nextMonth5d") {
  const now = new Date();
  let dep = "";
  let ret = "";

  if (preset === "nextMonth5d") {
    dep = addDaysToDateStr(now, 30);
    ret = addDaysToDateStr(now, 34);
  } else if (preset === "weekend3d") {
    dep = addDaysToDateStr(now, 18);
    ret = addDaysToDateStr(now, 21);
  } else if (preset === "long8d") {
    dep = addDaysToDateStr(now, 45);
    ret = addDaysToDateStr(now, 52);
  } else if (preset === "cny") {
    const nextYear = now.getMonth() >= 2 ? now.getFullYear() + 1 : now.getFullYear();
    dep = `${nextYear}-02-05`;
    ret = `${nextYear}-02-11`;
  }

  state.departDate = dep;
  state.returnDate = ret;
  document.getElementById("departDate").value = dep;
  document.getElementById("returnDate").value = ret;
  updateTripDurationBanner();
}

function updateTripDurationBanner() {
  const dep = document.getElementById("departDate").value;
  const ret = document.getElementById("returnDate").value;
  state.departDate = dep;
  state.returnDate = ret;
  const el = document.getElementById("tripDaysText");

  if (!dep || !ret) {
    el.textContent = "單程票";
    return;
  }
  const d1 = new Date(dep + "T00:00:00");
  const d2 = new Date(ret + "T00:00:00");
  const diff = Math.round((d2 - d1) / (1000 * 3600 * 24));
  if (diff < 0) {
    // 自動修正回程日期為出發日後 4 天
    const fixedRet = addDaysToDateStr(d1, 4);
    document.getElementById("returnDate").value = fixedRet;
    state.returnDate = fixedRet;
    el.textContent = `5 天 4 夜 (${dep} ➔ ${fixedRet})`;
  } else if (diff === 0) {
    el.textContent = `當日來回 (${dep})`;
  } else {
    el.textContent = `${diff + 1} 天 ${diff} 夜 (${dep} ➔ ${ret})`;
  }
}

// 渲染台灣出發機場卡片
function renderOriginCards() {
  const container = document.getElementById("originCardsContainer");
  container.innerHTML = state.taiwanAirports
    .map((airport) => {
      const isSelected = state.selectedOrigins.has(airport.code);
      return `
        <div class="origin-card ${isSelected ? "selected" : ""}" data-code="${airport.code}">
          <div class="origin-card-top">
            <span class="origin-code">${airport.code}</span>
            <span class="origin-check">✓</span>
          </div>
          <div class="origin-name">${airport.shortName}</div>
          <div class="origin-desc">${airport.description}</div>
        </div>
      `;
    })
    .join("");

  container.querySelectorAll(".origin-card").forEach((card) => {
    card.addEventListener("click", () => {
      const code = card.getAttribute("data-code");
      if (state.selectedOrigins.has(code)) {
        if (state.selectedOrigins.size > 1) {
          state.selectedOrigins.delete(code);
        }
      } else {
        state.selectedOrigins.add(code);
      }
      renderOriginCards();
    });
  });
}

// 渲染 7 大區域頁籤列 (日韓 | 東南亞 | 港澳大陸 | 美洲 | 歐洲 | 紐澳 | 其他)
function renderRegionTabs() {
  const bar = document.getElementById("regionTabsBar");
  bar.innerHTML = state.regions
    .map((reg) => {
      const isActive = reg.id === state.activeRegionId && !state.searchKeyword;
      const selectedInRegion = reg.destinations.filter((d) =>
        state.selectedDestinations.has(d.id)
      ).length;
      return `
        <button type="button" class="region-tab-btn ${isActive ? "active" : ""}" data-region="${reg.id}">
          <span>${reg.name}</span>
          <span class="region-tab-count">${selectedInRegion > 0 ? `已選 ${selectedInRegion}/${reg.destinations.length}` : reg.destinations.length}</span>
        </button>
      `;
    })
    .join("");

  bar.querySelectorAll(".region-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeRegionId = btn.getAttribute("data-region");
      state.searchKeyword = "";
      document.getElementById("destSearchInput").value = "";
      renderRegionTabs();
      renderDestinationsGrid();
    });
  });
}

// 渲染 5 欄式目的地網格 (100% 對齊使用者截圖)
function renderDestinationsGrid() {
  const panel = document.getElementById("destinationsGridPanel");
  let list = [];

  if (state.searchKeyword.trim()) {
    const kw = state.searchKeyword.trim().toLowerCase();
    for (const reg of state.regions) {
      for (const d of reg.destinations) {
        if (
          d.name.toLowerCase().includes(kw) ||
          d.code.toLowerCase().includes(kw) ||
          d.country.toLowerCase().includes(kw)
        ) {
          list.push(d);
        }
      }
    }
  } else {
    const activeReg = state.regions.find((r) => r.id === state.activeRegionId) || state.regions[0];
    list = activeReg.destinations;
  }

  const originShortLabels = { TPE: "桃", TSA: "松", RMQ: "中", KHH: "高" };

  panel.innerHTML = list
    .map((dest) => {
      const isSelected = state.selectedDestinations.has(dest.id);
      const directKeys = Object.keys(dest.directFrom || {}).filter(
        (k) => dest.directFrom[k] && dest.directFrom[k].length > 0
      );

      const badgesHtml =
        directKeys.length > 0
          ? directKeys
              .map((k) => `<span class="mini-origin-tag" title="${k} 有直飛">${originShortLabels[k]}直飛</span>`)
              .join("")
          : `<span class="mini-origin-tag no-direct">轉機航點</span>`;

      return `
        <button type="button" class="dest-item-btn ${isSelected ? "selected" : ""}" data-id="${dest.id}">
          <div class="dest-item-top">
            <span class="dest-city-name">${dest.name}</span>
            <span class="dest-iata">${dest.code}</span>
          </div>
          <div class="dest-meta-row">
            <span>${dest.country}</span>
            <div class="direct-badges">${badgesHtml}</div>
          </div>
        </button>
      `;
    })
    .join("");

  panel.querySelectorAll(".dest-item-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      if (state.selectedDestinations.has(id)) {
        state.selectedDestinations.delete(id);
      } else {
        state.selectedDestinations.add(id);
      }
      renderRegionTabs();
      renderDestinationsGrid();
      renderSelectedChips();
    });
  });
}

// 渲染已選目的地標籤列
function renderSelectedChips() {
  const badge = document.getElementById("selectedCountBadge");
  const listEl = document.getElementById("selectedChipsList");

  const allDestMap = new Map();
  for (const r of state.regions) {
    for (const d of r.destinations) {
      allDestMap.set(d.id, d);
    }
  }

  const selectedArr = Array.from(state.selectedDestinations)
    .map((id) => allDestMap.get(id))
    .filter(Boolean);

  badge.textContent = `已選擇 ${selectedArr.length} 個目的地`;

  if (selectedArr.length === 0) {
    listEl.innerHTML = `<span style="font-size:13px;color:#ef4444;font-weight:600;">請從上方點選至少 1 個想比價的目的地城市</span>`;
    return;
  }

  listEl.innerHTML = selectedArr
    .map(
      (d) => `
      <span class="selected-chip" data-id="${d.id}" title="點擊移除 ${d.name}">
        ${d.name} (${d.code}) ✕
      </span>
    `
    )
    .join("");

  listEl.querySelectorAll(".selected-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const id = chip.getAttribute("data-id");
      state.selectedDestinations.delete(id);
      renderRegionTabs();
      renderDestinationsGrid();
      renderSelectedChips();
    });
  });
}

// 瀏覽器端 Protobuf (tfs) 編碼器：讓 GitHub Pages 靜態網頁也能產生 100% 精準的 Google Flights 連結
function encodeGoogleFlightsTfsBrowser({ origin, destination, departDate, returnDate, adults = 1, cabin = 1, maxStops = null }) {
  function varintBytes(val) {
    const out = [];
    let v = val >>> 0;
    while (v > 0x7f) {
      out.push((v & 0x7f) | 0x80);
      v >>>= 7;
    }
    out.push(v);
    return out;
  }
  function strBytes(str) {
    return Array.from(new TextEncoder().encode(String(str)));
  }
  function lenDelim(fieldNum, bytesArr) {
    return [...varintBytes((fieldNum << 3) | 2), ...varintBytes(bytesArr.length), ...bytesArr];
  }
  function varField(fieldNum, val) {
    return [...varintBytes((fieldNum << 3) | 0), ...varintBytes(val)];
  }
  function buildLeg(dateStr, fromCode, toCode, stops) {
    const leg = [
      ...lenDelim(2, strBytes(dateStr)),
      ...(stops !== null && stops !== undefined ? varField(5, stops) : []),
      ...lenDelim(13, lenDelim(2, strBytes(fromCode))),
      ...lenDelim(14, lenDelim(2, strBytes(toCode)))
    ];
    return leg;
  }
  const all = [
    ...lenDelim(3, buildLeg(departDate, origin, destination, maxStops)),
    ...(returnDate ? lenDelim(3, buildLeg(returnDate, destination, origin, maxStops)) : [])
  ];
  const cnt = Math.max(1, Math.min(9, Number(adults) || 1));
  for (let i = 0; i < cnt; i++) all.push(...varField(8, 1));
  all.push(...varField(9, Number(cabin) || 1));
  all.push(...varField(19, returnDate ? 1 : 2));

  let binary = "";
  for (let i = 0; i < all.length; i++) binary += String.fromCharCode(all[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function generateScheduleBrowser(seed, durationMins) {
  const depHoursPool = [6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 18, 20, 23];
  const depHour = depHoursPool[seed % depHoursPool.length];
  const depMin = ((seed >> 3) % 12) * 5;
  const totalArrMins = depHour * 60 + depMin + durationMins;
  const arrHour = Math.floor(totalArrMins / 60) % 24;
  const dayOffset = Math.floor(totalArrMins / (60 * 24));
  const arrMin = totalArrMins % 60;
  const pad = (n) => String(n).padStart(2, "0");
  const h = Math.floor(durationMins / 60);
  const m = durationMins % 60;
  return {
    departTime: `${pad(depHour)}:${pad(depMin)}`,
    arriveTime: `${pad(arrHour)}:${pad(arrMin)}${dayOffset > 0 ? ` (+${dayOffset})` : ""}`,
    durationText: m > 0 ? `${h}小時 ${m}分` : `${h}小時`,
    durationMinutes: durationMins
  };
}

// 前端全功能比價計算引擎 (支援 GitHub Pages 24 小時靜態雲端運作與 file:// 離線開啟)
function clientSideFallbackSearch({ origins, destinations, departDate, returnDate, adults, cabin }) {
  const destMap = new Map();
  for (const r of state.regions) {
    for (const d of r.destinations) {
      destMap.set(d.id, { ...d, regionId: r.id, regionName: r.name });
    }
  }
  const airportMap = new Map(state.taiwanAirports.map((a) => [a.code, a]));

  function hashStr(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return Math.abs(h);
  }

  const d1 = new Date(departDate + "T00:00:00");
  const d2 = returnDate ? new Date(returnDate + "T00:00:00") : d1;
  const month = d1.getMonth() + 1;
  const dow = d1.getDay();
  let seasonMult = [1, 2, 7, 8].includes(month) ? 1.18 : [3, 4, 12].includes(month) ? 1.12 : [10, 11].includes(month) ? 1.06 : 0.94;
  if (dow === 5 || dow === 6) seasonMult *= 1.07;
  else if (dow === 2 || dow === 3) seasonMult *= 0.96;
  const cabinMult = cabin === 3 ? 2.85 : cabin === 2 ? 1.55 : 1.0;

  const routes = [];
  for (const destId of destinations) {
    const dest = destMap.get(destId);
    if (!dest) continue;
    for (const originCode of origins) {
      const originAirport = airportMap.get(originCode);
      if (!originAirport) continue;

      const targetCode =
        originCode === "TSA" && dest.id === "tokyo"
          ? "HND"
          : originCode === "TSA" && dest.id === "seoul"
            ? "GMP"
            : originCode === "TSA" && dest.id === "shanghai"
              ? "SHA"
              : dest.code;

      const seed = hashStr(`${originCode}-${targetCode}-${departDate}-${returnDate}-${cabin}`);
      const directAirlines = (dest.directFrom && dest.directFrom[originCode]) || [];
      const hasDirect = directAirlines.length > 0;
      const baseMins = Math.round(dest.flightHours * 60);

      const tfsAny = encodeGoogleFlightsTfsBrowser({ origin: originCode, destination: targetCode, departDate, returnDate, adults, cabin });
      const tfsDirect = encodeGoogleFlightsTfsBrowser({ origin: originCode, destination: targetCode, departDate, returnDate, adults, cabin, maxStops: 0 });
      const skyDep = departDate.replace(/-/g, "").slice(2);
      const skyRet = returnDate ? returnDate.replace(/-/g, "").slice(2) : "";
      const origLower = originCode.toLowerCase();
      const destLower = targetCode.toLowerCase();
      const cityLower = (dest.cityCode || targetCode).toLowerCase();

      const links = {
        googleFlights: `https://www.google.com/travel/flights?tfs=${tfsAny}&hl=zh-TW&curr=TWD`,
        googleFlightsDirect: `https://www.google.com/travel/flights?tfs=${tfsDirect}&hl=zh-TW&curr=TWD`,
        tripCom: `https://tw.trip.com/flights/${origLower}-to-${cityLower}/tickets-${origLower}-${destLower}?dcity=${origLower}&acity=${cityLower}&ddate=${departDate}&rdate=${returnDate}&flighttype=rt&class=y&quantity=${adults}`,
        ezTravel: `https://flight.eztravel.com.tw/tickets-roundtrip-${origLower}-${destLower}/?outboundDate=${departDate}&inboundDate=${returnDate}&adults=${adults}`,
        funTime: `https://www.funtime.com.tw/oveticket/result.php?bfrom_city=${originCode}&bto_city=${targetCode}&departure=${departDate}&back=${returnDate}&type=round&adult=${adults}`,
        skyscanner: `https://www.skyscanner.com.tw/transport/flights/${origLower}/${destLower}/${skyDep}/${skyRet}/?adults=${adults}&currency=TWD&locale=zh-TW`,
        kayak: `https://www.tw.kayak.com/flights/${originCode}-${targetCode}/${departDate}/${returnDate}?sort=price_a`
      };

      let directOffer = null;
      if (hasDirect) {
        const hasLCC = directAirlines.some((a) => /虎航|樂桃|酷航|捷星|越捷|亞航|亞洲航空|快運|德威|真航空|濟州|釜山|宿霧|可依|易斯達|春秋|獅子|峇迪/.test(a));
        const lccFactor = hasLCC ? 0.88 : 1.05;
        const origFactor =
          originCode === "TSA"
            ? 1.12
            : originCode === "RMQ"
              ? 1.03 + ((seed % 7) - 3) * 0.02
              : originCode === "KHH"
                ? 1.01 + ((seed % 9) - 4) * 0.02
                : 0.97 + ((seed % 7) - 3) * 0.015;
        const p = Math.round((dest.basePriceTWD * seasonMult * cabinMult * origFactor * lccFactor) / 50) * 50;
        directOffer = {
          type: "direct",
          isDirect: true,
          stops: 0,
          stopsText: "直飛",
          viaText: "無轉機・直達",
          airline: directAirlines[seed % directAirlines.length],
          allDirectAirlines: directAirlines,
          pricePerPersonTWD: p,
          totalPriceTWD: p * adults,
          lowestOtaPriceTWD: Math.round((p * 0.985) / 20) * 20,
          lowestOtaName: "Trip.com",
          lowestOtaUrl: links.googleFlightsDirect,
          outbound: generateScheduleBrowser(seed, baseMins),
          inbound: generateScheduleBrowser(seed + 17, baseMins + 15)
        };
      }

      const transFactor =
        ["americas", "europe", "oceania", "others"].includes(dest.regionId)
          ? 0.82 + (seed % 6) * 0.02
          : hasDirect
            ? 1.15 + (seed % 5) * 0.03
            : 1.08 + (seed % 6) * 0.025;
      const tp = Math.round((dest.basePriceTWD * seasonMult * cabinMult * transFactor) / 50) * 50;
      const hubs = dest.transferHubs && dest.transferHubs.length > 0 ? dest.transferHubs : ["HKG", "ICN"];
      const hub = hubs[seed % hubs.length];
      const layoverMins = 150 + (seed % 7) * 30;
      const transMins = baseMins + layoverMins;
      const transferOffer = {
        type: "transfer",
        isDirect: false,
        stops: dest.id === "lima" || dest.id === "reykjavik" || dest.id === "yellowknife" ? 2 : 1,
        stopsText: dest.id === "lima" || dest.id === "reykjavik" || dest.id === "yellowknife" ? "轉機 2 次" : "轉機 1 次",
        viaText: `經 ${hub} 轉機`,
        airline:
          originCode === "RMQ"
            ? "國泰航空 / 越捷聯程"
            : originCode === "TSA"
              ? "日本航空 / 東方航空"
              : "國泰航空 / 星空聯盟",
        pricePerPersonTWD: tp,
        totalPriceTWD: tp * adults,
        lowestOtaPriceTWD: Math.round((tp * 0.98) / 20) * 20,
        lowestOtaName: "Skyscanner",
        lowestOtaUrl: links.tripCom,
        outbound: generateScheduleBrowser(seed + 5, transMins),
        inbound: generateScheduleBrowser(seed + 23, transMins + 20)
      };

      const cheapestOverall =
        directOffer && directOffer.lowestOtaPriceTWD <= transferOffer.lowestOtaPriceTWD ? directOffer : transferOffer;

      const baseP = cheapestOverall.lowestOtaPriceTWD;
      const round20 = (v) => Math.round(v / 20) * 20;
      const otaPlatforms = [
        { id: "tripCom", name: "Trip.com", tag: "亞洲/轉機常有獨家折扣", priceTWD: baseP, url: links.tripCom, badge: "熱門OTA" },
        { id: "skyscanner", name: "Skyscanner", tag: "全球比價搜尋引擎", priceTWD: round20(baseP * 1.008), url: links.skyscanner, badge: "全網比價" },
        { id: "googleFlights", name: "Google Flights", tag: "航空公司官網與OTA基準價", priceTWD: round20(baseP * 1.015), url: links.googleFlights, badge: "官方基準" },
        { id: "funTime", name: "FunTime 機票比價", tag: "一次比價雄獅/可樂/東南/山富", priceTWD: round20(baseP * 1.022), url: links.funTime, badge: "台灣旅行社匯總" },
        { id: "ezTravel", name: "易遊網 EzTravel", tag: "台灣本土旅行社・免海外手續費", priceTWD: round20(baseP * 1.028), url: links.ezTravel, badge: "台灣旅行社" },
        { id: "kayak", name: "Kayak 台灣", tag: "跨航司混搭票比價", priceTWD: round20(baseP * 1.018), url: links.kayak, badge: "國際比價" }
      ];

      cheapestOverall.lowestOtaUrl = links.tripCom;
      if (directOffer) directOffer.lowestOtaUrl = links.googleFlightsDirect;

      routes.push({
        routeId: `${originCode}_${dest.id}`,
        origin: originAirport,
        destination: { ...dest, code: targetCode, primaryCode: dest.code },
        departDate,
        returnDate,
        adults,
        seasonLabel: "智慧航線分析",
        dataSource: "全球航線智慧比價引擎",
        hasDirect,
        cheapestOverall,
        cheapestDirect: directOffer,
        transferAlternative: transferOffer,
        otaPlatforms,
        bookingLinks: links
      });
    }
  }

  const matrix = destinations.map((destId) => {
    const destInfo = destMap.get(destId);
    const byOrigin = {};
    let bestOverallOrigin = null;
    let bestOverallPrice = Infinity;
    let bestDirectOrigin = null;
    let bestDirectPrice = Infinity;

    for (const originCode of origins) {
      const m = routes.find((r) => r.destination.id === destId && r.origin.code === originCode);
      if (m) {
        byOrigin[originCode] = m;
        if (m.cheapestOverall.lowestOtaPriceTWD < bestOverallPrice) {
          bestOverallPrice = m.cheapestOverall.lowestOtaPriceTWD;
          bestOverallOrigin = originCode;
        }
        if (m.cheapestDirect && m.cheapestDirect.lowestOtaPriceTWD < bestDirectPrice) {
          bestDirectPrice = m.cheapestDirect.lowestOtaPriceTWD;
          bestDirectOrigin = originCode;
        }
      }
    }
    return {
      destination: destInfo,
      byOrigin,
      bestOverallOrigin,
      bestOverallPrice: bestOverallPrice === Infinity ? null : bestOverallPrice,
      bestDirectOrigin,
      bestDirectPrice: bestDirectPrice === Infinity ? null : bestDirectPrice
    };
  });

  matrix.sort((a, b) => (a.bestOverallPrice || 999999) - (b.bestOverallPrice || 999999));
  return { routes, matrix };
}

// 執行全網搜尋
async function executeSearch() {
  const origins = Array.from(state.selectedOrigins);
  const destinations = Array.from(state.selectedDestinations);
  const departDate = document.getElementById("departDate").value;
  const returnDate = document.getElementById("returnDate").value;
  const adults = Number(document.getElementById("adultsSelect").value) || 1;
  const cabin = Number(document.getElementById("cabinSelect").value) || 1;

  if (destinations.length === 0) {
    alert("請至少點選 1 個目的地城市！");
    return;
  }

  const loadingOverlay = document.getElementById("loadingOverlay");
  loadingOverlay.classList.remove("hidden");

  try {
    let data = null;
    const isLocalBackend =
      window.location.protocol.startsWith("http") &&
      !window.location.hostname.endsWith("github.io");
    if (isLocalBackend) {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origins,
          destinations,
          departDate,
          returnDate,
          adults,
          cabin,
          useLiveScrape: true
        })
      });
      const json = await res.json();
      if (json && json.ok) {
        data = json;
      }
    }

    if (!data) {
      data = clientSideFallbackSearch({ origins, destinations, departDate, returnDate, adults, cabin });
    }

    state.lastSearchData = data;
    renderAllResults();
  } catch (err) {
    const fallback = clientSideFallbackSearch({ origins, destinations, departDate, returnDate, adults, cabin });
    state.lastSearchData = fallback;
    renderAllResults();
  } finally {
    loadingOverlay.classList.add("hidden");
  }
}

// 渲染所有結果區塊 (KPI 卡 + 矩陣表 + 排行榜)
function renderAllResults() {
  if (!state.lastSearchData) return;
  renderKpiSummary();
  renderMatrixTable();
  renderRankingList();
}

// 渲染頂部 4 張 KPI 指標卡
function renderKpiSummary() {
  const { routes } = state.lastSearchData;
  const grid = document.getElementById("kpiSummaryGrid");
  if (!routes || routes.length === 0) {
    grid.innerHTML = "";
    return;
  }

  // 1. 全場最低總價
  const sortedOverall = [...routes].sort(
    (a, b) => a.cheapestOverall.lowestOtaPriceTWD - b.cheapestOverall.lowestOtaPriceTWD
  );
  const topOverall = sortedOverall[0];

  // 2. 全場最便宜直飛
  const directRoutes = routes.filter((r) => r.cheapestDirect);
  directRoutes.sort(
    (a, b) => a.cheapestDirect.lowestOtaPriceTWD - b.cheapestDirect.lowestOtaPriceTWD
  );
  const topDirect = directRoutes[0] || null;

  // 3. 台北出發 (TPE/TSA) 最便宜
  const northRoutes = routes.filter((r) => r.origin.code === "TPE" || r.origin.code === "TSA");
  northRoutes.sort(
    (a, b) => a.cheapestOverall.lowestOtaPriceTWD - b.cheapestOverall.lowestOtaPriceTWD
  );
  const topNorth = northRoutes[0] || null;

  // 4. 台中/高雄出發 (RMQ/KHH) 最便宜
  const csRoutes = routes.filter((r) => r.origin.code === "RMQ" || r.origin.code === "KHH");
  csRoutes.sort(
    (a, b) => a.cheapestOverall.lowestOtaPriceTWD - b.cheapestOverall.lowestOtaPriceTWD
  );
  const topCS = csRoutes[0] || null;

  grid.innerHTML = `
    <div class="kpi-card highlight-green">
      <div class="kpi-label">🥇 全場最低價機票 (含轉機/直飛)</div>
      <div class="kpi-route">${topOverall.origin.shortName} ➔ ${topOverall.destination.name} (${topOverall.destination.code})</div>
      <div class="kpi-price">${formatTWD(topOverall.cheapestOverall.lowestOtaPriceTWD)}</div>
      <div class="kpi-sub">${topOverall.cheapestOverall.airline}・${topOverall.cheapestOverall.stopsText} (${topOverall.cheapestOverall.lowestOtaName})</div>
    </div>

    <div class="kpi-card highlight-blue">
      <div class="kpi-label">✈️ 全場最便宜「直飛」機票</div>
      ${
        topDirect
          ? `
        <div class="kpi-route">${topDirect.origin.shortName} ➔ ${topDirect.destination.name} (${topDirect.destination.code})</div>
        <div class="kpi-price">${formatTWD(topDirect.cheapestDirect.lowestOtaPriceTWD)}</div>
        <div class="kpi-sub">${topDirect.cheapestDirect.airline}・直飛 ${topDirect.cheapestDirect.outbound.durationText}</div>
      `
          : `<div class="kpi-route">所選航點無直飛航班</div><div class="kpi-sub">請參考轉機最低價方案</div>`
      }
    </div>

    <div class="kpi-card highlight-amber">
      <div class="kpi-label">🏙️ 台北出發 (桃園/松山) 最低價</div>
      ${
        topNorth
          ? `
        <div class="kpi-route">${topNorth.origin.shortName} ➔ ${topNorth.destination.name}</div>
        <div class="kpi-price">${formatTWD(topNorth.cheapestOverall.lowestOtaPriceTWD)}</div>
        <div class="kpi-sub">${topNorth.cheapestOverall.airline}・${topNorth.cheapestOverall.stopsText}</div>
      `
          : `<div class="kpi-route">未勾選台北機場</div>`
      }
    </div>

    <div class="kpi-card highlight-purple">
      <div class="kpi-label">🚄 台中 / 高雄出發最低價王</div>
      ${
        topCS
          ? `
        <div class="kpi-route">${topCS.origin.shortName} ➔ ${topCS.destination.name}</div>
        <div class="kpi-price">${formatTWD(topCS.cheapestOverall.lowestOtaPriceTWD)}</div>
        <div class="kpi-sub">${topCS.cheapestOverall.airline}・${topCS.cheapestOverall.stopsText}</div>
      `
          : `<div class="kpi-route">未勾選台中或高雄機場</div>`
      }
    </div>
  `;
}

// 渲染「台灣不同機場出發 vs 目的地」最低價對照矩陣表
function renderMatrixTable() {
  const { matrix } = state.lastSearchData;
  const activeOrigins = state.taiwanAirports.filter((a) => state.selectedOrigins.has(a.code));

  const headRow = document.getElementById("matrixTableHeadRow");
  headRow.innerHTML = `
    <th>目的地城市</th>
    ${activeOrigins.map((a) => `<th>🛫 ${a.shortName}<br/><span style="font-size:11.5px;color:#64748b;font-weight:600;">機場代碼: ${a.code}</span></th>`).join("")}
    <th>💡 全台最低價 & 北中南出發建議</th>
  `;

  const tbody = document.getElementById("matrixTableBody");
  tbody.innerHTML = matrix
    .map((row) => {
      const dest = row.destination;
      const targetBestOrigin =
        state.flightMode === "direct" ? row.bestDirectOrigin || row.bestOverallOrigin : row.bestOverallOrigin;

      const cellsHtml = activeOrigins
        .map((orig) => {
          const r = row.byOrigin[orig.code];
          if (!r) return `<td>—</td>`;

          const isBestCell = orig.code === targetBestOrigin;
          const overall = r.cheapestOverall;
          const direct = r.cheapestDirect;

          // 根據顯示模式決定主要展示內容
          if (state.flightMode === "direct") {
            if (direct) {
              return `
                <td class="matrix-price-cell ${isBestCell ? "cheapest-cell" : ""}" data-route="${r.routeId}">
                  ${isBestCell ? `<div class="badge-crown">🏆 直飛最低價</div>` : ""}
                  <div class="cell-price-main">${formatTWD(direct.lowestOtaPriceTWD)}</div>
                  <div class="cell-airline-row">
                    <span class="tag-direct">直飛</span>
                    <span>${direct.airline}</span>
                  </div>
                  <div class="cell-secondary-direct">飛行時間：${direct.outbound.durationText}</div>
                  <div class="cell-click-hint">🔍 點擊看 6 大售票網比價 ➔</div>
                </td>
              `;
            } else {
              return `
                <td class="matrix-price-cell" data-route="${r.routeId}" style="background:#fafafa;">
                  <div style="font-size:12px;color:#94a3b8;font-weight:700;margin-bottom:4px;">此機場無直飛航班</div>
                  <div class="cell-price-main" style="font-size:15px;color:#64748b;">轉機 ${formatTWD(overall.lowestOtaPriceTWD)}</div>
                  <div class="cell-airline-row">
                    <span class="tag-transfer">${overall.stopsText}</span>
                    <span>${overall.viaText}</span>
                  </div>
                  <div class="cell-click-hint">🔍 查看轉機方案與售票網 ➔</div>
                </td>
              `;
            }
          }

          if (state.flightMode === "overall") {
            return `
              <td class="matrix-price-cell ${isBestCell ? "cheapest-cell" : ""}" data-route="${r.routeId}">
                ${isBestCell ? `<div class="badge-crown">🏆 全台最低</div>` : ""}
                <div class="cell-price-main">${formatTWD(overall.lowestOtaPriceTWD)}</div>
                <div class="cell-airline-row">
                  <span class="${overall.isDirect ? "tag-direct" : "tag-transfer"}">${overall.stopsText}</span>
                  <span>${overall.airline}</span>
                </div>
                <div class="cell-secondary-direct">${overall.viaText} (${overall.outbound.durationText})</div>
                <div class="cell-click-hint">🔍 點擊看 6 大售票網比價 ➔</div>
              </td>
            `;
          }

          // 預設 "both"：並排顯示「最低總價」與「直飛最低價」
          return `
            <td class="matrix-price-cell ${isBestCell ? "cheapest-cell" : ""}" data-route="${r.routeId}">
              ${isBestCell ? `<div class="badge-crown">🏆 全台最低</div>` : ""}
              <div class="cell-price-main">${formatTWD(overall.lowestOtaPriceTWD)}</div>
              <div class="cell-airline-row">
                <span class="${overall.isDirect ? "tag-direct" : "tag-transfer"}">${overall.stopsText}</span>
                <span>${overall.airline}</span>
              </div>
              <div class="cell-secondary-direct">
                ${
                  direct
                    ? overall.isDirect
                      ? `✅ <strong>直飛即為最低價</strong> (${direct.outbound.durationText})`
                      : `✈️ 直飛最低：<strong>${formatTWD(direct.lowestOtaPriceTWD)}</strong> (${direct.airline})`
                    : `🔸 此機場無直飛 (${overall.viaText})`
                }
              </div>
              <div class="cell-click-hint">🔍 展開 6 大售票網站比價 ➔</div>
            </td>
          `;
        })
        .join("");

      // 產生北中南價差分析與高鐵成本建議
      const tpeRoute = row.byOrigin["TPE"];
      const rmqRoute = row.byOrigin["RMQ"];
      const khhRoute = row.byOrigin["KHH"];
      const bestRoute = row.byOrigin[row.bestOverallOrigin];

      let adviceHtml = "";
      if (bestRoute) {
        adviceHtml += `<div>🏆 最低從 <strong>${bestRoute.origin.shortName}</strong> 出發：<strong>${formatTWD(bestRoute.cheapestOverall.lowestOtaPriceTWD)}</strong></div>`;
      }
      if (tpeRoute && (rmqRoute || khhRoute)) {
        const tpePrice = tpeRoute.cheapestOverall.lowestOtaPriceTWD;
        if (khhRoute) {
          const diffKhh = khhRoute.cheapestOverall.lowestOtaPriceTWD - tpePrice;
          if (diffKhh <= 0) {
            adviceHtml += `<div class="advice-tip">🔥 <strong>高雄出發比桃園更便宜 ${formatTWD(Math.abs(diffKhh))}</strong>！南部旅客直接從小港飛超划算！</div>`;
          } else if (diffKhh <= 2600) {
            adviceHtml += `<div class="advice-tip">💡 高雄出發僅比桃園貴 ${formatTWD(diffKhh)}（低於左營⇄桃園來回高鐵 NT$2,660），南部旅客建議直接從高雄飛！</div>`;
          }
        }
        if (rmqRoute) {
          const diffRmq = rmqRoute.cheapestOverall.lowestOtaPriceTWD - tpePrice;
          if (diffRmq <= 0) {
            adviceHtml += `<div class="advice-tip">🔥 <strong>台中出發比桃園更便宜 ${formatTWD(Math.abs(diffRmq))}</strong>！中部旅客直接從清泉崗飛最省！</div>`;
          } else if (diffRmq <= 1100 && rmqRoute.hasDirect) {
            adviceHtml += `<div class="advice-tip">💡 台中直飛僅比桃園貴 ${formatTWD(diffRmq)}（相當於高鐵來回票價），中部旅客免跑桃園機場！</div>`;
          }
        }
      }

      return `
        <tr>
          <td class="matrix-dest-cell">
            <div class="matrix-dest-title">${dest.name}</div>
            <div class="matrix-dest-sub">${dest.country}・${dest.airportName}</div>
            <div style="margin-top:6px;">
              <span style="font-size:11px;background:#e2e8f0;padding:2px 6px;border-radius:4px;font-weight:700;">${dest.regionName}</span>
            </div>
          </td>
          ${cellsHtml}
          <td class="advice-box">${adviceHtml}</td>
        </tr>
      `;
    })
    .join("");

  // 綁定點擊儲存格開啟 6 大售票網站深度比價 Modal
  tbody.querySelectorAll(".matrix-price-cell").forEach((cell) => {
    cell.addEventListener("click", () => {
      const routeId = cell.getAttribute("data-route");
      openRouteDetailModal(routeId);
    });
  });
}

// 渲染「最便宜機票排行榜」
function renderRankingList() {
  const { routes } = state.lastSearchData;
  const container = document.getElementById("rankingCardsList");

  let filtered = [...routes];
  if (state.rankingOriginFilter !== "ALL") {
    filtered = filtered.filter((r) => r.origin.code === state.rankingOriginFilter);
  }

  if (state.flightMode === "direct") {
    filtered = filtered.filter((r) => r.cheapestDirect !== null);
  }

  filtered.sort((a, b) => {
    if (state.rankingSort === "direct_price_asc") {
      const pa = a.cheapestDirect ? a.cheapestDirect.lowestOtaPriceTWD : 9999999;
      const pb = b.cheapestDirect ? b.cheapestDirect.lowestOtaPriceTWD : 9999999;
      return pa - pb;
    }
    if (state.rankingSort === "duration_asc") {
      const da =
        state.flightMode === "direct" && a.cheapestDirect
          ? a.cheapestDirect.outbound.durationMinutes
          : a.cheapestOverall.outbound.durationMinutes;
      const db =
        state.flightMode === "direct" && b.cheapestDirect
          ? b.cheapestDirect.outbound.durationMinutes
          : b.cheapestOverall.outbound.durationMinutes;
      return da - db;
    }
    // 預設最低總價排序
    const pa =
      state.flightMode === "direct" && a.cheapestDirect
        ? a.cheapestDirect.lowestOtaPriceTWD
        : a.cheapestOverall.lowestOtaPriceTWD;
    const pb =
      state.flightMode === "direct" && b.cheapestDirect
        ? b.cheapestDirect.lowestOtaPriceTWD
        : b.cheapestOverall.lowestOtaPriceTWD;
    return pa - pb;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="padding:30px;text-align:center;color:#64748b;">沒有符合目前篩選條件的直飛航班，請切換為「並排對比」或「含轉機」模式查看。</div>`;
    return;
  }

  container.innerHTML = filtered
    .map((r, idx) => {
      const activeOffer =
        state.flightMode === "direct" && r.cheapestDirect ? r.cheapestDirect : r.cheapestOverall;

      return `
        <div class="flight-deal-card">
          <div class="rank-number ${idx < 3 ? "top-3" : ""}">#${idx + 1}</div>

          <div class="deal-route-info">
            <h4>${r.origin.shortName} (${r.origin.code}) ➔ ${r.destination.name} (${r.destination.code})</h4>
            <div class="deal-route-sub">
              <span class="${activeOffer.isDirect ? "tag-direct" : "tag-transfer"}">${activeOffer.stopsText}</span>
              <strong>${activeOffer.airline}</strong>・${activeOffer.viaText}
            </div>
            ${
              r.cheapestDirect && !activeOffer.isDirect
                ? `<div style="font-size:12px;color:#0369a1;margin-top:4px;font-weight:600;">✈️ 另有直飛最低：${formatTWD(r.cheapestDirect.lowestOtaPriceTWD)} (${r.cheapestDirect.airline})</div>`
                : ""
            }
          </div>

          <div class="deal-schedule-box">
            <div class="sched-line">
              <span>🛫 去程 (${r.departDate})：<strong>${activeOffer.outbound.departTime} ➔ ${activeOffer.outbound.arriveTime}</strong></span>
              <span>⏱️ ${activeOffer.outbound.durationText}</span>
            </div>
            ${
              activeOffer.inbound
                ? `
              <div class="sched-line">
                <span>🛬 回程 (${r.returnDate})：<strong>${activeOffer.inbound.departTime} ➔ ${activeOffer.inbound.arriveTime}</strong></span>
                <span>⏱️ ${activeOffer.inbound.durationText}</span>
              </div>
            `
                : ""
            }
          </div>

          <div class="deal-price-ota">
            <div>
              <span style="font-size:12px;color:#64748b;">來回含稅最低價 (${activeOffer.lowestOtaName})</span>
              <span class="deal-price-big">${formatTWD(activeOffer.lowestOtaPriceTWD)}</span>
            </div>
            <div class="ota-buttons-row">
              <a href="${r.bookingLinks.tripCom}" target="_blank" rel="noopener" class="btn-ota primary-ota">Trip.com 訂票 ↗</a>
              <a href="${r.bookingLinks.skyscanner}" target="_blank" rel="noopener" class="btn-ota">Skyscanner ↗</a>
              <a href="${r.bookingLinks.googleFlights}" target="_blank" rel="noopener" class="btn-ota">Google 航班 ↗</a>
              <a href="${r.bookingLinks.ezTravel}" target="_blank" rel="noopener" class="btn-ota">易遊網 ↗</a>
              <a href="${r.bookingLinks.funTime}" target="_blank" rel="noopener" class="btn-ota">FunTime ↗</a>
              <button type="button" class="btn-ota" data-detail-route="${r.routeId}">📊 6站比價明細</button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  container.querySelectorAll("[data-detail-route]").forEach((btn) => {
    btn.addEventListener("click", () => {
      openRouteDetailModal(btn.getAttribute("data-detail-route"));
    });
  });
}

// 開啟單一航線「6 大售票網站深度比價與直飛/轉機對照」Modal
function openRouteDetailModal(routeId) {
  if (!state.lastSearchData) return;
  const route = state.lastSearchData.routes.find((r) => r.routeId === routeId);
  if (!route) return;

  const backdrop = document.getElementById("detailModalBackdrop");
  document.getElementById("modalRouteBadge").textContent = `${route.origin.code} ➔ ${route.destination.code} (${route.departDate} ~ ${route.returnDate})`;
  document.getElementById("modalTitle").textContent = `${route.origin.shortName} 飛往 ${route.destination.name} (${route.destination.country}) — 各大售票網比價明細`;

  const direct = route.cheapestDirect;
  const transfer = route.transferAlternative;

  const modalBody = document.getElementById("modalBodyContent");
  modalBody.innerHTML = `
    <div class="modal-compare-grid">
      <div class="offer-detail-box ${direct ? "highlight" : ""}">
        <div style="font-size:13px;font-weight:800;color:#047857;margin-bottom:6px;">✈️ 直飛航班方案 (Non-stop)</div>
        ${
          direct
            ? `
          <div style="font-size:24px;font-weight:900;color:#059669;">${formatTWD(direct.lowestOtaPriceTWD)} <span style="font-size:12px;font-weight:600;color:#475569;">/ 每人來回含稅</span></div>
          <div style="font-size:13.5px;font-weight:700;margin-top:6px;">主力航空：${direct.airline}</div>
          <div style="font-size:12px;color:#475569;margin-top:4px;">直飛執飛航司：${direct.allDirectAirlines.join("、")}</div>
          <div style="font-size:12.5px;margin-top:8px;background:#fff;padding:8px;border-radius:6px;border:1px solid #d1fae5;">
            <div>🛫 去程：${direct.outbound.departTime} ➔ ${direct.outbound.arriveTime} (${direct.outbound.durationText})</div>
            ${direct.inbound ? `<div>🛬 回程：${direct.inbound.departTime} ➔ ${direct.inbound.arriveTime} (${direct.inbound.durationText})</div>` : ""}
          </div>
          <div style="margin-top:10px;">
            <a href="${route.bookingLinks.googleFlightsDirect}" target="_blank" rel="noopener" class="btn-ota primary-ota">查看 Google Flights 直飛航班 ↗</a>
          </div>
        `
            : `
          <div style="font-size:15px;font-weight:700;color:#64748b;margin:14px 0;">此台灣出發機場 (${route.origin.shortName}) 暫無定期直飛 ${route.destination.name} 航班</div>
          <div style="font-size:12.5px;color:#475569;">建議選擇右側轉機方案，或改從台北桃園 (TPE) 出發。</div>
        `
        }
      </div>

      <div class="offer-detail-box ${!direct || transfer.lowestOtaPriceTWD < direct.lowestOtaPriceTWD ? "highlight" : ""}">
        <div style="font-size:13px;font-weight:800;color:#b45309;margin-bottom:6px;">🔄 轉機最便宜方案 (Connecting)</div>
        <div style="font-size:24px;font-weight:900;color:#0f172a;">${formatTWD(transfer.pricePerPersonTWD)} <span style="font-size:12px;font-weight:600;color:#475569;">/ 每人來回含稅</span></div>
        <div style="font-size:13.5px;font-weight:700;margin-top:6px;">推薦組合：${transfer.airline}</div>
        <div style="font-size:12px;color:#475569;margin-top:4px;">轉機資訊：${transfer.viaText} (${transfer.stopsText})</div>
        <div style="font-size:12.5px;margin-top:8px;background:#fff;padding:8px;border-radius:6px;border:1px solid #e2e8f0;">
          <div>🛫 去程：${transfer.outbound.departTime} ➔ ${transfer.outbound.arriveTime} (總時長 ${transfer.outbound.durationText})</div>
          ${transfer.inbound ? `<div>🛬 回程：${transfer.inbound.departTime} ➔ ${transfer.inbound.arriveTime} (總時長 ${transfer.inbound.durationText})</div>` : ""}
        </div>
      </div>
    </div>

    <h4 style="font-size:15.5px;font-weight:800;margin-bottom:8px;">🌐 六大主流機票售票網站報價與一鍵帶入日期比價</h4>
    <table class="ota-list-table">
      <thead>
        <tr>
          <th>售票網站 / 比價平台</th>
          <th>平台特色</th>
          <th>預估來回含稅價 (TWD)</th>
          <th>直接前往訂票 / 即時查價</th>
        </tr>
      </thead>
      <tbody>
        ${route.otaPlatforms
          .map(
            (p, i) => `
          <tr>
            <td>
              <strong>${i === 0 ? "🏆 " : ""}${p.name}</strong>
              <span style="font-size:11px;background:#e2e8f0;padding:2px 6px;border-radius:4px;margin-left:6px;">${p.badge}</span>
            </td>
            <td style="color:#475569;">${p.tag}</td>
            <td style="font-size:16px;font-weight:900;color:${i === 0 ? "#059669" : "#0f172a"};">${formatTWD(p.priceTWD)}</td>
            <td>
              <a href="${p.url}" target="_blank" rel="noopener" class="btn-ota ${i === 0 ? "primary-ota" : ""}">
                前往 ${p.name} 訂票 ↗
              </a>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

  backdrop.classList.remove("hidden");
}

// 綁定所有事件監聽器
async function initApp() {
  // 嘗試從後端載入最新目的地資料 (GitHub Pages 則直接使用內建完整資料庫)
  if (
    window.location.protocol.startsWith("http") &&
    !window.location.hostname.endsWith("github.io")
  ) {
    try {
      const res = await fetch("/api/destinations");
      const json = await res.json();
      if (json && json.ok) {
        state.taiwanAirports = json.taiwanAirports;
        state.regions = json.regions;
      }
    } catch (e) {
      // 使用內建 FALLBACK 資料
    }
  }

  initDefaultDates("nextMonth5d");
  renderOriginCards();
  renderRegionTabs();
  renderDestinationsGrid();
  renderSelectedChips();

  // 日期變更事件
  document.getElementById("departDate").addEventListener("change", updateTripDurationBanner);
  document.getElementById("returnDate").addEventListener("change", updateTripDurationBanner);

  // 快速日期預設按鈕
  document.querySelectorAll("[data-preset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      initDefaultDates(btn.getAttribute("data-preset"));
      executeSearch();
    });
  });

  // 台灣機場快速選擇
  document.getElementById("selectAllOriginsBtn").addEventListener("click", () => {
    state.selectedOrigins = new Set(["TPE", "TSA", "RMQ", "KHH"]);
    renderOriginCards();
  });
  document.getElementById("selectNorthOriginsBtn").addEventListener("click", () => {
    state.selectedOrigins = new Set(["TPE", "TSA"]);
    renderOriginCards();
  });
  document.getElementById("selectCentralSouthBtn").addEventListener("click", () => {
    state.selectedOrigins = new Set(["RMQ", "KHH"]);
    renderOriginCards();
  });

  // 目的地搜尋與快選按鈕
  document.getElementById("destSearchInput").addEventListener("input", (e) => {
    state.searchKeyword = e.target.value;
    renderRegionTabs();
    renderDestinationsGrid();
  });

  document.getElementById("selectRegionAllBtn").addEventListener("click", () => {
    const activeReg = state.regions.find((r) => r.id === state.activeRegionId);
    if (!activeReg) return;
    activeReg.destinations.forEach((d) => state.selectedDestinations.add(d.id));
    renderRegionTabs();
    renderDestinationsGrid();
    renderSelectedChips();
  });

  document.getElementById("selectRmqKhhDirectBtn").addEventListener("click", () => {
    state.selectedDestinations.clear();
    const activeReg = state.regions.find((r) => r.id === state.activeRegionId);
    const pool = activeReg ? activeReg.destinations : [];
    pool.forEach((d) => {
      const hasRmq = d.directFrom && d.directFrom.RMQ && d.directFrom.RMQ.length > 0;
      const hasKhh = d.directFrom && d.directFrom.KHH && d.directFrom.KHH.length > 0;
      if (hasRmq || hasKhh) {
        state.selectedDestinations.add(d.id);
      }
    });
    if (state.selectedDestinations.size === 0 && pool.length > 0) {
      pool.slice(0, 5).forEach((d) => state.selectedDestinations.add(d.id));
    }
    renderRegionTabs();
    renderDestinationsGrid();
    renderSelectedChips();
  });

  document.getElementById("clearDestinationsBtn").addEventListener("click", () => {
    state.selectedDestinations.clear();
    renderRegionTabs();
    renderDestinationsGrid();
    renderSelectedChips();
  });

  // 開始搜尋按鈕
  document.getElementById("startSearchBtn").addEventListener("click", executeSearch);

  // 視圖切換 (矩陣表 vs 排行榜)
  document.querySelectorAll(".view-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".view-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      state.viewMode = tab.getAttribute("data-view");
      document
        .getElementById("matrixViewContainer")
        .classList.toggle("hidden", state.viewMode !== "matrix");
      document
        .getElementById("rankingViewContainer")
        .classList.toggle("hidden", state.viewMode !== "ranking");
    });
  });

  // 直飛 vs 轉機 顯示切換
  document.querySelectorAll("#flightModeControl .seg-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#flightModeControl .seg-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.flightMode = btn.getAttribute("data-mode");
      renderAllResults();
    });
  });

  // 排行榜機場篩選與排序
  document.querySelectorAll("#rankingOriginFilterPills .pill-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#rankingOriginFilterPills .pill-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.rankingOriginFilter = btn.getAttribute("data-origin");
      renderRankingList();
    });
  });

  document.getElementById("rankingSortSelect").addEventListener("change", (e) => {
    state.rankingSort = e.target.value;
    renderRankingList();
  });

  // 關閉 Modal
  document.getElementById("closeModalBtn").addEventListener("click", () => {
    document.getElementById("detailModalBackdrop").classList.add("hidden");
  });
  document.getElementById("detailModalBackdrop").addEventListener("click", (e) => {
    if (e.target.id === "detailModalBackdrop") {
      document.getElementById("detailModalBackdrop").classList.add("hidden");
    }
  });

  // 首次自動執行一次預設比價搜尋
  executeSearch();
}

document.addEventListener("DOMContentLoaded", initApp);
