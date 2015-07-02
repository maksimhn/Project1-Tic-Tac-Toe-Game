function cellValue(key) {
  switch(key) {
    case 'a': return null;
    case 'b': return null;
    case 'c': return null;
    case 'd': return null;
    case 'e': return null;
    case 'f': return null;
    case 'g': return null;
    case 'h': return null;
    case 'i': return null;
    default : return null;
  }
}


function getWinner() {
  if (isWinnerX()) {
    return 'x';
  }
  if (isWinnerO()) {
    return 'o';
  }
  return null;
}

function isWinnerX() {
  return winsRowX() || winsColumnX() || winsDiagonalX();
}

function winsRowX() {
  return allThreeX(cells('a'), cells('b'), cells('c')) ||
         allThreeX(cells('d'), cells('e'), cells('f')) ||
         allThreeX(cells('g'), cells('h'), cells('i'));
}

function winsColumnX() {
  return allThreeX(cells('a'), cells('d'), cells('g')) ||
         allThreeX(cells('b'), cells('e'), cells('h')) ||
         allThreeX(cells('c'), cells('f'), cells('i'));
}

function winsDiagonalX() {
  return allThreeX(cells('a'), cells('e'), cells('i')) ||
         allThreeX(cells('c'), cells('e'), cells('g'));
}

function allThreeX(cellOne, cellTwo, cellThree) {
}
