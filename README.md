# Automatic query builder for [Squirdle by Fireblend](https://squirdle.fireblend.com/)

Squirdle supports a [query syntax](https://squirdle.fireblend.com/filters.html) when guessing which can be used to filter results. This bit of JS parses the results so far and automatically produces a query that matches the information revealed by the guesses so far. It then automatically fills the input box with the query. Once filled, select the box and hit space once to pull up the filtered list.


Here it is as a bookmarklet:

```
javascript:(function()%7Bvar%20makequery%20%3D%20()%20%3D%3E%20%7B%0A%20%20const%20max%20%3D%20999999%0A%20%20let%20doc%20%3D%20document%3B%0A%20%20let%20guesses%20%3D%20doc.getElementById(%22guesses%22)%0A%20%20let%20rows%20%3D%20guesses.getElementsByClassName(%22row%20in%22)%0A%0A%20%20let%20heightUpper%20%3D%20max%0A%20%20let%20heightLower%20%3D%200%0A%20%20let%20height%20%3D%20null%0A%20%20let%20weightUpper%20%3D%20max%0A%20%20let%20weightLower%20%3D%200%0A%20%20let%20weight%20%3D%20null%0A%20%20let%20genUpper%20%3D%20max%0A%20%20let%20genLower%20%3D%200%0A%20%20let%20gen%20%3D%20null%0A%20%20let%20type1Not%20%3D%20%7B%7D%0A%20%20let%20type2Not%20%3D%20%7B%7D%0A%20%20let%20type1%20%3D%20null%0A%20%20let%20type2%20%3D%20null%0A%0A%20%20const%20regexGen%20%3D%20%2FGen%3A%20(%5Cd%2B)(Type)%2F%3B%0A%20%20const%20regexType1%20%3D%20%2FType%201%3A%20(%5BA-Za-z%5D%2B)(Type)%2F%3B%0A%20%20const%20regexType2%20%3D%20%2FType%202%3A%20(%5BA-Za-z%5D%2B)(Height)%2F%3B%0A%20%20const%20regexHeight%20%3D%20%2FHeight%3A%20(%5B%5Cd.%5D%2B)(Weight)%2F%3B%0A%20%20const%20regexWeight%20%3D%20%2FWeight%3A%20(%5B%5Cd.%5D%2B)%2F%3B%0A%0A%20%20function%20extractPokeInfoFromText(inputString)%20%7B%0A%0A%20%20%20%20%20%20const%20genMatch%20%3D%20inputString.match(regexGen)%3B%0A%20%20%20%20%20%20const%20type1Match%20%3D%20inputString.match(regexType1)%3B%0A%20%20%20%20%20%20const%20type2Match%20%3D%20inputString.match(regexType2)%3B%0A%20%20%20%20%20%20const%20heightMatch%20%3D%20inputString.match(regexHeight)%3B%0A%20%20%20%20%20%20const%20weightMatch%20%3D%20inputString.match(regexWeight)%3B%0A%0A%20%20%20%20%20%20const%20extractedInfo%20%3D%20%7B%0A%20%20%20%20%20%20%20%20Gen%3A%20Number(genMatch%20%3F%20genMatch%5B1%5D%20%3A%20'')%2C%0A%20%20%20%20%20%20%20%20Type1%3A%20type1Match%20%3F%20type1Match%5B1%5D%20%3A%20''%2C%0A%20%20%20%20%20%20%20%20Type2%3A%20type2Match%20%3F%20type2Match%5B1%5D%20%3A%20''%2C%0A%20%20%20%20%20%20%20%20Height%3A%20Number(heightMatch%20%3F%20heightMatch%5B1%5D%20%3A%20'')%2C%0A%20%20%20%20%20%20%20%20Weight%3A%20Number(weightMatch%20%3F%20weightMatch%5B1%5D%20%3A%20'')%0A%20%20%20%20%20%20%7D%3B%0A%0A%20%20%20%20%20%20return%20extractedInfo%3B%0A%20%20%7D%0A%0A%20%20function%20constraintForColumn(col)%20%7B%0A%20%20%20%20const%20src%20%3D%20col.getElementsByClassName(%22emoji%22)%5B0%5D.src%0A%20%20%20%20const%20spl%20%3D%20src.split(%22%2F%22)%0A%20%20%20%20const%20filename%20%3D%20spl%5Bspl.length%20-%201%5D%0A%20%20%20%20switch%20(filename)%20%7B%0A%20%20%20%20%20%20case%20%22up.png%22%3A%0A%20%20%20%20%20%20%20%20return%20%22up%22%0A%20%20%20%20%20%20%20%20break%0A%20%20%20%20%20%20case%20%22down.png%22%3A%0A%20%20%20%20%20%20%20%20return%20%22down%22%0A%20%20%20%20%20%20%20%20break%0A%20%20%20%20%20%20case%20%22wrong.png%22%3A%0A%20%20%20%20%20%20%20%20return%20%22wrong%22%0A%20%20%20%20%20%20%20%20break%0A%20%20%20%20%20%20case%20%22correct.png%22%3A%0A%20%20%20%20%20%20%20%20return%20%22correct%22%0A%20%20%20%20%20%20%20%20break%0A%20%20%20%20%20%20default%3A%0A%20%20%20%20%20%20%20%20throw%20%22unknown%20filename%20for%20constraint%3A%22%20%2B%20filename%0A%20%20%20%20%7D%0A%20%20%7D%0A%0A%20%20Array.from(rows).forEach((row%2C%20index)%20%3D%3E%20%7B%0A%20%20%20%20if%20(index%20%3D%3D%200)%20%7B%20return%20%7D%0A%0A%20%20%20%20let%20pokeInfo%20%3D%20extractPokeInfoFromText(row.getElementsByClassName(%22tooltiptext%22)%5B0%5D.textContent)%0A%0A%20%20%20%20console.log(%60Extracted%20info%20from%20row%20%24%7Bindex%7D%20tooltip%3A%60%2C%20pokeInfo)%0A%0A%20%20%20%20let%20cols%20%3D%20row.getElementsByClassName(%22column%22)%0A%20%20%20%20switch%20(constraintForColumn(cols%5B0%5D))%20%7B%0A%20%20%20%20%20%20case%20%22correct%22%3A%0A%20%20%20%20%20%20%20%20gen%20%3D%20pokeInfo.Gen%0A%20%20%20%20%20%20%20%20break%3B%0A%20%20%20%20%20%20case%20%22up%22%3A%0A%20%20%20%20%20%20%20%20if%20(pokeInfo.Gen%20%3E%20genLower)%20%7B%20genLower%20%3D%20pokeInfo.Gen%20%7D%0A%20%20%20%20%20%20%20%20break%0A%20%20%20%20%20%20case%20%22down%22%3A%0A%20%20%20%20%20%20%20%20if%20(pokeInfo.Gen%20%3C%20genUpper)%20%7B%20genUpper%20%3D%20pokeInfo.Gen%20%7D%0A%20%20%20%20%20%20%20%20break%0A%20%20%20%20%7D%0A%20%20%20%20switch%20(constraintForColumn(cols%5B1%5D))%20%7B%0A%20%20%20%20%20%20case%20%22correct%22%3A%0A%20%20%20%20%20%20%20%20if%20(type1%20%3D%3D%20null)%20%7B%20type1%20%3D%20pokeInfo.Type1%20%7D%0A%20%20%20%20%20%20%20%20break%3B%0A%20%20%20%20%20%20case%20%22wrong%22%3A%0A%20%20%20%20%20%20%20%20type1Not%5BpokeInfo.Type1%5D%20%3D%20null%0A%20%20%20%20%20%20%20%20break%0A%20%20%20%20%7D%0A%20%20%20%20switch%20(constraintForColumn(cols%5B2%5D))%20%7B%0A%20%20%20%20%20%20case%20%22correct%22%3A%0A%20%20%20%20%20%20%20%20if%20(type2%20%3D%3D%20null)%20%7B%20type2%20%3D%20pokeInfo.Type2%20%7D%0A%20%20%20%20%20%20%20%20break%3B%0A%20%20%20%20%20%20case%20%22wrong%22%3A%0A%20%20%20%20%20%20%20%20type1Not%5BpokeInfo.Type2%5D%20%3D%20null%0A%20%20%20%20%20%20%20%20break%0A%20%20%20%20%7D%0A%20%20%20%20switch%20(constraintForColumn(cols%5B3%5D))%20%7B%0A%20%20%20%20%20%20case%20%22correct%22%3A%0A%20%20%20%20%20%20%20%20height%20%3D%20pokeInfo.Height%0A%20%20%20%20%20%20%20%20break%3B%0A%20%20%20%20%20%20case%20%22up%22%3A%0A%20%20%20%20%20%20%20%20if%20(pokeInfo.Height%20%3E%20heightLower)%20%7B%20heightLower%20%3D%20pokeInfo.Height%20%7D%0A%20%20%20%20%20%20%20%20break%0A%20%20%20%20%20%20case%20%22down%22%3A%0A%20%20%20%20%20%20%20%20if%20(pokeInfo.Height%20%3C%20heightUpper)%20%7B%20heightUpper%20%3D%20pokeInfo.Height%20%7D%0A%20%20%20%20%20%20%20%20break%0A%20%20%20%20%7D%0A%20%20%20%20switch%20(constraintForColumn(cols%5B4%5D))%20%7B%0A%20%20%20%20%20%20case%20%22correct%22%3A%0A%20%20%20%20%20%20%20%20weight%20%3D%20pokeInfo.Weight%0A%20%20%20%20%20%20%20%20break%3B%0A%20%20%20%20%20%20case%20%22up%22%3A%0A%20%20%20%20%20%20%20%20if%20(pokeInfo.Weight%20%3E%20weightLower)%20%7B%20weightLower%20%3D%20pokeInfo.Weight%20%7D%0A%20%20%20%20%20%20%20%20break%0A%20%20%20%20%20%20case%20%22down%22%3A%0A%20%20%20%20%20%20%20%20if%20(pokeInfo.Weight%20%3C%20weightUpper)%20%7B%20weightUpper%20%3D%20pokeInfo.Weight%20%7D%0A%20%20%20%20%20%20%20%20break%0A%20%20%20%20%7D%0A%20%20%7D)%0A%0A%20%20%20%20let%20queryStr%20%3D%20%22%22%0A%0A%20%20%20%20if%20(gen%20!%3D%20null)%20%7B%20queryStr%20%2B%3D%20%60gen%3A%24%7Bgen%7D%20%60%20%7D%0A%20%20%20%20else%20if%20(genLower%20%3E%200)%20%7B%20queryStr%20%2B%3D%20%60gen%3E%24%7BgenLower%7D%20%60%20%7D%0A%20%20%20%20else%20if%20(genUpper%20%3C%20max)%20%7B%20queryStr%20%2B%3D%20%60gen%3C%24%7BgenUpper%7D%20%60%20%7D%0A%0A%20%20%20%20if%20(height%20!%3D%20null)%20%7B%20queryStr%20%2B%3D%20%60height%3A%24%7Bheight%7D%20%60%20%7D%0A%20%20%20%20else%20if%20(heightLower%20%3E%200)%20%7B%20queryStr%20%2B%3D%20%60height%3E%24%7BheightLower%7D%20%60%20%7D%0A%20%20%20%20else%20if%20(heightUpper%20%3C%20max)%20%7B%20queryStr%20%2B%3D%20%60height%3C%24%7BheightUpper%7D%20%60%20%7D%0A%0A%20%20%20%20if%20(weight%20!%3D%20null)%20%7B%20queryStr%20%2B%3D%20%60weight%3A%24%7Bweight%7D%20%60%20%7D%0A%20%20%20%20else%20if%20(weightLower%20%3E%200)%20%7B%20queryStr%20%2B%3D%20%60weight%3E%24%7BweightLower%7D%20%60%20%7D%0A%20%20%20%20else%20if%20(weightUpper%20%3C%20max)%20%7B%20queryStr%20%2B%3D%20%60weight%3C%24%7BweightUpper%7D%20%60%20%7D%0A%0A%20%20%20%20if%20(type1%20!%3D%20null)%20%7B%0A%20%20%20%20%20%20queryStr%20%2B%3D%20%60type1%3A%24%7Btype1%7D%20%60%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20Object.keys(type1Not).forEach((t)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20queryStr%20%2B%3D%20%60type1!%24%7Bt%7D%20%60%0A%20%20%20%20%20%20%7D)%0A%20%20%20%20%7D%0A%20%20%20%20if%20(type2%20!%3D%20null)%20%7B%0A%20%20%20%20%20%20queryStr%20%2B%3D%20%60type2%3A%24%7Btype2%7D%20%60%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20Object.keys(type2Not).forEach((t)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20queryStr%20%2B%3D%20%60type2!%24%7Bt%7D%20%60%0A%20%20%20%20%20%20%7D)%0A%20%20%20%20%7D%0A%20%20%20%20console.log(%22Query%20string%20from%20results%3A%22%2C%20queryStr)%0A%0A%20%20%20%20document.getElementById(%22guess%22).value%20%3D%20queryStr%0A%7D%0A%0Amakequery()%7D)()%3B
```

Make a new bookmark with the entire `javascript:` bit of text as the link. Once on the Squirdle page just click the "bookmark" and watch the magic.

If you'd rather not use a bookmarklet, you can copy-paste the whole JS file into your browser console and then hit enter.

Yes, this avoids the spirit of guessing games like this. Don't use it if you don't want to!
