import React from "react";
import { cgvTheaters } from "../../CGV";
import { useDispatch, useSelector } from "react-redux";
import { selectRegion } from "../../store/reservationSlice/reservationSlice";
import styles from "./RegionSelection.module.scss";
function RegionSelection(props) {
  const dispatch = useDispatch();
  const { selectedRegion } = useSelector((state) => state.reservationSlice);

  return (
    <div className={styles.ReservationRegionSelection}>
      <h2>극장 선택 (지역)</h2>
      <div className={styles.RegionButtons}>
        {cgvTheaters.map((region) => (
          <button
            key={region.region}
            onClick={() => dispatch(selectRegion(region))}
            className={
              selectedRegion?.region === region.region ? styles.selected : ""
            }
          >
            {region.region}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RegionSelection;
