export const financialMetrics = [
    {
      section: "Income Statement",
      metrics: [
        { 
          label: 'Revenue', 
          key: 'revenue',
          description: 'Total amount of money earned from selling goods or services. Look for consistent growth over the years. Sudden changes may indicate new product launches, market expansion, or potential challenges. Compare growth rates to industry averages.'
        },
        { 
          label: 'Cost of Revenue', 
          key: 'costOfRevenue',
          description: 'Direct costs attributable to the production of goods sold. A decreasing trend relative to revenue indicates improving efficiency. However, drastic reductions might signal quality issues. Consider industry norms and company-specific factors.'
        },
        { 
          label: 'Gross Profit', 
          key: 'grossProfit', 
          description: 'Revenue minus Cost of Goods Sold. Should generally increase with revenue. If gross profit growth outpaces revenue growth, it suggests improving efficiency or pricing power.'
        },
        { 
          label: 'Gross Margin', 
          key: 'grossProfitRatio', 
          format: 'percentage', 
          description: 'Gross Profit as a percentage of Revenue. Higher margins indicate better efficiency in production and pricing power. Look for stability or upward trends. Sudden drops may signal pricing pressures or rising costs. Compare with industry peers as ideal margins vary by sector.'
        },
        { 
          label: 'Operating Expenses', 
          key: 'operatingExpenses', 
          description: 'Expenses incurred in normal business operations. Should grow more slowly than revenue for improving profitability. Rapid increases might indicate expansion efforts or potential inefficiencies. Consider the nature of the business and growth stage.'
        },
        { 
          label: 'Operating Income', 
          key: 'operatingIncome', 
          description: 'Profit from business operations before interest and taxes. Should grow faster than revenue for improving operational efficiency. Consistent growth indicates strong core business performance.'
        },
        { 
          label: 'Operating Margin', 
          key: 'operatingIncomeRatio', 
          format: 'percentage', 
          description: 'Operating Income as a percentage of Revenue. Reflects operational efficiency and pricing power. Higher margins are generally better, but compare with industry norms. Increasing margins over time suggest improving operations or scalability.'
        },
        { 
          label: 'Net Income', 
          key: 'netIncome', 
          description: 'Company\'s total earnings or profit. Should show consistent growth over time. Volatile or declining net income might indicate business challenges or heavy investments. Consider alongside revenue trends and industry conditions.'
        },
        { 
          label: 'Net Profit Margin', 
          key: 'netIncomeRatio', 
          format: 'percentage', 
          description: 'Net Income as a percentage of Revenue. Higher margins indicate better overall profitability. Increasing margins suggest improving efficiency or scalability. Declining margins might signal rising costs or competitive pressures. Compare trends with industry peers.'
        },
      ]
    },
    {
      section: "Balance Sheet",
      metrics: [
        { 
          label: 'Current Assets', 
          key: 'totalCurrentAssets', 
          description: 'Assets expected to be converted to cash within one year. Should generally increase with business growth. A significant decrease might indicate cash flow issues or strategic changes. Compare with current liabilities for liquidity assessment.'
        },
        { 
          label: 'Total Assets', 
          key: 'totalAssets', 
          description: 'Total of all assets owned by the company. Should grow over time with the business. Rapid increases might indicate acquisitions or major investments. Decreases could signal asset sales or write-downs. Consider alongside revenue and profitability trends.'
        },
        { 
          label: 'Current Liabilities', 
          key: 'totalCurrentLiabilities', 
          description: 'Obligations due within one year. Should be manageable relative to current assets. Rapid increases might indicate cash flow challenges or aggressive short-term financing. Compare growth rate to current assets and revenue.'
        },
        { 
          label: 'Total Liabilities', 
          key: 'totalLiabilities', 
          description: 'Total of all liabilities owed by the company. Monitor the growth rate relative to assets and equity. Excessive liability growth might indicate overleveraging. Consider industry norms and company\'s growth stage.'
        },
        { 
          label: 'Stockholders\' Equity', 
          key: 'totalStockholdersEquity', 
          description: 'Total assets minus total liabilities; represents the book value of the company. Should generally increase over time through retained earnings. Decreases might indicate losses, dividends, or share buybacks. Consider alongside market capitalization for valuation insights.'
        },
        { 
            label: 'Shares Outstanding', 
            key: 'weightedAverageShsOut', 
            format: 'absolute',
            description: 'The weighted average number of shares outstanding during the period. This figure is used in calculating per-share metrics like Earnings Per Share (EPS). An increase in shares outstanding can dilute ownership, while a decrease (e.g., through share buybacks) can increase each share\'s claim on company earnings.'
        },
      ]
    },
    {
      section: "Cash Flow",
      metrics: [
        { 
          label: 'Operating Cash Flow', 
          key: 'operatingCashFlow', 
          description: 'Cash generated from normal business operations. Should be consistently positive and growing. Negative or declining OCF might indicate profitability issues or working capital challenges. Compare with net income for earnings quality assessment.'
        },
        { 
          label: 'Capital Expenditures', 
          key: 'capitalExpenditure', 
          description: 'Funds used to acquire or upgrade physical assets. Reflects investment in future growth. High CapEx might indicate expansion but could pressure short-term cash flows. Evaluate in context of industry and growth strategy.'
        },
        { 
          label: 'Free Cash Flow', 
          calculate: 'freeCashFlow', 
          description: 'Operating Cash Flow minus Capital Expenditures. Represents cash available for dividends, debt repayment, or reinvestment. Consistent positive FCF is generally favorable. Negative FCF might be acceptable for growth companies but warrants scrutiny for mature firms.'
        },
      ]
    },
    {
      section: "Investment Ratios",
      metrics: [
        {
          label: 'Return on Equity (ROE)',
          calculate: 'returnOnEquity',
          format: 'percentage',
          description: 'Measures profitability relative to shareholders\' equity. Higher ROE indicates more efficient use of equity capital. Compare to industry averages and the company\'s own historical trend. Calculation: Net Income / Total Shareholders\' Equity.'
        },
        {
          label: 'Return on Assets (ROA)',
          calculate: 'returnOnAssets',
          format: 'percentage',
          description: 'Indicates how efficiently a company is using its assets to generate profit. Higher ROA suggests better asset utilization. Compare across similar companies and look for improving trends. Calculation: Net Income / Total Assets.'
        },
        {
          label: 'Debt to Equity Ratio',
          calculate: 'debtToEquity',
          format: 'decimal',
          description: 'Measures the company\'s financial leverage. A higher ratio indicates more reliance on debt financing, which can increase financial risk but also potentially increase returns. Consider industry norms and the company\'s growth stage. Calculation: Total Liabilities / Total Shareholders\' Equity.'
        },
        {
          label: 'Current Ratio',
          calculate: 'currentRatio',
          format: 'decimal',
          description: 'Measures the company\'s ability to pay short-term obligations. A ratio above 1 indicates good short-term liquidity, but too high might suggest inefficient use of assets. Industry comparisons are crucial. Calculation: Total Current Assets / Total Current Liabilities.'
        },
      ]
    },
    {
      section: "Piotroski F-Score",
      metrics: [
        {
          label: 'Total Piotroski F-Score',
          calculate: 'piotroskiScore',
          format: 'fScore',
          description: 'The Piotroski F-Score is a comprehensive measure of a company\'s financial health, ranging from 0 to 9. A higher score (7-9) indicates stronger financial position and potential for good stock performance. Scores of 0-3 suggest weak financials. This metric is valuable for investors as it combines multiple aspects of financial health into a single, easy-to-interpret number, helping to identify potentially undervalued stocks with improving financials.'
        },
        {
          label: 'Net Income Positivity',
          calculate: 'netIncomePositivity',
          format: 'fScore',
          description: 'Calculated as: Net Income > 0 (Score 1 if true, 0 if false). Positive net income indicates profitability, a fundamental aspect of a healthy company. For investors, consistent profitability suggests the company can sustain operations, reinvest in growth, and potentially provide returns to shareholders.'
        },
        {
          label: 'Return on Assets (ROA) Positivity',
          calculate: 'roaPositivity',
          format: 'fScore',
          description: 'Calculated as: Net Income / Total Assets > 0 (Score 1 if true, 0 if false). Positive ROA shows the company is effectively using its assets to generate profit. This is crucial for investors as it indicates management\'s efficiency in utilizing the company\'s resources, which is especially important when comparing companies within the same industry.'
        },
        {
          label: 'Operating Cash Flow Positivity',
          calculate: 'operatingCashFlowPositivity',
          format: 'fScore',
          description: 'Calculated as: Operating Cash Flow > 0 (Score 1 if true, 0 if false). Positive operating cash flow is vital as it shows the company can generate cash from its core business operations. For investors, this indicates the company\'s ability to fund its operations without relying on external financing, which is crucial for long-term sustainability.'
        },
        {
          label: 'Cash Flow vs Net Income',
          calculate: 'cashFlowVsNetIncome',
          format: 'fScore',
          description: 'Calculated as: Operating Cash Flow > Net Income (Score 1 if true, 0 if false). Operating cash flow exceeding net income suggests high earnings quality. This is important for investors as it indicates that the company\'s profitability is backed by actual cash generation, reducing the risk of accounting manipulations and providing a more reliable picture of financial health.'
        },
        {
          label: 'Long Term Debt Ratio Decrease',
          calculate: 'longTermDebtRatioDecrease',
          format: 'fScore',
          description: 'Calculated as: (Current Year Total Liabilities / Total Assets) < (Previous Year Total Liabilities / Total Assets) (Score 1 if true, 0 if false). A decrease in long-term debt ratio indicates improving financial health. For investors, this suggests reduced financial risk, improved solvency, and potentially more flexibility for the company to invest in growth opportunities or weather economic downturns.'
        },
        {
          label: 'Current Ratio Improvement',
          calculate: 'currentRatioImprovement',
          format: 'fScore',
          description: 'Calculated as: (Current Year Current Assets / Current Liabilities) > (Previous Year Current Assets / Current Liabilities) (Score 1 if true, 0 if false). An improving current ratio suggests better short-term liquidity. This is valuable for investors as it indicates the company\'s enhanced ability to meet short-term obligations, reducing the risk of financial distress and potentially indicating more efficient working capital management.'
        },
        {
          label: 'No New Shares Issued',
          calculate: 'noNewSharesIssued',
          format: 'fScore',
          description: 'Calculated as: Current Year Shares Outstanding ≤ Previous Year Shares Outstanding (Score 1 if true, 0 if false). No increase in shares outstanding suggests the company didn\'t dilute existing shareholders. For investors, this is positive as it indicates the company can fund its operations and growth without resorting to equity issuance, preserving shareholder value and potentially signaling management\'s confidence in the company\'s financial position.'
        },
        {
          label: 'Gross Margin Improvement',
          calculate: 'grossMarginImprovement',
          format: 'fScore',
          description: 'Calculated as: Current Year Gross Margin > Previous Year Gross Margin, where Gross Margin = (Revenue - Cost of Revenue) / Revenue (Score 1 if true, 0 if false). Improving gross margin indicates better operational efficiency or pricing power. This is valuable for investors as it suggests the company\'s ability to manage costs effectively or command higher prices, which can lead to improved profitability and competitive advantage in the long run.'
        },
        {
          label: 'Asset Turnover Improvement',
          calculate: 'assetTurnoverImprovement',
          format: 'fScore',
          description: 'Calculated as: Current Year Asset Turnover > Previous Year Asset Turnover, where Asset Turnover = Revenue / Total Assets (Score 1 if true, 0 if false). Improving asset turnover shows more efficient use of assets to generate sales. For investors, this is important as it indicates the company\'s ability to generate more revenue from its asset base, potentially leading to better returns on investment and suggesting effective management of resources.'
        }
      ]
    }
  ];