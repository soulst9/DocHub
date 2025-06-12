const puppeteer = require('puppeteer');
const { marked } = require('marked');

// PDF 생성 함수
async function generatePDF(article) {
  let browser;
  
  try {
    // Puppeteer 브라우저 실행
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // 마크다운을 HTML로 변환
    const htmlContent = marked(article.content || '');
    
    // PDF용 HTML 템플릿
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${article.title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            
            h1 {
              color: #1a1a1a;
              border-bottom: 3px solid #3b82f6;
              padding-bottom: 10px;
              margin-bottom: 30px;
            }
            
            .meta-info {
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
              border-left: 4px solid #3b82f6;
            }
            
            .meta-item {
              margin-bottom: 8px;
              font-size: 14px;
              color: #64748b;
            }
            
            .meta-label {
              font-weight: 600;
              color: #374151;
            }
            
            .tags {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-top: 10px;
            }
            
            .tag {
              background: #e0e7ff;
              color: #3730a3;
              padding: 4px 12px;
              border-radius: 16px;
              font-size: 12px;
              font-weight: 500;
            }
            
            .content {
              margin-top: 40px;
            }
            
            img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              margin: 20px 0;
            }
            
            code {
              background: #f1f5f9;
              padding: 2px 6px;
              border-radius: 4px;
              font-family: 'Monaco', 'Menlo', monospace;
              font-size: 14px;
            }
            
            pre {
              background: #f8fafc;
              padding: 16px;
              border-radius: 8px;
              overflow-x: auto;
              border: 1px solid #e2e8f0;
            }
            
            pre code {
              background: none;
              padding: 0;
            }
            
            blockquote {
              border-left: 4px solid #e2e8f0;
              margin: 20px 0;
              padding-left: 20px;
              color: #64748b;
              font-style: italic;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            
            th, td {
              border: 1px solid #e2e8f0;
              padding: 12px;
              text-align: left;
            }
            
            th {
              background: #f8fafc;
              font-weight: 600;
            }
            
            .footer {
              margin-top: 60px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              font-size: 12px;
              color: #94a3b8;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <h1>${article.title}</h1>
          
          <div class="meta-info">
            <div class="meta-item">
              <span class="meta-label">작성자:</span> ${article.User?.username || '작성자 미상'}
            </div>
            <div class="meta-item">
              <span class="meta-label">작성일:</span> ${new Date(article.createdAt).toLocaleDateString('ko-KR')}
            </div>
            ${article.Category ? `
              <div class="meta-item">
                <span class="meta-label">카테고리:</span> ${article.Category.name}
              </div>
            ` : ''}
            ${article.tags && article.tags.length > 0 ? `
              <div class="meta-item">
                <span class="meta-label">태그:</span>
                <div class="tags">
                  ${article.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
          
          <div class="content">
            ${htmlContent}
          </div>
          
          <div class="footer">
            DocHub에서 생성됨 - ${new Date().toLocaleDateString('ko-KR')}
          </div>
        </body>
      </html>
    `;
    
    // HTML 설정
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // PDF 생성
    const pdf = await page.pdf({
      format: 'A4',
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      printBackground: true
    });
    
    return pdf;
    
  } catch (error) {
    console.error('PDF 생성 오류:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = { generatePDF }; 