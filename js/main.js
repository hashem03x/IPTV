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


// Adding event listeners for key events
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".buttons button");
  const mainMenu = document.querySelector("#main-menu");
  let currentIndex = 0;
  let contentDataIndex = 0;
  const itemsPerRow = 4;
  buttons[currentIndex].classList.add("active");

  // Save selected button data type to local storage
  const saveDataTypeToLocalStorage = () => {
    const dataType = buttons[currentIndex].getAttribute("data-type");
    if (dataType) {
      localStorage.setItem("category", dataType);
      console.log(`Saved data-type: ${dataType}`);
    }
  };

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    const category = localStorage.getItem("category");
    const contentDataItems = document.querySelectorAll(".content-data .item");

    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter", "Escape"].includes(e.key)) {
      const activeButton = document.querySelector("#main-menu .buttons button.active");
      if (e.key === "Enter" && !activeButton) {
        console.log("No active button, Enter key event disabled.");
        return;
      }

      if (activeButton) {
        buttons[currentIndex].classList.remove("active");
      }

      switch (e.key) {
        case "ArrowLeft":
          if (!mainMenu.classList.contains("d-none")) {
            currentIndex = (currentIndex - 1 + buttons.length) % buttons.length;
          } else {
            contentDataIndex =
              (contentDataIndex - 1 + contentDataItems.length) % contentDataItems.length;
            highlightItem(contentDataItems, contentDataIndex);
          }
          break;

        case "ArrowRight":
          if (!mainMenu.classList.contains("d-none")) {
            currentIndex = (currentIndex + 1) % buttons.length;
          } else {
            contentDataIndex = (contentDataIndex + 1) % contentDataItems.length;
            highlightItem(contentDataItems, contentDataIndex);
          }
          break;

        case "ArrowUp":
          if (mainMenu.classList.contains("d-none")) {
            if (contentDataIndex - itemsPerRow >= 0) {
              contentDataIndex -= itemsPerRow;
            }
            highlightItem(contentDataItems, contentDataIndex);
          }
          break;

        case "ArrowDown":
          if (mainMenu.classList.contains("d-none")) {
            if (contentDataIndex + itemsPerRow < contentDataItems.length) {
              contentDataIndex += itemsPerRow;
            }
            highlightItem(contentDataItems, contentDataIndex);
          }
          break;

        case "Enter":
          handleEnterKey(mainMenu);
          break;

        case "Escape":
          handleEscapeKey(mainMenu);
          break;
      }

      buttons[currentIndex].classList.add("active");
      saveDataTypeToLocalStorage();
    }
  });

  // Button click event listener
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      buttons[currentIndex].classList.remove("active");
      currentIndex = index;
      button.classList.add("active");
      saveDataTypeToLocalStorage();
      mainMenu.style.display = "none";
    });
  });
});


// function to handle enter key event
function handleEnterKey(mainMenu) {
  const category = localStorage.getItem("category");
  if (category) {
    switch (category) {
      case "Series":
        if (mainMenu) mainMenu.classList.add("d-none");
        document.getElementById(category).classList.remove("d-none");
        fetchCurrentCategories();
        case "Movie":
          if (mainMenu) mainMenu.classList.add("d-none");
          document.getElementById(category).classList.remove("d-none");
          fetchCurrentCategories();
        case "Live":
          break
        default:
          break
      }
  }
}
// function to handle ESC key event

function handleEscapeKey(mainMenu) {
  const sections = ["Series", "Movie"];
  for (const section of sections) {
    const sectionElement = document.getElementById(section);
    const content = sectionElement.querySelector(".content");
    if(!content.classList.contains("d-none")){
      content.classList.add("d-none");
    }else if (sectionElement && !sectionElement.classList.contains("d-none") && content.classList.contains("d-none")) {
      sectionElement.classList.add("d-none");
      mainMenu.classList.remove("d-none");
      EmptyContent(section);
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
    const response = await fetch(`https://demo-m3u.onrender.com/category/get?type=${category}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    const categoriesContainer = document.querySelector(`#${category} .categories`);
    if (!categoriesContainer) {
      console.error(`No container found for category: ${category}`);
      return;
    }
    categoriesContainer.innerHTML = "";
    data.categories.forEach((categoryItem) => {
      const listItem = document.createElement("li");
      listItem.id = categoryItem._id;
      listItem.tabIndex = 0;
      listItem.innerHTML = `<p class="name">${categoryItem.category}</p>`;
      categoriesContainer.appendChild(listItem);
    });

    enableKeyboardNavigation(categoriesContainer);
  } catch (error) {
    console.error("Error fetching data", error);
  }
}


// Function to enable keyboard navigation when sidebar is enabled
function enableKeyboardNavigation(container) {
  const category = localStorage.getItem("category");
  const listItems = container.querySelectorAll(`#${category} .category-sidebar li`);
  let currentIndex = -1;

  document.addEventListener("keydown", async (event) => {
    // Check if content items are visible
    const contentContainer = document.querySelector(`#${category} .content`);
    const isContentVisible = contentContainer && !contentContainer.classList.contains("d-none");

    // Stop sidebar navigation if content items are opened
    if (isContentVisible) return;

    if (listItems.length === 0) return;

    if (event.key === "ArrowDown") {
      currentIndex = (currentIndex + 1) % listItems.length;
      highlightItem(listItems, currentIndex);
    } else if (event.key === "ArrowUp") {
      currentIndex = (currentIndex - 1 + listItems.length) % listItems.length;
      highlightItem(listItems, currentIndex);
    } else if (event.key === "Enter" && currentIndex !== -1) {
      const selectedItem = listItems[currentIndex];
      selectedItem.classList.add("active");
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
  currentItem.classList.add("active");
  currentItem.scrollIntoView({ behavior: "smooth", block: "center" });
}


// Function to fetch the selected category data By ID
async function fetchDataById(id) {4
  const category = localStorage.getItem("category");
  const displayContainer = document.querySelector(`#${category} .content-data`);
  try {
    const response = await fetch(`https://demo-m3u.onrender.com/playlist/getByCategory/${id}`);
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
