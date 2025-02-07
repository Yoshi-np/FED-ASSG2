
import { liteClient as algoliasearch } from "algoliasearch/lite";
import instantsearch from "instantsearch.js";
import {
  searchBox,
  hits,
  configure,
  poweredBy,
} from "instantsearch.js/es/widgets";
import "instantsearch.css/themes/reset.css";

// Add styles
const styles = document.createElement("style");
styles.textContent = `
  .ais-InstantSearch {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    box-shadow: 0 0 #0000, 0 0 #0000, 0px 0px 0px 1px rgba(35, 38, 59, 0.05), 0px 1px 3px 0px rgba(35, 38, 59, 0.15);
    background-color: rgb(255 255 255);
  }

  .ais-SearchBox-form {
    position: relative;
  }

  .ais-SearchBox-input {
    width: 100%;
    box-shadow: none;
    border: none;
    padding: 14px 40px;
  }

  .ais-SearchBox-submit,
  .ais-SearchBox-reset {
    position: absolute;
    top: 0;
    height: 100%;
    background: none;
    border: none;
    appearance: none;
  }

  .ais-SearchBox-submit {
    left: 0;
    width: 40px;
  }

  .ais-SearchBox-reset {
    right: 12px;
  }

  .ais-Hits-item {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    box-shadow: none;
  }

  .ais-Hits-item picture  {
    height: 96px;
    width: 96px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .ais-Hits-item img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
  }

  .ais-Hits-item p {
    margin-bottom: 0.1rem;
    word-break: break-all;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .ais-Hits-item .secondary-text {
    -webkit-line-clamp: 2;
  }

  .ais-Hits-item .primary-text {
    margin-top: 0;
    font-weight: 700;
  }

  .ais-Hits-item .tertiary-text {
    font-size: 0.8rem;
    color: rgb(90, 94, 154);
  }

  .ais-Hits-item mark {
    color: #003dff;
    background-color: #f2f4ff;
    font-style: normal;
  }

  .ais-SearchBox-submitIcon {
    width: 15px;
    height: 15px;
  }

  .border-top {
    border-style: solid;
    border-width: 0;
    border-top-width: 1px;
    border-color: rgb(214 214 231);
  }

  #hits {
    padding: 1rem;
  }

  #algolia-footer {
    display: flex;
    justify-content: flex-end;
    padding: 16px;
  }

  .hide-content {
    display: none !important;
  }
`;
document.head.appendChild(styles);

// Query for any other node in which you want to display the search bar
const searchBarContainer = document.querySelector("body");
const searchBarNode = document.createElement("div");
searchBarNode.setAttribute("class", "ais-InstantSearch");

searchBarNode.innerHTML = `
  <div id="searchbox"></div>
  <div id="hits" class="hide-content"></div>
  <div id="algolia-footer" class="hide-content"></div>
`;

searchBarContainer.prepend(searchBarNode);

const searchClient = algoliasearch(
  "513AH2AL7J",
  "26d0fab87029fd6610fee30f6b40ee0c",
);

const search = instantsearch({
  indexName: "items",
  searchClient,
  onStateChange({ uiState, setUiState }) {
    const hitsContainer = document.querySelector("#hits");
    const footerContainer = document.querySelector("#algolia-footer");

    if (!uiState["items"]?.query) {
      hitsContainer.classList.add("hide-content");
      footerContainer?.classList.add("hide-content");
      setUiState(uiState);
      return;
    }

    hitsContainer.classList.remove("hide-content");
    footerContainer?.classList.remove("hide-content");
    setUiState(uiState);
  },
});

search.addWidgets([
  searchBox({
    container: "#searchbox",
    placeholder: "Search your data here",
  }),
  configure({
    hitsPerPage: 3,
  }),
  poweredBy({
    container: "#algolia-footer",
  }),
  hits({
    container: "#hits",
    templates: {
      item: (hit, { html, components }) => html`
        <picture>
				  <img src="${hit.imageUrl}" />
				</picture>
				<div>
				  <p class="primary-text">
					  ${components.Highlight({ hit, attribute: "name" })}
					</p>
				</div>
      `,
    },
  }),
]);

search.start();

// Feedback stars
document.addEventListener("DOMContentLoaded", function() {
  const stars = document.querySelectorAll(".star");
  const ratingInput = document.getElementById("rating-value");
  let selectedRating = 0;

  // Function to update the stars visually
  function updateStars(rating) {
      stars.forEach((star, index) => {
          if (index < rating) {
              star.classList.add("active");
          } else {
              star.classList.remove("active");
          }
      });
  }

  // Click event to set rating
  stars.forEach(star => {
      star.addEventListener("click", function () {
          selectedRating = this.getAttribute("data-value");
          ratingInput.value = selectedRating; // Store rating in hidden input
          updateStars(selectedRating);
      });
  });

  // Hover effect to show temporary rating
  stars.forEach(star => {
      star.addEventListener("mouseover", function () {
          let hoverRating = this.getAttribute("data-value");
          updateStars(hoverRating);
      });

      // Mouseout: Reset to the selected rating
      star.addEventListener("mouseout", function () {
          updateStars(selectedRating);
      });
  });
});