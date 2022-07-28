import './app.element.css';

const lineupRootSelector = 'lineup-root';

export class AppElement extends HTMLElement {
  public static observedAttributes = [];

  connectedCallback() {
    this.innerHTML = `
    <div class="wrapper">
      <div class="container">
        <!--  WELCOME  -->
        <div id="welcome">
          <h1>
          Action-based Trrack LineUp Example
          </h1>
        </div>

        <!--  LINE UP  -->
        <div id="lineup-wrapper">

          <div id="${lineupRootSelector}-1" class="lineup-div"></div>

          <div id="${lineupRootSelector}-2" class="lineup-div"></div>


        <div>
          <button id="undo">Undo</button>
          <button id="redo">Redo</button>
          <button id="log">Log</button>
        </div>
        </div>
      </div>
    </div>
      `;
  }
}
customElements.define('trrack-root', AppElement);
