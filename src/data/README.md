# 動態 AI 報告生成 JSON 模板

本資料夾包含用於動態生成 AI 報告的 JSON 模板結構。這些模板定義了報告的內容結構，可以根據不同廠商的數據進行客製化，生成專屬的診斷報告。

## 檔案說明

1. `reportTemplate.json` - 主要報告模板，包含報告基本資訊、公司資訊、診斷分析與產業分析等內容
2. `transformationRecommendations.json` - 數位轉型建議模板，包含階段建議與推薦工具等內容

## 使用方法

這些模板可與 `PrintableReport.jsx` 組件結合使用，進行動態報告生成：

```javascript
// 範例代碼：載入模板與客製化數據
import reportTemplate from '../data/reportTemplate.json';
import transformationRecommendations from '../data/transformationRecommendations.json';
import companyData from '../data/companies/example-company.json';

// 合併數據
const reportData = {
  ...reportTemplate,
  ...transformationRecommendations,
  companyInfo: {
    ...reportTemplate.companyInfo,
    ...companyData
  }
};

// 使用合併後的數據渲染報告
return <PrintableReport data={reportData} />;
```

## 模板結構

### reportTemplate.json

```
{
  "reportInfo": { /* 報告基本信息 */ },
  "companyInfo": { /* 公司基本資料 */ },
  "tableOfContents": [ /* 目錄項目 */ ],
  "diagnosticAnalysis": { /* 診斷分析數據 */ },
  "researchScaleEvaluation": { /* 研發量表評估 */ },
  "industryAnalysis": { /* 產業分析數據 */ }
}
```

### transformationRecommendations.json

```
{
  "digitalTransformationRecommendations": {
    "stages": [ /* 數位轉型階段建議 */ ],
    "recommendedTools": [ /* 推薦工具與軟體 */ ]
  },
  "visitRecord": { /* 訪視紀錄相關資訊 */ }
}
```

## 客製化指南

1. **更新公司資訊**：修改 `companyInfo` 部分，包括公司名稱、聯絡人、產品等
2. **調整診斷分析**：根據實際評估結果修改 `diagnosticAnalysis` 中的評分和建議
3. **客製化產業分析**：根據不同產業特性和市場數據，更新 `industryAnalysis` 中的圖表和分析內容
4. **優化建議方案**：根據企業需求和痛點，調整 `digitalTransformationRecommendations` 中的階段和工具建議

## 擴展方式

可以建立多個企業的數據文件（如 `company-a.json`, `company-b.json`），只包含企業獨特的資訊，這樣在需要生成新報告時，只需替換企業數據文件，而保留模板的基本結構。

## 圖表數據

報告中的圖表數據（如價格品牌定位、月銷售分析等）可以從外部數據源獲取，或是基於真實市場數據進行構建。圖表組件的資料屬性也可以從模板中提取使用。
