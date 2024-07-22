import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faNewspaper, faChartLine, faInfoCircle, faBalanceScale } from '@fortawesome/free-solid-svg-icons';
import { faReddit } from '@fortawesome/free-brands-svg-icons';
import CaseComponent from './CaseComponent';
import StockInfo from './StockInfo';
import NewsSentiment from './NewsSentiment';
import FinancialHealth from './FinancialHealth/FinancialHealth';
import BullBearCase from './BullBearCase';
import RedditPosts from './RedditPosts';


const Drawer = ({ 
  activeDrawers, 
  setActiveDrawers, 
  ticker, 
  caseContent, 
  handleCaseSave, 
  stockInfoData, 
  newsSentimentData, 
  financialData, 
  bullBearData,
  stockName 
}) => {
  const toggleDrawer = (drawerName) => {
    setActiveDrawers(prevDrawers => {
      if (prevDrawers.includes(drawerName)) {
        return prevDrawers.filter(name => name !== drawerName);
      } else {
        return [...prevDrawers, drawerName];
      }
    });
  };

  const renderDrawerContent = () => {
    const drawerOrder = ['case', 'info', 'financial', 'news', 'bullbear', 'reddit']; 
    return drawerOrder
      .filter(drawerName => activeDrawers.includes(drawerName))
      .map((drawerName, index, filteredArray) => {
        let content;
        switch (drawerName) {
          case 'case':
            content = (
              <CaseComponent
                ticker={ticker}
                initialContent={caseContent}
                onSave={handleCaseSave}
              />
            );
            break;
          case 'info':
            content = <StockInfo data={stockInfoData} />;
            break;
          case 'news':
            content = <NewsSentiment data={newsSentimentData} />;
            break;
          case 'financial':
            content = <FinancialHealth data={financialData} />;
            break;
          case 'bullbear':
            content = <BullBearCase data={bullBearData} />;
            break;
          case 'reddit':
            content = <RedditPosts ticker={ticker} stockName={stockName} />;
            break;
          default:
            return null;
        }
        return (
          <div key={drawerName} className={`${index < filteredArray.length - 1 ? 'pb-2' : ''}`}>
            {content}
          </div>
        );
      });
  };

  return (
    <>
      <div className="drawer-side">
        <label htmlFor="stock-drawer" className="drawer-overlay"></label>
        <div className="p-4 pt-20 pr-20 w-[60rem] min-h-full bg-base-200 text-base-content overflow-y-auto">
          {renderDrawerContent()}
        </div>
      </div>
      <div className="fixed top-20 right-2 flex flex-col space-y-2 z-50">
        <button 
          onClick={() => toggleDrawer('case')} 
          className={`btn btn-circle ${activeDrawers.includes('case') ? 'btn-primary' : 'btn-ghost bg-base-100'}`}
          title="Investment Case"
        >
          <FontAwesomeIcon icon={faBriefcase} />
        </button>
        <button 
          onClick={() => toggleDrawer('info')} 
          className={`btn btn-circle ${activeDrawers.includes('info') ? 'btn-primary' : 'btn-ghost bg-base-100'}`}
          title="Stock Info"
        >
          <FontAwesomeIcon icon={faInfoCircle} />
        </button>
        <button 
          onClick={() => toggleDrawer('financial')} 
          className={`btn btn-circle ${activeDrawers.includes('financial') ? 'btn-primary' : 'btn-ghost bg-base-100'}`}
          title="Financial Health"
        >
          <FontAwesomeIcon icon={faChartLine} />
        </button>
        <button 
          onClick={() => toggleDrawer('news')} 
          className={`btn btn-circle ${activeDrawers.includes('news') ? 'btn-primary' : 'btn-ghost bg-base-100'}`}
          title="News Sentiment"
        >
          <FontAwesomeIcon icon={faNewspaper} />
        </button>
        <button 
          onClick={() => toggleDrawer('bullbear')} 
          className={`btn btn-circle ${activeDrawers.includes('bullbear') ? 'btn-primary' : 'btn-ghost bg-base-100'}`}
          title="Bull/Bear Case"
        >
          <FontAwesomeIcon icon={faBalanceScale} />
        </button>
        <button 
          onClick={() => toggleDrawer('reddit')} 
          className={`btn btn-circle ${activeDrawers.includes('reddit') ? 'btn-primary' : 'btn-ghost bg-base-100'}`}
          title="Reddit Posts"
        >
          <FontAwesomeIcon icon={faReddit} />
        </button>
      </div>
    </>
  );
};

export default Drawer;