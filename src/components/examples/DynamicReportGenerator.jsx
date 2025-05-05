import React, { useState, useEffect } from 'react';
import PrintableReport from '../sections/PrintableReport';

// 匯入基本模板
import reportTemplate from '../../data/reportTemplate.json';
import transformationRecommendations from '../../data/transformationRecommendations.json';

// 移除公司資料範例的匯入
// import exampleCompany from '../../data/companies/example-company.json';

const DynamicReportGenerator = () => {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [selectedCompany, setSelectedCompany] = useState('template'); // 不再需要選擇公司
  
  // 直接使用模板資料生成報告
  useEffect(() => {
    setIsLoading(true);
    // 合併模板和建議
    const combinedTemplate = {
      ...reportTemplate,
      ...transformationRecommendations
    };
    
    // 模擬載入時間
    setTimeout(() => {
      setReportData(combinedTemplate);
      setIsLoading(false);
    }, 500); // 縮短載入時間，因為不再模擬API

  }, []); // 移除 selectedCompany 依賴
  
  // 移除 generateReportData 函數，因為數據在 useEffect 中準備好
  
  // 移除公司選擇器相關邏輯
  // const handleCompanyChange = (e) => {
  //   setSelectedCompany(e.target.value);
  // };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">載入中...</span>
          </div>
          <p className="mt-3">正在生成報告，請稍候...</p>
        </div>
      </div>
    );
  }
  
  // const reportData = generateReportData(); // 移除，數據已在 state 中
  
  if (!reportData) {
    return <div>無法生成報告：缺少模板資料</div>;
  }
  
  return (
    <div>
      <div className="mb-4 p-4 bg-gray-100 print:hidden">
        <h2 className="text-xl font-bold mb-3">報告預覽</h2>
        
        {/* 移除公司選擇器 */}
        {/* <div className="mb-3">
          <label htmlFor="companySelector" className="block mb-2">選擇公司：</label>
          <select 
            id="companySelector"
            className="w-full p-2 border rounded"
            value={selectedCompany}
            onChange={handleCompanyChange}
          >
            <option value="template">報告模板</option> 
          </select>
        </div> */}
        
        <div className="flex justify-between">
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => window.print()}
          >
            預覽並列印報告
          </button>
          
          <button 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => {
              alert('此功能將在實際應用中實現報告下載功能');
            }}
          >
            下載報告 PDF
          </button>
        </div>
      </div>
      
      {/* 使用模板數據渲染報告 */}
      <PrintableReport data={reportData} />
    </div>
  );
};

export default DynamicReportGenerator; 