import React from "react";
import styles from "./RegionSelection.module.scss";
import { cgvTheaters } from "../../CGV";

function RegionSelection({
  selectedRegion,
  setSelectedRegion,
  selectedTheater,
  setSelectedTheater,
}) {
  // 지역 버튼 클릭 핸들러
  const handleRegionClick = (region) => {
    setSelectedRegion(region); // props로 전달된 setSelectedRegion을 사용하여 상태 업데이트
  };

  // 극장 버튼 클릭 핸들러
  const handleTheaterClick = (theater) => {
    setSelectedTheater(theater); // props로 전달된 setSelectedTheater를 사용하여 상태 업데이트
  };

  // 선택된 지역의 극장 목록 필터링
  const theatersInRegion =
    cgvTheaters.find((region) => region.region === selectedRegion)?.theaters ||
    [];

  return (
    <div className={styles.RegionSelectionContainer}>
      <div className={styles.ButtonGroup}>
        {/* 지역 선택 버튼 */}
        <div className={styles.RegionButtonGroup}>
          {cgvTheaters.map((region) => (
            <button
              key={region.region}
              onClick={() => handleRegionClick(region.region)}
              className={`${styles.RegionButton} ${
                selectedRegion === region.region ? styles.selected : ""
              }`}
            >
              {region.region}
            </button>
          ))}
        </div>

        {/* 선택된 지역의 극장 목록 */}
        {theatersInRegion.length > 0 && (
          <div className={styles.TheaterButtonGroup}>
            <h3 className={styles.TheaterTitle}>{selectedRegion}</h3>
            {theatersInRegion.map((theater) => (
              <button
                key={theater}
                onClick={() => handleTheaterClick(theater)}
                className={`${styles.TheaterButton} ${
                  selectedTheater === theater ? styles.selected : ""
                }`}
              >
                {theater}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RegionSelection;
