const fruits = ["Watermelon", "Apple", "Strawberry", "Banana", "Cherry"];
fruits.sort();

for (let i = 0; i < fruits.length; i++) {
    document.getElementById("fruit-list").innerHTML += "<li>" + fruits[i] + "</li>";
}

const myImages = [
    "https://picsum.photos/id/11/800/600",
    "https://picsum.photos/id/12/800/600",
    "https://picsum.photos/id/13/800/600",
    "https://picsum.photos/id/14/800/600",
    "https://picsum.photos/id/15/800/600"
];

for (let i = 0; i < myImages.length; i++) {
    document.getElementById("image-gallery").innerHTML += 
        "<a href='" + myImages[i] + "' target='_blank'>" +
        "<img src='" + myImages[i] + "'>" +
        "</a>";
}

const myLinks = [
    ["Google", "https://google.com"],
    ["GitHub", "https://github.com"],
    ["YouTube", "https://youtube.com"],
    ["Canvas", "https://instructure.com"]
];

for (let i = 0; i < myLinks.length; i++) {
    document.getElementById("menu-links").innerHTML += 
        "<a href='" + myLinks[i][1] + "'>" + myLinks[i][0] + "</a>";
}
