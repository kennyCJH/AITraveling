/**
 * 台灣出發機場與全球 7 大區域 (102 個目的地) 完整資料庫
 * 完全對齊使用者上傳之 7 張目的地分類截圖
 */

const TAIWAN_AIRPORTS = [
  {
    code: "TPE",
    city: "台北",
    name: "台北桃園國際機場",
    shortName: "台北 (桃園)",
    badge: "主力樞紐",
    description: "全台航線最密集，涵蓋日韓、東南亞、港澳大陸、歐美及紐澳直飛航線"
  },
  {
    code: "TSA",
    city: "台北",
    name: "台北松山機場",
    shortName: "台北 (松山)",
    badge: "市區直達",
    description: "直飛東京羽田(HND)、首爾金浦(GMP)、上海虹橋/浦東、廈門、福州、成都等市區機場"
  },
  {
    code: "RMQ",
    city: "台中",
    name: "台中國際機場",
    shortName: "台中 (清泉崗)",
    badge: "中部出發",
    description: "直飛沖繩、東京、大阪、名古屋、高松、首爾、釜山、胡志明、河內、峴港、富國島、港澳等"
  },
  {
    code: "KHH",
    city: "高雄",
    name: "高雄國際機場",
    shortName: "高雄 (小港)",
    badge: "南部樞紐",
    description: "直飛東京、大阪、福岡、沖繩、札幌、熊本、首爾、釜山、曼谷、清邁、新馬、越南、港澳大陸等"
  }
];

/**
 * 7 大區域、共 102 個目的地（依截圖順序排列，每列 5 個）
 * directFrom: 台灣有定期/包機直飛的機場及其主力航空公司
 */
const DESTINATION_REGIONS = [
  {
    id: "jp_kr",
    name: "日韓",
    count: 15,
    destinations: [
      // Row 1: 東京, 大阪, 沖繩, 首爾, 釜山
      {
        id: "tokyo",
        name: "東京",
        country: "日本",
        code: "NRT",
        cityCode: "TYO",
        altCodes: ["HND"],
        airportName: "成田(NRT) / 羽田(HND)",
        flightHours: 3.3,
        basePriceTWD: 7200,
        directFrom: {
          TPE: ["台灣虎航", "酷航", "樂桃航空", "中華航空", "長榮航空", "星宇航空", "日本航空", "全日空"],
          TSA: ["中華航空", "長榮航空", "日本航空", "全日空"],
          RMQ: ["星宇航空"],
          KHH: ["台灣虎航", "中華航空", "長榮航空"]
        },
        transferHubs: ["OKA", "KIX", "HKG"]
      },
      {
        id: "osaka",
        name: "大阪",
        country: "日本",
        code: "KIX",
        cityCode: "OSA",
        altCodes: ["ITM"],
        airportName: "關西國際機場(KIX)",
        flightHours: 2.7,
        basePriceTWD: 6500,
        directFrom: {
          TPE: ["台灣虎航", "樂桃航空", "捷星日本", "泰越捷航空", "馬印航空", "中華航空", "長榮航空", "星宇航空"],
          RMQ: ["星宇航空"],
          KHH: ["台灣虎航", "樂桃航空", "中華航空", "長榮航空"]
        },
        transferHubs: ["OKA", "FUK", "HKG"]
      },
      {
        id: "okinawa",
        name: "沖繩",
        country: "日本",
        code: "OKA",
        cityCode: "OKA",
        altCodes: [],
        airportName: "那霸國際機場(OKA)",
        flightHours: 1.5,
        basePriceTWD: 4600,
        directFrom: {
          TPE: ["台灣虎航", "樂桃航空", "泰越捷航空", "馬印航空", "中華航空", "長榮航空", "星宇航空"],
          RMQ: ["星宇航空"],
          KHH: ["台灣虎航", "中華航空", "泰越捷航空"]
        },
        transferHubs: ["TPE", "KHH"]
      },
      {
        id: "seoul",
        name: "首爾",
        country: "韓國",
        code: "ICN",
        cityCode: "SEL",
        altCodes: ["GMP"],
        airportName: "仁川(ICN) / 金浦(GMP)",
        flightHours: 2.6,
        basePriceTWD: 5200,
        directFrom: {
          TPE: ["台灣虎航", "酷航", "真航空", "德威航空", "濟州航空", "大韓航空", "韓亞航空", "中華航空", "長榮航空"],
          TSA: ["德威航空", "易斯達航空", "中華航空", "長榮航空"],
          RMQ: ["德威航空", "真航空", "大韓航空"],
          KHH: ["台灣虎航", "德威航空", "濟州航空", "中華航空", "長榮航空"]
        },
        transferHubs: ["PUS", "CJU"]
      },
      {
        id: "busan",
        name: "釜山",
        country: "韓國",
        code: "PUS",
        cityCode: "PUS",
        altCodes: [],
        airportName: "金海國際機場(PUS)",
        flightHours: 2.3,
        basePriceTWD: 4800,
        directFrom: {
          TPE: ["台灣虎航", "釜山航空", "濟州航空", "大韓航空", "中華航空"],
          RMQ: ["台灣虎航"],
          KHH: ["台灣虎航", "釜山航空", "濟州航空"]
        },
        transferHubs: ["ICN", "FUK"]
      },
      // Row 2: 福岡, 名古屋, 廣島, 神戶, 札幌
      {
        id: "fukuoka",
        name: "福岡",
        country: "日本",
        code: "FUK",
        cityCode: "FUK",
        altCodes: [],
        airportName: "福岡國際機場(FUK)",
        flightHours: 2.3,
        basePriceTWD: 6200,
        directFrom: {
          TPE: ["台灣虎航", "中華航空", "長榮航空", "星宇航空"],
          KHH: ["台灣虎航", "長榮航空"]
        },
        transferHubs: ["OKA", "PUS", "ICN"]
      },
      {
        id: "nagoya",
        name: "名古屋",
        country: "日本",
        code: "NGO",
        cityCode: "NGO",
        altCodes: [],
        airportName: "中部國際機場(NGO)",
        flightHours: 2.9,
        basePriceTWD: 6600,
        directFrom: {
          TPE: ["台灣虎航", "樂桃航空", "馬印航空", "中華航空", "星宇航空"],
          RMQ: ["台灣虎航"],
          KHH: ["台灣虎航"]
        },
        transferHubs: ["KIX", "OKA", "ICN"]
      },
      {
        id: "hiroshima",
        name: "廣島",
        country: "日本",
        code: "HIJ",
        cityCode: "HIJ",
        altCodes: [],
        airportName: "廣島機場(HIJ)",
        flightHours: 2.5,
        basePriceTWD: 7500,
        directFrom: {
          TPE: ["中華航空"]
        },
        transferHubs: ["FUK", "ICN", "PVG"]
      },
      {
        id: "kobe",
        name: "神戶",
        country: "日本",
        code: "UKB",
        cityCode: "UKB",
        altCodes: ["KIX"],
        airportName: "神戶機場(UKB)",
        flightHours: 2.8,
        basePriceTWD: 7900,
        directFrom: {
          TPE: ["星宇航空", "長榮航空"],
          RMQ: ["星宇航空"]
        },
        transferHubs: ["KIX", "OKA", "HND"]
      },
      {
        id: "sapporo",
        name: "札幌",
        country: "日本",
        code: "CTS",
        cityCode: "SPK",
        altCodes: [],
        airportName: "新千歲國際機場(CTS)",
        flightHours: 4.0,
        basePriceTWD: 9800,
        directFrom: {
          TPE: ["台灣虎航", "酷航", "泰越捷航空", "中華航空", "長榮航空", "星宇航空"],
          KHH: ["台灣虎航", "中華航空"]
        },
        transferHubs: ["NRT", "HND", "KIX", "ICN"]
      },
      // Row 3: 熊本, 仙台, 高松, 濟州島, 清州
      {
        id: "kumamoto",
        name: "熊本",
        country: "日本",
        code: "KMJ",
        cityCode: "KMJ",
        altCodes: [],
        airportName: "阿蘇熊本機場(KMJ)",
        flightHours: 2.2,
        basePriceTWD: 6900,
        directFrom: {
          TPE: ["中華航空", "星宇航空"],
          KHH: ["中華航空"]
        },
        transferHubs: ["FUK", "ICN"]
      },
      {
        id: "sendai",
        name: "仙台",
        country: "日本",
        code: "SDJ",
        cityCode: "SDJ",
        altCodes: [],
        airportName: "仙台國際機場(SDJ)",
        flightHours: 3.6,
        basePriceTWD: 8600,
        directFrom: {
          TPE: ["台灣虎航", "長榮航空", "星宇航空"],
          KHH: ["台灣虎航"]
        },
        transferHubs: ["NRT", "KIX", "ICN"]
      },
      {
        id: "takamatsu",
        name: "高松",
        country: "日本",
        code: "TAK",
        cityCode: "TAK",
        altCodes: [],
        airportName: "高松機場(TAK)",
        flightHours: 2.6,
        basePriceTWD: 7100,
        directFrom: {
          TPE: ["中華航空"],
          RMQ: ["星宇航空"]
        },
        transferHubs: ["HND", "ICN", "HKG"]
      },
      {
        id: "jeju",
        name: "濟州島",
        country: "韓國",
        code: "CJU",
        cityCode: "CJU",
        altCodes: [],
        airportName: "濟州國際機場(CJU)",
        flightHours: 2.1,
        basePriceTWD: 4900,
        directFrom: {
          TPE: ["台灣虎航", "德威航空", "易斯達航空"],
          RMQ: ["台灣虎航"],
          KHH: ["台灣虎航", "德威航空"]
        },
        transferHubs: ["ICN", "PUS", "PVG"]
      },
      {
        id: "cheongju",
        name: "清州",
        country: "韓國",
        code: "CJJ",
        cityCode: "CJJ",
        altCodes: [],
        airportName: "清州國際機場(CJJ)",
        flightHours: 2.5,
        basePriceTWD: 4500,
        directFrom: {
          TPE: ["可依航空(Aero K)", "易斯達航空"],
          RMQ: ["可依航空(Aero K)"]
        },
        transferHubs: ["ICN", "CJU"]
      }
    ]
  },
  {
    id: "sea",
    name: "東南亞",
    count: 15,
    destinations: [
      // Row 1: 曼谷, 清邁, 新加坡, 胡志明, 河內
      {
        id: "bangkok",
        name: "曼谷",
        country: "泰國",
        code: "BKK",
        cityCode: "BKK",
        altCodes: ["DMK"],
        airportName: "蘇凡納布(BKK) / 廊曼(DMK)",
        flightHours: 3.8,
        basePriceTWD: 5400,
        directFrom: {
          TPE: ["台灣虎航", "泰越捷航空", "泰國亞洲航空", "泰國獅子航空", "中華航空", "長榮航空", "星宇航空", "泰國國際航空"],
          KHH: ["泰國亞洲航空", "泰越捷航空", "中華航空", "泰國國際航空"]
        },
        transferHubs: ["SGN", "HKG", "MFM"]
      },
      {
        id: "chiang_mai",
        name: "清邁",
        country: "泰國",
        code: "CNX",
        cityCode: "CNX",
        altCodes: [],
        airportName: "清邁國際機場(CNX)",
        flightHours: 4.0,
        basePriceTWD: 6500,
        directFrom: {
          TPE: ["泰國亞洲航空", "中華航空", "長榮航空", "星宇航空"]
        },
        transferHubs: ["BKK", "DMK", "HKG"]
      },
      {
        id: "singapore",
        name: "新加坡",
        country: "新加坡",
        code: "SIN",
        cityCode: "SIN",
        altCodes: [],
        airportName: "樟宜國際機場(SIN)",
        flightHours: 4.5,
        basePriceTWD: 5800,
        directFrom: {
          TPE: ["酷航", "捷星亞洲", "中華航空", "長榮航空", "星宇航空", "新加坡航空"],
          KHH: ["酷航"]
        },
        transferHubs: ["KUL", "BKK", "HKG", "MNL"]
      },
      {
        id: "ho_chi_minh",
        name: "胡志明",
        country: "越南",
        code: "SGN",
        cityCode: "SGN",
        altCodes: [],
        airportName: "新山一國際機場(SGN)",
        flightHours: 3.5,
        basePriceTWD: 4700,
        directFrom: {
          TPE: ["越捷航空", "中華航空", "長榮航空", "星宇航空", "越南航空"],
          RMQ: ["越捷航空", "華信航空"],
          KHH: ["越捷航空", "越南航空", "中華航空"]
        },
        transferHubs: ["HAN", "HKG"]
      },
      {
        id: "hanoi",
        name: "河內",
        country: "越南",
        code: "HAN",
        cityCode: "HAN",
        altCodes: [],
        airportName: "內排國際機場(HAN)",
        flightHours: 3.0,
        basePriceTWD: 4600,
        directFrom: {
          TPE: ["越捷航空", "中華航空", "長榮航空", "星宇航空", "越南航空"],
          RMQ: ["越捷航空"],
          KHH: ["越捷航空", "越南航空"]
        },
        transferHubs: ["SGN", "HKG", "MFM"]
      },
      // Row 2: 吉隆坡, 峇里島, 馬尼拉, 宿霧, 雅加達
      {
        id: "kuala_lumpur",
        name: "吉隆坡",
        country: "馬來西亞",
        code: "KUL",
        cityCode: "KUL",
        altCodes: [],
        airportName: "吉隆坡國際機場(KUL)",
        flightHours: 4.7,
        basePriceTWD: 5100,
        directFrom: {
          TPE: ["全亞洲航空(AirAsia X)", "峇迪航空(Batik Air)", "中華航空", "長榮航空", "星宇航空", "馬來西亞航空"],
          KHH: ["亞洲航空(AirAsia)", "峇迪航空"]
        },
        transferHubs: ["SIN", "BKI", "HKG"]
      },
      {
        id: "bali",
        name: "峇里島",
        country: "印尼",
        code: "DPS",
        cityCode: "DPS",
        altCodes: [],
        airportName: "伍拉·賴國際機場(DPS)",
        flightHours: 5.3,
        basePriceTWD: 8900,
        directFrom: {
          TPE: ["中華航空", "長榮航空"]
        },
        transferHubs: ["SIN", "KUL", "SGN", "MNL", "HKG"]
      },
      {
        id: "manila",
        name: "馬尼拉",
        country: "菲律賓",
        code: "MNL",
        cityCode: "MNL",
        altCodes: [],
        airportName: "尼諾伊·艾奎諾國際機場(MNL)",
        flightHours: 2.2,
        basePriceTWD: 3600,
        directFrom: {
          TPE: ["宿霧太平洋航空", "菲律賓亞洲航空", "中華航空", "長榮航空", "菲律賓航空"],
          KHH: ["菲律賓亞洲航空", "中華航空"]
        },
        transferHubs: ["CRK", "HKG"]
      },
      {
        id: "cebu",
        name: "宿霧",
        country: "菲律賓",
        code: "CEB",
        cityCode: "CEB",
        altCodes: [],
        airportName: "麥克坦-宿霧國際機場(CEB)",
        flightHours: 2.8,
        basePriceTWD: 4900,
        directFrom: {
          TPE: ["宿霧太平洋航空", "中華航空", "長榮航空", "星宇航空"]
        },
        transferHubs: ["MNL", "CRK"]
      },
      {
        id: "jakarta",
        name: "雅加達",
        country: "印尼",
        code: "CGK",
        cityCode: "JKT",
        altCodes: [],
        airportName: "蘇卡諾-哈達國際機場(CGK)",
        flightHours: 5.3,
        basePriceTWD: 7600,
        directFrom: {
          TPE: ["中華航空", "長榮航空", "星宇航空"]
        },
        transferHubs: ["SIN", "KUL", "SGN", "HKG"]
      },
      // Row 3: 峴港, 富國島, 亞庇 (沙巴), 檳城, 克拉克
      {
        id: "da_nang",
        name: "峴港",
        country: "越南",
        code: "DAD",
        cityCode: "DAD",
        altCodes: [],
        airportName: "峴港國際機場(DAD)",
        flightHours: 2.8,
        basePriceTWD: 5300,
        directFrom: {
          TPE: ["台灣虎航", "越捷航空", "中華航空", "長榮航空", "星宇航空"],
          RMQ: ["越捷航空"],
          KHH: ["台灣虎航", "越捷航空"]
        },
        transferHubs: ["HAN", "SGN", "MFM", "HKG"]
      },
      {
        id: "phu_quoc",
        name: "富國島",
        country: "越南",
        code: "PQC",
        cityCode: "PQC",
        altCodes: [],
        airportName: "富國國際機場(PQC)",
        flightHours: 3.8,
        basePriceTWD: 5600,
        directFrom: {
          TPE: ["越捷航空", "台灣虎航", "星宇航空"],
          RMQ: ["越捷航空", "星宇航空"],
          KHH: ["越捷航空"]
        },
        transferHubs: ["SGN", "HAN"]
      },
      {
        id: "kota_kinabalu",
        name: "亞庇 (沙巴)",
        country: "馬來西亞",
        code: "BKI",
        cityCode: "BKI",
        altCodes: [],
        airportName: "亞庇國際機場(BKI)",
        flightHours: 3.5,
        basePriceTWD: 4500,
        directFrom: {
          TPE: ["亞洲航空(AirAsia)"],
          KHH: ["亞洲航空(AirAsia)"]
        },
        transferHubs: ["KUL", "MNL", "HKG"]
      },
      {
        id: "penang",
        name: "檳城",
        country: "馬來西亞",
        code: "PEN",
        cityCode: "PEN",
        altCodes: [],
        airportName: "檳城國際機場(PEN)",
        flightHours: 4.5,
        basePriceTWD: 6800,
        directFrom: {
          TPE: ["中華航空", "星宇航空"]
        },
        transferHubs: ["KUL", "SIN", "HKG", "BKK"]
      },
      {
        id: "clark",
        name: "克拉克",
        country: "菲律賓",
        code: "CRK",
        cityCode: "CRK",
        altCodes: [],
        airportName: "克拉克國際機場(CRK)",
        flightHours: 2.0,
        basePriceTWD: 3800,
        directFrom: {
          TPE: ["長榮航空", "星宇航空"],
          KHH: ["宿霧太平洋航空"]
        },
        transferHubs: ["MNL", "HKG"]
      }
    ]
  },
  {
    id: "hk_mo_cn",
    name: "港澳大陸",
    count: 15,
    destinations: [
      // Row 1: 香港, 澳門, 上海, 廈門, 深圳
      {
        id: "hong_kong",
        name: "香港",
        country: "港澳",
        code: "HKG",
        cityCode: "HKG",
        altCodes: [],
        airportName: "香港國際機場(HKG)",
        flightHours: 1.8,
        basePriceTWD: 4200,
        directFrom: {
          TPE: ["香港快運", "大灣區航空", "香港航空", "國泰航空", "中華航空", "長榮航空", "星宇航空"],
          RMQ: ["香港快運"],
          KHH: ["香港快運", "國泰航空", "中華航空", "長榮航空"]
        },
        transferHubs: ["MFM"]
      },
      {
        id: "macau",
        name: "澳門",
        country: "港澳",
        code: "MFM",
        cityCode: "MFM",
        altCodes: [],
        airportName: "澳門國際機場(MFM)",
        flightHours: 1.8,
        basePriceTWD: 3900,
        directFrom: {
          TPE: ["台灣虎航", "澳門航空", "長榮航空", "星宇航空"],
          RMQ: ["台灣虎航", "澳門航空"],
          KHH: ["台灣虎航", "澳門航空", "長榮航空"]
        },
        transferHubs: ["HKG"]
      },
      {
        id: "shanghai",
        name: "上海",
        country: "中國大陸",
        code: "PVG",
        cityCode: "SHA",
        altCodes: ["SHA"],
        airportName: "浦東(PVG) / 虹橋(SHA)",
        flightHours: 2.0,
        basePriceTWD: 5500,
        directFrom: {
          TPE: ["春秋航空", "吉祥航空", "中國東方航空", "中國國際航空", "中華航空", "長榮航空"],
          TSA: ["中國東方航空", "上海航空", "中華航空", "長榮航空"],
          KHH: ["中華航空", "長榮航空", "吉祥航空", "中國東方航空"]
        },
        transferHubs: ["HKG", "MFM", "XMN"]
      },
      {
        id: "xiamen",
        name: "廈門",
        country: "中國大陸",
        code: "XMN",
        cityCode: "XMN",
        altCodes: [],
        airportName: "高崎國際機場(XMN)",
        flightHours: 1.6,
        basePriceTWD: 5200,
        directFrom: {
          TPE: ["廈門航空"],
          TSA: ["廈門航空", "華信航空"],
          KHH: ["廈門航空"]
        },
        transferHubs: ["MFM", "HKG"]
      },
      {
        id: "shenzhen",
        name: "深圳",
        country: "中國大陸",
        code: "SZX",
        cityCode: "SZX",
        altCodes: [],
        airportName: "寶安國際機場(SZX)",
        flightHours: 2.0,
        basePriceTWD: 5800,
        directFrom: {
          TPE: ["深圳航空", "中國南方航空", "中華航空", "立榮航空"],
          KHH: ["中華航空"]
        },
        transferHubs: ["HKG", "MFM", "XMN"]
      },
      // Row 2: 廣州, 成都, 北京, 福州, 重慶
      {
        id: "guangzhou",
        name: "廣州",
        country: "中國大陸",
        code: "CAN",
        cityCode: "CAN",
        altCodes: [],
        airportName: "白雲國際機場(CAN)",
        flightHours: 2.1,
        basePriceTWD: 6100,
        directFrom: {
          TPE: ["中國南方航空", "中華航空", "長榮航空"]
        },
        transferHubs: ["HKG", "MFM", "XMN"]
      },
      {
        id: "chengdu",
        name: "成都",
        country: "中國大陸",
        code: "TFU",
        cityCode: "CTU",
        altCodes: ["CTU"],
        airportName: "天府國際機場(TFU)",
        flightHours: 3.5,
        basePriceTWD: 6800,
        directFrom: {
          TPE: ["中國國際航空", "中華航空", "長榮航空"],
          TSA: ["四川航空"]
        },
        transferHubs: ["MFM", "HKG", "XMN"]
      },
      {
        id: "beijing",
        name: "北京",
        country: "中國大陸",
        code: "PEK",
        cityCode: "BJS",
        altCodes: ["PKX"],
        airportName: "首都(PEK) / 大興(PKX)",
        flightHours: 3.3,
        basePriceTWD: 6900,
        directFrom: {
          TPE: ["中國國際航空", "中華航空", "長榮航空"]
        },
        transferHubs: ["MFM", "HKG", "XMN", "PVG"]
      },
      {
        id: "fuzhou",
        name: "福州",
        country: "中國大陸",
        code: "FOC",
        cityCode: "FOC",
        altCodes: [],
        airportName: "長樂國際機場(FOC)",
        flightHours: 1.5,
        basePriceTWD: 5300,
        directFrom: {
          TPE: ["廈門航空"],
          TSA: ["廈門航空", "立榮航空"],
          KHH: ["廈門航空"]
        },
        transferHubs: ["XMN", "MFM"]
      },
      {
        id: "chongqing",
        name: "重慶",
        country: "中國大陸",
        code: "CKG",
        cityCode: "CKG",
        altCodes: [],
        airportName: "江北國際機場(CKG)",
        flightHours: 3.3,
        basePriceTWD: 6700,
        directFrom: {
          TPE: ["中國國際航空"],
          TSA: ["重慶航空"]
        },
        transferHubs: ["MFM", "HKG", "XMN"]
      },
      // Row 3: 杭州, 哈爾濱, 昆明, 南京, 武漢
      {
        id: "hangzhou",
        name: "杭州",
        country: "中國大陸",
        code: "HGH",
        cityCode: "HGH",
        altCodes: [],
        airportName: "蕭山國際機場(HGH)",
        flightHours: 2.0,
        basePriceTWD: 5900,
        directFrom: {
          TPE: ["中國國際航空", "長榮航空"]
        },
        transferHubs: ["MFM", "HKG", "XMN", "PVG"]
      },
      {
        id: "harbin",
        name: "哈爾濱",
        country: "中國大陸",
        code: "HRB",
        cityCode: "HRB",
        altCodes: [],
        airportName: "太平國際機場(HRB)",
        flightHours: 6.0,
        basePriceTWD: 9200,
        directFrom: {},
        transferHubs: ["PVG", "PEK", "XMN", "ICN"]
      },
      {
        id: "kunming",
        name: "昆明",
        country: "中國大陸",
        code: "KMG",
        cityCode: "KMG",
        altCodes: [],
        airportName: "長水國際機場(KMG)",
        flightHours: 3.5,
        basePriceTWD: 7600,
        directFrom: {
          TPE: ["中國東方航空"]
        },
        transferHubs: ["XMN", "HKG", "MFM", "BKK"]
      },
      {
        id: "nanjing",
        name: "南京",
        country: "中國大陸",
        code: "NKG",
        cityCode: "NKG",
        altCodes: [],
        airportName: "祿口國際機場(NKG)",
        flightHours: 2.2,
        basePriceTWD: 6000,
        directFrom: {
          TPE: ["中國東方航空", "吉祥航空"],
          RMQ: ["中國東方航空"],
          KHH: ["中國東方航空"]
        },
        transferHubs: ["MFM", "HKG", "XMN"]
      },
      {
        id: "wuhan",
        name: "武漢",
        country: "中國大陸",
        code: "WUH",
        cityCode: "WUH",
        altCodes: [],
        airportName: "天河國際機場(WUH)",
        flightHours: 2.6,
        basePriceTWD: 6300,
        directFrom: {
          TPE: ["中國東方航空", "中國南方航空"],
          TSA: ["中國東方航空"],
          KHH: ["中國東方航空"]
        },
        transferHubs: ["XMN", "HKG", "MFM"]
      }
    ]
  },
  {
    id: "americas",
    name: "美洲",
    count: 15,
    destinations: [
      // Row 1: 洛杉磯, 舊金山, 西雅圖, 紐約, 溫哥華
      {
        id: "los_angeles",
        name: "洛杉磯",
        country: "美國",
        code: "LAX",
        cityCode: "LAX",
        altCodes: [],
        airportName: "洛杉磯國際機場(LAX)",
        flightHours: 12.0,
        basePriceTWD: 23500,
        directFrom: {
          TPE: ["中華航空", "長榮航空", "星宇航空"]
        },
        transferHubs: ["NRT", "ICN", "HKG", "MNL", "SFO"]
      },
      {
        id: "san_francisco",
        name: "舊金山",
        country: "美國",
        code: "SFO",
        cityCode: "SFO",
        altCodes: [],
        airportName: "舊金山國際機場(SFO)",
        flightHours: 11.5,
        basePriceTWD: 22800,
        directFrom: {
          TPE: ["聯合航空", "中華航空", "長榮航空", "星宇航空"]
        },
        transferHubs: ["NRT", "ICN", "HKG", "MNL"]
      },
      {
        id: "seattle",
        name: "西雅圖",
        country: "美國",
        code: "SEA",
        cityCode: "SEA",
        altCodes: [],
        airportName: "西雅圖-塔科馬國際機場(SEA)",
        flightHours: 11.0,
        basePriceTWD: 21900,
        directFrom: {
          TPE: ["達美航空", "中華航空", "長榮航空", "星宇航空"]
        },
        transferHubs: ["NRT", "ICN", "YVR"]
      },
      {
        id: "new_york",
        name: "紐約",
        country: "美國",
        code: "JFK",
        cityCode: "NYC",
        altCodes: ["EWR"],
        airportName: "甘迺迪(JFK) / 紐華克(EWR)",
        flightHours: 15.0,
        basePriceTWD: 29800,
        directFrom: {
          TPE: ["中華航空", "長榮航空"]
        },
        transferHubs: ["SFO", "SEA", "ICN", "NRT", "HKG"]
      },
      {
        id: "vancouver",
        name: "溫哥華",
        country: "加拿大",
        code: "YVR",
        cityCode: "YVR",
        altCodes: [],
        airportName: "溫哥華國際機場(YVR)",
        flightHours: 11.0,
        basePriceTWD: 23900,
        directFrom: {
          TPE: ["中華航空", "長榮航空"]
        },
        transferHubs: ["NRT", "ICN", "HKG", "SEA"]
      },
      // Row 2: 多倫多, 夏威夷, 鳳凰城(AZ), 黃刀鎮(NT), 卡加利
      {
        id: "toronto",
        name: "多倫多",
        country: "加拿大",
        code: "YYZ",
        cityCode: "YTO",
        altCodes: [],
        airportName: "皮爾遜國際機場(YYZ)",
        flightHours: 14.5,
        basePriceTWD: 31500,
        directFrom: {
          TPE: ["長榮航空"]
        },
        transferHubs: ["YVR", "SFO", "ICN", "HKG"]
      },
      {
        id: "hawaii",
        name: "夏威夷",
        country: "美國",
        code: "HNL",
        cityCode: "HNL",
        altCodes: [],
        airportName: "檀香山國際機場(HNL)",
        flightHours: 9.5,
        basePriceTWD: 21500,
        directFrom: {},
        transferHubs: ["NRT", "HND", "ICN", "KIX"]
      },
      {
        id: "phoenix",
        name: "鳳凰城(AZ)",
        country: "美國",
        code: "PHX",
        cityCode: "PHX",
        altCodes: [],
        airportName: "鳳凰城天港國際機場(PHX)",
        flightHours: 14.5,
        basePriceTWD: 28200,
        directFrom: {
          TPE: ["中華航空", "星宇航空"]
        },
        transferHubs: ["LAX", "SFO", "SEA"]
      },
      {
        id: "yellowknife",
        name: "黃刀鎮(NT)",
        country: "加拿大",
        code: "YZF",
        cityCode: "YZF",
        altCodes: [],
        airportName: "黃刀鎮機場(YZF)",
        flightHours: 16.5,
        basePriceTWD: 36800,
        directFrom: {},
        transferHubs: ["YVR", "YYC"]
      },
      {
        id: "calgary",
        name: "卡加利",
        country: "加拿大",
        code: "YYC",
        cityCode: "YYC",
        altCodes: [],
        airportName: "卡加利國際機場(YYC)",
        flightHours: 14.0,
        basePriceTWD: 28900,
        directFrom: {},
        transferHubs: ["YVR", "NRT", "SFO", "SEA"]
      },
      // Row 3: 拉斯維加斯, 芝加哥, 休士頓, 波士頓, 加州安大略
      {
        id: "las_vegas",
        name: "拉斯維加斯",
        country: "美國",
        code: "LAS",
        cityCode: "LAS",
        altCodes: [],
        airportName: "哈里·瑞德國際機場(LAS)",
        flightHours: 14.2,
        basePriceTWD: 25600,
        directFrom: {},
        transferHubs: ["LAX", "SFO", "SEA", "ICN"]
      },
      {
        id: "chicago",
        name: "芝加哥",
        country: "美國",
        code: "ORD",
        cityCode: "CHI",
        altCodes: [],
        airportName: "歐海爾國際機場(ORD)",
        flightHours: 14.0,
        basePriceTWD: 28500,
        directFrom: {
          TPE: ["長榮航空"]
        },
        transferHubs: ["SFO", "SEA", "NRT", "ICN"]
      },
      {
        id: "houston",
        name: "休士頓",
        country: "美國",
        code: "IAH",
        cityCode: "HOU",
        altCodes: [],
        airportName: "喬治·布希洲際機場(IAH)",
        flightHours: 14.5,
        basePriceTWD: 30200,
        directFrom: {
          TPE: ["長榮航空"]
        },
        transferHubs: ["SFO", "LAX", "NRT", "ICN"]
      },
      {
        id: "boston",
        name: "波士頓",
        country: "美國",
        code: "BOS",
        cityCode: "BOS",
        altCodes: [],
        airportName: "洛根國際機場(BOS)",
        flightHours: 16.5,
        basePriceTWD: 29400,
        directFrom: {},
        transferHubs: ["SFO", "SEA", "JFK", "HKG", "ICN"]
      },
      {
        id: "ontario_ca",
        name: "加州安大略",
        country: "美國",
        code: "ONT",
        cityCode: "ONT",
        altCodes: [],
        airportName: "安大略國際機場(ONT)",
        flightHours: 12.0,
        basePriceTWD: 24800,
        directFrom: {
          TPE: ["中華航空", "星宇航空"]
        },
        transferHubs: ["SFO", "SEA"]
      }
    ]
  },
  {
    id: "europe",
    name: "歐洲",
    count: 15,
    destinations: [
      // Row 1: 巴黎, 倫敦, 米蘭, 維也納, 阿姆斯特丹
      {
        id: "paris",
        name: "巴黎",
        country: "法國",
        code: "CDG",
        cityCode: "PAR",
        altCodes: ["ORY"],
        airportName: "戴高樂國際機場(CDG)",
        flightHours: 13.8,
        basePriceTWD: 24500,
        directFrom: {
          TPE: ["長榮航空"]
        },
        transferHubs: ["PVG", "PEK", "HKG", "BKK", "DXB", "IST"]
      },
      {
        id: "london",
        name: "倫敦",
        country: "英國",
        code: "LHR",
        cityCode: "LON",
        altCodes: ["LGW"],
        airportName: "希斯洛(LHR) / 蓋威克(LGW)",
        flightHours: 14.2,
        basePriceTWD: 24900,
        directFrom: {
          TPE: ["中華航空", "長榮航空(中停曼谷)"]
        },
        transferHubs: ["PVG", "HKG", "BKK", "SIN", "DXB"]
      },
      {
        id: "milan",
        name: "米蘭",
        country: "義大利",
        code: "MXP",
        cityCode: "MIL",
        altCodes: [],
        airportName: "馬爾彭薩機場(MXP)",
        flightHours: 13.5,
        basePriceTWD: 23800,
        directFrom: {
          TPE: ["長榮航空"]
        },
        transferHubs: ["PVG", "PEK", "HKG", "IST", "DXB"]
      },
      {
        id: "vienna",
        name: "維也納",
        country: "奧地利",
        code: "VIE",
        cityCode: "VIE",
        altCodes: [],
        airportName: "維也納國際機場(VIE)",
        flightHours: 13.0,
        basePriceTWD: 24200,
        directFrom: {
          TPE: ["中華航空", "長榮航空"]
        },
        transferHubs: ["BKK", "PVG", "IST", "DXB"]
      },
      {
        id: "amsterdam",
        name: "阿姆斯特丹",
        country: "荷蘭",
        code: "AMS",
        cityCode: "AMS",
        altCodes: [],
        airportName: "史基浦國際機場(AMS)",
        flightHours: 13.5,
        basePriceTWD: 25200,
        directFrom: {
          TPE: ["中華航空", "荷蘭皇家航空", "長榮航空(中停曼谷)"]
        },
        transferHubs: ["HKG", "BKK", "PVG", "CAN", "IST"]
      },
      // Row 2: 法蘭克福, 巴塞隆納, 羅馬, 慕尼黑, 蘇黎士
      {
        id: "frankfurt",
        name: "法蘭克福",
        country: "德國",
        code: "FRA",
        cityCode: "FRA",
        altCodes: [],
        airportName: "法蘭克福機場(FRA)",
        flightHours: 13.5,
        basePriceTWD: 24600,
        directFrom: {
          TPE: ["中華航空"]
        },
        transferHubs: ["PVG", "PEK", "HKG", "BKK", "SIN"]
      },
      {
        id: "barcelona",
        name: "巴塞隆納",
        country: "西班牙",
        code: "BCN",
        cityCode: "BCN",
        altCodes: [],
        airportName: "埃爾普拉特機場(BCN)",
        flightHours: 15.5,
        basePriceTWD: 25400,
        directFrom: {},
        transferHubs: ["PEK", "PVG", "SIN", "HKG", "IST", "DXB"]
      },
      {
        id: "rome",
        name: "羅馬",
        country: "義大利",
        code: "FCO",
        cityCode: "ROM",
        altCodes: [],
        airportName: "菲烏米奇諾機場(FCO)",
        flightHours: 13.8,
        basePriceTWD: 23900,
        directFrom: {
          TPE: ["中華航空"]
        },
        transferHubs: ["PVG", "TFU", "HKG", "IST", "DXB"]
      },
      {
        id: "munich",
        name: "慕尼黑",
        country: "德國",
        code: "MUC",
        cityCode: "MUC",
        altCodes: [],
        airportName: "慕尼黑機場(MUC)",
        flightHours: 13.3,
        basePriceTWD: 24800,
        directFrom: {
          TPE: ["長榮航空"]
        },
        transferHubs: ["PVG", "PEK", "BKK", "IST", "DXB"]
      },
      {
        id: "zurich",
        name: "蘇黎士",
        country: "瑞士",
        code: "ZRH",
        cityCode: "ZRH",
        altCodes: [],
        airportName: "蘇黎世機場(ZRH)",
        flightHours: 15.0,
        basePriceTWD: 26500,
        directFrom: {},
        transferHubs: ["HKG", "SIN", "BKK", "PVG", "DXB"]
      },
      // Row 3: 雷克雅維克, 馬德里, 布拉格, 布達佩斯, 里斯本
      {
        id: "reykjavik",
        name: "雷克雅維克",
        country: "冰島",
        code: "KEF",
        cityCode: "REK",
        altCodes: [],
        airportName: "凱夫拉維克國際機場(KEF)",
        flightHours: 18.0,
        basePriceTWD: 33500,
        directFrom: {},
        transferHubs: ["LHR", "AMS", "FRA", "CDG"]
      },
      {
        id: "madrid",
        name: "馬德里",
        country: "西班牙",
        code: "MAD",
        cityCode: "MAD",
        altCodes: [],
        airportName: "巴拉哈斯機場(MAD)",
        flightHours: 16.0,
        basePriceTWD: 25800,
        directFrom: {},
        transferHubs: ["PVG", "PEK", "HKG", "IST", "DXB"]
      },
      {
        id: "prague",
        name: "布拉格",
        country: "捷克",
        code: "PRG",
        cityCode: "PRG",
        altCodes: [],
        airportName: "瓦茨拉夫·哈維爾機場(PRG)",
        flightHours: 13.5,
        basePriceTWD: 25600,
        directFrom: {
          TPE: ["中華航空"]
        },
        transferHubs: ["IST", "DXB", "VIE", "FRA", "ICN"]
      },
      {
        id: "budapest",
        name: "布達佩斯",
        country: "匈牙利",
        code: "BUD",
        cityCode: "BUD",
        altCodes: [],
        airportName: "李斯特·費倫茨國際機場(BUD)",
        flightHours: 15.2,
        basePriceTWD: 24300,
        directFrom: {},
        transferHubs: ["PVG", "PEK", "IST", "DXB", "VIE"]
      },
      {
        id: "lisbon",
        name: "里斯本",
        country: "葡萄牙",
        code: "LIS",
        cityCode: "LIS",
        altCodes: [],
        airportName: "溫貝托·德爾加多機場(LIS)",
        flightHours: 17.0,
        basePriceTWD: 27900,
        directFrom: {},
        transferHubs: ["IST", "DXB", "CDG", "FRA", "AMS"]
      }
    ]
  },
  {
    id: "oceania",
    name: "紐澳",
    count: 12,
    destinations: [
      // Row 1: 雪梨, 墨爾本, 布里斯本, 奧克蘭, 基督城
      {
        id: "sydney",
        name: "雪梨",
        country: "澳洲",
        code: "SYD",
        cityCode: "SYD",
        altCodes: [],
        airportName: "金斯福德·史密斯機場(SYD)",
        flightHours: 9.2,
        basePriceTWD: 17800,
        directFrom: {
          TPE: ["中華航空"]
        },
        transferHubs: ["SIN", "KUL", "MNL", "HKG", "CAN", "XMN"]
      },
      {
        id: "melbourne",
        name: "墨爾本",
        country: "澳洲",
        code: "MEL",
        cityCode: "MEL",
        altCodes: [],
        airportName: "圖拉馬林機場(MEL)",
        flightHours: 9.3,
        basePriceTWD: 17500,
        directFrom: {
          TPE: ["中華航空"]
        },
        transferHubs: ["SIN", "KUL", "HKG", "CAN", "XMN", "PVG"]
      },
      {
        id: "brisbane",
        name: "布里斯本",
        country: "澳洲",
        code: "BNE",
        cityCode: "BNE",
        altCodes: [],
        airportName: "布里斯本機場(BNE)",
        flightHours: 8.8,
        basePriceTWD: 18200,
        directFrom: {
          TPE: ["中華航空", "長榮航空"]
        },
        transferHubs: ["SIN", "HKG", "MNL", "CAN"]
      },
      {
        id: "auckland",
        name: "奧克蘭",
        country: "紐西蘭",
        code: "AKL",
        cityCode: "AKL",
        altCodes: [],
        airportName: "奧克蘭國際機場(AKL)",
        flightHours: 10.8,
        basePriceTWD: 22900,
        directFrom: {
          TPE: ["紐西蘭航空", "中華航空(中停布里斯本)"]
        },
        transferHubs: ["SYD", "BNE", "SIN", "HKG", "PVG"]
      },
      {
        id: "christchurch",
        name: "基督城",
        country: "紐西蘭",
        code: "CHC",
        cityCode: "CHC",
        altCodes: [],
        airportName: "基督城國際機場(CHC)",
        flightHours: 13.5,
        basePriceTWD: 25400,
        directFrom: {},
        transferHubs: ["AKL", "SYD", "MEL", "SIN", "HKG"]
      },
      // Row 2: 皇后鎮, 伯斯, 阿德雷德, 荷巴特, 黃金海岸
      {
        id: "queenstown",
        name: "皇后鎮",
        country: "紐西蘭",
        code: "ZQN",
        cityCode: "ZQN",
        altCodes: [],
        airportName: "皇后鎮機場(ZQN)",
        flightHours: 14.0,
        basePriceTWD: 26800,
        directFrom: {},
        transferHubs: ["AKL", "SYD", "MEL", "BNE"]
      },
      {
        id: "perth",
        name: "伯斯",
        country: "澳洲",
        code: "PER",
        cityCode: "PER",
        altCodes: [],
        airportName: "伯斯機場(PER)",
        flightHours: 10.2,
        basePriceTWD: 15800,
        directFrom: {},
        transferHubs: ["SIN", "KUL", "HKG"]
      },
      {
        id: "adelaide",
        name: "阿德雷德",
        country: "澳洲",
        code: "ADL",
        cityCode: "ADL",
        altCodes: [],
        airportName: "阿德雷德機場(ADL)",
        flightHours: 11.8,
        basePriceTWD: 19600,
        directFrom: {},
        transferHubs: ["SIN", "KUL", "SYD", "MEL", "HKG"]
      },
      {
        id: "hobart",
        name: "荷巴特",
        country: "澳洲",
        code: "HBA",
        cityCode: "HBA",
        altCodes: [],
        airportName: "荷巴特國際機場(HBA)",
        flightHours: 12.8,
        basePriceTWD: 21800,
        directFrom: {},
        transferHubs: ["MEL", "SYD", "BNE"]
      },
      {
        id: "gold_coast",
        name: "黃金海岸",
        country: "澳洲",
        code: "OOL",
        cityCode: "OOL",
        altCodes: ["BNE"],
        airportName: "黃金海岸機場(OOL)",
        flightHours: 11.2,
        basePriceTWD: 18500,
        directFrom: {},
        transferHubs: ["SIN", "KUL", "SYD", "HKG"]
      },
      // Row 3: 凱恩斯, 朗塞斯頓
      {
        id: "cairns",
        name: "凱恩斯",
        country: "澳洲",
        code: "CNS",
        cityCode: "CNS",
        altCodes: [],
        airportName: "凱恩斯機場(CNS)",
        flightHours: 10.5,
        basePriceTWD: 19900,
        directFrom: {},
        transferHubs: ["SIN", "BNE", "SYD", "NRT", "KIX"]
      },
      {
        id: "launceston",
        name: "朗塞斯頓",
        country: "澳洲",
        code: "LST",
        cityCode: "LST",
        altCodes: [],
        airportName: "朗塞斯頓機場(LST)",
        flightHours: 13.0,
        basePriceTWD: 22400,
        directFrom: {},
        transferHubs: ["MEL", "SYD"]
      }
    ]
  },
  {
    id: "others",
    name: "其他",
    count: 15,
    destinations: [
      // Row 1: 開羅, 杜拜, 馬爾地夫, 伊斯坦堡, 新德里
      {
        id: "cairo",
        name: "開羅",
        country: "埃及",
        code: "CAI",
        cityCode: "CAI",
        altCodes: [],
        airportName: "開羅國際機場(CAI)",
        flightHours: 14.5,
        basePriceTWD: 23900,
        directFrom: {},
        transferHubs: ["PVG", "CAN", "PEK", "DXB", "IST", "AUH"]
      },
      {
        id: "dubai",
        name: "杜拜",
        country: "阿聯酋",
        code: "DXB",
        cityCode: "DXB",
        altCodes: [],
        airportName: "杜拜國際機場(DXB)",
        flightHours: 9.5,
        basePriceTWD: 18600,
        directFrom: {
          TPE: ["阿聯酋航空"]
        },
        transferHubs: ["MNL", "HKG", "BKK", "PVG", "CAN"]
      },
      {
        id: "maldives",
        name: "馬爾地夫",
        country: "馬爾地夫",
        code: "MLE",
        cityCode: "MLE",
        altCodes: [],
        airportName: "維拉納國際機場(MLE)",
        flightHours: 9.2,
        basePriceTWD: 16900,
        directFrom: {},
        transferHubs: ["KUL", "SIN", "BKK", "HKG"]
      },
      {
        id: "istanbul",
        name: "伊斯坦堡",
        country: "土耳其",
        code: "IST",
        cityCode: "IST",
        altCodes: [],
        airportName: "伊斯坦堡機場(IST)",
        flightHours: 12.2,
        basePriceTWD: 22800,
        directFrom: {
          TPE: ["土耳其航空"]
        },
        transferHubs: ["PVG", "PEK", "SIN", "BKK", "DXB"]
      },
      {
        id: "new_delhi",
        name: "新德里",
        country: "印度",
        code: "DEL",
        cityCode: "DEL",
        altCodes: [],
        airportName: "英迪拉·甘地國際機場(DEL)",
        flightHours: 8.5,
        basePriceTWD: 14200,
        directFrom: {},
        transferHubs: ["SGN", "HAN", "BKK", "KUL", "HKG"]
      },
      // Row 2: 瓦拉納西, 加德滿都, 關島, 可倫坡, 班加羅爾
      {
        id: "varanasi",
        name: "瓦拉納西",
        country: "印度",
        code: "VNS",
        cityCode: "VNS",
        altCodes: [],
        airportName: "拉爾·巴哈杜爾·夏斯特里機場(VNS)",
        flightHours: 11.5,
        basePriceTWD: 18900,
        directFrom: {},
        transferHubs: ["DEL", "BKK", "BOM"]
      },
      {
        id: "kathmandu",
        name: "加德滿都",
        country: "尼泊爾",
        code: "KTM",
        cityCode: "KTM",
        altCodes: [],
        airportName: "特里布萬國際機場(KTM)",
        flightHours: 8.8,
        basePriceTWD: 16500,
        directFrom: {},
        transferHubs: ["KUL", "BKK", "HKG", "CAN", "TFU"]
      },
      {
        id: "guam",
        name: "關島",
        country: "美國(大洋洲)",
        code: "GUM",
        cityCode: "GUM",
        altCodes: [],
        airportName: "安東尼奧·汪帕特國際機場(GUM)",
        flightHours: 3.8,
        basePriceTWD: 13800,
        directFrom: {
          TPE: ["聯合航空", "中華航空(包機/季節)"]
        },
        transferHubs: ["MNL", "NRT", "ICN", "PUS"]
      },
      {
        id: "colombo",
        name: "可倫坡",
        country: "斯里蘭卡",
        code: "CMB",
        cityCode: "CMB",
        altCodes: [],
        airportName: "班達拉奈克國際機場(CMB)",
        flightHours: 8.5,
        basePriceTWD: 15200,
        directFrom: {},
        transferHubs: ["KUL", "SIN", "BKK", "HKG"]
      },
      {
        id: "bengaluru",
        name: "班加羅爾",
        country: "印度",
        code: "BLR",
        cityCode: "BLR",
        altCodes: [],
        airportName: "坎佩哥達國際機場(BLR)",
        flightHours: 8.8,
        basePriceTWD: 15600,
        directFrom: {},
        transferHubs: ["BKK", "KUL", "SIN", "HKG"]
      },
      // Row 3: 孟買, 塔什干, 帛琉, 利馬, 阿布達比
      {
        id: "mumbai",
        name: "孟買",
        country: "印度",
        code: "BOM",
        cityCode: "BOM",
        altCodes: [],
        airportName: "賈特拉帕蒂·希瓦吉國際機場(BOM)",
        flightHours: 9.0,
        basePriceTWD: 15400,
        directFrom: {},
        transferHubs: ["SGN", "BKK", "KUL", "SIN", "HKG"]
      },
      {
        id: "tashkent",
        name: "塔什干",
        country: "烏茲別克",
        code: "TAS",
        cityCode: "TAS",
        altCodes: [],
        airportName: "塔什干國際機場(TAS)",
        flightHours: 11.2,
        basePriceTWD: 21500,
        directFrom: {},
        transferHubs: ["ICN", "PEK", "BKK", "KUL"]
      },
      {
        id: "palau",
        name: "帛琉",
        country: "帛琉",
        code: "ROR",
        cityCode: "ROR",
        altCodes: [],
        airportName: "羅曼·莫圖國際機場(ROR)",
        flightHours: 3.8,
        basePriceTWD: 14900,
        directFrom: {
          TPE: ["中華航空"]
        },
        transferHubs: ["MNL", "GUM"]
      },
      {
        id: "lima",
        name: "利馬",
        country: "秘魯",
        code: "LIM",
        cityCode: "LIM",
        altCodes: [],
        airportName: "豪爾赫·查韋斯國際機場(LIM)",
        flightHours: 23.5,
        basePriceTWD: 46500,
        directFrom: {},
        transferHubs: ["LAX", "IAH", "AMS", "MAD", "CDG"]
      },
      {
        id: "abu_dhabi",
        name: "阿布達比",
        country: "阿聯酋",
        code: "AUH",
        cityCode: "AUH",
        altCodes: [],
        airportName: "扎耶德國際機場(AUH)",
        flightHours: 11.5,
        basePriceTWD: 19800,
        directFrom: {},
        transferHubs: ["BKK", "KUL", "SIN", "MNL", "ICN"]
      }
    ]
  }
];

module.exports = {
  TAIWAN_AIRPORTS,
  DESTINATION_REGIONS
};
