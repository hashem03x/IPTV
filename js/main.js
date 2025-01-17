// Function to update current date & time
function updateDateTime() {
  const dateElement = document.querySelector("#date-time .date");
  const timeElement = document.querySelector("#date-time .time");
  const now = new Date();
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const date = now.toLocaleDateString("en-GB", options);
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const time = `${formattedHours}:${formattedMinutes} ${ampm}`;

  dateElement.textContent = date;
  timeElement.textContent = time;
}
updateDateTime();
setInterval(updateDateTime, 1000);

// const saveDataTypeToLocalStorage = () => {
//     const dataType = buttons[currentIndex].getAttribute("data-type");
//     if (dataType) {
//       localStorage.setItem("category", dataType);
//       console.log(`Saved data-type: ${dataType}`);
//     }
//   };

const mainMenu = document.getElementById("main-menu");
const category = localStorage.getItem("category");
var currentPlace = "main-menu";
let mainMenuKeydownHandler = null;
let SeriesScreenKeydownHandler = null;
let MoviesScreenKeydownHandler = null;
let ContentScreenKeydownHandler = null;

// Main Menu Controller and Cleaner Start--------------------------------
function runMainMenuController() {
  const buttons = document.querySelectorAll(".buttons button");
  let currentIndex = 0;
  buttons[currentIndex].classList.add("active");
  const handleKeydown = (e) => {
    if (e.key === "ArrowLeft") {
      buttons[currentIndex].classList.remove("active");
      currentIndex = (currentIndex - 1 + buttons.length) % buttons.length;
      buttons[currentIndex].classList.add("active");
    }
    if (e.key === "ArrowRight") {
      buttons[currentIndex].classList.remove("active");
      currentIndex = (currentIndex + 1) % buttons.length;
      buttons[currentIndex].classList.add("active");
      console.log("Right");
    }
    if (e.key === "Enter") {
      handleEnterKey(buttons[currentIndex]);
    }
    if (e.key === "Escape") {
      handleEscapeKey();
    }
  };
  if (mainMenuKeydownHandler) {
    document.removeEventListener("keydown", mainMenuKeydownHandler);
  }
  mainMenuKeydownHandler = handleKeydown;
  document.addEventListener("keydown", handleKeydown);
}
function cleanupMainMenuController() {
  if (mainMenuKeydownHandler) {
    document.removeEventListener("keydown", mainMenuKeydownHandler);
    mainMenuKeydownHandler = null; // Reset the reference
  }
  const buttons = document.querySelectorAll(".buttons button");
  buttons.forEach((button) => button.classList.remove("active"));
}

runMainMenuController();
// Main Menu Controller and Cleaner End--------------------------------

// Series Screen Controller and Cleaner End--------------------------------
async function runSeriesController() {
    if(SeriesScreenKeydownHandler !== null){
        return
    }
  console.log("In runSeriesController");
  const buttons = document.querySelectorAll("#Series .categories li");
  let currentIndex =
    Array.from(buttons).findIndex((item) =>
      item.classList.contains("active")
    ) || 0;
  const handleKeydown = async (e) => {
    if (e.key === "ArrowRight") {
      currentPlace = "Series content area";
      cleanupSeriesScreenController();
      await controlContentArea(buttons[currentIndex].id , "right");
    }
    if (e.key === "Enter") {
      currentPlace = "Series content area";
      cleanupSeriesScreenController();
      await controlContentArea(buttons[currentIndex].id , "enter");
    }
    if (e.key === "Escape") {
      if (!SeriesScreenKeydownHandler) {
        cleanupSeriesScreenController();
      }
      if (!MoviesScreenKeydownHandler) {
        cleanupMoviesScreenController();
      }
      handleEscapeKey();
    }
    if (e.key === "ArrowDown") {
      currentIndex = (currentIndex + 1) % buttons.length;
      console.log(buttons)
      updateActiveClass(buttons, currentIndex);
    }
    if (e.key === "ArrowUp") {
      currentIndex = (currentIndex - 1 + buttons.length) % buttons.length;
      updateActiveClass(buttons, currentIndex);
    }
  };
  if (SeriesScreenKeydownHandler) {
    document.removeEventListener("keydown", SeriesScreenKeydownHandler);
  }
  SeriesScreenKeydownHandler = handleKeydown;
  document.addEventListener("keydown", handleKeydown);
}
function cleanupSeriesScreenController() {
  if (SeriesScreenKeydownHandler) {
    document.removeEventListener("keydown", SeriesScreenKeydownHandler);
    SeriesScreenKeydownHandler = null; // Reset the reference
  }
  const buttons = document.querySelectorAll("#Series ul li");
  buttons.forEach((button, index) => {
    if (button.classList.contains("active")) {
      localStorage.setItem("lastActive", index);
    }
  });
}
// Series Screen Controller and Cleaner End--------------------------------

// Movies Screen Controller and Cleaner Start--------------------------------
async function runMoviesController() {
  console.log("In runMoviesController");
  const buttons = document.querySelectorAll("#Movie .categories li");
  let currentIndex =
    Array.from(buttons).findIndex((item) =>
      item.classList.contains("active")
    ) || 0;

  const handleKeydown = async (e) => {
    if (e.key === "ArrowRight") {
      currentPlace = "Movies content area";
      cleanupMoviesScreenController();
      await controlContentArea(buttons[currentIndex].id , "right");
    }
    if (e.key === "Enter") {
      currentPlace = "Movies content area";
      cleanupMoviesScreenController();
      await controlContentArea(buttons[currentIndex].id , "enter");
    }
    if (e.key === "Escape") {
      cleanupMoviesScreenController();
      handleEscapeKey();
    }
    if (e.key === "ArrowDown") {
      currentIndex = (currentIndex + 1) % buttons.length;
      updateActiveClass(buttons, currentIndex);
    }
    if (e.key === "ArrowUp") {
      currentIndex = (currentIndex - 1 + buttons.length) % buttons.length;
      updateActiveClass(buttons, currentIndex);
    }
  };

  if (MoviesScreenKeydownHandler) {
    document.removeEventListener("keydown", MoviesScreenKeydownHandler);
  }
  MoviesScreenKeydownHandler = handleKeydown;
  document.addEventListener("keydown", handleKeydown);
}

function cleanupMoviesScreenController() {
  if (MoviesScreenKeydownHandler) {
    document.removeEventListener("keydown", MoviesScreenKeydownHandler);
    MoviesScreenKeydownHandler = null; // Reset the reference
  }
}

// Movies Screen Controller and Cleaner End--------------------------------

// Content Screen Controller and Cleaner Start--------------------------------
async function controlContentArea(id , byWho) {
  console.log("Controller Initialized with id: " + id);

    if(byWho === "enter"){
        await fetchDataById(id);   
    }
  const items = document.querySelectorAll(".content-data .item");
  const columns = 4;
  const rows = Math.ceil(items.length / columns);
  let currentIndex = 0; // Start at the first item

  const handleKeydown = async (e) => {
    let currentRow = Math.floor(currentIndex / columns);
    let currentCol = currentIndex % columns;

    if (e.key === "ArrowRight") {
      if (currentCol < columns - 1 && currentIndex + 1 < items.length) {
        currentIndex++;
        updateActiveClass(items, currentIndex);
      }
    }

    if (e.key === "ArrowLeft") {
      if (currentCol === 0) {
        console.log("Exiting"); // Log 'exiting' if at the first column of a row
        cleanupContentScreenController();
        items[currentIndex].classList.remove("active");
        if (!MoviesScreenKeydownHandler) {
          await runMoviesController();
        }
        if (!SeriesScreenKeydownHandler) {
          await runSeriesController();
        }
      } else {
        currentIndex--;
        updateActiveClass(items, currentIndex);
      }
    }

    if (e.key === "ArrowDown") {
      if (currentRow < rows - 1 && currentIndex + columns < items.length) {
        currentIndex += columns;
        updateActiveClass(items, currentIndex);
      }
    }

    if (e.key === "ArrowUp") {
      if (currentRow > 0) {
        currentIndex -= columns;
        updateActiveClass(items, currentIndex);
      }
    }

    if (e.key === "Escape") {
      cleanupContentScreenController();
      handleEscapeKey();
    }
  };

  // Remove any previous keydown handler
  if (ContentScreenKeydownHandler) {
    document.removeEventListener("keydown", ContentScreenKeydownHandler);
  }

  // Add the new keydown handler
  ContentScreenKeydownHandler = handleKeydown;
  document.addEventListener("keydown", handleKeydown);

  // Initialize the active class
  updateActiveClass(items, currentIndex);
}

function cleanupContentScreenController() {
  console.log("cleanupContentScreenController");
  if (ContentScreenKeydownHandler) {
    document.removeEventListener("keydown", ContentScreenKeydownHandler);
    ContentScreenKeydownHandler = null; // Reset the reference
  }
}
// Content Screen Controller and Cleaner End--------------------------------

const updateActiveClass = (items, index) => {
    if(items.length === 0){
        return
    }
    if(items){
        items.forEach((item) => item.classList.remove("active"));
        items[index].classList.add("active");
        items[index].scrollIntoView({ behavior: "instant", block: "start" });

    }
};

var lastCategoryClicked = 0;
localStorage.setItem("lastCategoryClicked", 0);

async function handleEnterKey(button) {
  cleanupMainMenuController();
  localStorage.setItem("category", button.getAttribute("data-type"));
  const category = localStorage.getItem("category");
  if (["Catchup", "Live", "Settings", "Reload"].includes(category)) {
    return;
  }
  const contentDataContainer = document.querySelector(`#${category} .content`);
  if (category && contentDataContainer.classList.contains("d-none")) {
    switch (category) {
      case "Series":
        mainMenu.classList.add("d-none");
        document.getElementById(category).classList.remove("d-none");

        // Fetch data for the selected category
        await fetchCurrentCategories();
        runSeriesController();
        break;

      case "Movie":
        if (mainMenu) mainMenu.classList.add("d-none");
        document.getElementById(category).classList.remove("d-none");

        // Fetch data for the selected category
        await fetchCurrentCategories();
        runMoviesController();

        break;
      case "Live":
        return null;
      case "Catchup":
        return null;
      case "Settings":
        return null;
      case "Reload":
        return null;
      default:
        break;
    }
  }
}
// function to handle ESC key event

function handleEscapeKey() {
    const movieCategories = document.querySelector("#Movie .categories");
    movieCategories.innerHTML = "";
    const seriesCategories = document.querySelector("#Series .categories");
    seriesCategories.innerHTML = "";
  const sections = ["Series", "Movie"];
  for (const section of sections) {
    const sectionElement = document.getElementById(section);
    const sectionContent = document.querySelector(`#${section} .content`);
    sectionContent.classList.add("d-none");
    sectionElement.classList.add("d-none");
    mainMenu.classList.remove("d-none");
    EmptyContent(section);
    localStorage.setItem("lastCategoryClicked", 0);
    if (!mainMenuKeydownHandler) {
      runMainMenuController();
    }
  }
}

// function to fetch Categories
async function fetchCurrentCategories() {
  const category = localStorage.getItem("category");
  if (!category) {
    console.error("No category found in localStorage.");
    return;
  }

  try {
    const response = await fetch(
      `https://demo-m3u.onrender.com/category/get?type=${category}`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    const categoriesContainer = document.querySelector(
      `#${category} .categories`
    );
    if (!categoriesContainer) {
      console.error(`No container found for category: ${category}`);
      return;
    }
    categoriesContainer.innerHTML = "";
    var firstItemId;
    data.categories.forEach((categoryItem, index) => {
      const listItem = document.createElement("li");
      listItem.id = categoryItem._id;
      listItem.tabIndex = 0;
      listItem.innerHTML = `<p class=\"name\">${categoryItem.category}</p>`;
      if (index === Number(localStorage.getItem("lastCategoryClicked"))) {
        listItem.classList.add("active");
        firstItemId = listItem.id;
      } // Default active item
      categoriesContainer.appendChild(listItem);
    });
    await fetchDataById(firstItemId);

    // enableKeyboardNavigation(categoriesContainer);
  } catch (error) {
    console.error("Error fetching data", error);
  }
}

// Function to enable keyboard navigation when sidebar is enabled
function enableKeyboardNavigation(container) {
  const category = localStorage.getItem("category");
  const listItems = container.querySelectorAll(
    `#${category} .category-sidebar li`
  );
  let currentIndex = -1;

  document.addEventListener("keydown", async (event) => {
    const contentContainer = document.querySelector(`#${category} .content`);
    const isContentVisible =
      contentContainer && !contentContainer.classList.contains("d-none");

    if (isContentVisible) {
      console.log("Returning");
      return;
    }

    if (listItems.length === 0) return;

    if (
      event.key === "ArrowDown" &&
      contentContainer.classList.contains("d-none")
    ) {
      currentIndex = (currentIndex + 1) % listItems.length;
      localStorage.setItem("lastCategoryClicked", currentIndex);
      highlightItem(listItems, currentIndex);
    } else if (
      event.key === "ArrowUp" &&
      contentContainer.classList.contains("d-none")
    ) {
      currentIndex = (currentIndex - 1 + listItems.length) % listItems.length;
      localStorage.setItem("lastCategoryClicked", currentIndex);
      highlightItem(listItems, currentIndex);
    } else if (event.key === "Enter" && currentIndex !== -1) {
      const selectedItem = listItems[currentIndex];
      lastCategoryClicked = currentIndex;
      localStorage.setItem("lastCategoryClicked", currentIndex);
      highlightItem(listItems, currentIndex);
      if (selectedItem) {
        await fetchDataById(selectedItem.id);
      }
    }
  });
}

// function to highlight the selected item
function highlightItem(listItems, index) {
  listItems.forEach((item) => item.classList.remove("active"));
  const currentItem = listItems[index];
  if (currentItem) {
    currentItem.classList.add("active");
    currentItem.scrollIntoView({ behavior: "instant", block: "start" });
  }
}

// Function to fetch the selected category data By ID
async function fetchDataById(id) {
  const category = localStorage.getItem("category");
  const displayContainer = document.querySelector(`#${category} .content-data`);
  try {
    const response = await fetch(
      `https://demo-m3u.onrender.com/playlist/getByCategory/${id}`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    displayContainer.innerHTML = "";
    displayFetchedData(data.categoriesItem);
  } catch (error) {
    console.error("Error fetching data by ID", error);
  }
}

// Function to display fetched data for a category
function displayFetchedData(data) {
  const category = localStorage.getItem("category");
  const displayContainer = document.querySelector(`#${category} .content-data`);
  const contentContainer = document.querySelector(`#${category} .content`);

  if (!displayContainer) {
    console.error("No display container found");
    return;
  }
  contentContainer.classList.remove("d-none");
  data.forEach((categoryItem) => {
    displayContainer.innerHTML += `
      <div class="item me-3">
        <img class="img-fluid" src='${categoryItem.poster}' />
        <p class="name">${categoryItem.name}</p>
      </div>`;
  });
}

// function to empty the contents of the category-container
function EmptyContent(category) {
  const displayContainer = document.querySelector(`#${category} .content-data`);
  if (displayContainer) {
    displayContainer.innerHTML = "";
    console.log(`Cleared content for category: ${category}`);
  }
}
