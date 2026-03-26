export class CustomControl {
  /**
   * Create a new custom map control
   *
   * @param {Function} onClick - Callback function triggered when the control is clicked
   * @param {string} title - Tooltip text for the control button
   * @param {string} icon - Icon to display (can be SVG string or image URL)
   */
  constructor(onClick, title, icon) {
    this.onClick = onClick;
    this.title = title || '';
    this.icon = icon;
  }
  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

    this.button = document.createElement('button');
    this.button.className = 'mapbox-gl-draw_ctrl-draw-btn';
    this.button.title = this.title;
    this.button.alt = 'Custom Icon';
    this.button.style.backgroundColor = 'transparent';

    if (this.icon.startsWith('<svg')) {
      this.button.innerHTML = this.icon;
    } else {
      this.button.style.backgroundImage = `url(${this.icon})`;
      this.button.style.backgroundSize = '20px 20px';
      this.button.style.backgroundPosition = 'center';
      this.button.style.backgroundRepeat = 'no-repeat';
    }

    // Append image to container
    this._container.appendChild(this.button);
    this._container.addEventListener('click', this.onClick);

    return this._container;
  }

  onRemove() {
    if (
      this._container &&
      this._container.parentNode &&
      this._container.parentNode.contains(this._container)
    ) {
      this._container.parentNode.removeChild(this._container);
    }
    this._map = undefined;
  }
}
