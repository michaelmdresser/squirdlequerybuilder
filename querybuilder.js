// https://squirdle.fireblend.com/#

var makequery = () => {
  const max = 999999
  let doc = document;
  let guesses = doc.getElementById("guesses")
  let rows = guesses.getElementsByClassName("row in")

  let heightUpper = max
  let heightLower = 0
  let height = null
  let weightUpper = max
  let weightLower = 0
  let weight = null
  let genUpper = max
  let genLower = 0
  let gen = null
  let type1Not = {}
  let type2Not = {}
  let type1 = null
  let type2 = null

  const regexGen = /Gen: (\d+)(Type)/;
  const regexType1 = /Type 1: ([A-Za-z]+)(Type)/;
  const regexType2 = /Type 2: ([A-Za-z]+)(Height)/;
  const regexHeight = /Height: ([\d.]+)(Weight)/;
  const regexWeight = /Weight: ([\d.]+)/;

  function extractPokeInfoFromText(inputString) {

      const genMatch = inputString.match(regexGen);
      const type1Match = inputString.match(regexType1);
      const type2Match = inputString.match(regexType2);
      const heightMatch = inputString.match(regexHeight);
      const weightMatch = inputString.match(regexWeight);

      const extractedInfo = {
        Gen: Number(genMatch ? genMatch[1] : ''),
        Type1: type1Match ? type1Match[1] : '',
        Type2: type2Match ? type2Match[1] : '',
        Height: Number(heightMatch ? heightMatch[1] : ''),
        Weight: Number(weightMatch ? weightMatch[1] : '')
      };

      return extractedInfo;
  }

  function constraintForColumn(col) {
    const src = col.getElementsByClassName("emoji")[0].src
    const spl = src.split("/")
    const filename = spl[spl.length - 1]
    switch (filename) {
      case "up.png":
        return "up"
        break
      case "down.png":
        return "down"
        break
      case "wrong.png":
        return "wrong"
        break
      case "correct.png":
        return "correct"
        break
      default:
        throw "unknown filename for constraint:" + filename
    }
  }

  Array.from(rows).forEach((row, index) => {
    if (index == 0) { return }

    let pokeInfo = extractPokeInfoFromText(row.getElementsByClassName("tooltiptext")[0].textContent)

    console.log(`Extracted info from row ${index} tooltip:`, pokeInfo)

    let cols = row.getElementsByClassName("column")
    switch (constraintForColumn(cols[0])) {
      case "correct":
        gen = pokeInfo.Gen
        break;
      case "up":
        if (pokeInfo.Gen > genLower) { genLower = pokeInfo.Gen }
        break
      case "down":
        if (pokeInfo.Gen < genUpper) { genUpper = pokeInfo.Gen }
        break
    }
    switch (constraintForColumn(cols[1])) {
      case "correct":
        if (type1 == null) { type1 = pokeInfo.Type1 }
        break;
      case "wrong":
        type1Not[pokeInfo.Type1] = null
        break
    }
    switch (constraintForColumn(cols[2])) {
      case "correct":
        if (type2 == null) { type2 = pokeInfo.Type2 }
        break;
      case "wrong":
        type1Not[pokeInfo.Type2] = null
        break
    }
    switch (constraintForColumn(cols[3])) {
      case "correct":
        height = pokeInfo.Height
        break;
      case "up":
        if (pokeInfo.Height > heightLower) { heightLower = pokeInfo.Height }
        break
      case "down":
        if (pokeInfo.Height < heightUpper) { heightUpper = pokeInfo.Height }
        break
    }
    switch (constraintForColumn(cols[4])) {
      case "correct":
        weight = pokeInfo.Weight
        break;
      case "up":
        if (pokeInfo.Weight > weightLower) { weightLower = pokeInfo.Weight }
        break
      case "down":
        if (pokeInfo.Weight < weightUpper) { weightUpper = pokeInfo.Weight }
        break
    }
  })

    let queryStr = ""

    if (gen != null) { queryStr += `gen:${gen} ` }
    else if (genLower > 0) { queryStr += `gen>${genLower} ` }
    else if (genUpper < max) { queryStr += `gen<${genUpper} ` }

    if (height != null) { queryStr += `height:${height} ` }
    else if (heightLower > 0) { queryStr += `height>${heightLower} ` }
    else if (heightUpper < max) { queryStr += `height<${heightUpper} ` }

    if (weight != null) { queryStr += `weight:${weight} ` }
    else if (weightLower > 0) { queryStr += `weight>${weightLower} ` }
    else if (weightUpper < max) { queryStr += `weight<${weightUpper} ` }

    if (type1 != null) {
      queryStr += `type1:${type1} `
    } else {
      Object.keys(type1Not).forEach((t) => {
        queryStr += `type1!${t} `
      })
    }
    if (type2 != null) {
      queryStr += `type2:${type2} `
    } else {
      Object.keys(type2Not).forEach((t) => {
        queryStr += `type2!${t} `
      })
    }
    console.log("Query string from results:", queryStr)

    document.getElementById("guess").value = queryStr
}

makequery()
