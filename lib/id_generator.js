function getDigit(e, t, n, r, i, s, o, u, a, f, l, c) {
  sum = e * 13 + t * 12 + n * 11 + r * 10 + i * 9 + s * 8 + o * 7 + u * 6 + a * 5 + f * 4 + l * 3 + c * 2;
  sum = sum % 11;
  if (sum <= 1) {
      return 1 - sum
  } else {
      return 11 - sum
  }
}

function getRandomInt(min,max) {
  //return Math.floor(Math.random() * Math.floor(max));
  return Math.floor(Math.random() * (max-min) + min);
}

module.exports = {
  id: function(){
    //id1 = getRandomInt(1, 8); 
    id1 = 8; //คนต่างด้าวที่รับสัญชาติไทยแล้ว
    id2 = getRandomInt(1, 9);
    id3 = 0;
    if (id2 == 1) {
        id3 = getRandomInt(0, 9)
    } else if (id2 == 2) {
        id3 = getRandomInt(0, 7)
    } else if (id2 == 3) {
        id3 = getRandomInt(0, 9)
    } else if (id2 == 4) {
        id3 = getRandomInt(0, 9)
    } else if (id2 == 5) {
        id3 = getRandomInt(0, 8)
    } else if (id2 == 6) {
        id3 = getRandomInt(0, 7)
    } else if (id2 == 7) {
        id3 = getRandomInt(0, 7)
    } else if (id2 == 8) {
        id3 = getRandomInt(0, 6)
    } else if (id2 == 9) {
        id3 = getRandomInt(0, 6)
    } else {
      id3 = getRandomInt(0, 9);
    }

    id4 = 0;
    id5 = getRandomInt(1, 5);
    id6 = 0;
    id7 = getRandomInt(1, 9);
    id8 = getRandomInt(0, 9);
    id9 = getRandomInt(0, 9);
    id10 = getRandomInt(0, 9);
    id11 = getRandomInt(0, 9);
    id12 = getRandomInt(1, 9);
    id13 = getDigit(id1, id2, id3, id4, id5, id6, id7, id8, id9, id10, id11, id12);

    return id1 + "" + id2 + "" + id3 + "" + id4 + "" + id5 + "" + id6 + "" + id7 + "" + id8 + "" + id9 + "" + id10 + "" + id11 + "" + id12 + "" + id13;
  }
}