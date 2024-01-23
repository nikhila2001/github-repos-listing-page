document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "https://api.github.com/users/";
  let currentPage = 1;
  let perPage = 10;

  // function to fetch user information
  async function fetchUserInfo(username) {
    try {
      const response = await fetch(`${apiUrl}${username}`);
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.log("Error fetching using data", error);
      return {};
    }
  }
  // function to display user info
  async function displayUserInfo(username) {
    const userData = await fetchUserInfo(username);
    // update avatar image source
    const avatarImg = document.getElementById("avatar");
    avatarImg.src = userData.avatar_url;
    // update username 
    const user = document.getElementById("user");
    user.innerHTML = `${userData.name}`;
    // update bio
    const userbio = document.getElementById("bio");
    userbio.innerHTML = `bio - ${userData.bio}`;
    // update location
    const userLocation = document.getElementById("location");
    userLocation.innerHTML = `<i class="bi bi-geo-alt-fill"></i> ${userData.location}`;
    // update no. of public repos
    const repos = document.getElementById("publicRepos");
    repos.innerHTML = `<i class="bi bi-database ms-4"></i> public Repos  ${userData.public_repos}`
    // update website link href
    const websiteLink = document.getElementById("websiteLink");
    websiteLink.textContent = `${userData.blog}`;
    // update twitter link
    const gitLink = document.getElementById("twitterLink");
    gitLink.innerHTML = `<i class="bi bi-twitter text-dark ms-4"></i> ${userData.twitter_username}`;

    // document.getElementById("userInfo").style.display = "block";
  }

  // function to fetch repositories based on the username
  async function fetchRepositories(username, page = 1) {
    try {
      const response = await fetch(
        `${apiUrl}${username}/repos?page=${page}&per_page=${perPage}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error fetching data:", error);
      return [];
    }
  }

  // function to display repositories
  function displayRepositories(repositories) {
    const repoContainer = document.getElementById("results");
    repoContainer.classList.add("row","row-cols-1","row-cols-md-2","my-1")
    repoContainer.innerHTML = ""; // clear existing content
     
    if (Array.isArray(repositories)) {
      
      repositories.forEach((repo) => {
        // Number of repos
       const repoCol = document.createElement("div");
       repoCol.classList.add("col","mb-1", "border","p-2","repo-col")
        repoCol.innerHTML = `
        <h3 class="fw-bold">${repo.name}</h3>
        <p style="color:#DAD7CD">${repo.description || "No description"}</p>
        `;
        // create a div to hold the badges
        const badgesContainer = document.createElement("div");
        badgesContainer.classList.add("d-inline-flex","flex-wrap","gap-2");
        // loop through repo.topics and create badges
        repo.topics.forEach((topic) => {
          const badge = document.createElement("span");
          badge.classList.add("badge","badge-color")
          badge.textContent = topic;
          badgesContainer.appendChild(badge);
        });
        repoCol.appendChild(badgesContainer);

      // create a span to hold github link
      const linkContainer = document.createElement("a");
      linkContainer.innerHTML = `<a href=${repo.html_url} class="text-dark ms-2 "><i class="bi bi-github"> Repo link</i></a>`;
      repoCol.appendChild(linkContainer);
    
      repoContainer.appendChild(repoCol);
      });
    } else if (repositories.length === 0){
      repoCol.innerHTML = `<h4>Finish</h4>`
    } 
    else {
      console.error("Invalid data format:", repositories);
    }
  }
  
  // function to show a message
  function showMessage(message) {
    const messageContainer = document.getElementById("message");
    messageContainer.innerText = message;
  }

  // function to handle search
  async function handleSearch(e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    if (!username) {
      console.error("userName is empty");
      alert("username is empty");
      return;
    }
    currentPage = 1;
    try {
      await displayUserInfo(username);
      const repositories = await fetchRepositories(username, currentPage);
      displayRepositories(repositories);
    } catch (error) {
      console.error("Error handling search:", error);
    }

    // document.getElementById("username").value = "";
  }

  // handle pagination 
  async function handlePagination(direction) {
    if(direction === "prev" && currentPage > 1) {
      currentPage--;
    } else if (direction === "next") {
      currentPage++;
    } 
    
    const username = document.getElementById("username").value.trim();
        if (!username) {
            console.error("Username is empty");
            alert("Username is empty");
            return;
        }

        try {
            const repositories = await fetchRepositories(username, currentPage);
            displayRepositories(repositories);
            // check if there is no repository left
            if(repositories.length === 0 && direction === "next") {
              showMessage("you have reached the last page of repositories.")
            } else {
              // clear the message if not on last page
              showMessage("");
            }
        } catch (error) {
            console.error("Error handling pagination:", error);
        }
  }
  // set up event listeners
  document
    .getElementById("searchButton")
    .addEventListener("click", handleSearch);
  // event listeners for pagination buttons
  document
  .getElementById("prevButton")
  .addEventListener("click", () => handlePagination("prev"));
  
  document
  .getElementById("nextButton")
  .addEventListener("click", () => handlePagination("next"));
});
