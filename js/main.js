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




  var lastCategoryClicked = 0
  localStorage.setItem("lastCategoryClicked", 0)
// Adding event listeners for key events
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".buttons button");
  const mainMenu = document.querySelector("#main-menu");
  let currentIndex = 0;
  let contentDataIndex = -1;
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
  const contentArea = document.querySelector(`#${category} .content`)
    const contentDataItems = document.querySelectorAll(".content-data .item");
    const categoryListItems = document.querySelectorAll(
      `#${category} .category-sidebar li`
    );
    if (
      [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Enter",
        "Escape",
      ].includes(e.key)
    ) {
      const activeButton = document.querySelector(
        "#main-menu .buttons button.active"
      );
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
            if (contentDataIndex % itemsPerRow === 0) {
              document.querySelector(`#${category} .content`).classList.add("d-none");
              document
                .querySelector(`#${category} .categories`)
                .classList.remove("d-none");
                contentDataIndex = -1;

              if (categoryListItems.length > 0) {
                highlightItem(categoryListItems, localStorage.getItem("lastCategoryClicked"));
                const categoriesContainer = document.querySelector(
                  `#${category} .categories`
                );
                // enableKeyboardNavigation(categoriesContainer);
              }
            } else {
              contentDataIndex =
                (contentDataIndex - 1 + contentDataItems.length) %
                contentDataItems.length;
              highlightItem(contentDataItems, contentDataIndex);
            }
          }
          break;
        

        case "ArrowRight":
          console.log()
          if (!mainMenu.classList.contains("d-none")) {
            currentIndex = (currentIndex + 1) % buttons.length;
            
          } else {
            contentDataIndex = (contentDataIndex + 1) % contentDataItems.length;
            highlightItem(contentDataItems, contentDataIndex);
            highlightItem(categoryListItems, localStorage.getItem("lastCategoryClicked"));
          }
          break;

        case "ArrowUp":
          if (mainMenu.classList.contains("d-none") && !contentArea.classList.contains("d-none")) {
            if (contentDataIndex - itemsPerRow >= 0) {
              contentDataIndex -= itemsPerRow;
            }
            highlightItem(contentDataItems, contentDataIndex);
          }
          break;

        case "ArrowDown":
          if (mainMenu.classList.contains("d-none") && !contentArea.classList.contains("d-none")) {
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
  const contentDataContainer = document.querySelector(`#${category} .content`);
  contentDataContainer.classList.contains("d-none");
  if (category) {
    switch (category) {
      case "Series":
        if (mainMenu) mainMenu.classList.add("d-none");
        document.getElementById(category).classList.remove("d-none");
          if(contentDataContainer.classList.contains("d-none") === true) {
            fetchCurrentCategories();
          }else if(contentDataContainer.classList.contains("d-none") === false){
            return
          }
      case "Movie":
        if (mainMenu) mainMenu.classList.add("d-none");
        document.getElementById(category).classList.remove("d-none");
        if(contentDataContainer.classList.contains("d-none") === true) {
          fetchCurrentCategories();
        }else if(contentDataContainer.classList.contains("d-none") === false){
          return
        }
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

function handleEscapeKey(mainMenu) {
  const sections = ["Series", "Movie"];
  for (const section of sections) {
    const sectionElement = document.getElementById(section);
     if (sectionElement && !sectionElement.classList.contains("d-none")) {
      sectionElement.classList.add("d-none");
      mainMenu.classList.remove("d-none");
      EmptyContent(section);
      localStorage.setItem("lastCategoryClicked" , 0)
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
    var firstItemId
    data.categories.forEach((categoryItem, index) => {
      const listItem = document.createElement("li");
      listItem.id = categoryItem._id;
      listItem.tabIndex = 0;
      listItem.innerHTML = `<p class=\"name\">${categoryItem.category}</p>`;
      if (index === Number(localStorage.getItem("lastCategoryClicked"))){
        listItem.classList.add("active");
        firstItemId = listItem.id;
      } // Default active item
      categoriesContainer.appendChild(listItem);
    });
    await fetchDataById(firstItemId);

    enableKeyboardNavigation(categoriesContainer);
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
        console.log("Returning")
      return;
    }

    if (listItems.length === 0) return;

    if (event.key === "ArrowDown" && contentContainer.classList.contains("d-none")) {
      currentIndex = (currentIndex + 1) % listItems.length;
      localStorage.setItem("lastCategoryClicked", currentIndex)
      highlightItem(listItems, currentIndex);
    } else if (event.key === "ArrowUp" && contentContainer.classList.contains("d-none")) {
      currentIndex = (currentIndex - 1 + listItems.length) % listItems.length;
      localStorage.setItem("lastCategoryClicked", currentIndex)
      highlightItem(listItems, currentIndex);
    } else if (event.key === "Enter" && currentIndex !== -1) {
      const selectedItem = listItems[currentIndex];
      lastCategoryClicked = currentIndex
      localStorage.setItem("lastCategoryClicked", currentIndex)
      highlightItem(listItems, currentIndex)
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
