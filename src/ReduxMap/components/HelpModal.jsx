/* eslint-disable react/prop-types */
import React from 'react';
import fullscreenIcon from '../assets/icons/fullscreen.png';
import { PencilIcon } from '../assets/icons/PencilIcon';
import polygonIcon from '../assets/icons/polygon.png';
import trashcanIcon from '../assets/icons/trashcan.png';
import uploadIcon from '../assets/icons/upload.png';

/**
 * HelpModal component for displaying help and configuration information
 *
 * @component
 * @param {Object} props - The component properties
 * @param {boolean} props.hasMarkerMovable - Allow marker to be moved
 * @param {boolean} props.hasFreehand - Enable freehand drawing
 * @param {boolean} props.hasFullscreen - Enable fullscreen toggle
 * @param {boolean} props.hasImport - Enable shapefile import
 * @param {React.ReactNode} props.otherHelp - Additional help content to be rendered
 */
const HelpModal = ({ hasMarkerMovable, hasFreehand, hasFullscreen, hasImport, otherHelp }) => (
  <dialog id="MapHelp">
    <button
      type="button"
      onClick={(event) => {
        event.target.closest('dialog').close();
      }}
    >
      X
    </button>
    <p>
      <strong>Controls</strong>
    </p>

    {hasMarkerMovable ? <p>You can move the marker by dragging it.</p> : null}

    {hasFullscreen ? (
      <p>
        For a larger map after the location is selected, click the full screen icon:
        <img className="icon" alt="fullscreen" src={fullscreenIcon} />
      </p>
    ) : null}

    <p>
      You can use the polygon tool on the right side of the map to outline the site area and
      estimate its acreage:
      <img className="icon" alt="polygon" src={polygonIcon} />
      <br />
      To create the boundary, click on each point that defines your field on the map.
      <br />
      Double-click the final point to close the polygon.
    </p>

    {hasFreehand ? (
      <p>
        You can also use the pencil tool to outline the site area and estimate its acreage:
        <PencilIcon />
        <br />
        To create the boundary, click on the edge of your field and drag the mouse around the
        perimeter.
        <br />
        Release the mouse button to close the polygon.
      </p>
    ) : null}

    {hasImport ? (
      <p>
        If you already have a shape file with your field boundaries, you can import it by clicking
        the&nbsp;
        <img className="icon" alt="upload" src={uploadIcon} />
        &nbsp;button.
      </p>
    ) : null}

    <p>
      To delete and re-draw polygons, select the polygon, then click the trash can icon under the
      polygon tool:
      <img className="icon" alt="trashcan" src={trashcanIcon} />
    </p>

    {otherHelp}
  </dialog>
);

export default HelpModal;
