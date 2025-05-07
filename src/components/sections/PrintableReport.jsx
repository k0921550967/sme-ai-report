import React, { useRef, useEffect } from 'react';
import { User, Building, Phone, Mail, DollarSign, FileText, BarChart2, Layers, Database, Cpu, Search, ChevronRight, Check, Download, Printer } from 'lucide-react';

// 預設靜態數據（如果沒有提供動態數據）
const defaultData = {
  reportInfo: {
    title: "財務驅動中小微碳健檢與AI應用賦能計畫",
    subtitle: "AI財務能力診斷報告",
    caseNumber: "20240327-001",
    date: "2024年3月27日",
    executiveUnit: "財團法人商業發展研究院"
  },
  companyInfo: {
    name: "祥榮食品股份有限公司",
    representative: "王志明",
    address: "新北市五股區工業路185號",
    contactPerson: "李研發",
    uniformNumber: "12345678",
    phone: "(02)2345-6789",
    email: "contact@xiangrong-food.com.tw",
    position: "研發部經理",
    field: "食品製造",
    capital: "50,000 千元",
    revenue: "120,000 千元",
    employees: "65 人",
    mainProducts: "水煮麵、速食湯品、調味料、休閒食品",
    introduction: [
      "祥榮食品股份有限公司成立於1998年，專注於高品質水煮麵與多元化速食食品的研發與製造。公司擁有現代化的食品生產線與檢測設備，致力於提供健康、美味的食品產品，服務對象包括國內外連鎖超市、便利商店及餐飲業者。",
      "公司獲得ISO22000、HACCP等多項國際食品安全認證，產品出口至東南亞及北美多國。近年來，企業積極推動食品科技創新，導入智能化生產技術，並已建立初步的數據收集系統，但仍在尋求更全面的數位轉型方案，以提升研發效率與產品創新能力，滿足消費者不斷變化的需求與口味。"
    ]
  }
};

const PrintableReport = ({ data = defaultData }) => {
  const reportRef = useRef(null);
  
  // 使用傳入的數據或默認數據
  const {
    reportInfo,
    companyInfo,
    tableOfContents,
    diagnosticAnalysis,
    researchScaleEvaluation,
    industryAnalysis,
    digitalTransformationRecommendations,
    visitRecord
  } = data;

  // 向伺服器請求建立PDF並下載
  const downloadPDF = async () => {
    if (!reportRef.current) return;
    
    // 顯示載入提示
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loadingDiv.innerHTML = '<div class="bg-white p-4 rounded-lg shadow-lg"><p class="text-lg font-semibold">正在產生PDF，請稍候...</p></div>';
    document.body.appendChild(loadingDiv);
    
    try {
      // 檢查瀏覽器是否支援HTML轉PDF直接下載的功能
      const hasClient = !!window['html2pdf'];
      
      if (hasClient) {
        // 如果瀏覽器支援，使用客戶端庫直接下載
        const element = reportRef.current;
        const opt = {
          margin: [10, 10, 10, 10],
          filename: '財務驅動中小微碳健檢與AI應用賦能計畫_診斷報告.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true
          },
          jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
          },
          pagebreak: { mode: ['css', 'legacy'] }
        };
        
        // 處理頁面顯示問題
        const sections = element.querySelectorAll('.print\\:page-break-after');
        sections.forEach(section => {
          // 確保每個section在PDF中正確分頁
          section.style.pageBreakAfter = 'always';
          // 移除任何可能導致空白頁的邊距
          section.style.marginBottom = '0';
        });
        
        await window['html2pdf']().from(element).set(opt).save();
      } else {
        // 如果客戶端不支援，使用列印對話框
        alert('您的瀏覽器不支援直接下載PDF，將開啟列印對話框，請選擇"另存為PDF"選項。');
        window.print();
      }
    } catch (error) {
      console.error('產生PDF時發生錯誤:', error);
      alert('產生PDF失敗，請嘗試使用列印功能另存為PDF。');
      // 嘗試使用列印作為備用方案
      window.print();
    } finally {
      // 移除載入提示
      document.body.removeChild(loadingDiv);
    }
  };

  // 當頁面載入完成後，設置列印相關樣式和按鈕
  useEffect(() => {
    // 添加列印時隱藏特定元素的樣式
    const printStyles = document.createElement('style');
    printStyles.innerHTML = `
      @media print {
        /* 隱藏瀏覽器自動添加的列印頁首與頁尾 (日期、URL等) */
        @page {
          margin: 0.5cm;
          size: A4 portrait;
        }
        
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
          margin: 0;
          padding: 0;
        }
        
        /* 徹底隱藏頁首頁尾 */
        html {
          height: 100%;
          overflow: hidden;
        }
      }
    `;
    document.head.appendChild(printStyles);
    
    // 添加直接修改打印設置的腳本
    const printScript = document.createElement('script');
    printScript.innerHTML = `
      window.addEventListener('beforeprint', function() {
        // 嘗試隱藏打印頭部和頁腳
        try {
          const style = document.createElement('style');
          style.id = 'print-override';
          style.innerHTML = '@page { margin: 0 !important; size: A4 portrait; }';
          document.head.appendChild(style);
        } catch (e) {
          console.error('無法修改打印設置', e);
        }
      });
      
      window.addEventListener('afterprint', function() {
        // 打印完成後清理
        const style = document.getElementById('print-override');
        if (style) style.remove();
      });
    `;
    document.head.appendChild(printScript);
    
    // 動態載入html2pdf庫
    const loadHtml2pdf = () => {
      return new Promise((resolve, reject) => {
        if (window['html2pdf']) {
          resolve(window['html2pdf']);
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = () => resolve(window['html2pdf']);
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };
    
    // 嘗試載入html2pdf
    loadHtml2pdf().catch(() => console.log('無法載入html2pdf，將使用列印功能'));

    // 按钮功能已被隱藏
    /*
    // 添加按鈕容器
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'fixed top-4 right-4 flex gap-2 print:hidden z-50';
    
    // 添加列印按鈕
    const printButton = document.createElement('button');
    printButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg> <span>列印報告</span>';
    printButton.className = 'bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 flex items-center gap-2';
    printButton.onclick = () => {
      window.print();
    };
    
    // 添加下載PDF按鈕
    const downloadButton = document.createElement('button');
    downloadButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> <span>下載PDF</span>';
    downloadButton.className = 'bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 flex items-center gap-2';
    downloadButton.onclick = downloadPDF;
    
    // 將按鈕添加到容器
    buttonContainer.appendChild(printButton);
    buttonContainer.appendChild(downloadButton);
    document.body.appendChild(buttonContainer);

    return () => {
      // 清理
      if (document.body.contains(buttonContainer)) {
        document.body.removeChild(buttonContainer);
      }
    };
    */
    
    return () => {
      // 清理樣式和腳本
      if (document.head.contains(printStyles)) {
        document.head.removeChild(printStyles);
      }
      if (document.head.contains(printScript)) {
        document.head.removeChild(printScript);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans p-10 text-black print:p-0 max-w-none" ref={reportRef}>
      {/* Header/Cover Page */}
      <div className="mb-12 text-center print:page-break-after">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-blue-800 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-blue-900 mb-4">財務驅動中小微碳健檢與AI應用賦能計畫</h1>
        <h2 className="text-3xl font-bold mb-8">AI財務能力診斷報告</h2>
        <div className="mt-16 text-xl">
          <div className="mb-2">企業名稱：{companyInfo.name}</div>
          <div className="mb-2">案件編號：{reportInfo.caseNumber}</div>
          <div className="mb-2">診斷日期：{reportInfo.date}</div>
          <div className="mb-2">執行單位：{reportInfo.executiveUnit}</div>
        </div>
      </div>

      {/* 目錄 */}
      <div className="mb-12 print:page-break-after">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">目錄</h2>
        <ul className="space-y-4 text-lg">
          <li className="flex items-center">
            <span className="font-medium mr-4">一、</span>
            <span>廠商基本資料</span>
            <span className="flex-grow border-b border-dashed border-gray-300 mx-4"></span>
            <span>1</span>
          </li>
          <li className="flex items-center">
            <span className="font-medium mr-4">二、</span>
            <span>財務目標轉型量表</span>
            <span className="flex-grow border-b border-dashed border-gray-300 mx-4"></span>
            <span>2</span>
          </li>
          <li className="flex items-center">
            <span className="font-medium mr-4">三、</span>
            <span>診斷量表評估分析</span>
            <span className="flex-grow border-b border-dashed border-gray-300 mx-4"></span>
            <span>5</span>
          </li>
          <li className="flex items-center">
            <span className="font-medium mr-4">四、</span>
            <span>財務轉型建議</span>
            <span className="flex-grow border-b border-dashed border-gray-300 mx-4"></span>
            <span>7</span>
          </li>
          <li className="flex items-center">
            <span className="font-medium mr-4">附錄</span>
            <span>訪視紀錄表</span>
            <span className="flex-grow border-b border-dashed border-gray-300 mx-4"></span>
            <span>10</span>
          </li>
        </ul>
      </div>

      {/* 一、廠商基本資料 */}
      <div className="mb-12 print:page-break-after">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-blue-900">一、廠商基本資料</h2>
          <div className="mt-2 h-1 w-24 bg-orange-400 rounded-full"></div>
        </header>
        
        <div className="bg-white p-6 rounded-xl border-2 border-blue-200 mb-8">
          {/* 製造業類別標籤 - 置頂顯示 */}
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-200">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
              <span className="text-orange-800 font-semibold">製造業</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* 精簡後的聯絡資訊 */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">基本資料</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <div className="text-gray-600 mb-1">公司名稱</div>
                    <div className="text-blue-800 font-medium">{companyInfo.name}</div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-gray-600 mb-1">統一編號</div>
                    <div className="text-blue-800 font-medium">{companyInfo.uniformNumber}</div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-gray-600 mb-1">聯絡人</div>
                    <div className="text-blue-800 font-medium">{companyInfo.contactPerson}</div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-gray-600 mb-1">職稱</div>
                    <div className="text-blue-800 font-medium">{companyInfo.position}</div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-gray-600 mb-1">電話</div>
                    <div className="text-blue-800 font-medium">{companyInfo.phone}</div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-gray-600 mb-1">E-Mail</div>
                    <div className="text-blue-800 font-medium">{companyInfo.email}</div>
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <div className="text-gray-600 mb-1">公司地址</div>
                    <div className="text-blue-800 font-medium">{companyInfo.address}</div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-gray-600 mb-1">負責人</div>
                    <div className="text-blue-800 font-medium">{companyInfo.representative}</div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-gray-600 mb-1">資本額</div>
                    <div className="text-blue-800 font-medium">{companyInfo.capital}</div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-gray-600 mb-1">營業額(預估)</div>
                    <div className="text-blue-800 font-medium">{companyInfo.revenue}</div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-gray-600 mb-1">員工人數</div>
                    <div className="text-blue-800 font-medium">{companyInfo.employees}</div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-gray-600 mb-1">主要產品</div>
                    <div className="text-blue-800 font-medium">{companyInfo.mainProducts}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border-2 border-blue-200">
          <h3 className="text-xl font-bold text-blue-800 mb-6">公司簡介</h3>
          <p className="text-gray-700 leading-relaxed">
            {companyInfo.introduction[0]}
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            {companyInfo.introduction[1]}
          </p>
        </div>
      </div>

      {/* 二、財務能力量表 */}
      <div className="mb-12 print:page-break-after">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-blue-900">二、財務目標轉型量表</h2>
          <div className="mt-2 h-1 w-24 bg-orange-400 rounded-full"></div>
        </header>
        
        <div className="bg-white p-6 rounded-xl border-2 border-blue-200 mb-8">
          <h3 className="text-xl font-bold text-blue-800 mb-6">數位化推動優先目標</h3>
          
          <div className="flex items-center justify-center mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">{companyInfo.name || '祥榮食品'}</div>
              <div className="text-gray-500 mt-1">數位轉型目標評估</div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="text-blue-800 font-medium mb-2">評估項目（1分為「最不需要推動」，5分為「最需要推動」）</div>
          </div>
          
          <div className="space-y-6">
            {/* 進銷存管理 */}
            <div>
              <div className="flex justify-between items-center bg-gradient-to-r from-blue-100 to-blue-50 p-3 rounded-t-lg border-b-2 border-blue-200">
                <div className="font-medium text-blue-900">一、進銷存管理</div>
                <div className="font-medium text-blue-800">8/15</div>
              </div>
              
              <div className="space-y-4 p-4 bg-white border border-blue-100 rounded-b-lg">
                <div className="flex items-start">
                  <div className="bg-blue-200 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-medium text-sm">A1</div>
                  <div>
                    <div className="text-gray-800">建立或優化ERP(企業資源規劃系統)，以進行系統化、智慧化的進、銷、存管理與分析</div>
                    <div className="flex items-center mt-1">
                      <div className="flex space-x-1 mr-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-2 w-5 bg-blue-600 rounded-sm"></div>
                        ))}
                        {[1, 2].map(i => (
                          <div key={i} className="h-2 w-5 bg-blue-200 rounded-sm"></div>
                        ))}
                      </div>
                      <span className="text-sm text-blue-700">3分 - 想要強化ERP系統之報表分析功能</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-200 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-medium text-sm">A2</div>
                  <div>
                    <div className="text-gray-800">建立數位化、智慧化的盤點系統，減少人力負擔，提高盤點正確度</div>
                    <div className="flex items-center mt-1">
                      <div className="flex space-x-1 mr-2">
                        {[1, 2].map(i => (
                          <div key={i} className="h-2 w-5 bg-blue-600 rounded-sm"></div>
                        ))}
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-2 w-5 bg-blue-200 rounded-sm"></div>
                        ))}
                      </div>
                      <span className="text-sm text-blue-700">2分 - 想要導入數位化報表(如：Excel)，減少盤點紙本作業</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-200 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-medium text-sm">A3</div>
                  <div>
                    <div className="text-gray-800">進行數位化、智慧化的庫存管理與分析</div>
                    <div className="flex items-center mt-1">
                      <div className="flex space-x-1 mr-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-2 w-5 bg-blue-600 rounded-sm"></div>
                        ))}
                        {[1, 2].map(i => (
                          <div key={i} className="h-2 w-5 bg-blue-200 rounded-sm"></div>
                        ))}
                      </div>
                      <span className="text-sm text-blue-700">3分 - 想要導入庫存管理系統，提高庫存精確度，降低人力需求</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 財務流程自動化 */}
            <div>
              <div className="flex justify-between items-center bg-gradient-to-r from-indigo-100 to-indigo-50 p-3 rounded-t-lg border-b-2 border-indigo-200">
                <div className="font-medium text-indigo-900">二、財務流程自動化</div>
                <div className="font-medium text-indigo-800">10/15</div>
              </div>
              
              <div className="space-y-4 p-4 bg-white border border-indigo-100 rounded-b-lg">
                <div className="flex items-start">
                  <div className="bg-indigo-200 text-indigo-800 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-medium text-sm">B1</div>
                  <div>
                    <div className="text-gray-800">建立電子發票與記帳系統，加速記帳作業</div>
                    <div className="flex items-center mt-1">
                      <div className="flex space-x-1 mr-2">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="h-2 w-5 bg-indigo-500 rounded-sm"></div>
                        ))}
                        <div className="h-2 w-5 bg-indigo-200 rounded-sm"></div>
                      </div>
                      <span className="text-sm text-indigo-700">4分 - 想要推動記帳系統自動化，整合電子發票與AI紙本單據辨識系統</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-indigo-200 text-indigo-800 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-medium text-sm">B2</div>
                  <div>
                    <div className="text-gray-800">導入電子支付系統，降低人工對處理時間，減少錯誤</div>
                    <div className="flex items-center mt-1">
                      <div className="flex space-x-1 mr-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-2 w-5 bg-indigo-500 rounded-sm"></div>
                        ))}
                        {[1, 2].map(i => (
                          <div key={i} className="h-2 w-5 bg-indigo-200 rounded-sm"></div>
                        ))}
                      </div>
                      <span className="text-sm text-indigo-700">3分 - 想要導入電子支付整合系統，提升帳務處理效率並降低錯帳風險</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-indigo-200 text-indigo-800 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-medium text-sm">B3</div>
                  <div>
                    <div className="text-gray-800">導入銀行對帳自動化，減少人工對帳時間</div>
                    <div className="flex items-center mt-1">
                      <div className="flex space-x-1 mr-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-2 w-5 bg-indigo-500 rounded-sm"></div>
                        ))}
                        {[1, 2].map(i => (
                          <div key={i} className="h-2 w-5 bg-indigo-200 rounded-sm"></div>
                        ))}
                      </div>
                      <span className="text-sm text-indigo-700">3分 - 想要導入銀行對帳自動化系統，提升對帳效率與準確性</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 財務數據分析 */}
            <div>
              <div className="flex justify-between items-center bg-gradient-to-r from-teal-100 to-teal-50 p-3 rounded-t-lg border-b-2 border-teal-200">
                <div className="font-medium text-teal-900">三、財務數據分析</div>
                <div className="font-medium text-teal-800">11/15</div>
              </div>
              
              <div className="space-y-4 p-4 bg-white border border-teal-100 rounded-b-lg">
                <div className="flex items-start">
                  <div className="bg-teal-200 text-teal-800 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-medium text-sm">C1</div>
                  <div>
                    <div className="text-gray-800">建立財務數據資料庫，強化決策支援能力</div>
                    <div className="flex items-center mt-1">
                      <div className="flex space-x-1 mr-2">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="h-2 w-5 bg-teal-500 rounded-sm"></div>
                        ))}
                        <div className="h-2 w-5 bg-teal-200 rounded-sm"></div>
                      </div>
                      <span className="text-sm text-teal-700">4分 - 想要推動財務數據資料庫分析系統，提供即時資料分析與報表功能</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-teal-200 text-teal-800 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-medium text-sm">C2</div>
                  <div>
                    <div className="text-gray-800">使用財務數據分析工具，強化分析能力</div>
                    <div className="flex items-center mt-1">
                      <div className="flex space-x-1 mr-2">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="h-2 w-5 bg-teal-500 rounded-sm"></div>
                        ))}
                        <div className="h-2 w-5 bg-teal-200 rounded-sm"></div>
                      </div>
                      <span className="text-sm text-teal-700">4分 - 想要推動財務數據分析工具與ERP系統整合，以提供即時分析及報表功能</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-teal-200 text-teal-800 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-medium text-sm">C3</div>
                  <div>
                    <div className="text-gray-800">設定適合企業的KPI(關鍵績效指標)，追蹤財務績效</div>
                    <div className="flex items-center mt-1">
                      <div className="flex space-x-1 mr-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-2 w-5 bg-teal-500 rounded-sm"></div>
                        ))}
                        {[1, 2].map(i => (
                          <div key={i} className="h-2 w-5 bg-teal-200 rounded-sm"></div>
                        ))}
                      </div>
                      <span className="text-sm text-teal-700">3分 - 想要建立財務 K PI，強化預算控制、費用管理與績效追蹤功能</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 成本與風險管理 */}
            <div>
              <div className="flex justify-between items-center bg-gradient-to-r from-orange-100 to-orange-50 p-3 rounded-t-lg border-b-2 border-orange-200">
                <div className="font-medium text-orange-900">四、成本與風險管理</div>
                <div className="font-medium text-orange-800">12/15</div>
              </div>
              
              <div className="space-y-4 p-4 bg-white border border-orange-100 rounded-b-lg">
                <div className="flex items-start">
                  <div className="bg-orange-200 text-orange-800 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-medium text-sm">D1</div>
                  <div>
                    <div className="text-gray-800">制定成本預算控管規則，並警示異常</div>
                    <div className="flex items-center mt-1">
                      <div className="flex space-x-1 mr-2">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="h-2 w-5 bg-orange-500 rounded-sm"></div>
                        ))}
                        <div className="h-2 w-5 bg-orange-200 rounded-sm"></div>
                      </div>
                      <span className="text-sm text-orange-700">4分 - 想要推動即時性預算追蹤及預警機制，提升資源分配效率與預算執行控管能力</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-orange-200 text-orange-800 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-medium text-sm">D2</div>
                  <div>
                    <div className="text-gray-800">追蹤應收付帳款狀況，管理異常風險</div>
                    <div className="flex items-center mt-1">
                      <div className="flex space-x-1 mr-2">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="h-2 w-5 bg-orange-500 rounded-sm"></div>
                        ))}
                        <div className="h-2 w-5 bg-orange-200 rounded-sm"></div>
                      </div>
                      <span className="text-sm text-orange-700">4分 - 想要推動即時應收付帳款追蹤與預警機制，降低呆帳風險並改善資金流動性</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-orange-200 text-orange-800 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-medium text-sm">D3</div>
                  <div>
                    <div className="text-gray-800">追蹤現金流量狀況，警示異常風險</div>
                    <div className="flex items-center mt-1">
                      <div className="flex space-x-1 mr-2">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="h-2 w-5 bg-orange-500 rounded-sm"></div>
                        ))}
                        <div className="h-2 w-5 bg-orange-200 rounded-sm"></div>
                      </div>
                      <span className="text-sm text-orange-700">4分 - 想要推動即時現金流量預測系統，進行動態現金流監控與短中期資金規劃</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border-2 border-blue-200">
          <h3 className="text-xl font-bold text-blue-800 mb-6">能力分佈評估</h3>
          
          {/* 能力條形圖 */}
          <div className="space-y-6 mb-6">
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <div className="font-semibold text-blue-900">進銷存管理</div>
                <div className="text-blue-700">8/15</div>
              </div>
              <div className="relative w-full h-8 bg-blue-50 rounded-lg overflow-hidden">
                <div
                  className="h-full rounded-lg"
                  style={{
                    width: `${(8/15)*100}%`,
                    background: `linear-gradient(90deg, #1E40AF 0%, #60A5FA 100%)`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <span className="text-white font-medium drop-shadow-md">
                    53%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <div className="font-semibold text-indigo-900">財務流程自動化</div>
                <div className="text-indigo-700">10/15</div>
              </div>
              <div className="relative w-full h-8 bg-indigo-50 rounded-lg overflow-hidden">
                <div
                  className="h-full rounded-lg"
                  style={{
                    width: `${(10/15)*100}%`,
                    background: `linear-gradient(90deg, #4F46E5 0%, #A5B4FC 100%)`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <span className="text-white font-medium drop-shadow-md">
                    67%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <div className="font-semibold text-teal-900">財務數據分析</div>
                <div className="text-teal-700">11/15</div>
              </div>
              <div className="relative w-full h-8 bg-teal-50 rounded-lg overflow-hidden">
                <div
                  className="h-full rounded-lg"
                  style={{
                    width: `${(11/15)*100}%`,
                    background: `linear-gradient(90deg, #0D9488 0%, #5EEAD4 100%)`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <span className="text-white font-medium drop-shadow-md">
                    73%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <div className="font-semibold text-orange-900">成本與風險管理</div>
                <div className="text-orange-700">12/15</div>
              </div>
              <div className="relative w-full h-8 bg-orange-50 rounded-lg overflow-hidden">
                <div
                  className="h-full rounded-lg"
                  style={{
                    width: `${(12/15)*100}%`,
                    background: `linear-gradient(90deg, #EA580C 0%, #FDBA74 100%)`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <span className="text-white font-medium drop-shadow-md">
                    80%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 能力評估摘要 */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="text-lg font-semibold text-blue-800 mb-2">財務數位轉型推動重點分析</div>
            <div className="text-gray-700">
              <div className="mb-1"><span className="font-medium">優先發展：</span>成本與風險管理已具基礎 (80%)，建議作為轉型發展的基石，帶動其他領域成長。</div>
              <div><span className="font-medium">急需突破：</span>進銷存管理推動程度較低 (53%)，應作為數位轉型的關鍵突破口。</div>
            </div>
          </div>
        </div>
      </div>

      {/* 三、診斷量表評估分析 */}
      <div className="mb-12 print:page-break-after">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-blue-900">三、診斷量表評估分析</h2>
          <div className="mt-2 h-1 w-24 bg-orange-400 rounded-full"></div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl border-2 border-blue-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-blue-800">進銷存管理評估</h3>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="text-2xl font-bold text-blue-800">8</div>
              <div className="text-gray-500 ml-1">/15分</div>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              進銷存管理評估顯示企業在ERP系統報表功能、盤點系統自動化和庫存管理系統三個方面都有不同程度的發展需求。其中，ERP系統報表功能評估為3分，顯示企業希望強化基礎分析能力；盤點系統自動化評估為2分，反映這方面還有較大提升空間；庫存管理系統評估為3分，表明企業認識到庫存管理對營運的重要性。
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              從整體評估來看，進銷存管理是企業當前最需要投入資源的領域。首要任務是提升ERP系統的報表分析功能，讓庫存預測與分析更精準。同時，可以考慮導入掃碼盤點系統，這樣不僅能減少人力負擔，還能大幅提高盤點準確度。在庫存管理方面，建議與ERP系統進行深度整合，打造全面的庫存可視化管理平台，並建立即時預警機制，有效降低庫存積壓與短缺風險。
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border-2 border-blue-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-blue-800">財務流程自動化評估</h3>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="text-2xl font-bold text-blue-800">10</div>
              <div className="text-gray-500 ml-1">/15分</div>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              財務流程自動化評估顯示企業在電子發票與記帳系統、電子支付系統和銀行對帳自動化三個方面都有明確的發展方向。其中，電子發票與記帳系統評估為4分，反映企業對自動化記帳的重視；電子支付系統評估為3分，顯示已有基礎整合；銀行對帳自動化評估為3分，表明企業正在推動減少人工作業。
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              觀察到電子發票系統的評估分數最高，顯示這是企業最關注的領域。下一步可以著重於將電子發票系統與AI紙本單據辨識功能整合，打造完整的記帳自動化流程。同時，建議加強電子支付系統與ERP的連結，建立更完善的帳務處理機制。對於銀行對帳部分，可以考慮引進專業的對帳自動化工具，這樣不僅能提高對帳效率，還能確保準確性，最終實現與ERP財務系統的無縫整合。
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border-2 border-blue-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                <Search className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-blue-800">財務數據分析評估</h3>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="text-2xl font-bold text-blue-800">11</div>
              <div className="text-gray-500 ml-1">/15分</div>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              財務數據分析評估顯示企業在財務數據資料庫、財務數據分析工具和財務KPI設定三個方面都有較高的發展意願。其中，財務數據資料庫和財務數據分析工具均評估為4分，反映企業已建立較完善的財務分析基礎；財務KPI設定評估為3分，顯示企業已開始注重績效追蹤，但仍有優化空間。
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              從評估分數可以看出，財務數據分析是企業較為重視的領域。接下來可以著重於建立更強大的財務數據資料庫分析系統，確保能即時提供準確的資料分析與報表。同時，建議將財務數據分析工具與ERP系統進行整合，這樣不僅能提升分析效率，還能確保數據的一致性。在KPI管理方面，可以考慮建立更完整的財務指標體系，強化預算控制與績效追蹤功能，並導入智能預警機制，幫助企業提前發現財務風險與機會。
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border-2 border-blue-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-blue-800">成本與風險管理評估</h3>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="text-2xl font-bold text-blue-800">12</div>
              <div className="text-gray-500 ml-1">/15分</div>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              成本與風險管理評估顯示企業在預算控管、應收付帳款管理和現金流量追蹤三個方面都有較高的發展意願。其中，預算控管、應收付帳款管理和現金流量追蹤均評估為4分，反映企業對財務風險管理的高度重視，這是企業較為關注的領域。
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              成本與風險管理是評估結果最突出的領域，這顯示企業在此方面有較強的發展意願。在此基礎上，可以進一步優化即時預算追蹤及預警機制，讓資源分配更有效率，預算執行更精準。同時，建議強化應收付帳款追蹤系統，這樣不僅能更準確地預測呆帳風險，還能改善資金流動性。在現金流管理方面，可以考慮引進更先進的動態監控工具，完善短中期資金規劃能力，並逐步發展智能預測功能，為企業提供更精準的財務決策支持。
            </p>
          </div>
        </div>
      </div>

      {/* 四、數位轉型建議 */}
      <div className="mb-12 print:page-break-after">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-blue-900">四、財務轉型建議</h2>
          <div className="mt-2 h-1 w-24 bg-orange-400 rounded-full"></div>
        </header>
        
        <div className="bg-white p-6 rounded-xl border-2 border-blue-200 mb-8">
          <h3 className="text-xl font-bold text-blue-800 mb-6">財務與庫存數位化優先面向建議</h3>
          
          <div className="space-y-6">
            {/* 面向優先順序說明 */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-700">根據貴公司目前的數位成熟度評估，以下提供四個財務與庫存數位化面向，並依據優先順序排列。數字為現階段完成度評估。</p>
            </div>
            
            {/* 成本與風險管理 - 最高優先級 */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center mr-3 font-bold">1</div>
                  <h4 className="text-lg font-semibold text-blue-800">成本與風險管理</h4>
                </div>
                <div className="flex items-center">
                  <div className="text-blue-800 font-bold mr-2">12/15</div>
                  <div className="w-24 h-3 bg-gray-200 rounded-full">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <div className="ml-2 text-blue-800 font-medium">80%</div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-blue-700 font-medium mb-1">重點工作</div>
                <ul className="text-gray-700 pl-5 list-disc space-y-1">
                  <li>即時預算追蹤及預警機制優化</li>
                  <li>應收付帳款追蹤系統強化</li>
                  <li>動態現金流監控工具導入</li>
                </ul>
              </div>
              
              <div className="mb-4">
                <div className="text-blue-700 font-medium mb-1">預期效益</div>
                <p className="text-gray-700 text-sm">
                  透過即時預算追蹤及預警機制，可顯著提升資源分配效率與預算執行控管能力。精確的應收付帳款追蹤系統能降低呆帳風險並改善資金流動性。動態現金流監控工具則有助於完善短中期資金規劃，提供更精準的財務決策支持，降低營運風險。
                </p>
              </div>
              
              <div className="mb-4">
                <div className="text-blue-700 font-medium mb-1">轉型工具</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <div className="font-medium text-blue-700 mb-2">製造材料成本分析系統</div>
                    <div className="text-sm text-gray-500 mb-1">服務機構：AI 財務人培</div>
                    <p className="text-gray-700 text-sm">根據製造業需求設計請採購、進銷存、財會及成本，以AI產生作業表報，以雲端架構減少主機管理人員及降低建置費，透過AI計算，可產出管理加工單並算出材料需求量，並提供鋼鐵材計算公式，可計算出重量(長、寬、係數)、總成本、毛利。</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <div className="font-medium text-blue-700 mb-2">財會流程管理及自動化工具</div>
                    <div className="text-sm text-gray-500 mb-1">服務機構：AI 財務人培</div>
                    <p className="text-gray-700 text-sm">圖視化管理：數據資料圖像化，方便管理者分析各項數據資料。工廠系統：新增自動生產排程，及PDM圖文保密管理系統。行動辦公：外勤人員辦公數位化。流程自動化操作：銷售、財會、採購、研發、庫存、及生管等循環的自動化。RPA功能與AI模型優化：提升操作人員對RPA分析數據應用的掌握度，幫助企業更好地應用數據，提高財務流程自動化。</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 財務數據分析 - 第二優先級 */}
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-800 text-white flex items-center justify-center mr-3 font-bold">2</div>
                  <h4 className="text-lg font-semibold text-indigo-800">財務數據分析</h4>
                </div>
                <div className="flex items-center">
                  <div className="text-indigo-800 font-bold mr-2">11/15</div>
                  <div className="w-24 h-3 bg-gray-200 rounded-full">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: '73%' }}></div>
                  </div>
                  <div className="ml-2 text-indigo-800 font-medium">73%</div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-indigo-700 font-medium mb-1">重點工作</div>
                <ul className="text-gray-700 pl-5 list-disc space-y-1">
                  <li>財務數據資料庫分析系統建置</li>
                  <li>財務分析工具與ERP系統整合</li>
                  <li>財務KPI指標體系建立</li>
                </ul>
              </div>
              
              <div className="mb-4">
                <div className="text-indigo-700 font-medium mb-1">預期效益</div>
                <p className="text-gray-700 text-sm">
                  建立財務數據資料庫分析系統，能提供即時、準確的財務資料分析與報表功能，強化決策支持。財務分析工具與ERP系統整合，可實現數據一致性與分析效率提升。完善的財務KPI指標體系，有助於前瞻性識別財務風險與機會，提高企業財務管理水平。
                </p>
              </div>
              
              <div className="mb-4">
                <div className="text-indigo-700 font-medium mb-1">轉型工具</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="bg-white p-4 rounded-lg border border-indigo-200">
                    <div className="font-medium text-indigo-700 mb-2">BI分析平台</div>
                    <div className="text-sm text-gray-500 mb-1">服務機構：商業署30人以下數轉培力計畫</div>
                    <p className="text-gray-700 text-sm">應用程式和連接器的集合，其可共同運作以協助您和企業透過最有效的方式建立、共用和取用商業見解，直接從瀏覽器使用報表以及這些報表中的各個視覺效果元素並與之互動。BI 服務中的儀表板可協助您掌握業務脈動。您可以選取儀表板所顯示的「磚」來開啟「報表」，以進一步探索。儀表板和報表會根據其所基於的語意模型建立其互動式視覺效果，使您的資料能夠成為視覺效果，並將這些視覺效果組織到報表中。</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-indigo-200">
                    <div className="font-medium text-indigo-700 mb-2">雲端 AI 庫存盤點平台</div>
                    <div className="text-sm text-gray-500 mb-1">服務機構：SME AI</div>
                    <p className="text-gray-700 text-sm">專為中小企業打造的智慧營運解決方案，強調「10 個功能、3 個步驟」即可快速啟動數位轉型。結合先進的庫存盤點系統與企業內部動態分享工具，協助企業在營運管理與團隊協作上全面升級，讓營運流程更聰明、決策更精準。</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 財務流程自動化 - 第三優先級 */}
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-teal-800 text-white flex items-center justify-center mr-3 font-bold">3</div>
                  <h4 className="text-lg font-semibold text-teal-800">財務流程自動化</h4>
                </div>
                <div className="flex items-center">
                  <div className="text-teal-800 font-bold mr-2">10/15</div>
                  <div className="w-24 h-3 bg-gray-200 rounded-full">
                    <div className="h-full bg-teal-600 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                  <div className="ml-2 text-teal-800 font-medium">67%</div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-teal-700 font-medium mb-1">重點工作</div>
                <ul className="text-gray-700 pl-5 list-disc space-y-1">
                  <li>電子發票與AI紙本單據辨識整合</li>
                  <li>電子支付與ERP系統連結</li>
                  <li>銀行對帳自動化工具導入</li>
                </ul>
              </div>
              
              <div className="mb-4">
                <div className="text-teal-700 font-medium mb-1">預期效益</div>
                <p className="text-gray-700 text-sm">
                  電子發票與AI紙本單據辨識整合可大幅減少人工輸入錯誤與時間成本，提高記帳效率。電子支付與ERP系統連結能建立完整的帳務處理閉環，提升財務透明度與追蹤性。銀行對帳自動化工具則可顯著提高對帳效率與準確性，減少人力投入，降低錯誤率。
                </p>
              </div>
              
              <div className="mb-4">
                <div className="text-teal-700 font-medium mb-1">轉型工具</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="bg-white p-4 rounded-lg border border-teal-200">
                    <div className="font-medium text-teal-700 mb-2">財會流程管理及自動化工具</div>
                    <div className="text-sm text-gray-500 mb-1">服務機構：AI 財務人培</div>
                    <p className="text-gray-700 text-sm">圖視化管理：數據資料圖像化，方便管理者分析各項數據資料。工廠系統：新增自動生產排程，及PDM圖文保密管理系統。行動辦公：外勤人員辦公數位化。流程自動化操作：銷售、財會、採購、研發、庫存、及生管等循環的自動化。RPA功能與AI模型優化：提升操作人員對RPA分析數據應用的掌握度，幫助企業更好地應用數據，提高財務流程自動化。</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-teal-200">
                    <div className="font-medium text-teal-700 mb-2">AI表單識別工具</div>
                    <div className="text-sm text-gray-500 mb-1">服務機構：AI 財務人培</div>
                    <p className="text-gray-700 text-sm">透過AI 辨識系統，兼具效率、準確性，一次可處理大量圖檔、文件資訊，且不受語言別、地域限制，確實辨識所有必要資訊。自動提取資訊並透過 API 輸入至指定欄位，解決過去人工登打錯誤率，並大幅提升作業效率。</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 進銷存管理 - 第四優先級 */}
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-800 text-white flex items-center justify-center mr-3 font-bold">4</div>
                  <h4 className="text-lg font-semibold text-orange-800">進銷存管理</h4>
                </div>
                <div className="flex items-center">
                  <div className="text-orange-800 font-bold mr-2">8/15</div>
                  <div className="w-24 h-3 bg-gray-200 rounded-full">
                    <div className="h-full bg-orange-600 rounded-full" style={{ width: '53%' }}></div>
                  </div>
                  <div className="ml-2 text-orange-800 font-medium">53%</div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-orange-700 font-medium mb-1">重點工作</div>
                <ul className="text-gray-700 pl-5 list-disc space-y-1">
                  <li>ERP系統報表分析功能強化</li>
                  <li>掃碼盤點系統導入</li>
                  <li>庫存管理與ERP系統整合</li>
                </ul>
              </div>
              
              <div className="mb-4">
                <div className="text-orange-700 font-medium mb-1">預期效益</div>
                <p className="text-gray-700 text-sm">
                  強化ERP系統報表分析功能，可提供更精準的庫存預測與分析，優化採購決策。掃碼盤點系統導入能顯著提高盤點效率與準確性，減少人力成本。庫存管理與ERP系統整合則可實現全面的庫存可視化，建立完善的庫存預警機制，有效降低積壓與短缺風險。
                </p>
              </div>
              
              <div className="mb-4">
                <div className="text-orange-700 font-medium mb-1">轉型工具</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="bg-white p-4 rounded-lg border border-orange-200">
                    <div className="font-medium text-orange-700 mb-2">跨國跨系統會計帳整合系統</div>
                    <div className="text-sm text-gray-500 mb-1">服務機構：SME AI</div>
                    <p className="text-gray-700 text-sm">本財務管理系統專為中小微型企業及新創公司量身打造，涵蓋會計總帳、應收應付與財產管理等核心功能，協助企業掌握資金流向與財務健康狀況。系統操作簡便，無需依賴工程師即可上手設定，支援中、英、日三語介面與報表，滿足國際業務需求，也大幅降低導入與轉換門檻。</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-orange-200">
                    <div className="font-medium text-orange-700 mb-2">食品履歷追溯追蹤系統</div>
                    <div className="text-sm text-gray-500 mb-1">服務機構：雲市集工業館 - 雲端解決方案</div>
                    <p className="text-gray-700 text-sm">食品廠及其供應商都在同個cloud系統，資料容易整合。可將內部的ERP/倉管/生管/品管系統與「食品履歷追溯追蹤系統」整合，將產品及物料的資料自動匯入建好履歷，讓料件管理更高效。消費者可透過掃描食品外包裝的QR Code查詢系統上的原料履歷，提升產品透明度與消費者信任。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 頁尾 */}
      <footer className="text-center text-gray-500 text-sm mt-10">
        <div>© 2025 財團法人商業發展研究院</div>
        <div>財務驅動中小微碳健檢與AI應用賦能計畫</div>
      </footer>

      {/* 列印專用樣式 */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page {
              size: A4;
              margin: 15mm 10mm;
            }
            
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              font-size: 12pt;
            }
            
            .print\\:page-break-after {
              page-break-after: always;
              margin-bottom: 0 !important;
              padding-bottom: 0 !important;
            }
            
            .print\\:page-break-before {
              page-break-before: always;
              margin-top: 0 !important;
              padding-top: 0 !important;
            }
            
            .no-print, .print\\:hidden {
              display: none !important;
            }

            /* 確保所有元素都能正確顯示 */
            * {
              overflow: visible !important;
            }

            /* 確保背景色打印 */
            div, p, span, h1, h2, h3, h4, h5, h6 {
              background-color: inherit !important;
              color: inherit !important;
            }
            
            /* 避免不必要的分頁 */
            svg, .chart-container, .bg-white {
              page-break-inside: avoid;
            }
          }
        `
      }} />
    </div>
  );
};

export default PrintableReport;