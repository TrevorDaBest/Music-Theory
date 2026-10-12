//Get HTML5 elements
const findScales = document.getElementById("find");
const practiceScales = document.getElementById("practice");

//Detect Clicks
findScales.addEventListener('click', (e) => {
    window.location.href = "html/find-scales.html"; //Open Find Scales
});

practiceScales.addEventListener('click', (e) => {
    window.location.href = "html/practice-scales.html"; //Open Practice Scales
});