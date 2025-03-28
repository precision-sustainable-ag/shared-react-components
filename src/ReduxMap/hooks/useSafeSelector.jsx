import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useSafeSelector = (fallbackValue, parm, getter, setter) => {
  const dispatch = useDispatch();

  const selectedValue = useSelector(getter?.[parm] || (() => fallbackValue));

  const [localState, setLocalState] = useState(selectedValue);

  useEffect(() => {
    if (
      parm === "features" &&
      JSON.stringify(fallbackValue) === JSON.stringify(selectedValue)
    ) {
      return;
    }
    if (parm === "address" && !fallbackValue) {
      setLocalState({});
    } else if (fallbackValue && !getter?.[parm]) {
      setLocalState(fallbackValue);
    }
  }, [fallbackValue]);

  const setLocalStateWithDispatch = (newValue) => {
    setLocalState(newValue);

    if (setter) {
      dispatch(
        setter((currentMap) => ({
          ...currentMap,
          [parm]: newValue,
        }))
      );
    }
  };

  return [localState, setLocalStateWithDispatch];
};

export default useSafeSelector;
