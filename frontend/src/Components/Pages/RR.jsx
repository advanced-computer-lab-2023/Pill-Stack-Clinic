import React from 'react';
import '../UI/Styles/rating.css'; // Make sure to adjust the file name accordingly

const RR = ({ onRatingTabClick,setSelectedTab }) => {

    const handleTabClick = (tabNumber) => {
        onRatingTabClick(tabNumber);
      };
      const handleTabHover = (tabNumber) => {
        setSelectedTab(tabNumber);
      };  
  return (
    <div className="rating-guage">
      <div className="rating-circle">
        <div className="">
            <span className="selected-rating"></span>
            </div>
        <div className="rating-scale transparent">
          <div className="rating-tab transparent"><span></span></div>
          <div className="rating-tab transparent"><span></span></div>
          <div className="rating-tab transparent"><span></span></div>
          <div className="rating-tab one" onMouseEnter={() => handleTabHover('one')} onClick={() => handleTabClick('one')}><span></span></div>
          <div className="rating-tab two" onMouseEnter={() => handleTabHover('two')} onClick={() => handleTabClick('two')}><span></span></div>
          <div className="rating-tab three" onMouseEnter={() => handleTabHover('three')} onClick={() => handleTabClick('three')}><span></span></div>
          <div className="rating-tab four" onMouseEnter={() => handleTabHover('four')} onClick={() => handleTabClick('four')}><span></span></div>
          <div className="rating-tab five" onMouseEnter={() => handleTabHover('five')} onClick={() => handleTabClick('five')}><span></span></div>
          <div className="rating-tab transparent"><span></span></div>
          <div className="rating-tab transparent"><span></span></div>
          <div className="rating-tab transparent"><span></span></div>
          <div className="rating-tab transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default RR;