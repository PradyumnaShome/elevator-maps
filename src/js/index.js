// Displays the selected floor from the slider
onSliderAdjust = event => {
  const source = event.target || event.srcElement;
  const sourceId = source.id;

  const valueDisplayViewId = sourceId + "-value";
  let valueDisplayView = document.getElementById(valueDisplayViewId);
  valueDisplayView.innerHTML = source.value;
  findDirections();
};

// Finds directions given the building, starting floor, and destination
findDirections = () => {
  const locationSelector = document.getElementById("location-selector");
  const building =
    locationSelector.options[locationSelector.selectedIndex].value;

  const startingFloor = parseInt(
    document.getElementById("slider-from-value").innerHTML
  );
  const destinationFloor = parseInt(
    document.getElementById("slider-to-value").innerHTML
  );

  let floorRange = [];
  switch (building) {
    case "West": {
      floorRange = westFloorRanges;
      break;
    }
    case "East": {
      floorRange = eastFloorRanges;
      break;
    }
    case "Tower": {
      floorRange = towerFloorRanges;
      break;
    }
    default: {
      return Error(`Building invalid - ${building}.`);
    }
  }

  let directions = getDirectionsGivenFloorRanges(
    floorRange,
    startingFloor,
    destinationFloor
  );

  const directionsView = document.getElementById("directions-view");
  directionsView.innerHTML = directions;
  return true;
};

const westFloorRanges = [15, 27, 42];
const eastFloorRanges = [15, 27, 42];
const towerFloorRanges = [15, 27, 42];

// Returns the range a floor falls into, given a list representing a range
findFloorRange = (floorRanges, floor) => {
  let floorRange = 0;
  for (upperBound of floorRanges) {
    if (floor > upperBound) {
      floorRange += 1;
    }
  }
  return floorRange;
};

// Returns a string containing directions, given a starting floor, destination floor and ranges.
getDirectionsGivenFloorRanges = (
  floorRanges,
  startingFloor,
  destinationFloor
) => {
  const startingFloorRange = findFloorRange(floorRanges, startingFloor);
  const destinationFloorRange = findFloorRange(floorRanges, destinationFloor);

  const rangeDifference = Math.abs(destinationFloorRange - startingFloorRange);

  if (rangeDifference < 1 || startingFloor == 1) {
    // Both floors are in the same range
    return `Go straight to ${destinationFloor} from any elevator.`;
  } else if (rangeDifference == 1) {
    // Go to the overlapping floor, and then take an elevator to target floor
    const floorWithOverlappingRanges =
      startingFloorRange < floorRanges.length
        ? floorRanges[startingFloorRange]
        : floorRanges[startingFloorRange - 1];
    return `Take an elevator to ${floorWithOverlappingRanges}, and from there take an elevator to ${destinationFloor}.`;
  } else {
    // No overlapping floor, except the first floor
    return `Take an elevator to 1, and then an elevator to ${destinationFloor}.`;
  }
};
