
borderInfoArray = [
    {
        borderSize: 3,
        borderColor: "red",
    },
    {
        borderSize: 3,
        borderColor: "orange",
    },
    {
        borderSize: 3,
        borderColor: "orange",
    },
    {
        borderSize: 3,
        borderColor: "orange",
    },
    {
        borderSize: 3,
        borderColor: "orange",
    }
]
fancyBorder("main-top-container", borderInfoArray)

function fancyBorder(id, borderInfoArray) {
    var element = document.getElementById(id);
    var parent = element.parentElement; // todo: if parent is body, then create a div and append it to body
    parent.removeChild(element);
    

    var border = document.createElement("div");
    parent.appendChild(border);

    if (borderInfoArray != null) {
        for (borderInfo of borderInfoArray) {
            var newBoarder = document.createElement("div");
            newBoarder.style.border = borderInfo.borderSize + "px solid " + borderInfo.borderColor;
            border.appendChild(newBoarder);
            border = newBoarder;
        }
    }

    border.appendChild(element);

    // parent
    //   border
    //     border
    //       element
}