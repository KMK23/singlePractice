import React from "react";
import styles from "./RegionSelection.module.scss";
import { cgvTheaters } from "../../CGV";

function RegionSelection({
  selectedRegion,
  setSelectedRegion,
  selectedTheater,
  setSelectedTheater,
}) {
  const handleRegionClick = (region) => {
    setSelectedRegion(region);
  };

  const handleTheaterClick = (theater) => {
    setSelectedTheater(theater);
  };

  const theatersInRegion =
    cgvTheaters.find((region) => region.region === selectedRegion)?.theaters ||
    [];

  return (
    <div className={styles.RegionSelectionContainer}>
      <div className={styles.ButtonGroup}>
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
