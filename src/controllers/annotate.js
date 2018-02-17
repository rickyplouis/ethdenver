/**
 * Get all elements with highlightedText class
 * and set background-color to be none as well as remove
 * the class attached
 */
export function removeHighlight(){
  var highlights = document.getElementsByClassName("highlightedText")
  Array.prototype.map.call(highlights, function(highlight){
    highlight.setAttribute(
      'style',
      'background-color: none; display: inline;'
    )
    highlight.removeAttribute('class')
  })
}

export function removePopup(){
  let element = document.getElementsByClassName("popup")[0];
  let text = document.getElementsByClassName("popuptext")[0]
  if (element && text){
    element.outerHTML = "";
    text.outerHTML = ""
    //delete text
    //delete element;
  }
}

/**
 * Create div with highlightedText class
 * to wrap user selection range
 * @param {Range}
 */
function highlightRange(range) {
  var newNode = makeElement("div")
  newNode.setAttribute(
    "class",
    "highlightedText"
  )
  newNode.setAttribute(
     "style",
     "background-color: yellow; display: inline;"
  );
  range.surroundContents(newNode);
}

/**
 * Starts at bottom of dom tree and creates an array of parentNodes
 * until it reaches the commonContainer
 * @param {Node} container - A Node to begin the traversal
 * @param {Node} commonContainer - The base node to finish traversing at
 * @param {Array} reversedTree - Array of nodes set into a tree
*/

function treeReversal(container, commonContainer, reversedTree){
  return container != commonContainer ?
    treeReversal(container.parentNode, commonContainer, reversedTree.concat(container)) : reversedTree;
}


function getSafeRanges(userRange) {
  var commonContainer = userRange.commonAncestorContainer;
  // Starts -- Work inward from the start, selecting the largest safe range
  var beginRanges = new Array(0),
      sortedBegin = new Array(0);
  if (userRange.startContainer != commonContainer){
    beginRanges = treeReversal(userRange.startContainer, commonContainer, [])
  }
  if (0 < beginRanges.length){
    for(var i = 0; i < beginRanges.length; i++) {
      var currNode = beginRanges[i],
          currRange = document.createRange();

      if (i === 0){
        currRange.setStart(currNode, userRange.startOffset);
        currRange.setEndAfter( (currNode.nodeType == Node.TEXT_NODE) ? currNode : currNode.lastChild);
      }
      else {
        currRange.setStartAfter(beginRanges[i-1]);
        currRange.setEndAfter(currNode.lastChild);
      }
      sortedBegin.push(currRange);
    }
  }

  // Ends -- basically the same code reversed
  var endRanges = new Array(0),
      sortedEnd = new Array(0);

  if (userRange.endContainer != commonContainer){
    endRanges = treeReversal(userRange.endContainer, commonContainer, [])
  }

  if (0 < endRanges.length){
    for(var i = 0; i < endRanges.length; i++) {
        var currentNode = endRanges[i],
            currentRange = document.createRange()

        if (i === 0) {
          currentRange.setStartBefore( (currentNode.nodeType == Node.TEXT_NODE) ? currentNode : currentNode.firstChild );
          currentRange.setEnd(currentNode, userRange.endOffset);
        } else {
          currentRange.setStartBefore(currentNode.firstChild);
          currentRange.setEndBefore(endRanges[i-1]);
        }
        sortedEnd.unshift(currentRange);
    }
  }
  // Middle -- the uncaptured middle
  if ((0 < beginRanges.length) && (0 < endRanges.length)) {
      var midRanges = document.createRange();
      midRanges.setStartAfter(beginRanges[beginRanges.length - 1]);
      midRanges.setEndBefore(endRanges[endRanges.length - 1]);
  }
  else {
      return [userRange];
  }

  return sortedBegin.concat(midRanges, sortedEnd)
}

/**
 * Create Element helper function
 * @param {string} tagName - Name of element to create
 * @param {string} text - Text to put inside of element
 * @return {Element}
 */
function makeElement(tagName, text){
  var element = document.createElement(tagName)
  if (text){
    element.innerHTML = text
  }
  return element
}


function applyHighlights (userSelection){
  return new Promise(function(resolve, reject) {
    var safeRanges = getSafeRanges(userSelection)
    var safeHighlights = safeRanges.map( function(range) {highlightRange(range)})
    return safeHighlights.length > 0 ? resolve(safeHighlights) : reject([])
  });
}

function makeButton(buttonText, id){
  var button = makeElement('button', buttonText)
  button.setAttribute('id', id)
  return button
}


function addPopup(container){
  var popup = makeElement("span")
  var popuptext = makeElement("span", "Annotation:")
  var userInput = makeElement("textarea", "Enter annotation")
  userInput.setAttribute('id', 'userInput')
  popup.classList.add('popup');
  popuptext.classList.add("popuptext", "show")
  popuptext.append(userInput)
  popuptext.append(makeButton('Submit Annotation', 'submitAnnotation'))
  popuptext.append(makeButton('Cancel', 'cancel'))
  popup.append(popuptext)
  container.append(popup)
}

/**
 * Apply highlights to the user selected text
 * @param {Range}
 */
export function highlightSelection(userSelection) {
  applyHighlights(userSelection).then(function(){
    addPopup(document.getElementsByClassName("highlightedText")[0])
  })
}
