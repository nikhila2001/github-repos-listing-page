document.addEventListener("DOMContentLoaded", function ()  {
const apiUrl = "https://api.github.com/users/";
let currentPage = 1;
let perPage = 10;

// function to fetch repositories based on the username 
async function fetchRepositories(username, page=1) {
    try {
        const response = await fetch(`${apiUrl}${username}/repos?page=${page}&per_page=${perPage}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error fetching data:", error);
        return [];
    }
}

// function to display repositories
function displayRepositories(repositories) {
    const container = document.getElementById("wrapper");
    container.innerHTML = " ";

   repositories.forEach(repo => {
    const reposDiv = document.createElement("div");
    reposDiv.innerHTML = `<h3>${repo.name}</h3><p>${repo.description || "No description"}</p><h4>${repo.topics}</h4><a href=${repo.deployments_url}>`;
    container.appendChild(reposDiv);
   });
}




// function to handle search
async function handleSearch() {
    const username = document.getElementById("username").value;
    currentPage = 1;
    const repositories = await fetchRepositories(username, currentPage);
    displayRepositories(repositories);
    
}

// set up event listeners
document.getElementById("searchButton").addEventListener("click", handleSearch);
});